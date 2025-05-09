import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TeacherSchedulePage } from './teacher-schedule.page';

describe('TeacherSchedulePage', () => {
  let component: TeacherSchedulePage;
  let fixture: ComponentFixture<TeacherSchedulePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TeacherSchedulePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
