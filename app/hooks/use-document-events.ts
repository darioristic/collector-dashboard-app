import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';

interface DocumentEvent {
  id: string;
  timestamp: string;
  action: string;
  user: string;
  details?: string;
  metadata?: Record<string, any>;
}

interface DocumentEventsResponse {
  success: boolean;
  data: DocumentEvent[];
}

export function useDocumentEvents(documentId: string, documentType: 'invoice' | 'offer') {
  return useQuery({
    queryKey: ['document-events', documentId, documentType],
    queryFn: async () => {
      // Use the unified documents API endpoint
      const response = await fetch(`/api/documents/${documentId}/events`);
      if (!response.ok) throw new Error('Failed to fetch events');
      return response.json();
    },
    enabled: !!documentId,
  });
}
