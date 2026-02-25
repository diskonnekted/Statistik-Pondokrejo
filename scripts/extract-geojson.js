/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, '../public/34.04_Sleman/34.04_kelurahan.geojson');
const outputPath = path.join(__dirname, '../public/pondokrejo.geojson');

try {
  const data = fs.readFileSync(inputPath, 'utf8');
  const geojson = JSON.parse(data);

  const pondokrejoFeature = geojson.features.find(
    (feature) => feature.properties.nm_kelurahan === 'Pondokrejo'
  );

  if (pondokrejoFeature) {
    const outputGeoJSON = {
      type: 'FeatureCollection',
      features: [pondokrejoFeature],
    };
    fs.writeFileSync(outputPath, JSON.stringify(outputGeoJSON, null, 2));
    console.log('Successfully extracted Pondokrejo GeoJSON to', outputPath);
  } else {
    console.error('Pondokrejo not found in the input file.');
  }
} catch (error) {
  console.error('Error processing GeoJSON:', error);
}
