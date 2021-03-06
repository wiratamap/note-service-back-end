const sinon = require('sinon');
const { expect } = require('chai');

const { Note } = require('../../../../src/core/notes/models/note.model');
const { fetchAll, create } = require('../../../../src/core/notes/services/note.service');

describe('note.service', () => {
  const userInformation = { email: 'john.doe@example.com' };

  describe('fetchAll', () => {
    it('should fetch all data', async () => {
      const NoteMock = sinon.mock(Note);

      const expectedResult = [
        { title: 'first note', content: 'body of notes.' },
        { title: 'second note', content: 'body of notes.' },
      ];
      NoteMock.expects('find').returns(expectedResult);

      const actualResult = await fetchAll(userInformation);

      expect(actualResult).to.equal(expectedResult);
      NoteMock.restore();
    });

    it('should return empty array when there are no available data', async () => {
      const NoteMock = sinon.mock(Note);

      const expectedResult = [];
      NoteMock.expects('find').returns(expectedResult);

      const actualResult = await fetchAll(userInformation);

      expect(actualResult).to.equal(expectedResult);
      NoteMock.restore();
    });
  });

  describe('create', () => {
    it('should return saved note', async () => {
      const NoteMock = sinon.mock(Note);

      const note = { title: 'this is title', content: 'this is content' };
      NoteMock.expects('create').returns(note);

      const actualResult = await create(note, userInformation);

      expect(actualResult).to.equal(note);
      NoteMock.restore();
    });

    it('should throw error when save to mongo is failed', async () => {
      const expectedError = new Error('Mongo Error');
      const NoteMock = sinon.mock(Note);
      sinon.spy(create);

      NoteMock.expects('create').throws(expectedError);

      try {
        await create({}, userInformation);
      } catch (error) {
        expect(error).to.equal(expectedError);
        NoteMock.restore();
      }
    });
  });
});
