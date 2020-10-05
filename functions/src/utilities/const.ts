import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// For Local Serving of the Cloud Functions API
if (process.env.NODE_ENV === 'local') {
    const config = require('./../config');
    const data = require(config.default.dev.firebaseSecurityAcct);
    admin.initializeApp({
        credential: admin.credential.cert(data),
        databaseURL: config.default.dev.databaseUrl
    });
} else {
    admin.initializeApp();
}
const fireInit = admin.initializeApp;
const firestore = admin.firestore();
const firestoreNS = admin.firestore; // Firestore Name Space

firestore.settings({
    ignoreUndefinedProperties: true,
});
const database = admin.database();
const fireAuth = admin.auth();
const fireStorage = admin.storage();
const fireMessaging = admin.messaging();
const increment = admin.firestore.FieldValue.increment(1);
const decrement = admin.firestore.FieldValue.increment(-1);
const countFunc = (count: number = 1) => {
    return admin.firestore.FieldValue.increment(count);
}
const fireArrayUnion = (value: any) => {
    return admin.firestore.FieldValue.arrayUnion(value);
}
const fireArrayRemove = (value: any) => {
    return admin.firestore.FieldValue.arrayRemove(value);
}

const dateFormats = {
    dateTimestamp: 'YYYY-MM-DD HH:mm:ss',
    dateTimeRaw: 'YYYYMMDDHHmmss'
};

export default {
    dateFormats,
    fireInit,
    firestore,
    firestoreNS,
    database,
    fireAuth,
    fireStorage,
    fireMessaging,
    functions,

    increment,
    decrement,
    countFunc,
    fireArrayUnion,
    fireArrayRemove,
}
