import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonCard, IonCardContent, IonItem, IonInput, IonSelect, 
  IonSelectOption, IonButton, IonList, IonItemSliding, IonItemOptions, 
  IonItemOption, IonIcon, IonLabel, IonCardHeader, IonCardTitle } from '@ionic/angular/standalone';

interface Subject {
    name: string;
    grade: string;
    units: number;
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
export class Tab3Page {
    newSubject: Subject = {
        name: '',
        grade: '',
        units: 0
    };

    subjects: Subject[] = [];

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

    addSubject() {
        if (!this.newSubject.name || !this.newSubject.grade || !this.newSubject.units) {
            return;
        }

        this.subjects.push({...this.newSubject});
        this.newSubject = {
            name: '',
            grade: '',
            units: 0
        };
    }

    deleteSubject(subject: Subject) {
        const index = this.subjects.indexOf(subject);
        if (index > -1) {
            this.subjects.splice(index, 1);
        }
    }
}
