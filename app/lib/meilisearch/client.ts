import { MeiliSearch, Index } from 'meilisearch';

class MeiliSearchClient {
  private client: MeiliSearch | null = null;
  private connecting: Promise<void> | null = null;

  async connect(): Promise<void> {
    if (this.client) return;
    if (this.connecting) return this.connecting;

    this.connecting = (async () => {
      try {
        const host = process.env.MEILISEARCH_HOST || 'http://localhost:7700';
        const apiKey = process.env.MEILISEARCH_API_KEY || 'masterKey';

        this.client = new MeiliSearch({
          host,
          apiKey,
        });

        await this.client.isHealthy();
        console.log(`✅ Connected to Meilisearch at ${host}`);
      } catch (error) {
        console.error('❌ Failed to connect to Meilisearch:', error);
        this.client = null;
      } finally {
        this.connecting = null;
      }
    })();

    return this.connecting;
  }

  async getClient(): Promise<MeiliSearch> {
    if (!this.client) {
      await this.connect();
    }

    if (!this.client) {
      throw new Error('Meilisearch client not connected');
    }

    return this.client;
  }

  async getIndex(indexName: string): Promise<Index> {
    const client = await this.getClient();
    return client.index(indexName);
  }

  async createIndexIfNotExists(indexName: string, primaryKey: string): Promise<void> {
    try {
      const client = await this.getClient();
      const indexes = await client.getIndexes();
      const indexExists = indexes.results.some(idx => idx.uid === indexName);

      if (!indexExists) {
        await client.createIndex(indexName, { primaryKey });
        console.log(`✅ Created Meilisearch index: ${indexName}`);
      }
    } catch (error) {
      console.error(`❌ Failed to create index ${indexName}:`, error);
    }
  }

  async configureIndex(
    indexName: string,
    settings: {
      searchableAttributes?: string[];
      filterableAttributes?: string[];
      sortableAttributes?: string[];
      rankingRules?: string[];
      displayedAttributes?: string[];
    }
  ): Promise<void> {
    try {
      const index = await this.getIndex(indexName);
      await index.updateSettings(settings);
      console.log(`✅ Configured index ${indexName}`);
    } catch (error) {
      console.error(`❌ Failed to configure index ${indexName}:`, error);
    }
  }

  isConnected(): boolean {
    return this.client !== null;
  }
}

export const meilisearchClient = new MeiliSearchClient();

