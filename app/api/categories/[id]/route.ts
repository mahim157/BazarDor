import { NextResponse } from "next/server";
import { getCategoryById } from "@/lib/categories";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const category = getCategoryById(id);

  if (!category) {
    return NextResponse.json(
      { message: "Kategorie nicht gefunden" },
      { status: 404 }
    );
  }

  return NextResponse.json(category);
}