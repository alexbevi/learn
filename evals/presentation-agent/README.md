# Presentation agent evaluations

This suite tests whether instruction and skill changes improve observable deck
quality and workflow decisions.

Validate and list the cases:

```bash
node scripts/run-presentation-evals.mjs --validate
node scripts/run-presentation-evals.mjs --list
```

Prepare an isolated review packet:

```bash
node scripts/run-presentation-evals.mjs --prepare narrow-runtime-mechanism
```

Give the agent under test only the `prompt.md` contents. Run it in an isolated
worktree or temporary repository copy. Do not show it the criteria or review
template.

After the run, fill in `review-template.json` with scores and concrete evidence.
Then produce a scorecard:

```bash
node scripts/run-presentation-evals.mjs \
  --score narrow-runtime-mechanism \
  --deck <generated-deck-id> \
  --review <path-to-review.json> \
  --render
```

The runner combines human review with site validation and rendered layout
signals. A passing deck averages at least 3.0 on the requested rubric
dimensions, has no score of 1, passes every case criterion, passes site
validation, and has no rendered overflow or clipped text.

Generated packets, renders, and scorecards go under `.artifacts/` and are not
committed.
