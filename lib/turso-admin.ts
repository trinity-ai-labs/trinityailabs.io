const API_BASE = "https://api.turso.tech/v1";
const ORG = process.env.TURSO_ORG ?? "trinity-ai-labs";

function headers() {
  return {
    Authorization: `Bearer ${process.env.TURSO_PLATFORM_API_TOKEN}`,
    "Content-Type": "application/json",
  };
}

interface TursoDatabase {
  name?: string;
  Name?: string;
  hostname?: string;
  Hostname?: string;
}

function dbName(d: TursoDatabase): string | undefined {
  return d.name ?? d.Name;
}

function dbHostname(d: TursoDatabase): string | undefined {
  return d.hostname ?? d.Hostname;
}

interface TursoToken {
  jwt: string;
}

export async function createDatabase(
  name: string,
): Promise<{ dbName: string; dbUrl: string }> {
  const res = await fetch(`${API_BASE}/organizations/${ORG}/databases`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({
      name,
      group: "default",
    }),
  });

  if (!res.ok) {
    // 409 = already exists — fetch existing DB info instead
    if (res.status === 409) {
      const existing = await fetch(
        `${API_BASE}/organizations/${ORG}/databases/${name}`,
        { headers: headers() },
      );
      if (existing.ok) {
        const data = (await existing.json()) as { database: TursoDatabase };
        return {
          dbName: dbName(data.database) ?? name,
          dbUrl: `libsql://${dbHostname(data.database) ?? `${name}-${ORG}.turso.io`}`,
        };
      }
    }
    const text = await res.text();
    throw new Error(`Turso createDatabase failed (${res.status}): ${text}`);
  }

  const data = (await res.json()) as { database: TursoDatabase };
  return {
    dbName: dbName(data.database) ?? name,
    dbUrl: `libsql://${dbHostname(data.database) ?? `${name}-${ORG}.turso.io`}`,
  };
}

export async function createDatabaseToken(dbName: string): Promise<string> {
  const res = await fetch(
    `${API_BASE}/organizations/${ORG}/databases/${dbName}/auth/tokens?expiration=7d`,
    {
      method: "POST",
      headers: headers(),
    },
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Turso createToken failed (${res.status}): ${text}`);
  }

  const data = (await res.json()) as TursoToken;
  return data.jwt;
}

export async function revokeDatabaseTokens(dbName: string): Promise<void> {
  const res = await fetch(
    `${API_BASE}/organizations/${ORG}/databases/${dbName}/auth/rotate`,
    {
      method: "POST",
      headers: headers(),
    },
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Turso revokeTokens failed (${res.status}): ${text}`);
  }
}

export async function deleteDatabase(dbName: string): Promise<void> {
  const res = await fetch(
    `${API_BASE}/organizations/${ORG}/databases/${dbName}`,
    {
      method: "DELETE",
      headers: headers(),
    },
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Turso deleteDatabase failed (${res.status}): ${text}`);
  }
}
