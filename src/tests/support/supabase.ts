import { vi } from "vitest";

type Response = {
  data?: unknown;
  error?: { code?: string; message: string } | null;
  count?: number;
};

export function fakeSupabase() {
  const calls: unknown[][] = [];
  let response: Response = { data: null, error: null };

  const query: Record<string, unknown> = new Proxy(
    {},
    {
      get(_, method) {
        if (method === "then") {
          return (resolve: (value: Response) => unknown, reject: (reason: unknown) => unknown) =>
            Promise.resolve(response).then(resolve, reject);
        }
        return (...args: unknown[]) => {
          calls.push([method, ...args]);
          return query;
        };
      },
    },
  );

  const auth = {
    signUp: vi.fn(),
    signInWithPassword: vi.fn(),
    signOut: vi.fn(),
    getUser: vi.fn(),
    admin: { deleteUser: vi.fn() },
  };

  const client = {
    auth,
    from(table: string) {
      calls.push(["from", table]);
      return query;
    },
    rpc(fn: string, args: unknown) {
      calls.push(["rpc", fn, args]);
      return Promise.resolve(response);
    },
  };

  return {
    client,
    auth,
    calls,
    respond(next: Response) {
      response = { error: null, ...next };
    },
    reset() {
      calls.length = 0;
      response = { data: null, error: null };
      vi.resetAllMocks();
    },
  };
}
