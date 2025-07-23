export const config = {
  apiBase: process.env.NEXT_PUBLIC_API_URL!,
  appEnv: process.env.NEXT_PUBLIC_APP_ENV!,
  isDev: process.env.NODE_ENV === 'development'!,
}

export default config