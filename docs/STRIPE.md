# Stripe Billing Integration Guide

This guide covers setting up Stripe billing for subscription management in your AI Foundry application.

## Overview

The billing system includes:
- **Subscription Plans** - Monthly and yearly tiers
- **Checkout Sessions** - Secure payment processing
- **Customer Portal** - Self-service billing management
- **Webhooks** - Real-time subscription updates

## Stripe Account Setup

1. **Create Stripe Account**
   - Sign up at [stripe.com](https://stripe.com)
   - Complete business verification
   - Note your account ID for webhooks

2. **Get API Keys**
   - Dashboard → Developers → API Keys
   - Copy publishable key (starts with `pk_`)
   - Copy secret key (starts with `sk_`)

## Product and Pricing Setup

### Create Products

1. **Go to Products** in Stripe Dashboard
2. **Create Product**: "AI Foundry Starter"
   - Description: "Perfect for individuals and small projects"
   - Add pricing:
     - Monthly: $9/month
     - Yearly: $90/year (save $18)

3. **Create Product**: "AI Foundry Professional" 
   - Description: "Ideal for growing businesses and teams"
   - Add pricing:
     - Monthly: $29/month  
     - Yearly: $290/year (save $58)

4. **Copy Price IDs**
   - Each price has an ID like `price_1234567890`
   - You'll need these for environment variables

### Environment Variables

```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_51ABC...  # Your secret key
STRIPE_WEBHOOK_SECRET=whsec_123...  # Webhook endpoint secret
STRIPE_PRICE_MONTHLY=price_123...   # Monthly plan price ID
STRIPE_PRICE_YEARLY=price_456...    # Yearly plan price ID

# Public key (Next.js will expose this)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51ABC...
```

## Webhook Configuration

### Create Webhook Endpoint

1. **Dashboard → Developers → Webhooks**
2. **Add Endpoint**
   - URL: `https://yourdomain.com/api/webhooks/stripe`
   - Events to send:
     - `checkout.session.completed`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_succeeded`
     - `invoice.payment_failed`

3. **Copy Webhook Secret**
   - Click on the webhook endpoint
   - Copy the signing secret (`whsec_...`)
   - Add to `STRIPE_WEBHOOK_SECRET` environment variable

### Webhook Verification

The webhook handler verifies signatures automatically:

```typescript
// In /api/webhooks/stripe/route.ts
const event = stripe.webhooks.constructEvent(
  payload, 
  signature, 
  process.env.STRIPE_WEBHOOK_SECRET
);
```

## Checkout Flow

### Create Checkout Session

```typescript
// Example: Create checkout session
const session = await stripe.checkout.sessions.create({
  mode: 'subscription',
  payment_method_types: ['card'],
  line_items: [{
    price: process.env.STRIPE_PRICE_MONTHLY,
    quantity: 1,
  }],
  success_url: `${process.env.NEXTAUTH_URL}/dashboard?success=true`,
  cancel_url: `${process.env.NEXTAUTH_URL}/pricing?canceled=true`,
  customer_email: user.email,
});
```

### Customer Portal

For subscription management:

```typescript
const portalSession = await stripe.billingPortal.sessions.create({
  customer: subscription.stripeCustomerId,
  return_url: `${process.env.NEXTAUTH_URL}/account`,
});
```

## Database Integration

### Subscription Model

The Prisma schema includes subscription tracking:

```prisma
model Subscription {
  id                   String   @id @default(cuid())
  userId               String   @unique
  stripeCustomerId     String   @unique
  stripeSubscriptionId String?  @unique
  stripePriceId        String?
  status               String   // active, canceled, incomplete, etc.
  plan                 String   // monthly, yearly
  currentPeriodStart   DateTime?
  currentPeriodEnd     DateTime?
  createdAt            DateTime @default(now())
  updatedAt            DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

### Webhook Event Handling

The webhook handler updates the database automatically:

```typescript
// Handle checkout completion
case 'checkout.session.completed':
  await prisma.subscription.upsert({
    where: { stripeCustomerId: session.customer },
    update: { 
      stripeSubscriptionId: session.subscription,
      status: 'active'
    },
    create: {
      stripeCustomerId: session.customer,
      stripeSubscriptionId: session.subscription,
      // ... other fields
    }
  });
  break;
```

## Testing

### Test Mode

1. **Use Test API Keys** (start with `sk_test_` and `pk_test_`)
2. **Test Card Numbers**:
   - Success: `4242 4242 4242 4242`
   - Declined: `4000 0000 0000 0002`
   - Requires authentication: `4000 0025 0000 3155`

3. **Test Webhooks**:
   - Use Stripe CLI: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
   - Or use ngrok for local testing

### Webhook Testing

```bash
# Install Stripe CLI
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Trigger test events
stripe trigger checkout.session.completed
stripe trigger customer.subscription.updated
```

## Pricing Page Integration

### Dynamic Pricing

Fetch prices from Stripe for real-time accuracy:

```typescript
const prices = await stripe.prices.list({
  product: 'prod_your_product_id',
  active: true,
});
```

### Checkout Button

```typescript
const handleCheckout = async (priceId: string) => {
  const response = await fetch('/api/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ priceId }),
  });
  
  const { sessionId } = await response.json();
  
  const stripe = await getStripe();
  await stripe.redirectToCheckout({ sessionId });
};
```

## Production Considerations

### Security

1. **Webhook Signature Verification**
   - Always verify webhook signatures
   - Use HTTPS endpoints only
   - Set proper CORS headers

2. **API Key Security**
   - Never expose secret keys in frontend code
   - Use environment variables
   - Rotate keys regularly

### Monitoring

1. **Stripe Dashboard**
   - Monitor failed payments
   - Track subscription metrics
   - Review webhook delivery

2. **Application Logs**
   - Log webhook events
   - Monitor subscription status changes
   - Track billing errors

### Error Handling

```typescript
// Example: Handle failed payments
case 'invoice.payment_failed':
  // Notify user
  // Update subscription status
  // Implement retry logic
  break;
```

## Common Issues

### Webhook Failures

1. **Check endpoint URL** is publicly accessible
2. **Verify signature verification** is working
3. **Return 200 status** for successful processing
4. **Check webhook logs** in Stripe dashboard

### Customer Portal Issues

1. **Ensure customer exists** in Stripe
2. **Verify return URL** is accessible
3. **Check customer permissions**

### Subscription Sync Issues

1. **Handle webhook delivery delays**
2. **Implement idempotency** for webhook processing
3. **Add reconciliation process** for data consistency

## Go Live Checklist

- [ ] Switch to live API keys
- [ ] Update webhook endpoints to production URLs
- [ ] Configure business information in Stripe
- [ ] Set up bank account for payouts
- [ ] Enable production features (subscriptions, portal)
- [ ] Test checkout flow end-to-end
- [ ] Verify webhook delivery in production
- [ ] Set up monitoring and alerts

## Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe CLI](https://stripe.com/docs/stripe-cli)
- [Webhook Best Practices](https://stripe.com/docs/webhooks/best-practices)
- [Subscription Lifecycle](https://stripe.com/docs/billing/subscriptions/overview)