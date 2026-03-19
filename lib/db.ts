import { createClient, type Client } from "@libsql/client";

let _db: Client | null = null;

export const db: Client = new Proxy({} as Client, {
  get(_target, prop) {
    if (!_db) {
      _db = createClient({
        url: process.env.TURSO_DATABASE_URL!,
        authToken: process.env.TURSO_AUTH_TOKEN,
      });
    }
    return Reflect.get(_db, prop);
  },
});
