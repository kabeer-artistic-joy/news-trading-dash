import { NextRequest, NextResponse } from "next/server";

const COUNTRY_SET = ["United States", "Euro Area", "United Kingdom", "Japan", "Canada", "Australia", "New Zealand", "Switzerland", "China"];
const HIGH_VALUE = /interest rate|monetary policy|central bank|non farm|employment change|unemployment rate|consumer price|cpi|pce|gdp|retail sales|ism|pmi|eia.*(crude|gas|storage)|natural gas storage|wasde|crop progress|grain stocks|planting intentions|trade balance|industrial production|fomc|beige book|jolts|average hourly|jobless claims|tankan|inflation/i;

export async function GET(request: NextRequest) {
  const window = request.nextUrl.searchParams.get("window") || "week";
  const now = new Date(); const end = new Date(now);
  end.setMonth(end.getMonth() + (window === "sixMonths" ? 6 : window === "month" ? 1 : window === "quarter" ? 3 : 1));
  const fmt = (d: Date) => d.toISOString().slice(0, 10);
  const key = process.env.TRADING_ECONOMICS_KEY;
  if (!key) return NextResponse.json({ events: [], configured: false, message: "Add TRADING_ECONOMICS_KEY to enable the live calendar." });
  const url = new URL(`https://api.tradingeconomics.com/calendar/country/${COUNTRY_SET.map(encodeURIComponent).join(",")}/${fmt(now)}/${fmt(end)}`);
  url.searchParams.set("c", key); url.searchParams.set("f", "json");
  try {
    const response = await fetch(url, { next: { revalidate: 60 } });
    if (!response.ok) throw new Error(`Provider returned ${response.status}`);
    const raw = await response.json();
    const events = raw.filter((e: any) => HIGH_VALUE.test(e.Event || "") && !/low/i.test(e.Importance || ""))
      .map((e: any) => ({ id: e.CalendarId || `${e.Date}-${e.Event}`, date: e.Date, country: e.Country, name: e.Event, impact: /high|3/i.test(e.Importance || "") ? "High" : "Average", actual: e.Actual, forecast: e.Forecast, previous: e.Previous, unit: e.Unit, source: "TradingEconomics", url: e.URL || null }));
    return NextResponse.json({ events, configured: true, refreshedAt: new Date().toISOString() });
  } catch (error) { return NextResponse.json({ events: [], configured: true, message: error instanceof Error ? error.message : "Calendar provider unavailable" }, { status: 502 }); }
}
