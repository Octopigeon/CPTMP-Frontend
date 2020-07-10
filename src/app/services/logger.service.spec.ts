import { TestBed } from '@angular/core/testing';

import { Logger } from './logger.service';
import {ErrorHandler} from "@angular/core";

describe('LoggerService', () => {
  let logSpy: jasmine.Spy;
  let warnSpy: jasmine.Spy;
  let logger: Logger;
  let mockErrorHandler;

  beforeEach(() => {
    logSpy = spyOn(console, 'log');
    warnSpy = spyOn(console, 'warn');
    mockErrorHandler = new MockErrorHandler();
    TestBed.configureTestingModule({
      providers: [ { provide: ErrorHandler, useValue: mockErrorHandler } ],
    });
    logger = TestBed.inject(Logger);
  });

  describe('create', () => {
    it('should be created', () => {
      expect(logger).toBeTruthy();
    });
  });

  describe('log', () => {
    it('should delegate to console.log', () => {
      logger.log('param1', 'param2', 'param3');
      expect(logSpy).toHaveBeenCalledWith('param1', 'param2', 'param3');
    });
  });

  describe('warn', () => {
    it('should delegate to console.warn', () => {
      logger.warn('param1', 'param2', 'param3');
      expect(warnSpy).toHaveBeenCalledWith('param1', 'param2', 'param3');
    });
  });

  describe('error', () => {
    it('should delegate to ErrorHandler', () => {
      const err = new Error('some error message');
      logger.error(err);
      expect(mockErrorHandler.handleError).toHaveBeenCalledWith(err);
    });
  });
});

class MockErrorHandler implements ErrorHandler {
  handleError = jasmine.createSpy('handleError');
}
