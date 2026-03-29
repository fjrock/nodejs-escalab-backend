const { userSignupValidator } = require('../../validator');

const mockReq = (errors = null) => ({
  check: jest.fn().mockReturnValue({
    notEmpty: jest.fn().mockReturnThis(),
    matches: jest.fn().mockReturnThis(),
    withMessage: jest.fn().mockReturnThis(),
    isLength: jest.fn().mockReturnThis(),
  }),
  validationErrors: jest.fn().mockReturnValue(errors),
});

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('userSignupValidator', () => {
  it('calls next when there are no validation errors', () => {
    const req = mockReq(null);
    const res = mockRes();
    const next = jest.fn();
    userSignupValidator(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('returns 400 with first error message when validation fails', () => {
    const errors = [{ msg: 'Name is required' }, { msg: 'Email must contain @' }];
    const req = mockReq(errors);
    const res = mockRes();
    const next = jest.fn();
    userSignupValidator(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Name is required' });
    expect(next).not.toHaveBeenCalled();
  });
});
