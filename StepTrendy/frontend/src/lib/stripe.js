import { loadStripe } from '@stripe/stripe-js';

let stripePromise;
const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

export function getStripe() {
  if (!stripePromise) {
    stripePromise = loadStripe(stripePublishableKey);
  }
  return stripePromise;
}

// Payment method icons mapping
export const PAYMENT_METHODS = {
  card: { name: 'Credit/Debit Card', icon: '💳' },
  apple_pay: { name: 'Apple Pay', icon: '🍎' },
  google_pay: { name: 'Google Pay', icon: '📱' },
  upi: { name: 'UPI', icon: '📲' },
  net_banking: { name: 'Net Banking', icon: '🏦' },
};

// API functions for Stripe payment flow
export async function createPaymentIntent(amount, currency = 'inr') {
  const res = await fetch('/api/payments/create-intent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount, currency }),
  });
  if (!res.ok) throw new Error('Failed to create payment intent');
  return res.json();
}

export async function confirmPayment(stripe, elements, clientSecret) {
  const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
    payment_method: { card: elements.getElement('card') },
  });
  if (error) throw error;
  return paymentIntent;
}

export async function createCheckoutSession(items, successUrl, cancelUrl) {
  const res = await fetch('/api/payments/create-checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items, successUrl, cancelUrl }),
  });
  if (!res.ok) throw new Error('Failed to create checkout session');
  return res.json();
}
