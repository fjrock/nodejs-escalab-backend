const User = require('../../models/user');

describe('User model', () => {
  describe('password virtual setter', () => {
    it('hashes the password and stores it in hashed_password', () => {
      const user = new User({ name: 'Test', email: 'test@test.com' });
      user.password = 'password123';
      expect(user.hashed_password).toBeDefined();
      expect(user.hashed_password).not.toBe('password123');
      expect(user.hashed_password.length).toBeGreaterThan(20);
    });

    it('stores original password in _password via getter', () => {
      const user = new User({ name: 'Test', email: 'test@test.com' });
      user.password = 'mypassword1';
      expect(user.password).toBe('mypassword1');
    });
  });

  describe('authenticate', () => {
    it('returns true for the correct password', () => {
      const user = new User({ name: 'Test', email: 'test@test.com' });
      user.password = 'correct123';
      expect(user.authenticate('correct123')).toBe(true);
    });

    it('returns false for an incorrect password', () => {
      const user = new User({ name: 'Test', email: 'test@test.com' });
      user.password = 'correct123';
      expect(user.authenticate('wrongpass')).toBe(false);
    });
  });
});
