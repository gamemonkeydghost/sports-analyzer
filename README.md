# Sport Analyzer

Dashboard web (Next.js + TypeScript + Tailwind) per l'analisi calcistica: classifiche, prossime partite e confronto squadre con stima euristica dell'esito.

## Avvio

```bash
npm install
npm run dev
```

Apri http://localhost:3000.

## Dati live vs demo

Senza configurazione l'app mostra **dati demo** deterministici per 4 campionati (Premier League, Serie A, La Liga, Bundesliga), così è esplorabile subito.

Per collegare dati reali:

1. Registrati gratuitamente su [football-data.org](https://www.football-data.org/client/register) e ottieni una API key.
2. Copia `.env.example` in `.env.local` e imposta `FOOTBALL_DATA_API_KEY`.
3. Riavvia il dev server.

Se la chiamata all'API live fallisce (rate limit, chiave non valida, ecc.) l'app ricade automaticamente sui dati demo, senza rompere l'interfaccia.

## Struttura

- `src/lib/football/client.ts` — client per l'API football-data.org (server-side, la chiave non è mai esposta al browser)
- `src/lib/football/mock.ts` — dataset demo deterministico
- `src/lib/football/service.ts` — layer unificato live/demo con fallback automatico
- `src/lib/analysis.ts` — modello euristico di confronto squadre (punti/partita + forma recente + vantaggio casa)
- `src/app/api/*` — route API che espongono i dati alle pagine
- `src/app/competitions/[code]` — pagina campionato: classifica, calendario, analyzer

## Note

La probabilità d'esito mostrata nell'analyzer è un'euristica semplice basata su statistiche di classifica, non un modello statistico/ML né un segnale di betting.
