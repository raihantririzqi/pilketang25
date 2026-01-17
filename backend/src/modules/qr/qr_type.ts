export type GenerateQRResult = {
  qr_code_url: string;
  session_id: string;
  created_at: Date;
  expires_at: number;
};

export type SimpleQRResult = {
  token: string;
  user_name: string;
  user_nim: string;
  profile_picture?: string;
  expires_at: Date;
};
