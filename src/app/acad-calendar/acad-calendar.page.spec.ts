import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AcadCalendarPage } from './acad-calendar.page';

describe('AcadCalendarPage', () => {
  let component: AcadCalendarPage;
  let fixture: ComponentFixture<AcadCalendarPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AcadCalendarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
