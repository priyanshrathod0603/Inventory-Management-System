import { RequestIdMiddleware } from './request-id.middleware';
import { Request, Response, NextFunction } from 'express';

describe('RequestIdMiddleware', () => {
  let middleware: RequestIdMiddleware;

  beforeEach(() => {
    middleware = new RequestIdMiddleware();
  });

  it('should generate a new request ID if none is present', () => {
    const req = { headers: {} } as Request;
    const res = { setHeader: jest.fn() } as unknown as Response;
    const next: NextFunction = jest.fn();

    middleware.use(req, res, next);

    expect(req.headers['x-request-id']).toBeDefined();
    expect(res.setHeader).toHaveBeenCalledWith(
      'x-request-id',
      req.headers['x-request-id'],
    );
    expect(next).toHaveBeenCalled();
  });

  it('should preserve existing incoming x-request-id header', () => {
    const customId = 'custom-request-id-123';
    const req = { headers: { 'x-request-id': customId } } as unknown as Request;
    const res = { setHeader: jest.fn() } as unknown as Response;
    const next: NextFunction = jest.fn();

    middleware.use(req, res, next);

    expect(req.headers['x-request-id']).toBe(customId);
    expect(res.setHeader).toHaveBeenCalledWith('x-request-id', customId);
    expect(next).toHaveBeenCalled();
  });
});
