const  path = require('path');
const fs = require('fs');
var url = require('url');
const fetch = require('node-fetch');
const csvWriter = require('fast-csv');


const apiBaseUri = 'https://api-gateway.boats.com/api-boattrader-client/app/search/boat';
const apikey = '8b08b9bc353c494a80c60fb86debfc56';
const queryOptions = {
    apikey,
    country: 'US',
    facets: 'country,state,make,model,class,fuelType,hullMaterial,stateCity',
    fields: `id,make,model,year,specifications.dimensions.lengths.nominal.ft,specifications.dimensions.beam.ft,specifications.weights.dry.lb,location.address,aliases,price.hidden,price.type.amount.USD,portalLink,class,condition,date.created,type,fuelType,hull.material,propulsion.engines`,
    useMultiFacetedFacets: true,
    sort: 'modified-desc',
    price: '1-'
};

const headerOptions = {
    'User-Agent': 'Adok/NodeJS',
    'Host':'api-gateway.boats.com',
    'Accept-Encoding':'gzip, deflate',
    'Accept':'application/json',
    'ApplicationToken':'cwi01171019A-t101'
}


//console.log(url.format({query:queryOptions}));

/**
 * Fetches data and returns a json object
 * @param {number} page Page Number
 * @param {number} pageSize Page Size
 */
const fetchData = async (page, pageSize=10) => {
    console.log(`Fetching Data for ${page}`);
    let queryString = url.format({ query: { ...queryOptions, page, pageSize} });
    const apiData = await fetch(`${apiBaseUri}${queryString}`)
    .catch(err => console.error(`Error fetching Data ${err}`))
    .then(res => res.json())
    .catch(err => console.error(`Error serilizing Data ${err}`));

    const parsedData = apiData.search.records.map(boat => {
        let {
            id,
            condition,
            make,
            model,
            year,
            portalLink,
            type,
            fuelType,
        } = boat;

        let formatted =  {
            id,
            url: portalLink,
            type,
            boatClass:boat['class'],
            make,
            model,
            year,
            condition,
            length_ft: boat.specifications.dimensions.lengths && boat.specifications.dimensions.lengths.nominal.ft,
            beam_ft: boat.specifications.dimensions.beam && boat.specifications.dimensions.beam.ft,
            dryWeight_lb: boat.specifications.weights && boat.specifications.weights.dry.lb,
            created: boat.date.created,
            hullMaterial: boat.hull.material,
            fuelType,
            numEngines: boat.propulsion.engines.length,
            totalHP:null,
            maxEngineYear: null,
            minEngineYear: null,
            engineCategory:'',
            ...boat.location.address
        };

        if (boat.propulsion.engines && boat.propulsion.engines.length>0){

            formatted.totalHP = boat.propulsion.engines.reduce((acc, i) => { 
                    return !i.power? acc: acc + i.power.hp
                },
            0);
            
            const {min,max} = boat.propulsion.engines.reduce((acc, i) => 
            { 
                acc.max = acc.max > i.year ? acc.max:i.year;
                acc.min = acc.min < i.year ? acc.min : i.year;
                return acc;
            }, {min:2500,max:0});


            formatted.maxEngineYear = max;
            formatted.minEngineYear = min;

            formatted.engineCategory = boat.propulsion.engines.reduce((acc, i)=>{
                return acc === '' || acc === i.category ? i.category : 'multiple';
            },'');

        }

        return formatted;
    });

    return parsedData;
}
const startPage = 1;
const pageSize = 1000;
for (let page = startPage; page <=10; page++){
    let timeOut = (page - startPage)*20;
    setTimeout(async () => {
        let boats = await fetchData(page, pageSize).catch(err=>console.error(`Page ${page} error: ${err}`));
        console.log(`Fetched Data for page ${page}`);
        csvWriter.writeToPath(path.resolve(__dirname, `csv/newest/page-${page}.csv`), boats,
            { headers: true })
            .on('error', err => console.error(err))
            .on('finish', () => console.log(`Done writing page ${page}`));
    }, timeOut*1000);
}