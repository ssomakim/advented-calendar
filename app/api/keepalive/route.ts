export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");

  if (
    !process.env.CRON_SECRET ||
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return new Response("Unauthorized", { status: 401 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !supabaseSecretKey) {
    return Response.json(
      { success: false, error: "Missing Supabase environment variables" },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(
      `${supabaseUrl}/rest/v1/replies?select=id&limit=1`,
      {
        headers: {
          apikey: supabaseSecretKey,
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      const error = await response.text();

      return Response.json(
        { success: false, error },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      message: "Supabase keepalive successful",
      checkedAt: new Date().toISOString(),
    });
  } catch (error) {
    return Response.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}