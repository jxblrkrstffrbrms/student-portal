import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardContent, 
    IonCardHeader, IonCardTitle, IonList, IonItem, IonLabel, IonButton, IonIcon,
    IonModal, IonInput, IonFab, IonFabButton, IonTextarea, IonButtons, IonSearchbar, IonSelect, IonSelectOption,
    ModalController, AlertController } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { ref, push, set, remove, onValue, query, orderByChild } from 'firebase/database';
import { AnnouncementModalComponent } from './announcement-modal.component';
import { FirebaseService } from '../../services/firebase.service';
import { addIcons } from 'ionicons';
import { megaphone, eye, create, trash } from 'ionicons/icons';

interface Announcement {
  id?: string;
  title: string;
  content: string;
  date: string;
}

@Component({
  selector: 'app-manage-announcements',
  templateUrl: './manage-announcements.page.html',
  styleUrls: ['./manage-announcements.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardContent, 
    IonCardHeader, IonCardTitle, IonList, IonItem, IonLabel, IonButton, IonIcon, IonModal, IonInput, IonTextarea, 
    IonButtons, IonSearchbar, IonFab, IonFabButton, IonSelect, IonSelectOption, AnnouncementModalComponent]
})
export class ManageAnnouncementsPage implements OnInit {
  announcements: Announcement[] = [];
  selectedAnnouncement: Announcement | null = null;
  searchText: string = '';
  sortBy: string = 'date';

  constructor(
    private router: Router,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private firebaseService: FirebaseService
    ) {addIcons({ megaphone, eye, create, trash });}

  ngOnInit() {
    this.loadAnnouncements();
  }

  goBack() {
    this.router.navigate(['/admin']);
  }

  async openCreateModal() {
    const modal = await this.modalCtrl.create({
      component: AnnouncementModalComponent,
      componentProps: {
        title: 'Create New Announcement',
        isEdit: false
      }
    });

    await modal.present();

    const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm') {
      this.createAnnouncement(data);
    }
  }

  async openEditModal(announcement: Announcement) {
    const modal = await this.modalCtrl.create({
      component: AnnouncementModalComponent,
      componentProps: {
        title: 'Edit Announcement',
        announcement: announcement,
        isEdit: true
      }
    });

    await modal.present();

    const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm') {
      this.updateAnnouncement(data);
    }
  }

  async openViewModal(announcement: Announcement) {
    const modal = await this.modalCtrl.create({
      component: AnnouncementModalComponent,
      componentProps: {
        title: 'View Announcement',
        announcement: announcement,
        isView: true
      }
    });

    await modal.present();
  }

  async confirmDelete(announcement: Announcement) {
    const alert = await this.alertCtrl.create({
      header: 'Confirm Delete',
      message: 'Are you sure you want to delete this announcement?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            this.deleteAnnouncement(announcement);
          }
        }
      ]
    });

    await alert.present();
  }

  private createAnnouncement(data: any) {
    const announcementsRef = ref(this.firebaseService.database, 'announcements');
    const newAnnouncement = {
      title: data.title,
      content: data.content,
      date: new Date().toISOString()
    };

    push(announcementsRef, newAnnouncement)
      .then(() => {
        this.showAlert('Success', 'Announcement created successfully');
      })
      .catch((error) => {
        this.showAlert('Error', 'Failed to create announcement');
        console.error('Error creating announcement:', error);
      });
  }

  private updateAnnouncement(data: any) {
    const announcementRef = ref(this.firebaseService.database, `announcements/${data.id}`);
    const updatedAnnouncement = {
      title: data.title,
      content: data.content,
      date: new Date().toISOString()
    };

    set(announcementRef, updatedAnnouncement)
      .then(() => {
        this.showAlert('Success', 'Announcement updated successfully');
      })
      .catch((error) => {
        this.showAlert('Error', 'Failed to update announcement');
        console.error('Error updating announcement:', error);
      });
  }

  private deleteAnnouncement(announcement: Announcement) {
    if (!announcement.id) return;

    const announcementRef = ref(this.firebaseService.database, `announcements/${announcement.id}`);

    remove(announcementRef)
      .then(() => {
        this.showAlert('Success', 'Announcement deleted successfully');
      })
      .catch((error) => {
        this.showAlert('Error', 'Failed to delete announcement');
        console.error('Error deleting announcement:', error);
      });
  }

  private async showAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  loadAnnouncements() {
    const announcementsRef = ref(this.firebaseService.database, 'announcements');
    const announcementsQuery = query(announcementsRef, orderByChild(this.sortBy));

    onValue(announcementsQuery, (snapshot) => {
      this.announcements = [];
      snapshot.forEach((childSnapshot) => {
        this.announcements.push({
          id: childSnapshot.key,
          ...childSnapshot.val()
        });
      });
    });
  }

  filterAnnouncements() {
    return this.announcements.filter(announcement => 
      announcement.title.toLowerCase().includes(this.searchText.toLowerCase()) ||
      announcement.content.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }
} 