import { meilisearchSubscribers } from '../lib/meilisearch/subscribers';

async function main() {
  console.log('🚀 Starting Meilisearch workers...');

  const handleShutdown = async () => {
    console.log('\n🛑 Shutting down gracefully...');
    await meilisearchSubscribers.stopAll();
    process.exit(0);
  };

  process.on('SIGINT', handleShutdown);
  process.on('SIGTERM', handleShutdown);

  try {
    await meilisearchSubscribers.startAll();
    console.log('✅ Meilisearch workers running. Press Ctrl+C to stop.');
  } catch (error) {
    console.error('❌ Failed to start workers:', error);
    process.exit(1);
  }
}

main();

