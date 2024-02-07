
async function search(near,item) {
  
    const response = await axios.get("https://api.foursquare.com/v3/places/search", {
        params: {query: item, near: near},
        headers: {
          accept: 'application/json',
          Authorization: 'fsq3v7Fdt3kRAiOlQLgRl3+BA95xwx+QyXRsFc2IszLSfZI='
        }
    });
    console.log(response.data);
  } 

