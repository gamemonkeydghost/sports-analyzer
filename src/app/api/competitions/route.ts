import { NextResponse } from "next/server";
import { getCompetitions, getDataSourceMode } from "@/lib/football/service";

export async function GET() {
  const competitions = await getCompetitions();
  return NextResponse.json({ mode: getDataSourceMode(), competitions });
}
