const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Scrape each restaurants url
 * @param  {String}  url
 * @return {Object} urls
 */
const scrapeUrls = async url =>{
  var i=0;
  const urls=[];
  while(true){
    i++;
    const response = await axios(url+i);
    const {data, status} = response;
    const $ = cheerio.load(data);


    if (status >= 200 && status < 300) {
      const restTable = $('.restaurant__list-row>div.col-md-6');
      restTable.each(function(){
        const url = $(this).find('.link ').attr('href');
        urls.push(url);
      });
    }

    let numbers = $('.js-restaurant__stats > h1').text();
    numbers = numbers.replace(/\s/g, '');
    first= numbers.substring(0,3);
    last= numbers.substring(4,7);
    if(first == last){ break;}


  }
  return urls;
}
/**
 * parse Retaurants data
 * @param  {Object}  data
 * @return {Object} restaurants
 */
const parseRestaurant = data =>{
  const $ = cheerio.load(data);
  const image = $('.masthead__gallery-image-item').attr('data-image');
  const name = $('.section-main h2.restaurant-details__heading--title').text();
  const heading_list=[];
  $('.restaurant-details__heading--list>li').each(function () {
        heading_list.push($(this).text());
    });
  const localization = heading_list[0];
  let [street,city,zipcode,country] = localization.split(",")
  if(zipcode != undefined)
  {zipcode = zipcode.trim();}
  let experience = $('#experience-section > ul > li:nth-child(2)').text().trim();
  if(experience!=undefined)
  {experience = experience.substring(38);}
  let phone = $('[data-event="CTA_tel"]').attr('href');
  if(phone!= undefined){
  phone = phone.substring(3);}
  const link = $('[data-event="CTA_website"]').attr('href');
  return {name,localization,experience,image,link,phone,zipcode};
}


const scrapeRest = async url =>{

    const response = await axios(url);
    const {data, status} = response;
    if (status >= 200 && status < 300) {
      return parseRestaurant(data);
    }
    console.error(status);
    return null;

}

/**
 * Scrape a given restaurant url
 * @param  {String}  url
 * @return {Object} restaurants
 */
module.exports.scrapeRestaurants = async url => {
  const URLS =  await scrapeUrls(url);
  let url_;
  const restaurants = [];
  for(let i=0;i<URLS.length;i++){
    url_ = "https://guide.michelin.com"+URLS[i];
    restaurants.push(await scrapeRest(url_));
  }
  return restaurants;
};

/**
 * Get all France located Bib Gourmand restaurants
 * @return {Array} restaurants
 */
module.exports.get = () => {
  return [];
};
