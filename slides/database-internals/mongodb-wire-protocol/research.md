# MongoDB Wire Protocol Research

Audience: database engineers, driver/tool authors, platform engineers, and product strategists evaluating MongoDB-compatible systems.

Practical anchors:

1. A driver `find()` call that becomes a BSON command document inside `OP_MSG`, receives a cursor-bearing reply, and may issue `getMore` round trips.
2. A MongoDB-compatible system such as Amazon DocumentDB, FerretDB, Cosmos DB for MongoDB, Microsoft DocumentDB, or Percona Server for MongoDB that must satisfy driver expectations without necessarily sharing MongoDB internals.

Core frame: the wire protocol is MongoDB's northbound language boundary. It specifies how drivers and servers exchange messages, but production compatibility requires three contracts: wire framing, command/API coverage, and semantic fidelity.

## Wire Protocol Mechanics

Source ids: `mongodb-wire-protocol`, `bson-spec`, `mongodb-bson-types`, `spec-op-msg`

Before-state:

- Developers call driver methods and may assume drivers send language-level method calls or JSON strings.
- Compatibility discussions often blur byte-level protocol support with full MongoDB behavior.

After-state:

- The learner can identify the 16-byte message header, opcode, request/reply correlation, BSON payload, and OP_MSG section structure that actually travel over TCP.

Mechanisms and flows:

- Every MongoDB wire message begins with `MsgHeader`: `messageLength`, `requestID`, `responseTo`, and `opCode`.
- All integers in the wire protocol use little-endian byte order.
- BSON provides typed command and reply documents, including MongoDB-specific types such as ObjectId, dates, binary values, Decimal128, timestamps, and regular expressions.
- Modern command traffic uses `OP_MSG`. Section kind 0 carries a single BSON command body, and section kind 1 can carry a document sequence for bulk payloads.

Implementation implications:

- Proxies and compatible servers must parse message lengths defensively, correlate request and response ids, decode BSON accurately, and preserve command field semantics.
- BSON compatibility includes type ordering, binary subtype handling, numeric precision, date/timestamp behavior, and error document shape.

Version-sensitive areas:

- `OP_MSG` was introduced for MongoDB 3.6 and requires compatible wire versions. Older opcode behavior remains important for historical compatibility but is deprecated in favor of command transport.

## Protocol Evolution And Legacy Opcodes

Source ids: `mongodb-wire-protocol`, `spec-op-msg`, `spec-crud`

Before-state:

- Legacy opcodes such as `OP_QUERY`, `OP_INSERT`, `OP_UPDATE`, `OP_DELETE`, `OP_GET_MORE`, and `OP_KILL_CURSORS` encoded database operations in operation-specific message bodies.

After-state:

- Modern MongoDB uses command documents as the extensible center of protocol evolution, carried by `OP_MSG`.

Mechanisms and flows:

- Legacy operation-specific opcodes made it harder to add sessions, transactions, retryable writes, read concern, write concern, API versioning, and command-specific options consistently.
- Before OP_MSG, command documents could be sent through `$cmd` namespaces using `OP_QUERY`.
- With OP_MSG, the command document itself is the primary payload and replies are command-style documents.

Implementation implications:

- Driver and server compatibility depends on command coverage and option semantics more than legacy opcode parsing.
- Compatible systems must understand the command document grammar and error semantics, not only byte framing.

## Handshake, Wire Versions, Compression, And Auth

Source ids: `spec-handshake`, `spec-sdam`, `mongodb-hello`, `spec-compression`, `mongodb-auth-scram`

Before-state:

- A connection can appear successful even though the driver has not yet established server capabilities, topology, compressors, authentication state, or wire-version gates.

After-state:

- The learner can trace the first conversation: handshake/hello, metadata exchange, `minWireVersion`/`maxWireVersion`, compressor negotiation, topology signals, and auth commands.

Mechanisms and flows:

- Drivers use handshake/hello traffic to discover server capabilities, topology type, wire versions, and supported compressors.
- `minWireVersion` and `maxWireVersion` are protocol feature gates; they are distinct from marketing product version and Stable API version.
- `OP_COMPRESSED` wraps another complete wire message and includes the original opcode, uncompressed size, compressor id, and compressed bytes.
- Compression is negotiated per connection using supported compressors such as snappy, zlib, or zstd where available.
- Authentication is command traffic over the same connection, commonly using SCRAM/SASL flows.

