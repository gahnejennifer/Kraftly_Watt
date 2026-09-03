# Pipeline – Kraftly Mina sidor

## Flöde

```mermaid
flowchart LR
    PR[Pull request mot main] --> Q[quality: lint · format · test:run]
    PR --> B[build: vite build → dist/]
    PR --> E[e2e: smoke-test]
    Q --> M{Alla checks gröna + 1 review?}
    B --> M
    E --> M
    M -- ja --> OK[Merge tillåten]
    M -- nej --> Stop[Merge-knappen låst]
```

## Beslut 1 · Jobb: parallellt eller i serie?

Hur ni delade upp jobben och varför. Vad kostar det i minuter, vad ger det i svarstid?

## Beslut 2 · Vad krävs för merge?

Vilka checks är required, hur många approvals, up to date ja/nej, bypass för någon?

## Beslut 3 · Protokoll vid röd main

Vem gör vad, inom vilken tid. Laga framåt eller revert – var går gränsen? (Aldrig runt.)

## Byggtid: före och efter npm-cache

| Steg             | Utan cache | Med cache |
| ---------------- | ---------- | --------- |
| npm ci (quality) | 31s        |           |
| npm ci (build)   | 29s        |           |
| Hela körningen   | 1m         |           |

Skärmdumpar: ![time build, quality](<Skärmavbild 2026-09-03 kl. 13.53.24-1.png>)

## Skärmdump: låst merge-knapp

![npm run format:check gick ej igenom](image.png)
