# Architecture Documentation

## System Design Principles

### 1. Microservices Architecture
Each business domain is implemented as an independent service with its own:
- Database schema
- Business logic
- API endpoints
- Deployment pipeline

### 2. Event-Driven Communication
Services communicate through events rather than direct API calls:
- Loose coupling between services
- Better scalability and fault tolerance
- Audit trail through event sourcing
- Support for eventual consistency

### 3. Domain-Driven Design (DDD)
Each service represents a bounded context:
- **Offers Domain**: Customer quotations and pricing
- **Orders Domain**: Order processing and fulfillment
- **Delivery Domain**: Shipping and logistics
- **Invoices Domain**: Billing and payment processing
- **CRM Domain**: Customer relationship management and sales pipeline

## Service Architecture

### Core Services

#### Offers Service (`apps/offers-service`)
**Port**: 3001
**Database**: `financial_offers`
**Responsibilities**:
- Manage customer offers and quotations
- Calculate pricing with discounts and taxes
- Handle offer approval workflows
- Track offer lifecycle (draft → sent → approved/rejected)

**Key Entities**:
```typescript
interface Offer {
  id: string;
  customerId: string;
  offerNumber: string;
  status: OfferStatus;
  validUntil: Date;
  items: OfferItem[];
  totals: OfferTotals;
  metadata: OfferMetadata;
}

interface OfferItem {
  productId: string;
  quantity: number;
  unitPrice: number;
  discount: Discount;
  tax: Tax;
}
```

#### Orders Service (`apps/orders-service`)
**Port**: 3002
**Database**: `financial_orders`
**Responsibilities**:
- Process orders from approved offers
- Validate inventory availability
- Manage order status and workflow
- Coordinate with fulfillment systems

**Key Entities**:
```typescript
interface Order {
  id: string;
  offerId?: string;
  customerId: string;
  orderNumber: string;
  status: OrderStatus;
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress: Address;
  totals: OrderTotals;
}
```

#### Delivery Notes Service (`apps/delivery-notes-service`)
**Port**: 3003
**Database**: `financial_delivery_notes`
**Responsibilities**:
- Generate delivery documentation
- Track shipping and delivery
- Manage inventory deduction
- Handle delivery confirmations

**Key Entities**:
```typescript
interface DeliveryNote {
  id: string;
  orderId: string;
  deliveryNoteNumber: string;
  status: DeliveryStatus;
  items: DeliveryItem[];
  shippingDetails: ShippingDetails;
  deliveryDate?: Date;
}
```

#### Invoices Service (`apps/invoices-service`)
**Port**: 3004
**Database**: `financial_invoices`
**Responsibilities**:
- Generate invoices from delivery notes
- Calculate taxes and fees
- Track payments and collections
- Manage dunning processes

**Key Entities**:
```typescript
interface Invoice {
  id: string;
  deliveryNoteId: string;
  invoiceNumber: string;
  status: InvoiceStatus;
  items: InvoiceItem[];
  totals: InvoiceTotals;
  paymentTerms: PaymentTerms;
  dueDate: Date;
}
```

### Supporting Services

#### Audit Service (`apps/audit-service`)
**Port**: 3005
**Database**: `financial_audit`
**Responsibilities**:
- Store all domain events
- Provide audit trail queries
- Support event replay
- Generate compliance reports

#### Notification Service (`apps/notification-service`)
**Port**: 3006
**Database**: `financial_notifications`
**Responsibilities**:
- Send emails and SMS notifications
- Manage notification templates
- Track delivery status
- Handle notification preferences

### Shared Services

#### Customer & Company Registry Service (`apps/customer-registry-service`)
**Port**: 3007
**Database**: `financial_customers`
**Responsibilities**:
- Manage customer and company master data
- Validate tax IDs and registration numbers
- Handle address and contact information
- Store bank account details
- Provide lookup APIs for other services
- Support tenant isolation

