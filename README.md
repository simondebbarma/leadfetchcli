# Lead Fetch CLI
 
This is a command-line tool that uses the Google Maps API to search for places based on a keyword and location, and writes the results to an Excel file. Leverage the power of the Google Maps API to effortlessly extract potential leads and export them seamlessly into an Excel (.xlsx) file. This command-line tool streamlines the lead generation process, making it efficient and user-friendly. Empower your business development with LeadExtractor and turn valuable prospects into lasting connections.

## Installation

1. Clone the repository to your local machine.
2. Install the dependencies by running `npm install`.
3. Create a `.env` file in the root directory of the project and add your Google Maps API key:

    `GOOGLE_MAPS_API_KEY=your-google-maps-api-key`

4. Run `npm link` to create a global symlink to your project.

## Usage

You can use this tool from the terminal by running `leadfetch -k "keyword" -l "location"`. Replace "keyword" and "location" with any keyword and location you want.

For example, to search for restaurants in New York, you would run `leadfetch -k "restaurants" -l "New York"`.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)
