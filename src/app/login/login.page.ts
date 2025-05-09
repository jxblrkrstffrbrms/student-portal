import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { globeOutline, logoFacebook, helpCircleOutline, peopleOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonFab, IonFabButton, IonFabList, IonIcon, IonCard, 
  IonCardHeader, IonCardContent, IonCardTitle, IonItem, IonInput, IonButton, IonCol, IonGrid, IonRow, AlertController } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyDFAPlxgjRhqGi4LlUTYtGvrgQu0Eb7MKs",
  authDomain: "pshs-student-portal.firebaseapp.com",
  projectId: "pshs-student-portal",
  storageBucket: "pshs-student-portal.firebasestorage.app",
  messagingSenderId: "528701191387",
  appId: "1:528701191387:web:0abd467425cd2f6e5508fe",
  measurementId: "G-3XTEWFWGH4"
};

// Initializing Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonFab, IonFabButton, 
    IonFabList, IonIcon, IonCard, IonCardHeader, IonCardContent, IonCardTitle, IonItem, IonInput,
    IonButton, IonCol, IonGrid, IonRow]
})
export class LoginPage implements OnInit {
  email: string = '';
  password: string = '';

  constructor(
    private router: Router,
    private alertController: AlertController
  ) {
    addIcons({helpCircleOutline, logoFacebook, globeOutline, peopleOutline});
  }

  ngOnInit() {
  }

  async submitForm() {
    if (!this.email || !this.password) {
      await this.showAlert('Error', 'Please enter both email and password');
      return;
    }

    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(auth, this.email, this.password);
      console.log('User logged in successfully:', userCredential.user);
      this.router.navigate(['tabs']);
    } catch (error: any) {
      let errorMessage = 'An error occurred during login';
      
      switch (error.code) {
        case 'auth/invalid-email':
          errorMessage = 'Invalid email format';
          break;
        case 'auth/user-not-found':
          errorMessage = 'No user found with this email';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password';
          break;
      }
      
      await this.showAlert('Login Failed', errorMessage);
      console.error('Login error:', error);
    }
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
}