**Key Entities**:
```typescript
interface Customer {
  id: string;
  name: string;
  taxId: string;
  registrationNo: string;
  type: 'individual' | 'company';
  address: Address;
  contacts: Contact[];
  bankAccounts: BankAccount[];
  isTenant: boolean;
  tenantId?: string;
  status: 'active' | 'inactive' | 'suspended';
  metadata: CustomerMetadata;
}

interface Company {
  id: string;
  name: string;
  legalName: string;
  taxId: string;
  registrationNo: string;
  address: Address;
  contacts: Contact[];
  bankAccounts: BankAccount[];
  isTenant: boolean;
  parentCompanyId?: string;
  subsidiaries: string[];
  status: 'active' | 'inactive';
}
```

#### Payment Service (`apps/payment-service`)
**Port**: 3008
**Database**: `financial_payments`
**Responsibilities**:
- Process invoice payments
- Handle refunds and chargebacks
- Integrate with payment gateways
- Reconcile bank transactions
- Manage payment methods
- Track payment history

**Key Entities**:
```typescript
interface Payment {
  id: string;
  invoiceId: string;
  customerId: string;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  gatewayTransactionId?: string;
  processedAt: Date;
  metadata: PaymentMetadata;
}

interface PaymentMethod {
  id: string;
  customerId: string;
  type: 'credit_card' | 'bank_transfer' | 'check' | 'cash';
  details: PaymentMethodDetails;
  isDefault: boolean;
  status: 'active' | 'inactive';
}
```

#### Accounting Service (`apps/accounting-service`)
**Port**: 3009
**Database**: `financial_accounting`
**Responsibilities**:
- Post financial transactions
- Maintain general ledger
- Manage chart of accounts
- Generate financial reports
- Integrate with external accounting systems

**Key Entities**:
```typescript
interface Transaction {
  id: string;
  tenantId: string;
  accountId: string;
  debit: number;
  credit: number;
  currency: string;
  description: string;
  reference: string;
  postedAt: Date;
  metadata: TransactionMetadata;
}

interface ChartOfAccounts {
  id: string;
  tenantId: string;
  code: string;
  name: string;
  type: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
  parentId?: string;
  isActive: boolean;
}
```

### Platform Services

#### Core Platform Service (`apps/core-platform-service`)
**Port**: 3010
**Database**: `financial_platform`
**Responsibilities**:
- Manage object definitions and metadata
- Handle dynamic field creation and modification
- Define entity relationships
- Manage permission schemas
- Support schema evolution
- Provide metadata-driven APIs

**Key Entities**:
```typescript
interface ObjectDefinition {
  id: string;
  name: string;
  label: string;
  pluralLabel: string;
  description: string;
  tenantId: string;
  fields: FieldDefinition[];
  relationships: RelationshipDefinition[];
  permissions: PermissionDefinition[];
  layouts: LayoutDefinition[];
  version: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface FieldDefinition {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'boolean' | 'picklist' | 'lookup' | 'master_detail';
  required: boolean;
  unique: boolean;
  defaultValue?: any;
  length?: number;
  precision?: number;
  scale?: number;
  picklistValues?: PicklistValue[];
  referenceTo?: string;
  description?: string;
  helpText?: string;
  isCustom: boolean;
  isSystem: boolean;
}

interface RelationshipDefinition {
  id: string;
  name: string;
  type: 'lookup' | 'master_detail' | 'many_to_many';
  parentObject: string;
  childObject: string;
  parentField: string;
  childField: string;
  cascadeDelete: boolean;
  required: boolean;
}

interface PermissionDefinition {
  id: string;
  objectName: string;
  profileId: string;
  permissions: {
    read: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
    viewAll: boolean;
    modifyAll: boolean;
  };
  fieldPermissions: FieldPermission[];
}

interface LayoutDefinition {
  id: string;
  objectName: string;
  name: string;
  sections: LayoutSection[];
  isDefault: boolean;
}

interface LayoutSection {
  id: string;
  title: string;
  columns: number;
  fields: LayoutField[];
}

interface LayoutField {
  fieldName: string;
  required: boolean;
  readOnly: boolean;
  width: number;
}
```

