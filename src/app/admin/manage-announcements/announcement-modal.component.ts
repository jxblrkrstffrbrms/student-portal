import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonButton,
  IonInput, IonTextarea, IonModal, IonItem, IonLabel } from '@ionic/angular/standalone';
import { ModalController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-announcement-modal',
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
            label="Title"
            labelPlacement="floating"
            [(ngModel)]="announcement.title"
            name="title"
            required
          ></ion-input>
        </ion-item>
        
        <ion-item>
          <ion-textarea
            label="Content"
            labelPlacement="floating"
            [(ngModel)]="announcement.content"
            name="content"
            required
            rows="6"
          ></ion-textarea>
        </ion-item>

        <ion-button expand="block" type="submit" [disabled]="!form.form.valid">
          {{ isEdit ? 'Update' : 'Create' }}
        </ion-button>
      </form>
    </ion-content>
  `,
  standalone: true,
  imports: [CommonModule, FormsModule, IonContent, IonHeader, IonTitle, IonToolbar,
    IonButtons, IonButton, IonInput, IonTextarea, IonModal, IonItem, IonLabel]
})
export class AnnouncementModalComponent {
  @Input() title: string = '';
  @Input() isEdit: boolean = false;
  @Input() announcement: any = { title: '', content: '' };

  constructor(private modalCtrl: ModalController) {}

  dismiss() {
    this.modalCtrl.dismiss();
  }

  onSubmit() {
    this.modalCtrl.dismiss(this.announcement, 'confirm');
  }
} 