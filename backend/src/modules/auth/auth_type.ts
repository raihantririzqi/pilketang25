export type GoogleCallbackResult = {
  user: {
    id: string;
    google_id: string;
    name: string;
    email: string;
    nim: string;
    role: string;
    created_at: Date;
    updated_at: Date;
  };
  signed_access_token: string;
  signed_refresh_token: string;
};

export type RefreshResult = {
  access_token_payload: {
    sub: string;
    role: string;
    jti: string;
  };
  token_type: string;
  expires_in: number;
};

export type ValidateGooglePayloadResult = {
  google_id: string;
  email: string;
  name: string;
  nim: string;
};

export type GenerateTokenPayloadResult = {
  access_token_payload: {
    sub: string;
    role: string;
    jti: string;
  };
  refresh_token_payload: {
    sub: string;
    role: string;
    jti: string;
  };
};

export type UserProfile = {
  id: string;
  google_id: string;
  name: string;
  email: string;
  nim: string;
  role: string;
  image: string | null;
  created_at: Date;
  updated_at: Date;
};
