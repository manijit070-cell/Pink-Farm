import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const { orderId, razorpay_payment_id, razorpay_order_id, razorpay_signature } = await request.json();

    const secret = process.env.RAZORPAY_KEY_SECRET;
    
    if (!secret) {
      return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
    }

    const shasum = crypto.createHmac("sha256", secret);
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = shasum.digest("hex");

    if (digest !== razorpay_signature) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }

    // Update Order to PAID
    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: "PAID",
        fulfillmentStatus: "PROCESSING",
        gatewayPaymentId: razorpay_payment_id,
      },
      include: { items: true },
    });

    // Reduce inventory safely
    for (const item of order.items) {
      if (item.variantName) {
        // Find variant and reduce
        const product = await prisma.product.findUnique({
           where: { id: item.productId },
           include: { variants: true }
        });
        const variant = product?.variants.find(v => v.name === item.variantName);
        if (variant) {
           await prisma.productVariant.update({
             where: { id: variant.id },
             data: { stockQuantity: { decrement: item.quantity } }
           });
        }
      } else {
        // Reduce product directly
        await prisma.product.update({
          where: { id: item.productId },
          data: { stockQuantity: { decrement: item.quantity } }
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Payment Verification Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
