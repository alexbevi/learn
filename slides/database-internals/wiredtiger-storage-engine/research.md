# MongoDB WiredTiger Storage Engine Research

Audience: application engineers, database engineers, and operators who need to connect MongoDB operation shape to WiredTiger storage-engine mechanics.

Practical anchors:

1. A multi-document insert of order events with collection and secondary index writes.
2. An operational revenue aggregation that filters, sorts, groups, fetches collection pages, and may spill.

Core frame: MongoDB owns document semantics, query planning, aggregation execution, write concern, replication, and command behavior. WiredTiger owns the lower-level storage mechanics: row-store B-trees, pages, update chains, cache, eviction, reconciliation, checkpoints, logging, and recovery. Most production symptoms become understandable when they are mapped to page traffic, dirty bytes, version retention, or blocking query stages.

## Storage Boundary And Mental Model

Source ids: `mongodb-wiredtiger`, `wiredtiger-btree`, `wiredtiger-block-manager`

Before-state:

- Developers see MongoDB commands, collections, documents, and indexes, but the storage engine sees tables, pages, keys, values, update chains, cache pressure, and checkpoint/recovery work.
- Without a boundary model, storage symptoms look arbitrary: cache pressure, write latency, disk growth, slow scans, and recovery behavior are treated as unrelated problems.

After-state:

- The learner can translate a MongoDB operation into storage-engine work: collection B-tree traversal, index B-tree traversal, update-chain visibility, dirty-page creation, eviction, checkpoint, and log replay.

Mechanisms and flows:

- A MongoDB collection is backed by WiredTiger tables. Collection data and each index are separate storage structures, so every write touching secondary indexes creates additional B-tree work.
- WiredTiger row-store B-trees organize keys into root, internal, and leaf pages. Leaf pages hold keys and values or update chains, and internal pages guide traversal.
- WiredTiger block-manager and checkpoint metadata determine what durable pages exist on disk and how reusable free space is represented internally.

Operational implications:

- Index count is a storage budget. Each index costs write work, cache residency, dirty-page reconciliation, checkpoint I/O, and recovery work.
- Disk space after deletes may be internally reusable without returning immediately to the filesystem.
- Avoid treating WiredTiger as only a file format; it is the runtime cache, MVCC, eviction, checkpoint, logging, and recovery system beneath MongoDB semantics.

Version-sensitive areas:

- WiredTiger architecture guides are not guaranteed to match every MongoDB server release exactly. Use MongoDB manual pages for user-visible behavior and architecture guides for mechanism-level intuition.

## Cache, Filesystem Cache, Compression, And Eviction

Source ids: `mongodb-wiredtiger`, `mongodb-serverstatus`, `wiredtiger-eviction`

Before-state:

- Teams often read process memory or OS cache behavior as a leak, or tune WiredTiger cache before understanding whether the workload touches too many pages, dirties pages too quickly, or pins old versions.

After-state:

- The learner separates WiredTiger internal cache from filesystem cache and maps cache pressure to eviction and reconciliation work.

Mechanisms and flows:

- MongoDB uses WiredTiger internal cache for engine-managed pages and the operating system filesystem cache for compressed MongoDB files.
- Collection data in WiredTiger cache is uncompressed and represented differently from on-disk data; filesystem cache holds bytes closer to the on-disk compressed representation.
- Eviction removes pages from the WiredTiger cache. Clean eviction can discard cache-resident pages. Dirty eviction must reconcile in-memory updates into a new page image that can be written safely.
- Dirty pages, update chains, and long-running snapshots can make eviction more expensive because old versions may need to remain visible.

Operational implications:

- `serverStatus().wiredTiger.cache` counters are the first readout for cache pressure, eviction, dirty bytes, and application-thread eviction.
- Increasing cache size can hide an access-pattern issue while reducing filesystem cache and other memory headroom. MongoDB's docs explicitly caution against increasing WiredTiger internal cache size above default without a workload reason.
- In containers or multiple-`mongod` hosts, configure WiredTiger cache against actual memory limits and other consumers.

