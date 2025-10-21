# Business Flow Documentation

## Overview

This document describes the complete business flow from initial customer offer to final invoice payment, including all intermediate steps and business rules.

## Business Flow Diagram

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│    Offer    │───▶│    Order    │───▶│   Delivery  │───▶│   Invoice   │
│             │    │             │    │    Note     │    │             │
│ • Quotation │    │ • Processing│    │ • Shipping  │    │ • Billing   │
│ • Pricing   │    │ • Fulfillment│   │ • Tracking  │    │ • Payment   │
│ • Approval  │    │ • Inventory │    │ • Confirmation│  │ • Collection│
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │                   │
       ▼                   ▼                   ▼                   ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Events    │    │   Events    │    │   Events    │    │   Events    │
│ • Created   │    │ • Created   │    │ • Created   │    │ • Created   │
│ • Approved  │    │ • Confirmed │    │ • Shipped   │    │ • Paid      │
│ • Rejected  │    │ • Shipped   │    │ • Delivered │    │ • Overdue   │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │                   │
       └───────────────────┼───────────────────┼───────────────────┘
                           │                   │
                    ┌─────────────┐    ┌─────────────┐
                    │   Audit     │    │ Notification│
                    │   Trail     │    │   Service   │
                    └─────────────┘    └─────────────┘
