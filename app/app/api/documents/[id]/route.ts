import { NextRequest, NextResponse } from 'next/server';

// Mock data for demonstration
const mockInvoice = {
  id: "inv-001",
  invoiceNo: "INV-2025-001",
  companyId: "comp-001",
  customerId: "cust-001",
  items: [
    {
      name: "OpenShift Implementation",
      quantity: 2,
      unit: "days",
      unitPrice: 800,
      tax: 20
    },
    {
      name: "Kubernetes Training",
      quantity: 1,
      unit: "course", 
      unitPrice: 1200,
      tax: 20
    }
  ],
  subtotal: 2800,
  tax: 560,
  total: 3360,
  currency: "EUR",
  type: "ISSUED",
  status: "PAID",
  issueDate: "2025-01-15T10:00:00Z",
  dueDate: "2025-02-15T23:59:59Z",
  paidAt: "2025-01-20T15:30:00Z",
  notes: "Payment within 30 days. All prices exclude VAT unless stated otherwise.",
  createdAt: "2025-01-15T10:00:00Z",
  updatedAt: "2025-01-20T15:30:00Z",
  company: {
    id: "comp-001",
    name: "Cloud Native LLC",
    address: "Trg Nikole Pašića 7, Belgrade, Serbia",
    email: "info@cloudnative.rs",
    phone: "+381 11 123 4567",
    taxNumber: "RS109834729"
  },
  customer: {
    id: "cust-001", 
    name: "T-2 d.o.o.",
    address: "Ljubljana, Slovenia",
    email: "contact@t-2.si",
    phone: "+386 1 234 5678",
    taxNumber: "SI12345678"
  }
};

const mockOffer = {
  id: "off-001",
  offerNo: "OFF-2025-001", 
  companyId: "comp-001",
  customerId: "cust-002",
  items: [
    {
      name: "React Development Services",
      quantity: 40,
      unit: "hours",
      unitPrice: 75,
      tax: 20
    },
    {
      name: "UI/UX Design",
      quantity: 20,
      unit: "hours",
      unitPrice: 90,
      tax: 20
    }
  ],
  subtotal: 4800,
  tax: 960,
  total: 5760,
  currency: "EUR",
  status: "SENT",
  validUntil: "2025-02-10T23:59:59Z",
  notes: "This offer is valid for 30 days. Payment terms: 50% upfront, 50% on completion.",
  createdAt: "2025-01-10T09:00:00Z",
  updatedAt: "2025-01-10T14:30:00Z",
  company: {
    id: "comp-001",
    name: "Cloud Native LLC", 
    address: "Trg Nikole Pašića 7, Belgrade, Serbia",
    email: "info@cloudnative.rs",
    phone: "+381 11 123 4567",
    taxNumber: "RS109834729"
  },
  customer: {
    id: "cust-002",
    name: "Tech Solutions Inc.",
    address: "New York, NY, USA",
    email: "projects@techsolutions.com",
    phone: "+1 555 123 4567",
    taxNumber: "US123456789"
  }
};

const mockEvents = {
  "inv-001": [
    {
      id: "evt-001",
      timestamp: "2025-01-15T10:00:00Z",
      action: "Created",
      user: "Dario Ristić",
      details: "Invoice created from delivery DN-2025-001"
    },
    {
      id: "evt-002", 
      timestamp: "2025-01-15T14:30:00Z",
      action: "Sent to client",
      user: "System",
      details: "Sent to T-2 d.o.o. via email"
    },
    {
      id: "evt-003",
      timestamp: "2025-01-16T09:15:00Z", 
      action: "Viewed by client",
      user: "T-2 d.o.o.",
      details: "Client viewed invoice online"
    },
    {
      id: "evt-004",
      timestamp: "2025-01-20T15:30:00Z",
      action: "Payment received",
      user: "Bank API",
      details: "Payment of €3,360.00 received via bank transfer"
    }
  ],
  "off-001": [
    {
      id: "evt-005",
      timestamp: "2025-01-10T09:00:00Z",
      action: "Created", 
      user: "Dario Ristić",
      details: "Offer created for React development project"
    },
    {
      id: "evt-006",
      timestamp: "2025-01-10T14:30:00Z",
      action: "Sent to client",
      user: "System", 
      details: "Sent to Tech Solutions Inc. via email"
    },
    {
      id: "evt-007",
      timestamp: "2025-01-11T11:20:00Z",
      action: "Viewed by client",
      user: "Tech Solutions Inc.",
      details: "Client viewed offer online"
    }
  ]
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const url = new URL(request.url);
  const type = url.searchParams.get('type') || 'invoice';
  
  try {
    let document;
    
    if (type === 'invoice') {
      document = id === 'inv-001' ? mockInvoice : null;
    } else if (type === 'offer') {
      document = id === 'off-001' ? mockOffer : null;
    } else {
      return NextResponse.json(
        { success: false, error: { message: 'Invalid document type' } },
        { status: 400 }
      );
    }
    
    if (!document) {
      return NextResponse.json(
        { success: false, error: { message: 'Document not found' } },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: document
    });
    
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { message: 'Internal server error' } },
      { status: 500 }
    );
  }
}