Knobs, limits, and failure modes:

- `storage.wiredTiger.engineConfig.cacheSizeGB` and `cacheSizePct` affect internal cache sizing.
- Cache symptoms to map: pages read into cache, pages evicted, modified pages evicted, eviction blocked, application threads doing eviction, dirty bytes, and pages queued for eviction.
- Compression defaults are Snappy block compression for collections and prefix compression for indexes unless configured otherwise.

## MVCC, Timestamps, History Store, And Transactions

Source ids: `wiredtiger-transactions`, `wiredtiger-timestamps`, `mongodb-transactions`, `mongodb-atomicity`

Before-state:

- Reads and writes appear to operate directly on current documents. Long-running reads, transactions, or snapshots can therefore seem unrelated to storage growth or eviction pressure.

After-state:

- The learner sees WiredTiger update chains as local version history and understands how timestamps and snapshot visibility influence cleanup.

Mechanisms and flows:

- WiredTiger uses update chains and visibility checks to decide which version of a value a transaction or read can see.
- MongoDB coordinates logical time and storage timestamps so reads can see an appropriate snapshot and recovery can distinguish stable from unstable work.
- The stable timestamp marks data that cannot be rolled back by higher-level transaction management. The oldest timestamp allows history older than that point to be discarded when no longer needed.
- The pinned timestamp is constrained by old active reads and the oldest timestamp; pinned history limits cleanup.

Operational implications:

- Long-running transactions, old snapshots, or blocked timestamp advancement can retain old versions and increase cache/history pressure.
- Multi-document transactions widen the lifetime of resources and versions. MongoDB docs warn that distributed transactions carry higher performance cost and are not a substitute for effective schema design.
- Single-document writes remain atomic at the document level; multi-document atomicity uses transaction machinery with additional overhead.

Failure modes:

- Write conflicts, old version retention, high history-store activity, and slow cleanup are symptoms to correlate with transaction and read timestamp behavior.

## Checkpoints, Journaling, Recovery, And Acknowledgement

Source ids: `mongodb-wiredtiger`, `mongodb-journaling`, `mongodb-write-concern`, `wiredtiger-checkpoint`, `wiredtiger-logging`

Before-state:

- Users often conflate "commit", "journaled", "acknowledged", and "checkpointed".

After-state:

- The learner can separate engine commit, write-ahead logging, checkpoint, and client acknowledgement as different moments in the write lifecycle.

Mechanisms and flows:

- A checkpoint creates a consistent durable base image of data files.
- The WiredTiger log/journal protects changes that occur between checkpoints. If MongoDB exits between checkpoints, journal replay recovers data modified since the last checkpoint.
- Write concern defines the level of acknowledgement requested by the client, including replication and durability expectations depending on settings.
- Recovery starts from the last checkpoint and uses logs plus timestamp stability rules to reconstruct the boundary between stable and unstable work.

Operational implications:

- Restart time can depend on the amount of journal replay and rollback-to-stable work needed.
- Checkpoint pressure can show up as dirty-byte pressure, checkpoint duration, and write latency if dirty work accumulates faster than the system can reconcile and persist it.
- Durability behavior should be reasoned across MongoDB server semantics, replication, WiredTiger logging, checkpointing, and underlying storage media.

## Multi-Document Insert Workload

Source ids: `mongodb-insertmany`, `mongodb-write-concern`, `mongodb-transactions`, `mongodb-concurrency`, `wiredtiger-btree`, `wiredtiger-eviction`

Before-state:

- A batch insert looks like one application operation, so teams underestimate the amount of collection and index mutation underneath it.

After-state:

- The learner can decompose an insert batch into per-document validation, collection B-tree inserts, secondary index inserts, uniqueness checks, transaction visibility, dirty cache work, logging, write concern, and replication acknowledgement.

