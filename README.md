# Data Scraping - Boattrader.com
This repo contains code and data files related to scraping data from the website [BoatTrader](https://www.boattrader.com/). 
This was done as a part of the Final Project for Statistical Data Mining.

## Process
The data scraping is done using an API call. The API is advertised publically, however is used to display search results page.
The API Uri and associated query parameters can be found in the the script,[index.js](./index.js).

## Known limitations
The API can only return a maximum of 1000 results in a single query. A paging approach is used to retrieve more results. The API also has a maximum limit of 10,000 results in total (or 10 pages of 1000 results each). The later point is evidenced by the maximum number of pages on the search results being 357 with a page size of 28 results.

The process in the script uses the paged API query to get back 10,000 results. The ordering parameter can be used to retrieve a larger data set by changing the `sort` parameter between `modified-asc` and `modified-desc` to return back the 10,000 earliest and 10,000 latest updated records respectively.

## Returned Data and Parameters
The Data generated by the script is saved in a CSV format for each page. Each run of the script generates 10 csv files. The following parameters are returned.
- `id` - Unique ID for the record
- `url` - Boat Trader URL for the boat
- `type` -  Type of the boat
- `boatClass` -  Class of the boat
- `make` - Make of the Boat
- `model` - Model of the Boat
- `year` -  Year of the Boat
- `condition` -  New/Used
- `length_ft` - Nominal Length of the boat in ft
- `beam_ft` - Bean of the Boat in ft
- `dryWeight_lb` - Dry weight of the Boat in ft.
- `created` -  Date the posting was created
- `hullMaterial` -  Material of the Boat's Hull
- `fuelType` -  Fuel type of the Boat
- `numEngines` -  Number of Engines listed for the Boat
- `maxEngineYear` - Newest engine Year
- `minEngineYear` - Oldest Engine Year
- `totalHP` - Total Power of the Engines combines in HP
- `engineCategory` - Engine Category  ( note `multiple` is used when the engines are dissimilar)
- `city`
- `country` 
- `state` 
- `zip` 

## Usage of the Data
The script was run to get the 10,000 newest and 10,000 oldest updated records from the website. This data is available in the [newest](./csv/newest) and [oldest](./csv/oldest) folders respectively. Each folder has 10 page files with 1000 records each. These need to be merged before analysis. 
### Duplicate removal
It is possible that duplicates might exist after merging the data files. It is recommended to use the `id` and/or `url` columns to filter duplicates.

# Running the script

- Install all required dependencies : `npm i`
- Run script : `node index.js`


# Disclaimer
The code and data files in the repo are provided as is. The author of the repo provides no guarantee the script will work at a later date. The author further assumes no responsibility for misuse of data or scripts.

# Contribution
No pull requests will be accepted.