export default () => ({
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : undefined,
  database: {
    url: process.env.DATABASE_URL,
  },
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '30d',
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  },
  cors: {
    origin: process.env.CORS_ORIGIN,
  },
  throttle: {
    ttlMs: process.env.THROTTLE_TTL_MS ? parseInt(process.env.THROTTLE_TTL_MS, 10) : undefined,
    limit: process.env.THROTTLE_LIMIT ? parseInt(process.env.THROTTLE_LIMIT, 10) : undefined,
  },
  admin: {
    setupSecret: process.env.ADMIN_SETUP_SECRET,
  },
  webhook: {
    secret: process.env.WEBHOOK_SECRET,
  },
  r2: {
    accountId: process.env.R2_ACCOUNT_ID,
    endpoint: process.env.R2_ENDPOINT || process.env.R2_IMAGES_ENDPOINT,
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    bucketName: process.env.R2_BUCKET_NAME,
    publicUrl: process.env.R2_PUBLIC_URL,
    uploadMaxSizeMb: process.env.R2_UPLOAD_MAX_SIZE_MB
      ? parseInt(process.env.R2_UPLOAD_MAX_SIZE_MB, 10)
      : 50,
    uploadAllowedMimes: process.env.R2_UPLOAD_ALLOWED_MIMES
      ? process.env.R2_UPLOAD_ALLOWED_MIMES.split(',').map((s) => s.trim()).filter(Boolean)
      : undefined,
  },
  vapid: {
    publicKey: process.env.VAPID_PUBLIC_KEY,
    privateKey: process.env.VAPID_PRIVATE_KEY,
  },
  pwa: {
    appName: process.env.PWA_APP_NAME || process.env.VITE_APP_NAME,
    shortName: process.env.PWA_SHORT_NAME || process.env.VITE_APP_NAME,
    description: process.env.PWA_DESCRIPTION || process.env.VITE_APP_DESCRIPTION,
    themeColor: process.env.PWA_THEME_COLOR || process.env.VITE_THEME_COLOR,
    backgroundColor: process.env.PWA_BACKGROUND_COLOR || process.env.VITE_BACKGROUND_COLOR,
    faviconUrl: process.env.PWA_FAVICON_URL,
    icon192Url: process.env.PWA_ICON_192_URL,
    icon512Url: process.env.PWA_ICON_512_URL,
    appleTouchIconUrl: process.env.PWA_APPLE_TOUCH_ICON_URL,
  },
  app: {
    frontendUrl: process.env.APP_FRONTEND_URL || process.env.CORS_ORIGIN,
  },
  smtp: {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : undefined,
    secure: process.env.SMTP_SECURE === 'true' || process.env.SMTP_SECURE === '1',
    user: process.env.SMTP_USER,
    password: process.env.SMTP_PASSWORD,
    fromEmail: process.env.SMTP_FROM_EMAIL,
    fromName: process.env.SMTP_FROM_NAME,
  },
});
