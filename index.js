const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const logger = require('./src/configuration/logger');


const app = express();
const port = 3000;

const { fetchAll, create } = require('./src/services/note.service');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const connectionString = 'mongodb://localhost:27017/testDb';
mongoose.connect(connectionString, { useNewUrlParser: true }, (error) => {
  if (error) logger.error(error);
});

app.get('/notes', async (req, res) => {
  try {
    const notes = await fetchAll();
    res.send(notes);
  } catch (error) {
    logger.error(`Something's wrong, error: ${error}`);
    res.status(500).send(error);
  }
});

app.post('/notes', async (req, res) => {
  try {
    const createdNote = await create(req.body);
    res.status(201).send(createdNote);
  } catch (error) {
    logger.error(`Something's wrong, error: ${error}`);
    res.status(500).send(error);
  }
});


app.listen(port);
