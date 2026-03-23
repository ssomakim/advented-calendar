import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase-admin";

function isAdminCookieValid(cookieValue?: string) {
  return (
    !!process.env.ADMIN_PASSWORD &&
    !!cookieValue &&
    cookieValue === process.env.ADMIN_PASSWORD
  );
}

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies();
  const adminCookie = cookieStore.get("reply_admin")?.value;

  if (!isAdminCookieValid(adminCookie)) {
    return NextResponse.json(
      { error: "관리자만 수정할 수 있습니다." },
      { status: 401 }
    );
  }

  const { id } = await context.params;

  if (!id) {
    return NextResponse.json(
      { error: "답장 ID를 찾지 못했습니다." },
      { status: 400 }
    );
  }

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

    const { error } = await supabaseAdmin
      .from("replies")
      .update({
        name,
        message,
        is_secret: isSecret,
      })
      .eq("id", id);

    if (error) {
      console.error("PATCH /api/reply/[id] supabase error:", error);

      return NextResponse.json(
        { error: error.message ?? "답장을 수정하지 못했습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("PATCH /api/reply/[id] unexpected error:", err);

    return NextResponse.json(
      { error: "잘못된 요청입니다." },
      { status: 400 }
    );
  }
}

export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies();
  const adminCookie = cookieStore.get("reply_admin")?.value;

  if (!isAdminCookieValid(adminCookie)) {
    return NextResponse.json(
      { error: "관리자만 삭제할 수 있습니다." },
      { status: 401 }
    );
  }

  const { id } = await context.params;

  if (!id) {
    return NextResponse.json(
      { error: "답장 ID를 찾지 못했습니다." },
      { status: 400 }
    );
  }

  try {
    const { error } = await supabaseAdmin
      .from("replies")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("DELETE /api/reply/[id] supabase error:", error);

      return NextResponse.json(
        { error: error.message ?? "답장을 삭제하지 못했습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("DELETE /api/reply/[id] unexpected error:", err);

    return NextResponse.json(
      { error: "삭제 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}