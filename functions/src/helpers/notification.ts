import * as constants from "../utilities/const";

const database = constants.default.database;
const functions = constants.default.functions;
const fireMessaging = constants.default.fireMessaging;

export const sendFCMNotification = (data: any, userID: string, token: string) => {
    if (!userID || userID === 'superuser') {
        return Promise.reject('User may not exist');
    }
    const type = data.type || 'info';
    const duration = data.duration ? data.duration.toString() : '7000';
    const payload = {
        notification: {
            title: data.title,
            body: data.body,
            icon: ''
        },
        data: {
            duration: duration,
            type: type,
        }
    };
    if (!(token.length > 0)) {
        return null;
    }
    return fireMessaging.sendToDevice(token, payload)
        .then(res => {
            res.results.forEach((result) => {
                const error = result.error;
                if (error) {
                    functions.logger.error('Failure sending notification for User', userID, error);
                }
            });
        });
};

export const databaseNotification = (data: any, userID: string) => {
    const type = data.type || 'info';
    const duration = data.duration ? data.duration.toString() : '7000';
    return database.ref(`users/${userID}/notifications`).set({
        title: data.title,
        body: data.body,
        duration: duration,
        type: type
    });
};

