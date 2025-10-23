#!/usr/bin/env bun

/**
 * Test script za verifikaciju Redis cache setup-a
 * Run: bun run scripts/test-cache-setup.ts
 */

import { redis, cache, CacheKeys, CacheTTL } from '../lib/cache/redis';
import { queryCache, createCacheKey } from '../lib/cache/query-cache';
import { sessionManager } from '../lib/cache/session';
import { RateLimiter } from '../lib/cache/rate-limiter';

async function testRedisConnection() {
  console.log('\n🔍 Testing Redis Connection...');
  try {
    const pong = await redis.ping();
    console.log('✅ Redis connection:', pong);
    return true;
  } catch (error) {
    console.error('❌ Redis connection failed:', error);
    return false;
  }
}

async function testBasicCache() {
  console.log('\n🔍 Testing Basic Cache Operations...');
  
  const key = 'test:basic';
  const data = { id: '1', name: 'Test Data', timestamp: Date.now() };
  
  try {
    // Set
    await cache.set(key, data, 60);
    console.log('✅ Cache set');
    
    // Get
    const cached = await cache.get(key);
    if (cached && JSON.stringify(cached) === JSON.stringify(data)) {
      console.log('✅ Cache get');
    } else {
      console.error('❌ Cache get failed - data mismatch');
      return false;
    }
    
    // Exists
    const exists = await cache.exists(key);
    if (exists) {
      console.log('✅ Cache exists');
    } else {
      console.error('❌ Cache exists check failed');
      return false;
    }
    
    // Delete
    await cache.del(key);
    const deleted = await cache.get(key);
    if (deleted === null) {
      console.log('✅ Cache delete');
    } else {
      console.error('❌ Cache delete failed');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('❌ Basic cache test failed:', error);
    return false;
  }
}

async function testQueryCache() {
  console.log('\n🔍 Testing Query Cache...');
  
  let dbCallCount = 0;
  const mockQuery = async () => {
    dbCallCount++;
    await new Promise(resolve => setTimeout(resolve, 100)); // Simulate slow DB
    return { data: 'mock result', timestamp: Date.now() };
  };
  
  try {
    const key = createCacheKey('test:query', { id: '123' });
    
    // First call - should hit "DB"
    console.time('First query');
    const result1 = await queryCache.wrap(mockQuery, {
      key,
      ttl: CacheTTL.SHORT,
      tags: ['test'],
    });
    console.timeEnd('First query');
    
    // Second call - should hit cache
    console.time('Second query (cached)');
    const result2 = await queryCache.wrap(mockQuery, {
      key,
      ttl: CacheTTL.SHORT,
      tags: ['test'],
    });
    console.timeEnd('Second query (cached)');
    
    if (dbCallCount === 1) {
      console.log('✅ Query cache working (DB called once)');
    } else {
      console.error('❌ Query cache failed - DB called', dbCallCount, 'times');
      return false;
    }
    
    // Test invalidation
    await queryCache.invalidateTags(['test']);
    const result3 = await queryCache.wrap(mockQuery, {
      key,
      ttl: CacheTTL.SHORT,
      tags: ['test'],
    });
    
    if (dbCallCount === 2) {
      console.log('✅ Cache invalidation working');
    } else {
      console.error('❌ Cache invalidation failed');
      return false;
    }
    
    // Cleanup
    await queryCache.invalidateTags(['test']);
    
    return true;
  } catch (error) {
    console.error('❌ Query cache test failed:', error);
    return false;
  }
}

async function testSessionManager() {
  console.log('\n🔍 Testing Session Manager...');
  
  try {
    const token = 'test-token-' + Date.now();
    const userId = 'test-user-123';
    
    // Create session
    const session = await sessionManager.create({
      token,
      userId,
      email: 'test@example.com',
      role: 'USER',
      metadata: { ip: '127.0.0.1' },
    });
    console.log('✅ Session created');
    
    // Get session
    const retrieved = await sessionManager.get(token);
    if (retrieved && retrieved.userId === userId) {
      console.log('✅ Session retrieved');
    } else {
      console.error('❌ Session retrieval failed');
      return false;
    }
    
    // Update session
    const updated = await sessionManager.update(token, {
      metadata: { ip: '127.0.0.1', lastActivity: Date.now() },
    });
    if (updated) {
      console.log('✅ Session updated');
    } else {
      console.error('❌ Session update failed');
      return false;
    }
    
    // Get user sessions
    const userSessions = await sessionManager.getUserSessions(userId);
    if (userSessions.length > 0) {
      console.log('✅ Get user sessions');
    } else {
      console.error('❌ Get user sessions failed');
      return false;
    }
    
    // Delete session
    await sessionManager.delete(token);
    const deleted = await sessionManager.get(token);
    if (deleted === null) {
      console.log('✅ Session deleted');
    } else {
      console.error('❌ Session deletion failed');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('❌ Session manager test failed:', error);
    return false;
  }
}

async function testRateLimiter() {
  console.log('\n🔍 Testing Rate Limiter...');
  
  try {
    const limiter = new RateLimiter({
      windowMs: 60000, // 1 minute
      maxRequests: 5,
    });
    
    const key = 'test-limiter-' + Date.now();
    let allowedCount = 0;
    let deniedCount = 0;
    
    // Make 7 requests (limit is 5)
    for (let i = 0; i < 7; i++) {
      const result = await limiter.check(key);
      if (result.allowed) {
        allowedCount++;
      } else {
        deniedCount++;
      }
    }
    
    if (allowedCount === 5 && deniedCount === 2) {
      console.log('✅ Rate limiter working (5 allowed, 2 denied)');
    } else {
      console.error('❌ Rate limiter failed:', { allowedCount, deniedCount });
      return false;
    }
    
    // Reset
    await limiter.reset(key);
    const afterReset = await limiter.check(key);
    if (afterReset.allowed) {
      console.log('✅ Rate limiter reset working');
    } else {
      console.error('❌ Rate limiter reset failed');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('❌ Rate limiter test failed:', error);
    return false;
  }
}

async function testAdvancedOperations() {
  console.log('\n🔍 Testing Advanced Operations...');
  
  try {
    // Test increment
    const counterKey = 'test:counter';
    const count1 = await cache.incr(counterKey, 60);
    const count2 = await cache.incr(counterKey, 60);
    if (count1 === 1 && count2 === 2) {
      console.log('✅ Increment working');
    } else {
      console.error('❌ Increment failed');
      return false;
    }
    await cache.del(counterKey);
    
    // Test hash operations
    const hashKey = 'test:hash';
    await cache.hset(hashKey, 'field1', { data: 'value1' }, 60);
    await cache.hset(hashKey, 'field2', { data: 'value2' }, 60);
    
    const field1 = await cache.hget(hashKey, 'field1');
    const allFields = await cache.hgetall(hashKey);
    
    if (field1 && Object.keys(allFields).length === 2) {
      console.log('✅ Hash operations working');
    } else {
      console.error('❌ Hash operations failed');
      return false;
    }
    await cache.del(hashKey);
    
    // Test pattern delete
    await cache.set('test:pattern:1', { id: 1 }, 60);
    await cache.set('test:pattern:2', { id: 2 }, 60);
    await cache.delPattern('test:pattern:*');
    
    const pattern1 = await cache.get('test:pattern:1');
    if (pattern1 === null) {
      console.log('✅ Pattern delete working');
    } else {
      console.error('❌ Pattern delete failed');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('❌ Advanced operations test failed:', error);
    return false;
  }
}

async function testPerformance() {
  console.log('\n🔍 Testing Performance...');
  
  try {
    const iterations = 100;
    
    // Test set performance
    console.time('Set 100 keys');
    for (let i = 0; i < iterations; i++) {
      await cache.set(`perf:test:${i}`, { id: i, data: 'test' }, 60);
    }
    console.timeEnd('Set 100 keys');
    
    // Test get performance
    console.time('Get 100 keys');
    for (let i = 0; i < iterations; i++) {
      await cache.get(`perf:test:${i}`);
    }
    console.timeEnd('Get 100 keys');
    
    // Cleanup
    await cache.delPattern('perf:test:*');
    console.log('✅ Performance test completed');
    
    return true;
  } catch (error) {
    console.error('❌ Performance test failed:', error);
    return false;
  }
}

async function getRedisInfo() {
  console.log('\n📊 Redis Info:');
  try {
    const info = await cache.info();
    const lines = info.split('\n');
    
    const stats = {
      'Connected Clients': lines.find(l => l.startsWith('connected_clients'))?.split(':')[1]?.trim(),
      'Used Memory': lines.find(l => l.startsWith('used_memory_human'))?.split(':')[1]?.trim(),
      'Total Commands': lines.find(l => l.startsWith('total_commands_processed'))?.split(':')[1]?.trim(),
      'Keyspace Hits': lines.find(l => l.startsWith('keyspace_hits'))?.split(':')[1]?.trim(),
      'Keyspace Misses': lines.find(l => l.startsWith('keyspace_misses'))?.split(':')[1]?.trim(),
    };
    
    console.table(stats);
    
    // Calculate hit rate
    const hits = parseInt(stats['Keyspace Hits'] || '0');
    const misses = parseInt(stats['Keyspace Misses'] || '0');
    const total = hits + misses;
    const hitRate = total > 0 ? ((hits / total) * 100).toFixed(2) : '0.00';
    console.log(`Cache Hit Rate: ${hitRate}%`);
  } catch (error) {
    console.error('❌ Failed to get Redis info:', error);
  }
}

async function runAllTests() {
  console.log('🚀 Starting Redis Cache Tests...\n');
  console.log('=' .repeat(50));
  
  const results = {
    connection: await testRedisConnection(),
    basicCache: await testBasicCache(),
    queryCache: await testQueryCache(),
    sessionManager: await testSessionManager(),
    rateLimiter: await testRateLimiter(),
    advancedOps: await testAdvancedOperations(),
    performance: await testPerformance(),
  };
  
  await getRedisInfo();
  
  console.log('\n' + '='.repeat(50));
  console.log('📋 Test Results:');
  console.log('='.repeat(50));
  
  const passed = Object.values(results).filter(Boolean).length;
  const total = Object.keys(results).length;
  
  Object.entries(results).forEach(([name, result]) => {
    const icon = result ? '✅' : '❌';
    console.log(`${icon} ${name}: ${result ? 'PASSED' : 'FAILED'}`);
  });
  
  console.log('='.repeat(50));
  console.log(`\n📊 Summary: ${passed}/${total} tests passed`);
  
  if (passed === total) {
    console.log('\n🎉 All tests passed! Redis cache setup is working correctly.');
  } else {
    console.log('\n⚠️  Some tests failed. Please check the errors above.');
  }
  
  // Disconnect
  await cache.disconnect();
  process.exit(passed === total ? 0 : 1);
}

// Run tests
runAllTests().catch((error) => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});

