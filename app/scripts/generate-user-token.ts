import { jwtService } from '../lib/auth/jwt';

const userId = process.argv[2] || 'user-123';
const email = process.argv[3] || 'user@example.com';
const role = process.argv[4] || 'ADMIN';

const token = jwtService.signToken(
  {
    sub: userId,
    email,
    role,
  },
  '24h' // 24 hours expiry
);

console.log('\n🔑 User Token Generated\n');
console.log('User ID:', userId);
console.log('Email:', email);
console.log('Role:', role);
console.log('\nToken (add this to your Authorization header):\n');
console.log(token);
console.log('\n');

// Example usage
console.log('Example usage:');
console.log(`curl -H "Authorization: Bearer ${token}" \\`);
console.log('  http://localhost:3000/api/v1/companies');
console.log('\n');

