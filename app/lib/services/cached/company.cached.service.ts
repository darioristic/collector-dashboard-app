import { companyService } from '../company.service';
import { CacheKeys, CacheTTL } from '@/lib/cache/redis';
import { queryCache, createCacheKey } from '@/lib/cache/query-cache';
import type { Company, CompanyType, Prisma } from '@prisma/client';

export class CachedCompanyService {
  async createCompany(data: Prisma.CompanyCreateInput): Promise<Company> {
    const company = await companyService.createCompany(data);
    
    // Invalidate list caches
    await queryCache.invalidatePattern('companies:*');
    
    return company;
  }

  async updateCompany(id: string, data: Prisma.CompanyUpdateInput): Promise<Company> {
    const company = await companyService.updateCompany(id, data);
    
    // Invalidate specific company and list caches
    await queryCache.invalidate(CacheKeys.company(id));
    await queryCache.invalidatePattern('companies:*');
    
    return company;
  }

  async getCompany(id: string): Promise<Company | null> {
    return queryCache.wrap(
      () => companyService.getCompany(id),
      {
        key: CacheKeys.company(id),
        ttl: CacheTTL.MEDIUM,
        tags: ['company', `company:${id}`],
      }
    );
  }

  async listCompanies(params: {
    page?: number;
    limit?: number;
    name?: string;
    type?: CompanyType;
    country?: string;
  }): Promise<{ companies: Company[]; total: number; page: number; limit: number }> {
    const cacheKey = createCacheKey('companies', {
      page: params.page,
      limit: params.limit,
      name: params.name,
      type: params.type,
      country: params.country,
    });

    return queryCache.wrap(
      () => companyService.listCompanies(params),
      {
        key: cacheKey,
        ttl: CacheTTL.SHORT, // Shorter TTL for lists
        tags: ['companies'],
      }
    );
  }

  async deleteCompany(id: string): Promise<Company> {
    const company = await companyService.deleteCompany(id);
    
    // Invalidate specific company and list caches
    await queryCache.invalidate(CacheKeys.company(id));
    await queryCache.invalidatePattern('companies:*');
    
    return company;
  }

  async searchCompanies(query: string, limit = 10): Promise<Company[]> {
    const cacheKey = createCacheKey('companies:search', { query, limit });

    return queryCache.wrap(
      () => companyService.searchCompanies(query, limit),
      {
        key: cacheKey,
        ttl: CacheTTL.SHORT,
        tags: ['companies'],
      }
    );
  }
}

export const cachedCompanyService = new CachedCompanyService();

