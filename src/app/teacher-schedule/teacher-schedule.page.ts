import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonLabel, 
  IonSearchbar, IonIcon, IonButtons, IonBackButton } from '@ionic/angular/standalone';
import { FirebaseService } from '../services/firebase.service';
import { ref, onValue, query, orderByChild } from 'firebase/database';
import { addIcons } from 'ionicons';
import { mailOutline, timeOutline } from 'ionicons/icons';

interface Teacher {
  id?: string;
  name: string;
  subject: string;
  email: string;
  consultationHours: {
    day: string;
    startTime: string;
    endTime: string;
  }[];
}

@Component({
  selector: 'app-teacher-schedule',
  templateUrl: './teacher-schedule.page.html',
  styleUrls: ['./teacher-schedule.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonContent, IonHeader, IonTitle, IonToolbar,
    IonList, IonItem, IonLabel, IonSearchbar, IonIcon, IonButtons, IonBackButton]
})
export class TeacherSchedulePage implements OnInit {
  teachers: Teacher[] = [];
  searchText: string = '';

  constructor(private firebaseService: FirebaseService) {
    addIcons({ mailOutline, timeOutline });
  }

  ngOnInit() {
    this.loadTeachers();
  }

  loadTeachers() {
    const teachersRef = ref(this.firebaseService.database, 'teachers');
    const teachersQuery = query(teachersRef, orderByChild('name'));

    onValue(teachersQuery, (snapshot) => {
      this.teachers = [];
      snapshot.forEach((childSnapshot) => {
        this.teachers.push({
          id: childSnapshot.key,
          ...childSnapshot.val()
        });
      });
    });
  }

  filterTeachers() {
    if (!this.searchText.trim()) {
      return this.teachers;
    }

    const searchLower = this.searchText.toLowerCase();
    return this.teachers.filter(teacher => 
      teacher.name.toLowerCase().includes(searchLower) ||
      teacher.subject.toLowerCase().includes(searchLower) ||
      teacher.email.toLowerCase().includes(searchLower)
    );
  }

  formatTime(time: string): string {
    if (!time) return '';
    
    // Parse the time string (HH:mm)
    const [hours, minutes] = time.split(':').map(Number);
    
    // Convert to 12-hour format
    const period = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12;
    
    // Format with leading zeros for minutes
    const formattedMinutes = minutes.toString().padStart(2, '0');
    
    return `${hours12}:${formattedMinutes} ${period}`;
  }
}
