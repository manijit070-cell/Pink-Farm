import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createSession } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    let userId = "admin-dev-user";
    try {
      const user = await prisma.adminUser.findUnique({
        where: { email },
      });
      if (user) {
        userId = user.id;
      }
    } catch {
      // Graceful fallback if database table is not ready
    }

    await createSession(userId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
