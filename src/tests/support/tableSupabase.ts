type Response = {
  data?: unknown;
  error?: { code?: string; message: string } | null;
};

export function tableSupabase() {
  const calls: unknown[][] = [];
  let responses: Record<string, Response> = {};

  const responseFor = (key: string): Response => ({
    data: null,
    error: null,
    ...responses[key],
  });

  const queryFor = (table: string): Record<string, unknown> =>
    new Proxy(
      {},
      {
        get(_, method) {
          if (method === "then") {
            return (resolve: (value: Response) => unknown, reject: (reason: unknown) => unknown) =>
              Promise.resolve(responseFor(table)).then(resolve, reject);
          }
          return (...args: unknown[]) => {
            calls.push([table, method, ...args]);
            return queryFor(table);
          };
        },
      },
    );

  const client = {
    from(table: string) {
      calls.push([table, "from"]);
      return queryFor(table);
    },
    rpc(fn: string, args: unknown) {
      calls.push([fn, "rpc", args]);
      return Promise.resolve(responseFor(fn));
    },
  };

  return {
    client,
    calls,
    respond(next: Record<string, Response>) {
      responses = next;
    },
    reset() {
      calls.length = 0;
      responses = {};
    },
  };
}
