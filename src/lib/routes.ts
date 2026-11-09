export const AUTH_PATHS = ["/login", "/register"];

export const isAuthPath = (pathname: string) =>
  AUTH_PATHS.some((path) => pathname.startsWith(path));
