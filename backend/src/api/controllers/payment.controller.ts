import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const CreatePaymentIntents = async (req: any, res: any) => {
  const { amount, frequency } = req.body;
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents,
      currency: "usd",
      metadata: {
        frequency,
      },
    });
    res.status(200).json({
      success: true,
      message: "Payment intent created successfully",
      data: { client_secret: paymentIntent.client_secret },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      data: error.message,
    });
  }
};
