import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonButton,
  IonInput, IonModal, IonItem, IonLabel, IonSelect, IonSelectOption } from '@ionic/angular/standalone';
import { ModalController } from '@ionic/angular/standalone';

interface ConsultationHours {
  day: string;
  startTime: string;
  endTime: string;
}

@Component({
  selector: 'app-teacher-modal',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ title }}</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="dismiss()">Cancel</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <form (ngSubmit)="onSubmit()" #form="ngForm">
        <ion-item>
          <ion-input
            label="Name"
            labelPlacement="floating"
            [(ngModel)]="teacher.name"
            name="name"
            required
          ></ion-input>
        </ion-item>
        
        <ion-item>
          <ion-input
            label="Subject"
            labelPlacement="floating"
            [(ngModel)]="teacher.subject"
            name="subject"
            required
          ></ion-input>
        </ion-item>

        <ion-item>
          <ion-input
            label="Email"
            labelPlacement="floating"
            type="email"
            [(ngModel)]="teacher.email"
            name="email"
            required
          ></ion-input>
        </ion-item>

        <ion-item>
          <ion-label>Consultation Hours</ion-label>
        </ion-item>

        <div *ngFor="let hours of teacher.consultationHours; let i = index" class="consultation-hours">
          <ion-item>
            <ion-select
              label="Day"
              labelPlacement="floating"
              [(ngModel)]="hours.day"
              [name]="'day' + i"
              required
            >
              <ion-select-option value="Monday">Monday</ion-select-option>
              <ion-select-option value="Tuesday">Tuesday</ion-select-option>
              <ion-select-option value="Wednesday">Wednesday</ion-select-option>
              <ion-select-option value="Thursday">Thursday</ion-select-option>
              <ion-select-option value="Friday">Friday</ion-select-option>
            </ion-select>
          </ion-item>

          <ion-item>
            <ion-input
              label="Start Time"
              labelPlacement="floating"
              type="time"
              [(ngModel)]="hours.startTime"
              [name]="'startTime' + i"
              required
            ></ion-input>
          </ion-item>

          <ion-item>
            <ion-input
              label="End Time"
              labelPlacement="floating"
              type="time"
              [(ngModel)]="hours.endTime"
              [name]="'endTime' + i"
              required
            ></ion-input>
          </ion-item>

          <ion-button fill="clear" color="danger" (click)="removeConsultationHours(i)">
            Remove
          </ion-button>
        </div>

        <ion-button fill="clear" (click)="addConsultationHours()">
          Add Consultation Hours
        </ion-button>

        <ion-button expand="block" type="submit" [disabled]="!form.form.valid">
          {{ isEdit ? 'Update' : 'Create' }}
        </ion-button>
      </form>
    </ion-content>
  `,
  styles: [`
    .consultation-hours {
      margin: 16px;
      padding: 16px;
      border: 1px solid #ddd;
      border-radius: 8px;
    }
  `],
  standalone: true,
  imports: [CommonModule, FormsModule, IonContent, IonHeader, IonTitle, IonToolbar,
    IonButtons, IonButton, IonInput, IonModal, IonItem, IonLabel, IonSelect, IonSelectOption]
})
export class TeacherModalComponent {
  @Input() title: string = '';
  @Input() isEdit: boolean = false;
  @Input() teacher: any = {
    name: '',
    subject: '',
    email: '',
    consultationHours: []
  };

  constructor(private modalCtrl: ModalController) {}

  dismiss() {
    this.modalCtrl.dismiss();
  }

  onSubmit() {
    this.modalCtrl.dismiss(this.teacher, 'confirm');
  }

  addConsultationHours() {
    this.teacher.consultationHours.push({
      day: '',
      startTime: '',
      endTime: ''
    });
  }

  removeConsultationHours(index: number) {
    this.teacher.consultationHours.splice(index, 1);
  }
} 