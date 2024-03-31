let string = `<center><table><tr><th colspan='2' 
align='center'><em>Attributes<\/em><\/th><\/tr><tr bgcolor=\"#E3E3F3\"> <th>URL_PATH<\/th> 
<td>www.yoursingapore.com\/en\/see-do-singapore\/places-to-see\/bras-basah-bugis.html<\/td> <\/tr>
<tr bgcolor=\"\"> <th>IMAGE_PATH<\/th> <td>www.yoursingapore.com\/content\/dam\/desktop\/global\/see-do-singapore\/places-to-see\/bras-basah-bugis-carousel01-rect.jpg<\/td> <\/tr>
<tr bgcolor=\"#E3E3F3\"> <th>IMAGE_ALT_TEXT<\/th> <td>Thereâ€™s nowhere else quite like shopping at Bugis.<\/td> <\/tr>
<tr bgcolor=\"\"> <th>PHOTOCREDITS<\/th> <td><\/td> <\/tr>
<tr bgcolor=\"#E3E3F3\"> <th>PAGETITLE<\/th> <td>Bras Basah.Bugis, Singapore Cultural District<\/td> <\/tr>
<tr bgcolor=\"\"> <th>LASTMODIFIED<\/th> <td>2015-10-12T15:34:32.303+08:00<\/td> <\/tr>
<tr bgcolor=\"#E3E3F3\"> <th>LATITUDE<\/th> <td>1.301<\/td> <\/tr><tr bgcolor=\"\"> <th>LONGTITUDE<\/th> <td>103.85624<\/td> <\/tr>
<tr bgcolor=\"#E3E3F3\"> <th>ADDRESS<\/th> <td>220 Victoria Street<\/td> <\/tr><tr bgcolor=\"\"> <th>POSTALCODE<\/th> <td><\/td> <\/tr>
<tr bgcolor=\"#E3E3F3\"> <th>OVERVIEW<\/th> <td>The Bras Basah.Bugis Precinct is the arts and heritage district in Singapore's civic centre, and home to museums and monuments.<\/td> <\/tr>
<tr bgcolor=\"\"> <th>EXTERNAL_LINK<\/th> <td>http:\/\/www.brasbasahbugis.sg\/<\/td> <\/tr>
<tr bgcolor=\"#E3E3F3\"> <th>META_DESCRIPTION<\/th> <td>The Bras Basah.Bugis Precinct is the vibrant arts and cultural district in the heart of Singapore's civic centre, and home to top museums and monuments.<\/td> <\/tr>
<tr bgcolor=\"\"> <th>OPENING_HOURS<\/th> <td><\/td> <\/tr><tr bgcolor=\"#E3E3F3\"> <th>INC_CRC<\/th> <td>44132C4232BA16E5<\/td> <\/tr>
<tr bgcolor=\"\"> <th>FMEL_UPD_D<\/th> <td>20180619175243<\/td> <\/tr><\/table>
<\/center>`

function subStr(string, text, position) {
if(position=='b')
return string.substring(string.indexOf(text)+text.length);
else if(position=='a')
return string.substring(0, string.indexOf(text));
else
return string;
}


let first_processed_string = subStr(string,'<th>ADDRESS<\/th> <td>', 'b');
let second_processed_string = subStr(first_processed_string,'<\/td> <\/tr><tr bgcolor=\"\"> <th>','a');

console.log(second_processed_string);