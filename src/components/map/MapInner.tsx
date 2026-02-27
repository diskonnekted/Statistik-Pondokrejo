"use client";

import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import PONDOKREJO_DATA from "@/lib/pondokrejo.json";
import LANDUSE_DATA from "@/lib/landuse-pondokrejo.json";
import L from "leaflet";
import { useEffect, useRef, useState } from "react";
import * as turf from "@turf/turf";

// Fix for default marker icon missing in Leaflet
const iconRetinaUrl = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png";
const iconUrl = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png";
const shadowUrl = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png";

// URLs for external data
const MERAPI_RADIUS_URL = "https://geoportal.slemankab.go.id/geoserver/geonode/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=geonode%3A3404_50k_ln_radius_jarak_merapi&outputFormat=application%2Fjson&srsName=EPSG:4326";
const IRIGASI_URL = "https://geoportal.slemankab.go.id/geoserver/geonode/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=geonode%3A_3404_50kb_ln_jaringan_irigasi_pu_esdm_2018&outputFormat=application%2Fjson&srsName=EPSG:4326";
const WIFI_URL = "https://geoportal.slemankab.go.id/geoserver/geonode/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=geonode%3A_3404_50kb_pt_sebaran_wifi_tahun_2022&outputFormat=application%2Fjson&srsName=EPSG:4326";
const JALAN_URL = "https://geoportal.slemankab.go.id/geoserver/geonode/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=geonode:jalan_ln&outputFormat=application/json&srsName=EPSG:4326";
const LIMBAH_URL = "https://geoportal.slemankab.go.id/geoserver/geonode/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=geonode:dddtlh_pengaturan_pengolahan_penguraian_limbah_r5_ar1&outputFormat=application/json&srsName=EPSG:4326";
const HAZARD_URL = "https://geoportal.slemankab.go.id/geoserver/geonode/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=geonode:kelas_multi_hazard_lb3_ar&outputFormat=application/json&srsName=EPSG:4326";
const RADIUS_LB3_URL = "https://geoportal.slemankab.go.id/geoserver/geonode/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=geonode:radius_bahaya_paparan_lb3_ar&outputFormat=application/json&srsName=EPSG:4326";

