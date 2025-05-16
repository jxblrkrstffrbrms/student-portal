import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardContent, 
  IonCardHeader, IonCardTitle, IonList, IonItem, IonLabel, IonButton, IonIcon,
  IonGrid, IonRow, IonCol } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { getAuth, signOut } from 'firebase/auth';
import { addIcons } from 'ionicons';
import { people, school, megaphone, logOutOutline, bug } from 'ionicons/icons';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonContent, IonHeader, IonTitle, IonToolbar, 
    IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonList, IonItem, IonLabel, 
    IonButton, IonIcon, IonGrid, IonRow, IonCol]
})
export class AdminPage implements OnInit {
  constructor(private router: Router) {
    addIcons({people,school,megaphone,bug,logOutOutline});
  }

  ngOnInit() {}

  goToManageStudents() {
    this.router.navigate(['/admin/manage-students']);
  }

  goToManageTeachers() {
    this.router.navigate(['/admin/manage-teachers']);
  }

  goToManageAnnouncements() {
    this.router.navigate(['/admin/manage-announcements']);
  }

  goToManageReports() {
    this.router.navigate(['/admin/manage-reports']);
  }

  goTo(page: string) {
    this.router.navigate([`/${page}`]);
  }
  
  async signout() {
    try {
      const auth = getAuth();
      await signOut(auth);
      this.router.navigate(['../login']);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }
}
