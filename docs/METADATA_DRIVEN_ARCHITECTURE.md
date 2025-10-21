# Metadata-Driven Architecture

## Overview

The Core Platform Service introduces a metadata-driven architecture that enables dynamic object modeling without code changes. This approach allows clients to customize their financial platform by adding custom fields, modifying layouts, and defining relationships through configuration rather than development.

## Key Benefits

### 🚀 **Zero-Deploy Customization**
- Add custom fields without code changes
- Modify layouts and forms dynamically
- Create new object relationships on-the-fly
- Update business rules without redeployment

### 🎯 **Salesforce-Style Flexibility**
- Metadata API for programmatic customization
- Visual form builder capabilities
- Permission-based field access
- Multi-tenant object definitions

### 🔧 **Developer-Friendly**
- Standardized object definitions
- Type-safe field definitions
- Automatic validation and constraints
- Schema versioning and migration support

## Architecture Components

### 1. Object Registry
Central repository for all business entities and their definitions:

```typescript
interface ObjectDefinition {
  id: string;
  name: string;              // e.g., "Offer", "Invoice"
  label: string;             // Display name
  pluralLabel: string;       // Plural display name
  description: string;       // Business description
  tenantId: string;          // Multi-tenant isolation
  fields: FieldDefinition[];
  relationships: RelationshipDefinition[];
  permissions: PermissionDefinition[];
  layouts: LayoutDefinition[];
  version: number;           // Schema versioning
  isActive: boolean;
}
```

### 2. Field Definitions
Dynamic field specifications supporting various data types:

```typescript
interface FieldDefinition {
  id: string;
  name: string;              // API name (e.g., "customDiscountReason")
  label: string;             // Display label
  type: FieldType;           // Data type
  required: boolean;         // Validation constraint
  unique: boolean;           // Uniqueness constraint
  defaultValue?: any;        // Default value
  length?: number;           // For text fields
  precision?: number;        // For numeric fields
  scale?: number;            // For decimal fields
  picklistValues?: PicklistValue[];  // For picklist fields
  referenceTo?: string;      // For lookup fields
  description?: string;      // Help text
  helpText?: string;         // User guidance
  isCustom: boolean;         // Custom vs system field
  isSystem: boolean;         // System-generated field
}
```

### 3. Relationship Definitions
Dynamic entity relationships:

```typescript
interface RelationshipDefinition {
  id: string;
  name: string;              // Relationship name
  type: RelationshipType;    // lookup | master_detail | many_to_many
  parentObject: string;      // Source object
  childObject: string;       // Target object
  parentField: string;       // Source field
  childField: string;        // Target field
  cascadeDelete: boolean;    // Cascade deletion
  required: boolean;         // Required relationship
}
```

### 4. Layout Definitions
Dynamic form and page layouts:

```typescript
interface LayoutDefinition {
  id: string;
  objectName: string;        // Associated object
  name: string;              // Layout name
  sections: LayoutSection[]; // Layout sections
  isDefault: boolean;        // Default layout
}

interface LayoutSection {
  id: string;
  title: string;             // Section title
  columns: number;           // Number of columns
  fields: LayoutField[];     // Fields in section
}

interface LayoutField {
  fieldName: string;         // Field reference
  required: boolean;         // Field requirement
  readOnly: boolean;         // Field editability
  width: number;             // Field width (1-3)
}
```

## Implementation Examples

### Adding Custom Fields

#### Example 1: Custom Discount Reason
```http
POST /objects/Offer/fields
{
  "name": "customDiscountReason",
  "label": "Custom Discount Reason",
  "type": "picklist",
  "isCustom": true,
  "picklistValues": [
    {"label": "Bulk Order", "value": "bulk_order"},
    {"label": "Loyal Customer", "value": "loyal_customer"},
    {"label": "Seasonal Promotion", "value": "seasonal_promotion"},
    {"label": "Competitor Match", "value": "competitor_match"}
  ]
}
```

#### Example 2: Custom Date Field
```http
POST /objects/Invoice/fields
{
  "name": "customPaymentDueDate",
  "label": "Custom Payment Due Date",
  "type": "date",
  "isCustom": true,
  "required": false,
  "description": "Custom payment due date for special arrangements"
}
```

#### Example 3: Lookup Field
```http
POST /objects/Order/fields
{
  "name": "customApproverId",
  "label": "Custom Approver",
  "type": "lookup",
  "referenceTo": "User",
  "isCustom": true,
  "required": false
}
```

### Creating Custom Layouts

