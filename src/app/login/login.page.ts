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
    try {
      const userCredential = await signInWithEmailAndPassword(
        this.firebaseService.auth,
        this.email,
        this.password
      );
      
      if (this.isAdminLogin) {
        this.router.navigate(['/admin']);
      } else {
        this.router.navigate(['/tabs/tab1']);
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please check your credentials.');
    }
  }

  goToAdmin() {
    this.isAdminLogin = true;
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
