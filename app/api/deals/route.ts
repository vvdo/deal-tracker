import { NextResponse } from "next/server";
import { getDealsSnapshot } from "@/lib/deals";

export const revalidate = 0;

export async function GET() {
  const snapshot = getDealsSnapshot();
  return NextResponse.json(snapshot);
}
