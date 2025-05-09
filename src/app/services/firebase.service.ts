import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyDFAPlxgjRhqGi4LlUTYtGvrgQu0Eb7MKs",
  authDomain: "pshs-student-portal.firebaseapp.com",
  projectId: "pshs-student-portal",
  storageBucket: "pshs-student-portal.firebasestorage.app",
  messagingSenderId: "528701191387",
  appId: "1:528701191387:web:0abd467425cd2f6e5508fe",
  measurementId: "G-3XTEWFWGH4",
  databaseURL: "https://pshs-student-portal-default-rtdb.firebaseio.com"
};

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private app = initializeApp(firebaseConfig);
  public auth = getAuth(this.app);
  public database = getDatabase(this.app);

  constructor() {}
} 