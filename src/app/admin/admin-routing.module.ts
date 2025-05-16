import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminPage } from './admin.page';
import { ManageStudentsPage } from './manage-students/manage-students.page';
import { ManageTeachersPage } from './manage-teachers/manage-teachers.page';
import { ManageAnnouncementsPage } from './manage-announcements/manage-announcements.page';
import { ManageReportsPage } from './manage-reports/manage-reports.page';

const routes: Routes = [
  {
    path: '',
    component: AdminPage,
  },
  {
    path: 'manage-students',
    component: ManageStudentsPage,
  },
  {
    path: 'manage-teachers',
    component: ManageTeachersPage,
  },
  {
    path: 'manage-announcements',
    component: ManageAnnouncementsPage,
  },
  {
    path: 'manage-reports',
    component: ManageReportsPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminPageRoutingModule {} 