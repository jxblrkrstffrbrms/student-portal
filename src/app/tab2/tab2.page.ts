import { Component, OnInit } from '@angular/core';
//import { ActivityService, Activity } from '../services/activity.service';
import { AlertController, IonContent, IonCard, IonCardContent, IonItem, IonInput, IonTextarea, 
  IonDatetime, IonDatetimeButton, IonModal, IonButton, IonList, IonItemSliding, IonItemOptions, 
  IonItemOption, IonIcon, IonBadge, IonCardHeader, IonCardTitle, IonCardSubtitle, IonLabel } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Activity {
    id: string;
    title: string;
    description: string;
    datetime: string;
    isCompleted: boolean;
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
export class Tab2Page implements OnInit {
    activities: Activity[] = [];
    newActivity: Activity = {
        id: '',
        title: '',
        description: '',
        datetime: '',
        isCompleted: false
    };

    constructor(
        //private activityService: ActivityService,
        private alertController: AlertController
    ) {}

    ngOnInit() {
        // Load activities from localStorage if any
        const savedActivities = localStorage.getItem('activities');
        if (savedActivities) {
            this.activities = JSON.parse(savedActivities);
        }
    }

    addActivity() {
        if (!this.newActivity.title || !this.newActivity.datetime) {
            this.showAlert('Error', 'Please fill in all required fields');
            return;
        }

        this.newActivity.id = Date.now().toString();
        this.activities.push({...this.newActivity});
        
        // Save to localStorage
        localStorage.setItem('activities', JSON.stringify(this.activities));

        // Reset form
        this.newActivity = {
            id: '',
            title: '',
            description: '',
            datetime: '',
            isCompleted: false
        };
    }

    deleteActivity(activity: Activity) {
        const index = this.activities.indexOf(activity);
        if (index > -1) {
            this.activities.splice(index, 1);
            localStorage.setItem('activities', JSON.stringify(this.activities));
        }
    }

    toggleComplete(activity: Activity) {
        activity.isCompleted = !activity.isCompleted;
        localStorage.setItem('activities', JSON.stringify(this.activities));
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
