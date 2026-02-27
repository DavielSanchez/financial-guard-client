import withPWAInit from "@ducanh2912/next-pwa";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  turbopack: {},
};

// Detectamos si estamos ejecutando con el flag --turbopack
const isTurbo = process.argv.includes("--turbopack");

const withPWA = withPWAInit({
  dest: "public",
  // Deshabilitamos el PWA si estamos en desarrollo o usando Turbopack
  // El PWA solo es realmente necesario para pruebas de producción/build
  disable: isTurbo || process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
  cacheOnFrontendNav: true,
  fallbacks: {
    document: "/~offline",
  },
  extendDefaultRuntimeCaching: true,
  workboxOptions: {
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/fonts\.(?:gstatic|googleapis)\.com\/.*/i,
        handler: "CacheFirst",
        options: {
          cacheName: "google-fonts-webfonts",
          expiration: {
            maxEntries: 4,
            maxAgeSeconds: 365 * 24 * 60 * 60,
          },
        },
      },
      {
        urlPattern: /\/api\/.*/i,
        handler: "NetworkFirst",
        options: {
          cacheName: "api-cache",
          expiration: {
            maxEntries: 32,
            maxAgeSeconds: 24 * 60 * 60,
          },
          networkTimeoutSeconds: 10,
        },
      },
    ],
  },
});

// Si es Turbo, exportamos la configuración pura para evitar que el plugin inyecte Webpack
// Si no es Turbo (build o dev normal), inyectamos el PWA
export default isTurbo ? nextConfig : withPWA(nextConfig);