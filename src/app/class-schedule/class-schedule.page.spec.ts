import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClassSchedulePage } from './class-schedule.page';

describe('ClassSchedulePage', () => {
  let component: ClassSchedulePage;
  let fixture: ComponentFixture<ClassSchedulePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassSchedulePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
