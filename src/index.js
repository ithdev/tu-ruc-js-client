const axios = require('axios').default;

const URL = 'https://turuc.com.py/api/contribuyente/search';

function getContribuyente (search){
  axios.get(`${URL}?search=${search}&page=0`)
  .then(function (response) {
    return response.data.data;
  })
  .catch(function (error) {
    console.log(error);
  })
}

module.exports = {
  getContribuyente
}
