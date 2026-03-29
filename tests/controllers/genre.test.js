jest.mock('../../models/genre', () => {
  const MockGenre = jest.fn();
  MockGenre.findById = jest.fn();
  MockGenre.find = jest.fn();
  return MockGenre;
});

const Genre = require('../../models/genre');
const genreController = require('../../controllers/genre');

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('genreById', () => {
  it('sets req.genre and calls next when found', () => {
    const mockGenre = { _id: '1', name: 'Rock' };
    Genre.findById.mockReturnValue({ exec: jest.fn().mockImplementation(cb => cb(null, mockGenre)) });
    const req = {};
    const res = mockRes();
    const next = jest.fn();
    genreController.genreById(req, res, next, '1');
    expect(req.genre).toEqual(mockGenre);
    expect(next).toHaveBeenCalled();
  });

  it('returns 404 when findById returns an error', () => {
    Genre.findById.mockReturnValue({ exec: jest.fn().mockImplementation(cb => cb(new Error('DB'), null)) });
    const req = {};
    const res = mockRes();
    const next = jest.fn();
    genreController.genreById(req, res, next, '1');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Genre does not exist' });
  });

  it('returns 404 when genre does not exist', () => {
    Genre.findById.mockReturnValue({ exec: jest.fn().mockImplementation(cb => cb(null, null)) });
    const req = {};
    const res = mockRes();
    const next = jest.fn();
    genreController.genreById(req, res, next, '1');
    expect(res.status).toHaveBeenCalledWith(404);
  });
});

describe('create', () => {
  it('returns created genre on success', () => {
    const saved = { _id: '1', name: 'Rock' };
    Genre.mockImplementation(() => ({ save: jest.fn().mockImplementation(cb => cb(null, saved)) }));
    const req = { body: { name: 'Rock' } };
    const res = mockRes();
    genreController.create(req, res);
    expect(res.json).toHaveBeenCalledWith({ data: saved });
  });

  it('returns 400 on save error', () => {
    Genre.mockImplementation(() => ({ save: jest.fn().mockImplementation(cb => cb(new Error('error'), null)) }));
    const req = { body: {} };
    const res = mockRes();
    genreController.create(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });
});

describe('read', () => {
  it('returns req.genre', () => {
    const req = { genre: { _id: '1', name: 'Rock' } };
    const res = mockRes();
    genreController.read(req, res);
    expect(res.json).toHaveBeenCalledWith(req.genre);
  });
});

describe('update', () => {
  it('returns updated genre on success', () => {
    const updated = { name: 'Jazz' };
    const req = {
      genre: { name: 'Rock', save: jest.fn().mockImplementation(cb => cb(null, updated)) },
      body: { name: 'Jazz' },
    };
    const res = mockRes();
    genreController.update(req, res);
    expect(res.json).toHaveBeenCalledWith(updated);
  });

  it('returns 400 on save error', () => {
    const req = {
      genre: { name: 'Rock', save: jest.fn().mockImplementation(cb => cb(new Error('error'), null)) },
      body: { name: 'Jazz' },
    };
    const res = mockRes();
    genreController.update(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });
});

describe('remove', () => {
  it('returns success message when deleted', () => {
    const req = { genre: { remove: jest.fn().mockImplementation(cb => cb(null, {})) } };
    const res = mockRes();
    genreController.remove(req, res);
    expect(res.json).toHaveBeenCalledWith({ message: 'Genre deleted' });
  });

  it('returns 400 on remove error', () => {
    const req = { genre: { remove: jest.fn().mockImplementation(cb => cb(new Error('error'), null)) } };
    const res = mockRes();
    genreController.remove(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });
});

describe('list', () => {
  it('returns all genres on success', () => {
    const genres = [{ name: 'Rock' }, { name: 'Pop' }];
    Genre.find.mockReturnValue({ exec: jest.fn().mockImplementation(cb => cb(null, genres)) });
    const req = {};
    const res = mockRes();
    genreController.list(req, res);
    expect(res.json).toHaveBeenCalledWith(genres);
  });

  it('returns 400 on list error', () => {
    Genre.find.mockReturnValue({ exec: jest.fn().mockImplementation(cb => cb(new Error('DB'), null)) });
    const req = {};
    const res = mockRes();
    genreController.list(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });
});
