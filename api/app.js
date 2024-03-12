const express = require('express');
const app = express();
const xDataRoutes = require('./xDataRoutes');

app.use(express.json());
app.use('/xData', xDataRoutes); // Update the path as per your preference

module.exports = app;
