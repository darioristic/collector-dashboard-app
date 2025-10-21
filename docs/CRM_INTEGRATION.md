# CRM Service Integration Guide

## Overview

The CRM Service provides comprehensive customer relationship management capabilities that integrate seamlessly with the financial microservices platform. It manages the complete sales lifecycle from lead generation to customer retention.

## Key Features

### 🎯 **Lead Management**
- Lead capture and qualification
- Lead scoring and prioritization
- Lead conversion to opportunities
- Lead source tracking and analytics

### 📊 **Sales Pipeline Management**
- Opportunity tracking and forecasting
- Sales stage management
- Probability-based revenue forecasting
- Pipeline analytics and reporting

### 👥 **Customer Interaction Tracking**
- Complete interaction history
- Multi-channel communication tracking
- Activity and task management
- Customer satisfaction monitoring

### 📈 **Sales Analytics & Reporting**
- Sales performance metrics
- Conversion rate analysis
- Revenue forecasting
- Team performance dashboards

## Integration with Existing Services

### Customer Registry Integration
The CRM Service integrates closely with the Customer Registry Service:

```typescript
// Lead to Customer conversion flow
interface LeadConversion {
  leadId: string;
  customerData: {
    name: string;
    email: string;
    phone?: string;
    company?: string;
    address?: Address;
  };
  opportunityData?: {
    name: string;
    expectedValue: number;
    stage: OpportunityStage;
  };
}
```

**Integration Points:**
- Lead conversion creates customer records
- Customer updates sync with CRM activities
- Customer segmentation affects lead scoring
- Customer interaction history enriches CRM data

### Offers Service Integration
CRM tracks the complete sales process through offers:

```typescript
// Opportunity to Offer workflow
interface OpportunityToOffer {
  opportunityId: string;
  offerData: {
    customerId: string;
    items: OfferItem[];
    validUntil: Date;
    notes?: string;
  };
}
```

**Integration Events:**
- `OpportunityCreated` → Create initial offer
- `OfferApproved` → Move opportunity to "negotiation" stage
- `OfferRejected` → Update opportunity probability
- `OrderCreated` → Move opportunity to "closed_won"

### Orders Service Integration
CRM tracks order fulfillment and customer satisfaction:

```typescript
// Order completion tracking
interface OrderCompletion {
  orderId: string;
  opportunityId?: string;
  customerSatisfaction?: number;
  followUpRequired: boolean;
}
```

**Integration Events:**
- `OrderCreated` → Create follow-up task
- `OrderShipped` → Send delivery notification
- `OrderDelivered` → Schedule satisfaction survey
- `CustomerFeedback` → Update customer profile

## CRM Data Model

### Lead Management

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

// Lead scoring algorithm
interface LeadScoring {
  companySize: number;        // 0-25 points
  industry: number;           // 0-15 points
  budget: number;             // 0-20 points
  timeline: number;           // 0-15 points
  decisionMaker: number;      // 0-25 points
  totalScore: number;         // 0-100 points
}
```

### Opportunity Management

```typescript
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

// Opportunity stages with probabilities
const OPPORTUNITY_STAGES = {
  prospecting: { probability: 10, color: '#gray' },
  qualification: { probability: 25, color: '#blue' },
  proposal: { probability: 50, color: '#yellow' },
  negotiation: { probability: 75, color: '#orange' },
  closed_won: { probability: 100, color: '#green' },
  closed_lost: { probability: 0, color: '#red' }
};
```

### Activity & Task Management

```typescript
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
```

## Sales Pipeline Analytics

### Pipeline Visualization
```typescript
interface PipelineData {
  stages: PipelineStage[];
  totalValue: number;
  totalCount: number;
  conversionRates: ConversionRate[];
  trends: PipelineTrend[];
}

interface PipelineStage {
  stage: string;
  count: number;
  value: number;
  probability: number;
  weightedValue: number;
  opportunities: Opportunity[];
}
```

### Sales Forecasting
```typescript
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

interface OpportunityForecast {
  opportunityId: string;
  expectedValue: number;
  probability: number;
  expectedCloseDate: Date;
  confidence: number;
}
```

## CRM Workflows

### Lead Qualification Workflow
```typescript
class LeadQualificationWorkflow {
  async qualifyLead(leadId: string): Promise<QualificationResult> {
    const lead = await this.getLead(leadId);
    
    // Score the lead
    const score = await this.calculateLeadScore(lead);
    
    // Determine qualification status
    const qualification = score >= 70 ? 'qualified' : 'unqualified';
    
    // Update lead status
    await this.updateLeadStatus(leadId, qualification, score);
    
    // Create follow-up task if qualified
    if (qualification === 'qualified') {
      await this.createQualificationTask(leadId);
    }
    
    return { qualification, score };
  }
}
```

### Opportunity Management Workflow
```typescript
class OpportunityWorkflow {
  async moveToNextStage(opportunityId: string): Promise<void> {
    const opportunity = await this.getOpportunity(opportunityId);
    const nextStage = this.getNextStage(opportunity.stage);
    
    // Update opportunity stage
    await this.updateOpportunityStage(opportunityId, nextStage);
    
    // Create stage-specific tasks
    await this.createStageTasks(opportunityId, nextStage);
    
    // Send notifications
    await this.notifyStageChange(opportunityId, nextStage);
    
    // Publish event
    await this.eventBus.publish('OpportunityStageChanged', {
      opportunityId,
      fromStage: opportunity.stage,
      toStage: nextStage
    });
  }
}
```

## Customer Segmentation

### Segmentation Criteria
```typescript
interface CustomerSegment {
  id: string;
  name: string;
  criteria: SegmentCriteria;
  customers: string[];
  lastUpdated: Date;
}

