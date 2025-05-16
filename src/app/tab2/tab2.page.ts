import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
//import { ActivityService, Activity } from '../services/activity.service';
import { AlertController, IonContent, IonCard, IonCardContent, IonItem, IonInput, IonTextarea, 
  IonDatetime, IonDatetimeButton, IonModal, IonButton, IonList, IonItemSliding, IonItemOptions, 
  IonItemOption, IonIcon, IonBadge, IonCardHeader, IonCardTitle, IonCardSubtitle, IonLabel } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { database } from '../firebase.config';
import { ref, set, onValue, remove, update, query, orderByChild, equalTo } from 'firebase/database';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { trash } from 'ionicons/icons';


interface Activity {
    id: string;
    title: string;
    description: string;
    datetime: string;
    isCompleted: boolean;
    userId: string;
}

@Component({
    selector: 'app-tab2',
    templateUrl: 'tab2.page.html',
    styleUrls: ['tab2.page.scss'],
    standalone: true,
    imports: [CommonModule, FormsModule, IonContent, IonCard, IonCardContent, IonItem, IonInput, IonTextarea, 
      IonDatetime, IonDatetimeButton, IonModal, IonButton, IonList, IonItemSliding, IonItemOptions, 
      IonItemOption, IonIcon, IonBadge, IonCardHeader, IonCardTitle, IonCardSubtitle, IonLabel]
})
export class Tab2Page implements OnInit, OnDestroy {
    activities: Activity[] = [];
    trashIcon = trash;
    newActivity: Activity = {
        id: '',
        title: '',
        description: '',
        datetime: '',
        isCompleted: false,
        userId: ''
    };
    private activitiesRef = ref(database, 'activities');
    private currentUserId: string | null = null;

    constructor(
        //private activityService: ActivityService,
        private alertController: AlertController,
        private cdr: ChangeDetectorRef
    ) {
        console.log('Tab2Page constructor called');
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            console.log('Auth state changed:', user ? 'User logged in' : 'No user');
            if (user) {
                this.currentUserId = user.uid;
                console.log('Current user ID:', this.currentUserId);
                this.loadUserActivities();
            } else {
                this.currentUserId = null;
                this.activities = [];
                console.log('No user, clearing activities');
            }
        })
    }

    ngOnInit() {
        console.log('Tab2Page initialized');
    }

    ngOnDestroy() {
        console.log('Tab2Page destroyed');
    }

    trackByFn(index: number, item: Activity): string {
        return item.id;
    }

    private loadUserActivities() {
        if (!this.currentUserId) {
            console.log('No current user ID, skipping loadUserActivities');
            return;
        }

        console.log('Loading activities for user:', this.currentUserId);
        const userActivitiesQuery = query(
            this.activitiesRef,
            orderByChild('userId'),
            equalTo(this.currentUserId)
        );

        onValue(userActivitiesQuery, (snapshot) => {
            console.log('Activities snapshot received:', snapshot.val());
            const data = snapshot.val();
            if (data) {
                this.activities = Object.values(data);
                console.log('Activities loaded:', this.activities);
                this.cdr.detectChanges(); // Force change detection
            } else {
                this.activities = [];
                console.log('No activities found');
                this.cdr.detectChanges(); // Force change detection
            }
        }, (error) => {
            console.error('Error loading activities:', error);
        });
    }

    addActivity() {
        if (!this.newActivity.title || !this.newActivity.datetime) {
            this.showAlert('Error', 'Please fill in all required fields');
            return;
        }

        if (!this.currentUserId) {
            this.showAlert('Error', 'You must be logged in to add activities');
            return;
        }

        console.log('Adding new activity:', this.newActivity);
        this.newActivity.id = Date.now().toString();
        this.newActivity.userId = this.currentUserId;
        
        // Format datetime to ISO string
        if (typeof this.newActivity.datetime === 'string') {
            this.newActivity.datetime = new Date(this.newActivity.datetime).toISOString();
        }
        
        const activityRef = ref(database, `activities/${this.newActivity.id}`);
        
        set(activityRef, this.newActivity)
            .then(() => {
                console.log('Activity added successfully');
                // Reset form
                this.newActivity = {
                    id: '',
                    title: '',
                    description: '',
                    datetime: '',
                    isCompleted: false,
                    userId: ''
                };
                this.cdr.detectChanges(); // Force change detection
            })
            .catch((error) => {
                console.error('Error adding activity:', error);
                this.showAlert('Error', 'Failed to add activity: ' + error.message);
            });
    }

    deleteActivity(activity: Activity) {
        if (!this.currentUserId || activity.userId !== this.currentUserId) {
            this.showAlert('Error', 'You can only delete your own activities');
            return;
        }

        console.log('Deleting activity:', activity);
        const activityRef = ref(database, `activities/${activity.id}`);
        remove(activityRef)
            .then(() => {
                console.log('Activity deleted successfully');
                this.cdr.detectChanges(); // Force change detection
            })
            .catch((error) => {
                console.error('Error deleting activity:', error);
                this.showAlert('Error', 'Failed to delete activity: ' + error.message);
            });
    }

    toggleComplete(activity: Activity) {
        if (!this.currentUserId || activity.userId !== this.currentUserId) {
            this.showAlert('Error', 'You can only update your own activities');
            return;
        }

        console.log('Toggling activity completion:', activity);
        const activityRef = ref(database, `activities/${activity.id}`);
        update(activityRef, {
            isCompleted: !activity.isCompleted
        }).then(() => {
            console.log('Activity updated successfully');
            this.cdr.detectChanges(); // Force change detection
        }).catch((error) => {
            console.error('Error updating activity:', error);
            this.showAlert('Error', 'Failed to update activity: ' + error.message);
        });
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
