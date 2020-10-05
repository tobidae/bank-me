import {Request, Response} from 'firebase-functions';
import * as constants from "./const";

const functions = constants.default.functions;

const cors = require('cors')({
    origin: true
});
