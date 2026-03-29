const Genre = require('../../models/genre');

describe('Genre model', () => {
  it('creates a genre instance with valid data', () => {
    const genre = new Genre({ name: 'Rock' });
    expect(genre.name).toBe('Rock');
  });

  it('trims whitespace from name', () => {
    const genre = new Genre({ name: '  Jazz  ' });
    expect(genre.name).toBe('Jazz');
  });
});