Mechanisms and flows:

- `insertMany()` can run ordered or unordered. Ordered operations stop after an error, excluding write concern errors; unordered operations continue processing remaining operations.
- MongoDB consolidates multiple document insert operations into a single oplog entry in many cases, but storage work still occurs across collection and index structures.
- Unique secondary indexes add read-before-write behavior because MongoDB must detect conflicts.
- WiredTiger document-level concurrency sits beneath MongoDB intent locks, allowing concurrent operations while still coordinating write conflicts and transaction visibility.

Operational implications:

- Secondary indexes multiply write amplification.
- Ordered/unordered options change error and continuation behavior, not the fundamental need to update collection and index structures.
- Write concern changes acknowledgement latency and durability/replication semantics above engine commit.
- Batching reduces command overhead, but it does not eliminate per-document and per-index storage work.

## Aggregation Retrieval Workload

Source ids: `mongodb-agg-optimization`, `mongodb-explain`, `mongodb-sbe`, `mongodb-sort`, `mongodb-group`, `mongodb-serverstatus`, `wiredtiger-btree`

Before-state:

- Aggregation is often discussed as a pipeline only. That hides how optimizer and planner choices become page traversal, fetches, blocking memory, and spill behavior.

After-state:

- The learner separates pipeline optimization, query planning, server execution, and storage-engine cursor work.

Mechanisms and flows:

- MongoDB's aggregation optimizer can reorder or split stages, push `$match` earlier where possible, reduce projected fields, and use indexes when stages are compatible.
- The planner turns predicates and sort requirements into index scan, collection scan, fetch, and covered-plan choices.
- SBE can execute certain eligible pipeline stages depending on stage order and conditions.
- Blocking stages such as `$sort` and `$group` shape memory and may spill to temporary files depending on stage behavior and limits.
- WiredTiger does not understand a pipeline. It serves cursor reads, page fetches, index traversal, and version visibility decisions requested by the server execution layer.

Operational implications:

- A covered plan can avoid collection page fetches and reduce WiredTiger cache pressure.
- A misordered or missing index can turn a selective logical query into high page traffic.
- Aggregation spill is server temporary-file work, not the same mechanism as WiredTiger eviction. Both can create disk pressure, but the diagnostic path differs.
- `explain()` and profiler fields explain how much storage work the query requested; `serverStatus().wiredTiger` explains what the engine experienced.

## Diagnostics And Tuning

Source ids: `mongodb-serverstatus`, `mongodb-explain`, `mongodb-wiredtiger`, `mongodb-concurrency`

Before-state:

- Teams often start with knobs: cache size, compression, compaction, batch size, or write concern.

After-state:

- The learner starts by mapping the symptom to the mechanism: page traffic, dirty bytes, old version retention, blocking query memory, concurrency conflicts, or platform I/O.

Mechanisms and flows:

- Use profiler and explain output to identify operation shape: namespace, command, plan summary, keys/documents examined, sort/group behavior, spills, locks, write concern, and duration.
- Use `serverStatus().wiredTiger` rates for cache, eviction, checkpoint, transactions, block manager, and spill-related counters.
- Correlate server metrics with OS/cloud signals: disk latency, queue depth, CPU saturation, filesystem cache, Atlas metrics, and replication apply behavior.

Operational implications:

- Schema design changes locality, page fan-out, update patterns, and version retention.
- Index design is both a query tool and a storage budget.
- Aggregation design should narrow early and use indexes where possible; late blocking stages convert logical mistakes into memory and disk work.
- Tuning should follow operation-shape diagnosis, not replace it.

Open questions and source gaps:

- Public docs do not describe every MongoDB-version-specific interaction between query execution and WiredTiger internals.
- WiredTiger architecture docs explain mechanisms but include an explicit caveat that they may not be correct or complete for a specific release.
- Production diagnosis still needs workload-specific metrics, profiler data, and deployment context.
