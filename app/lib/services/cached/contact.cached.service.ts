import { contactService } from '../contact.service';
import { CacheKeys, CacheTTL } from '@/lib/cache/redis';
import { queryCache, createCacheKey } from '@/lib/cache/query-cache';
import type { Contact, Prisma } from '@prisma/client';

export class CachedContactService {
  async createContact(data: Prisma.ContactCreateInput): Promise<Contact> {
    const contact = await contactService.createContact(data);
    
    // Invalidate company cache and contact list caches
    if (typeof data.company === 'object' && 'connect' in data.company && data.company.connect?.id) {
      const companyId = data.company.connect.id;
      await queryCache.invalidate(CacheKeys.contacts(companyId));
    }
    await queryCache.invalidatePattern('contacts:*');
    
    return contact;
  }

  async updateContact(id: string, data: Prisma.ContactUpdateInput): Promise<Contact> {
    const contact = await contactService.updateContact(id, data);
    
    // Invalidate specific contact and list caches
    await queryCache.invalidate(CacheKeys.contact(id));
    await queryCache.invalidate(CacheKeys.contacts(contact.companyId));
    await queryCache.invalidatePattern('contacts:*');
    
    return contact;
  }

  async getContact(id: string): Promise<Contact | null> {
    return queryCache.wrap(
      () => contactService.getContact(id),
      {
        key: CacheKeys.contact(id),
        ttl: CacheTTL.MEDIUM,
        tags: ['contact', `contact:${id}`],
      }
    );
  }

  async listContacts(params: {
    page?: number;
    limit?: number;
    companyId?: string;
    name?: string;
  }): Promise<{ contacts: Contact[]; total: number; page: number; limit: number }> {
    const cacheKey = createCacheKey('contacts', {
      page: params.page,
      limit: params.limit,
      companyId: params.companyId,
      name: params.name,
    });

    return queryCache.wrap(
      () => contactService.listContacts(params),
      {
        key: cacheKey,
        ttl: CacheTTL.SHORT,
        tags: ['contacts'],
      }
    );
  }

  async deleteContact(id: string): Promise<Contact> {
    const contact = await contactService.deleteContact(id);
    
    // Invalidate specific contact and list caches
    await queryCache.invalidate(CacheKeys.contact(id));
    await queryCache.invalidate(CacheKeys.contacts(contact.companyId));
    await queryCache.invalidatePattern('contacts:*');
    
    return contact;
  }

  async getContactsByCompany(companyId: string): Promise<Contact[]> {
    return queryCache.wrap(
      () => contactService.getContactsByCompany(companyId),
      {
        key: CacheKeys.contacts(companyId),
        ttl: CacheTTL.MEDIUM,
        tags: ['contacts', `company:${companyId}`],
      }
    );
  }

  async getPrimaryContact(companyId: string): Promise<Contact | null> {
    const cacheKey = `contact:primary:${companyId}`;
    
    return queryCache.wrap(
      () => contactService.getPrimaryContact(companyId),
      {
        key: cacheKey,
        ttl: CacheTTL.MEDIUM,
        tags: ['contacts', `company:${companyId}`],
      }
    );
  }
}

export const cachedContactService = new CachedContactService();

