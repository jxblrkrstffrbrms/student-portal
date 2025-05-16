import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AdminPageRoutingModule } from './admin-routing.module';
import { AdminPage } from './admin.page';
import { ManageStudentsPage } from './manage-students/manage-students.page';
import { ManageTeachersPage } from './manage-teachers/manage-teachers.page';
import { ManageAnnouncementsPage } from './manage-announcements/manage-announcements.page';
import { ManageReportsPage } from './manage-reports/manage-reports.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminPageRoutingModule
  ],
  declarations: [
    AdminPage,
    ManageStudentsPage,
    ManageTeachersPage,
    ManageAnnouncementsPage,
    ManageReportsPage
  ]
})
export class AdminPageModule {} 