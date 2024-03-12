const express = require('express');
const Stripe = require('stripe');

require('dotenv').config();

const stripe = Stripe(process.env.STRIPE_KEY);

const router = express.Router();

router.post('/create-checkout-session', async (req, res) => {
  // Warunek sprawdzający czy reservedCar istnieje w req.body
  if (!req.body.reservedCar) {
    // Jeśli nie istnieje to:
    return res.status(400).json({ error: 'Invalid data of reserved car.' });
  }

  const { reservedCar, startDate, endDate } = req.body;
  const roundedTotalRentalPrice = parseFloat(req.body.roundedTotalRentalPrice);

  if (isNaN(roundedTotalRentalPrice)) {
    return res.status(400).json({ error: 'Invalid roundedTotalRentalPrice.' });
  }
  
  const { _id, brand, model, images } = reservedCar;

  // Tworzenie line_items na podstawie reservedCar
  const line_items = [
    {
      price_data: {
        currency: 'pln',
        product_data: {
          name: `Płatność za wypożyczenie pojazdu: ${brand} ${model}`,
          images,
          description: `Data rozpoczęcia okresu wypożyczenia: ${startDate} Data zakończenia okresu wypożyczenia: ${endDate}`,
          metadata: {
            id: _id,
          },
        },
        unit_amount: Math.ceil(roundedTotalRentalPrice * 100), // Zmieniona cena na obliczoną wartość
      },
      quantity: 1,
    },
  ];

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card','paypal','blik'],
    phone_number_collection: {
      enabled: true
    },
    line_items,
    mode: 'payment',
    success_url: `${process.env.CLIENT_URL}/checkout-success`,
    cancel_url: `${process.env.CLIENT_URL}/shop`,
  });

  res.json({ url: session.url });
});

module.exports = router;
