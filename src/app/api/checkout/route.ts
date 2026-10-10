import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import crypto from "crypto";
import Razorpay from "razorpay";

export async function POST(request: Request) {
  try {
    const { customerDetails, items } = await request.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Server-side validation of pricing and inventory
    let subtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.id },
        include: { variants: true },
      });

      if (!product || !product.isAvailable) {
        return NextResponse.json({ error: `Product ${item.name} is unavailable.` }, { status: 400 });
      }

      let price = product.basePrice;
      let stock = product.stockQuantity;

      if (item.variantId) {
        const variant = product.variants.find((v) => v.id === item.variantId);
        if (!variant || !variant.isAvailable) {
          return NextResponse.json({ error: `Variant for ${item.name} is unavailable.` }, { status: 400 });
        }
        price = variant.price;
        stock = variant.stockQuantity;
      }

      if (item.quantity > stock) {
        return NextResponse.json({ error: `Not enough stock for ${item.name}.` }, { status: 400 });
      }

      const itemSubtotal = price * item.quantity;
      subtotal += itemSubtotal;

      validatedItems.push({
        productId: product.id,
        variantName: item.variantName || null,
        quantity: item.quantity,
        unitPrice: price,
        subtotal: itemSubtotal,
      });
    }

    const deliveryFee = subtotal > 0 && subtotal < 80000 ? 6000 : 0;
    const totalAmount = subtotal + deliveryFee;

    // Generate Order Number
    const count = await prisma.order.count();
    const orderNumber = `PF-${new Date().getFullYear()}-${String(count + 1).padStart(5, '0')}`;

    // Create Order in DB
    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName: customerDetails.fullName,
        customerPhone: customerDetails.mobile,
        addressLine1: customerDetails.addressLine1,
        addressLine2: customerDetails.addressLine2,
        city: customerDetails.city,
        state: customerDetails.state,
        pinCode: customerDetails.pinCode,
        deliveryInstructions: customerDetails.deliveryInstructions,
        subtotal,
        deliveryFee,
        totalAmount,
        paymentStatus: "PENDING",
        items: {
          create: validatedItems,
        },
      },
    });

    // Unconditionally bypass payment for now as requested
    await prisma.order.update({
      where: { id: order.id },
      data: { paymentStatus: "PAID", fulfillmentStatus: "PROCESSING" }
    });
    return NextResponse.json({ bypassed: true, orderNumber });

  } catch (error: any) {
    console.error("Checkout Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
