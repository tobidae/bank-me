export const environment = {
  production: true,
  firebaseConfig : {
    apiKey: 'AIzaSyC6-o2xjnSWwb1vTHiff7MnMt2Krs5nFRw',
    authDomain: 'bank-me-dev.firebaseapp.com',
    databaseURL: 'https://bank-me-dev.firebaseio.com',
    projectId: 'bank-me-dev',
    storageBucket: 'bank-me-dev.appspot.com',
    messagingSenderId: '842959488219'
  },
  plaidConfig: {
    publicKey: '2bdcc5052632562cfa3e20281f7906',
    env: 'development'    // TODO: Perhaps this may move to production
  }
};
