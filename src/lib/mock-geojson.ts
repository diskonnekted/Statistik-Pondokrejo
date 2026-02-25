import { FeatureCollection } from "geojson";

export const PONDOKREJO_GEOJSON: FeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        name: "Dusun A",
        population: 1200,
        density: "High",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [110.4, -7.6],
            [110.41, -7.6],
            [110.41, -7.61],
            [110.4, -7.61],
            [110.4, -7.6],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Dusun B",
        population: 800,
        density: "Medium",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [110.41, -7.6],
            [110.42, -7.6],
            [110.42, -7.61],
            [110.41, -7.61],
            [110.41, -7.6],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Dusun C",
        population: 950,
        density: "Medium",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [110.4, -7.61],
            [110.41, -7.61],
            [110.41, -7.62],
            [110.4, -7.62],
            [110.4, -7.61],
          ],
        ],
      },
    },
     {
      type: "Feature",
      properties: {
        name: "Dusun D",
        population: 600,
        density: "Low",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [110.41, -7.61],
            [110.42, -7.61],
            [110.42, -7.62],
            [110.41, -7.62],
            [110.41, -7.61],
          ],
        ],
      },
    },
  ],
};
