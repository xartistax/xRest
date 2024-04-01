const express = require('express');
const app = express();
const xDataRoutes = require('./xDataRoutes');
const cors = require('cors');

app.use(cors());

app.use(express.json());
app.use('/xData', xDataRoutes); // Update the path as per your preference

module.exports = app;
