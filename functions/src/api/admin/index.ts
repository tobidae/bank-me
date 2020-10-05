import { Router } from 'express';

import middlewares from './../middlewares';

export default () => {
    const app = Router();
    app.use(middlewares.authModule.default.validateFirebaseIdToken);
    return app
};
