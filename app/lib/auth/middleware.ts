import { NextRequest, NextResponse } from 'next/server';
import { jwtService } from './jwt';

export interface AuthContext {
  user?: {
    id: string;
    email: string;
    role: string;
  };
  service?: {
    name: string;
    permissions: string[];
  };
}

export class AuthMiddleware {
  static async authenticate(request: NextRequest): Promise<AuthContext | NextResponse> {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Missing or invalid authorization header',
          },
        },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);

    try {
      const payload = jwtService.verifyToken(token);
      return {
        user: {
          id: payload.sub,
          email: payload.email,
          role: payload.role,
        },
      };
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Invalid or expired token',
          },
        },
        { status: 401 }
      );
    }
  }

  static async authenticateService(request: NextRequest): Promise<AuthContext | NextResponse> {
    const serviceToken = request.headers.get('x-service-token');

    if (!serviceToken) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Missing service token',
          },
        },
        { status: 401 }
      );
    }

    try {
      const payload = jwtService.verifyServiceToken(serviceToken);
      return {
        service: {
          name: payload.serviceName,
          permissions: payload.permissions,
        },
      };
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Invalid or expired service token',
          },
        },
        { status: 401 }
      );
    }
  }

  static requirePermission(context: AuthContext, permission: string): boolean {
    if (context.user?.role === 'ADMIN') {
      return true;
    }

    if (context.service?.permissions.includes(permission)) {
      return true;
    }

    return false;
  }
}

