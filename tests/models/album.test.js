const Album = require('../../models/album');

describe('Album model', () => {
  it('creates an album instance with valid data', () => {
    const album = new Album({ name: 'Test Album', description: 'A test album' });
    expect(album.name).toBe('Test Album');
    expect(album.description).toBe('A test album');
    expect(album.songs).toHaveLength(0);
  });

  it('accepts songs array', () => {
    const album = new Album({ name: 'Album', description: 'desc', songs: [{ song: '507f1f77bcf86cd799439011' }] });
    expect(album.songs).toHaveLength(1);
  });
});
