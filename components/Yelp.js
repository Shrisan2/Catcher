
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
        limit: 30,
        categories: 'huntingfishingsupplies',
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

const getLakesNearby = userLocation => {
  return api
    .get('/businesses/search', {
      params: {
        limit: 10,
        categories: 'lakes',
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

const getParksNearby = userLocation => {
  return api
    .get('/businesses/search', {
      params: {
        limit: 10,
        categories: 'parks',
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
  getLakesNearby,
  getParksNearby,
}