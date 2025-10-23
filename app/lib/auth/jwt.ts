import * as jwt from 'jsonwebtoken';

export interface JWTPayload {
  sub: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export interface ServiceTokenPayload {
  serviceName: string;
  permissions: string[];
  iat?: number;
  exp?: number;
}

export class JWTService {
  private readonly secret: string;
  private readonly serviceSecret: string;

  constructor() {
    this.secret = 'default-secret-change-in-production';
    this.serviceSecret = 'default-service-secret';
  }

  verifyToken(token: string): JWTPayload {
    try {
      return jwt.verify(token, this.secret) as JWTPayload;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  verifyServiceToken(token: string): ServiceTokenPayload {
    try {
      return jwt.verify(token, this.serviceSecret) as ServiceTokenPayload;
    } catch (error) {
      throw new Error('Invalid service token');
    }
  }

  signToken(payload: Omit<JWTPayload, 'iat' | 'exp'>, expiresIn: string | number = '24h'): string {
    return jwt.sign(payload, this.secret, { expiresIn } as jwt.SignOptions);
  }

  signServiceToken(
    payload: Omit<ServiceTokenPayload, 'iat' | 'exp'>,
    expiresIn: string | number = '1h'
  ): string {
    return jwt.sign(payload, this.serviceSecret, { expiresIn } as jwt.SignOptions);
  }
}

export const jwtService = new JWTService();

