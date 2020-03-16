/* eslint-disable no-console, no-process-exit */
const michelin = require('./michelin');
const maitre = require('./maitre');
'use strict';
const fs = require('fs');

async function michelin_to_json (searchLink = 'https://guide.michelin.com/fr/fr/restaurants/bib-gourmand/page/') {
  try {
    console.log(`browsing ${searchLink} source`);
    console.log('processing, wait ...');
    const restaurants_michelin = await michelin.scrapeRestaurants(searchLink);
    const jsonRest = [];

    for (let i = 0; i < restaurants_michelin.length;i++) {
      jsonRest.push(JSON.stringify(restaurants_michelin[i],null,2));
    }

    if (fs.existsSync('./michelin.json')) {
      fs.unlinkSync('./michelin.json')
    }

    fs.appendFileSync('./michelin.json',"[ \n");
    fs.appendFileSync('./michelin.json',jsonRest);
    fs.appendFileSync('./michelin.json',"]");
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}


async function maitre_rest(searchLink = 'https://www.maitresrestaurateurs.fr/annuaire/ajax/loadresult/#') {
  try {
    console.log(`browsing ${searchLink} source`);
    console.log('processing, wait ...');
    const restaurants_maitre = await maitre.scrapeRestaurantsMaitre(searchLink);
    console.log(restaurants_maitre);
    const jsonRest = [];
    for (let i = 0; i < restaurants_maitre.length;i++) {
      jsonRest.push(JSON.stringify(restaurants_maitre[i],null,2));
    }

    if (fs.existsSync('./maitre.json')) {
      fs.unlinkSync('./maitre.json')
    }

    fs.appendFileSync('./maitre.json',"[ \n");
    fs.appendFileSync('./maitre.json',jsonRest);
    fs.appendFileSync('./maitre.json',"]");
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}
const [,, searchLink] = process.argv;

function merge(){
  let rawdata_michelin = fs.readFileSync('michelin.json');
  let rawdata_maitre = fs.readFileSync('maitre.json');
  let michelin = JSON.parse(rawdata_michelin);
  let maitre = JSON.parse(rawdata_maitre);
  const merged = [];
  for(let i =0;i<michelin.length;i++)
  {
    for(let j =0;j<maitre.length;j++){
      if(michelin[i].name.toLowerCase()==maitre[j].toLowerCase()){
        merged.push(JSON.stringify(michelin[i],null,2));
        break;
      }
    }
  }
  if (fs.existsSync('./merged.json')) {
    fs.unlinkSync('./merged.json')
  }

  fs.appendFileSync('./merged.json',"[ \n");
  fs.appendFileSync('./merged.json',merged);
  fs.appendFileSync('./merged.json',"]");
}

//sandbox(searchLink);
//list_rest_maitre =  maitre_rest(searchLink);

//list_rest_michelin =  michelin_to_json(searchLink);


//merge();
