const express = require("express");
const dotEnv = require('dotenv').config()
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
const stripe = require("stripe")(process.env.STRIPE_SK_KEY);

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Stripe Server is Running....");
});

try {
  app.post("/create-payment-intent", async (req, res) => {
    const { price } = req.body;
    const amount = price * 100;
    if (amount) {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: "usd",
        payment_method_types: ["card"],
      });

      res.send({
        clientSecret: paymentIntent.client_secret,
      });
    }  
  });
} catch (error) {
  console.log(error);
}


app.listen(port, () => {
  console.log(`Stripe Server listening on port ${port}`);
});
