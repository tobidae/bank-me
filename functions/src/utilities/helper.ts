import config from './../config';

export let projectID: string;
export let stackDriverServiceAccount: string;

const adminConfig = JSON.parse(process.env.FIREBASE_CONFIG || '');
export const isLocalEnv = process.env.NODE_ENV === 'local';
export const isDevEnv = isLocalEnv || adminConfig.projectId === 'bank-me-dev';

if (process.env.NODE_ENV === 'local' || process.env.NODE_ENV === config.local.projectNames) {
    projectID = config.local.projectNames;
    stackDriverServiceAccount = config.local.loggingSecurityAcct;
} else {
    projectID = config.prod.projectNames;
    stackDriverServiceAccount = config.prod.loggingSecurityAcct;
}

export const sleep = (ms: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
