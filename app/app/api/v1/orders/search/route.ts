import { NextRequest, NextResponse } from 'next/server';
import { orderIndexService } from '@/lib/meilisearch/indexes/order.index';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    const query = searchParams.get('q') || '';
    const companyId = searchParams.get('companyId') || undefined;
    const customerId = searchParams.get('customerId') || undefined;
    const status = searchParams.get('status') || undefined;
    const page = Number.parseInt(searchParams.get('page') || '1', 10);
    const limit = Number.parseInt(searchParams.get('limit') || '20', 10);
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    const offset = (page - 1) * limit;
    const sort = [`${sortBy}:${sortOrder}`];

    const result = await orderIndexService.search({
      query,
      companyId,
      customerId,
      status,
      limit,
      offset,
      sort,
    });

    const totalPages = Math.ceil(result.estimatedTotalHits / limit);

    return NextResponse.json({
      success: true,
      data: result.hits,
      pagination: {
        page,
        limit,
        total: result.estimatedTotalHits,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to search orders',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

