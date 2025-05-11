import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { downloadOutline } from 'ionicons/icons';

@Component({
  selector: 'app-class-schedule',
  templateUrl: './class-schedule.page.html',
  styleUrls: ['./class-schedule.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    IonContent, 
    IonHeader, 
    IonTitle, 
    IonToolbar, 
    IonButtons, 
    IonBackButton, 
    IonCard, 
    IonCardHeader, 
    IonCardTitle, 
    IonCardContent, 
    IonIcon
  ]
})
export class ClassSchedulePage implements OnInit {
  constructor() {
    addIcons({ downloadOutline });
  }

  ngOnInit() {
  }
}
