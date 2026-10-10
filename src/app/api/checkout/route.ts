import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import crypto from "crypto";
import Razorpay from "razorpay";

export async function POST(request: Request) {
  try {
    const { customerDetails, items, couponCode } = await request.json();

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

      // If item was added as part of a Combo discount, calculate discount on originalPrice (MRP)
      if (item.variantName && item.variantName.includes("Combo")) {
        const mrp = (product.originalPrice && product.originalPrice > product.basePrice)
          ? product.originalPrice
          : product.basePrice;
        if (item.variantName.includes("11%")) {
          price = Math.round(mrp * 0.89);
        } else if (item.variantName.includes("15%")) {
          price = Math.round(mrp * 0.85);
        }
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

    // Verify store settings and order acceptance
    let deliveryFee = 5000;
    let freeThreshold = 50000;
    try {
      const settings = await prisma.storeSettings.findUnique({ where: { id: "default" } });
      if (settings) {
        if (!settings.isAcceptingOrders) {
          return NextResponse.json(
            { error: "Online orders are currently paused by the store admin. Please try again later." },
            { status: 400 }
          );
        }
        deliveryFee = settings.deliveryFee;
        freeThreshold = settings.freeDeliveryThreshold ?? 50000;
      }
    } catch (settingsErr) {
      console.warn("Could not load settings in checkout route:", settingsErr);
    }

    const finalDeliveryFee = subtotal > 0 ? (freeThreshold > 0 && subtotal >= freeThreshold ? 0 : deliveryFee) : 0;
    
    // Validate coupon
    let discount = 0;
    const rawCoupon = couponCode || (customerDetails as any)?.couponCode;
    
    if (rawCoupon && (String(rawCoupon).toUpperCase() === "FLAT499" || String(rawCoupon).toUpperCase() === "FIRST499")) {
      const codeName = String(rawCoupon).toUpperCase();
      if (subtotal >= 199900) {
        // One-time use validation per phone number
        const priorOrder = await prisma.order.findFirst({
          where: {
            customerPhone: customerDetails.mobile,
            discount: { gt: 0 },
          },
        });
        if (priorOrder) {
          return NextResponse.json(
            { error: `Coupon ${codeName} is a one-time use coupon and has already been used for this mobile number.` },
            { status: 400 }
          );
        }
        discount = 49900; // ₹499 in paise
      } else {
        return NextResponse.json(
          { error: `Minimum order of ₹1999 required to use coupon ${codeName}.` },
          { status: 400 }
        );
      }
    }

    const totalAmount = Math.max(0, subtotal - discount + finalDeliveryFee);

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
        deliveryFee: finalDeliveryFee,
        discount,
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
