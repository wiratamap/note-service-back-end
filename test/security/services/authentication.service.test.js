const sinon = require('sinon');
const { expect } = require('chai');

const { User } = require('../../../src/core/users/models/user.model');
const { login } = require('../../../src/security/services/authentication.service');

describe('authentication.service', () => {
  const request = {
    body: {
      email: 'john.doe@example.com',
      password: 'P@ssw0rd',
    },
  };
  const hashedPassword = '$2b$12$mWTap61KBB01Zox1cMeaKOP0ipcvkO5Ez7aoB2DuiLCvOZp6exQV.';

  describe('login', () => {
    it('should return status 404 when user is not found', async () => {
      const UserMock = sinon.mock(User);

      const expectedResult = {
        status: 404,
        body: { success: false, message: 'User not found!' },
      };
      UserMock.expects('findOne').returns(null);

      const actualResult = await login(request);

      expect(actualResult).to.eql(expectedResult);
      UserMock.restore();
    });

    it('should return status 200 when username and password is correct', async () => {
      const UserMock = sinon.mock(User);

      const expectedResult = {
        status: 200,
        body: { success: true, message: 'Authentication success!', token: 'Bearer token' },
      };
      UserMock.expects('findOne').returns({
        email: 'john.doe@example.com',
        password: hashedPassword,
      });

      const actualResult = await login(request);

      expect(actualResult.status).to.eql(expectedResult.status);
      UserMock.restore();
    });

    it('should return status 403 when password is incorrect', async () => {
      const UserMock = sinon.mock(User);

      const expectedResult = {
        status: 403,
        body: { success: true, message: 'Authentication success!', token: 'Bearer token' },
      };
      UserMock.expects('findOne').returns({
        email: 'john.doe@example.com',
        password: 'random-hash',
      });

      const actualResult = await login(request);

      expect(actualResult.status).to.eql(expectedResult.status);
      UserMock.restore();
    });
  });
});
