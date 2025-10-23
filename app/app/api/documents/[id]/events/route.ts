import { NextRequest, NextResponse } from 'next/server';

// Mock events data
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
  ],
  "fba7e3e6-d128-4a64-8adc-69db599a973e": [
    {
      id: "evt-011",
      timestamp: "2025-01-15T10:00:00Z",
      action: "Created", 
      user: "Dario Ristić",
      details: "Offer created for OpenShift implementation project"
    },
    {
      id: "evt-012",
      timestamp: "2025-01-15T14:30:00Z",
      action: "Sent to client",
      user: "System", 
      details: "Sent to T-2 d.o.o. via email"
    },
    {
      id: "evt-013",
      timestamp: "2025-01-16T09:15:00Z",
      action: "Viewed by client",
      user: "T-2 d.o.o.",
      details: "Client viewed offer online"
    }
  ],
  "inv-002": [
    {
      id: "evt-008",
      timestamp: "2025-01-05T08:00:00Z",
      action: "Created",
      user: "Dario Ristić", 
      details: "Invoice created for overdue payment"
    },
    {
      id: "evt-009",
      timestamp: "2025-01-05T10:15:00Z",
      action: "Sent to client",
      user: "System",
      details: "Sent to Tech Solutions Inc. via email"
    },
    {
      id: "evt-010",
      timestamp: "2025-01-20T00:00:00Z",
      action: "Marked as overdue",
      user: "System",
      details: "Payment due date passed, invoice marked as overdue"
    }
  ]
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  try {
    const events = mockEvents[id as keyof typeof mockEvents] || [];
    
    return NextResponse.json({
      success: true,
      data: events
    });
    
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { message: 'Internal server error' } },
      { status: 500 }
    );
  }
}
