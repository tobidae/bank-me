import { Router } from 'express';
import middlewares from './middlewares';
import profile from './routes/profile';

export default () => {
    const app = Router();
    const noAuthApp = Router();
    app.use(middlewares.authModule.default.validateFirebaseIdToken);

    profile(app);

    return {app, noAuthApp}
};
