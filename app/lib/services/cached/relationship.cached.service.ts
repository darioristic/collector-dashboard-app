import { relationshipService } from '../relationship.service';
import { CacheKeys, CacheTTL } from '@/lib/cache/redis';
import { queryCache, createCacheKey } from '@/lib/cache/query-cache';
import type { Relationship, RelationType, RelationStatus, Prisma } from '@prisma/client';

export class CachedRelationshipService {
  async createRelationship(data: Prisma.RelationshipCreateInput): Promise<Relationship> {
    const relationship = await relationshipService.createRelationship(data);
    
    // Invalidate related company caches
    if (typeof data.sourceCompany === 'object' && 'connect' in data.sourceCompany && data.sourceCompany.connect?.id) {
      const sourceCompanyId = data.sourceCompany.connect.id;
      await queryCache.invalidate(CacheKeys.relationships(sourceCompanyId));
    }
    if (typeof data.targetCompany === 'object' && 'connect' in data.targetCompany && data.targetCompany.connect?.id) {
      const targetCompanyId = data.targetCompany.connect.id;
      await queryCache.invalidate(CacheKeys.relationships(targetCompanyId));
    }
    await queryCache.invalidatePattern('relationships:*');
    
    return relationship;
  }

  async updateRelationship(id: string, data: Prisma.RelationshipUpdateInput): Promise<Relationship> {
    const relationship = await relationshipService.updateRelationship(id, data);
    
    // Invalidate specific relationship and related caches
    await queryCache.invalidate(CacheKeys.relationship(id));
    await queryCache.invalidate(CacheKeys.relationships(relationship.sourceCompanyId));
    await queryCache.invalidate(CacheKeys.relationships(relationship.targetCompanyId));
    await queryCache.invalidatePattern('relationships:*');
    
    return relationship;
  }

  async getRelationship(id: string): Promise<Relationship | null> {
    return queryCache.wrap(
      () => relationshipService.getRelationship(id),
      {
        key: CacheKeys.relationship(id),
        ttl: CacheTTL.MEDIUM,
        tags: ['relationship', `relationship:${id}`],
      }
    );
  }

  async listRelationships(params: {
    page?: number;
    limit?: number;
    companyId?: string;
    relationType?: RelationType;
    status?: RelationStatus;
  }): Promise<{ relationships: Relationship[]; total: number; page: number; limit: number }> {
    const cacheKey = createCacheKey('relationships', {
      page: params.page,
      limit: params.limit,
      companyId: params.companyId,
      relationType: params.relationType,
      status: params.status,
    });

    return queryCache.wrap(
      () => relationshipService.listRelationships(params),
      {
        key: cacheKey,
        ttl: CacheTTL.SHORT,
        tags: ['relationships'],
      }
    );
  }

  async deleteRelationship(id: string): Promise<Relationship> {
    const relationship = await relationshipService.deleteRelationship(id);
    
    // Invalidate specific relationship and related caches
    await queryCache.invalidate(CacheKeys.relationship(id));
    await queryCache.invalidate(CacheKeys.relationships(relationship.sourceCompanyId));
    await queryCache.invalidate(CacheKeys.relationships(relationship.targetCompanyId));
    await queryCache.invalidatePattern('relationships:*');
    
    return relationship;
  }

  async getCompanyRelationships(
    companyId: string,
    relationType?: RelationType
  ): Promise<Relationship[]> {
    const cacheKey = relationType 
      ? `${CacheKeys.relationships(companyId)}:${relationType}`
      : CacheKeys.relationships(companyId);

    return queryCache.wrap(
      () => relationshipService.getCompanyRelationships(companyId, relationType),
      {
        key: cacheKey,
        ttl: CacheTTL.MEDIUM,
        tags: ['relationships', `company:${companyId}`],
      }
    );
  }
}

export const cachedRelationshipService = new CachedRelationshipService();

