import { Component, OnInit, OnDestroy, ChangeDetectorRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { globeOutline, logoFacebook, helpCircleOutline, peopleOutline, calendarOutline, listOutline, 
  shieldCheckmarkOutline, trophyOutline, trash, add, notificationsOutline, megaphoneOutline, 
  bulbOutline, eyeOutline, starOutline, sparklesOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { IonHeader, IonToolbar, IonDatetime, IonDatetimeButton, IonTitle, IonContent, IonFab, 
  IonFabButton, IonFabList, IonIcon, IonGrid, IonCol, IonRow, IonCard, IonCardHeader, IonItemOptions, IonItemOption,
  IonCardTitle, IonCardContent, IonList, IonItem, IonLabel, IonItemSliding, IonCheckbox } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { database } from '../firebase.config';
import { ref, onValue, remove, update, query, orderByChild, equalTo } from 'firebase/database';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

interface Activity {
    id: string;
    title: string;
    description: string;
    datetime: string;
    isCompleted: boolean;
    userId: string;
}

interface Announcement {
    title: string;
    date: string;
    description: string;
}

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonHeader, IonToolbar, IonDatetime, IonDatetimeButton, IonTitle, IonContent, IonFab, IonFabButton, 
    IonFabList, IonIcon, ExploreContainerComponent, IonGrid, IonCol, IonRow, IonItemOptions, IonItemOption,
    IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonList, IonItem, IonLabel, IonItemSliding, IonCheckbox],
})
export class Tab1Page implements OnInit, OnDestroy {
  isScrolled = false;
  cardsVisible = false;
  activities: Activity[] = [];
  private activitiesRef = ref(database, 'activities');
  private currentUserId: string | null = null;

  constructor(private cdr: ChangeDetectorRef) {
    addIcons({helpCircleOutline, logoFacebook, globeOutline, calendarOutline, listOutline, shieldCheckmarkOutline, 
      trophyOutline, peopleOutline, trash, add, notificationsOutline, megaphoneOutline, bulbOutline, 
      eyeOutline, starOutline, sparklesOutline});

    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.currentUserId = user.uid;
        this.loadUserActivities();
      } else {
        this.currentUserId = null;
        this.activities = [];
      }
    });
  }

  ngOnInit() {}

  ngOnDestroy() {}

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

  announcements: Announcement[] = [
    {
      title: 'Registration for New School Year',
      date: 'Deadline: June 15, 2024',
      description: 'All students are required to complete their registration for the upcoming school year.'
    },
    {
      title: 'Science Fair 2024',
      date: 'Date: July 20-22, 2024',
      description: 'Join us for the annual Science Fair showcasing innovative projects from our students.'
    },
    {
      title: 'Final Examination Schedule',
      date: 'March 15-20, 2024',
      description: 'Please check the examination schedule and prepare accordingly.'
    }
  ];
}
