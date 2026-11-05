# Raza Atlas — product case study

## Problem and audience

A product manager reviewing a technical change needs to locate the relevant component and follow its dependencies. This prototype makes a small real code map inspectable, with exact source provenance.

## Role

Independent product design and development by Ali Raza, with AI-assisted implementation. I scoped a verifiable local workflow, selected an upstream component, authored fixtures, built the interface and separated implementation evidence from outcome claims.

## Product decisions

Use a pinned source snapshot. Show unresolved references. Separate incoming impact from outgoing dependencies. Bound traversal depth and handle cycles. Keep code extraction local and do not infer runtime behavior from static edges.

## Implemented and checked

The committed public/graph.json was generated with Graphify 0.9.103 from the exact source commit in examples/source-provenance.json. Tests exercise graph integrity, direction, traversal depth, cycles and source URL validation.

## Evidence limits

The example is a four-file public Raasta source snapshot. Static edges do not prove runtime behavior or complete change impact. External references are explicitly represented, and no semantic or LLM pass was run.

## Proposed next decision

Review extracted edges against a larger permission-cleared codebase and measure relationship precision and missed dynamic dependencies.
