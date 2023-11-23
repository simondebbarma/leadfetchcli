//import google key from secret file
require('dotenv').config();

const googleMapsClient = require('@google/maps').createClient({
    key: process.env.GOOGLE_MAPS_API_KEY,
    Promise: Promise
  });
const axios = require('axios');
const ExcelJS = require('exceljs');

function searchPlaces(keyword) {
    return googleMapsClient.places({
      query: keyword,
      language: 'en',
    })
    .asPromise()
    .then(response => response.json.results)
    .catch(err => console.log(err));
  }

searchPlaces('restaurants in New York')
  .then(places => {
    let workbook = new ExcelJS.Workbook();
    let worksheet = workbook.addWorksheet('Google Maps Data');

    worksheet.columns = [
      { header: 'Name', key: 'name', width: 25 },
      { header: 'Address', key: 'formatted_address', width: 25 },
      // Add more columns as needed
    ];

    worksheet.addRows(places);

    return workbook.xlsx.writeFile('GoogleMapsData.xlsx');
  })
  .then(() => console.log('File written successfully.'))
  .catch(err => console.error(err));
