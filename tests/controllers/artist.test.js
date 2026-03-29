jest.mock('../../models/artist', () => {
  const MockArtist = jest.fn();
  MockArtist.findById = jest.fn();
  MockArtist.find = jest.fn();
  return MockArtist;
});

const Artist = require('../../models/artist');
const artistController = require('../../controllers/artist');

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('artistById', () => {
  it('sets req.artist and calls next when found', () => {
    const mockArtist = { _id: '1', name: 'Test Artist' };
    Artist.findById.mockReturnValue({ exec: jest.fn().mockImplementation(cb => cb(null, mockArtist)) });
    const req = {};
    const res = mockRes();
    const next = jest.fn();
    artistController.artistById(req, res, next, '1');
    expect(req.artist).toEqual(mockArtist);
    expect(next).toHaveBeenCalled();
  });

  it('returns 404 when findById returns an error', () => {
    Artist.findById.mockReturnValue({ exec: jest.fn().mockImplementation(cb => cb(new Error('DB'), null)) });
    const req = {};
    const res = mockRes();
    const next = jest.fn();
    artistController.artistById(req, res, next, '1');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Artist does not exist' });
  });

  it('returns 404 when artist does not exist', () => {
    Artist.findById.mockReturnValue({ exec: jest.fn().mockImplementation(cb => cb(null, null)) });
    const req = {};
    const res = mockRes();
    const next = jest.fn();
    artistController.artistById(req, res, next, '1');
    expect(res.status).toHaveBeenCalledWith(404);
  });
});

describe('create', () => {
  it('returns created artist on success', () => {
    const saved = { _id: '1', name: 'New Artist' };
    Artist.mockImplementation(() => ({ save: jest.fn().mockImplementation(cb => cb(null, saved)) }));
    const req = { body: { name: 'New Artist', description: 'desc' } };
    const res = mockRes();
    artistController.create(req, res);
    expect(res.json).toHaveBeenCalledWith({ data: saved });
  });

  it('returns 400 on save error', () => {
    Artist.mockImplementation(() => ({ save: jest.fn().mockImplementation(cb => cb(new Error('error'), null)) }));
    const req = { body: {} };
    const res = mockRes();
    artistController.create(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });
});

describe('read', () => {
  it('returns req.artist', () => {
    const req = { artist: { _id: '1', name: 'Test' } };
    const res = mockRes();
    artistController.read(req, res);
    expect(res.json).toHaveBeenCalledWith(req.artist);
  });
});

describe('update', () => {
  it('returns updated artist on success', () => {
    const updated = { name: 'Updated' };
    const req = {
      artist: { name: 'Old', save: jest.fn().mockImplementation(cb => cb(null, updated)) },
      body: { name: 'Updated' },
    };
    const res = mockRes();
    artistController.update(req, res);
    expect(res.json).toHaveBeenCalledWith(updated);
  });

  it('returns 400 on save error', () => {
    const req = {
      artist: { name: 'Old', save: jest.fn().mockImplementation(cb => cb(new Error('error'), null)) },
      body: { name: 'Updated' },
    };
    const res = mockRes();
    artistController.update(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });
});

describe('remove', () => {
  it('returns success message when deleted', () => {
    const req = { artist: { remove: jest.fn().mockImplementation(cb => cb(null, {})) } };
    const res = mockRes();
    artistController.remove(req, res);
    expect(res.json).toHaveBeenCalledWith({ message: 'artist deleted' });
  });

  it('returns 400 on remove error', () => {
    const req = { artist: { remove: jest.fn().mockImplementation(cb => cb(new Error('error'), null)) } };
    const res = mockRes();
    artistController.remove(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });
});

describe('list', () => {
  it('returns all artists on success', () => {
    const artists = [{ name: 'Artist 1' }];
    Artist.find.mockReturnValue({ exec: jest.fn().mockImplementation(cb => cb(null, artists)) });
    const req = {};
    const res = mockRes();
    artistController.list(req, res);
    expect(res.json).toHaveBeenCalledWith(artists);
  });

  it('returns 400 on list error', () => {
    Artist.find.mockReturnValue({ exec: jest.fn().mockImplementation(cb => cb(new Error('DB'), null)) });
    const req = {};
    const res = mockRes();
    artistController.list(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });
});
