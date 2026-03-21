const API_BASE = "https://api.turso.tech/v1";
const ORG = process.env.TURSO_ORG ?? "trinity-ai-labs";

function headers() {
  return {
    Authorization: `Bearer ${process.env.TURSO_PLATFORM_API_TOKEN}`,
    "Content-Type": "application/json",
  };
}

interface TursoDatabase {
  name: string;
  hostname: string;
}

interface TursoToken {
  jwt: string;
}

export async function createDatabase(
  name: string
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
        { headers: headers() }
      );
      if (existing.ok) {
        const data = (await existing.json()) as { database: TursoDatabase };
        return {
          dbName: data.database.name,
          dbUrl: `libsql://${data.database.hostname}`,
        };
      }
    }
    const text = await res.text();
    throw new Error(`Turso createDatabase failed (${res.status}): ${text}`);
  }

  const data = (await res.json()) as { database: TursoDatabase };
  return {
    dbName: data.database.name,
    dbUrl: `libsql://${data.database.hostname}`,
  };
}

export async function createDatabaseToken(
  dbName: string
): Promise<string> {
  const res = await fetch(
    `${API_BASE}/organizations/${ORG}/databases/${dbName}/auth/tokens`,
    {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({ permissions: { read_attach: { databases: ["*"] } } }),
    }
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
    }
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
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Turso deleteDatabase failed (${res.status}): ${text}`);
  }
}
