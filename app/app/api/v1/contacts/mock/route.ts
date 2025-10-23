import { NextRequest } from 'next/server';
import { ApiResponseBuilder } from '@/lib/api/response';
import { mockContacts, mockCompanies } from '@/lib/mock-data';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Number.parseInt(searchParams.get('page') || '1', 10);
    const limit = Number.parseInt(searchParams.get('limit') || '20', 10);
    const nameFilter = searchParams.get('name')?.toLowerCase();
    const companyIdFilter = searchParams.get('companyId');

    let filtered = mockContacts.map((contact) => ({
      ...contact,
      company: mockCompanies.find((c) => c.id === contact.companyId),
    }));

    if (nameFilter) {
      filtered = filtered.filter(
        (c) =>
          c.firstName.toLowerCase().includes(nameFilter) ||
          c.lastName.toLowerCase().includes(nameFilter) ||
          c.email.toLowerCase().includes(nameFilter)
      );
    }

    if (companyIdFilter && companyIdFilter !== 'ALL') {
      filtered = filtered.filter((c) => c.companyId === companyIdFilter);
    }

    const total = filtered.length;
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedData = filtered.slice(start, end);

    return ApiResponseBuilder.successWithPagination(
      paginatedData,
      {
        page,
        limit,
        total,
      }
    );
  } catch (error) {
    console.error('Error fetching mock contacts:', error);
    return ApiResponseBuilder.internalError('Failed to fetch contacts');
  }
}

