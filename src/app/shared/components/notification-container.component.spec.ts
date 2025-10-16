import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificationContainerComponent } from './notification-container.component';
import { NotificationService } from '@core/services';
import { signal } from '@angular/core';

describe('NotificationContainerComponent', () => {
  let component: NotificationContainerComponent;
  let fixture: ComponentFixture<NotificationContainerComponent>;

  beforeEach(async () => {
    const notificationServiceSpy = jasmine.createSpyObj('NotificationService', ['remove'], {
      notifications$: signal([]),
    });

    await TestBed.configureTestingModule({
      imports: [NotificationContainerComponent],
      providers: [{ provide: NotificationService, useValue: notificationServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