```

## Detailed Business Flow

### Phase 1: Offer Creation and Management

#### 1.1 Offer Creation
**Trigger**: Customer requests quotation or sales representative initiates offer
**Process**:
1. Sales representative creates offer in system
2. System generates unique offer number (format: `OFF-YYYY-NNNN`)
3. Customer and product information is validated
4. Pricing calculations are performed (base price, discounts, taxes)
5. Offer is saved with status `draft`

**Business Rules**:
- Offer must have valid customer ID
- All line items must have valid product IDs and quantities
- Minimum order value may apply
- Customer credit limit must be checked

**Events Published**:
- `OfferCreated` - When offer is initially created
- `OfferUpdated` - When offer details are modified

#### 1.2 Offer Pricing Calculation
**Process**:
1. Base prices are retrieved from product catalog
2. Customer-specific discounts are applied
3. Volume discounts are calculated based on quantities
4. Taxes are calculated based on customer location
5. Final totals are computed

**Pricing Rules**:
- Customer tier discounts (Bronze: 0%, Silver: 5%, Gold: 10%, Platinum: 15%)
- Volume discounts (100+ units: 5%, 500+ units: 10%, 1000+ units: 15%)
- Seasonal promotions may override standard pricing
- Minimum margin requirements must be maintained

#### 1.3 Offer Approval Workflow
**Process**:
1. Offer is submitted for approval (status: `pending_approval`)
2. Approval workflow is triggered based on offer value:
   - < $10,000: Auto-approved
   - $10,000 - $50,000: Manager approval required
   - $50,000+: Director approval required
3. Approved offers become available for order conversion
4. Rejected offers return to draft status with rejection reason

**Events Published**:
- `OfferSubmitted` - When offer is submitted for approval
- `OfferApproved` - When offer is approved
- `OfferRejected` - When offer is rejected

### Phase 2: Order Processing

#### 2.1 Order Creation from Offer
**Trigger**: Approved offer is converted to order
**Process**:
1. System validates offer is approved and not expired
2. Order is created with reference to original offer
3. Inventory availability is checked for all items
4. Shipping address is validated
5. Order number is generated (format: `ORD-YYYY-NNNN`)
6. Order status is set to `pending`

**Business Rules**:
- Offer must be approved and within validity period
- Customer must have sufficient credit limit
- All items must be available in inventory
- Shipping address must be valid and deliverable

**Events Published**:
- `OrderCreated` - When order is created from offer
- `InventoryReserved` - When inventory is successfully reserved

#### 2.2 Inventory Management
**Process**:
1. System checks inventory levels for all ordered items
2. Inventory is reserved for the order
3. If insufficient inventory, order is placed on backorder
4. Inventory allocation is tracked with reservation IDs

**Inventory Rules**:
- Safety stock levels must be maintained
- Reserved inventory is held for 24 hours
- Partial fulfillment is allowed if customer approves
- Backorder items are automatically ordered from suppliers

#### 2.3 Order Confirmation
**Process**:
1. Order is reviewed for accuracy
2. Customer is notified of order confirmation
3. Order status changes to `confirmed`
4. Fulfillment process is initiated

**Events Published**:
- `OrderConfirmed` - When order is confirmed
- `OrderNotificationSent` - When confirmation is sent to customer

### Phase 3: Fulfillment and Delivery

#### 3.1 Delivery Note Creation
**Trigger**: Confirmed order is ready for shipping
**Process**:
1. Delivery note is generated from order
2. Shipping details are added (carrier, method, tracking)
3. Items are packed and serial numbers are recorded
4. Delivery note number is generated (format: `DN-YYYY-NNNN`)
5. Status is set to `ready_for_shipping`

**Business Rules**:
- All items must be available and reserved
- Serial numbers must be recorded for tracked items
- Shipping method must be appropriate for item type
- Delivery address must be validated

**Events Published**:
- `DeliveryNoteCreated` - When delivery note is created
- `ItemsPacked` - When items are packed and ready

#### 3.2 Shipping Process
**Process**:
1. Items are picked from warehouse
2. Package is prepared with delivery note
3. Carrier is notified for pickup
4. Tracking information is updated
5. Status changes to `in_transit`

**Shipping Rules**:
- Fragile items require special handling
- Hazardous materials need special documentation
- International shipments require customs forms
- Insurance is required for high-value items

**Events Published**:
- `OrderShipped` - When order is shipped
- `TrackingUpdated` - When tracking information is updated

#### 3.3 Delivery Confirmation
**Process**:
1. Carrier delivers package to customer
2. Delivery confirmation is received
3. Customer signature is recorded (if required)
4. Status changes to `delivered`
5. Customer satisfaction survey is triggered

**Events Published**:
- `OrderDelivered` - When order is delivered
- `DeliveryConfirmed` - When delivery is confirmed

### Phase 4: Invoicing and Payment

#### 4.1 Invoice Generation
**Trigger**: Delivery note is confirmed as delivered
**Process**:
1. Invoice is generated from delivery note
2. Final pricing is calculated (including any changes)
3. Payment terms are applied
4. Invoice number is generated (format: `INV-YYYY-NNNN`)
5. Due date is calculated based on payment terms

**Business Rules**:
- Invoice must reference valid delivery note
- Pricing must match final delivered items
- Payment terms are based on customer credit rating
- Early payment discounts may apply

**Events Published**:
- `InvoiceCreated` - When invoice is generated
- `InvoiceSent` - When invoice is sent to customer

#### 4.2 Payment Processing
**Process**:
1. Customer receives invoice
2. Payment is processed through various methods
3. Payment is recorded in system
4. Invoice status is updated to `paid`
5. Receipt is generated and sent

**Payment Methods**:
- Credit Card (processed immediately)
- Bank Transfer (requires verification)
- Check (manual processing required)
- Cash (for COD orders)

**Events Published**:
- `PaymentReceived` - When payment is received
- `InvoicePaid` - When invoice is fully paid

#### 4.3 Collections Management
**Process**:
1. Overdue invoices are identified
2. Reminder notices are sent to customers
3. Collection activities are initiated if needed
4. Payment plans may be negotiated
5. Bad debt is written off if uncollectible

**Collection Rules**:
- First reminder sent 7 days after due date
- Second reminder sent 14 days after due date
- Final notice sent 30 days after due date
- Account may be suspended for non-payment

**Events Published**:
- `InvoiceOverdue` - When invoice becomes overdue
- `PaymentReminderSent` - When reminder is sent
- `AccountSuspended` - When account is suspended

## Business Rules Summary

### Customer Management
- New customers require credit check
- Credit limits are assigned based on credit rating
- Customer tier determines pricing and terms
- Account suspension for non-payment

### Pricing Rules
- Base prices from product catalog
- Customer-specific discounts
- Volume discounts for large orders
- Seasonal promotions
- Minimum margin requirements

### Inventory Management
- Safety stock levels must be maintained
- Reserved inventory held for 24 hours
- Partial fulfillment allowed
- Automatic reordering for backorders

### Payment Terms
- Standard terms: Net 30 days
- Early payment discount: 2% for payment within 10 days
- Credit card: Payment due immediately
- COD: Payment due on delivery

### Approval Workflows
- Offers < $10,000: Auto-approved
- Offers $10,000-$50,000: Manager approval
- Offers > $50,000: Director approval
- Special pricing: Always requires approval

## Exception Handling

### Order Exceptions
- **Inventory Shortage**: Order placed on backorder, customer notified
- **Address Invalid**: Order held pending address correction
- **Credit Limit Exceeded**: Order held pending credit increase

### Delivery Exceptions
- **Delivery Failed**: Re-delivery scheduled, customer notified
- **Damaged Goods**: Replacement items sent, damaged items returned
- **Wrong Address**: Items returned, correct address obtained

### Payment Exceptions
- **Payment Declined**: Customer notified, alternative payment requested
- **Partial Payment**: Remaining balance tracked, follow-up scheduled
- **Payment Dispute**: Investigation initiated, customer contacted

## Integration Points

### External Systems
- **CRM System**: Customer data synchronization
- **Accounting System**: Financial data export
- **Warehouse Management**: Inventory updates
- **Shipping Carriers**: Tracking and delivery updates
- **Payment Gateways**: Payment processing
- **Bank APIs**: Transaction reconciliation
- **Tax Services**: Tax calculation and reporting

### Internal Systems
- **Customer Registry**: Centralized customer data management
- **Payment Service**: Payment processing and tracking
- **Accounting Service**: General ledger and financial reporting
- **User Management**: Authentication and authorization
- **Audit System**: Event logging and compliance
- **Notification System**: Email and SMS notifications
- **Reporting System**: Business intelligence and analytics

## Shared Services Integration

### Customer Registry Integration
All services integrate with the Customer & Company Registry for:
- Customer validation and lookup
- Address and contact information
- Tax ID and registration validation
- Bank account details for payments
- Tenant isolation and multi-tenancy support

### Payment Service Integration
The Payment Service provides:
- Payment processing for invoices
- Payment method management
- Refund and chargeback handling
- Bank reconciliation capabilities
- Payment gateway integrations

### Accounting Service Integration
The Accounting Service handles:
- Automatic posting of financial transactions
- General ledger maintenance
- Chart of accounts management
- Financial reporting and analytics
- Integration with external accounting systems
