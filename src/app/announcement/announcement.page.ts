import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, 
  IonSearchbar, IonList, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, 
  IonCardContent, IonIcon, IonButton, AlertController } from '@ionic/angular/standalone';
import { FirebaseService } from '../services/firebase.service';
import { ref, onValue, query, orderByChild } from 'firebase/database';
import { megaphoneOutline, eyeOutline, createOutline, trashOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';

interface Announcement {
  id?: string;
  title: string;
  content: string;
  date: string;
}

@Component({
  selector: 'app-announcement',
  templateUrl: './announcement.page.html',
  styleUrls: ['./announcement.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, 
    IonSearchbar, IonList, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, 
    IonCardContent, IonIcon, IonButton, CommonModule, FormsModule]
})
export class AnnouncementPage implements OnInit {
  announcements: Announcement[] = [];
  filteredAnnouncements: Announcement[] = [];
  searchText: string = '';

  constructor(
    private firebaseService: FirebaseService,
    private alertController: AlertController
  ) {
    addIcons({ megaphoneOutline, eyeOutline, createOutline, trashOutline });
  }

  ngOnInit() {
    this.loadAnnouncements();
  }

  async viewAnnouncement(announcement: Announcement) {
    const alert = await this.alertController.create({
      header: announcement.title,
      subHeader: new Date(announcement.date).toLocaleString(),
      message: announcement.content,
      buttons: ['Close']
    });

    await alert.present();
  }

  loadAnnouncements() {
    const announcementsRef = ref(this.firebaseService.database, 'announcements');
    const announcementsQuery = query(announcementsRef, orderByChild('date'));

    onValue(announcementsQuery, (snapshot) => {
      this.announcements = [];
      snapshot.forEach((childSnapshot) => {
        this.announcements.push({
          id: childSnapshot.key,
          ...childSnapshot.val()
        });
      });
      // Sort announcements by date in descending order (newest first)
      this.announcements.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      this.filterAnnouncements();
    });
  }

  filterAnnouncements() {
    if (!this.searchText.trim()) {
      this.filteredAnnouncements = this.announcements;
      return;
    }

    const searchLower = this.searchText.toLowerCase();
    this.filteredAnnouncements = this.announcements.filter(announcement => 
      announcement.title.toLowerCase().includes(searchLower) ||
      announcement.content.toLowerCase().includes(searchLower)
    );
  }
}
