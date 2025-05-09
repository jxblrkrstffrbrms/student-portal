import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { globeOutline, logoFacebook, helpCircleOutline, peopleOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonFab, IonFabButton, IonFabList, IonIcon, IonCard, 
  IonCardHeader, IonCardContent, IonCardTitle, IonItem, IonInput, IonButton, IonCol, IonGrid, IonRow, AlertController } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { FirebaseService } from '../services/firebase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonFab, IonFabButton, 
    IonFabList, IonIcon, IonCard, IonCardHeader, IonCardContent, IonCardTitle, IonItem, IonInput,
    IonButton, IonCol, IonGrid, IonRow]
})
export class LoginPage {
  email: string = '';
  password: string = '';
  isAdminLogin: boolean = false;

  constructor(
    private router: Router,
    private alertController: AlertController,
    private firebaseService: FirebaseService
  ) {
    addIcons({helpCircleOutline, logoFacebook, globeOutline, peopleOutline});
  }

  async login() {
    if (!this.email || !this.password) {
      await this.showAlert('Error', 'Please enter both email and password');
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        this.firebaseService.auth,
        this.email,
        this.password
      );

      if (this.isAdminLogin) {
        // Check if the user is an admin
        if (userCredential.user.email === 'admin@cbzrc.pshs.edu.ph') {
          this.router.navigate(['/admin']);
        } else {
          await this.showAlert('Access Denied', 'You do not have admin privileges');
          await this.firebaseService.auth.signOut();
        }
      } else {
        this.router.navigate(['/tabs/tab1']);
      }
    } catch (error: any) {
      console.error('Login error:', error);
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
    }
  }

  goToAdmin() {
    this.isAdminLogin = true;
    this.showAlert('Admin Login', 'Please enter admin credentials');
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
