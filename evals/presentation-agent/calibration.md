# Evaluation calibration

Use these two small profiles to align reviewers before scoring a real deck.
They are deliberately compact. Judge the mechanism and learning design, not the
polish of the prose.

## Strong profile

The learner must diagnose why a driver cannot select a replica-set server after
the primary fails.

The deck follows one request through topology monitoring, candidate filtering,
read preference, latency-window selection, and timeout. Before the explanation,
the learner predicts whether `secondaryPreferred` can proceed with a stale
topology view. A verified Node.js example triggers the failure and records the
expected error. A sequence diagram is reused during diagnosis. The recap gives
a short procedure based on topology state, read preference, timeout, and
monitoring evidence.

Expected rubric pattern: mostly 3s and 4s. The deck has one observable outcome,
a causal path, a worked failure, active reasoning, source boundaries, and a
transfer procedure.

## Weak profile

The deck promises to "understand database drivers" and then lists driver
features, benefits, configuration options, and best practices. Each slide uses
the same card grid. The example is an untested connection snippet. Failover is
described as automatic, with no topology state, timing, or error path. Sources
appear only on the final slide. The recap repeats the feature list.

Expected rubric pattern: mostly 1s and 2s. The content may be factually plausible
while still failing to teach a traceable mechanism or usable diagnostic skill.

If reviewers score these profiles similarly, resolve that disagreement before
using totals to compare agent changes.
