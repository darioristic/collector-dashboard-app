import { prisma } from '../prisma';
import { eventPublisher } from '../events/event-publisher';
import { CONTACT_EVENTS } from '../events/types';
import type { Contact, Prisma } from '@prisma/client';

export class ContactService {
  async createContact(data: Prisma.ContactCreateInput): Promise<Contact> {
    const contact = await prisma.contact.create({
      data,
      include: {
        company: true,
      },
    });

    await eventPublisher.publishAndStore(
      CONTACT_EVENTS.CREATED,
      CONTACT_EVENTS.CREATED,
      contact.id,
      'Contact',
      {
        contactId: contact.id,
        companyId: contact.companyId,
        firstName: contact.firstName,
        lastName: contact.lastName,
        email: contact.email,
        isPrimary: contact.isPrimary,
      }
    );

    return contact;
  }

  async updateContact(id: string, data: Prisma.ContactUpdateInput): Promise<Contact> {
    const contact = await prisma.contact.update({
      where: { id },
      data,
      include: {
        company: true,
      },
    });

    await eventPublisher.publishAndStore(
      CONTACT_EVENTS.UPDATED,
      CONTACT_EVENTS.UPDATED,
      contact.id,
      'Contact',
      {
        contactId: contact.id,
        companyId: contact.companyId,
        updatedFields: Object.keys(data),
      }
    );

    return contact;
  }

  async getContact(id: string): Promise<Contact | null> {
    return prisma.contact.findUnique({
      where: { id, deletedAt: null },
      include: {
        company: true,
      },
    });
  }

  async listContacts(params: {
    page?: number;
    limit?: number;
    companyId?: string;
    name?: string;
  }): Promise<{ contacts: Contact[]; total: number; page: number; limit: number }> {
    const { page = 1, limit = 20, companyId, name } = params;
    const skip = (page - 1) * limit;

    const where: Prisma.ContactWhereInput = {
      deletedAt: null,
      ...(companyId && { companyId }),
      ...(name && {
        OR: [
          {
            firstName: {
              contains: name,
              mode: 'insensitive' as Prisma.QueryMode,
            },
          },
          {
            lastName: {
              contains: name,
              mode: 'insensitive' as Prisma.QueryMode,
            },
          },
        ],
      }),
    };

    const [contacts, total] = await Promise.all([
      prisma.contact.findMany({
        where,
        skip,
        take: limit,
        include: {
          company: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.contact.count({ where }),
    ]);

    return {
      contacts,
      total,
      page,
      limit,
    };
  }

  async deleteContact(id: string): Promise<Contact> {
    const contact = await prisma.contact.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    await eventPublisher.publishAndStore(
      CONTACT_EVENTS.DELETED,
      CONTACT_EVENTS.DELETED,
      contact.id,
      'Contact',
      {
        contactId: contact.id,
        companyId: contact.companyId,
        email: contact.email,
      }
    );

    return contact;
  }

  async getContactsByCompany(companyId: string): Promise<Contact[]> {
    return prisma.contact.findMany({
      where: {
        companyId,
        deletedAt: null,
      },
      orderBy: [
        { isPrimary: 'desc' },
        { createdAt: 'asc' },
      ],
    });
  }

  async getPrimaryContact(companyId: string): Promise<Contact | null> {
    return prisma.contact.findFirst({
      where: {
        companyId,
        isPrimary: true,
        deletedAt: null,
      },
    });
  }
}

export const contactService = new ContactService();

