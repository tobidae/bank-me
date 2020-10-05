import * as express from 'express';
import * as constants from "./utilities/const";

import triggers from './triggers';
import * as noauth from './utilities/noauth-functions';
import {VALID_MEMORY_OPTIONS} from 'firebase-functions/lib/function-configuration';

const main = express();
require('./utilities').default({expressApp: main});

const triggerPaths = triggers.paths;
// const pubsubTriggers = triggers.pubsub;
// const rtDbTriggers = triggers.database;
// const firestoreTriggers = triggers.firestore;

const runtimeOpts256 = {
  memory: VALID_MEMORY_OPTIONS[1] // 256 MB
};
const runtimeOpts512 = {
  memory: VALID_MEMORY_OPTIONS[2] // 512 MB
};
const runtimeOpts1024 = {
  memory: VALID_MEMORY_OPTIONS[3] // 1024 MB
};
const timezone = "America/Chicago";

const functions = constants.default.functions;
const funcOpts = functions.runWith(runtimeOpts256);
const funcFirestore = funcOpts.firestore.document;
const funcDatabase = funcOpts.database.ref;

// HTTP REQUESTS
export const api = functions.runWith(runtimeOpts512).https.onRequest(main);

// FIRESTORE
// When a store is created and the user enabled the inventoryFeed Service, create the defaultFeed


// RT DATABASE

// PUB SUB
