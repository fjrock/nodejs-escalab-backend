const { errorHandler } = require('../../helpers/dbErrorHandler');

describe('errorHandler', () => {
  it('returns unique message for code 11000 with extractable field', () => {
    const error = { code: 11000, message: 'E11000 dup key index: .$email_1 dup key' };
    expect(errorHandler(error)).toBe('Email already exists');
  });

  it('returns unique message for code 11001', () => {
    const error = { code: 11001, message: 'E11000 dup key index: .$name_1 dup key' };
    expect(errorHandler(error)).toBe('Name already exists');
  });

  it('returns "Something went wrong" for unknown error code', () => {
    const error = { code: 500 };
    expect(errorHandler(error)).toBe('Something went wrong');
  });

  it('returns empty string when no code and no errorors', () => {
    const error = {};
    expect(errorHandler(error)).toBe('');
  });

  it('returns message from errorors when no code', () => {
    const error = { errorors: { name: { message: 'Path name is required' } } };
    expect(errorHandler(error)).toBe('Path name is required');
  });

  it('does not update message when errorors field has no message', () => {
    const error = { errorors: { name: {} } };
    expect(errorHandler(error)).toBe('');
  });

  it('returns fallback when uniqueMessage extraction fails (null message)', () => {
    const error = { code: 11000, message: null };
    expect(errorHandler(error)).toBe('Unique field already exists');
  });
});
