import { TestBed } from '@angular/core/testing';

import {EnvService, Size} from './env.service';
import {ErrorHandler} from "@angular/core";
import {WINDOW} from "./window";

describe('EnvService', () => {
  let env: EnvService;
  let mockWindow: MockWindow;

  beforeEach(() => {
    mockWindow = new MockWindow();
    mockWindow.innerWidth = 1920;
    mockWindow.innerHeight = 1080;
    TestBed.configureTestingModule({
      providers: [ { provide: WINDOW, useValue: mockWindow } ],
    });
    env = TestBed.inject(EnvService);
  });

  it('should be created', () => {
    expect(env).toBeTruthy();
  });

  describe('should listen to window resize events', () => {
    it('should get current size upon subscribe', () => {
      let size: Size;
      env.size$.subscribe(s => size = s);

      expect(size).toBe("desktop");
    });

    it('should get updated size upon resize', (done) => {
      let size: Size;
      env.size$.subscribe(s => size = s);

      setTimeout(done, 2000);

      mockWindow.callEvent(800);
      setTimeout(() => {
        expect(size).toBe("tablet");
        mockWindow.callEvent(400);
        setTimeout(() => {
          expect(size).toBe("phone");
          done();
        }, 600)
      }, 600)
    })
  })
});

class MockWindow {
  public innerWidth: number;
  public innerHeight: number;
  public listener: Function;
  addEventListener(eventName: keyof WindowEventMap, listener: (this: MockWindow, ev: any) => any, options?: any) {
    this.listener = listener;
  }
  removeEventListener(eventName: keyof WindowEventMap) {
    this.listener = undefined;
  }
  callEvent(updated: number) {
    this.innerWidth = updated;
    this.listener.apply(this, {})
  }
}
