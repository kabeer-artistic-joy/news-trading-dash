# Market Pulse HQ

Live, high-impact macro calendar and news-trading research workspace. It filters low-impact noise and maps each verified release to tradeable instruments and the policy driver behind it.

## Run locally

1. Copy `.env.example` to `.env.local` and add a TradingEconomics API key. The API is the supported, server-side feed; do not put keys in browser code.
2. Run `npm install`, then `npm run dev`.
3. Create a Supabase project, run `supabase/schema.sql` in its SQL editor, enable Email auth, and add its URL/anon key to `.env.local`.

## Deploy to Vercel

1. Push this folder to GitHub and import the repository at [Vercel](https://vercel.com/new).
2. Add `TRADING_ECONOMICS_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, and `NEXT_PUBLIC_SUPABASE_ANON_KEY` under Project → Settings → Environment Variables.
3. Deploy. Vercel runs `npm run build`; the calendar endpoint refreshes provider data at most once a minute.

## Data integrity

TradingEconomics is the canonical calendar source. Each card retains actual, forecast and previous values supplied by the provider. The dashboard links to Investing.com’s calendar and TradingView charts for workflow convenience, but it does not scrape them—use official releases for final confirmation. API plans determine available history/forward coverage; choose a paid TradingEconomics plan for full six-month coverage and production reliability.

This is decision support, not financial advice. Event trading can involve widened spreads, slippage and sharp reversals.
