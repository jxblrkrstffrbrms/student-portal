import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonCard, IonCardContent, IonItem, IonInput, IonSelect, 
  IonSelectOption, IonButton, IonList, IonItemSliding, IonItemOptions, 
  IonItemOption, IonIcon, IonLabel, IonCardHeader, IonCardTitle } from '@ionic/angular/standalone';
import { FirebaseService } from '../services/firebase.service';
import { ref, push, remove, onValue, query, orderByChild, equalTo } from 'firebase/database';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

interface Subject {
    id?: string;
    name: string;
    grade: string;
    units: number;
    userId: string;
}

@Component({
    selector: 'app-tab3',
    templateUrl: 'tab3.page.html',
    styleUrls: ['tab3.page.scss'],
    standalone: true,
    imports: [CommonModule, FormsModule, IonContent, IonCard, IonCardContent, 
      IonItem, IonInput, IonSelect, IonSelectOption, IonButton, IonList, 
      IonItemSliding, IonItemOptions, IonItemOption, IonIcon, IonLabel, 
      IonCardHeader, IonCardTitle]
})
export class Tab3Page implements OnInit, OnDestroy {
    newSubject: Subject = {
        name: '',
        grade: '',
        units: 0,
        userId: ''
    };

    subjects: Subject[] = [];
    private currentUserId: string | null = null;
    private authUnsubscribe: any;

    constructor(private firebaseService: FirebaseService) {}

    ngOnInit() {
        this.authUnsubscribe = onAuthStateChanged(this.firebaseService.auth, (user) => {
            if (user) {
                this.currentUserId = user.uid;
                this.loadSubjects();
            } else {
                this.currentUserId = null;
                this.subjects = [];
            }
        });
    }

    ngOnDestroy() {
        if (this.authUnsubscribe) {
            this.authUnsubscribe();
        }
    }

    get totalUnits(): number {
        return this.subjects.reduce((sum, subject) => sum + subject.units, 0);
    }

    get totalGradePoints(): number {
        return this.subjects.reduce((sum, subject) => 
            sum + (parseFloat(subject.grade) * subject.units), 0);
    }

    get gwa(): string {
        if (this.totalUnits === 0) return '0.00';
        return (this.totalGradePoints / this.totalUnits).toFixed(2);
    }

    loadSubjects() {
        if (!this.currentUserId) return;

        const subjectsRef = ref(this.firebaseService.database, 'subjects');
        const subjectsQuery = query(subjectsRef, orderByChild('userId'), equalTo(this.currentUserId));

        onValue(subjectsQuery, (snapshot) => {
            this.subjects = [];
            snapshot.forEach((childSnapshot) => {
                this.subjects.push({
                    id: childSnapshot.key,
                    ...childSnapshot.val()
                });
            });
        });
    }

    addSubject() {
        if (!this.newSubject.name || !this.newSubject.grade || !this.newSubject.units || !this.currentUserId) {
            return;
        }

        const subjectsRef = ref(this.firebaseService.database, 'subjects');
        const newSubject = {
            ...this.newSubject,
            userId: this.currentUserId
        };

        push(subjectsRef, newSubject)
            .then(() => {
                this.newSubject = {
                    name: '',
                    grade: '',
                    units: 0,
                    userId: ''
                };
            })
            .catch((error) => {
                console.error('Error adding subject:', error);
            });
    }

    deleteSubject(subject: Subject) {
        if (!subject.id) return;

        const subjectRef = ref(this.firebaseService.database, `subjects/${subject.id}`);
        remove(subjectRef)
            .catch((error) => {
                console.error('Error deleting subject:', error);
            });
    }
}
