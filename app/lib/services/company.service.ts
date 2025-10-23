import { prisma } from '../prisma';
import { eventPublisher } from '../events/event-publisher';
import { COMPANY_EVENTS } from '../events/types';
import type { Company, CompanyType, Prisma } from '@prisma/client';

export class CompanyService {
  async createCompany(data: Prisma.CompanyCreateInput): Promise<Company> {
    const company = await prisma.company.create({
      data,
      include: {
        contacts: true,
      },
    });

    await eventPublisher.publishAndStore(
      COMPANY_EVENTS.CREATED,
      COMPANY_EVENTS.CREATED,
      company.id,
      'Company',
      {
        companyId: company.id,
        name: company.name,
        type: company.type,
        taxNumber: company.taxNumber,
        country: company.country,
      }
    );

    return company;
  }

  async updateCompany(id: string, data: Prisma.CompanyUpdateInput): Promise<Company> {
    const company = await prisma.company.update({
      where: { id },
      data,
      include: {
        contacts: true,
      },
    });

    await eventPublisher.publishAndStore(
      COMPANY_EVENTS.UPDATED,
      COMPANY_EVENTS.UPDATED,
      company.id,
      'Company',
      {
        companyId: company.id,
        name: company.name,
        updatedFields: Object.keys(data),
      }
    );

    return company;
  }

  async getCompany(id: string): Promise<Company | null> {
    return prisma.company.findUnique({
      where: { id, deletedAt: null },
      include: {
        contacts: {
          where: { deletedAt: null },
        },
        sourceRelations: {
          include: {
            targetCompany: true,
          },
        },
        targetRelations: {
          include: {
            sourceCompany: true,
          },
        },
      },
    });
  }

  async listCompanies(params: {
    page?: number;
    limit?: number;
    name?: string;
    type?: CompanyType;
    country?: string;
  }): Promise<{ companies: Company[]; total: number; page: number; limit: number }> {
    const { page = 1, limit = 20, name, type, country } = params;
    const skip = (page - 1) * limit;

    const where: Prisma.CompanyWhereInput = {
      deletedAt: null,
      ...(name && {
        name: {
          contains: name,
          mode: 'insensitive' as Prisma.QueryMode,
        },
      }),
      ...(type && { type }),
      ...(country && { country }),
    };

    const [companies, total] = await Promise.all([
      prisma.company.findMany({
        where,
        skip,
        take: limit,
        include: {
          contacts: {
            where: { deletedAt: null },
            take: 5,
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.company.count({ where }),
    ]);

    return {
      companies,
      total,
      page,
      limit,
    };
  }

  async deleteCompany(id: string): Promise<Company> {
    const company = await prisma.company.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    await eventPublisher.publishAndStore(
      COMPANY_EVENTS.DELETED,
      COMPANY_EVENTS.DELETED,
      company.id,
      'Company',
      {
        companyId: company.id,
        name: company.name,
      }
    );

    return company;
  }

  async searchCompanies(query: string, limit = 10): Promise<Company[]> {
    return prisma.company.findMany({
      where: {
        deletedAt: null,
        OR: [
          {
            name: {
              contains: query,
              mode: 'insensitive' as Prisma.QueryMode,
            },
          },
          {
            taxNumber: {
              contains: query,
              mode: 'insensitive' as Prisma.QueryMode,
            },
          },
          {
            email: {
              contains: query,
              mode: 'insensitive' as Prisma.QueryMode,
            },
          },
        ],
      },
      take: limit,
      orderBy: {
        name: 'asc',
      },
    });
  }
}

export const companyService = new CompanyService();

