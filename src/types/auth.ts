// Auth Types
export type AuthLayer = 'layer1' | 'layer2' | 'layer3';

export interface ThreeLayerAuthState {
  currentLayer: AuthLayer;
  layer1Verified: boolean;
  layer2Verified: boolean;
  layer3Verified: boolean;
  isAuthenticated: boolean;
  sessionToken?: string;
}

export interface AdminSession {
  id: string;
  adminId: string;
  token: string;
  layer1Verified: boolean;
  layer2Verified: boolean;
  layer3Verified: boolean;
  expiresAt: Date;
  createdAt: Date;
}

export interface AuthCredentials {
  layer1?: {
    question: string;
    answer: string;
  };
  layer2?: {
    password: string;
  };
  layer3?: {
    secretKey: string;
  };
}

export interface AuthResponse {
  success: boolean;
  message: string;
  layer?: AuthLayer;
  token?: string;
  requiresNextLayer?: boolean;
}

export interface JWTPayload {
  sub: string;
  sessionId: string;
  layers: {
    layer1: boolean;
    layer2: boolean;
    layer3: boolean;
  };
  iat: number;
  exp: number;
}
