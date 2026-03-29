jest.mock('../../models/album', () => {
  const MockAlbum = jest.fn();
  MockAlbum.findById = jest.fn();
  MockAlbum.find = jest.fn();
  return MockAlbum;
});

const Album = require('../../models/album');
const albumController = require('../../controllers/album');

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('albumById', () => {
  it('sets req.album and calls next when found', () => {
    const mockAlbum = { _id: '1', name: 'Test Album' };
    Album.findById.mockReturnValue({ exec: jest.fn().mockImplementation(cb => cb(null, mockAlbum)) });
    const req = {};
    const res = mockRes();
    const next = jest.fn();
    albumController.albumById(req, res, next, '1');
    expect(req.album).toEqual(mockAlbum);
    expect(next).toHaveBeenCalled();
  });

  it('returns 404 when findById returns an error', () => {
    Album.findById.mockReturnValue({ exec: jest.fn().mockImplementation(cb => cb(new Error('DB'), null)) });
    const req = {};
    const res = mockRes();
    const next = jest.fn();
    albumController.albumById(req, res, next, '1');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Album does not exist' });
  });

  it('returns 404 when album does not exist', () => {
    Album.findById.mockReturnValue({ exec: jest.fn().mockImplementation(cb => cb(null, null)) });
    const req = {};
    const res = mockRes();
    const next = jest.fn();
    albumController.albumById(req, res, next, '1');
    expect(res.status).toHaveBeenCalledWith(404);
  });
});

describe('create', () => {
  it('returns created album on success', () => {
    const saved = { _id: '1', name: 'New Album' };
    Album.mockImplementation(() => ({ save: jest.fn().mockImplementation(cb => cb(null, saved)) }));
    const req = { body: { name: 'New Album', description: 'desc' } };
    const res = mockRes();
    albumController.create(req, res);
    expect(res.json).toHaveBeenCalledWith({ data: saved });
  });

  it('returns 400 on save error', () => {
    Album.mockImplementation(() => ({ save: jest.fn().mockImplementation(cb => cb(new Error('error'), null)) }));
    const req = { body: {} };
    const res = mockRes();
    albumController.create(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });
});

describe('read', () => {
  it('returns req.album', () => {
    const req = { album: { _id: '1', name: 'Test' } };
    const res = mockRes();
    albumController.read(req, res);
    expect(res.json).toHaveBeenCalledWith(req.album);
  });
});

describe('update', () => {
  it('returns updated album on success', () => {
    const updated = { name: 'Updated' };
    const req = {
      album: { name: 'Old', save: jest.fn().mockImplementation(cb => cb(null, updated)) },
      body: { name: 'Updated' },
    };
    const res = mockRes();
    albumController.update(req, res);
    expect(res.json).toHaveBeenCalledWith(updated);
  });

  it('returns 400 on save error', () => {
    const req = {
      album: { name: 'Old', save: jest.fn().mockImplementation(cb => cb(new Error('error'), null)) },
      body: { name: 'Updated' },
    };
    const res = mockRes();
    albumController.update(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });
});

describe('remove', () => {
  it('returns success message when deleted', () => {
    const req = { album: { remove: jest.fn().mockImplementation(cb => cb(null, {})) } };
    const res = mockRes();
    albumController.remove(req, res);
    expect(res.json).toHaveBeenCalledWith({ message: 'Album deleted' });
  });

  it('returns 400 on remove error', () => {
    const req = { album: { remove: jest.fn().mockImplementation(cb => cb(new Error('error'), null)) } };
    const res = mockRes();
    albumController.remove(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });
});

describe('list', () => {
  it('returns all albums on success', () => {
    const albums = [{ name: 'Album 1' }];
    Album.find.mockReturnValue({ exec: jest.fn().mockImplementation(cb => cb(null, albums)) });
    const req = {};
    const res = mockRes();
    albumController.list(req, res);
    expect(res.json).toHaveBeenCalledWith(albums);
  });

  it('returns 400 on list error', () => {
    Album.find.mockReturnValue({ exec: jest.fn().mockImplementation(cb => cb(new Error('DB'), null)) });
    const req = {};
    const res = mockRes();
    albumController.list(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });
});