export default function MapInner({ showControls = false }: { showControls?: boolean }) {
  const mapRef = useRef<L.Map>(null);
  
  // Layer states
  const [showMerapi, setShowMerapi] = useState(false);
  const [merapiData, setMerapiData] = useState<any>(null);
  const [showIrigasi, setShowIrigasi] = useState(false);
  const [irigasiData, setIrigasiData] = useState<any>(null);
  const [showWifi, setShowWifi] = useState(false);
  const [wifiData, setWifiData] = useState<any>(null);
  const [showJalan, setShowJalan] = useState(false);
  const [jalanData, setJalanData] = useState<any>(null);
  
  // New Layers
  const [showLimbah, setShowLimbah] = useState(false);
  const [limbahData, setLimbahData] = useState<any>(null);
  const [showHazard, setShowHazard] = useState(false);
  const [hazardData, setHazardData] = useState<any>(null);
  const [showRadiusLB3, setShowRadiusLB3] = useState(false);
  const [radiusLB3Data, setRadiusLB3Data] = useState<any>(null);
  
  const [showLanduse, setShowLanduse] = useState(false);
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // @ts-expect-error - Leaflet icon fix
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl,
      iconUrl,
      shadowUrl,
    });
  }, []);

  // Fit bounds on mount
  useEffect(() => {
    // Small delay to ensure container is ready
    const timer = setTimeout(() => {
        if (mapRef.current && PONDOKREJO_DATA) {
            mapRef.current.invalidateSize();
            // @ts-expect-error - GeoJSON type mismatch
            const layer = L.geoJSON(PONDOKREJO_DATA);
            const bounds = layer.getBounds();
            
            // Apply a very tight fit
            mapRef.current.fitBounds(bounds, { 
                padding: [0, 0],
                maxZoom: 18,
                animate: false
            });
        }
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Fetch and filter data
  useEffect(() => {
    const fetchData = async () => {
      if ((showMerapi && !merapiData) || (showIrigasi && !irigasiData) || (showWifi && !wifiData) || (showJalan && !jalanData) || (showLimbah && !limbahData) || (showHazard && !hazardData) || (showRadiusLB3 && !radiusLB3Data)) {
        setLoading(true);
        try {
          const pondokrejoPolygon = PONDOKREJO_DATA.features[0] as any;

          // Create a buffered polygon for more inclusive filtering (100m buffer)
          const bufferedPolygon = turf.buffer(pondokrejoPolygon, 0.1, { units: 'kilometers' });
          const filterPolygon = bufferedPolygon || pondokrejoPolygon; // Fallback if buffer fails

          if (showMerapi && !merapiData) {
            setLoading(true);
            try {
              const res = await fetch(MERAPI_RADIUS_URL);
              const data = await res.json();
              console.log("Fetched Merapi Data:", data.features.length);
              setMerapiData(data);
            } catch (err) {
              console.error("Error fetching Merapi data:", err);
            }
          }

          if (showIrigasi && !irigasiData) {
            setLoading(true);
            try {
              const res = await fetch(IRIGASI_URL);
              const data = await res.json();
              console.log("Fetched Irigasi Data:", data.features.length);
              setIrigasiData(data);
            } catch (err) {
              console.error("Error fetching Irigasi data:", err);
            }
          }

          if (showWifi && !wifiData) {
            setLoading(true);
            try {
              const res = await fetch(WIFI_URL);
              const data = await res.json();
              console.log("Fetched WiFi Data:", data.features.length);
              setWifiData(data);
            } catch (err) {
              console.error("Error fetching WiFi data:", err);
            }
          }

          if (showJalan && !jalanData) {
            setLoading(true);
            try {
              const res = await fetch(JALAN_URL);
              const data = await res.json();
              console.log("Fetched Jalan Data:", data.features.length);
              setJalanData(data);
            } catch (err) {
              console.error("Error fetching Jalan data:", err);
            }
          }

          if (showLimbah && !limbahData) {
             setLoading(true);
             try {
                const res = await fetch(LIMBAH_URL);
                const data = await res.json();
                setLimbahData(data);
             } catch (err) {
                console.error("Error fetching Limbah data:", err);
             }
          }

          if (showHazard && !hazardData) {
             setLoading(true);
             try {
                const res = await fetch(HAZARD_URL);
                const data = await res.json();
                setHazardData(data);
             } catch (err) {
                console.error("Error fetching Hazard data:", err);
             }
          }

          if (showRadiusLB3 && !radiusLB3Data) {
             setLoading(true);
             try {
                const res = await fetch(RADIUS_LB3_URL);
                const data = await res.json();
                setRadiusLB3Data(data);
             } catch (err) {
                console.error("Error fetching Radius LB3 data:", err);
             }
          }

        } catch (error) {
          console.error("Error fetching map data:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    if (showControls) {
        fetchData();
    }
  }, [showMerapi, showIrigasi, showWifi, showJalan, showLimbah, showHazard, showRadiusLB3, merapiData, irigasiData, wifiData, jalanData, limbahData, hazardData, radiusLB3Data, showControls]);

  const style = () => {
    return {
      fillColor: '#3b82f6', // Blue color for the single region
      weight: 1,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.1
    };
  };

  const merapiStyle = {
    color: '#ef4444', // Red for Merapi radius
    weight: 3,
    opacity: 0.8
  };

  const irigasiStyle = {
    color: '#06b6d4', // Cyan for Irigasi
    weight: 2,
    opacity: 0.8
  };

  const wifiPointToLayer = (feature: any, latlng: L.LatLng) => {
    return L.circleMarker(latlng, {
        radius: 6,
        fillColor: "#eab308", // Yellow
        color: "#fff",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onEachFeature = (feature: any, layer: L.Layer) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const props = feature.properties as any;
    if (props && props.kalurahan) {
      layer.bindPopup(`
        <div class="p-2">
          <h3 class="font-bold text-lg">Kalurahan ${props.kalurahan}</h3>
          <p class="text-sm text-slate-500">Kapanewon Tempel, Kab. Sleman</p>
          <div class="mt-2 space-y-1">
             <div class="flex justify-between items-center gap-4">
               <span class="text-xs font-medium text-slate-500">Luas Wilayah</span>
               <span class="text-sm font-semibold">${props.luas ? Number(props.luas).toFixed(2) + ' Ha' : '-'}</span>
             </div>
             <div class="flex justify-between items-center gap-4">
               <span class="text-xs font-medium text-slate-500">Status IDM (2022)</span>
               <span class="text-sm font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">${props.status_idm_2022 || '-'}</span>
             </div>
             <div class="flex justify-between items-center gap-4">
                <span class="text-xs font-medium text-slate-500">Nilai IDM (2022)</span>
                <span class="text-sm font-semibold">${props.nilai_idm_2022 || '-'}</span>
              </div>
              <div class="flex justify-between items-center gap-4">
                <span class="text-xs font-medium text-slate-500">Kenaikan Skor</span>
                <span class="text-sm font-bold text-green-600">${props.kenaikan ? (Number(props.kenaikan) > 0 ? '+' : '') + props.kenaikan : '-'}</span>
              </div>
          </div>
        </div>
      `);
      
      layer.on({
        mouseover: (e) => {
            const layer = e.target;
            layer.setStyle({
                weight: 2,
                color: '#666',
                dashArray: '',
                fillOpacity: 0.3
            });
            layer.bringToFront();
        },
        mouseout: (e) => {
             const layer = e.target;
             layer.setStyle({
                fillColor: '#3b82f6',
                weight: 1,
                opacity: 1,
                color: 'white',
                dashArray: '3',
                fillOpacity: 0.1
             });
        },
        click: (e) => {
            const map = e.target._map;
            map.fitBounds(e.target.getBounds());
        }
      });
    }
  };

  const onWifiFeature = (feature: any, layer: L.Layer) => {
     const props = feature.properties;
     let popupContent = `<div class="p-2"><h3 class="font-bold">Titik WiFi</h3>`;
     if (props) {
         Object.keys(props).forEach(key => {
             if (key !== 'bbox' && key !== 'the_geom') {
                popupContent += `<p class="text-xs"><b>${key}:</b> ${props[key]}</p>`;
             }
         });
     }
     popupContent += `</div>`;
     layer.bindPopup(popupContent);
  };

  const jalanStyle = {
    color: '#f97316', // Orange
    weight: 2,
    opacity: 1
  };

  const onJalanFeature = (feature: any, layer: L.Layer) => {
    const props = feature.properties;
    let popupContent = `<div class="p-2"><h3 class="font-bold">Jalan Kabupaten</h3>`;
    if (props) {
        Object.keys(props).forEach(key => {
            if (key !== 'bbox' && key !== 'the_geom') {
               popupContent += `<p class="text-xs"><b>${key}:</b> ${props[key]}</p>`;
            }
        });
    }
    popupContent += `</div>`;
    layer.bindPopup(popupContent);
  };

  const limbahStyle = {
    color: '#8b5cf6', // Violet
    weight: 2,
    opacity: 1,
    fillOpacity: 0.5
  };

  const hazardStyle = {
    color: '#ef4444', // Red
    weight: 2,
    opacity: 1,
    fillOpacity: 0.5
  };

  const radiusLB3Style = {
    color: '#f43f5e', // Rose
    weight: 2,
    opacity: 1,
    fillOpacity: 0.3,
    dashArray: '5,5'
  };

  const landuseStyle = {
    color: '#10b981', // Emerald/Green
    weight: 2,
    opacity: 1,
    fillOpacity: 0.5,
    dashArray: '4,4'
  };

  const createPopup = (title: string) => (feature: any, layer: L.Layer) => {
    const props = feature.properties;
    let popupContent = `<div class="p-2"><h3 class="font-bold">${title}</h3>`;
    if (props) {
        Object.keys(props).forEach(key => {
            if (key !== 'bbox' && key !== 'the_geom') {
               popupContent += `<p class="text-xs"><b>${key}:</b> ${props[key]}</p>`;
            }
        });
    }
    popupContent += `</div>`;
    layer.bindPopup(popupContent);
  };

  return (
    <div className="relative h-full w-full">
        {/* Layer Controls */}
        {showControls && (
            <div className="absolute top-4 left-4 z-[1000] bg-white/95 backdrop-blur-sm p-3 rounded-lg shadow-xl border border-slate-200 max-h-[80vh] overflow-y-auto w-64">
        <h3 className="font-bold text-sm mb-3 flex items-center gap-2 text-slate-800">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
          Layer Peta
        </h3>
        <div className="space-y-1">
          <label className="flex items-center space-x-2 cursor-pointer hover:bg-slate-50 p-1 rounded">
            <input 
              type="checkbox" 
              checked={showMerapi} 
              onChange={(e) => setShowMerapi(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-medium">
              Radius Merapi
              {merapiData && <span className="text-xs text-muted-foreground ml-1">({merapiData.features.length})</span>}
            </span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer hover:bg-slate-50 p-1 rounded">
            <input 
              type="checkbox" 
              checked={showIrigasi} 
              onChange={(e) => setShowIrigasi(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-medium">
              Jaringan Irigasi
              {irigasiData && <span className="text-xs text-muted-foreground ml-1">({irigasiData.features.length})</span>}
            </span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer hover:bg-slate-50 p-1 rounded">
            <input 
              type="checkbox" 
              checked={showWifi} 
              onChange={(e) => setShowWifi(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-medium">
              Sebaran WiFi
              {wifiData && <span className="text-xs text-muted-foreground ml-1">({wifiData.features.length})</span>}
            </span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer hover:bg-slate-50 p-1 rounded">
            <input 
              type="checkbox" 
              checked={showJalan} 
              onChange={(e) => setShowJalan(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-medium">
              Jalan Kabupaten
              {jalanData && <span className="text-xs text-muted-foreground ml-1">({jalanData.features.length})</span>}
            </span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer hover:bg-slate-50 p-1 rounded">
            <input 
              type="checkbox" 
              checked={showLimbah} 
              onChange={(e) => setShowLimbah(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-medium">
              Pengolahan Limbah B3
              {limbahData && <span className="text-xs text-muted-foreground ml-1">({limbahData.features.length})</span>}
            </span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer hover:bg-slate-50 p-1 rounded">
            <input 
              type="checkbox" 
              checked={showHazard} 
              onChange={(e) => setShowHazard(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-medium">
              Multi Hazard LB3
              {hazardData && <span className="text-xs text-muted-foreground ml-1">({hazardData.features.length})</span>}
            </span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer hover:bg-slate-50 p-1 rounded">
            <input 
              type="checkbox" 
              checked={showRadiusLB3} 
              onChange={(e) => setShowRadiusLB3(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-medium">
              Radius Bahaya LB3
              {radiusLB3Data && <span className="text-xs text-muted-foreground ml-1">({radiusLB3Data.features.length})</span>}
            </span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer hover:bg-slate-50 p-1 rounded">
            <input 
              type="checkbox" 
              checked={showLanduse} 
              onChange={(e) => setShowLanduse(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-medium">
              Tata Guna Lahan
              <span className="text-xs text-muted-foreground ml-1">({LANDUSE_DATA.features.length})</span>
            </span>
          </label>
        </div>
        {loading && <p className="text-xs text-blue-500 mt-2 animate-pulse text-center font-medium">Memuat data...</p>}
      </div>
        )}

        <MapContainer
        center={[-7.658, 110.314]}
        zoom={14}
        style={{ height: "100%", width: "100%" }}
        ref={mapRef}
        zoomControl={false}
        scrollWheelZoom={true}
        doubleClickZoom={true}
        touchZoom={true}
        dragging={true}
        >
        <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {/* @ts-expect-error - PONDOKREJO_DATA is JSON but GeoJSON expects FeatureCollection type */}
        <GeoJSON data={PONDOKREJO_DATA} style={style} onEachFeature={onEachFeature} />
        
        {showControls && showMerapi && merapiData && (
            <GeoJSON data={merapiData} style={merapiStyle} />
        )}

        {showControls && showIrigasi && irigasiData && (
            <GeoJSON data={irigasiData} style={irigasiStyle} />
        )}

        {showControls && showWifi && wifiData && (
            <GeoJSON data={wifiData} pointToLayer={wifiPointToLayer} onEachFeature={onWifiFeature} />
        )}

        {showControls && showJalan && jalanData && (
            <GeoJSON data={jalanData} style={jalanStyle} onEachFeature={onJalanFeature} />
        )}

        {showControls && showLimbah && limbahData && (
            <GeoJSON data={limbahData} style={limbahStyle} onEachFeature={createPopup("Pengolahan Limbah B3")} />
        )}

        {showControls && showHazard && hazardData && (
            <GeoJSON data={hazardData} style={hazardStyle} onEachFeature={createPopup("Multi Hazard LB3")} />
        )}

        {showControls && showRadiusLB3 && radiusLB3Data && (
            <GeoJSON data={radiusLB3Data} style={radiusLB3Style} onEachFeature={createPopup("Radius Bahaya LB3")} />
        )}

        {showControls && showLanduse && (
            <GeoJSON data={LANDUSE_DATA as any} style={landuseStyle} onEachFeature={createPopup("Tata Guna Lahan")} />
        )}
        </MapContainer>
    </div>
  );
}
