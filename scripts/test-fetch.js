
const https = require('https');

const url = "https://pondokrejo.clasnet.co.id/idm";

console.log(`Fetching: ${url}`);

https.get(url, (res) => {
  console.log(`Status: ${res.statusCode}`);
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log(`Body length: ${data.length}`);
    console.log(`Preview: ${data.substring(0, 500)}...`);
  });
}).on('error', (e) => {
  console.error(`Error: ${e.message}`);
});