### Business Services

#### CRM Service (`apps/crm-service`)
**Port**: 3011
**Database**: `financial_crm`
**Responsibilities**:
- Manage leads and opportunities
- Track sales pipeline and forecasting
- Record customer interactions and activities
- Manage tasks and follow-ups
- Generate sales reports and analytics
- Integrate with offers and orders for sales tracking
- Handle customer segmentation and targeting

**Key Entities**:
```typescript
interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  title?: string;
  source: LeadSource;
  status: LeadStatus;
  score: number;
  ownerId: string;
  assignedTo: string;
  createdAt: Date;
  updatedAt: Date;
  metadata: LeadMetadata;
}

interface Opportunity {
  id: string;
  name: string;
  customerId?: string;
  leadId?: string;
  stage: OpportunityStage;
  probability: number;
  expectedValue: number;
  expectedCloseDate: Date;
  actualCloseDate?: Date;
  ownerId: string;
  description?: string;
  source: OpportunitySource;
  createdAt: Date;
  updatedAt: Date;
  metadata: OpportunityMetadata;
}

interface Activity {
  id: string;
  type: ActivityType;
  subject: string;
  description?: string;
  relatedTo: RelatedEntity;
  ownerId: string;
  dueDate?: Date;
  completedDate?: Date;
  status: ActivityStatus;
  priority: ActivityPriority;
  createdAt: Date;
  updatedAt: Date;
  metadata: ActivityMetadata;
}

interface Task {
  id: string;
  title: string;
  description?: string;
  assignedTo: string;
  relatedTo?: RelatedEntity;
  dueDate: Date;
  completedDate?: Date;
  status: TaskStatus;
  priority: TaskPriority;
  type: TaskType;
  createdAt: Date;
  updatedAt: Date;
}

interface CustomerInteraction {
  id: string;
  customerId: string;
  type: InteractionType;
  channel: InteractionChannel;
  subject: string;
  description?: string;
  outcome?: InteractionOutcome;
  ownerId: string;
  duration?: number;
  occurredAt: Date;
  metadata: InteractionMetadata;
}

interface SalesForecast {
  id: string;
  period: string;
  forecastType: ForecastType;
  opportunities: OpportunityForecast[];
  totalValue: number;
  probability: number;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

// Enums and Types
type LeadSource = 'website' | 'referral' | 'cold_call' | 'email' | 'social_media' | 'advertising' | 'event' | 'other';
type LeadStatus = 'new' | 'contacted' | 'qualified' | 'unqualified' | 'converted' | 'lost';
type OpportunityStage = 'prospecting' | 'qualification' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';
type ActivityType = 'call' | 'email' | 'meeting' | 'demo' | 'proposal' | 'follow_up';
type InteractionType = 'call' | 'email' | 'meeting' | 'support' | 'complaint' | 'feedback';
type InteractionChannel = 'phone' | 'email' | 'in_person' | 'video_call' | 'chat' | 'social_media';
```

## Data Architecture

### Database Design

#### Primary Databases
Each service has its own PostgreSQL database:
- `financial_offers` - Offers and quotations
- `financial_orders` - Orders and fulfillment
- `financial_delivery_notes` - Delivery documentation
- `financial_invoices` - Invoicing and payments
- `financial_audit` - Event store and audit trail
- `financial_notifications` - Notification management
- `financial_customers` - Customer and company registry
- `financial_payments` - Payment processing and tracking
- `financial_accounting` - General ledger and accounting
- `financial_platform` - Object definitions and metadata registry
- `financial_crm` - Customer relationship management and sales pipeline

#### Shared Data
Common reference data stored in shared schemas:
- `customers` - Customer master data
- `products` - Product catalog
- `pricing` - Pricing rules and discounts
- `taxes` - Tax configurations
- `addresses` - Address management

