### Setup

Make sure that you have put the following in `/src/config/firebaseConfig.js` directory before starting the app

```
const firebaseConfig = {
    apiKey: <your api key>,
    authDomain: <your auth domain>,
    databaseURL: <your database url>,
    projectId: <your project id>,
    storageBucket: <your storage bucket>,
    messagingSenderId: "<your messing sender id>",
    appId: "<your app id>",
    measurementId: "<your measurement id>"
  };

export default firebaseConfig;
```

### Running the app

`npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

