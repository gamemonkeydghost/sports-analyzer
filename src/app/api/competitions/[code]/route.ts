import { NextResponse } from "next/server";
import { getCompetitionDetail, getDataSourceMode } from "@/lib/football/service";

export async function GET(_req: Request, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const detail = await getCompetitionDetail(code.toUpperCase());

  if (!detail) {
    return NextResponse.json({ error: "Competition not found" }, { status: 404 });
  }

  return NextResponse.json({ mode: getDataSourceMode(), ...detail });
}
