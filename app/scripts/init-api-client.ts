import { apiClient } from '../lib/api/client';
import { jwtService } from '../lib/auth/jwt';

// Generate a test token
const testToken = jwtService.signToken({
  sub: 'test-user',
  email: 'test@example.com',
  role: 'ADMIN',
}, '7d');

console.log('\n🔑 Test Token Generated\n');
console.log('Token:', testToken);
console.log('\n📋 Copy this to use in your frontend:\n');
console.log(`localStorage.setItem('auth_token', '${testToken}');\n`);
console.log('Or set it in the API client:\n');
console.log(`import { apiClient } from '@/lib/api/client';`);
console.log(`apiClient.setToken('${testToken}');\n`);

// Initialize API client with token
apiClient.setToken(testToken);

console.log('✅ API client initialized with test token\n');

