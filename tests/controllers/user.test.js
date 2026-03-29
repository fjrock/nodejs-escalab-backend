jest.mock('../../models/user', () => {
  const MockUser = jest.fn();
  MockUser.findById = jest.fn();
  MockUser.findOneAndUpdate = jest.fn();
  return MockUser;
});

const User = require('../../models/user');
const userController = require('../../controllers/user');

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('userById', () => {
  it('sets req.profile and calls next when user is found', () => {
    const mockUser = { _id: '1', name: 'Test' };
    User.findById.mockReturnValue({ exec: jest.fn().mockImplementation(cb => cb(null, mockUser)) });
    const req = {};
    const res = mockRes();
    const next = jest.fn();
    userController.userById(req, res, next, '1');
    expect(req.profile).toEqual(mockUser);
    expect(next).toHaveBeenCalled();
  });

  it('returns 400 when findById returns an error', () => {
    User.findById.mockReturnValue({ exec: jest.fn().mockImplementation(cb => cb(new Error('DB'), null)) });
    const req = {};
    const res = mockRes();
    const next = jest.fn();
    userController.userById(req, res, next, '1');
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
  });

  it('returns 400 when user does not exist', () => {
    User.findById.mockReturnValue({ exec: jest.fn().mockImplementation(cb => cb(null, null)) });
    const req = {};
    const res = mockRes();
    const next = jest.fn();
    userController.userById(req, res, next, '1');
    expect(res.status).toHaveBeenCalledWith(400);
  });
});

describe('read', () => {
  it('returns profile without hashed_password and salt', () => {
    const req = { profile: { _id: '1', name: 'Test', hashed_password: 'hash', salt: 'salt' } };
    const res = mockRes();
    userController.read(req, res);
    expect(req.profile.hashed_password).toBeUndefined();
    expect(req.profile.salt).toBeUndefined();
    expect(res.json).toHaveBeenCalledWith(req.profile);
  });
});

describe('update', () => {
  it('returns updated user without sensitive fields on success', () => {
    const updatedUser = { name: 'Updated', hashed_password: 'hash', salt: 'salt' };
    User.findOneAndUpdate.mockImplementation((q, u, o, cb) => cb(null, updatedUser));
    const req = { profile: { _id: '1' }, body: { name: 'Updated' } };
    const res = mockRes();
    userController.update(req, res);
    expect(updatedUser.hashed_password).toBeUndefined();
    expect(updatedUser.salt).toBeUndefined();
    expect(res.json).toHaveBeenCalledWith(updatedUser);
  });

  it('returns 400 on update error', () => {
    User.findOneAndUpdate.mockImplementation((q, u, o, cb) => cb(new Error('error'), null));
    const req = { profile: { _id: '1' }, body: {} };
    const res = mockRes();
    userController.update(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'You are not authorized to perform this action' });
  });
});
