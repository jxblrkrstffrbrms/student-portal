import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardContent, 
    IonCardHeader, IonCardTitle, IonCardSubtitle, IonList, IonItem, IonLabel, IonButton, IonIcon,
    IonBadge, IonSearchbar, IonSelect, IonSelectOption, AlertController } from '@ionic/angular/standalone';
import { FirebaseService } from '../../services/firebase.service';
import { ref, onValue, update, query, orderByChild } from 'firebase/database';
import { addIcons } from 'ionicons';
import { timeOutline, checkmarkOutline, closeOutline } from 'ionicons/icons';

interface Report {
  id?: string;
  title: string;
  description: string;
  userId: string;
  userName: string;
  timestamp: string;
  status: 'pending' | 'in-progress' | 'resolved';
}

@Component({
  selector: 'app-manage-reports',
  templateUrl: './manage-reports.page.html',
  styleUrls: ['./manage-reports.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonContent, IonHeader, IonTitle, IonToolbar, 
    IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonList, IonItem, 
    IonLabel, IonButton, IonIcon, IonCardSubtitle, IonBadge, IonSearchbar, IonSelect, IonSelectOption]
})
export class ManageReportsPage implements OnInit {
  reports: Report[] = [];
  filteredReports: Report[] = [];
  searchText: string = '';
  statusFilter: string = 'all';

  constructor(
    private firebaseService: FirebaseService,
    private alertController: AlertController,
    private router: Router
  ) {
    addIcons({ timeOutline, checkmarkOutline, closeOutline });
  }

  ngOnInit() {
    this.loadReports();
  }

  goBack() {
    this.router.navigate(['/admin']);
  }

  loadReports() {
    const reportsRef = ref(this.firebaseService.database, 'reports');
    const reportsQuery = query(reportsRef, orderByChild('timestamp'));

    onValue(reportsQuery, (snapshot) => {
      this.reports = [];
      snapshot.forEach((childSnapshot) => {
        this.reports.push({
          id: childSnapshot.key,
          ...childSnapshot.val()
        });
      });
      this.reports.reverse(); // Show newest first
      this.filterReports();
    });
  }

  filterReports() {
    this.filteredReports = this.reports.filter(report => {
      const matchesSearch = !this.searchText || 
        report.title.toLowerCase().includes(this.searchText.toLowerCase()) ||
        report.description.toLowerCase().includes(this.searchText.toLowerCase()) ||
        report.userName.toLowerCase().includes(this.searchText.toLowerCase());
      
      const matchesStatus = this.statusFilter === 'all' || report.status === this.statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }

  async updateStatus(report: Report, newStatus: 'pending' | 'in-progress' | 'resolved') {
    if (!report.id) return;

    try {
      const reportRef = ref(this.firebaseService.database, `reports/${report.id}`);
      await update(reportRef, { status: newStatus });
      await this.showAlert('Success', 'Report status updated');
    } catch (error) {
      console.error('Error updating report:', error);
      await this.showAlert('Error', 'Failed to update report status');
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

  getStatusColor(status: string): string {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'in-progress':
        return 'primary';
      case 'resolved':
        return 'success';
      default:
        return 'medium';
    }
  }

  
} 