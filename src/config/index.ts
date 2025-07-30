export const config = {
  apiBase: process.env.NEXT_PUBLIC_API_BASE!,
  isDev: process.env.NODE_ENV === "development"!,
};

export default config;
