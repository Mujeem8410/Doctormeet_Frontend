const fallbackServerUrl = "http://localhost:5000";

const trimTrailingSlash = (value) => value.replace(/\/+$/, "");

const serverUrl = trimTrailingSlash(
  import.meta.env.VITE_SERVER_URL ||
    import.meta.env.VITE_SOCKET_URL ||
    fallbackServerUrl
);

export const SOCKET_URL = trimTrailingSlash(
  import.meta.env.VITE_SOCKET_URL || serverUrl
);

export const API_BASE_URL = trimTrailingSlash(
  import.meta.env.VITE_API_URL || `${serverUrl}/api`
);
