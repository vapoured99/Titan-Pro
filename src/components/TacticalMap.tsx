import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { 
  APIProvider, 
  Map, 
  AdvancedMarker, 
  Pin, 
  InfoWindow, 
  useMap, 
  useMapsLibrary, 
  useAdvancedMarkerRef 
} from '@vis.gl/react-google-maps';
import { 
  motion, 
  AnimatePresence 
} from 'motion/react';
import { 
  Compass, 
  MapPin, 
  Search, 
  Flame, 
  RotateCw, 
  Play, 
  Square, 
  Check, 
  Loader2, 
  Navigation, 
  Sparkles, 
  TrendingUp, 
  Layers,
  Locate,
  Trees,
  Footprints,
  Tent,
  Castle,
  Timer,
  Trash2,
  Plus,
  X,
  List,
  Save,
  Upload
} from 'lucide-react';
import { 
  db, 
  auth, 
  doc, 
  setDoc, 
  serverTimestamp, 
  onSnapshot,
  onAuthStateChanged,
  collection,
  deleteDoc,
  handleFirestoreError
} from '../lib/firebase';

const API_KEY: string = 'AIzaSyCYJg6XySBcT9cX6hFkZYxvRF4RMbCf2WU';

const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

// High-tech dark-mode map style configurations matching the Gym aesthetic
const tacticalMinimalDarkStyles = [
  { elementType: "geometry", stylers: [{ color: "#0a0a0c" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#000000" }, { weight: 2 }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#e2e8f0" }] },
  {
    featureType: "administrative",
    elementType: "geometry.stroke",
    stylers: [{ color: "#334155" }]
  },
  {
    featureType: "administrative.land_parcel",
    elementType: "labels.text.fill",
    stylers: [{ color: "#64748b" }]
  },
  {
    featureType: "landscape.natural",
    elementType: "geometry",
    stylers: [{ color: "#020617" }]
  },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [{ color: "#0f172a" }]
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#38bdf8" }]
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#14532d" }, { opacity: 0.15 }]
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#4ade80" }]
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#1e293b" }]
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#0f172a" }]
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#94a3b8" }]
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#334155" }]
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#1e293b" }]
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [{ color: "#cbd5e1" }]
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#0d0e12" }]
  },
  {
    featureType: "transit.station",
    elementType: "labels.text.fill",
    stylers: [{ color: "#a855f7" }]
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#030712" }]
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#1d4ed8" }]
  }
];

// Tactical Preset Trails for direct demo & exploration
const PRESET_TRAILS = [
  {
    id: 'lochnagar_summit',
    name: 'Lochnagar: High Mountain Path',
    category: 'hike',
    origin: { lat: 56.9535, lng: -3.1530 },
    destination: { lat: 56.9565, lng: -3.2425 },
    originText: 'Glen Muick Spittal',
    destinationText: 'Lochnagar Summit Crest',
    difficulty: 'HARD',
    kcalEstPerKm: 98,
    details: 'A magnificent, challenging mountain trail scaling the high heather fields and dramatic rock amphitheater of Lochnagar on AllTrails.',
    trailType: 'Rugged Munro Mountain Hike'
  },
  {
    id: 'balmoral_cairns',
    name: "Prince Albert's Pyramid Cairn Walk",
    category: 'hike',
    origin: { lat: 57.0392, lng: -3.2088 },
    destination: { lat: 57.0274, lng: -3.2185 },
    originText: 'Crathie Stone Bridge',
    destinationText: 'Balmoral Pyramid Monument',
    difficulty: 'MEDIUM',
    kcalEstPerKm: 85,
    details: 'A steep woodland trail ascending the historic pine slopes within the Royal Balmoral Estate to reach the striking stone pyramid on AllTrails.',
    trailType: 'Royal Commemorative Trail'
  },
  {
    id: 'dunnottar_coastal_walk',
    name: 'Stonehaven to Dunnottar Coastal Path',
    category: 'hike',
    origin: { lat: 56.9605, lng: -2.2033 },
    destination: { lat: 56.9458, lng: -2.1995 },
    originText: 'Stonehaven Old Harbour',
    destinationText: 'Dunnottar Castle Cliffside Entrance',
    difficulty: 'EASY',
    kcalEstPerKm: 76,
    details: 'A spectacularly scenic cliff-edge trail with dramatic ocean breezes leading directly to the iconic medieval fortress on AllTrails.',
    trailType: 'Ocean-Facing Historic Track'
  },
  {
    id: 'burn_o_vat_circular',
    name: "Muir of Dinnet: Burn o' Vat Loop",
    category: 'hike',
    origin: { lat: 57.0865, lng: -2.9390 },
    destination: { lat: 57.0875, lng: -2.9460 },
    originText: 'Muir of Dinnet Visitor Centre',
    destinationText: 'Burn o Vat Cave Entryway',
    difficulty: 'EASY',
    kcalEstPerKm: 70,
    details: 'An easy woodland walk with birch groves leading to a deep glacial geological giant pothole cave on AllTrails.',
    trailType: 'Glacial Cave Woodland Trail'
  },
  {
    id: 'scolty_tower_hike',
    name: 'Scolty Hill: Monument Tower Climb',
    category: 'hike',
    origin: { lat: 57.0425, lng: -2.5020 },
    destination: { lat: 57.0375, lng: -2.5055 },
    originText: 'Scolty Base Forest Lot',
    destinationText: 'Scolty Memorial Tower Peak',
    difficulty: 'MEDIUM',
    kcalEstPerKm: 81,
    details: 'A beautiful coniferous pine forest walk ascending directly to the historic 1840 memorial stone tower overlooking River Dee on AllTrails.',
    trailType: 'Pine Forest Hill Ascent'
  },
  {
    id: 'clachnaben_granite_tor',
    name: 'Clachnaben: Granite Tor Track',
    category: 'hike',
    origin: { lat: 56.9688, lng: -2.5775 },
    destination: { lat: 56.9535, lng: -2.6010 },
    originText: 'Clachnaben Quarry Parking B974',
    destinationText: 'Clachnaben Summit Tor Peak',
    difficulty: 'HARD',
    kcalEstPerKm: 89,
    details: 'A rugged moorland trail climbing stairs through extensive heather carpets to reach the distinctive granite rocky summit on AllTrails.',
    trailType: 'Stony Highland Tor Climb'
  },
  {
    id: 'craigievar_castle_walk',
    name: 'Craigievar Castle: Pink Estate Circuit',
    category: 'hike',
    origin: { lat: 57.1742, lng: -2.7198 },
    destination: { lat: 57.1700, lng: -2.7290 },
    originText: 'Craigievar Visitor Gatehouse',
    destinationText: 'Upper Estate Parkland Loop',
    difficulty: 'EASY',
    kcalEstPerKm: 68,
    details: 'A magical estate walk exploring peaceful deciduous woodland and wildflower meadows encircling the iconic pink castle on AllTrails.',
    trailType: 'Historical Castle Parkland'
  },
  {
    id: 'forvie_reserve_dunes',
    name: 'Forvie NNR: Newburgh Sands & Ruins',
    category: 'hike',
    origin: { lat: 57.3205, lng: -1.9968 },
    destination: { lat: 57.3325, lng: -1.9750 },
    originText: 'River Ythan Beach Parking',
    destinationText: 'Forvie Church Sandy Ruins',
    difficulty: 'MEDIUM',
    kcalEstPerKm: 78,
    details: 'A spectacular wilderness walk across vast sand dunes, coastal cliffs, and the ruins of a 12th-century church sunken in sand on AllTrails.',
    trailType: 'Wild Coastal Sand Dunes'
  },
  {
    id: 'morven_deeside_climb',
    name: 'Morven: Deeside Graham Mountain Peak',
    category: 'hike',
    origin: { lat: 57.1402, lng: -2.9835 },
    destination: { lat: 57.1215, lng: -3.0310 },
    originText: 'Morven Trailhead Off B9119',
    destinationText: 'Morven High Stony Summit',
    difficulty: 'HARD',
    kcalEstPerKm: 94,
    details: 'A challenging, open highland scramble up the heather ridges and high stone domes of Morven, offering epic panoramas on AllTrails.',
    trailType: 'Open Heather Highland Munro'
  },
  {
    id: 'tap_o_noth_fort',
    name: "Tap o' Noth: Ancient Vitrified Fort Walk",
    category: 'hike',
    origin: { lat: 57.3375, lng: -2.8420 },
    destination: { lat: 57.3450, lng: -2.8540 },
    originText: 'Rhynie Base Forest Road',
    destinationText: 'Tap o Noth Stone Ramparts',
    difficulty: 'MEDIUM',
    kcalEstPerKm: 83,
    details: 'An archaeological hill walk to Scotland’s second highest prehistoric vitrified stone fort ruins, perched atop a steep cone on AllTrails.',
    trailType: 'Prehistoric Fortress Ascent'
  },
  {
    id: 'newburgh_seal_view',
    name: 'Newburgh Seal Beach & Estuary Loop',
    category: 'hike',
    origin: { lat: 57.3175, lng: -2.0010 },
    destination: { lat: 57.3195, lng: -1.9890 },
    originText: 'Ythan River Estuary Point',
    destinationText: 'Newburgh Sandy Seal Lookout',
    difficulty: 'EASY',
    kcalEstPerKm: 66,
    details: 'A level walk along the sandy shore, offering close views of hundreds of hauled-out grey seals resting across the River Ythan on AllTrails.',
    trailType: 'Estuary Wildlife Shoreline'
  },
  {
    id: 'linn_of_dee_quoich',
    name: 'Linn of Dee & River Quoich Pines',
    category: 'hike',
    origin: { lat: 56.9890, lng: -3.4835 },
    destination: { lat: 57.0020, lng: -3.4475 },
    originText: 'Linn of Dee Historic Bridge',
    destinationText: 'Water of Quoich Punch Bowl',
    difficulty: 'MEDIUM',
    kcalEstPerKm: 75,
    details: 'A beautiful riverside forest trail following deep canyons, mountain torrents, and gorgeous remnants of the Caledonian pine woods on AllTrails.',
    trailType: 'Wild River Caledonian Woods'
  },
  {
    id: 'mount_keen_esk_trail',
    name: 'Mount Keen Munro: Glen Esk Path',
    category: 'hike',
    origin: { lat: 56.8967, lng: -2.9094 },
    destination: { lat: 56.9698, lng: -2.9736 },
    originText: 'Auchronie Car Park (Glen Esk)',
    destinationText: 'Mount Keen Munro Summit Peak',
    difficulty: 'HARD',
    kcalEstPerKm: 96,
    details: 'A dramatic, remote highland path climbing past tumbling rivers towards Scotland’s easternmost Munro peak on AllTrails.',
    trailType: 'Remote Munro Wilderness Hike'
  },
  {
    id: 'crathes_coy_burn_new',
    name: 'Crathes Castle: Coy Burn Forest Walk',
    category: 'hike',
    origin: { lat: 57.0620, lng: -2.4395 },
    destination: { lat: 57.0583, lng: -2.4452 },
    originText: 'Crathes Castle Main Gate',
    destinationText: 'Coy Burn Streamway Loop',
    difficulty: 'EASY',
    kcalEstPerKm: 67,
    details: 'A peaceful, mossy estate trail following the lovely Coy Burn river under huge historical oak trees and garden ponds on AllTrails.',
    trailType: 'Historical Estate Streamway'
  },
  {
    id: 'arbuthnott_bervie_loop',
    name: 'Arbuthnott Water: Bervie Stream Walk',
    category: 'hike',
    origin: { lat: 56.8435, lng: -2.3360 },
    destination: { lat: 56.8375, lng: -2.3275 },
    originText: 'Arbuthnott Historic Parish',
    destinationText: 'River Bervie Sandy Crossing',
    difficulty: 'EASY',
    kcalEstPerKm: 71,
    details: 'A lovely countryside woodland loop following the peaceful bends of the Bervie Water stream through deep historic Aberdeenshire fields on AllTrails.',
    trailType: 'Country Riverbank Woodland'
  },
  {
    id: 'kincardine_oneil_deeside',
    name: 'Kincardine O’Neil: Deeside Way Woods',
    category: 'hike',
    origin: { lat: 57.0838, lng: -2.6780 },
    destination: { lat: 57.0705, lng: -2.6685 },
    originText: "Kincardine O'Neil Old Hall",
    destinationText: 'River Dee Forest Bank',
    difficulty: 'MEDIUM',
    kcalEstPerKm: 73,
    details: 'A charming historical walk combining sections of the Victorian Deeside railway route and riverbank paths on AllTrails.',
    trailType: 'Historical Railway & Forestbank'
  },
  {
    id: 'loch_skene_sanctuary',
    name: 'Loch of Skene: Forest Sanctuary Trail',
    category: 'hike',
    origin: { lat: 57.1585, lng: -2.3335 },
    destination: { lat: 57.1650, lng: -2.3480 },
    originText: 'Garlogie Old Wood Gate',
    destinationText: 'Loch of Skene Lakeside Overlook',
    difficulty: 'EASY',
    kcalEstPerKm: 69,
    details: 'A peaceful, leafy path traversing quiet woodlands and farmland leading to viewpoints over the vast Skene bird sanctuary on AllTrails.',
    trailType: 'Bird Sanctuary Lakeside Path'
  }
];

export const getCategoryIconDetails = (catType: string | null) => {
  switch (catType) {
    case 'hike':
      return { icon: Footprints, color: '#f97316', text: 'Aberdeenshire Hike' };
    case 'parks':
      return { icon: Trees, color: '#22c55e', text: 'Parks & Woods' };
    case 'trails':
      return { icon: Footprints, color: '#f97316', text: 'Running Trails' };
    case 'historical':
      return { icon: Castle, color: '#a855f7', text: 'Historic Monuments' };
    default:
      return { icon: MapPin, color: '#f59e0b', text: 'Tactical Scout' };
  }
};

// Robust helper to safely read latitude and longitude from any Google Maps representation
export const getSafeLatLng = (location: any): google.maps.LatLngLiteral => {
  if (!location) return { lat: 0, lng: 0 };
  const lat = typeof location.lat === 'function' ? location.lat() : Number(location.lat);
  const lng = typeof location.lng === 'function' ? location.lng() : Number(location.lng);
  return { lat, lng };
};

// MapRefresher: Smoothly center/pan the Google Map on update without restricting drag gestures
export function MapRefresher({ center }: { center: google.maps.LatLngLiteral }) {
  const map = useMap();
  useEffect(() => {
    if (map && center && typeof center.lat === 'number' && typeof center.lng === 'number') {
      map.panTo(center);
    }
  }, [map, center]);
  return null;
}

// Component to handle text-query searches for local trails
interface LocalPlacesSearchProps {
  query: string;
  onPlacesFound: (places: google.maps.places.Place[]) => void;
  setSearchLoading: (loading: boolean) => void;
}

function LocalPlacesSearch({ query, onPlacesFound, setSearchLoading }: LocalPlacesSearchProps) {
  const placesLib = useMapsLibrary('places');
  const map = useMap();

  useEffect(() => {
    if (!placesLib || !map || !query) return;

    setSearchLoading(true);
    placesLib.Place.searchByText({
      textQuery: query,
      fields: ['id', 'displayName', 'location', 'formattedAddress'],
      maxResultCount: 10,
    })
      .then(({ places }) => {
        if (places) {
          onPlacesFound(places);
          if (places.length > 0 && places[0].location) {
            const locObj = getSafeLatLng(places[0].location);
            map.setCenter(locObj);
            map.setZoom(14);
          }
        }
        setSearchLoading(false);
      })
      .catch(err => {
        console.error("Local search failed:", err);
        setSearchLoading(false);
      });
  }, [placesLib, map, query]);

  return null;
}

// Component to handle calculating and drawing the path using standard Route API or OpenRouteService API
interface RouteTrackerProps {
  origin: google.maps.LatLngLiteral | null;
  destination: google.maps.LatLngLiteral | null;
  middleWaypoints: google.maps.LatLngLiteral[];
  shouldLoopBack: boolean;
  onStatsCalibrated: (dist: string, dur: string, pathPoints: google.maps.LatLngLiteral[]) => void;
  routingEngine?: 'google' | 'openrouteservice';
}

function RouteTracker({ origin, destination, middleWaypoints, shouldLoopBack, onStatsCalibrated, routingEngine = 'openrouteservice' }: RouteTrackerProps) {
  const map = useMap();
  const routesLib = useMapsLibrary('routes');
  const polylinesRef = useRef<google.maps.Polyline[]>([]);

  // Safely serialize array for dependency safety
  const waypointsSerialized = JSON.stringify(middleWaypoints);

  useEffect(() => {
    let active = true;

    if (!map) return;

    // Remove previous polylines
    polylinesRef.current.forEach(polyline => polyline.setMap(null));
    polylinesRef.current = [];

    if (!origin || !destination) {
      onStatsCalibrated('0.00 KM', '0 MINS', []);
      return;
    }

    const calculateGoogleRoute = () => {
      if (!routesLib) return;

      const intermediates: any[] = [];
      middleWaypoints.forEach(wp => {
        intermediates.push({
          location: wp,
          via: false
        });
      });

      let reqDestination = destination;
      const isSame = Math.abs(origin.lat - destination.lat) < 0.00001 && Math.abs(origin.lng - destination.lng) < 0.00001;

      if (shouldLoopBack) {
        reqDestination = origin;
        if (!isSame) {
          intermediates.push({
            location: destination,
            via: false
          });
        }
      }

      const request: any = {
        origin,
        destination: reqDestination,
        travelMode: 'WALKING',
        fields: ['path', 'distanceMeters', 'durationMillis', 'viewport']
      };

      if (intermediates.length > 0) {
        request.intermediates = intermediates;
      }

      routesLib.Route.computeRoutes(request)
        .then(({ routes }) => {
          if (!active) return;
          if (routes && routes[0]) {
            const route = routes[0];
            const newPolylines = typeof route.createPolylines === 'function' ? route.createPolylines() : null;
            if (newPolylines && Array.isArray(newPolylines)) {
              newPolylines.forEach(p => {
                if (p) {
                  p.setOptions({
                    strokeColor: '#f97316',
                    strokeOpacity: 0.85,
                    strokeWeight: 6,
                  });
                  p.setMap(map);
                }
              });
              polylinesRef.current = newPolylines;
            } else if (route.path) {
              const rawCoords: any[] = [];
              route.path.forEach((pos: any) => {
                if (pos) {
                  rawCoords.push({ lat: pos.lat, lng: pos.lng });
                }
              });
              const fallbackPolyline = new google.maps.Polyline({
                path: rawCoords,
                geodesic: true,
                strokeColor: '#f97316',
                strokeOpacity: 0.85,
                strokeWeight: 6,
                map: map
              });
              polylinesRef.current = [fallbackPolyline];
            }

            const distanceKm = route.distanceMeters ? (route.distanceMeters / 1000).toFixed(2) + ' KM' : 'N/A';
            const durationVal = typeof route.durationMillis === 'string' 
              ? parseInt(route.durationMillis) 
              : (route.durationMillis as number || 0);

            const durationMins = durationVal ? Math.ceil(durationVal / 60000) + ' MINS' : 'N/A';

            const pathPoints: google.maps.LatLngLiteral[] = [];
            if (route.path) {
              route.path.forEach(pos => {
                if (pos) {
                  pathPoints.push({ lat: pos.lat, lng: pos.lng });
                }
              });
            }

            onStatsCalibrated(distanceKm, durationMins, pathPoints);

            if (route.viewport) {
              map.fitBounds(route.viewport);
            }
          }
        })
        .catch(err => {
          if (!active) return;
          console.error("Google maps fallback failed:", err);
        });
    };

    if (routingEngine === 'openrouteservice') {
      const allCoords: google.maps.LatLngLiteral[] = [];
      allCoords.push(origin);
      middleWaypoints.forEach(wp => {
        allCoords.push({ lat: wp.lat, lng: wp.lng });
      });

      let reqDestination = destination;
      const isSame = Math.abs(origin.lat - destination.lat) < 0.00001 && Math.abs(origin.lng - destination.lng) < 0.00001;

      if (shouldLoopBack) {
        reqDestination = origin;
        if (!isSame) {
          allCoords.push(destination);
        }
      }
      allCoords.push(reqDestination);

      fetch("/api/openrouteservice/directions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          coordinates: allCoords,
          profile: "foot-hiking"
        })
      })
        .then(res => {
          if (!active) throw new Error("cancelled");
          if (!res.ok) {
            throw new Error(`OpenRouteService responded with status ${res.status}`);
          }
          return res.json();
        })
        .then(data => {
          if (!active) return;
          if (data && data.features && data.features[0]) {
            const feature = data.features[0];
            const geom = feature.geometry;
            const props = feature.properties;
            const summary = props ? props.summary : null;

            const pathPoints: google.maps.LatLngLiteral[] = [];
            if (geom && geom.coordinates) {
              geom.coordinates.forEach((coord: [number, number]) => {
                pathPoints.push({ lat: coord[1], lng: coord[0] });
              });
            }

            const distanceMKey = summary ? summary.distance : 0;
            const distanceKm = distanceMKey ? (distanceMKey / 1000).toFixed(2) + ' KM' : 'N/A';

            const durationSKey = summary ? summary.duration : 0;
            const durationMins = durationSKey ? Math.ceil(durationSKey / 60) + ' MINS' : 'N/A';

            const line = new google.maps.Polyline({
              path: pathPoints,
              geodesic: true,
              strokeColor: '#f97316', // Hike indicator color
              strokeOpacity: 0.85,
              strokeWeight: 6,
              map: map
            });
            polylinesRef.current = [line];

            onStatsCalibrated(distanceKm, durationMins, pathPoints);

            if (pathPoints.length > 0) {
              const bounds = new google.maps.LatLngBounds();
              pathPoints.forEach(pt => bounds.extend(pt));
              map.fitBounds(bounds);
            }
          } else {
            throw new Error("No features returned in OpenRouteService directions response");
          }
        })
        .catch(err => {
          if (!active) return;
          if (err.message === "cancelled") return;
          console.warn("OpenRouteService failed, falling back to Google Maps:", err);
          calculateGoogleRoute();
        });
    } else {
      calculateGoogleRoute();
    }

    return () => {
      active = false;
      polylinesRef.current.forEach(p => p.setMap(null));
      polylinesRef.current = [];
    };
  }, [routesLib, map, origin, destination, waypointsSerialized, shouldLoopBack, routingEngine, onStatsCalibrated]);

  return null;
}

