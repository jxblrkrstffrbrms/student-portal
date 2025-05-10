import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonItem, IonList, IonLabel, IonAvatar, IonCard } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { ref, onValue, query, orderByChild, equalTo } from 'firebase/database';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { FirebaseService } from '../services/firebase.service';

interface Student {
  id?: string;
  email: string;
  lastName: string;
  firstName: string;
  middleInitial: string;
  studentNumber: string;
  gradeSection: string;
}

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonItem, IonList, IonLabel, IonAvatar, IonCard, CommonModule, FormsModule]
})
export class Tab4Page implements OnInit {
  student: Student | null = null;
  private authUnsubscribe: any;

  constructor(
    private router: Router,
    private firebaseService: FirebaseService
  ) {}

  ngOnInit() {
    this.authUnsubscribe = onAuthStateChanged(this.firebaseService.auth, (user) => {
      if (user) {
        this.loadStudentData(user.email);
      } else {
        this.router.navigate(['/login']);
      }
    });
  }

  ngOnDestroy() {
    if (this.authUnsubscribe) {
      this.authUnsubscribe();
    }
  }

  goTo(page: string) {
    this.router.navigate([`/${page}`]);
  }

  private loadStudentData(email: string | null) {
    if (!email) return;

    const studentsRef = ref(this.firebaseService.database, 'students');
    const studentsQuery = query(studentsRef, orderByChild('email'), equalTo(email));

    onValue(studentsQuery, (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        this.student = {
          id: childSnapshot.key,
          ...childSnapshot.val()
        };
      });
    });
  }

  logout() {
    this.router.navigate(['./login']);
  }
}


