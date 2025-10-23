import { offerIndexService } from '../lib/meilisearch/indexes/offer.index';
import { orderIndexService } from '../lib/meilisearch/indexes/order.index';
import { deliveryIndexService } from '../lib/meilisearch/indexes/delivery.index';
import { invoiceIndexService } from '../lib/meilisearch/indexes/invoice.index';

async function main() {
  console.log('🚀 Initializing Meilisearch indexes...');

  try {
    console.log('Creating indexes and configuring settings...');
    await Promise.all([
      offerIndexService.initialize(),
      orderIndexService.initialize(),
      deliveryIndexService.initialize(),
      invoiceIndexService.initialize(),
    ]);

    console.log('\n📊 Reindexing all data...');
    await Promise.all([
      offerIndexService.reindexAll(),
      orderIndexService.reindexAll(),
      deliveryIndexService.reindexAll(),
      invoiceIndexService.reindexAll(),
    ]);

    console.log('\n✅ Meilisearch initialization complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to initialize Meilisearch:', error);
    process.exit(1);
  }
}

main();

