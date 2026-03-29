jest.mock('../../models/song', () => {
  const MockSong = jest.fn();
  MockSong.findById = jest.fn();
  MockSong.find = jest.fn();
  return MockSong;
});

const Song = require('../../models/song');
const songController = require('../../controllers/song');

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('songById', () => {
  it('sets req.song and calls next when found', () => {
    const mockSong = { _id: '1', name: 'Test Song' };
    Song.findById.mockReturnValue({ exec: jest.fn().mockImplementation(cb => cb(null, mockSong)) });
    const req = {};
    const res = mockRes();
    const next = jest.fn();
    songController.songById(req, res, next, '1');
    expect(req.song).toEqual(mockSong);
    expect(next).toHaveBeenCalled();
  });

  it('returns 404 when findById returns an error', () => {
    Song.findById.mockReturnValue({ exec: jest.fn().mockImplementation(cb => cb(new Error('DB'), null)) });
    const req = {};
    const res = mockRes();
    const next = jest.fn();
    songController.songById(req, res, next, '1');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Song does not exist' });
  });

  it('returns 404 when song does not exist', () => {
    Song.findById.mockReturnValue({ exec: jest.fn().mockImplementation(cb => cb(null, null)) });
    const req = {};
    const res = mockRes();
    const next = jest.fn();
    songController.songById(req, res, next, '1');
    expect(res.status).toHaveBeenCalledWith(404);
  });
});

describe('create', () => {
  it('returns created song on success', () => {
    const savedSong = { _id: '1', name: 'New Song' };
    Song.mockImplementation(() => ({ save: jest.fn().mockImplementation(cb => cb(null, savedSong)) }));
    const req = { body: { name: 'New Song' } };
    const res = mockRes();
    songController.create(req, res);
    expect(res.json).toHaveBeenCalledWith({ data: savedSong });
  });

  it('returns 400 on save error', () => {
    Song.mockImplementation(() => ({ save: jest.fn().mockImplementation(cb => cb(new Error('error'), null)) }));
    const req = { body: { name: 'Bad' } };
    const res = mockRes();
    songController.create(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });
});

describe('read', () => {
  it('returns req.song', () => {
    const req = { song: { _id: '1', name: 'Test' } };
    const res = mockRes();
    songController.read(req, res);
    expect(res.json).toHaveBeenCalledWith(req.song);
  });
});

describe('update', () => {
  it('returns updated song on success', () => {
    const updatedSong = { name: 'Updated' };
    const req = {
      song: { name: 'Old', save: jest.fn().mockImplementation(cb => cb(null, updatedSong)) },
      body: { name: 'Updated' },
    };
    const res = mockRes();
    songController.update(req, res);
    expect(req.song.name).toBe('Updated');
    expect(res.json).toHaveBeenCalledWith(updatedSong);
  });

  it('returns 400 on save error', () => {
    const req = {
      song: { name: 'Old', save: jest.fn().mockImplementation(cb => cb(new Error('error'), null)) },
      body: { name: 'Updated' },
    };
    const res = mockRes();
    songController.update(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });
});

describe('remove', () => {
  it('returns success message when deleted', () => {
    const req = { song: { remove: jest.fn().mockImplementation(cb => cb(null, {})) } };
    const res = mockRes();
    songController.remove(req, res);
    expect(res.json).toHaveBeenCalledWith({ message: 'Song deleted' });
  });

  it('returns 400 on remove error', () => {
    const req = { song: { remove: jest.fn().mockImplementation(cb => cb(new Error('error'), null)) } };
    const res = mockRes();
    songController.remove(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });
});

describe('list', () => {
  it('returns all songs on success', () => {
    const songs = [{ name: 'Song 1' }, { name: 'Song 2' }];
    Song.find.mockReturnValue({ exec: jest.fn().mockImplementation(cb => cb(null, songs)) });
    const req = {};
    const res = mockRes();
    songController.list(req, res);
    expect(res.json).toHaveBeenCalledWith(songs);
  });

  it('returns 400 on list error', () => {
    Song.find.mockReturnValue({ exec: jest.fn().mockImplementation(cb => cb(new Error('DB'), null)) });
    const req = {};
    const res = mockRes();
    songController.list(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });
});
