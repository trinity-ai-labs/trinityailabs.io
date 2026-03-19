import { SignJWT, jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

interface TokenPayload {
  sub: string;
  email: string;
  name: string;
  subscription: string | null;
}

export async function signAccessToken(payload: TokenPayload) {
  return new SignJWT({ email: payload.email, name: payload.name, subscription: payload.subscription })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuer("trinityailabs.com")
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(secret);
}

export async function verifyAccessToken(token: string) {
  const { payload } = await jwtVerify(token, secret, {
    issuer: "trinityailabs.com",
  });
  return payload as typeof payload & {
    email: string;
    name: string;
    subscription: string | null;
  };
}
