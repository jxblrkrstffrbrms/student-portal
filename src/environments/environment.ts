// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId: string;
}

export interface Environment {
  production: boolean;
  firebase: FirebaseConfig;
}

export const environment: Environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyDFAPlxgjRhqGi4LlUTYtGvrgQu0Eb7MKs",
    authDomain: "pshs-student-portal.firebaseapp.com",
    projectId: "pshs-student-portal",
    storageBucket: "pshs-student-portal.firebasestorage.app",
    messagingSenderId: "528701191387",
    appId: "1:528701191387:web:0abd467425cd2f6e5508fe",
    measurementId: "G-3XTEWFWGH4"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
