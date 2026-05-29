import React, { useState, useEffect, useRef, useMemo } from 'react';
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
  List
} from 'lucide-react';
import { 
  db, 
  auth, 
  doc, 
  setDoc, 
  serverTimestamp, 
  onSnapshot,
  onAuthStateChanged
} from '../lib/firebase';

const API_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
  '';

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
    id: 'ascent_patrol',
    name: 'Hazlehead Forest Loop',
    category: 'parks',
    origin: { lat: 57.1420, lng: -2.1700 }, // Hazlehead Park Area
    destination: { lat: 57.1465, lng: -2.1852 },
    originText: 'Hazlehead Pavilion',
    destinationText: 'Pine Wood Boundary',
    difficulty: 'EASY',
    kcalEstPerKm: 68,
    details: 'Scenic forest trails with wood sculptures and flat terrains.',
    trailType: 'Nature Recovery Ruck'
  },
  {
    id: 'central_intel',
    name: 'Duthie Park & Deeside Way',
    category: 'parks',
    origin: { lat: 57.1325, lng: -2.1030 }, // Duthie Park Winter Gardens
    destination: { lat: 57.1260, lng: -2.1332 },
    originText: 'Winter Gardens Portal',
    destinationText: 'Old Railroad Junction',
    difficulty: 'MEDIUM',
    kcalEstPerKm: 75,
    details: 'Paved trail following the historic railway path along the River Dee.',
    trailType: 'Base Aero Workout'
  },
  {
    id: 'haddo_country_park',
    name: 'Haddo House Country Park',
    category: 'parks',
    origin: { lat: 57.4042, lng: -2.2215 },
    destination: { lat: 57.3975, lng: -2.2155 },
    originText: 'Haddo House Entrance',
    destinationText: 'Pheasantry Wood Lake',
    difficulty: 'EASY',
    kcalEstPerKm: 65,
    details: 'Serene parklands, lime avenue, lake, and historical monuments.',
    trailType: 'Scenic Recover'
  },
  {
    id: 'glen_tanar_forest',
    name: 'Glen Tanar Forest Trail',
    category: 'parks',
    origin: { lat: 57.0625, lng: -2.8520 },
    destination: { lat: 57.0392, lng: -2.8810 },
    originText: 'Glen Tanar Visitor Centre',
    destinationText: 'Mount Keen Foothills Link',
    difficulty: 'HARD',
    kcalEstPerKm: 92,
    details: 'Intense remote run through ancient Caledonian forest paths & rocky glens.',
    trailType: 'Endurance Wilderness Quest'
  },
  {
    id: 'alpine_ridge',
    name: 'Balgownie Bridge & Donmouth',
    category: 'historical',
    origin: { lat: 57.1770, lng: -2.0835 }, // Brig o' Balgownie
    destination: { lat: 57.1695, lng: -2.0725 },
    originText: 'Brig o\' Balgownie',
    destinationText: 'Donmouth Nature Reserve',
    difficulty: 'HARD',
    kcalEstPerKm: 88,
    details: 'Historical cobblestones and coastal headwinds along the mouth of the River Don.',
    trailType: 'Tactical Windy Interval'
  },
  {
    id: 'dunnottar_castle_trail',
    name: 'Dunnottar Castle Coastal Path',
    category: 'historical',
    origin: { lat: 56.9691, lng: -2.2031 },
    destination: { lat: 56.9458, lng: -2.1972 },
    originText: 'Stonehaven Harbour',
    destinationText: 'Dunnottar Castle Cliff',
    difficulty: 'HARD',
    kcalEstPerKm: 90,
    details: 'Rugged cliffside adventure to the glorious medieval fortress ruin.',
    trailType: 'Coastal Fortress Ascent'
  },
  {
    id: 'crathes_castle_gardens',
    name: 'Crathes Castle Wood walks',
    category: 'historical',
    origin: { lat: 57.0620, lng: -2.4395 },
    destination: { lat: 57.0583, lng: -2.4452 },
    originText: 'Crathes Visitors Courtyard',
    destinationText: 'Coy Burn Mill Trail',
    difficulty: 'MEDIUM',
    kcalEstPerKm: 78,
    details: 'Enchanted woodland walk alongside the stunning 16th-century tower house gardens.',
    trailType: 'Heritage Rucking'
  },
  {
    id: 'tolquhon_castle_walk',
    name: 'Tolquhon Castle Estate Walk',
    category: 'historical',
    origin: { lat: 57.3488, lng: -2.2135 },
    destination: { lat: 57.3495, lng: -2.2148 },
    originText: 'Tolquhon Castle Gatehouse',
    destinationText: 'Castle Keep Courtyard',
    difficulty: 'EASY',
    kcalEstPerKm: 60,
    details: 'Enchanting level wildflower meadows around the magnificent late-medieval ruin.',
    trailType: 'Heritage Recovery Stroll'
  },
  {
    id: 'bennachie_mither_tap',
    name: 'Bennachie Mither Tap Ascent',
    category: 'trails',
    origin: { lat: 57.2862, lng: -2.4820 }, // Bennachie Visitor Centre
    destination: { lat: 57.2915, lng: -2.4835 }, // Mither Tap Summit
    originText: 'Bennachie Visitor Centre',
    destinationText: 'Mither Tap Summit Peak',
    difficulty: 'HARD',
    kcalEstPerKm: 95,
    details: 'Steep historic granite slopes leading to the ancient hillfort summit of Bennachie.',
    trailType: 'Peak Elevation Challenge'
  },
  {
    id: 'scolty_banchory',
    name: 'Scolty Hill Woodland Trail',
    category: 'trails',
    origin: { lat: 57.0425, lng: -2.5020 }, // Scolty Woods Car Park
    destination: { lat: 57.0375, lng: -2.5055 }, // Scolty Hill Monument
    originText: 'Scolty Woods Entry',
    destinationText: 'Scolty Tower Monument',
    difficulty: 'MEDIUM',
    kcalEstPerKm: 82,
    details: 'Beautiful mixed woodland climb with panoramic views of River Dee & Banchory.',
    trailType: 'Ascent Multi-terrain Interval'
  },
  {
    id: 'deeside_way_banchory',
    name: 'Deeside Way: Banchory Path',
    category: 'trails',
    origin: { lat: 57.0505, lng: -2.4930 },
    destination: { lat: 57.0592, lng: -2.4350 },
    originText: 'Banchory East Station',
    destinationText: 'Crathes Forest Link',
    difficulty: 'EASY',
    kcalEstPerKm: 72,
    details: 'Smooth flat multi-purpose former rail track trail ideal for pacing and splits.',
    trailType: 'Aerobic Pacing Run'
  }
];

