declare const _default: () => {
    port: number | undefined;
    database: {
        url: string | undefined;
    };
    jwt: {
        accessSecret: string | undefined;
        accessExpiresIn: string;
        refreshSecret: string | undefined;
        refreshExpiresIn: string;
    };
    cors: {
        origin: string | undefined;
    };
    throttle: {
        ttlMs: number | undefined;
        limit: number | undefined;
    };
    admin: {
        setupSecret: string | undefined;
    };
    webhook: {
        secret: string | undefined;
    };
    r2: {
        accountId: string | undefined;
        endpoint: string | undefined;
        accessKeyId: string | undefined;
        secretAccessKey: string | undefined;
        bucketName: string | undefined;
        publicUrl: string | undefined;
        uploadMaxSizeMb: number;
        uploadAllowedMimes: string[] | undefined;
    };
    vapid: {
        publicKey: string | undefined;
        privateKey: string | undefined;
    };
    pwa: {
        appName: string | undefined;
        shortName: string | undefined;
        description: string | undefined;
        themeColor: string | undefined;
        backgroundColor: string | undefined;
        faviconUrl: string | undefined;
        icon192Url: string | undefined;
        icon512Url: string | undefined;
        appleTouchIconUrl: string | undefined;
    };
    app: {
        frontendUrl: string | undefined;
    };
    smtp: {
        host: string | undefined;
        port: number | undefined;
        secure: boolean;
        user: string | undefined;
        password: string | undefined;
        fromEmail: string | undefined;
        fromName: string | undefined;
    };
};
export default _default;
