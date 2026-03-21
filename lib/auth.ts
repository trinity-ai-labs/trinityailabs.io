import { betterAuth } from "better-auth";
import { Kysely } from "kysely";
import { LibsqlDialect } from "@libsql/kysely-libsql";
import { db } from "@/lib/db";
import { sendVerificationEmail } from "@/lib/email";
import { ensureRoleColumn } from "@/lib/ensure-tables";

const adminEmails = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

function createAuth() {
  return betterAuth({
    database: {
      db: new Kysely<object>({
        dialect: new LibsqlDialect({
          url: process.env.TURSO_DATABASE_URL!,
          authToken: process.env.TURSO_AUTH_TOKEN,
        }),
      }),
      type: "sqlite",
    },
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: true,
    },
    socialProviders: {
      ...(process.env.GOOGLE_CLIENT_ID && {
        google: {
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        },
      }),
      ...(process.env.GITHUB_CLIENT_ID && {
        github: {
          clientId: process.env.GITHUB_CLIENT_ID,
          clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        },
      }),
    },
    emailVerification: {
      sendOnSignUp: true,
      sendVerificationEmail: async ({ user, url }) => {
        await sendVerificationEmail(user.email, url);
      },
    },
    databaseHooks: {
      user: {
        create: {
          after: async (user) => {
            if (adminEmails.includes(user.email.toLowerCase())) {
              await ensureRoleColumn();
              await db.execute({
                sql: `UPDATE user SET role = 'admin' WHERE id = ?`,
                args: [user.id],
              });
            }
          },
        },
      },
    },
  });
}

type AuthInstance = ReturnType<typeof createAuth>;

const holder: { instance: AuthInstance | null } = { instance: null };

function getAuth(): AuthInstance {
  if (!holder.instance) holder.instance = createAuth();
  return holder.instance;
}

export const auth = new Proxy({} as AuthInstance, {
  get(_target, prop) {
    return Reflect.get(getAuth(), prop);
  },
  has(_target, prop) {
    return prop in getAuth();
  },
});