interface SegmentCriteria {
  industry?: string[];
  companySize?: CompanySizeRange;
  revenue?: RevenueRange;
  location?: GeographicCriteria;
  behavior?: BehaviorCriteria;
  lifecycle?: LifecycleStage[];
}

// Automated segmentation
class CustomerSegmentation {
  async segmentCustomers(): Promise<CustomerSegment[]> {
    const customers = await this.customerRegistry.getAllCustomers();
    
    return [
      this.createEnterpriseSegment(customers),
      this.createSMBSegment(customers),
      this.createHighValueSegment(customers),
      this.createAtRiskSegment(customers)
    ];
  }
}
```

## CRM Reporting & Analytics

### Sales Performance Dashboard
```typescript
interface SalesDashboard {
  period: string;
  metrics: {
    totalRevenue: number;
    newCustomers: number;
    customerRetention: number;
    averageDealSize: number;
    salesCycleLength: number;
    conversionRate: number;
  };
  charts: {
    revenueTrend: ChartData;
    pipelineHealth: ChartData;
    teamPerformance: ChartData;
    leadSources: ChartData;
  };
}
```

### Lead Analytics
```typescript
interface LeadAnalytics {
  totalLeads: number;
  conversionRate: number;
  sources: LeadSourceAnalytics[];
  trends: LeadTrend[];
  quality: LeadQualityMetrics;
}

interface LeadSourceAnalytics {
  source: string;
  count: number;
  conversionRate: number;
  averageValue: number;
  costPerLead: number;
}
```

## Integration Events

### CRM Events Published
```typescript
// Lead events
interface LeadCreatedEvent {
  leadId: string;
  source: string;
  ownerId: string;
  createdAt: Date;
}

interface LeadConvertedEvent {
  leadId: string;
  opportunityId: string;
  customerId?: string;
  convertedAt: Date;
}

// Opportunity events
interface OpportunityCreatedEvent {
  opportunityId: string;
  customerId?: string;
  leadId?: string;
  expectedValue: number;
  ownerId: string;
}

interface OpportunityClosedEvent {
  opportunityId: string;
  stage: 'closed_won' | 'closed_lost';
  actualValue?: number;
  closedAt: Date;
}

// Activity events
interface ActivityCreatedEvent {
  activityId: string;
  type: string;
  relatedTo: RelatedEntity;
  ownerId: string;
  dueDate?: Date;
}

interface TaskCompletedEvent {
  taskId: string;
  completedBy: string;
  completedAt: Date;
}
```

### CRM Events Consumed
```typescript
// Listen to offers events
@EventHandler('OfferCreated')
async handleOfferCreated(event: OfferCreatedEvent) {
  await this.createOpportunityFromOffer(event.offerId);
}

// Listen to orders events
@EventHandler('OrderCreated')
async handleOrderCreated(event: OrderCreatedEvent) {
  await this.createFollowUpTask(event.orderId);
}

// Listen to customer events
@EventHandler('CustomerCreated')
async handleCustomerCreated(event: CustomerCreatedEvent) {
  await this.createCustomerProfile(event.customerId);
}
```

## Performance Optimization

### CRM Data Caching
```typescript
@Injectable()
class CRMCacheService {
  private cache = new Map<string, any>();
  
  async getOpportunity(opportunityId: string): Promise<Opportunity> {
    const cacheKey = `opportunity:${opportunityId}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }
    
    const opportunity = await this.opportunityRepository.findById(opportunityId);
    this.cache.set(cacheKey, opportunity);
    
    return opportunity;
  }
  
  async invalidateOpportunity(opportunityId: string): Promise<void> {
    const cacheKey = `opportunity:${opportunityId}`;
    this.cache.delete(cacheKey);
  }
}
```

### Bulk Operations
```typescript
class CRMService {
  async bulkUpdateOpportunities(updates: OpportunityUpdate[]): Promise<void> {
    // Process in batches for performance
    const batches = this.chunkArray(updates, 100);
    
    for (const batch of batches) {
      await Promise.all(
        batch.map(update => this.updateOpportunity(update.id, update.data))
      );
    }
  }
}
```

This CRM Service provides a complete customer relationship management solution that seamlessly integrates with the financial microservices platform, enabling end-to-end sales process tracking and customer relationship optimization.