### Event Store
All domain events are stored in the audit service:
```sql
CREATE TABLE domain_events (
  id UUID PRIMARY KEY,
  aggregate_id UUID NOT NULL,
  aggregate_type VARCHAR(100) NOT NULL,
  event_type VARCHAR(100) NOT NULL,
  event_version INTEGER NOT NULL,
  event_data JSONB NOT NULL,
  metadata JSONB,
  occurred_at TIMESTAMP WITH TIME ZONE NOT NULL,
  correlation_id UUID,
  causation_id UUID
);
```

## Integration Patterns

### 1. Event-Driven Integration
Services publish events for state changes:
```typescript
// Example: Offer approved event
{
  eventType: 'OfferApproved',
  aggregateId: 'offer-123',
  eventData: {
    offerId: 'offer-123',
    customerId: 'customer-456',
    approvedBy: 'user-789',
    approvedAt: '2024-01-15T10:30:00Z'
  },
  metadata: {
    correlationId: 'corr-123',
    causationId: 'cmd-456'
  }
}
```

### 2. Saga Pattern
Long-running transactions managed through sagas:
```typescript
// Order Processing Saga
1. Create Order → Publish OrderCreated
2. Reserve Inventory → Publish InventoryReserved
3. Generate Delivery Note → Publish DeliveryNoteCreated
4. Send Notification → Publish NotificationSent
5. Complete Order → Publish OrderCompleted
```

### 3. CQRS (Command Query Responsibility Segregation)
Separate read and write models:
- **Commands**: Modify state, trigger events
- **Queries**: Read optimized views
- **Projections**: Denormalized read models

## Security Architecture

### Authentication & Authorization
- **JWT Tokens**: Stateless authentication
- **RBAC**: Role-based access control
- **API Keys**: Service-to-service communication
- **OAuth 2.0**: Third-party integrations

### Data Security
- **Encryption**: AES-256 for data at rest
- **TLS**: HTTPS/TLS for data in transit
- **PII Protection**: Data masking and anonymization
- **Audit Logging**: Complete audit trail

## Scalability & Performance

### Horizontal Scaling
- Stateless services for easy scaling
- Database read replicas
- Redis clustering for cache
- RabbitMQ clustering for message broker

### Caching Strategy
- **L1 Cache**: In-memory application cache
- **L2 Cache**: Redis distributed cache
- **CDN**: Static content delivery
- **Database**: Query result caching

### Performance Optimization
- Database indexing strategies
- Connection pooling
- Async processing for heavy operations
- Circuit breakers for external calls

## Monitoring & Observability

### Metrics
- **Application Metrics**: Response times, error rates
- **Business Metrics**: Order volume, revenue
- **Infrastructure Metrics**: CPU, memory, disk usage
- **Custom Metrics**: Domain-specific KPIs

### Logging
- **Structured Logging**: JSON format with correlation IDs
- **Log Levels**: DEBUG, INFO, WARN, ERROR
- **Log Aggregation**: Centralized log collection
- **Log Retention**: Configurable retention policies

### Tracing
- **Distributed Tracing**: Request flow across services
- **Performance Profiling**: Bottleneck identification
- **Error Tracking**: Exception monitoring
- **Alerting**: Proactive issue detection

## Deployment Architecture

### Containerization
- **Multi-stage Docker builds** for optimized images
- **Health checks** for container monitoring
- **Resource limits** for resource management
- **Security scanning** for vulnerability detection

### Kubernetes Deployment
- **Namespace isolation** for environment separation
- **Resource quotas** for resource management
- **Auto-scaling** based on metrics
- **Rolling updates** for zero-downtime deployments

### CI/CD Pipeline
- **GitOps workflow** for deployment automation
- **Automated testing** at multiple levels
- **Security scanning** in pipeline
- **Environment promotion** with approval gates