export const getCategoryIconDetails = (catType: string | null) => {
  switch (catType) {
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

// Component to handle calculating and drawing the path using standard Route API
interface RouteTrackerProps {
  origin: google.maps.LatLngLiteral | null;
  destination: google.maps.LatLngLiteral | null;
  middleWaypoints: google.maps.LatLngLiteral[];
  shouldLoopBack: boolean;
  onStatsCalibrated: (dist: string, dur: string, pathPoints: google.maps.LatLngLiteral[]) => void;
}

function RouteTracker({ origin, destination, middleWaypoints, shouldLoopBack, onStatsCalibrated }: RouteTrackerProps) {
  const map = useMap();
  const routesLib = useMapsLibrary('routes');
  const polylinesRef = useRef<google.maps.Polyline[]>([]);

  // Safely serialize array for dependency safety
  const waypointsSerialized = JSON.stringify(middleWaypoints);

  useEffect(() => {
    if (!routesLib || !map || !origin || !destination) return;

    // Remove previous polylines
    polylinesRef.current.forEach(polyline => polyline.setMap(null));
    polylinesRef.current = [];

    const intermediates: any[] = [];

    // Add optional custom middle waypoints
    middleWaypoints.forEach(wp => {
      intermediates.push({
        location: wp,
        via: false
      });
    });

    let reqDestination = destination;
    const isSame = Math.abs(origin.lat - destination.lat) < 0.00001 && Math.abs(origin.lng - destination.lng) < 0.00001;

    if (shouldLoopBack) {
      // Loop back returns home to origin
      reqDestination = origin;
      // Far point added to intermediates list
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
        if (routes && routes[0]) {
          const route = routes[0];
          // Create themed line and style via standard setOptions method to bypass type limitations
          const newPolylines = route.createPolylines();
          newPolylines.forEach(p => {
            p.setOptions({
              strokeColor: '#00ffcc',
              strokeOpacity: 0.85,
              strokeWeight: 6,
            });
            p.setMap(map);
          });
          polylinesRef.current = newPolylines;

          // Convert string formats
          const distanceKm = route.distanceMeters ? (route.distanceMeters / 1000).toFixed(2) + ' KM' : 'N/A';
          
          // Safely parse duration supporting both string and number types
          const durationVal = typeof route.durationMillis === 'string' 
            ? parseInt(route.durationMillis) 
            : (route.durationMillis as number || 0);

          const durationMins = durationVal ? Math.ceil(durationVal / 60000) + ' MINS' : 'N/A';

          // Extract path points for active runner GPS simulation as plain LatLngLiterals
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
        console.error("Path calculation failed:", err);
      });

    return () => {
      polylinesRef.current.forEach(p => p.setMap(null));
    };
  }, [routesLib, map, origin, destination, waypointsSerialized, shouldLoopBack]);

  return null;
}

export default function TacticalMap() {
  const [dynamicApiKey, setDynamicApiKey] = useState<string>('');
  const [isKeyLoading, setIsKeyLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch('/api/maps-key')
      .then(res => res.json())
      .then(data => {
        if (data && data.key) {
          setDynamicApiKey(data.key);
        } else {
          setDynamicApiKey(API_KEY);
        }
        setIsKeyLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch maps API key from server:", err);
        setDynamicApiKey(API_KEY);
        setIsKeyLoading(false);
      });
  }, []);

  const [activePreset, setActivePreset] = useState<typeof PRESET_TRAILS[0] | null>(PRESET_TRAILS[0]);
  const [customOrigin, setCustomOrigin] = useState<google.maps.LatLngLiteral | null>(null);
  const [customDestination, setCustomDestination] = useState<google.maps.LatLngLiteral | null>(null);
  
  // Custom intermediate waypoints and loop back option states
  const [shouldLoopBack, setShouldLoopBack] = useState<boolean>(true);
  const [middleWaypoints, setMiddleWaypoints] = useState<google.maps.LatLngLiteral[]>([]);

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

  // Real-time synchronization of bodyweight settings for metabolic calculations
  useEffect(() => {
    let unsubscribeSnap: (() => void) | null = null;
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      // Clear previous snapshot listener if user status changed
      if (unsubscribeSnap) {
        unsubscribeSnap();
        unsubscribeSnap = null;
      }
      if (!user) {
        setUserWeight(75);
        return;
      }
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
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeSnap) unsubscribeSnap();
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
  const [mapCenter, setMapCenter] = useState<google.maps.LatLngLiteral>({ lat: 57.1420, lng: -2.1700 });
  const [selectedPlace, setSelectedPlace] = useState<google.maps.places.Place | null>(null);
  const [activeCategoryType, setActiveCategoryType] = useState<'parks' | 'trails' | 'historical' | null>(null);
  const [activeDifficultyFilter, setActiveDifficultyFilter] = useState<'ALL' | 'EASY' | 'MEDIUM' | 'HARD'>('ALL');

  // Auto-select first preset of chosen category & difficulty when changed
  useEffect(() => {
    if (activeCategoryType) {
      const match = PRESET_TRAILS.find(
        p => p.category === activeCategoryType && 
        (activeDifficultyFilter === 'ALL' || p.difficulty === activeDifficultyFilter)
      ) || PRESET_TRAILS.find(p => p.category === activeCategoryType);

      if (match) {
        handlePresetSelect(match);
      }
    }
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

  const handleStatsCalibrated = (dist: string, dur: string, points: google.maps.LatLngLiteral[]) => {
    setRouteDistance(dist);
    setRouteDuration(dur);
    setPathPoints(points);
  };

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
    setMiddleWaypoints([]); // Reset middle checkpoints on new preset select
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

  const activeKey = dynamicApiKey || API_KEY;
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
    return PRESET_TRAILS.filter((trail) => {
      const matchesCategory = !activeCategoryType || trail.category === activeCategoryType;
      const matchesDifficulty = activeDifficultyFilter === 'ALL' || trail.difficulty === activeDifficultyFilter;
      return matchesCategory && matchesDifficulty;
    });
  }, [activeCategoryType, activeDifficultyFilter]);

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
    setActivePreset(PRESET_TRAILS[0]);
    stopSimulation();
    if (trailTimerRef.current) {
      clearInterval(trailTimerRef.current);
      trailTimerRef.current = null;
    }
    setIsTrailActive(false);
    setTrailCompleted(false);
  };

  // Helper to remove custom waypoints
  const handleRemoveWaypoint = (idx: number) => {
    setMiddleWaypoints(prev => prev.filter((_, i) => i !== idx));
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

            {(customOrigin || customDestination || middleWaypoints.length > 0) && (
              <button
                onClick={handleClearCustomRoute}
                className="w-full py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/10 hover:border-red-500/25 text-[8px] font-mono uppercase tracking-wider rounded-sm transition-all"
              >
                RESTORE DEFAULT PATROL
              </button>
            )}
          </div>

          {/* Section C: Preset Trail Explorer */}
          <div className="bg-[#08080a] border border-white/10 p-4 rounded-sm space-y-3 shadow-lg relative">
            <span className="text-[10px] text-white/80 font-mono font-bold uppercase tracking-wider block">TRAIL PRESETS</span>
            
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

              {/* Categorical filters dropdown */}
              <div className="flex items-center gap-1.5 mt-1.5">
                <span className="text-[7.5px] text-white/40 font-mono uppercase shrink-0">SECTOR:</span>
                <div className="flex gap-1 overflow-x-auto no-scrollbar width-full">
                  {[
                    { id: null, label: 'ALL' },
                    { id: 'trails', label: 'TRAILS' },
                    { id: 'parks', label: 'PARKS' },
                    { id: 'historical', label: 'HISTORIC' }
                  ].map((cat) => (
                    <button
                      key={cat.label}
                      onClick={() => setActiveCategoryType(cat.id as any)}
                      className={`px-1.5 py-0.5 text-[7.5px] font-mono rounded-xs border transition-all ${
                        activeCategoryType === cat.id
                          ? 'bg-white/10 border-white/20 text-white font-bold'
                          : 'bg-transparent border-transparent text-white/45'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Micro dropdown presets list to make map screen highly efficient */}
            <div className="space-y-1.5">
              <label className="text-[7.5px] text-white/55 font-mono uppercase tracking-wider block">ROUTE DIRECTORY ({matchingTrails.length}):</label>
              <select
                value={activePreset?.id || ""}
                onChange={(e) => {
                  const matched = PRESET_TRAILS.find(t => t.id === e.target.value);
                  if (matched) handlePresetSelect(matched);
                }}
                className="w-full bg-[#030304] border border-white/5 rounded-xs p-2 text-xs text-white focus:outline-none focus:border-gym-accent/50 font-mono text-[10px]"
              >
                {matchingTrails.length === 0 ? (
                  <option value="">No matching ranges</option>
                ) : (
                  matchingTrails.map((trail) => (
                    <option key={trail.id} value={trail.id}>
                      [{trail.difficulty}] {trail.name} — {trail.trailType}
                    </option>
                  ))
                )}
              </select>

              {activePreset && (
                <div className="bg-white/[0.01] border border-white/5 p-2 rounded-sm text-[9.5px] font-mono text-white/70 space-y-1">
                  <p className="leading-tight"><span className="text-gym-accent uppercase tracking-wider font-extrabold mr-1">[DESCR]:</span>{activePreset.details}</p>
                </div>
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
                      title="Origin Vector Alpha"
                    >
                      <Pin background="#00ffcc" borderColor="#000" glyphColor="#000" />
                    </AdvancedMarker>
                  )}

                  {/* Destination Gate Marker (Omega) */}
                  {destCoord && (
                    <AdvancedMarker 
                      position={destCoord}
                      title="Destination Vector Gate"
                    >
                      <Pin background="#a855f7" borderColor="#000" glyphColor="#fff" />
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
