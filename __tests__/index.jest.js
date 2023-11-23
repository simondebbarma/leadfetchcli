// FILEPATH: /home/simon/code/leadfetchcli/index.test.js
const googleMapsClient = require('@google/maps').createClient({
  key: process.env.GOOGLE_MAPS_API_KEY,
  Promise: Promise
});
const ExcelJS = require('exceljs');
const { searchPlaces } = require('../index'); // assuming the function is exported

jest.mock('@google/maps');
jest.mock('exceljs');

// TODO: write tests