Implementation implications:

- A proxy or compatible server must respond consistently to hello and authentication commands before application commands can work reliably.
- Compression bugs are protocol bugs: decompressing incorrectly corrupts the enclosed complete message.

## Driver Behavior And Distributed Semantics

Source ids: `spec-sdam`, `spec-crud`, `mongodb-hello`, `mongodb-stable-api`

Before-state:

- Applications often treat a driver as a thin socket wrapper.

After-state:

- The learner sees drivers as stateful protocol clients that combine API calls with topology state, server selection, cursor state, sessions, retries, transactions, and wire-version capability checks.

Mechanisms and flows:

- A driver `find()` can become an OP_MSG command, a cursor-bearing reply, and later `getMore` commands.
- Driver behavior depends on SDAM state from hello responses, including replica set membership, primary/secondary state, load-balanced mode, and topology changes.
- Distributed semantics such as sessions, transaction numbers, read concern, write concern, retryability, and Stable API options travel as command fields.

Implementation implications:

- A compatible server must satisfy driver expectations over time, not just answer one command.
- Errors, labels, cursor ids, server metadata, and wire version fields affect retry behavior and client-side topology decisions.

## Compatibility Ecosystem

Source ids: `aws-documentdb-compatibility`, `ferretdb-intro`, `ferretdb-compatibility`, `cosmos-mongodb`, `microsoft-documentdb`, `percona-mongodb`

Before-state:

- "MongoDB-compatible" is often treated as one binary property.

After-state:

- The learner can separate wire-level connectivity, command/API coverage, semantic fidelity, operational behavior, and migration/tooling support.

Mechanisms and flows:

- Amazon DocumentDB provides MongoDB API compatibility with official compatibility matrices and version-specific feature coverage.
- FerretDB describes itself as a proxy that converts MongoDB 5.0+ wire protocol queries to SQL and uses PostgreSQL with the DocumentDB extension as a database engine.
- Azure Cosmos DB for MongoDB supports the MongoDB wire protocol so existing drivers, SDKs, and tools can connect to a Cosmos DB service.
- Microsoft DocumentDB is a MongoDB-compatible open-source document database built on PostgreSQL with BSON/document capabilities.
- Percona Server for MongoDB is closer to a MongoDB server distribution than a translation layer; it is relevant because client compatibility can also come from server-lineage compatibility.

Implementation implications:

- Wire compatibility lowers switching cost by allowing reuse of drivers and tools, but unsupported commands, aggregation semantics, transaction behavior, indexing behavior, performance limits, consistency model, and operations can still require application changes.
- Migration evaluation must test workloads, commands, operators, indexes, auth, transactions, change streams, error labels, performance, and operational behavior.

## Practical Evaluation

Source ids: `mongodb-wire-protocol`, `spec-op-msg`, `spec-compression`, `spec-sdam`, `aws-documentdb-compatibility`, `ferretdb-compatibility`, `cosmos-mongodb`

Before-state:

- Teams may validate compatibility by connecting with a driver and running a simple insert/find smoke test.

After-state:

- The learner has a layered test plan: wire, command, semantic, performance, and operational contracts.

Mechanisms and flows:

- Wire contract: header parsing, BSON, opcodes, compression, request/reply correlation, handshake, auth.
- Command contract: command names, options, operators, cursor behavior, sessions, transactions, errors, bulk writes, indexes.
- Semantic contract: results, consistency, isolation, latency, scaling, failure modes, limits, topology, and observability.

Operational implications:

- Protocol-level signals worth capturing include opcode distribution, message size, compression ratio, round-trip count, cursor ids, command names, error labels, wire versions, and hello/topology metadata.
- The same driver behavior can have wider impact on a compatible implementation because drivers infer capabilities from protocol responses.

Open questions and uncertainty:

- Official compatibility pages are product-specific and version-sensitive; each target system must be checked against current docs before migration.
- Driver specs describe expected behavior, but real application behavior also depends on language driver version, server version, topology, and workload shape.