#### Example: Enhanced Offer Layout
```http
POST /objects/Offer/layouts
{
  "name": "Enhanced Offer Layout",
  "sections": [
    {
      "title": "Basic Information",
      "columns": 2,
      "fields": [
        {"fieldName": "offerNumber", "required": true, "readOnly": false, "width": 1},
        {"fieldName": "customerId", "required": true, "readOnly": false, "width": 1},
        {"fieldName": "validUntil", "required": true, "readOnly": false, "width": 1},
        {"fieldName": "status", "required": true, "readOnly": true, "width": 1}
      ]
    },
    {
      "title": "Custom Fields",
      "columns": 1,
      "fields": [
        {"fieldName": "customDiscountReason", "required": false, "readOnly": false, "width": 1},
        {"fieldName": "customNotes", "required": false, "readOnly": false, "width": 1}
      ]
    },
    {
      "title": "Pricing Information",
      "columns": 3,
      "fields": [
        {"fieldName": "subtotal", "required": false, "readOnly": true, "width": 1},
        {"fieldName": "discount", "required": false, "readOnly": true, "width": 1},
        {"fieldName": "total", "required": false, "readOnly": true, "width": 1}
      ]
    }
  ]
}
```

### Defining Relationships

#### Example: Custom Approval Workflow
```http
POST /objects
{
  "name": "OfferApproval",
  "label": "Offer Approval",
  "pluralLabel": "Offer Approvals",
  "fields": [
    {
      "name": "offerId",
      "label": "Offer",
      "type": "lookup",
      "referenceTo": "Offer",
      "required": true
    },
    {
      "name": "approverId",
      "label": "Approver",
      "type": "lookup",
      "referenceTo": "User",
      "required": true
    },
    {
      "name": "status",
      "label": "Status",
      "type": "picklist",
      "picklistValues": [
        {"label": "Pending", "value": "pending"},
        {"label": "Approved", "value": "approved"},
        {"label": "Rejected", "value": "rejected"}
      ],
      "required": true
    }
  ],
  "relationships": [
    {
      "name": "OfferApprovals",
      "type": "master_detail",
      "parentObject": "Offer",
      "childObject": "OfferApproval"
    }
  ]
}
```

## Frontend Integration

### Dynamic Form Generation
The frontend automatically generates forms based on metadata:

```typescript
// Frontend service to fetch object schema
const getObjectSchema = async (objectName: string) => {
  const response = await api.get(`/objects/${objectName}/schema`);
  return response.data;
};

// Dynamic form component
const DynamicForm = ({ objectName, layoutName }) => {
  const [schema, setSchema] = useState(null);
  
  useEffect(() => {
    getObjectSchema(objectName).then(setSchema);
  }, [objectName]);
  
  if (!schema) return <Loading />;
  
  return (
    <Form layout={schema.layouts.find(l => l.name === layoutName)}>
      {schema.fields.map(field => (
        <FieldRenderer key={field.name} field={field} />
      ))}
    </Form>
  );
};
```

### Field Type Rendering
Different field types are rendered appropriately:

```typescript
const FieldRenderer = ({ field }) => {
  switch (field.type) {
    case 'text':
      return <TextInput {...field} />;
    case 'number':
      return <NumberInput {...field} />;
    case 'date':
      return <DatePicker {...field} />;
    case 'boolean':
      return <Checkbox {...field} />;
    case 'picklist':
      return <Select options={field.picklistValues} {...field} />;
    case 'lookup':
      return <LookupField referenceTo={field.referenceTo} {...field} />;
    default:
      return <TextInput {...field} />;
  }
};
```

## Service Integration

### Core Services Integration
All core services integrate with the metadata registry:

```typescript
// Offers Service integration
class OffersService {
  async createOffer(data: any) {
    // Get current object schema
    const schema = await this.platformService.getObjectSchema('Offer');
    
    // Validate against schema
    this.validateAgainstSchema(data, schema);
    
    // Create offer with custom fields
    return this.repository.create(data);
  }
  
  async addCustomField(fieldDefinition: FieldDefinition) {
    // Add field to object definition
    await this.platformService.addField('Offer', fieldDefinition);
    
    // Update database schema
    await this.databaseService.addColumn('offers', fieldDefinition);
    
    // Publish schema change event
    await this.eventBus.publish('SchemaChanged', {
      objectName: 'Offer',
      changeType: 'field_added',
      fieldDefinition
    });
  }
}
```

### Event-Driven Schema Changes
Schema changes are propagated through events:

