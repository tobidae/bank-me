
export default {
    local: {
        projectNames: 'bank-me-dev',
        firebaseSecurityAcct: './config/dev_firebase_admin_service_account.json',
        loggingSecurityAcct: './src/config/dev_logging_service_account.json',
        databaseUrl: 'https://bank-me-dev.firebaseio.com',
        siteUrls: [
            'http://localhost:4200',
            'http://localhost:4201'
        ]
    },
    prod: {
        projectNames: 'bank-me-dev',
        loggingSecurityAcct: './config/prod_logging_service_account.json',
        siteUrls: [
            'https://tobiak.com',
            'https://app.tobiak.com',
            'https://admin.tobiak.com',
        ]
    },
    api: {
        prefix: '/v1',
    }
};
