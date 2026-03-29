const Artist = require('../../models/artist');

describe('Artist model', () => {
  it('creates an artist instance with valid data', () => {
    const artist = new Artist({ name: 'Test Artist', description: 'A test artist' });
    expect(artist.name).toBe('Test Artist');
    expect(artist.description).toBe('A test artist');
    expect(artist.albums).toHaveLength(0);
    expect(artist.genres).toHaveLength(0);
  });

  it('accepts albums and genres arrays', () => {
    const artist = new Artist({
      name: 'Artist',
      description: 'desc',
      albums: [{ album: '507f1f77bcf86cd799439011' }],
      genres: [{ genre: '507f1f77bcf86cd799439012' }],
    });
    expect(artist.albums).toHaveLength(1);
    expect(artist.genres).toHaveLength(1);
  });
});
