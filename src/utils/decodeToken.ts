import { jwtDecode } from "jwt-decode";

interface MyTokenPayload {
  aud: string;
  cid: string;
  exp: number;
  iat: number;
  iss: string;
  scope: string;
  sub: string;
  uid: string;
}

export function decodeToken(token: string): MyTokenPayload | null {
  try {
    const decoded = jwtDecode<MyTokenPayload>(token);
    return decoded;
  } catch (error) {
    console.error("Failed to decode JWT:", error);
    return null;
  }
}
