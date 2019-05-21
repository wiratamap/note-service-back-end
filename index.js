const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const logger = require('./src/configuration/logger');

const app = express();
const port = process.env.PORT || 3000;

const { fetchAll, create } = require('./src/core/notes/services/note.service');
const { login } = require('./src/security/services/authentication.service');
const { checkToken } = require('./src/security/services/token.service');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const connectionString = 'mongodb://localhost:27017/testDb';
mongoose.connect(connectionString, { useNewUrlParser: true }, (error) => {
  if (error) logger.error(error);
});

app.post('/login', async (req, res) => {
  try {
    const result = await login(req);
    res.status(result.status).send(result.body);
    logger.info(`Success authenticating the user, user: ${req.body.email}`);
  } catch (error) {
    logger.error(`Something's wrong, error: ${error}`);
    res.status(500).send(error);
  }
});

app.get('/notes', checkToken, async (req, res) => {
  try {
    const userInformation = { ...req.decoded };

    const notes = await fetchAll(userInformation);
    res.send(notes);
  } catch (error) {
    logger.error(`Something's wrong, error: ${error}`);
    res.status(500).send(error);
  }
});

app.post('/notes', checkToken, async (req, res) => {
  try {
    const userInformation = { ...req.decoded };

    const createdNote = await create(req.body, userInformation);
    res.status(201).send(createdNote);
  } catch (error) {
    logger.error(`Something's wrong, error: ${error}`);
    res.status(500).send(error);
  }
});


app.listen(port);

module.exports = app;
