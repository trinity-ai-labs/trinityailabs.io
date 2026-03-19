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

// Proxy over a function target so both property access and function calls work
// (Better Auth's handler is callable via toNextJsHandler)
const noop = function () {} as unknown as AuthInstance;
export const auth = new Proxy(noop, {
  get(_target, prop, receiver) {
    const instance = getAuth();
    const value = Reflect.get(instance, prop, receiver);
    return typeof value === "function" ? value.bind(instance) : value;
  },
  apply(_target, thisArg, args) {
    const instance = getAuth();
    return Reflect.apply(instance as unknown as CallableFunction, thisArg, args);
  },
}) as unknown as AuthInstance;
