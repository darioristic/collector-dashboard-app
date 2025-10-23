'use client';

import { useAuth } from '@/providers/auth-provider';
import { Button } from '@/components/ui/button';

export default function TestAuthPage() {
  const { isAuthenticated, token, setToken, clearToken } = useAuth();

  const handleSetTestToken = () => {
    const testToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0LXVzZXIiLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NjExMjI4OTYsImV4cCI6MTc2MTIwOTI5Nn0.CtMbQvgRRMw98-2TvbzS7dWhNP3tZvYzdHB7dE0r8wY";
    setToken(testToken);
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Auth Test Page</h1>
      
      <div className="space-y-4">
        <div className="p-4 border rounded">
          <h2 className="font-semibold mb-2">Authentication Status:</h2>
          <p>Is Authenticated: <span className={isAuthenticated ? 'text-green-600' : 'text-red-600'}>{isAuthenticated ? 'Yes' : 'No'}</span></p>
          <p>Token: <span className="text-sm text-gray-600">{token ? `${token.substring(0, 20)}...` : 'None'}</span></p>
        </div>

        <div className="flex gap-4">
          <Button onClick={handleSetTestToken}>
            Set Test Token
          </Button>
          <Button onClick={clearToken} variant="outline">
            Clear Token
          </Button>
        </div>

        <div className="p-4 border rounded">
          <h2 className="font-semibold mb-2">Instructions:</h2>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>Click "Set Test Token" to authenticate</li>
            <li>Go to <a href="/dashboard/admin/home" className="text-blue-600 underline">Dashboard</a></li>
            <li>Check if data loads properly</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
