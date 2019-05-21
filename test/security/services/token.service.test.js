const sinon = require('sinon');
const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');
const authConfig = require('../../../src/configuration/auth.config');

chai.use(chaiHttp);

const { expect } = chai;
const server = require('../../..');

const { Note } = require('../../../src/core/notes/models/note.model');

describe('note.service', () => {
  describe('checkToken', () => {
    it('should return status 400 when client does not supply the authorization header', async () => {
      const result = await chai.request(server).get('/notes');

      expect(result.status).to.eql(400);
    });

    it('should return status 401 when token is invalid', async () => {
      const result = await chai.request(server)
        .get('/notes')
        .set('Authorization', 'Bearer my-token');

      expect(result.status).to.eql(401);
    });

    it('should pass the endpoint when the client successfully authenticated', async () => {
      const NoteMock = sinon.mock(Note);

      const expectedResult = [];
      NoteMock.expects('find').returns(expectedResult);
      const token = jwt.sign({ email: 'john.doe@btpn.com' }, authConfig.SECRET, { expiresIn: '1m' });

      const result = await chai.request(server)
        .get('/notes')
        .set('Authorization', token);

      expect(result.status).to.eql(200);
      NoteMock.restore();
    });
  });
});
