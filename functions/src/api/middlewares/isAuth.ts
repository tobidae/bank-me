import {Request, Response} from 'express';

import * as constants from './../../utilities/const';
import {ForbiddenError} from '../../utilities/errors';

const functions = constants.default.functions;
const fireAuth = constants.default.fireAuth;

// Validate the firebase JWT token that is passed in the authorization header, used as a middleware.
const validateFirebaseIdToken = (req: Request | any, res: Response | any, next: any) => {
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
        return res.status(401).send({
            type: 'error',
            message: 'Unauthorized, missing authorization header!'
        });
    }

    // Splice the auth token from the authorization header
    const idToken = req.headers.authorization.split('Bearer ')[1];
    const logMessage = 'Unauthorized access attempted, this incident will be reported';

    // Verify that the idToken matches a user.ts belonging to this application before accessing the api
    fireAuth.verifyIdToken(idToken)
        .then(user => {
            if (user) {
                req.user = user;
                next();
            } else {
                throw new ForbiddenError(logMessage)
            }
        })
        .catch(err => {
            functions.logger.error(logMessage, {
                error: err
            });
            if (!err.status) {
                err.status = 419;
            }
            // Use the 419 error code because the token has probably expired
            return res.status(err.status).send({
                type: 'error',
                message: err.message,
                body: err
            });
        });
};


export default {
    validateFirebaseIdToken
};