export default function TacticalMap() {
  const [localApiKey, setLocalApiKey] = useState<string>(() => {
    return localStorage.getItem('gym_google_maps_key') || '';
  });
  const [dynamicApiKey, setDynamicApiKey] = useState<string>(API_KEY);
  const [isKeyLoading, setIsKeyLoading] = useState<boolean>(false);

  useEffect(() => {
    // API key is statically assigned for instant loading and reliability.
    setDynamicApiKey(API_KEY);
    setIsKeyLoading(false);
  }, []);

  const [activePreset, setActivePreset] = useState<typeof PRESET_TRAILS[0] | null>(null);
  const [customOrigin, setCustomOrigin] = useState<google.maps.LatLngLiteral | null>(null);
  const [customDestination, setCustomDestination] = useState<google.maps.LatLngLiteral | null>(null);
  
  // Custom intermediate waypoints and loop back option states
  const [shouldLoopBack, setShouldLoopBack] = useState<boolean>(true);
  const [middleWaypoints, setMiddleWaypoints] = useState<google.maps.LatLngLiteral[]>([]);
  const [routingEngine, setRoutingEngine] = useState<'google' | 'openrouteservice'>('openrouteservice');

  // Fields for saving route to directory
  const [saveRouteName, setSaveRouteName] = useState<string>('');
  const [saveRouteDifficulty, setSaveRouteDifficulty] = useState<'EASY' | 'MEDIUM' | 'HARD'>('MEDIUM');
  const [saveRouteType, setSaveRouteType] = useState<string>('Custom Workout Path');
  const [saveRouteDetails, setSaveRouteDetails] = useState<string>('');
  const [saveStatus, setSaveStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);


  // State from computed path routes
  const [routeDistance, setRouteDistance] = useState<string>('0.00 KM');
  const [routeDuration, setRouteDuration] = useState<string>('0 MINS');
  const [pathPoints, setPathPoints] = useState<google.maps.LatLngLiteral[]>([]);

  // Search places states
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSearch, setActiveSearch] = useState('');
  const [foundPlaces, setFoundPlaces] = useState<google.maps.places.Place[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  // Active custom waypoint picker modes
  const [waypointMode, setWaypointMode] = useState<'NONE' | 'ORIGIN' | 'DESTINATION' | 'WAYPOINT'>('NONE');

  // Simulation runner animation states
  const [isPlayingSimulation, setIsPlayingSimulation] = useState(false);
  const [simulatedLatLng, setSimulatedLatLng] = useState<google.maps.LatLngLiteral | null>(null);
  const simulationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const currentStepIndexRef = useRef<number>(0);

  // Initial safe load of trails
  const [allTrails, setAllTrails] = useState<typeof PRESET_TRAILS>(() => {
    const saved = localStorage.getItem('tactical_custom_routes');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const sanitized = parsed.filter(t => t && typeof t.id === 'string');
          return [...PRESET_TRAILS, ...sanitized];
        }
      } catch (e) {
        console.error(e);
      }
    }
    return PRESET_TRAILS;
  });

  // Active Trail Tracking States
  const [userWeight, setUserWeight] = useState<number>(75);
  const [isTrailActive, setIsTrailActive] = useState<boolean>(false);
  const [trailElapsedTime, setTrailElapsedTime] = useState<number>(0);
  const [trailDistanceCovered, setTrailDistanceCovered] = useState<number>(0);
  const [trailCaloriesBurned, setTrailCaloriesBurned] = useState<number>(0);
  const [isLoggingToSession, setIsLoggingToSession] = useState<boolean>(false);
  const [loggedToActiveSession, setLoggedToActiveSession] = useState<boolean>(false);
  const [trailCompleted, setTrailCompleted] = useState<boolean>(false);
  const trailTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Synchronized user, status, error states for premium military-grade vector directory backup
  const [currentUser, setCurrentUser] = useState<any>(null);
  const serverRoutesRef = useRef<any[]>([]);

  // Real-time synchronization of bodyweight settings and account-specific custom routes directory from Firestore
  useEffect(() => {
    let unsubscribeSnap: (() => void) | null = null;
    let unsubscribeCustomRoutes: (() => void) | null = null;
    
    // Fetch server-side hardcoded routes first
    fetch('/api/hardcoded-routes')
      .then(res => res.json())
      .then(serverRoutes => {
        if (Array.isArray(serverRoutes)) {
          serverRoutesRef.current = serverRoutes;
          
          // Inject these hardcoded routes into view immediately
          setAllTrails(prev => {
            const routeMap = new globalThis.Map();
            // Official presets
            PRESET_TRAILS.forEach(t => {
              if (t && t.id) routeMap.set(t.id, t);
            });
            // Sever-side hardcoded paths
            serverRoutes.forEach(t => {
              if (t && t.id) routeMap.set(t.id, t);
            });
            // Retain any existing browser state
            if (Array.isArray(prev)) {
              prev.forEach(t => {
                if (t && t.id && !routeMap.has(t.id)) routeMap.set(t.id, t);
              });
            }
            return Array.from(routeMap.values());
          });
        }
      })
      .catch(err => console.warn("Failed to preload hardcoded routes from server disk:", err));

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      
      // Clear previous snapshot settings/routes listeners
      if (unsubscribeSnap) {
        unsubscribeSnap();
        unsubscribeSnap = null;
      }
      if (unsubscribeCustomRoutes) {
        unsubscribeCustomRoutes();
        unsubscribeCustomRoutes = null;
      }
      
      if (!user) {
        setUserWeight(75);
        // Fallback: Restore custom routes from localStorage when signed out / offline
        const saved = localStorage.getItem('tactical_custom_routes');
        const routeMap = new globalThis.Map<string, any>();
        
        // 1. Base PRESET_TRAILS
        PRESET_TRAILS.forEach(t => {
          if (t && t.id) routeMap.set(t.id, t);
        });
        
        // 2. Server hardcoded routes
        if (Array.isArray(serverRoutesRef.current)) {
          serverRoutesRef.current.forEach(t => {
            if (t && t.id) routeMap.set(t.id, t);
          });
        }
        
        // 3. LocalStorage
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed)) {
              parsed.forEach(t => {
                if (t && t.id) routeMap.set(t.id, t);
              });
            }
          } catch (e) {
            console.error(e);
          }
        }
        
        setAllTrails(Array.from(routeMap.values()));
        return;
      }
      
      // Setup user bodyweight settings listener
      const settingsPath = `users/${user.uid}/profile/settings`;
      try {
        unsubscribeSnap = onSnapshot(
          doc(db, settingsPath),
          (sDoc) => {
            if (sDoc.exists()) {
              const data = sDoc.data();
              if (data && data.bodyweight) {
                setUserWeight(Number(data.bodyweight) || 75);
              }
            }
          },
          (err) => {
            console.warn("Could not listen to user bodyweight settings:", err);
          }
        );
      } catch (err) {
        console.warn("Error setting up bodyweight listener:", err);
      }

      // Connect to secure, account-specific custom routes subcollection
      const customColPath = `users/${user.uid}/custom_routes`;
      try {
        unsubscribeCustomRoutes = onSnapshot(
          collection(db, customColPath),
          (snapshot) => {
            const fireStoreRoutes: any[] = [];
            snapshot.forEach((subDoc) => {
              if (subDoc.exists()) {
                fireStoreRoutes.push({ ...subDoc.data(), id: subDoc.id });
              }
            });

            const localSaved = localStorage.getItem('tactical_custom_routes');
            const routeMap = new globalThis.Map<string, any>();

            // 1. Load base preset trails
            PRESET_TRAILS.forEach(t => {
              if (t && t.id) routeMap.set(t.id, t);
            });

            // 2. Load server-side hardcoded paths
            if (Array.isArray(serverRoutesRef.current)) {
              serverRoutesRef.current.forEach(t => {
                if (t && t.id) routeMap.set(t.id, t);
              });
            }

            // 3. Load firestore user-specific routes
            fireStoreRoutes.forEach(r => {
              if (r && r.id) routeMap.set(r.id, r);
            });

            // 4. Load and verify local routes to migrate or merge
            if (localSaved) {
              try {
                const parsed = JSON.parse(localSaved);
                if (Array.isArray(parsed)) {
                  parsed.forEach(r => {
                    if (r && r.id) {
                      if (!routeMap.has(r.id)) {
                        routeMap.set(r.id, r);
                        // Migrate and backup offline-created route onto their logged-in account
                        setDoc(doc(db, `users/${user.uid}/custom_routes/${r.id}`), r).catch(err => {
                          console.warn("Auto-syncing offline custom route to user Firestore block failed:", err);
                        });
                        // Backup hardcoded to server folder as well
                        fetch('/api/hardcoded-routes', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify(r)
                        }).catch(err => console.warn("Failed backporting offline route to server disk:", err));
                      }
                    }
                  });
                }
              } catch (e) {
                console.error("Local storage parse err during merge:", e);
              }
            }

            const merged = Array.from(routeMap.values());
            setAllTrails(merged);
          },
          (err) => {
            console.warn("Could not sync custom routes from Firestore:", err);
            
            // Fallback to local storage + server storage if reading was blocked or offline
            const saved = localStorage.getItem('tactical_custom_routes');
            const routeMap = new globalThis.Map<string, any>();
            
            PRESET_TRAILS.forEach(t => {
              if (t && t.id) routeMap.set(t.id, t);
            });
            if (Array.isArray(serverRoutesRef.current)) {
              serverRoutesRef.current.forEach(t => {
                if (t && t.id) routeMap.set(t.id, t);
              });
            }
            
            if (saved) {
              try {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed)) {
                  parsed.forEach(t => {
                    if (t && t.id) routeMap.set(t.id, t);
                  });
                }
              } catch (e) {
                console.error(e);
              }
            }
            setAllTrails(Array.from(routeMap.values()));
          }
        );
      } catch (err) {
        console.warn("Error setting up personal custom routes listener:", err);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeSnap) unsubscribeSnap();
      if (unsubscribeCustomRoutes) unsubscribeCustomRoutes();
    };
  }, []);

  // Drag to scroll refs for preset ranges scrollable list
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const startYRef = useRef(0);
  const scrollTopRef = useRef(0);

  const handleScrollMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!scrollContainerRef.current) return;
    isDraggingRef.current = true;
    startYRef.current = e.pageY - scrollContainerRef.current.offsetTop;
    scrollTopRef.current = scrollContainerRef.current.scrollTop;
  };

  const handleScrollMouseLeaveOrUp = () => {
    isDraggingRef.current = false;
  };

  const handleScrollMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || !scrollContainerRef.current) return;
    e.preventDefault();
    const y = e.pageY - scrollContainerRef.current.offsetTop;
    const scrollDistance = (y - startYRef.current) * 1.5;
    scrollContainerRef.current.scrollTop = scrollTopRef.current - scrollDistance;
  };

    // Map state to control center
  const [mapCenter, setMapCenter] = useState<google.maps.LatLngLiteral>(PRESET_TRAILS[0].origin);
  const [selectedPlace, setSelectedPlace] = useState<google.maps.places.Place | null>(null);
  const [activeCategoryType, setActiveCategoryType] = useState<'hike' | null>('hike');
  const [activeDifficultyFilter, setActiveDifficultyFilter] = useState<'ALL' | 'EASY' | 'MEDIUM' | 'HARD'>('ALL');
  const [trailSource, setTrailSource] = useState<'all' | 'official' | 'custom'>('all');

  // Track user selection/interaction to avoid auto-selecting preset trails on mount
  const userInteractedRef = useRef<boolean>(false);

  // Auto-select first preset of chosen category & difficulty when changed
  useEffect(() => {
    if (!userInteractedRef.current) {
      userInteractedRef.current = true;
      return;
    }

    if (activeCategoryType) {
      const match = allTrails.find(
        p => p.category === activeCategoryType && 
        (activeDifficultyFilter === 'ALL' || p.difficulty === activeDifficultyFilter)
      ) || allTrails.find(p => p.category === activeCategoryType);

      if (match) {
        handlePresetSelect(match);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategoryType, activeDifficultyFilter]);

  const handleAutoSelectPlace = (place: google.maps.places.Place) => {
    if (!place.location) return;
    const startLatLng = getSafeLatLng(place.location);
    setActivePreset(null);
    setCustomOrigin(startLatLng);
    
    // Auto-plot an elegant route starting from this location and ending ~1.5km away
    const endLatLng = {
      lat: startLatLng.lat + 0.008,
      lng: startLatLng.lng + 0.008
    };
    setCustomDestination(endLatLng);
    setMapCenter(startLatLng);
    setSelectedPlace(place);
  };

  useEffect(() => {
    // Reset simulation and trail recording when path points change
    stopSimulation();
    if (trailTimerRef.current) {
      clearInterval(trailTimerRef.current);
      trailTimerRef.current = null;
    }
    setIsTrailActive(false);
    setTrailCompleted(false);
  }, [pathPoints]);

  useEffect(() => {
    return () => {
      if (simulationIntervalRef.current) clearInterval(simulationIntervalRef.current);
      if (trailTimerRef.current) clearInterval(trailTimerRef.current);
    };
  }, []);

  const startTrailTracking = () => {
    if (pathPoints.length === 0) return;
    setIsTrailActive(true);
    setTrailElapsedTime(0);
    setTrailDistanceCovered(0);
    setTrailCaloriesBurned(0);
    setLoggedToActiveSession(false);
    setTrailCompleted(false);

    // Trigger map simulation/runner along with it so there is a visual avatar traversing!
    startSimulation();

    if (trailTimerRef.current) {
      clearInterval(trailTimerRef.current);
    }
    
    // Grab the estimated duration & distance
    const totalDist = parseFloat(routeDistance) || 2.0;
    const totalDurMins = parseFloat(routeDuration) || 15;
    const totalSecs = Math.max(30, totalDurMins * 60);

    trailTimerRef.current = setInterval(() => {
      setTrailElapsedTime((prev) => {
        const nextTime = prev + 1;
        
        // Progress percentage (loop or cap at 1.0)
        const frac = Math.min(1.0, nextTime / totalSecs);
        setTrailDistanceCovered(totalDist * frac);

        // Calorie burned (MET estimation)
        const categoryDifficulty = activePreset?.difficulty || 'EASY';
        const metValue = categoryDifficulty === 'HARD' ? 8.5 : categoryDifficulty === 'MEDIUM' ? 6.5 : 4.5;
        const elapsedMins = nextTime / 60;
        const cals = (metValue * 3.5 * userWeight / 200) * elapsedMins;
        setTrailCaloriesBurned(cals);

        if (nextTime >= totalSecs) {
          // Auto stop tracking when trail completes
          setTimeout(() => {
            stopTrailTracking();
          }, 500);
        }

        return nextTime;
      });
    }, 1000);
  };

  const stopTrailTracking = () => {
    if (trailTimerRef.current) {
      clearInterval(trailTimerRef.current);
      trailTimerRef.current = null;
    }
    setIsTrailActive(false);
    setTrailCompleted(true);
    stopSimulation();
  };

  const handleLogTrailToActiveSession = async () => {
    if (isLoggingToSession) return;
    setIsLoggingToSession(true);

    const trailNameOrCustom = activePreset ? activePreset.name : "Custom Scout Route";
    const exName = `🏃 Trail: ${trailNameOrCustom}`;
    
    const today = new Date();
    const fullDate = today.toISOString().split('T')[0];
    const timestampSecs = Math.floor(today.getTime() / 1000);
    const setId = `${fullDate}-trail-${Date.now()}`;

    // Logged details
    const finalDistNum = Number(parseFloat(trailDistanceCovered.toFixed(2)));
    const finalCalsNum = Math.round(trailCaloriesBurned);

    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        // User is logged in, log to Firestore
        const setsPath = `users/${currentUser.uid}/sets/${setId}`;
        await setDoc(doc(db, setsPath), {
          exerciseName: exName,
          weight: finalDistNum, // using weight slot to store distance (km)
          reps: finalCalsNum,   // using reps slot to store calories (kcal)
          date: fullDate,
          timestamp: serverTimestamp()
        });
        
        setLoggedToActiveSession(true);
        alert(`Successfully synchronized outdoor run (${finalDistNum} KM, ${finalCalsNum} KCAL) into active session records!`);
      } else {
        // User is offline or not logged in, alert and mark as completed
        setLoggedToActiveSession(true);
        alert(`Local trail walk completed! (Distance: ${finalDistNum} KM, Burned: ${finalCalsNum} Kcal). Log in to persist data.`);
      }
    } catch (err: any) {
      console.error("Error logging trail set:", err);
      alert(`Could not log run to session: ${err.message || err}`);
    } finally {
      setIsLoggingToSession(false);
    }
  };

  const handleStatsCalibrated = useCallback((dist: string, dur: string, points: google.maps.LatLngLiteral[]) => {
    setRouteDistance(dist);
    setRouteDuration(dur);
    setPathPoints(points);
  }, []);

  const startSimulation = () => {
    if (pathPoints.length === 0) return;
    stopSimulation();
    setIsPlayingSimulation(true);
    currentStepIndexRef.current = 0;

    const stepSpeed = Math.max(1, Math.floor(pathPoints.length / 100)); // Dynamic step scaling

    simulationIntervalRef.current = setInterval(() => {
      const idx = currentStepIndexRef.current;
      if (idx >= pathPoints.length) {
        stopSimulation();
        return;
      }
      const coords = pathPoints[idx];
      setSimulatedLatLng({ lat: coords.lat, lng: coords.lng });
      currentStepIndexRef.current += stepSpeed;
    }, 60);
  };

  const stopSimulation = () => {
    setIsPlayingSimulation(false);
    setSimulatedLatLng(null);
    if (simulationIntervalRef.current) {
      clearInterval(simulationIntervalRef.current);
      simulationIntervalRef.current = null;
    }
  };

  const handlePresetSelect = (preset: typeof PRESET_TRAILS[0]) => {
    stopSimulation();
    setSelectedPlace(null);
    setActivePreset(preset);
    setCustomOrigin(null);
    setCustomDestination(null);
    setMiddleWaypoints((preset as any).middleWaypoints || []); // Load preset middle checkpoints on new select
    setMapCenter(preset.origin);

    // Reset tracking indicators
    if (trailTimerRef.current) {
      clearInterval(trailTimerRef.current);
      trailTimerRef.current = null;
    }
    setIsTrailActive(false);
    setTrailCompleted(false);
  };

  const handleMapClick = (e: any) => {
    const rawLatLng = e.detail?.latLng || e.latLng;
    if (!rawLatLng) return;
    const clickedLatLng = getSafeLatLng(rawLatLng);

    if (waypointMode === 'ORIGIN') {
      if (activePreset && !customDestination) {
        setCustomDestination(activePreset.destination);
      }
      setActivePreset(null);
      setCustomOrigin(clickedLatLng);
      setWaypointMode('NONE');
    } else if (waypointMode === 'DESTINATION') {
      if (activePreset && !customOrigin) {
        setCustomOrigin(activePreset.origin);
      }
      setActivePreset(null);
      setCustomDestination(clickedLatLng);
      setWaypointMode('NONE');
    } else if (waypointMode === 'WAYPOINT') {
      if (activePreset) {
        setCustomOrigin(activePreset.origin);
        setCustomDestination(activePreset.destination);
      }
      setActivePreset(null);
      setMiddleWaypoints(prev => [...prev, clickedLatLng]);
      setWaypointMode('NONE');
    } else {
      setSelectedPlace(null);
    }
  };

  const triggerCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setMapCenter(loc);
          // Set starting custom point nearby
          setCustomOrigin(loc);
          setCustomDestination({ lat: loc.lat + 0.015, lng: loc.lng + 0.015 });
          setActivePreset(null);
        },
        (err) => {
          console.warn("Geolocation permission blocked or timed out:", err);
        }
      );
    }
  };

  const activeKey = localApiKey || dynamicApiKey || API_KEY;
  const hasValidActiveKey = Boolean(activeKey) && activeKey !== 'YOUR_API_KEY';

  // Stable deterministic elevation generator based on coordinates
  const elevationProfile = useMemo(() => {
    if (pathPoints.length === 0) return [];
    return pathPoints.map((pt, index) => {
      const base = 85; 
      const wave1 = Math.sin(pt.lat * 400 + pt.lng * 200) * 35;
      const wave2 = Math.cos(pt.lng * 600 - pt.lat * 100) * 15;
      const wave3 = Math.sin((index / Math.max(1, pathPoints.length - 1)) * Math.PI) * 20; 
      const noise = Math.sin(index * 0.5) * 2; 
      const elevation = Math.round(base + wave1 + wave2 + wave3 + noise);
      return Math.max(12, elevation);
    });
  }, [pathPoints]);

  const cumulativeGain = useMemo(() => {
    if (elevationProfile.length <= 1) return 0;
    let gain = 0;
    for (let i = 1; i < elevationProfile.length; i++) {
      const diff = elevationProfile[i] - elevationProfile[i - 1];
      if (diff > 0) gain += diff;
    }
    return Math.round(gain);
  }, [elevationProfile]);

  // Filtered list of preset trails matching selected parameters
  const matchingTrails = useMemo(() => {
    return allTrails.filter((trail) => {
      // Filter by trail source
      const isCustom = String(trail.id || '').startsWith('custom_');
      if (trailSource === 'official' && isCustom) return false;
      if (trailSource === 'custom' && !isCustom) return false;

      const matchesCategory = !activeCategoryType || trail.category === activeCategoryType;
      const matchesDifficulty = activeDifficultyFilter === 'ALL' || trail.difficulty === activeDifficultyFilter;
      return matchesCategory && matchesDifficulty;
    });
  }, [activeCategoryType, activeDifficultyFilter, allTrails, trailSource]);

  if (isKeyLoading) {
    return (
      <div className="bg-black/95 text-center p-12 max-w-2xl mx-auto my-12 border border-white/10 rounded-sm">
        <Loader2 className="w-8 h-8 text-gym-accent animate-spin mx-auto mb-3" />
        <p className="text-xs uppercase tracking-widest font-mono text-white/70">Connecting with Tactical Satellite...</p>
      </div>
    );
  }

  // Safe verification display of API KEY
  if (!hasValidActiveKey) {
    return (
      <div className="bg-black/95 border border-white/10 rounded-sm p-8 max-w-2xl mx-auto my-12 backdrop-blur-md">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-2 animate-pulse">
            <Compass className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold uppercase tracking-widest text-white font-mono">Tactical Radar Offline</h2>
          <p className="text-sm text-white/70 max-w-md mx-auto leading-relaxed">
            Google Maps Platform integration requires a valid operational API Key.
          </p>

          <div className="bg-white/[0.02] border border-white/5 p-5 text-left rounded-sm space-y-3 font-sans text-xs text-white/80">
            <p className="font-bold text-gym-accent uppercase tracking-wider">Operational Key Deployment Instructions:</p>
            <ol className="list-decimal list-inside space-y-2 leading-relaxed">
              <li>
                Get your GCP Maps API key from the{' '}
                <a 
                  href="https://console.cloud.google.com/google/maps-apis/start?utm_campaign=gmp-code-assist-ais" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gym-accent underline font-semibold hover:text-white transition-all"
                >
                  Google Maps Platform Console
                </a>.
              </li>
              <li>
                Define <code>GOOGLE_MAPS_PLATFORM_KEY</code> as a Secret inside your development workstation:
                <ul className="list-disc list-inside pl-4 mt-1 space-y-1 text-white/55">
                   <li>Click the <strong>Settings (⚙️ gear icon)</strong> at the top right of the workspace.</li>
                  <li>Go to <strong>Secrets</strong>.</li>
                  <li>Click <strong>Add Secret</strong> and name it <code>GOOGLE_MAPS_PLATFORM_KEY</code>, paste your key as the value, and click save.</li>
                </ul>
              </li>
              <li>The Athlete Console will automatically reload and hot-patch with offline navigation.</li>
            </ol>
          </div>

          {/* Secure local device direct key activation option */}
          <div className="border-t border-white/10 pt-5 mt-4 text-left space-y-2.5">
            <p className="font-bold text-gym-accent uppercase tracking-wider text-xs">
              🔑 Direct Device Activation (For Phone/Live Web App):
            </p>
            <p className="text-[11px] text-white/60 leading-normal">
              If accessing on your phone or a shared preview URL where workstation secrets don't propagate, paste your Google Maps API Key below. It will save directly and securely strictly to this browser's local safety store.
            </p>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const val = formData.get('manualApiKey') as string;
              if (val && val.trim()) {
                localStorage.setItem('gym_google_maps_key', val.trim());
                setLocalApiKey(val.trim());
              }
            }} className="flex gap-2">
              <input
                type="password"
                name="manualApiKey"
                placeholder="Paste Your API Key (AIzaSy...)"
                required
                className="flex-1 bg-white/5 border border-white/10 focus:border-gym-accent/50 rounded-sm px-3 py-1.5 text-xs text-white placeholder-white/30 focus:outline-none font-mono"
              />
              <button
                type="submit"
                className="px-4 py-1.5 bg-gym-accent text-black font-mono font-black text-xs uppercase hover:bg-gym-accent/90 transition-all rounded-sm cursor-pointer select-none border-none"
              >
                ACTIVATE KEY
              </button>
            </form>

            {/* Referer / Domain Restriction Help Card */}
            <div className="bg-amber-500/10 border border-amber-500/20 text-amber-300 p-4 rounded-sm text-xs space-y-2 mt-4">
              <p className="font-bold uppercase tracking-wider text-[11px] text-gym-accent flex items-center gap-1.5">
                ⚠️ HOW TO AUTHORIZE YOUR PHONE & LIVE WEBPAGE:
              </p>
              <p className="text-[11px] leading-relaxed text-white/80">
                The <code>RefererNotAllowedMapError</code> happens because Google's servers are blocking request origins not specified in your API key's safety restrictions. Follow these precise steps or options to authorize your phone or shared URL:
              </p>
              
              <div className="space-y-3 mt-2 text-white/70">
                <div className="bg-white/5 p-2 rounded-sm border border-white/5">
                  <span className="font-bold text-white text-[10px] block mb-1 uppercase tracking-wider text-gym-accent">Option A: Disable Website Restrictions (Quickest & Safest for testing)</span>
                  <p className="text-[11px] leading-relaxed mb-1.5 text-white/85">
                    If this is a private or experimental credentials key, loosening restrictions allows you to preview on all mobile devices and dev stations immediately:
                  </p>
                  <ol className="list-decimal pl-4 text-[11px] space-y-1 text-white/75">
                    <li>Go to the <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="text-gym-accent underline hover:text-white">Google Cloud Console</a>.</li>
                    <li>Open parent menu <strong>APIs &amp; Services</strong> &gt; <strong>Credentials</strong>.</li>
                    <li>Click the pencil edit icon next to your Google Maps API Key.</li>
                    <li>Scroll down to the <strong>Set an application restriction</strong> section.</li>
                    <li>Select <strong>"None"</strong> (this removes background referer validation rejects).</li>
                    <li>Click the blue <strong>Save</strong> button at the bottom. Wait 1 min and refresh!</li>
                  </ol>
                </div>

                <div className="bg-gym-accent/5 p-3 rounded-sm border border-gym-accent/45 shadow-[0_0_15px_rgba(255,215,0,0.05)]">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-gym-accent text-[10px] block uppercase tracking-wider">Option B: Set Specific Website Referers (Strict Security - Recommended)</span>
                    <span className="bg-gym-accent/20 text-gym-accent text-[8px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wide">Secure Production Mode</span>
                  </div>
                  <p className="text-[11px] leading-relaxed mb-1.5 text-white/85">
                    If you want to keep strict HTTP restrictions enabled, you must whitelist the preview cloud containers exactly:
                  </p>
                  <ol className="list-decimal pl-4 text-[11px] space-y-1 text-white/75">
                    <li>Within the Google Cloud Console, edit your API Key config.</li>
                    <li>Ensure <strong>"Website restrictions"</strong> / <strong>"HTTP referrers (web sites)"</strong> is selected.</li>
                    <li>Under <strong>Website restrictions</strong>, locate the URLs text fields and add these items:
                      <ul className="list-disc pl-4 mt-1 space-y-0.5 text-white/90 font-mono text-[10px] bg-black/30 p-1.5 rounded-sm">
                        <li><code>*.run.app/*</code> &nbsp;<span className="text-white/40 font-sans text-[10px]">(matches all previews on phone)</span></li>
                        <li><code>https://ais-dev-bzhhelxbljh7cbeay67ouu-853669939350.europe-west2.run.app/*</code></li>
                        <li><code>https://ais-pre-bzhhelxbljh7cbeay67ouu-853669939350.europe-west2.run.app/*</code></li>
                      </ul>
                    </li>
                    <li>Make sure they are entered individually or cover all domains, then click the blue <strong>Save</strong> button.</li>
                    <li>Note: Google applies changes asynchronously, so please allow up to 2-3 minutes for the restrictions to take full effect worldwide.</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Active tracking coordinate anchors
  const originCoord = customOrigin || (activePreset ? activePreset.origin : null);
  const destCoord = customDestination || (activePreset ? activePreset.destination : null);

  const calculateKcal = () => {
    const rawVal = parseFloat(routeDistance);
    if (isNaN(rawVal)) return 0;
    const factor = activePreset ? activePreset.kcalEstPerKm : 80;
    return Math.round(rawVal * factor);
  };

  // Helper to clear custom routes
  const handleClearCustomRoute = () => {
    setCustomOrigin(null);
    setCustomDestination(null);
    setMiddleWaypoints([]);
    if (activePreset) {
      setMiddleWaypoints((activePreset as any).middleWaypoints || []);
    } else {
      setActivePreset(null);
    }
    stopSimulation();
    if (trailTimerRef.current) {
      clearInterval(trailTimerRef.current);
      trailTimerRef.current = null;
    }
    setIsTrailActive(false);
    setTrailCompleted(false);
  };

  // Helper to completely clear the entire route from the map
  const handleClearRouteMap = () => {
    setCustomOrigin(null);
    setCustomDestination(null);
    setMiddleWaypoints([]);
    setActivePreset(null);
    stopSimulation();
    if (trailTimerRef.current) {
      clearInterval(trailTimerRef.current);
      trailTimerRef.current = null;
    }
    setIsTrailActive(false);
    setTrailCompleted(false);
    setRouteDistance('0.00 KM');
    setRouteDuration('0 MINS');
    setPathPoints([]);
  };

  // Helper to remove custom waypoints
  const handleRemoveWaypoint = (idx: number) => {
    setMiddleWaypoints(prev => prev.filter((_, i) => i !== idx));
  };

  // Helper to save a custom route to directory
  const handleSaveCustomRouteToDirectory = () => {
    if (!saveRouteName.trim()) {
      setSaveStatus({ type: 'error', message: 'Please enter a name to save the route.' });
      setTimeout(() => setSaveStatus(null), 4000);
      return;
    }
    const originCoord = customOrigin || (activePreset ? activePreset.origin : null);
    const destCoord = customDestination || (activePreset ? activePreset.destination : null);

    if (!originCoord || !destCoord) {
      setSaveStatus({ type: 'error', message: 'The route must have active starting and finishing points.' });
      setTimeout(() => setSaveStatus(null), 4000);
      return;
    }

    const newTrailId = 'custom_' + Date.now();
    const newTrail = {
      id: newTrailId,
      name: saveRouteName.trim(),
      category: 'hike' as const,
      origin: { lat: originCoord.lat, lng: originCoord.lng },
      destination: { lat: destCoord.lat, lng: destCoord.lng },
      originText: 'Custom Start',
      destinationText: 'Custom Finish',
      difficulty: saveRouteDifficulty,
      kcalEstPerKm: saveRouteDifficulty === 'EASY' ? 60 : saveRouteDifficulty === 'MEDIUM' ? 75 : 95,
      details: saveRouteDetails.trim() || 'A user-designed custom tactical routing traversal.',
      trailType: saveRouteType.trim() || 'Custom Workout Path',
      middleWaypoints: middleWaypoints.map(wp => ({ lat: wp.lat, lng: wp.lng })),
      imageUrl: ''
    };

    const updatedRoutes = [...allTrails, newTrail];
    
    // Save only custom ones to localStorage to keep payload light
    const customOnly = updatedRoutes.filter(t => t.id.startsWith('custom_'));
    localStorage.setItem('tactical_custom_routes', JSON.stringify(customOnly));

    // Post to backend server to hardcode the custom route permanently on server memory/disk
    fetch('/api/hardcoded-routes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newTrail)
    })
    .then(res => res.json())
    .then(data => {
      if (data && data.routes) {
        serverRoutesRef.current = data.routes;
      }
    })
    .catch(err => {
      console.warn("Failed to write hardcoded route to server database files:", err);
    });

    // Save to Firestore under user settings directory if logged in
    if (currentUser) {
      const routePath = `users/${currentUser.uid}/custom_routes/${newTrailId}`;
      setDoc(doc(db, routePath), newTrail).catch(err => {
        console.error("Failed to save custom route to Firestore:", err);
      });
    }

    setAllTrails(updatedRoutes);
    setActivePreset(newTrail);
    
    // Reset inputs
    setSaveRouteName('');
    setSaveRouteDetails('');
    setSaveRouteType('Custom Workout Path');
    
    setSaveStatus({ type: 'success', message: `Route "${newTrail.name}" successfully created & hardcoded!` });
    setTimeout(() => setSaveStatus(null), 4000);
  };

  // Helper to delete a custom route
  const handleDeleteCustomRoute = (id: string) => {
    if (deleteConfirmId !== id) {
      setDeleteConfirmId(id);
      setTimeout(() => {
        setDeleteConfirmId(prev => prev === id ? null : prev);
      }, 4000);
      return;
    }

    const updatedRoutes = allTrails.filter(t => t.id !== id);
    const customOnly = updatedRoutes.filter(t => t.id.startsWith('custom_'));
    localStorage.setItem('tactical_custom_routes', JSON.stringify(customOnly));

    // Send delete request to backend server to permanently purge from hardcoded repository disk
    fetch(`/api/hardcoded-routes/${id}`, {
      method: 'DELETE'
    })
    .then(res => res.json())
    .then(data => {
      if (data && data.routes) {
        serverRoutesRef.current = data.routes;
      }
    })
    .catch(err => {
      console.warn("Failed to delete hardcoded route from server disk:", err);
    });

    // Delete from Firestore user directory if logged in
    if (currentUser) {
      const routePath = `users/${currentUser.uid}/custom_routes/${id}`;
      deleteDoc(doc(db, routePath)).catch(err => {
        console.error("Failed to delete custom route from Firestore:", err);
      });
    }
    
    setAllTrails(updatedRoutes);
    setDeleteConfirmId(null);

    // fallback to no active route / blank canvas state
    setActivePreset(null);
    setMiddleWaypoints([]);
    setCustomOrigin(null);
    setCustomDestination(null);
    setRouteDistance('0.00 KM');
    setRouteDuration('0 MINS');
    setPathPoints([]);

    setSaveStatus({ type: 'success', message: 'Custom route deleted successfully.' });
    setTimeout(() => setSaveStatus(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Visual Header Block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <h3 className="text-xl font-light italic font-serif text-white tracking-wide">Outdoor Tactical Range Mapping</h3>
          <p className="text-[10px] text-white/50 uppercase tracking-[0.2em] font-bold mt-1">Biochemical Traversal Calibration &amp; Route Discovery</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {localApiKey && (
            <button
              type="button"
              onClick={() => {
                localStorage.removeItem('gym_google_maps_key');
                setLocalApiKey('');
                alert('Device-specific key cleared successfully.');
              }}
              className="px-3 py-1.5 bg-red-500/15 border border-red-500/30 hover:bg-red-500/25 text-red-400 text-[9px] font-mono tracking-wider font-semibold rounded-sm uppercase cursor-pointer"
              title="Click to remove custom device key"
            >
              🔒 Clear Local Key
            </button>
          )}
          <button
            onClick={triggerCurrentLocation}
            className="px-3.5 py-1.5 bg-white/5 border border-white/10 hover:border-gym-accent/40 text-white text-[9px] font-bold uppercase tracking-wider font-mono rounded-sm flex items-center gap-2 transition-all cursor-pointer select-none"
          >
            <Locate className="w-3.5 h-3.5 text-gym-accent" />
            SYNCHRONIZE GPS
          </button>
        </div>
      </div>

      {/* Main 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Controls & Commands (Dashboard Panel) */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* Section A: Live Telemetry & Field Tracker */}
          <div className="bg-[#08080a] border border-white/10 p-4 rounded-sm space-y-3 shadow-lg relative">
            <div className="absolute top-0 right-4 h-[1px] w-12 bg-gym-accent/30" />
            <div className="flex items-center gap-1.5 border-b border-white/5 pb-2">
              <span className="w-1.5 h-1.5 bg-gym-accent rounded-full block animate-pulse"></span>
              <span className="text-[10px] text-white/80 font-mono font-bold uppercase tracking-wider block">SESSION TELEMETRY</span>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-white/[0.02] border border-white/5 px-2.5 py-2 rounded-sm text-center">
                <span className="text-[7.5px] text-white/40 font-mono uppercase block">TOTAL DIST</span>
                <span className="text-sm font-bold text-gym-accent font-mono tracking-tight block mt-0.5">{routeDistance}</span>
              </div>
              <div className="bg-white/[0.02] border border-white/5 px-2.5 py-2 rounded-sm text-center">
                <span className="text-[7.5px] text-white/40 font-mono uppercase block">DURATION</span>
                <span className="text-sm font-bold text-white font-mono tracking-tight block mt-0.5">{routeDuration}</span>
              </div>
              <div className="bg-white/[0.02] border border-white/5 px-2.5 py-2 rounded-sm text-center">
                <span className="text-[7.5px] text-white/40 font-mono uppercase block">EXPENDITURE</span>
                <span className="text-sm font-bold text-white font-mono tracking-tight block mt-0.5">{calculateKcal()} KCAL</span>
              </div>
            </div>

            {pathPoints.length > 0 && (
              <div className="space-y-2.5 pt-2 border-t border-white/5">
                {/* Tracker states representation */}
                {!isTrailActive && !trailCompleted && (
                  <div className="space-y-1.5">
                    <button
                      onClick={startTrailTracking}
                      className="w-full py-2 bg-gym-accent hover:bg-gym-accent/90 text-black text-[9px] font-black uppercase tracking-wider rounded-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md shadow-gym-accent/5 font-mono"
                    >
                      <Play className="w-3.5 h-3.5 fill-black text-black" />
                      DEPLOY LIVE GPS RECORDING
                    </button>
                    <p className="text-[8px] text-white/30 leading-normal text-center italic font-mono">
                      Simulates active athlete traverse using {userWeight}kg body metric
                    </p>
                  </div>
                )}

                {isTrailActive && (
                  <div className="bg-gym-accent/[0.02] border border-gym-accent/20 rounded p-3 space-y-2 relative overflow-hidden">
                    <div className="flex items-center justify-between">
                      <span className="text-[8px] text-gym-accent font-mono font-black uppercase tracking-wider flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-ping block"></span>
                        RECORDING REAL-TIME WALK
                      </span>
                      <span className="text-[10px] text-white/60 font-mono font-bold">
                        {Math.floor(trailElapsedTime / 60).toString().padStart(2, '0')}:
                        {(trailElapsedTime % 60).toString().padStart(2, '0')}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                      <div className="bg-white/[0.01] border border-white/5 p-1.5 rounded-sm">
                        <span className="text-[7px] text-white/30 block font-bold uppercase tracking-wider">COVERED</span>
                        <span className="text-white font-black block mt-0.5">{trailDistanceCovered.toFixed(2)} KM</span>
                      </div>
                      <div className="bg-white/[0.01] border border-white/5 p-1.5 rounded-sm">
                        <span className="text-[7.5px] text-white/30 block font-bold uppercase tracking-wider">ENERGY BURN</span>
                        <span className="text-gym-accent font-black block mt-0.5">{Math.round(trailCaloriesBurned)} KCAL</span>
                      </div>
                    </div>

                    <button
                      onClick={stopTrailTracking}
                      className="w-full py-1.5 bg-red-500 hover:bg-red-600 text-white text-[9px] font-black uppercase tracking-wider rounded-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md font-mono"
                    >
                      <Square className="w-3 h-3 fill-white text-white" />
                      HALT & EXTRACT LOGS
                    </button>
                  </div>
                )}

                {trailCompleted && (
                  <div className="bg-white/[0.01] border border-white/10 rounded p-3 space-y-2.5">
                    <div className="flex items-center gap-1 border-b border-white/5 pb-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-[8px] text-emerald-400 font-mono font-black uppercase tracking-wider">TRAIL COMPLETED</span>
                    </div>

                    <div className="space-y-1 text-xs text-white/75 font-mono text-[10px]">
                      <div className="flex justify-between">
                        <span className="text-white/40">Elapsed Time:</span>
                        <span className="text-white font-bold">
                          {Math.floor(trailElapsedTime / 60)}m {trailElapsedTime % 60}s
                        </span>
                      </div>
                      <div className="flex justify-between border-t border-white/[0.03] pt-0.5">
                        <span className="text-white/40">Distance:</span>
                        <span className="text-gym-accent font-bold">{trailDistanceCovered.toFixed(2)} KM</span>
                      </div>
                      <div className="flex justify-between border-t border-white/[0.03] pt-0.5">
                        <span className="text-white/40">Calories:</span>
                        <span className="text-white font-bold">{Math.round(trailCaloriesBurned)} kcal</span>
                      </div>
                    </div>

                    <div className="space-y-1.5 pt-1">
                      {!loggedToActiveSession ? (
                        <button
                          onClick={handleLogTrailToActiveSession}
                          disabled={isLoggingToSession}
                          className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-[9px] font-black uppercase tracking-wider rounded-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md disabled:opacity-50 font-mono"
                        >
                          {isLoggingToSession ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Check className="w-3 h-3 text-slate-950" />
                          )}
                          LOG RUN TO CONSOLE SESSIONS
                        </button>
                      ) : (
                        <div className="bg-emerald-500/10 border border-emerald-500/25 py-2 px-3 rounded-sm flex items-center justify-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-[8px] text-emerald-400 font-mono tracking-wider uppercase font-black">RECORDED IN CURRENT SESSION</span>
                        </div>
                      )}

                      <button
                        onClick={() => {
                          setTrailCompleted(false);
                          setTrailElapsedTime(0);
                          setTrailDistanceCovered(0);
                          setTrailCaloriesBurned(0);
                          setLoggedToActiveSession(false);
                        }}
                        className="w-full py-1 bg-white/5 hover:bg-white/10 text-white/50 text-[8px] font-mono uppercase tracking-wider rounded-sm transition-all"
                      >
                        RESET TRACKER
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Section B: Custom Route Desinger and Checkpoints */}
          <div className="bg-[#08080a] border border-white/10 p-4 rounded-sm space-y-3 shadow-lg relative">
            <span className="text-[10px] text-white/80 font-mono font-bold uppercase tracking-wider block">ROUTE DESIGNER</span>
            
            {/* Prompt Return Loop option */}
            <div className="flex items-center justify-between p-2.5 bg-white/[0.02] border border-white/5 rounded-sm">
              <div className="space-y-0.5 max-w-[70%]">
                <span className="text-[9px] text-white font-mono tracking-wider block font-bold leading-normal">🔄 CHOREOGRAPH RETURN LOOP</span>
                <span className="text-[7.5px] text-white/40 leading-normal block">Return back to original start coordinate on completion</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer select-none shrink-0 scale-90">
                <input 
                  type="checkbox" 
                  checked={shouldLoopBack}
                  onChange={(e) => setShouldLoopBack(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-8 h-4.5 bg-white/10 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white/70 after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-gym-accent peer-checked:after:bg-black"></div>
              </label>
            </div>

            {/* Custom Coordinates selector triggers */}
            <div className="space-y-1.5">
              <div className="grid grid-cols-3 gap-1 shadow-sm">
                <button
                  type="button"
                  onClick={() => setWaypointMode(waypointMode === 'ORIGIN' ? 'NONE' : 'ORIGIN')}
                  className={`py-2 text-[8px] font-mono tracking-wider text-center uppercase font-bold rounded-xs border transition-all cursor-pointer ${
                    waypointMode === 'ORIGIN' 
                      ? 'bg-gym-accent border-gym-accent text-black font-black' 
                      : 'bg-white/[0.02] border-white/5 hover:bg-white/5 text-white/70'
                  }`}
                  title="Plot main start coordinates"
                >
                  {waypointMode === 'ORIGIN' ? 'SET START...' : '📍 Start Pt'}
                </button>
                <button
                  type="button"
                  onClick={() => setWaypointMode(waypointMode === 'DESTINATION' ? 'NONE' : 'DESTINATION')}
                  className={`py-2 text-[8px] font-mono tracking-wider text-center uppercase font-bold rounded-xs border transition-all cursor-pointer ${
                    waypointMode === 'DESTINATION' 
                      ? 'bg-purple-500 border-purple-500 text-black font-black' 
                      : 'bg-white/[0.02] border-white/5 hover:bg-white/5 text-white/70'
                  }`}
                  title="Plot destination gate coordinates"
                >
                  {waypointMode === 'DESTINATION' ? 'SET END...' : '🏁 End Pt'}
                </button>
                <button
                  type="button"
                  onClick={() => setWaypointMode(waypointMode === 'WAYPOINT' ? 'NONE' : 'WAYPOINT')}
                  className={`py-2 text-[8px] font-mono tracking-wider text-center uppercase font-bold rounded-xs border transition-all cursor-pointer ${
                    waypointMode === 'WAYPOINT' 
                      ? 'bg-gym-accent/30 border-gym-accent text-white font-black' 
                      : 'bg-white/[0.02] border-white/5 hover:bg-white/5 text-white/70'
                  }`}
                  title="Plot intermediate waypoint points on route"
                >
                  {waypointMode === 'WAYPOINT' ? 'SET STOP...' : '➕ Waypoint'}
                </button>
              </div>
              <p className="text-[8.5px] text-white/40 text-center leading-normal italic font-sans">
                Select coordinate key above, then click on the tactical map to deploy vectors.
              </p>
            </div>

            {/* Custom Checkpoints list */}
            {middleWaypoints.length > 0 && (
              <div className="space-y-1 border-t border-white/5 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-[8px] text-white/50 font-mono uppercase font-black">INTERMEDIATE CHECKPOINTS:</span>
                  <button 
                    onClick={() => setMiddleWaypoints([])}
                    className="text-[8px] text-red-400 hover:text-red-300 font-mono"
                  >
                    Clear All
                  </button>
                </div>
                <div className="bg-black/40 border border-white/5 max-h-[140px] overflow-y-auto rounded-sm divide-y divide-white/5 text-[9px] font-mono">
                  {middleWaypoints.map((wp, idx) => (
                    <div key={idx} className="flex justify-between items-center px-2 py-1.5 text-white/60">
                      <span className="flex items-center gap-1.5">
                        <span className="w-3.5 h-3.5 bg-gym-accent/10 border border-gym-accent/25 text-gym-accent rounded-full flex items-center justify-center text-[8px] font-black">
                          {idx + 1}
                        </span>
                        Stop #{idx + 1}
                      </span>
                      <button
                        onClick={() => handleRemoveWaypoint(idx)}
                        className="text-red-400 hover:text-red-300 p-1 transition-colors"
                        title="Delete Waypoint"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-1.5 pt-1">
              {(customOrigin || customDestination || middleWaypoints.length > 0) && (
                <button
                  type="button"
                  onClick={handleClearCustomRoute}
                  className="flex-1 py-1.5 bg-white/5 hover:bg-white/10 text-white/70 border border-white/5 hover:border-white/10 text-[8px] font-mono uppercase tracking-wider rounded-sm transition-all cursor-pointer"
                >
                  RESTORE DEFAULT
                </button>
              )}
              
              {(activePreset || customOrigin || customDestination || middleWaypoints.length > 0) ? (
                <button
                  type="button"
                  onClick={handleClearRouteMap}
                  className="flex-1 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/10 hover:border-red-500/20 text-[8px] font-mono uppercase tracking-wider rounded-sm transition-all cursor-pointer flex items-center justify-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  CLEAR ACTIVE ROUTE
                </button>
              ) : (
                <div className="w-full text-center py-1.5 text-white/30 text-[8px] uppercase tracking-wider font-mono bg-white/[0.01] border border-dashed border-white/5 rounded-sm">
                  NO ACTIVE ROUTE
                </div>
              )}
            </div>

            {/* Save Custom Route form section */}
            {(customOrigin || customDestination || middleWaypoints.length > 0) && !activePreset && (
              <div className="bg-white/[0.01] border border-gym-accent/25 hover:border-gym-accent/40 p-3 rounded-sm space-y-2.5 mt-2 transition-all">
                <div className="flex items-center gap-1.5 border-b border-white/5 pb-1.5">
                  <span className="text-[9px] text-gym-accent font-mono font-black uppercase tracking-wider">💾 SAVE CUSTOM ROUTE TO DIRECTORY</span>
                </div>
                
                {saveStatus && (
                  <div className={`p-2 rounded-xs border text-[9px] font-mono uppercase tracking-wider text-center ${
                    saveStatus.type === 'success' 
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                      : 'bg-red-500/10 border-red-500/20 text-red-400'
                  }`}>
                    {saveStatus.message}
                  </div>
                )}

                <div className="space-y-2">
                  <div className="space-y-1">
                    <label className="text-[7.5px] text-white/55 font-mono uppercase tracking-wider block">ROUTE NAME:</label>
                    <input 
                      type="text"
                      placeholder="e.g. My Custom Woodland Loop"
                      value={saveRouteName}
                      onChange={(e) => setSaveRouteName(e.target.value)}
                      className="w-full bg-[#030304] border border-white/10 rounded-xs p-1.5 text-xs text-white focus:outline-none focus:border-gym-accent/50 font-mono text-[9px] font-bold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[7.5px] text-white/55 font-mono uppercase tracking-wider block">DIFFICULTY:</label>
                      <select 
                        value={saveRouteDifficulty}
                        onChange={(e) => setSaveRouteDifficulty(e.target.value as any)}
                        className="w-full bg-[#030304] border border-white/10 rounded-xs p-1.5 text-xs text-white focus:outline-none focus:border-gym-accent/50 font-mono text-[9px]"
                      >
                        <option value="EASY">EASY</option>
                        <option value="MEDIUM">MEDIUM</option>
                        <option value="HARD">HARD</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[7.5px] text-white/55 font-mono uppercase tracking-wider block">TRAIL TYPE:</label>
                      <input 
                        type="text"
                        placeholder="e.g. Woodland Hike"
                        value={saveRouteType}
                        onChange={(e) => setSaveRouteType(e.target.value)}
                        className="w-full bg-[#030304] border border-white/10 rounded-xs p-1.5 text-xs text-white focus:outline-none focus:border-gym-accent/50 font-mono text-[9px] font-bold"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[7.5px] text-white/55 font-mono uppercase tracking-wider block">DETAILS / BRIEF:</label>
                    <textarea 
                      placeholder="Brief description of terrain, landmarks, or target workout profile..."
                      value={saveRouteDetails}
                      onChange={(e) => setSaveRouteDetails(e.target.value)}
                      rows={2}
                      className="w-full bg-[#030304] border border-white/10 rounded-xs p-1.5 text-xs text-white focus:outline-none focus:border-gym-accent/50 font-mono text-[9px] resize-none"
                    />
                  </div>



                  <button
                    type="button"
                    onClick={handleSaveCustomRouteToDirectory}
                    className="w-full py-1.5 bg-gym-accent hover:bg-gym-accent/90 text-black text-[9px] font-black uppercase tracking-wider rounded-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer font-mono"
                  >
                    <Save className="w-3 h-3 text-black" />
                    SAVE TO DIRECTORY
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Section C: Preset Trail Explorer */}
          <div className="bg-[#08080a] border border-white/10 p-4 rounded-sm space-y-3 shadow-lg relative">
            <span className="text-[10px] text-white/80 font-mono font-bold uppercase tracking-wider block">TRAIL DIRECTORY &amp; PRESETS</span>

            {/* Source Segment Tabs for Presets vs. User Custom Routes */}
            <div className="flex border-b border-white/5 pb-2">
              <button
                type="button"
                onClick={() => setTrailSource('all')}
                className={`flex-1 py-1.5 px-2 text-[8px] font-mono uppercase tracking-wider text-center border-b-2 font-bold transition-all cursor-pointer ${
                  trailSource === 'all'
                    ? 'border-gym-accent text-gym-accent bg-gym-accent/5'
                    : 'border-transparent text-white/50 hover:text-white hover:bg-white/[0.02]'
                }`}
              >
                🛰️ All ({allTrails.length})
              </button>
              <button
                type="button"
                onClick={() => setTrailSource('official')}
                className={`flex-1 py-1.5 px-2 text-[8px] font-mono uppercase tracking-wider text-center border-b-2 font-bold transition-all cursor-pointer ${
                  trailSource === 'official'
                    ? 'border-gym-accent text-gym-accent bg-gym-accent/5'
                    : 'border-transparent text-white/50 hover:text-white hover:bg-white/[0.02]'
                }`}
              >
                🏔️ Official ({allTrails.filter(t => !String(t.id || '').startsWith('custom_')).length})
              </button>
              <button
                type="button"
                onClick={() => setTrailSource('custom')}
                className={`flex-1 py-1.5 px-2 text-[8px] font-mono uppercase tracking-wider text-center border-b-2 font-bold transition-all relative cursor-pointer ${
                  trailSource === 'custom'
                    ? 'border-gym-accent text-gym-accent bg-gym-accent/5'
                    : 'border-transparent text-white/50 hover:text-white hover:bg-white/[0.02]'
                }`}
              >
                🛠️ My Designs ({allTrails.filter(t => String(t.id || '').startsWith('custom_')).length})
                {allTrails.filter(t => String(t.id || '').startsWith('custom_')).length > 0 && (
                  <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-gym-accent animate-pulse" />
                )}
              </button>
            </div>

            {/* Empty State when viewing custom designs but none exist */}
            {trailSource === 'custom' && matchingTrails.length === 0 && (
              <div className="bg-white/[0.01] border border-dashed border-white/10 p-3.5 rounded-sm text-center space-y-2 my-2">
                <Compass className="w-5 h-5 text-gym-accent/40 mx-auto animate-pulse" />
                <p className="text-[9.5px] uppercase font-mono tracking-wider text-white/80">Vector Registry Empty</p>
                <p className="text-[8.5px] text-white/45 leading-relaxed font-sans">
                  Click two or more locations on the Google Map to draw a navigation vector, then click &quot;Save Route Info&quot; under the map to register your first custom route into this list!
                </p>
              </div>
            )}

            {/* Quick Filter Controls */}
            <div className="space-y-2 border-b border-white/5 pb-2.5">
              <div className="grid grid-cols-4 gap-1">
                {(['ALL', 'EASY', 'MEDIUM', 'HARD'] as const).map((diff) => {
                  const isSel = activeDifficultyFilter === diff;
                  return (
                    <button
                      key={diff}
                      type="button"
                      onClick={() => setActiveDifficultyFilter(diff)}
                      className={`py-1 text-[7.5px] font-mono font-black tracking-wider rounded-sm border text-center transition-all cursor-pointer ${
                        isSel
                          ? 'bg-gym-accent border-gym-accent text-black font-extrabold'
                          : 'bg-white/[0.02] border-white/5 text-white/60 hover:bg-white/5'
                      }`}
                    >
                      {diff}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Micro dropdown presets list to make map screen highly efficient */}
            <div className="space-y-1.5">
              <label className="text-[7.5px] text-white/55 font-mono uppercase tracking-wider block">ROUTE DIRECTORY ({matchingTrails.length}):</label>
              <select
                value={activePreset?.id || ""}
                onChange={(e) => {
                  const matched = allTrails.find(t => t.id === e.target.value);
                  if (matched) {
                    handlePresetSelect(matched);
                  } else {
                    handleClearRouteMap();
                  }
                }}
                className="w-full bg-[#030304] border border-white/5 rounded-xs p-2 text-xs text-white focus:outline-none focus:border-gym-accent/50 font-mono text-[10px] cursor-pointer"
              >
                <option value="">-- [BLANK CANVAS: PLOT CUSTOM ROUTE] --</option>
                {matchingTrails.map((trail) => (
                  <option key={trail.id} value={trail.id}>
                    [{trail.difficulty}] {trail.name} — {trail.trailType}
                  </option>
                ))}
              </select>

              {saveStatus && (
                <div className={`p-2 rounded-xs border text-[9px] font-mono uppercase tracking-wider text-center ${
                  saveStatus.type === 'success' 
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                    : 'bg-red-500/10 border-red-500/20 text-red-400'
                }`}>
                  {saveStatus.message}
                </div>
              )}

              {activePreset && (
                <div className="space-y-2">
                  <div className="relative w-full py-2.5 px-3 rounded-sm border border-white/5 bg-neutral-955 flex items-center justify-between">
                    <span className="text-[8px] text-white/50 font-mono uppercase tracking-widest font-bold">Active Trajectory Target</span>
                    <span className="bg-black/75 px-1.5 py-0.5 rounded-xs border border-white/5 text-[7px] text-gym-accent uppercase font-mono tracking-wider font-extrabold">
                      {activePreset.trailType || 'Custom Scout Path'}
                    </span>
                  </div>
                  <div className="bg-white/[0.01] border border-white/5 p-2 rounded-sm text-[9.5px] font-mono text-white/70 space-y-1">
                    <p className="leading-tight"><span className="text-gym-accent uppercase tracking-wider font-extrabold mr-1">[DESCR]:</span>{activePreset.details}</p>
                  </div>
                </div>
              )}

              {activePreset && activePreset.id.startsWith('custom_') && (
                <button
                  type="button"
                  onClick={() => handleDeleteCustomRoute(activePreset.id)}
                  className={`w-full py-1.5 border text-[8px] font-mono uppercase tracking-wider rounded-sm transition-all cursor-pointer flex items-center justify-center gap-1.5 mt-1 ${
                    deleteConfirmId === activePreset.id 
                    ? "bg-red-600 hover:bg-red-700 text-white border-red-500 font-bold animate-pulse" 
                    : "bg-red-950/40 hover:bg-red-900/40 text-red-400 border-red-500/10"
                  }`}
                >
                  <Trash2 className="w-3 h-3" />
                  {deleteConfirmId === activePreset.id ? "TAP AGAIN TO CONFIRM DELETION" : "DELETE CUSTOM ROUTE FROM DIRECTORY"}
                </button>
              )}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Interactive Map & Places Search (Visual HUD Panel) */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Streamlined search & quick operational categories tag HUD */}
          <div className="bg-[#08080a] border border-white/10 p-3 rounded-sm flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-md">
            <div className="flex-grow relative">
              <span className="absolute left-3 top-2 text-white/30">
                <Search className="w-3.5 h-3.5" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') setActiveSearch(searchQuery);
                }}
                placeholder="Tactical search surrounding terrain, parks, forests..."
                className="w-full bg-[#040405] border border-white/10 rounded-sm py-1.5 pl-9 pr-4 text-[10px] text-white placeholder-white/20 focus:outline-none focus:border-gym-accent/50 font-mono font-bold"
              />
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => setActiveSearch(searchQuery)}
                className="px-3 py-1.5 bg-gym-accent hover:bg-gym-accent/95 text-black text-[9px] font-black uppercase tracking-wider font-mono rounded-sm cursor-pointer select-none"
              >
                CALIBRATE SEARCH
              </button>
              {activeSearch && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setActiveSearch('');
                    setFoundPlaces([]);
                    setActiveCategoryType(null);
                  }}
                  className="px-2 py-1.5 bg-white/5 border border-white/15 hover:bg-white/10 text-white text-[9px] font-mono uppercase font-black tracking-wider rounded-sm cursor-pointer"
                >
                  X
                </button>
              )}
            </div>
          </div>

          {/* Interactive Google Map Visual frame */}
          <div className="bg-[#08080a] border border-white/10 rounded-sm p-1.5 relative shadow-2xl">
            
            {/* Active map deployment modes HUD */}
            {waypointMode !== 'NONE' && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-gym-accent text-black font-mono font-black text-[9px] px-3 py-1.5 rounded-sm uppercase tracking-wider animate-pulse border border-black/25 shadow-lg">
                [ TACTICAL VECTOR PLOT ACTIVE ]: SELECT COORDINATE ON MAP FOR {waypointMode}
              </div>
            )}

            <APIProvider apiKey={activeKey} version="weekly">
              <div className="w-full relative h-[560px] rounded-sm bg-[#040405] overflow-hidden">
                <Map
                  defaultCenter={mapCenter}
                  defaultZoom={13}
                  gestureHandling="greedy"
                  mapId="TACTICAL_CONSOLE_MAP"
                  options={{
                    disableDefaultUI: true,
                    zoomControl: true,
                    styles: tacticalMinimalDarkStyles
                  }}
                  onClick={handleMapClick}
                  internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                  style={{ width: '100%', height: '100%' }}
                >
                  {/* Map center controller helper */}
                  <MapRefresher center={mapCenter} />

                  {/* Start Point Marker (Alpha) */}
                  {originCoord && (
                    <AdvancedMarker 
                      position={originCoord}
                      title="Route Start Point"
                    >
                      <div className="flex flex-col items-center justify-center select-none">
                        <Pin background="#10b981" borderColor="#ffffff" glyphColor="#ffffff" glyph="S" />
                        <div className="mt-0.5 px-1 bg-black/90 text-[#10b981] font-mono text-[8px] font-extrabold uppercase tracking-widest rounded border border-[#10b981]/30 shadow-md whitespace-nowrap">
                          START
                        </div>
                      </div>
                    </AdvancedMarker>
                  )}

                  {/* Destination Gate Marker (Omega) */}
                  {destCoord && (
                    <AdvancedMarker 
                      position={destCoord}
                      title="Route Finish Point"
                    >
                      <div className="flex flex-col items-center justify-center select-none">
                        <Pin background="#ef4444" borderColor="#ffffff" glyphColor="#ffffff" glyph="F" />
                        <div className="mt-0.5 px-1 bg-black/90 text-[#ef4444] font-mono text-[8px] font-extrabold uppercase tracking-widest rounded border border-[#ef4444]/30 shadow-md whitespace-nowrap">
                          FINISH
                        </div>
                      </div>
                    </AdvancedMarker>
                  )}

                  {/* Custom middle waypoints markers */}
                  {middleWaypoints.map((wp, idx) => (
                    <AdvancedMarker 
                      key={idx} 
                      position={wp} 
                      title={`Checkpoint Milestone ${idx + 1}`}
                    >
                      <div className="flex items-center justify-center relative select-none">
                        <span className="absolute animate-ping inline-flex h-5 w-5 rounded-full bg-gym-accent/30 opacity-60"></span>
                        <div className="relative w-6 h-6 rounded-full bg-[#08080a] border border-gym-accent/90 text-[10px] text-gym-accent font-mono font-black flex items-center justify-center font-extrabold shadow-md cursor-pointer hover:scale-110 transition-transform">
                          {idx + 1}
                        </div>
                      </div>
                    </AdvancedMarker>
                  ))}

                  {/* Traversal simulation drone */}
                  {simulatedLatLng && (
                    <AdvancedMarker 
                      position={simulatedLatLng}
                      title="Active Traversal Sentinel"
                    >
                      <div className="relative flex items-center justify-center select-none">
                        <span className="absolute animate-ping inline-flex h-7 w-7 rounded-full bg-gym-accent/35 opacity-70"></span>
                        <div className="relative w-7 h-7 rounded-full bg-black border border-gym-accent text-gym-accent flex items-center justify-center shadow-lg">
                          <Navigation className="w-3.5 h-3.5 transform rotate-180" />
                        </div>
                      </div>
                    </AdvancedMarker>
                  )}

                  {/* Search places locations markers */}
                  {foundPlaces.map((place) => {
                    if (!place.location) return null;
                    const pos = getSafeLatLng(place.location);
                    const catDetails = getCategoryIconDetails(activeCategoryType);
                    const IconComponent = catDetails.icon;
                    return (
                      <AdvancedMarker
                        key={place.id}
                        position={pos}
                        onClick={() => {
                          setSelectedPlace(place);
                          setMapCenter(pos);
                        }}
                      >
                        <div 
                          className="w-7 h-7 rounded-full border border-slate-950 flex items-center justify-center cursor-pointer shadow-lg transition-transform hover:scale-110"
                          style={{ backgroundColor: catDetails.color }}
                          title={place.displayName}
                        >
                          <IconComponent className="w-3.5 h-3.5 text-slate-950 stroke-[2.5]" />
                        </div>
                      </AdvancedMarker>
                    );
                  })}

                  {/* Info Window for selected search place */}
                  {selectedPlace && selectedPlace.location && (
                    <InfoWindow
                      position={getSafeLatLng(selectedPlace.location)}
                      onCloseClick={() => setSelectedPlace(null)}
                      headerDisabled
                    >
                      <div className="bg-slate-950 text-white p-3 space-y-1.5 rounded border border-white/10 font-sans text-xs max-w-[210px] shadow-2xl">
                        <h4 className="font-bold font-mono text-emerald-400 uppercase tracking-tight">{selectedPlace.displayName}</h4>
                        <p className="text-[10px] text-white/50 leading-relaxed">{selectedPlace.formattedAddress}</p>
                        
                        <div className="flex flex-col gap-1.5 pt-1.5 border-t border-white/5">
                          <button
                            onClick={() => {
                              handleAutoSelectPlace(selectedPlace);
                              setSelectedPlace(null);
                            }}
                            className="w-full py-1 bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-wider text-[8px] rounded-sm text-center cursor-pointer flex items-center justify-center gap-1 transition-all"
                          >
                            ⚡ PLOT OPTIMIZED ROUTE
                          </button>
                          
                          <div className="flex gap-1.5">
                            <button
                              onClick={() => {
                                if (selectedPlace.location) {
                                  const latLng = getSafeLatLng(selectedPlace.location);
                                  if (activePreset && !customDestination) {
                                    setCustomDestination(activePreset.destination);
                                  }
                                  setActivePreset(null);
                                  setCustomOrigin(latLng);
                                  setSelectedPlace(null);
                                }
                              }}
                              className="flex-1 py-1 bg-gym-accent hover:bg-gym-accent/90 text-black font-bold uppercase rounded-sm text-[8px] transition-all cursor-pointer"
                            >
                              Set Start
                            </button>
                            <button
                              onClick={() => {
                                if (selectedPlace.location) {
                                  const latLng = getSafeLatLng(selectedPlace.location);
                                  if (activePreset && !customOrigin) {
                                    setCustomOrigin(activePreset.origin);
                                  }
                                  setActivePreset(null);
                                  setCustomDestination(latLng);
                                  setSelectedPlace(null);
                                }
                              }}
                              className="flex-1 py-1 bg-purple-500 hover:bg-purple-600 text-white font-bold uppercase rounded-sm text-[8px] transition-all cursor-pointer"
                            >
                              Set End
                            </button>
                          </div>
                        </div>
                      </div>
                    </InfoWindow>
                  )}

                  {/* Standard calibration background logic */}
                  <RouteTracker 
                    origin={originCoord} 
                    destination={destCoord} 
                    middleWaypoints={middleWaypoints}
                    shouldLoopBack={shouldLoopBack}
                    onStatsCalibrated={handleStatsCalibrated} 
                    routingEngine={routingEngine}
                  />

                  {/* Search loader connector */}
                  {activeSearch && (
                    <LocalPlacesSearch 
                      query={activeSearch} 
                      onPlacesFound={(places) => setFoundPlaces(places)} 
                      setSearchLoading={setSearchLoading}
                    />
                  )}
                </Map>

                {/* Elevation Scanner Embedded Overlay */}
                {pathPoints.length > 0 && (
                  <div className="absolute bottom-4 right-4 z-20 w-[240px] bg-black/90 border border-white/10 p-3 rounded-sm backdrop-blur-md shadow-2xl space-y-1.5 pointer-events-auto">
                    <div className="flex items-center justify-between border-b border-white/10 pb-1">
                      <div className="flex items-center gap-1">
                        <span className="animate-pulse w-1.5 h-1.5 bg-gym-accent rounded-full block"></span>
                        <span className="text-[8px] text-white/50 font-mono font-black uppercase tracking-wider">📡 ELEVATION PROFILER</span>
                      </div>
                      <span className="text-[7.5px] text-gym-accent font-mono tracking-widest uppercase bg-gym-accent/10 px-1 border border-gym-accent/20 rounded-xs">
                        GAIN: {cumulativeGain}M
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[7px] text-white/40 font-mono">
                      <span>MIN: {(() => {
                        const valid = elevationProfile.filter(v => typeof v === 'number' && !isNaN(v));
                        return valid.length > 0 ? Math.min(...valid) : 0;
                      })()}m</span>
                      <span>MAX: {(() => {
                        const valid = elevationProfile.filter(v => typeof v === 'number' && !isNaN(v));
                        return valid.length > 0 ? Math.max(...valid) : 85;
                      })()}m</span>
                    </div>

                    {/* Compact SVG elevation profile graph */}
                    <div className="relative w-full h-[40px] bg-white/[0.01] border border-white/5 rounded-xs overflow-hidden">
                      <div className="absolute inset-x-0 top-1/2 border-t border-white/[0.03] border-dashed"></div>
                      <svg className="w-full h-full" viewBox="0 0 240 40" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="compactElevGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#00ffcc" stopOpacity="0.25" />
                            <stop offset="100%" stopColor="#00ffcc" stopOpacity="0" />
                          </linearGradient>
                        </defs>

                        {(() => {
                          const width = 240;
                          const height = 40;
                          const valid = elevationProfile.filter(v => typeof v === 'number' && !isNaN(v));
                          const min = valid.length > 0 ? Math.min(...valid) : 0;
                          const max = valid.length > 0 ? Math.max(...valid) : 85;
                          const range = max - min || 1;

                          const step = width / (elevationProfile.length - 1 || 1);
                          const pts = elevationProfile.map((val, idx) => {
                            const x = idx * step;
                            const y = height - 3 - (((val - min) / range) * (height - 6));
                            return { x: isNaN(x) ? 0 : x, y: isNaN(y) ? 0 : y };
                          });

                          const dLine = pts.reduce((acc, p, idx) => {
                            return acc + `${idx === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)} `;
                          }, '');

                          const dFill = dLine + `L ${width} ${height} L 0 ${height} Z`;

                          let runnerX = -1;
                          let runnerY = -1;
                          if (isTrailActive && trailElapsedTime > 0) {
                            const totalDurMins = parseFloat(routeDuration) || 15;
                            const totalSecs = Math.max(30, totalDurMins * 60);
                            const fraction = Math.min(1.0, trailElapsedTime / totalSecs);
                            const runnerIdx = Math.min(pts.length - 1, Math.floor(fraction * pts.length));
                            if (pts[runnerIdx]) {
                              runnerX = pts[runnerIdx].x;
                              runnerY = pts[runnerIdx].y;
                            }
                          } else if (isPlayingSimulation && currentStepIndexRef.current < pathPoints.length) {
                            const fraction = currentStepIndexRef.current / pathPoints.length;
                            const runnerIdx = Math.min(pts.length - 1, Math.floor(fraction * pts.length));
                            if (pts[runnerIdx]) {
                              runnerX = pts[runnerIdx].x;
                              runnerY = pts[runnerIdx].y;
                            }
                          }

                          return (
                            <>
                              <path d={dFill} fill="url(#compactElevGrad)" />
                              <path d={dLine} fill="none" stroke="#00ffcc" strokeWidth="1" strokeLinecap="round" />
                              {runnerX !== -1 && runnerY !== -1 && (
                                <>
                                  <line x1={runnerX} y1={0} x2={runnerX} y2={height} stroke="rgba(0, 255, 204, 0.2)" strokeWidth="0.7" strokeDasharray="2 2" />
                                  <circle cx={runnerX} cy={runnerY} r="2.5" fill="#00ffcc" />
                                </>
                              )}
                            </>
                          );
                        })()}
                      </svg>
                    </div>
                  </div>
                )}

                {searchLoading && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center gap-2 z-30">
                    <Loader2 className="w-6 h-6 text-gym-accent animate-spin" />
                    <span className="text-[10px] text-white tracking-widest uppercase font-mono">CALIBRATING MAP COORDINATES...</span>
                  </div>
                )}
              </div>
            </APIProvider>
          </div>

          {/* Collapsible/Sleek Places suggested list under the map */}
          {foundPlaces.length > 0 && (
            <div className="bg-[#08080a] border border-white/10 p-4 rounded-sm space-y-3 shadow-lg">
              <span className="text-[9px] text-white/50 font-mono font-bold uppercase tracking-wider block">SUGGESTED DISCOVERY POINTS INDICES ({foundPlaces.length})</span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {foundPlaces.slice(0, 6).map((place) => (
                  <div key={place.id} className="bg-white/[0.01] border border-white/5 p-2.5 rounded-sm flex flex-col justify-between shadow-md">
                    <div>
                      <span className="text-xs font-bold text-white block truncate">{place.displayName}</span>
                      <span className="text-[10px] text-white/40 block mt-1 line-clamp-1 leading-normal">{place.formattedAddress}</span>
                    </div>
                    
                    <div className="flex flex-col gap-1.5 mt-2.5 pt-1.5 border-t border-white/5">
                      <button
                        onClick={() => handleAutoSelectPlace(place)}
                        className="w-full py-1 bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-wider text-[8px] rounded-xs text-center cursor-pointer transition-all"
                      >
                        ⚡ AUTO-PLOT ROUTE
                      </button>
                      
                      <div className="grid grid-cols-2 gap-1.5">
                        <button
                          onClick={() => {
                            if (place.location) {
                              const latLng = getSafeLatLng(place.location);
                              if (activePreset && !customDestination) {
                                setCustomDestination(activePreset.destination);
                              }
                              setActivePreset(null);
                              setCustomOrigin(latLng);
                              setMapCenter(latLng);
                            }
                          }}
                          className="py-1 bg-gym-accent hover:bg-gym-accent/90 text-black font-black uppercase tracking-wider text-[8px] rounded-xs text-center cursor-pointer transition-all"
                        >
                          📍 Start
                        </button>
                        <button
                          onClick={() => {
                            if (place.location) {
                              const latLng = getSafeLatLng(place.location);
                              if (activePreset && !customOrigin) {
                                setCustomOrigin(activePreset.origin);
                              }
                              setActivePreset(null);
                              setCustomDestination(latLng);
                              setMapCenter(latLng);
                            }
                          }}
                          className="py-1 bg-purple-500 hover:bg-purple-600 text-white font-black uppercase tracking-wider text-[8px] rounded-xs text-center cursor-pointer transition-all"
                        >
                          🏁 End
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
