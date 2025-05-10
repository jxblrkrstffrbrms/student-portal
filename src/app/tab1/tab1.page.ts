import { Component, OnInit, OnDestroy, ChangeDetectorRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { globeOutline, logoFacebook, helpCircleOutline, peopleOutline, calendarOutline, listOutline, 
  shieldCheckmarkOutline, trophyOutline, trash, add, notificationsOutline, megaphoneOutline, 
  bulbOutline, eyeOutline, starOutline, sparklesOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { IonHeader, IonToolbar, IonDatetime, IonDatetimeButton, IonTitle, IonContent, IonFab, 
  IonFabButton, IonFabList, IonIcon, IonGrid, IonCol, IonRow, IonCard, IonCardHeader, IonItemOptions, IonItemOption,
  IonCardTitle, IonCardSubtitle, IonCardContent, IonList, IonItem, IonLabel, IonItemSliding, IonCheckbox } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { database } from '../firebase.config';
import { ref, onValue, remove, update, query, orderByChild, equalTo } from 'firebase/database';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { FirebaseService } from '../services/firebase.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

interface Activity {
    id: string;
    title: string;
    description: string;
    datetime: string;
    isCompleted: boolean;
    userId: string;
}

interface Announcement {
    id?: string;
    title: string;
    content: string;
    date: string;
}

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [CommonModule, FormsModule, IonHeader, IonToolbar, IonDatetime, IonDatetimeButton, IonTitle, IonContent, IonFab, IonFabButton, 
    IonFabList, IonIcon, ExploreContainerComponent, IonGrid, IonCol, IonRow, IonItemOptions, IonItemOption,
    IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent, IonList, IonItem, IonLabel, IonItemSliding, IonCheckbox],
})
export class Tab1Page implements OnInit, OnDestroy {
  isScrolled = false;
  cardsVisible = false;
  activities: Activity[] = [];
  announcements: Announcement[] = [];
  private activitiesRef = ref(database, 'activities');
  private currentUserId: string | null = null;
  private authUnsubscribe: any;

  constructor(
    private cdr: ChangeDetectorRef,
    private firebaseService: FirebaseService
  ) {
    addIcons({helpCircleOutline, logoFacebook, globeOutline, calendarOutline, listOutline, shieldCheckmarkOutline, 
      trophyOutline, peopleOutline, trash, add, notificationsOutline, megaphoneOutline, bulbOutline, 
      eyeOutline, starOutline, sparklesOutline});
  }

  ngOnInit() {
    this.authUnsubscribe = onAuthStateChanged(this.firebaseService.auth, (user) => {
      if (user) {
        this.currentUserId = user.uid;
        this.loadUserActivities();
        this.loadAnnouncements();
      } else {
        this.currentUserId = null;
        this.activities = [];
      }
    });
  }

  ngOnDestroy() {
    if (this.authUnsubscribe) {
      this.authUnsubscribe();
    }
  }

  trackByFn(index: number, item: Activity): string {
    return item.id;
  }

  private loadUserActivities() {
    if (!this.currentUserId) return;

    const userActivitiesQuery = query(
      this.activitiesRef,
      orderByChild('userId'),
      equalTo(this.currentUserId)
    );

    onValue(userActivitiesQuery, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        this.activities = Object.values(data);
      } else {
        this.activities = [];
      }
      this.cdr.detectChanges();
    });
  }

  deleteActivity(activity: Activity) {
    if (!this.currentUserId || activity.userId !== this.currentUserId) {
      return;
    }

    const activityRef = ref(database, `activities/${activity.id}`);
    remove(activityRef)
      .then(() => {
        this.cdr.detectChanges();
      })
      .catch((error) => {
        console.error('Error deleting activity:', error);
      });
  }

  toggleComplete(activity: Activity) {
    if (!this.currentUserId || activity.userId !== this.currentUserId) {
      return;
    }

    const activityRef = ref(database, `activities/${activity.id}`);
    update(activityRef, {
      isCompleted: !activity.isCompleted
    }).then(() => {
      this.cdr.detectChanges();
    }).catch((error) => {
      console.error('Error updating activity:', error);
    });
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event: any) {
    const scrollPosition = window.pageYOffset;
    this.isScrolled = scrollPosition > 50;
    
    if (scrollPosition > 100) {
      this.cardsVisible = true;
    }
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
      this.cdr.detectChanges();
    });
  }
}