```typescript
// Event handlers for schema changes
@EventHandler('SchemaChanged')
class SchemaChangeHandler {
  async handle(event: SchemaChangedEvent) {
    switch (event.changeType) {
      case 'field_added':
        await this.updateValidationRules(event.objectName);
        await this.updateApiDocumentation(event.objectName);
        await this.notifyFrontendClients(event.objectName);
        break;
        
      case 'layout_updated':
        await this.updateFormCache(event.objectName);
        await this.notifyFrontendClients(event.objectName);
        break;
        
      case 'relationship_added':
        await this.updateLookupCache(event.objectName);
        break;
    }
  }
}
```

## Multi-Tenant Support

### Tenant-Specific Customizations
Each tenant can have their own object definitions:

```typescript
// Tenant-specific object definition
const tenantOfferDefinition = {
  tenantId: 'tenant-123',
  baseObject: 'Offer',
  customizations: {
    fields: [
      {
        name: 'tenantSpecificField',
        label: 'Tenant Specific Field',
        type: 'text',
        isCustom: true
      }
    ],
    layouts: [
      {
        name: 'Tenant Layout',
        sections: [...]
      }
    ]
  }
};
```

### Schema Inheritance
Tenants inherit base schemas and can override:

```typescript
class SchemaResolver {
  async getObjectSchema(objectName: string, tenantId: string) {
    // Get base schema
    const baseSchema = await this.getBaseSchema(objectName);
    
    // Get tenant customizations
    const tenantCustomizations = await this.getTenantCustomizations(objectName, tenantId);
    
    // Merge schemas
    return this.mergeSchemas(baseSchema, tenantCustomizations);
  }
}
```

## Performance Considerations

### Schema Caching
Object schemas are cached for performance:

```typescript
@Injectable()
class SchemaCache {
  private cache = new Map<string, ObjectDefinition>();
  
  async getSchema(objectName: string, tenantId: string): Promise<ObjectDefinition> {
    const key = `${tenantId}:${objectName}`;
    
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }
    
    const schema = await this.platformService.getObjectSchema(objectName, tenantId);
    this.cache.set(key, schema);
    
    return schema;
  }
  
  async invalidateSchema(objectName: string, tenantId: string) {
    const key = `${tenantId}:${objectName}`;
    this.cache.delete(key);
  }
}
```

### Database Schema Evolution
Database schemas are updated dynamically:

```typescript
class DatabaseSchemaManager {
  async addColumn(tableName: string, fieldDefinition: FieldDefinition) {
    const columnDefinition = this.mapFieldToColumn(fieldDefinition);
    
    await this.database.query(`
      ALTER TABLE ${tableName} 
      ADD COLUMN ${columnDefinition.name} ${columnDefinition.type}
      ${columnDefinition.constraints}
    `);
  }
  
  private mapFieldToColumn(field: FieldDefinition): ColumnDefinition {
    switch (field.type) {
      case 'text':
        return { name: field.name, type: 'VARCHAR', constraints: `(${field.length || 255})` };
      case 'number':
        return { name: field.name, type: 'DECIMAL', constraints: `(${field.precision || 10},${field.scale || 2})` };
      case 'date':
        return { name: field.name, type: 'TIMESTAMP' };
      case 'boolean':
        return { name: field.name, type: 'BOOLEAN' };
      default:
        return { name: field.name, type: 'TEXT' };
    }
  }
}
```

## Security and Permissions

### Field-Level Permissions
Fine-grained access control for custom fields:

```typescript
interface FieldPermission {
  fieldName: string;
  profileId: string;
  permissions: {
    read: boolean;
    edit: boolean;
  };
}

// Permission checking
class PermissionService {
  async canAccessField(userId: string, objectName: string, fieldName: string, operation: 'read' | 'edit'): Promise<boolean> {
    const userProfile = await this.getUserProfile(userId);
    const fieldPermission = await this.getFieldPermission(objectName, fieldName, userProfile.id);
    
    return fieldPermission.permissions[operation];
  }
}
```

### Schema Validation
All schema changes are validated:

```typescript
class SchemaValidator {
  validateFieldDefinition(field: FieldDefinition): ValidationResult {
    const errors: string[] = [];
    
    // Validate field name
    if (!this.isValidFieldName(field.name)) {
      errors.push('Invalid field name format');
    }
    
    // Validate field type
    if (!this.isValidFieldType(field.type)) {
      errors.push('Invalid field type');
    }
    
    // Validate constraints
    if (field.required && field.defaultValue !== undefined) {
      errors.push('Required fields cannot have default values');
    }
    
    return { isValid: errors.length === 0, errors };
  }
}
```

This metadata-driven architecture provides the foundation for a truly customizable financial platform that can adapt to different business requirements without code changes.
