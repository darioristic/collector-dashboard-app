// Company Events
export const COMPANY_EVENTS = {
  CREATED: 'company.created',
  UPDATED: 'company.updated',
  DELETED: 'company.deleted',
} as const;

// Contact Events
export const CONTACT_EVENTS = {
  CREATED: 'contact.created',
  UPDATED: 'contact.updated',
  DELETED: 'contact.deleted',
} as const;

// Relationship Events
export const RELATIONSHIP_EVENTS = {
  CREATED: 'relationship.created',
  UPDATED: 'relationship.updated',
  DELETED: 'relationship.deleted',
} as const;

// Offer Events
export const OFFER_EVENTS = {
  CREATED: 'offer.created',
  UPDATED: 'offer.updated',
  SENT: 'offer.sent',
  ACCEPTED: 'offer.accepted',
  REJECTED: 'offer.rejected',
  EXPIRED: 'offer.expired',
} as const;

// Order Events
export const ORDER_EVENTS = {
  CREATED: 'order.created',
  UPDATED: 'order.updated',
  CONFIRMED: 'order.confirmed',
  FULFILLED: 'order.fulfilled',
  CANCELLED: 'order.cancelled',
} as const;

// Delivery Events
export const DELIVERY_EVENTS = {
  CREATED: 'delivery.created',
  UPDATED: 'delivery.updated',
  DELIVERED: 'delivery.delivered',
  SIGNED: 'delivery.signed',
} as const;

// Invoice Events
export const INVOICE_EVENTS = {
  CREATED: 'invoice.created',
  UPDATED: 'invoice.updated',
  SENT: 'invoice.sent',
  PAID: 'invoice.paid',
  OVERDUE: 'invoice.overdue',
  CANCELLED: 'invoice.cancelled',
} as const;

export type CompanyEventType = typeof COMPANY_EVENTS[keyof typeof COMPANY_EVENTS];
export type ContactEventType = typeof CONTACT_EVENTS[keyof typeof CONTACT_EVENTS];
export type RelationshipEventType = typeof RELATIONSHIP_EVENTS[keyof typeof RELATIONSHIP_EVENTS];
export type OfferEventType = typeof OFFER_EVENTS[keyof typeof OFFER_EVENTS];
export type OrderEventType = typeof ORDER_EVENTS[keyof typeof ORDER_EVENTS];
export type DeliveryEventType = typeof DELIVERY_EVENTS[keyof typeof DELIVERY_EVENTS];
export type InvoiceEventType = typeof INVOICE_EVENTS[keyof typeof INVOICE_EVENTS];

