export type DecodedToken = {
  sub: string;   // user ID
  role: string;
  iat: number;
  exp: number;
};
