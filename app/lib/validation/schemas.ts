import { z } from 'zod';

export const CompanySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.enum(['CUSTOMER', 'SUPPLIER', 'PARTNER', 'INTERNAL']),
  taxNumber: z.string().min(1, 'Tax number is required'),
  registrationNumber: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  country: z.string().min(1, 'Country is required'),
  postalCode: z.string().optional(),
  notes: z.string().optional(),
});

export const UpdateCompanySchema = CompanySchema.partial();

export const ContactSchema = z.object({
  companyId: z.string().uuid(),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  position: z.string().optional(),
  department: z.string().optional(),
  tags: z.array(z.string()).optional(),
  notes: z.string().optional(),
  isPrimary: z.boolean().default(false),
});

export const UpdateContactSchema = ContactSchema.partial().omit({ companyId: true });

export const RelationshipSchema = z.object({
  sourceCompanyId: z.string().uuid(),
  targetCompanyId: z.string().uuid(),
  relationType: z.enum(['SUPPLIER', 'CUSTOMER', 'PARTNER']),
  status: z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE'),
});

export const UpdateRelationshipSchema = RelationshipSchema.partial().omit({
  sourceCompanyId: true,
  targetCompanyId: true,
});

export const QueryParamsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export const CompanyQuerySchema = QueryParamsSchema.extend({
  name: z.string().optional(),
  type: z.enum(['CUSTOMER', 'SUPPLIER', 'PARTNER', 'INTERNAL']).optional(),
  country: z.string().optional(),
});

export const ContactQuerySchema = QueryParamsSchema.extend({
  companyId: z.string().uuid().optional(),
  name: z.string().optional(),
});

export const RelationshipQuerySchema = QueryParamsSchema.extend({
  companyId: z.string().uuid().optional(),
  relationType: z.enum(['SUPPLIER', 'CUSTOMER', 'PARTNER']).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
});

export const OfferItemSchema = z.object({
  productId: z.string(),
  productName: z.string(),
  quantity: z.number().positive(),
  price: z.number().positive(),
  taxRate: z.number().min(0).max(100),
  total: z.number(),
});

export const OfferSchema = z.object({
  offerNo: z.string().min(1),
  companyId: z.string().uuid(),
  customerId: z.string().uuid(),
  items: z.array(OfferItemSchema).min(1),
  subtotal: z.number().positive(),
  tax: z.number().min(0),
  total: z.number().positive(),
  currency: z.string().default('EUR'),
  validUntil: z.coerce.date(),
  status: z.enum(['DRAFT', 'SENT', 'ACCEPTED', 'REJECTED', 'EXPIRED']).default('DRAFT'),
  notes: z.string().optional(),
});

export const CreateOfferSchema = OfferSchema.omit({ offerNo: true, status: true });
export const UpdateOfferSchema = OfferSchema.partial().omit({ offerNo: true });

export const OfferQuerySchema = QueryParamsSchema.extend({
  companyId: z.string().uuid().optional(),
  customerId: z.string().uuid().optional(),
  status: z.enum(['DRAFT', 'SENT', 'ACCEPTED', 'REJECTED', 'EXPIRED']).optional(),
});

export const OrderItemSchema = z.object({
  productId: z.string(),
  productName: z.string(),
  quantity: z.number().positive(),
  price: z.number().positive(),
  taxRate: z.number().min(0).max(100),
  total: z.number(),
});

export const OrderSchema = z.object({
  orderNo: z.string().min(1),
  offerId: z.string().uuid().optional(),
  companyId: z.string().uuid(),
  customerId: z.string().uuid(),
  items: z.array(OrderItemSchema).min(1),
  subtotal: z.number().positive(),
  tax: z.number().min(0),
  total: z.number().positive(),
  currency: z.string().default('EUR'),
  status: z.enum(['DRAFT', 'CONFIRMED', 'FULFILLED', 'CANCELLED']).default('DRAFT'),
  notes: z.string().optional(),
});

export const CreateOrderSchema = OrderSchema.omit({ orderNo: true, status: true });
export const UpdateOrderSchema = OrderSchema.partial().omit({ orderNo: true });

export const OrderQuerySchema = QueryParamsSchema.extend({
  companyId: z.string().uuid().optional(),
  customerId: z.string().uuid().optional(),
  status: z.enum(['DRAFT', 'CONFIRMED', 'FULFILLED', 'CANCELLED']).optional(),
});

export const DeliveryItemSchema = z.object({
  productId: z.string(),
  productName: z.string(),
  quantity: z.number().positive(),
});

export const DeliverySchema = z.object({
  deliveryNo: z.string().min(1),
  orderId: z.string().uuid(),
  deliveryDate: z.coerce.date(),
  items: z.array(DeliveryItemSchema).min(1),
  status: z.enum(['PREPARED', 'DELIVERED', 'SIGNED']).default('PREPARED'),
  notes: z.string().optional(),
  signedBy: z.string().optional(),
  signedAt: z.coerce.date().optional(),
});

export const CreateDeliverySchema = DeliverySchema.omit({ deliveryNo: true, status: true });
export const UpdateDeliverySchema = DeliverySchema.partial().omit({ deliveryNo: true });

export const DeliveryQuerySchema = QueryParamsSchema.extend({
  orderId: z.string().uuid().optional(),
  status: z.enum(['PREPARED', 'DELIVERED', 'SIGNED']).optional(),
});

export const InvoiceItemSchema = z.object({
  productId: z.string(),
  productName: z.string(),
  quantity: z.number().positive(),
  price: z.number().positive(),
  taxRate: z.number().min(0).max(100),
  total: z.number(),
});

export const InvoiceSchema = z.object({
  invoiceNo: z.string().min(1),
  companyId: z.string().uuid(),
  customerId: z.string().uuid(),
  deliveryId: z.string().uuid().optional(),
  items: z.array(InvoiceItemSchema).min(1),
  subtotal: z.number().positive(),
  tax: z.number().min(0),
  total: z.number().positive(),
  currency: z.string().default('EUR'),
  type: z.enum(['ISSUED', 'RECEIVED', 'CREDIT_NOTE', 'PROFORMA']).default('ISSUED'),
  status: z.enum(['DRAFT', 'SENT', 'PAID', 'OVERDUE', 'CANCELLED']).default('DRAFT'),
  issueDate: z.coerce.date().default(new Date()),
  dueDate: z.coerce.date(),
  paidAt: z.coerce.date().optional(),
  notes: z.string().optional(),
});

export const CreateInvoiceSchema = InvoiceSchema.omit({ invoiceNo: true, status: true });
export const UpdateInvoiceSchema = InvoiceSchema.partial().omit({ invoiceNo: true });

export const InvoiceQuerySchema = QueryParamsSchema.extend({
  companyId: z.string().uuid().optional(),
  customerId: z.string().uuid().optional(),
  type: z.enum(['ISSUED', 'RECEIVED', 'CREDIT_NOTE', 'PROFORMA']).optional(),
  status: z.enum(['DRAFT', 'SENT', 'PAID', 'OVERDUE', 'CANCELLED']).optional(),
});

