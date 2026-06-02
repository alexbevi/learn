# MongoDB Wire Protocol Visual Plan

All visuals are deterministic HTML/CSS diagrams embedded in `slides/database-internals/mongodb-wire-protocol/index.html`. No generated bitmap assets are used.

## Visual Inventory

- Slide 3
  - concept: wire protocol as language boundary
  - visualType: architecture map
  - purpose: Separate drivers, wire messages, server command execution, storage engines, and compatible implementations.
  - sourcePath: `slides/database-internals/mongodb-wire-protocol/index.html`
  - assetPath: none
  - altText: Architecture map showing drivers sending BSON command messages over the MongoDB wire protocol to MongoDB or compatible server implementations.
  - layoutRisks: Multi-column stack must preserve boundary labels.
  - validationNotes: Marked with `data-visual`.

- Slide 5
  - concept: 16-byte message header
  - visualType: packet diagram
  - purpose: Teach request length, request id, response correlation, and opcode before payload parsing.
  - sourcePath: `slides/database-internals/mongodb-wire-protocol/index.html`
  - assetPath: none
  - altText: Packet diagram showing messageLength, requestID, responseTo, opCode, and payload.
  - layoutRisks: Field labels must remain readable in light and dark themes.
  - validationNotes: Marked with `data-visual`.

- Slide 8
  - concept: opcode evolution
  - visualType: timeline
  - purpose: Show the move from legacy operation-specific opcodes to OP_QUERY command transport and OP_MSG.
  - sourcePath: `slides/database-internals/mongodb-wire-protocol/index.html`
  - assetPath: none
  - altText: Protocol evolution from legacy opcodes through command documents to OP_MSG.
  - layoutRisks: Keep historical labels compact.
  - validationNotes: Marked with `data-visual`.

- Slide 12
  - concept: OP_MSG envelope
  - visualType: packet diagram
  - purpose: Show flags and section kinds for command body and document sequences.
  - sourcePath: `slides/database-internals/mongodb-wire-protocol/index.html`
  - assetPath: none
  - altText: OP_MSG packet showing header, flags, body section, and document sequence section.
  - layoutRisks: Packet sections should not look like code blocks.
  - validationNotes: Marked with `data-visual`.

- Slide 14
  - concept: command replies
  - visualType: architecture map
  - purpose: Show that replies are BSON command documents with ok, cursor, errors, and metadata.
  - sourcePath: `slides/database-internals/mongodb-wire-protocol/index.html`
  - assetPath: none
  - altText: Command reply structure with ok status, cursor document, batch, errors, and metadata.
  - layoutRisks: Fit nested reply fields in cards.
  - validationNotes: Marked with `data-visual`.

- Slide 15
  - concept: handshake and capability negotiation
  - visualType: sequence
  - purpose: Trace hello/handshake metadata, wire versions, topology, and compressors.
  - sourcePath: `slides/database-internals/mongodb-wire-protocol/index.html`
  - assetPath: none
  - altText: Client-server handshake flow exchanging driver metadata, hello response, wire versions, topology, and compressors.
  - layoutRisks: Arrow flow must not overlap text.
  - validationNotes: Marked with `data-visual`.

- Slide 17
  - concept: OP_COMPRESSED wrapper
  - visualType: packet diagram
  - purpose: Show that compression wraps another complete message and records original opcode, uncompressed size, compressor id, and compressed bytes.
  - sourcePath: `slides/database-internals/mongodb-wire-protocol/index.html`
  - assetPath: none
  - altText: OP_COMPRESSED packet wrapping an original MongoDB wire message.
  - layoutRisks: Preserve distinction between wrapper opcode and original opcode.
  - validationNotes: Marked with `data-visual`.

- Slide 21
  - concept: driver API to protocol work
  - visualType: runtime flow
  - purpose: Show API call, server selection, command construction, message framing, network send, reply parsing, and cursor state.
  - sourcePath: `slides/database-internals/mongodb-wire-protocol/index.html`
  - assetPath: none
  - altText: Driver runtime flow from API call through topology state to OP_MSG command and reply parsing.
  - layoutRisks: Six-step flow is dense.
  - validationNotes: Marked with `data-visual`.

- Slide 25
  - concept: protocol versus storage engine trust boundary
  - visualType: architecture map
  - purpose: Explain why drivers care about protocol responses and command semantics rather than backend storage internals.
  - sourcePath: `slides/database-internals/mongodb-wire-protocol/index.html`
  - assetPath: none
  - altText: Driver trust boundary centered on wire protocol, command responses, topology, and errors rather than storage engine internals.
  - layoutRisks: Keep wire, command, and semantic boundaries visually separate.
  - validationNotes: Marked with `data-visual`.

- Slide 26
  - concept: wire compatibility is not enough
  - visualType: comparison matrix
  - purpose: Compare wire, command, semantic, and operational compatibility layers.
  - sourcePath: `slides/database-internals/mongodb-wire-protocol/index.html`
  - assetPath: none
  - altText: Matrix showing compatibility layers from wire framing to operational behavior.
  - layoutRisks: Matrix text must remain concise.
  - validationNotes: Marked with `data-visual`.

- Slide 28
  - concept: MongoDB-compatible technologies
  - visualType: comparison matrix
  - purpose: Compare compatibility systems and what they emulate or reuse.
  - sourcePath: `slides/database-internals/mongodb-wire-protocol/index.html`
  - assetPath: none
  - altText: Matrix comparing DocumentDB, FerretDB, Cosmos DB for MongoDB, Microsoft DocumentDB, Percona Server, and other compatibility approaches.
  - layoutRisks: Five-column matrix can crowd; validate desktop readability.
  - validationNotes: Marked with `data-visual`.

- Slide 31
  - concept: FerretDB translation path
  - visualType: data flow
  - purpose: Show MongoDB driver traffic translated through a proxy to PostgreSQL-backed execution.
  - sourcePath: `slides/database-internals/mongodb-wire-protocol/index.html`
  - assetPath: none
  - altText: FerretDB flow from MongoDB driver through wire protocol proxy to PostgreSQL with DocumentDB extension.
  - layoutRisks: Avoid implying full semantic parity.
  - validationNotes: Marked with `data-visual`.

- Slide 34
  - concept: compatible implementation architecture
  - visualType: architecture map
  - purpose: Show wire parser, command dispatcher, semantic engine, backend adapter, and observability/error behavior.
  - sourcePath: `slides/database-internals/mongodb-wire-protocol/index.html`
  - assetPath: none
  - altText: Architecture map for a MongoDB-compatible implementation with wire parser, command engine, semantic layer, backend storage, and response mapper.
  - layoutRisks: Make sure semantic layer is visually distinct from wire parsing.
  - validationNotes: Marked with `data-visual`.

- Slide 44
  - concept: three compatibility contracts
  - visualType: architecture map
  - purpose: Summarize wire, command, and semantic contracts as the mental model for evaluating compatibility.
  - sourcePath: `slides/database-internals/mongodb-wire-protocol/index.html`
  - assetPath: none
  - altText: Three-card model of wire contract, command contract, and semantic contract.
  - layoutRisks: Should remain simple and readable as recap.
  - validationNotes: Marked with `data-visual`.

## Visual Quality Notes

- These visuals are structural, not decorative. They teach packet layout, runtime flow, compatibility layers, and architecture boundaries.
- No generated images or external images are embedded.
- All custom visuals are in-slide HTML/CSS and marked with `data-visual`.
