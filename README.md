# Raza Atlas

**A source-linked map of product architecture · Raza Labs by Ali Raza**

![Original concept artwork](public/project-cover.webp)

An interactive architecture explorer using actual local Graphify AST extraction, pinned public source provenance and cycle-safe dependency traversal.

[Working browser demo](https://aliraza2025.github.io/raza-atlas/) · [Product case study](CASE_STUDY.md) · [Portfolio](https://alirazaai.page/projects#ai-labs)

## What works

The extraction script invokes graphify.extract.extract on the pinned sample files. It records zero model tokens and makes unresolved references explicit. The original UI validates imports, traverses relationships, links to source lines and exports a review. It is not a runtime profiler or an LLM architecture reviewer.

## Run locally

Requires Node.js 22+ and Python 3.11–3.13. No paid API or cloud account is needed.

```bash
python3 -m venv .venv
.venv/bin/python -m pip install -r requirements.txt
.venv/bin/python scripts/extract.py
npm test
npm run build
npm start
```

The public directory is source; docs is generated GitHub Pages output. The web server is loopback-only and serves a fixed asset allowlist.

## Verification

The committed public/graph.json was generated with Graphify 0.9.103 from the exact source commit in examples/source-provenance.json. Tests exercise graph integrity, direction, traversal depth, cycles and source URL validation.

## Ownership and upstream credit

Ali Raza’s original contribution is the product workflow, interface, source fixtures, adapters, tests and evaluation framing, with AI-assisted implementation. The upstream engine is [graphify](https://github.com/Graphify-Labs/graphify), installed separately under its own license. This repository does not claim authorship of that engine or affiliation with its maintainers. Original project code is MIT-licensed. No private employer code, student records or customer data are included.

## Limits

The example is a four-file public Raasta source snapshot. Static edges do not prove runtime behavior or complete change impact. External references are explicitly represented, and no semantic or LLM pass was run.

## Next validation

Review extracted edges against a larger permission-cleared codebase and measure relationship precision and missed dynamic dependencies.
