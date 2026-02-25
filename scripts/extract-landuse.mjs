import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const turf = require('@turf/turf');

const PONDOKREJO_PATH = path.join(process.cwd(), 'src/lib/pondokrejo.json');
const LANDUSE_PATH = path.join(process.cwd(), 'public/landuse.geojson');
const OUTPUT_PATH = path.join(process.cwd(), 'src/lib/landuse-pondokrejo.json');

console.log("Starting extraction...");

try {
    const pondokrejo = JSON.parse(fs.readFileSync(PONDOKREJO_PATH, 'utf8'));
    const pondokrejoFeature = pondokrejo.features ? pondokrejo.features[0] : pondokrejo;
    
    // Buffer by 100m
    const buffer = turf.buffer(pondokrejoFeature, 0.1, { units: 'kilometers' });

    console.log(`Reading Landuse data from ${LANDUSE_PATH}...`);
    // This might take a while
    const landuseRaw = fs.readFileSync(LANDUSE_PATH, 'utf8');
    const landuse = JSON.parse(landuseRaw);
    console.log(`Loaded ${landuse.features.length} features.`);

    const filteredFeatures = [];
    let processed = 0;
    const total = landuse.features.length;

    console.log("Filtering features...");
    for (const feature of landuse.features) {
        processed++;
        if (processed % 10000 === 0) {
            process.stdout.write(`\rProcessed ${processed}/${total} features... Found: ${filteredFeatures.length}`);
        }
        
        try {
            if (turf.booleanIntersects(feature, buffer)) {
                filteredFeatures.push(feature);
            }
        } catch (e) {
            // Ignore invalid geometries
        }
    }
    console.log(`\nFinished processing. Found ${filteredFeatures.length} intersecting features.`);

    if (filteredFeatures.length > 0) {
        const outputCollection = {
            type: "FeatureCollection",
            features: filteredFeatures
        };
        console.log(`Writing to ${OUTPUT_PATH}...`);
        fs.writeFileSync(OUTPUT_PATH, JSON.stringify(outputCollection));
        console.log("Done.");
    } else {
        console.log("No features found. Skipping write.");
    }

} catch (e) {
    console.error("Error:", e);
}
