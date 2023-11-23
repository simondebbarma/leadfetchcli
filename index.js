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
      const places = response.json.results;
      return Promise.all(places.map(place => {
        return getPlaceDetails(place.place_id)
          .then(details => {
            return {...place, ...details};
          });
      }));
    })
    .catch(err => console.log(err));
  }

function getPlaceDetails(placeId) {
    return googleMapsClient.place({
      placeid: placeId,
      fields: ['formatted_phone_number', 'website'],
    })
    .asPromise()
    .then(response => response.json.result)
    .catch(err => console.log(err));
}
   

program
  .version('1.0.0')
  .description('Google Maps Data Extractor')
  .option('-k, --keyword <keyword>', 'Keyword to search for')
  .option('-l, --location <location>', 'Location to search in')
  .action((options) => {
    const { keyword, location } = options;
    let workbook = new ExcelJS.Workbook();
    let worksheet = workbook.addWorksheet('Google Maps Data');

    searchPlaces(keyword, location)
      .then(places => {
        worksheet.columns = [
            { header: 'Name', key: 'name', width: 25 },  
            { header: 'Business Status', key: 'business_status', width: 25 },
            { header: 'Website', key: 'website', width: 25},
            { header: 'Phone Number', key: 'formatted_phone_number', width: 25},
            { header: 'Address', key: 'formatted_address', width: 25 },
            { header: 'Rating', key: 'rating', width: 25 },
            { header: 'Types', key: 'types', width: 25 },
            { header: 'User Ratings Total', key: 'user_ratings_total', width: 25},
        ];
        worksheet.addRows(places);
        return workbook.xlsx.writeFile('./results/' +keyword + location + '.xlsx');
    })
      .then(() => console.log('File written successfully.'))
      .catch(err => console.error(err));
  });

program.parse(process.argv);

module.exports.searchPlaces = searchPlaces;