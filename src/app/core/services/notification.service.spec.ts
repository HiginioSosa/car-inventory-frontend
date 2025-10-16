import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NotificationService, Notification } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NotificationService],
    });
    service = TestBed.inject(NotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have empty notifications initially', () => {
    expect(service.notifications$().length).toBe(0);
  });

  describe('success', () => {
    it('should add success notification', () => {
      service.success('Operation successful');

      const notifications = service.notifications$();
      expect(notifications.length).toBe(1);
      expect(notifications[0].type).toBe('success');
      expect(notifications[0].message).toBe('Operation successful');
      expect(notifications[0].duration).toBe(5000);
    });

    it('should use custom duration for success', () => {
      service.success('Success with custom duration', 3000);

      const notifications = service.notifications$();
      expect(notifications[0].duration).toBe(3000);
    });

    it('should auto-remove success notification after duration', fakeAsync(() => {
      service.success('Auto-remove test', 1000);

      expect(service.notifications$().length).toBe(1);

      tick(1000);

      expect(service.notifications$().length).toBe(0);
    }));
  });

  describe('error', () => {
    it('should add error notification', () => {
      service.error('An error occurred');

      const notifications = service.notifications$();
      expect(notifications.length).toBe(1);
      expect(notifications[0].type).toBe('error');
      expect(notifications[0].message).toBe('An error occurred');
      expect(notifications[0].duration).toBe(7000);
    });

    it('should use custom duration for error', () => {
      service.error('Error with custom duration', 10000);

      const notifications = service.notifications$();
      expect(notifications[0].duration).toBe(10000);
    });

    it('should auto-remove error notification after duration', fakeAsync(() => {
      service.error('Auto-remove error', 500);

      expect(service.notifications$().length).toBe(1);

      tick(500);

      expect(service.notifications$().length).toBe(0);
    }));
  });

  describe('warning', () => {
    it('should add warning notification', () => {
      service.warning('Warning message');

      const notifications = service.notifications$();
      expect(notifications.length).toBe(1);
      expect(notifications[0].type).toBe('warning');
      expect(notifications[0].message).toBe('Warning message');
      expect(notifications[0].duration).toBe(6000);
    });

    it('should use custom duration for warning', () => {
      service.warning('Warning with custom duration', 4000);

      const notifications = service.notifications$();
      expect(notifications[0].duration).toBe(4000);
    });
  });

  describe('info', () => {
    it('should add info notification', () => {
      service.info('Information message');

      const notifications = service.notifications$();
      expect(notifications.length).toBe(1);
      expect(notifications[0].type).toBe('info');
      expect(notifications[0].message).toBe('Information message');
      expect(notifications[0].duration).toBe(5000);
    });

    it('should use custom duration for info', () => {
      service.info('Info with custom duration', 2000);

      const notifications = service.notifications$();
      expect(notifications[0].duration).toBe(2000);
    });
  });

  describe('multiple notifications', () => {
    it('should handle multiple notifications', () => {
      service.success('Success 1');
      service.error('Error 1');
      service.warning('Warning 1');
      service.info('Info 1');

      const notifications = service.notifications$();
      expect(notifications.length).toBe(4);
      expect(notifications[0].type).toBe('success');
      expect(notifications[1].type).toBe('error');
      expect(notifications[2].type).toBe('warning');
      expect(notifications[3].type).toBe('info');
    });

    it('should maintain order of notifications', () => {
      service.success('First');
      service.error('Second');
      service.info('Third');

      const notifications = service.notifications$();
      expect(notifications[0].message).toBe('First');
      expect(notifications[1].message).toBe('Second');
      expect(notifications[2].message).toBe('Third');
    });

    it('should handle concurrent auto-removals', fakeAsync(() => {
      service.success('Quick', 500);
      service.error('Medium', 1000);
      service.warning('Slow', 1500);

      expect(service.notifications$().length).toBe(3);

      tick(500);
      expect(service.notifications$().length).toBe(2);

      tick(500);
      expect(service.notifications$().length).toBe(1);

      tick(500);
      expect(service.notifications$().length).toBe(0);
    }));
  });

  describe('remove', () => {
    it('should remove specific notification by id', () => {
      service.success('Notification 1');
      service.error('Notification 2');

      const notifications = service.notifications$();
      const idToRemove = notifications[0].id;

      service.remove(idToRemove);

      const remaining = service.notifications$();
      expect(remaining.length).toBe(1);
      expect(remaining[0].message).toBe('Notification 2');
    });

    it('should not throw error when removing non-existent id', () => {
      service.success('Test notification');

      expect(() => {
        service.remove('non-existent-id');
      }).not.toThrow();

      expect(service.notifications$().length).toBe(1);
    });

    it('should remove notification from middle of list', () => {
      service.success('First');
      service.error('Second');
      service.warning('Third');

      const notifications = service.notifications$();
      const middleId = notifications[1].id;

      service.remove(middleId);

      const remaining = service.notifications$();
      expect(remaining.length).toBe(2);
      expect(remaining[0].message).toBe('First');
      expect(remaining[1].message).toBe('Third');
    });
  });

  describe('clear', () => {
    it('should clear all notifications', () => {
      service.success('Success');
      service.error('Error');
      service.warning('Warning');

      expect(service.notifications$().length).toBe(3);

      service.clear();

      expect(service.notifications$().length).toBe(0);
    });

    it('should not throw error when clearing empty list', () => {
      expect(() => {
        service.clear();
      }).not.toThrow();

      expect(service.notifications$().length).toBe(0);
    });

    it('should prevent scheduled auto-removals after clear', fakeAsync(() => {
      service.success('Will be cleared', 1000);

      service.clear();

      expect(service.notifications$().length).toBe(0);

      tick(1000);

      expect(service.notifications$().length).toBe(0);
    }));
  });

  describe('notification id generation', () => {
    it('should generate unique ids for each notification', () => {
      service.success('First');
      service.success('Second');
      service.success('Third');

      const notifications = service.notifications$();
      const ids = notifications.map((n) => n.id);

      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(3);
    });

    it('should generate ids with timestamp and random component', () => {
      service.info('Test');

      const notification = service.notifications$()[0];
      expect(notification.id).toMatch(/^\d+-[a-z0-9]{7}$/);
    });
  });

  describe('zero duration behavior', () => {
    it('should not auto-remove notification with 0 duration', fakeAsync(() => {
      service.success('Persistent notification', 0);

      expect(service.notifications$().length).toBe(1);

      tick(10000);

      expect(service.notifications$().length).toBe(1);
    }));

    it('should not auto-remove notification with negative duration', fakeAsync(() => {
      service.error('Persistent error', -1);

      expect(service.notifications$().length).toBe(1);

      tick(10000);

      expect(service.notifications$().length).toBe(1);
    }));
  });

  describe('edge cases', () => {
    it('should handle empty message', () => {
      service.success('');

      const notifications = service.notifications$();
      expect(notifications.length).toBe(1);
      expect(notifications[0].message).toBe('');
    });

    it('should handle very long messages', () => {
      const longMessage = 'A'.repeat(1000);
      service.info(longMessage);

      const notifications = service.notifications$();
      expect(notifications[0].message).toBe(longMessage);
    });

    it('should handle special characters in message', () => {
      const specialMessage = '<script>alert("xss")</script> & " \' \\';
      service.warning(specialMessage);

      const notifications = service.notifications$();
      expect(notifications[0].message).toBe(specialMessage);
    });

    it('should handle rapid successive additions', () => {
      for (let i = 0; i < 100; i++) {
        service.success(`Message ${i}`);
      }

      expect(service.notifications$().length).toBe(100);
    });
  });
});
