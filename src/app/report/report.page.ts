import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, 
  IonCard, IonCardContent, IonItem, IonInput, IonTextarea, IonButton, AlertController } from '@ionic/angular/standalone';
import { FirebaseService } from '../services/firebase.service';
import { ref, push } from 'firebase/database';
import { getAuth } from 'firebase/auth';

interface Report {
  title: string;
  description: string;
  userId: string;
  userName: string;
  timestamp: string;
  status: 'pending' | 'in-progress' | 'resolved';
}

@Component({
  selector: 'app-report',
  templateUrl: './report.page.html',
  styleUrls: ['./report.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonContent, IonHeader, IonTitle, IonToolbar, 
    IonButtons, IonBackButton, IonCard, IonCardContent, IonItem, IonInput, 
    IonTextarea, IonButton]
})
export class ReportPage {
  report: Report = {
    title: '',
    description: '',
    userId: '',
    userName: '',
    timestamp: '',
    status: 'pending'
  };

  constructor(
    private firebaseService: FirebaseService,
    private alertController: AlertController
  ) {}

  async submitReport() {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      await this.showAlert('Error', 'You must be logged in to submit a report');
      return;
    }

    const reportsRef = ref(this.firebaseService.database, 'reports');
    const newReport = {
      ...this.report,
      userId: user.uid,
      userName: user.email,
      timestamp: new Date().toISOString(),
      status: 'pending'
    };

    try {
      await push(reportsRef, newReport);
      await this.showAlert('Success', 'Report submitted successfully');
      this.report = {
        title: '',
        description: '',
        userId: '',
        userName: '',
        timestamp: '',
        status: 'pending'
      };
    } catch (error) {
      console.error('Error submitting report:', error);
      await this.showAlert('Error', 'Failed to submit report');
    }
  }

  private async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
}
