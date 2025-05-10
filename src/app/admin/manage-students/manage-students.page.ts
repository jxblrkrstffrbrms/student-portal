import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardContent, 
    IonCardHeader, IonCardTitle, IonList, IonItem, IonLabel, IonButton, IonIcon,
    IonModal, IonInput, IonFab, IonFabButton, IonTextarea, IonButtons, IonSearchbar, IonSelect, IonSelectOption,
    ModalController, AlertController } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { ref, push, set, remove, onValue, query, orderByChild } from 'firebase/database';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { FirebaseService } from '../../services/firebase.service';
import { addIcons } from 'ionicons';
import { person, eye, create, trash, add } from 'ionicons/icons';

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
  selector: 'app-manage-students',
  templateUrl: './manage-students.page.html',
  styleUrls: ['./manage-students.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardContent, 
    IonCardHeader, IonCardTitle, IonList, IonItem, IonLabel, IonButton, IonIcon, IonModal, IonInput, IonTextarea, 
    IonButtons, IonSearchbar, IonFab, IonFabButton, IonSelect, IonSelectOption]
})
export class ManageStudentsPage implements OnInit {
  students: Student[] = [];
  searchText: string = '';
  sortBy: string = 'lastName';

  constructor(
    private router: Router,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private firebaseService: FirebaseService
  ) {
    addIcons({ person, eye, create, trash, add });
  }

  ngOnInit() {
    this.loadStudents();
  }

  goBack() {
    this.router.navigate(['/admin']);
  }

  async openCreateModal() {
    const alert = await this.alertCtrl.create({
      header: 'Add New Student',
      inputs: [
        {
          name: 'email',
          type: 'email',
          placeholder: 'Email Address'
        },
        {
          name: 'password',
          type: 'password',
          placeholder: 'Password'
        },
        {
          name: 'lastName',
          type: 'text',
          placeholder: 'Last Name'
        },
        {
          name: 'firstName',
          type: 'text',
          placeholder: 'First Name'
        },
        {
          name: 'middleInitial',
          type: 'text',
          placeholder: 'Middle Initial'
        },
        {
          name: 'studentNumber',
          type: 'text',
          placeholder: 'Student Number'
        },
        {
          name: 'gradeSection',
          type: 'text',
          placeholder: 'Grade and Section'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Add',
          handler: (data) => {
            if (this.validateStudentData(data)) {
              this.createStudent(data);
            } else {
              this.showAlert('Error', 'Please fill in all fields');
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async openEditModal(student: Student) {
    const alert = await this.alertCtrl.create({
      header: 'Edit Student',
      inputs: [
        {
          name: 'email',
          type: 'email',
          value: student.email,
          placeholder: 'Email Address'
        },
        {
          name: 'lastName',
          type: 'text',
          value: student.lastName,
          placeholder: 'Last Name'
        },
        {
          name: 'firstName',
          type: 'text',
          value: student.firstName,
          placeholder: 'First Name'
        },
        {
          name: 'middleInitial',
          type: 'text',
          value: student.middleInitial,
          placeholder: 'Middle Initial'
        },
        {
          name: 'studentNumber',
          type: 'text',
          value: student.studentNumber,
          placeholder: 'Student Number'
        },
        {
          name: 'gradeSection',
          type: 'text',
          value: student.gradeSection,
          placeholder: 'Grade and Section'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Save',
          handler: (data) => {
            if (this.validateStudentData(data)) {
              this.updateStudent({ ...data, id: student.id });
            } else {
              this.showAlert('Error', 'Please fill in all fields');
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async openViewModal(student: Student) {
    const alert = await this.alertCtrl.create({
      header: 'Student Details',
      message: `Email: ${student.email}\nName: ${student.lastName}, ${student.firstName}${student.middleInitial ? ' ' + student.middleInitial : ''}\nStudent Number: ${student.studentNumber}\nGrade & Section: ${student.gradeSection}`,
      buttons: ['Close']
    });

    await alert.present();
  }

  async confirmDelete(student: Student) {
    const alert = await this.alertCtrl.create({
      header: 'Confirm Delete',
      message: 'Are you sure you want to delete this student?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            this.deleteStudent(student);
          }
        }
      ]
    });

    await alert.present();
  }

  private validateStudentData(data: any): boolean {
    return data.email && data.lastName && data.firstName && 
           data.studentNumber && data.gradeSection;
  }

  private async createStudent(data: any) {
    try {
      // Create authentication user
      const userCredential = await createUserWithEmailAndPassword(
        this.firebaseService.auth,
        data.email,
        data.password
      );

      // Create student record in database
      const studentsRef = ref(this.firebaseService.database, 'students');
      const newStudent = {
        email: data.email,
        lastName: data.lastName,
        firstName: data.firstName,
        middleInitial: data.middleInitial,
        studentNumber: data.studentNumber,
        gradeSection: data.gradeSection
      };

      await push(studentsRef, newStudent);
      this.showAlert('Success', 'Student added successfully');
    } catch (error: any) {
      console.error('Error creating student:', error);
      let errorMessage = 'Failed to add student';
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Email address is already in use';
      }
      
      this.showAlert('Error', errorMessage);
    }
  }

  private async updateStudent(data: any) {
    try {
      const studentRef = ref(this.firebaseService.database, `students/${data.id}`);
      const updatedStudent = {
        email: data.email,
        lastName: data.lastName,
        firstName: data.firstName,
        middleInitial: data.middleInitial,
        studentNumber: data.studentNumber,
        gradeSection: data.gradeSection
      };

      await set(studentRef, updatedStudent);
      this.showAlert('Success', 'Student updated successfully');
    } catch (error) {
      console.error('Error updating student:', error);
      this.showAlert('Error', 'Failed to update student');
    }
  }

  private async deleteStudent(student: Student) {
    if (!student.id) return;

    try {
      const studentRef = ref(this.firebaseService.database, `students/${student.id}`);
      await remove(studentRef);
      this.showAlert('Success', 'Student deleted successfully');
    } catch (error) {
      console.error('Error deleting student:', error);
      this.showAlert('Error', 'Failed to delete student');
    }
  }

  private async showAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  loadStudents() {
    const studentsRef = ref(this.firebaseService.database, 'students');
    const studentsQuery = query(studentsRef, orderByChild(this.sortBy));

    onValue(studentsQuery, (snapshot) => {
      this.students = [];
      snapshot.forEach((childSnapshot) => {
        this.students.push({
          id: childSnapshot.key,
          ...childSnapshot.val()
        });
      });
    });
  }

  filterStudents() {
    if (!this.searchText.trim()) {
      return this.students;
    }

    const searchLower = this.searchText.toLowerCase();
    return this.students.filter(student => 
      student.lastName.toLowerCase().includes(searchLower) ||
      student.firstName.toLowerCase().includes(searchLower) ||
      student.studentNumber.toLowerCase().includes(searchLower) ||
      student.email.toLowerCase().includes(searchLower)
    );
  }
} 