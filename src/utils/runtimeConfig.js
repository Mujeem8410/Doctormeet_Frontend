const isBrowser = typeof window !== "undefined";
const isLocalHost =
  isBrowser &&
  ["localhost", "127.0.0.1"].includes(window.location.hostname);

// Production backend URL - MUST be set via Vercel environment variables
const productionServerUrl = import.meta.env.VITE_SERVER_URL;

const trimTrailingSlash = (value) => value.replace(/\/+$/, "");

const configuredServerUrl = import.meta.env.VITE_SERVER_URL || import.meta.env.VITE_SOCKET_URL || "";
const fallbackServerUrl = isLocalHost ? "http://localhost:5000" : productionServerUrl || "";

const serverUrl = trimTrailingSlash(configuredServerUrl || fallbackServerUrl);

export const SOCKET_URL = trimTrailingSlash(
  import.meta.env.VITE_SOCKET_URL || 
  serverUrl || 
  (isBrowser ? window.location.origin : "")
);

export const API_BASE_URL = trimTrailingSlash(
  import.meta.env.VITE_API_URL ||
  (serverUrl ? `${serverUrl}/api` : isBrowser ? `${window.location.origin}/api` : "/api")
);

// Log configuration in development for debugging
if (import.meta.env.DEV) {
  console.log("🔧 DocMeet Configuration:");
  console.log("API_BASE_URL:", API_BASE_URL);
  console.log("SOCKET_URL:", SOCKET_URL);
  console.log("Is LocalHost:", isLocalHost);
} else {
  // Production warnings
  if (!import.meta.env.VITE_API_URL) {
    console.warn(
      "⚠️ VITE_API_URL not set. Using fallback. Set it in Vercel Environment Variables."
    );
  }
  if (!import.meta.env.VITE_SOCKET_URL) {
    console.warn(
      "⚠️ VITE_SOCKET_URL not set. Real-time updates may not work. Set it in Vercel Environment Variables."
    );
  }
}
