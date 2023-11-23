#!/usr/bin/env node

require('dotenv').config();

const program = require('commander');
const googleMapsClient = require('@google/maps').createClient({
  key: process.env.GOOGLE_MAPS_API_KEY,
  Promise: Promise
});
const ExcelJS = require('exceljs');

function searchPlaces(keyword, location) {
  return googleMapsClient.places({
    query: `${keyword} in ${location}`,
    language: 'en',
  })
  .asPromise()
  .then(response => {
    console.log(response.json.results);
    return response.json.results;
    })
  .catch(err => console.log(err));
}

program
  .version('1.0.0')
  .description('Google Maps Data Extractor')
  .option('-k, --keyword <keyword>', 'Keyword to search for')
  .option('-l, --location <location>', 'Location to search in')
  .action((options) => {
    const { keyword, location } = options;

    searchPlaces(keyword, location)
      .then(places => {
        let workbook = new ExcelJS.Workbook();
        let worksheet = workbook.addWorksheet('Google Maps Data');

        worksheet.columns = [
            { header: 'Name', key: 'name', width: 25 },  
            { header: 'Business Status', key: 'business_status', width: 25 },
            { header: 'Formatted Address', key: 'formatted_address', width: 25 },
            { header: 'Rating', key: 'rating', width: 25 },
            { header: 'Place ID', key: 'place_id', width: 25 },
            { header: 'Opening Hours', key: 'opening_hours', width: 25 },
            { header: 'Reference', key: 'reference', width: 25 },
            { header: 'Types', key: 'types', width: 25 },
            { header: 'User Ratings Total', key: 'user_ratings_total', width: 25},
            { header: 'Latitude', key: 'geometry.location.lat', width: 25 },
            { header: 'Longitude', key: 'geometry.location.lng', width: 25 },
            { header: 'Types', key: 'types', width: 25},
        ];

        worksheet.addRows(places);

        return workbook.xlsx.writeFile('./results/' +keyword + location + '.xlsx');
      })
      .then(() => console.log('File written successfully.'))
      .catch(err => console.error(err));
  });

program.parse(process.argv);

module.exports.searchPlaces = searchPlaces;