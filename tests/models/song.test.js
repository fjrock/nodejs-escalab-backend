const Song = require('../../models/song');

describe('Song model', () => {
  it('creates a song instance with valid data', () => {
    const song = new Song({ name: 'Test Song' });
    expect(song.name).toBe('Test Song');
  });

  it('trims whitespace from name', () => {
    const song = new Song({ name: '  Trimmed  ' });
    expect(song.name).toBe('Trimmed');
  });
});
