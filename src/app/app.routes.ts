import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./login/login.page').then( m => m.LoginPage)
  },
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },  {
    path: 'class-schedule',
    loadComponent: () => import('./class-schedule/class-schedule.page').then( m => m.ClassSchedulePage)
  },
  {
    path: 'acad-calendar',
    loadComponent: () => import('./acad-calendar/acad-calendar.page').then( m => m.AcadCalendarPage)
  },
  {
    path: 'teacher-schedule',
    loadComponent: () => import('./teacher-schedule/teacher-schedule.page').then( m => m.TeacherSchedulePage)
  },
  {
    path: 'announcement',
    loadComponent: () => import('./announcement/announcement.page').then( m => m.AnnouncementPage)
  },
  {
    path: 'contacts',
    loadComponent: () => import('./contacts/contacts.page').then( m => m.ContactsPage)
  },
  {
    path: 'report',
    loadComponent: () => import('./report/report.page').then( m => m.ReportPage)
  },

  
];
