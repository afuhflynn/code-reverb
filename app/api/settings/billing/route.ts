import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-utils";

// Mock billing data - in a real app, you'd integrate with Stripe or similar
export async function GET() {
  try {
    const session = await requireAuth();

    // Mock billing data
    const billingData = {
      subscription: {
        plan: "Pro",
        status: "active",
        currentPeriodStart: new Date().toISOString(),
        currentPeriodEnd: new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        cancelAtPeriodEnd: false,
      },
      paymentMethod: {
        type: "card",
        last4: "4242",
        brand: "visa",
        expiryMonth: 12,
        expiryYear: 2025,
      },
      invoices: [
        {
          id: "inv_001",
          amount: 29.99,
          currency: "usd",
          status: "paid",
          date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          downloadUrl: "#",
        },
      ],
    };

    return NextResponse.json(billingData);
  } catch (error) {
    console.error("Billing GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch billing information" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await requireAuth();
    const data = await request.json();

    // Mock billing update - in real app, update subscription
    return NextResponse.json({
      message: "Billing settings updated successfully",
      ...data,
    });
  } catch (error) {
    console.error("Billing PUT error:", error);
    return NextResponse.json(
      { error: "Failed to update billing settings" },
      { status: 500 },
    );
  }
}
