import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardContent, 
    IonCardHeader, IonCardTitle, IonList, IonItem, IonLabel, IonButton, IonIcon,
    IonModal, IonInput, IonFab, IonFabButton, IonTextarea, IonButtons, IonSearchbar, IonSelect, IonSelectOption,
    ModalController, AlertController } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { ref, push, set, remove, onValue, query, orderByChild } from 'firebase/database';
import { TeacherModalComponent } from './teacher-modal.component';
import { FirebaseService } from '../../services/firebase.service';
import { addIcons } from 'ionicons';
import { add, eyeOutline, createOutline, trashOutline } from 'ionicons/icons';

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
  selector: 'app-manage-teachers',
  templateUrl: './manage-teachers.page.html',
  styleUrls: ['./manage-teachers.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardContent, 
    IonCardHeader, IonCardTitle, IonList, IonItem, IonLabel, IonButton, IonIcon, IonModal, IonInput, IonTextarea, 
    IonButtons, IonSearchbar, IonFab, IonFabButton, IonSelect, IonSelectOption, TeacherModalComponent]
})
export class ManageTeachersPage implements OnInit {
  teachers: Teacher[] = [];
  searchText: string = '';
  sortBy: string = 'name';

  constructor(
    private router: Router,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private firebaseService: FirebaseService
  ) {
    addIcons({ add, eyeOutline, createOutline, trashOutline });
  }

  ngOnInit() {
    this.loadTeachers();
  }

  goBack() {
    this.router.navigate(['/admin']);
  }

  async openCreateModal() {
    const modal = await this.modalCtrl.create({
      component: TeacherModalComponent,
      componentProps: {
        title: 'Add New Teacher',
        isEdit: false
      }
    });

    await modal.present();

    const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm') {
      this.createTeacher(data);
    }
  }

  async openEditModal(teacher: Teacher) {
    const modal = await this.modalCtrl.create({
      component: TeacherModalComponent,
      componentProps: {
        title: 'Edit Teacher',
        teacher: { ...teacher },
        isEdit: true
      }
    });

    await modal.present();

    const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm') {
      this.updateTeacher(data);
    }
  }

  async openViewModal(teacher: Teacher) {
    const modal = await this.modalCtrl.create({
      component: TeacherModalComponent,
      componentProps: {
        title: 'View Teacher',
        teacher: { ...teacher },
        isView: true
      }
    });

    await modal.present();
  }

  async confirmDelete(teacher: Teacher) {
    const alert = await this.alertCtrl.create({
      header: 'Confirm Delete',
      message: 'Are you sure you want to delete this teacher?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            this.deleteTeacher(teacher);
          }
        }
      ]
    });

    await alert.present();
  }

  private createTeacher(data: any) {
    const teachersRef = ref(this.firebaseService.database, 'teachers');
    const newTeacher = {
      name: data.name,
      subject: data.subject,
      email: data.email,
      consultationHours: data.consultationHours
    };

    push(teachersRef, newTeacher)
      .then(() => {
        this.showAlert('Success', 'Teacher added successfully');
      })
      .catch((error) => {
        this.showAlert('Error', 'Failed to add teacher');
        console.error('Error adding teacher:', error);
      });
  }

  private updateTeacher(data: any) {
    const teacherRef = ref(this.firebaseService.database, `teachers/${data.id}`);
    const updatedTeacher = {
      name: data.name,
      subject: data.subject,
      email: data.email,
      consultationHours: data.consultationHours
    };

    set(teacherRef, updatedTeacher)
      .then(() => {
        this.showAlert('Success', 'Teacher updated successfully');
      })
      .catch((error) => {
        this.showAlert('Error', 'Failed to update teacher');
        console.error('Error updating teacher:', error);
      });
  }

  private deleteTeacher(teacher: Teacher) {
    if (!teacher.id) return;

    const teacherRef = ref(this.firebaseService.database, `teachers/${teacher.id}`);

    remove(teacherRef)
      .then(() => {
        this.showAlert('Success', 'Teacher deleted successfully');
      })
      .catch((error) => {
        this.showAlert('Error', 'Failed to delete teacher');
        console.error('Error deleting teacher:', error);
      });
  }

  private async showAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  loadTeachers() {
    const teachersRef = ref(this.firebaseService.database, 'teachers');
    const teachersQuery = query(teachersRef, orderByChild(this.sortBy));

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
    return this.teachers.filter(teacher => 
      teacher.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
      teacher.subject.toLowerCase().includes(this.searchText.toLowerCase()) ||
      teacher.email.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }
} 