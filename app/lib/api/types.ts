export type CompanyType = 'CUSTOMER' | 'SUPPLIER' | 'PARTNER' | 'INTERNAL';
export type RelationType = 'SUPPLIER' | 'CUSTOMER' | 'PARTNER';
export type RelationStatus = 'ACTIVE' | 'INACTIVE';
export type OrderStatus = 'DRAFT' | 'CONFIRMED' | 'FULFILLED' | 'CANCELLED';
export type OfferStatus = 'DRAFT' | 'SENT' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';
export type InvoiceStatus = 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE' | 'CANCELLED';
export type InvoiceType = 'INVOICE' | 'CREDIT_NOTE' | 'DEBIT_NOTE';
export type DeliveryStatus = 'PREPARED' | 'DELIVERED' | 'RETURNED';

export interface Company {
  id: string;
  name: string;
  type: CompanyType;
  taxNumber: string;
  registrationNumber?: string;
  email?: string;
  phone?: string;
  website?: string;
  address: string;
  city: string;
  country: string;
  postalCode?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  contacts?: Contact[];
  sourceRelations?: Relationship[];
  targetRelations?: Relationship[];
}

export interface Contact {
  id: string;
  companyId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  position?: string;
  department?: string;
  tags?: string[];
  notes?: string;
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  company?: Company;
}

export interface Relationship {
  id: string;
  sourceCompanyId: string;
  targetCompanyId: string;
  relationType: RelationType;
  status: RelationStatus;
  createdAt: string;
  updatedAt: string;
  sourceCompany?: Company;
  targetCompany?: Company;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  pagination?: PaginationMeta;
  meta?: {
    timestamp: string;
  };
}

export interface CompanyFilters {
  page?: number;
  limit?: number;
  name?: string;
  type?: CompanyType;
  country?: string;
}

export interface ContactFilters {
  page?: number;
  limit?: number;
  companyId?: string;
  name?: string;
}

export interface RelationshipFilters {
  page?: number;
  limit?: number;
  companyId?: string;
  relationType?: RelationType;
  status?: RelationStatus;
}

export interface CreateCompanyInput {
  name: string;
  type: CompanyType;
  taxNumber: string;
  registrationNumber?: string;
  email?: string;
  phone?: string;
  website?: string;
  address: string;
  city: string;
  country: string;
  postalCode?: string;
  notes?: string;
}

export interface UpdateCompanyInput extends Partial<CreateCompanyInput> {}

export interface CreateContactInput {
  companyId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  position?: string;
  department?: string;
  tags?: string[];
  notes?: string;
  isPrimary?: boolean;
}

export interface UpdateContactInput extends Partial<Omit<CreateContactInput, 'companyId'>> {}

export interface CreateRelationshipInput {
  sourceCompanyId: string;
  targetCompanyId: string;
  relationType: RelationType;
  status?: RelationStatus;
}

export interface UpdateRelationshipInput extends Partial<Omit<CreateRelationshipInput, 'sourceCompanyId' | 'targetCompanyId'>> {}

export interface Order {
  id: string;
  orderNo: string;
  offerId?: string;
  companyId: string;
  customerId: string;
  items: any;
  subtotal: number;
  tax: number;
  total: number;
  currency: string;
  status: OrderStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  company?: Company;
  customer?: Company;
  offer?: Offer;
}

export interface Offer {
  id: string;
  offerNo: string;
  companyId: string;
  customerId: string;
  items: any;
  subtotal: number;
  tax: number;
  total: number;
  currency: string;
  validUntil?: string;
  status: OfferStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  company?: Company;
  customer?: Company;
}

export interface Invoice {
  id: string;
  invoiceNo: string;
  companyId: string;
  customerId: string;
  deliveryId?: string;
  items: any;
  subtotal: number;
  tax: number;
  total: number;
  currency: string;
  type: InvoiceType;
  status: InvoiceStatus;
  issueDate: string;
  dueDate?: string;
  paidAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  company?: Company;
  customer?: Company;
  delivery?: Delivery;
}

export interface Delivery {
  id: string;
  deliveryNo: string;
  orderId: string;
  companyId: string;
  customerId: string;
  items: any;
  status: DeliveryStatus;
  deliveryDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  order?: Order;
  company?: Company;
  customer?: Company;
}

