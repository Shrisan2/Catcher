
import axios from 'axios'

const YELP_API_KEY = 'aBGcG29KMJls4jcMy6xFteszqv59puCP8Az4HdVDZqbS6UH59DU0nxbrwXID8w8I8RVkeKAHQcAa2jtaJCwpMDaa8UDA5rXB5_F1G71Ixdb9ovN6aftLM5MK00BJYXYx';

const api = axios.create({
  baseURL: 'https://api.yelp.com/v3',
  headers: {
    Authorization: `Bearer ${YELP_API_KEY}`,
  },
})

const getBaitShops = userLocation => {
  return api
    .get('/businesses/search', {
      params: {
        limit: 20,
        categories: 'huntingfishingsupplies,fishing',
        ...userLocation,
      },
    })
    .then(res =>
      res.data.businesses.map(business => {
        return {
          name: business.name,
          coords: business.coordinates,
        }
      })
    )
    .catch(error => console.error(error))
}

export default {
  getBaitShops,
}