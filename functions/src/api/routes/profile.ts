import {Router, Request, Response} from 'express';
import * as constants from './../../utilities/const';
import middlewares from '../middlewares';

const router = Router();
const firestore = constants.default.firestore;
const database = constants.default.database;
const fireAuth = constants.default.fireAuth;
const fireArrayUnion = constants.default.fireArrayUnion;
const fireArrayRemove = constants.default.fireArrayRemove;
const dateFormats = constants.default.dateFormats;

const project = JSON.parse(process.env.FIREBASE_CONFIG!).projectId;
let siteUrl = 'https://bankme.com';

if (process.env.NODE_ENV === 'local' || project === 'bank-me') {
    siteUrl = 'https://devapp.bankme';
}

export default (app: Router) => {
    app.use('/profiles', router);

    // router.post('/create-profile', createProfile);
};
