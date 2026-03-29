process.env.JWT_SECRET = 'test-secret';

jest.mock('jsonwebtoken');
jest.mock('express-jwt', () => jest.fn(() => jest.fn()));
jest.mock('../../models/user', () => {
  const MockUser = jest.fn();
  MockUser.findOne = jest.fn();
  return MockUser;
});

const jwt = require('jsonwebtoken');
const User = require('../../models/user');
const authController = require('../../controllers/auth');

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.cookie = jest.fn().mockReturnValue(res);
  res.clearCookie = jest.fn().mockReturnValue(res);
  return res;
};

describe('signup', () => {
  it('saves user and returns it without sensitive fields', () => {
    const savedUser = { _id: '1', name: 'Test', salt: 'abc', hashed_password: 'hash' };
    User.mockImplementation(() => ({
      save: jest.fn().mockImplementation(cb => cb(null, savedUser)),
    }));
    const req = { body: { name: 'Test', email: 't@t.com', password: 'pass1' } };
    const res = mockRes();
    authController.signup(req, res);
    expect(savedUser.salt).toBeUndefined();
    expect(savedUser.hashed_password).toBeUndefined();
    expect(res.json).toHaveBeenCalledWith({ user: savedUser });
  });

  it('returns 400 when save fails', () => {
    User.mockImplementation(() => ({
      save: jest.fn().mockImplementation(cb => cb(new Error('DB error'), null)),
    }));
    const req = { body: {} };
    const res = mockRes();
    authController.signup(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });
});

describe('signin', () => {
  it('returns 400 when findOne returns error', () => {
    User.findOne.mockImplementation((q, cb) => cb(new Error('DB'), null));
    const req = { body: { email: 't@t.com', password: 'pass' } };
    const res = mockRes();
    authController.signin(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'User with that email does not exist. Please signup' });
  });

  it('returns 400 when user is not found', () => {
    User.findOne.mockImplementation((q, cb) => cb(null, null));
    const req = { body: { email: 't@t.com', password: 'pass' } };
    const res = mockRes();
    authController.signin(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('returns 401 when password does not match', () => {
    User.findOne.mockImplementation((q, cb) => cb(null, { authenticate: jest.fn().mockReturnValue(false) }));
    const req = { body: { email: 't@t.com', password: 'wrong' } };
    const res = mockRes();
    authController.signin(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Email and password dont match' });
  });

  it('returns token and user data on successful login', () => {
    const mockUser = { _id: '1', name: 'Test', email: 't@t.com', role: [0], authenticate: jest.fn().mockReturnValue(true) };
    User.findOne.mockImplementation((q, cb) => cb(null, mockUser));
    jwt.sign.mockReturnValue('signed-token');
    const req = { body: { email: 't@t.com', password: 'pass123' } };
    const res = mockRes();
    authController.signin(req, res);
    expect(res.cookie).toHaveBeenCalledWith('t', 'signed-token', expect.any(Object));
    expect(res.json).toHaveBeenCalledWith({
      token: 'signed-token',
      user: { _id: '1', name: 'Test', email: 't@t.com', role: [0] },
    });
  });
});

describe('signout', () => {
  it('clears cookie and returns success message', () => {
    const req = {};
    const res = mockRes();
    authController.signout(req, res);
    expect(res.clearCookie).toHaveBeenCalledWith('t');
    expect(res.json).toHaveBeenCalledWith({ message: 'Signout success' });
  });
});

describe('isAuth', () => {
  it('calls next when profile._id matches auth._id', () => {
    const req = { profile: { _id: '123' }, auth: { _id: '123' } };
    const res = mockRes();
    const next = jest.fn();
    authController.isAuth(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('returns 403 when IDs do not match', () => {
    const req = { profile: { _id: '123' }, auth: { _id: '456' } };
    const res = mockRes();
    const next = jest.fn();
    authController.isAuth(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: 'Access denied' });
  });
});

describe('isAdmin', () => {
  it('calls next when role includes 0', () => {
    const req = { profile: { role: [0] } };
    const res = mockRes();
    const next = jest.fn();
    authController.isAdmin(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('returns 403 when role does not include 0', () => {
    const req = { profile: { role: [1, 2] } };
    const res = mockRes();
    const next = jest.fn();
    authController.isAdmin(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: 'Admin resourse! Access denied' });
  });
});
