const BASE_API_URL = "https://api.foursquare.com/v3";
const API_KEY = "fsq3d3LjyCEbGabXxd80DhPXTZNZRAwY6MQ4ksMtawPdazQ="

async function search(lat, lng, searchTerms) {
    const response = await axios.get(`${BASE_API_URL}/places/search`, {
        params: {
            query: encodeURI(searchTerms), //encodeURI function to convert special characters to their encoded eqv so that query will be wellformed
            ll: lat + "," + lng,
            // categories:"13033",  // enable use of categories
            sort: "DISTANCE",
            radius: 5000,
            limit: 50

        },
        headers: {
            Accept: "application/json",
            // Provide the API key here
            Authorization: API_KEY
        }
    })
    return response.data;
}

async function getPhotoFromFourSquare(fsqId) {
    const response = await axios.get(`${BASE_API_URL}/places/${fsqId}/photos`, {
        headers: {
            Accept: "application/json",
            Authorization: API_KEY
        }
    });
    return response.data;
}