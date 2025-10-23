import { prisma } from '../prisma';
import { eventPublisher } from '../events/event-publisher';
import { RELATIONSHIP_EVENTS } from '../events/types';
import type { Relationship, RelationType, RelationStatus, Prisma } from '@prisma/client';

export class RelationshipService {
  async createRelationship(data: Prisma.RelationshipCreateInput): Promise<Relationship> {
    const relationship = await prisma.relationship.create({
      data,
      include: {
        sourceCompany: true,
        targetCompany: true,
      },
    });

    await eventPublisher.publishAndStore(
      RELATIONSHIP_EVENTS.CREATED,
      RELATIONSHIP_EVENTS.CREATED,
      relationship.id,
      'Relationship',
      {
        relationshipId: relationship.id,
        sourceCompanyId: relationship.sourceCompanyId,
        targetCompanyId: relationship.targetCompanyId,
        relationType: relationship.relationType,
        status: relationship.status,
      }
    );

    return relationship;
  }

  async updateRelationship(
    id: string,
    data: Prisma.RelationshipUpdateInput
  ): Promise<Relationship> {
    const relationship = await prisma.relationship.update({
      where: { id },
      data,
      include: {
        sourceCompany: true,
        targetCompany: true,
      },
    });

    await eventPublisher.publishAndStore(
      RELATIONSHIP_EVENTS.UPDATED,
      RELATIONSHIP_EVENTS.UPDATED,
      relationship.id,
      'Relationship',
      {
        relationshipId: relationship.id,
        updatedFields: Object.keys(data),
      }
    );

    return relationship;
  }

  async getRelationship(id: string): Promise<Relationship | null> {
    return prisma.relationship.findUnique({
      where: { id },
      include: {
        sourceCompany: true,
        targetCompany: true,
      },
    });
  }

  async listRelationships(params: {
    page?: number;
    limit?: number;
    companyId?: string;
    relationType?: RelationType;
    status?: RelationStatus;
  }): Promise<{ relationships: Relationship[]; total: number; page: number; limit: number }> {
    const { page = 1, limit = 20, companyId, relationType, status } = params;
    const skip = (page - 1) * limit;

    const where: Prisma.RelationshipWhereInput = {
      ...(companyId && {
        OR: [{ sourceCompanyId: companyId }, { targetCompanyId: companyId }],
      }),
      ...(relationType && { relationType }),
      ...(status && { status }),
    };

    const [relationships, total] = await Promise.all([
      prisma.relationship.findMany({
        where,
        skip,
        take: limit,
        include: {
          sourceCompany: true,
          targetCompany: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.relationship.count({ where }),
    ]);

    return {
      relationships,
      total,
      page,
      limit,
    };
  }

  async deleteRelationship(id: string): Promise<Relationship> {
    const relationship = await prisma.relationship.delete({
      where: { id },
    });

    await eventPublisher.publishAndStore(
      RELATIONSHIP_EVENTS.DELETED,
      RELATIONSHIP_EVENTS.DELETED,
      relationship.id,
      'Relationship',
      {
        relationshipId: relationship.id,
        sourceCompanyId: relationship.sourceCompanyId,
        targetCompanyId: relationship.targetCompanyId,
      }
    );

    return relationship;
  }

  async getCompanyRelationships(
    companyId: string,
    relationType?: RelationType
  ): Promise<Relationship[]> {
    return prisma.relationship.findMany({
      where: {
        OR: [{ sourceCompanyId: companyId }, { targetCompanyId: companyId }],
        ...(relationType && { relationType }),
      },
      include: {
        sourceCompany: true,
        targetCompany: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}

export const relationshipService = new RelationshipService();

