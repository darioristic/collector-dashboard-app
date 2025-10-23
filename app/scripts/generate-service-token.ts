import { jwtService } from '../lib/auth/jwt';

const serviceName = process.argv[2] || 'default-service';
const permissions = process.argv.slice(3) || [
  'companies:read',
  'companies:write',
  'contacts:read',
  'contacts:write',
  'relationships:read',
  'relationships:write',
];

const token = jwtService.signServiceToken(
  {
    serviceName,
    permissions,
  },
  '30d' // 30 days expiry
);

console.log('\n🔑 Service Token Generated\n');
console.log('Service Name:', serviceName);
console.log('Permissions:', permissions.join(', '));
console.log('\nToken (add this to your service\'s X-Service-Token header):\n');
console.log(token);
console.log('\n');

// Example usage
console.log('Example usage:');
console.log(`curl -H "X-Service-Token: ${token}" \\`);
console.log('  -H "Content-Type: application/json" \\');
console.log('  http://localhost:3000/api/v1/internal/companies');
console.log('\n');

