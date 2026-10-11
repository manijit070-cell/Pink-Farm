import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const order = await prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const currentFulfillment = (order.fulfillmentStatus || "PENDING").toUpperCase();

    // Once shipped or delivered, order cannot be cancelled
    if (
      currentFulfillment === "SHIPPED" ||
      currentFulfillment === "OUT_FOR_DELIVERY" ||
      currentFulfillment === "DELIVERED"
    ) {
      return NextResponse.json(
        {
          error:
            "This order has already been shipped and handed over to the courier. It can no longer be cancelled.",
        },
        { status: 400 }
      );
    }

    if (currentFulfillment === "CANCELLED") {
      return NextResponse.json(
        { error: "This order has already been cancelled." },
        { status: 400 }
      );
    }

    // Cancel order
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { fulfillmentStatus: "CANCELLED" },
    });

    return NextResponse.json({
      success: true,
      message: "Order has been successfully cancelled.",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Failed to cancel customer order:", error);
    return NextResponse.json(
      { error: "Internal Server Error cancelling order" },
      { status: 500 }
    );
  }
}
