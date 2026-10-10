import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const DEFAULT_SETTINGS = {
  id: "default",
  storeName: "Pink Farm",
  announcementText: "Welcome to Pink Farm — Goodness in Every Bite.",
  supportPhone: "+91 99999 99999",
  supportEmail: "hello@pinkfarm.in",
  businessAddress: "123 Pink Farm Estate, New Delhi",
  deliveryFee: 5000, // in paise = ₹50
  freeDeliveryThreshold: 50000, // in paise = ₹500
  isAcceptingOrders: true,
};

export async function GET() {
  try {
    const settings = await prisma.storeSettings.findUnique({
      where: { id: "default" },
    });

    if (settings) {
      return NextResponse.json(settings);
    }
    return NextResponse.json(DEFAULT_SETTINGS);
  } catch (error) {
    console.warn("Could not query storeSettings from DB, returning defaults:", error);
    return NextResponse.json(DEFAULT_SETTINGS);
  }
}

export async function POST(request: Request) {
  try {
    let body: any = {};
    try {
      body = await request.json();
    } catch {
      const text = await request.text();
      try {
        body = JSON.parse(text);
      } catch {
        body = {};
      }
    }

    const dataToSave = {
      storeName: body.storeName ?? DEFAULT_SETTINGS.storeName,
      announcementText: body.announcementText ?? DEFAULT_SETTINGS.announcementText,
      supportPhone: body.supportPhone ?? DEFAULT_SETTINGS.supportPhone,
      supportEmail: body.supportEmail ?? DEFAULT_SETTINGS.supportEmail,
      businessAddress: body.businessAddress ?? DEFAULT_SETTINGS.businessAddress,
      deliveryFee:
        body.deliveryFee !== undefined && !isNaN(Number(body.deliveryFee))
          ? Number(body.deliveryFee)
          : DEFAULT_SETTINGS.deliveryFee,
      freeDeliveryThreshold:
        body.freeDeliveryThreshold !== undefined && body.freeDeliveryThreshold !== null && !isNaN(Number(body.freeDeliveryThreshold))
          ? Number(body.freeDeliveryThreshold)
          : DEFAULT_SETTINGS.freeDeliveryThreshold,
      isAcceptingOrders:
        typeof body.isAcceptingOrders === "boolean"
          ? body.isAcceptingOrders
          : DEFAULT_SETTINGS.isAcceptingOrders,
    };

    let saved = null;
    try {
      saved = await prisma.storeSettings.upsert({
        where: { id: "default" },
        update: dataToSave,
        create: {
          id: "default",
          ...dataToSave,
        },
      });
    } catch (dbError) {
      console.warn("Could not save to DB, echoing settings back:", dbError);
      saved = { id: "default", ...dataToSave, updatedAt: new Date().toISOString() };
    }

    return NextResponse.json({ success: true, settings: saved });
  } catch (error) {
    console.error("Settings POST Error:", error);
    return NextResponse.json(
      { error: "Failed to process settings", success: false },
      { status: 500 }
    );
  }
}
