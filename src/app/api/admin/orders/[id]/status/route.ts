import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const text = await request.text();
    let status = "";
    try {
      const body = JSON.parse(text);
      status = body?.status;
    } catch {
      // Fallback for malformed body or string
      const match = text.match(/"?status"?\s*:\s*"?([A-Za-z_]+)"?/);
      if (match) {
        status = match[1];
      } else {
        status = text.replace(/[^a-zA-Z_]/g, "");
      }
    }

    if (!status) {
      return NextResponse.json({ error: "Status is required" }, { status: 400 });
    }

    const validStatuses = ["PENDING", "PACKED", "SHIPPED", "DELIVERED", "CANCELLED", "PROCESSING", "OUT_FOR_DELIVERY"];
    const normalizedStatus = status.toUpperCase();

    if (!validStatuses.includes(normalizedStatus)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` },
        { status: 400 }
      );
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { fulfillmentStatus: normalizedStatus },
    });

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (error) {
    console.error("Failed to update order fulfillment status:", error);
    return NextResponse.json(
      { error: "Internal Server Error updating order status" },
      { status: 500 }
    );
  }
}
