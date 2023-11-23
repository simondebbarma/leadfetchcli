#!/usr/bin/env node

require('dotenv').config();

const program = require('commander');
const googleMapsClient = require('@google/maps').createClient({
  key: process.env.GOOGLE_MAPS_API_KEY,
  Promise: Promise
});
const ExcelJS = require('exceljs');

async function searchPlaces(keyword, location) {
    let allPlaces = [];
    let nextPageToken = null;
    let requestCount = 0;
  
    do {
      const response = await googleMapsClient.places({
        query: `${keyword} in ${location}`,
        language: 'en',
        pagetoken: nextPageToken,
      }).asPromise();
  
      const places = response.json.results;
      allPlaces = allPlaces.concat(places);
  
      nextPageToken = response.json.next_page_token;
  
      if (nextPageToken) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
  
      requestCount++;
    } while (nextPageToken && requestCount < 3);
  
    return Promise.all(allPlaces.map(place => {
      return getPlaceDetails(place.place_id)
        .then(details => {
          return {...place, ...details};
        });
    }));
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
            { header: 'Name', key: 'name', width: 30 },  
            { header: 'Business Status', key: 'business_status', width: 15 },
            { header: 'User Ratings Total', key: 'user_ratings_total', width: 12},
            { header: 'Rating', key: 'rating', width: 7 },
            { header: 'Website', key: 'website', width: 50},
            { header: 'Phone Number', key: 'formatted_phone_number', width: 15},
            { header: 'Address', key: 'formatted_address', width: 50 },
            { header: 'Types', key: 'types', width: 25 },
        ];
        worksheet.addRows(places);
        return workbook.xlsx.writeFile('./results/' +keyword + location + '.xlsx');
    })
      .then(() => console.log('File written successfully.'))
      .catch(err => console.error(err));
  });

program.parse(process.argv);

module.exports.searchPlaces = searchPlaces;