import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET() {
  const cookieStore = await cookies();
  const adminCookie = cookieStore.get("reply_admin")?.value;

  const isAdmin =
    !!process.env.ADMIN_PASSWORD &&
    adminCookie === process.env.ADMIN_PASSWORD;

  let query = supabaseAdmin
    .from("replies")
    .select("id, name, message, is_secret, created_at")
    .order("created_at", { ascending: false });

  if (!isAdmin) {
    query = query.eq("is_secret", false);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json(
      { error: "답장을 불러오지 못했습니다." },
      { status: 500 }
    );
  }

  const replies = (data ?? []).map((reply) => ({
    id: reply.id,
    name: reply.name,
    message: reply.message,
    isSecret: reply.is_secret,
    createdAt: reply.created_at,
  }));

  return NextResponse.json({
    replies,
    isAdmin,
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const name = String(body.name ?? "").trim();
    const message = String(body.message ?? "").trim();
    const isSecret = Boolean(body.isSecret);

    if (!name) {
      return NextResponse.json(
        { error: "보내는 이를 입력해 주세요." },
        { status: 400 }
      );
    }

    if (!message) {
      return NextResponse.json(
        { error: "편지 내용을 입력해 주세요." },
        { status: 400 }
      );
    }

    if (name.length > 30) {
      return NextResponse.json(
        { error: "이름은 30자 이하로 입력해 주세요." },
        { status: 400 }
      );
    }

    if (message.length > 2000) {
      return NextResponse.json(
        { error: "편지는 2000자 이하로 입력해 주세요." },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin.from("replies").insert({
      name,
      message,
      is_secret: isSecret,
    });

    if (error) {
      return NextResponse.json(
        { error: "답장을 저장하지 못했습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "잘못된 요청입니다." },
      { status: 400 }
    );
  }
}