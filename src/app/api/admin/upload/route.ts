import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { nanoid } from "nanoid";

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const file = form.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const ext = file.name.split(".").pop()?.toLowerCase() || "png";
  const allowed = ["jpg", "jpeg", "png", "webp", "avif"];
  if (!allowed.includes(ext)) {
    return NextResponse.json({ error: "File type not allowed" }, { status: 400 });
  }

  const pathname = `menu/${nanoid()}.${ext}`;

  const blob = await put(pathname, file, {
    access: "public",
    addRandomSuffix: false,
  });

  return NextResponse.json({ url: blob.url });
}
