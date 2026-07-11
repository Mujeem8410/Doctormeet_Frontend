const isBrowser = typeof window !== "undefined";
const isLocalHost =
  isBrowser &&
  ["localhost", "127.0.0.1"].includes(window.location.hostname);

const fallbackServerUrl = isLocalHost ? "http://localhost:5000" : "";

const trimTrailingSlash = (value) => value.replace(/\/+$/, "");

const configuredServerUrl =
  import.meta.env.VITE_SERVER_URL || import.meta.env.VITE_SOCKET_URL || "";

const serverUrl = trimTrailingSlash(configuredServerUrl || fallbackServerUrl);

export const SOCKET_URL = trimTrailingSlash(
  import.meta.env.VITE_SOCKET_URL || serverUrl || (isBrowser ? window.location.origin : "")
);

export const API_BASE_URL = trimTrailingSlash(
  import.meta.env.VITE_API_URL ||
    (serverUrl ? `${serverUrl}/api` : isBrowser ? `${window.location.origin}/api` : "/api")
);

if (!import.meta.env.DEV && !import.meta.env.VITE_API_URL && !configuredServerUrl) {
  console.warn(
    "DocMeet runtime config is missing VITE_API_URL/VITE_SERVER_URL. Production requests will use the current origin."
  );
}
