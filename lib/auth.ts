import { betterAuth } from "better-auth";
import { Kysely } from "kysely";
import { LibsqlDialect } from "@libsql/kysely-libsql";
import { db } from "@/lib/db";
import { sendVerificationEmail } from "@/lib/email";
import { ensureRoleColumn } from "@/lib/ensure-tables";

const kyselyDb = new Kysely({
  dialect: new LibsqlDialect({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN,
  }),
});

const adminEmails = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export const auth = betterAuth({
  database: {
    db: kyselyDb,
    type: "sqlite",
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
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
