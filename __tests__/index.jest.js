// FILEPATH: /home/simon/code/leadfetchcli/index.test.js
const googleMapsClient = require('@google/maps').createClient({
  key: process.env.GOOGLE_MAPS_API_KEY,
  Promise: Promise
});
const ExcelJS = require('exceljs');
const { searchPlaces } = require('../index'); // assuming the function is exported

jest.mock('@google/maps');
jest.mock('exceljs');

describe('searchPlaces', () => {
  it('should call googleMapsClient.places with correct parameters and return results', async () => {
    const mockPlaces = jest.fn().mockResolvedValue({
      json: {
        results: ['place1', 'place2']
      }
    });
    googleMapsClient.places = mockPlaces;

    const results = await searchPlaces('keyword', 'location');

    expect(mockPlaces).toHaveBeenCalledWith({
      query: 'keyword in location',
      language: 'en',
    });
    expect(results).toEqual(['place1', 'place2']);
  });
});

describe('commander program action', () => {
  it('should call searchPlaces and ExcelJS methods with correct parameters', async () => {
    const mockSearchPlaces = jest.fn().mockResolvedValue(['place1', 'place2']);
    const mockWorkbook = { addWorksheet: jest.fn(), xlsx: { writeFile: jest.fn() } };
    const mockAddWorksheet = jest.fn().mockReturnValue({ columns: [], addRows: jest.fn() });
    mockWorkbook.addWorksheet = mockAddWorksheet;
    ExcelJS.Workbook = jest.fn().mockReturnValue(mockWorkbook);

    // assuming the action function is exported and can be called directly
    await action({ keyword: 'keyword', location: 'location' });

    expect(mockSearchPlaces).toHaveBeenCalledWith('keyword', 'location');
    expect(ExcelJS.Workbook).toHaveBeenCalled();
    expect(mockAddWorksheet).toHaveBeenCalledWith('Google Maps Data');
    expect(mockWorkbook.addWorksheet().addRows).toHaveBeenCalledWith(['place1', 'place2']);
    expect(mockWorkbook.xlsx.writeFile).toHaveBeenCalledWith('GoogleMapsData.xlsx');
  });
});