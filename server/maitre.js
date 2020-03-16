const axios = require('axios');
const cheerio = require('cheerio');



module.exports.scrapeRestaurantsMaitre = async url => {
  const names = [];
  for(var i = 0;i<156;i++){
    let page = String(i);
    const reponse = await axios({
      method: 'post',
      url: url,
      data: 'page='+page+'&sort=undefined&request_id=ec830a0fb20e71279f65cd4fad4cb137&annuaire_mode=standard'
    });
    const {data, status} = reponse;
    const $ = cheerio.load(data);

    $('div.annuaire_single').each(function (index, element) {

      let name = $(element).find('a').text().trim();
      name = name.substring(0,sep= name.indexOf(' ('));
      names.push(name);
    });
  }
  return names;
};

module.exports.get = () => {
  return [];
};
