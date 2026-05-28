import React, { useState, useEffect, useRef } from 'react';
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
  Locate
} from 'lucide-react';

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
    id: 'alpine_ridge',
    name: 'Balgownie Bridge & Donmouth',
    origin: { lat: 57.1770, lng: -2.0835 }, // Brig o' Balgownie
    destination: { lat: 57.1695, lng: -2.0725 },
    originText: 'Brig o\' Balgownie',
    destinationText: 'Donmouth Nature Reserve',
    difficulty: 'HARD',
    kcalEstPerKm: 88,
    details: 'Historical cobblestones and coastal headwinds along the mouth of the River Don.',
    trailType: 'Tactical Windy Interval'
  }
];

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
            const loc = places[0].location;
            const lat = loc.lat();
            const lng = loc.lng();
            map.setCenter({ lat, lng });
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
  onStatsCalibrated: (dist: string, dur: string, pathPoints: google.maps.LatLngLiteral[]) => void;
}

function RouteTracker({ origin, destination, onStatsCalibrated }: RouteTrackerProps) {
  const map = useMap();
  const routesLib = useMapsLibrary('routes');
  const polylinesRef = useRef<google.maps.Polyline[]>([]);

  useEffect(() => {
    if (!routesLib || !map || !origin || !destination) return;

    // Remove previous polylines
    polylinesRef.current.forEach(polyline => polyline.setMap(null));
    polylinesRef.current = [];

    routesLib.Route.computeRoutes({
      origin,
      destination,
      travelMode: 'WALKING',
      fields: ['path', 'distanceMeters', 'durationMillis', 'viewport']
    })
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
  }, [routesLib, map, origin, destination]);

  return null;
}

export default function TacticalMap() {
  const [activePreset, setActivePreset] = useState<typeof PRESET_TRAILS[0] | null>(PRESET_TRAILS[0]);
  const [customOrigin, setCustomOrigin] = useState<google.maps.LatLngLiteral | null>(null);
  const [customDestination, setCustomDestination] = useState<google.maps.LatLngLiteral | null>(null);
  
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
  const [waypointMode, setWaypointMode] = useState<'NONE' | 'ORIGIN' | 'DESTINATION'>('NONE');

  // Simulation runner animation states
  const [isPlayingSimulation, setIsPlayingSimulation] = useState(false);
  const [simulatedLatLng, setSimulatedLatLng] = useState<google.maps.LatLngLiteral | null>(null);
  const simulationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const currentStepIndexRef = useRef<number>(0);

  // Map state to control center
  const [mapCenter, setMapCenter] = useState<google.maps.LatLngLiteral>({ lat: 57.1420, lng: -2.1700 });
  const [selectedPlace, setSelectedPlace] = useState<google.maps.places.Place | null>(null);

  useEffect(() => {
    // Reset simulation when path points change
    stopSimulation();
  }, [pathPoints]);

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
    setActivePreset(preset);
    setCustomOrigin(null);
    setCustomDestination(null);
    setMapCenter(preset.origin);
  };

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return;
    const clickedLatLng = { lat: e.latLng.lat(), lng: e.latLng.lng() };

    if (waypointMode === 'ORIGIN') {
      setActivePreset(null);
      setCustomOrigin(clickedLatLng);
      setWaypointMode('NONE');
    } else if (waypointMode === 'DESTINATION') {
      setActivePreset(null);
      setCustomDestination(clickedLatLng);
      setWaypointMode('NONE');
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

  // Safe verification display of API KEY
  if (!hasValidKey) {
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h3 className="text-2xl font-light italic font-serif text-white tracking-wide">Outdoor Tactical Range Mapping</h3>
          <p className="text-xs text-white uppercase tracking-[0.25em] font-bold mt-1">Biochemical Traversal Calibration &amp; Route Discovery</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={triggerCurrentLocation}
            className="px-4 py-2 bg-white/5 border border-white/10 hover:border-gym-accent/40 text-white text-[10px] font-black uppercase tracking-wider font-mono rounded-sm flex items-center gap-2 transition-all cursor-pointer select-none"
          >
            <Locate className="w-3.5 h-3.5 text-gym-accent" />
            SYNCHRONIZE CURRENT COORDINATES
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Navigation / Tactical Setup Panel */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Active Status metrics */}
          <div className="bg-black/85 border border-white/10 p-5 rounded-sm space-y-4 backdrop-blur-md">
            <span className="text-[9px] text-white/60 font-black uppercase tracking-[0.25em] font-mono block">TACTICAL METRICS</span>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/[0.02] border border-white/5 p-3 rounded-sm">
                <span className="text-[8px] text-white/40 font-mono uppercase block">TOTAL RANGE</span>
                <span className="text-lg font-bold text-gym-accent font-mono tracking-tight block">{routeDistance}</span>
              </div>
              <div className="bg-white/[0.02] border border-white/5 p-3 rounded-sm">
                <span className="text-[8px] text-white/40 font-mono uppercase block">DURATION</span>
                <span className="text-lg font-bold text-white font-mono tracking-tight block">{routeDuration}</span>
              </div>
            </div>

            <div className="bg-white/[0.02] border border-white/5 p-4 rounded-sm flex items-center justify-between gap-2">
              <div className="space-y-0.5">
                <span className="text-[8px] text-white/40 font-mono uppercase block">ESTIMATED EXPENDITURE</span>
                <span className="text-xl font-black text-white font-mono tracking-tight">{calculateKcal()} KCAL</span>
              </div>
              <div className="w-10 h-10 rounded-sm bg-gym-accent/5 border border-gym-accent/15 flex items-center justify-center">
                <Flame className="w-5 h-5 text-gym-accent animate-pulse" />
              </div>
            </div>

            {pathPoints.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-white/5">
                <span className="text-[8px] text-white/45 font-mono uppercase block">Simulated Traversal</span>
                <div className="flex gap-2">
                  {!isPlayingSimulation ? (
                    <button
                      onClick={startSimulation}
                      className="flex-1 py-1.5 bg-gym-accent hover:bg-gym-accent/90 text-black text-[9px] font-black uppercase tracking-wider rounded-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Play className="w-3 h-3 fill-black text-black" />
                      SIMULATE RUNNER
                    </button>
                  ) : (
                    <button
                      onClick={stopSimulation}
                      className="flex-1 py-1.5 bg-red-500 hover:bg-red-600 text-white text-[9px] font-black uppercase tracking-wider rounded-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Square className="w-3 h-3 fill-white text-white" />
                      HALT TRAVERSAL
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Preset Outdoor Modules */}
          <div className="bg-black/85 border border-white/10 p-5 rounded-sm space-y-3 backdrop-blur-md">
            <span className="text-[9px] text-white/60 font-black uppercase tracking-[0.25em] font-mono block">PRESET SCENIC RANGES</span>
            
            <div className="space-y-2.5">
              {PRESET_TRAILS.map((trail) => {
                const isActive = activePreset?.id === trail.id;
                return (
                  <button
                    key={trail.id}
                    onClick={() => handlePresetSelect(trail)}
                    className={`w-full text-left p-3.5 rounded-sm border transition-all cursor-pointer block ${
                      isActive 
                        ? 'bg-gym-accent/5 border-gym-accent/40 text-white' 
                        : 'bg-white/[0.02] border-white/5 text-white/75 hover:border-white/20'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-bold font-mono tracking-wide block">{trail.name}</span>
                      <span className={`text-[8px] px-1.5 py-0.5 font-bold font-mono rounded-full ${
                        trail.difficulty === 'HARD' ? 'bg-red-500/10 text-red-500 border border-red-500/15' :
                        trail.difficulty === 'MEDIUM' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/15' :
                        'bg-emerald-500/10 text-emerald-500 border border-emerald-500/15'
                      }`}>
                        {trail.difficulty}
                      </span>
                    </div>
                    <span className="text-[9px] text-white/40 block mt-1">{trail.trailType} — {trail.details}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Waypoint Calibration */}
          <div className="bg-black/85 border border-white/10 p-5 rounded-sm space-y-4 backdrop-blur-md">
            <span className="text-[9px] text-white/60 font-black uppercase tracking-[0.25em] font-mono block">CUSTOM WAYPOINT PLACEMENT</span>
            <p className="text-[10px] text-white/45 leading-relaxed font-sans">
              Deploy custom tactical starting/ending Coordinates by selecting a checkpoint parameter below and tapping a vector target on the Map.
            </p>

            <div className="space-y-2">
              <button
                onClick={() => setWaypointMode(waypointMode === 'ORIGIN' ? 'NONE' : 'ORIGIN')}
                className={`w-full py-2 border text-[9px] font-black uppercase tracking-wider font-mono rounded-sm transition-all cursor-pointer ${
                  waypointMode === 'ORIGIN' 
                    ? 'bg-gym-accent/20 border-gym-accent text-white' 
                    : 'bg-white/5 border-white/10 text-white/60 hover:border-white/20'
                }`}
              >
                {waypointMode === 'ORIGIN' ? 'Click on map...' : '📍 Tap custom start point'}
              </button>

              <button
                onClick={() => setWaypointMode(waypointMode === 'DESTINATION' ? 'NONE' : 'DESTINATION')}
                className={`w-full py-2 border text-[9px] font-black uppercase tracking-wider font-mono rounded-sm transition-all cursor-pointer ${
                  waypointMode === 'DESTINATION' 
                    ? 'bg-gym-accent/20 border-gym-accent text-white' 
                    : 'bg-white/5 border-white/10 text-white/60 hover:border-white/20'
                }`}
              >
                {waypointMode === 'DESTINATION' ? 'Click on map...' : '🏁 Tap custom end point'}
              </button>
            </div>
          </div>

        </div>

        {/* Dynamic Map Window & Discovery Grid */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Quick search overlays */}
          <div className="bg-black/85 border border-white/10 p-4 rounded-sm flex flex-col sm:flex-row sm:items-center gap-3 backdrop-blur-md w-full">
            <div className="relative flex-1">
              <span className="absolute left-3 top-2.5 text-white/30">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') setActiveSearch(searchQuery);
                }}
                placeholder="Search surrounding parks, military paths, or athletic fields..."
                className="w-full bg-[#050505] border border-white/10 rounded-sm py-2 pl-9 pr-4 text-xs text-white placeholder-white/25 focus:outline-none focus:border-gym-accent/60 font-sans"
              />
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => setActiveSearch(searchQuery)}
                className="px-4 py-2 bg-gym-accent hover:bg-gym-accent/90 text-black text-[10px] font-black uppercase tracking-wider font-mono rounded-sm transition-all cursor-pointer select-none"
              >
                CALIBRATE AREA
              </button>
              {activeSearch && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setActiveSearch('');
                    setFoundPlaces([]);
                  }}
                  className="px-3 py-2 bg-white/5 border border-white/10 hover:border-white/20 text-white text-[10px] font-black uppercase tracking-wider font-mono rounded-sm transition-all cursor-pointer"
                >
                  CLEAR
                </button>
              )}
            </div>
          </div>

          {/* Quick region jumps (like Aberdeen, Scotland) */}
          <div className="bg-black/85 border border-white/10 p-3.5 rounded-sm flex flex-wrap items-center gap-2 backdrop-blur-md">
            <span className="text-[10px] text-white/50 tracking-wider font-mono font-bold uppercase mr-1">ABERDEEN SECTOR JUMPS:</span>
            {[
              { name: 'Aberdeen City Centre', lat: 57.1497, lng: -2.0943 },
              { name: 'Hazlehead Forest Sector', lat: 57.1420, lng: -2.1700 },
              { name: 'Duthie Park Sector', lat: 57.1325, lng: -2.1030 },
              { name: 'Donmouth Nature Sector', lat: 57.1770, lng: -2.0835 }
            ].map((jump) => (
              <button
                key={jump.name}
                onClick={() => {
                  setMapCenter({ lat: jump.lat, lng: jump.lng });
                  setCustomOrigin({ lat: jump.lat, lng: jump.lng });
                  setCustomDestination({ lat: jump.lat + 0.012, lng: jump.lng + 0.012 });
                  setActivePreset(null);
                }}
                className="px-3 py-1 bg-white/5 hover:bg-gym-accent hover:text-black border border-white/5 hover:border-gym-accent text-white/70 text-[9px] font-mono tracking-wider uppercase rounded-sm transition-all cursor-pointer"
              >
                {jump.name}
              </button>
            ))}
          </div>

          {/* Google Interactive Map View */}
          <div className="bg-black/80 border border-white/10 rounded-sm p-2 relative">
            
            {/* Overlay instruction */}
            {waypointMode !== 'NONE' && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-gym-accent text-black font-mono font-black text-[10px] px-4 py-2 rounded-sm uppercase tracking-wider animate-pulse border border-black/25">
                [ TACTICAL MAP ACTIVE ]: SELECT CURRENT LOCATION VECTOR FOR {waypointMode}
              </div>
            )}

            <APIProvider apiKey={API_KEY} version="weekly">
              <div className="w-full relative h-[640px] rounded-sm bg-[#050505] overflow-hidden">
                <Map
                  defaultCenter={mapCenter}
                  center={mapCenter}
                  defaultZoom={13}
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
                  
                  {/* Origin Landmark Checkpoint */}
                  {originCoord && (
                    <AdvancedMarker 
                      position={originCoord}
                      title="Origin Vector Alpha"
                    >
                      <Pin background="#00ffcc" borderColor="#000" glyphColor="#000" />
                    </AdvancedMarker>
                  )}

                  {/* Destination Landmark Checkpoint */}
                  {destCoord && (
                    <AdvancedMarker 
                      position={destCoord}
                      title="Destination Vector Gate"
                    >
                      <Pin background="#a855f7" borderColor="#000" glyphColor="#fff" />
                    </AdvancedMarker>
                  )}

                  {/* Simulated traversal operative avatar */}
                  {simulatedLatLng && (
                    <AdvancedMarker 
                      position={simulatedLatLng}
                      title="Tactical Drone Traversal"
                    >
                      <div className="relative flex items-center justify-center">
                        <span className="absolute animate-ping inline-flex h-8 w-8 rounded-full bg-gym-accent/40 opacity-75"></span>
                        <div className="relative w-8 h-8 rounded-full bg-black border border-gym-accent text-gym-accent flex items-center justify-center">
                          <Navigation className="w-4 h-4 transform rotate-180" />
                        </div>
                      </div>
                    </AdvancedMarker>
                  )}

                  {/* Render Custom dynamic search Places found */}
                  {foundPlaces.map((place) => {
                    const isSelected = selectedPlace?.id === place.id;
                    return (
                      <AdvancedMarker
                        key={place.id}
                        position={place.location}
                        onClick={() => {
                          setSelectedPlace(place);
                          if (place.location) {
                            setMapCenter({ lat: place.location.lat(), lng: place.location.lng() });
                          }
                        }}
                      >
                        <div className="w-5 h-5 rounded-full border-2 border-slate-950 bg-amber-500 flex items-center justify-center cursor-pointer shadow">
                          <MapPin className="w-2.5 h-2.5 text-black" />
                        </div>
                      </AdvancedMarker>
                    );
                  })}

                  {/* Info Window for Selected Places search */}
                  {selectedPlace && selectedPlace.location && (
                    <InfoWindow
                      position={selectedPlace.location}
                      onCloseClick={() => setSelectedPlace(null)}
                      headerDisabled
                    >
                      <div className="bg-slate-950 text-white p-3 space-y-2 rounded border border-white/10 font-sans text-xs max-w-[200px]">
                        <h4 className="font-bold font-mono text-emerald-400 uppercase tracking-tight">{selectedPlace.displayName}</h4>
                        <p className="text-[10px] text-white/50">{selectedPlace.formattedAddress}</p>
                        <div className="flex gap-2 pt-1 border-t border-white/5">
                          <button
                            onClick={() => {
                              if (selectedPlace.location) {
                                const latLng = { lat: selectedPlace.location.lat(), lng: selectedPlace.location.lng() };
                                setActivePreset(null);
                                setCustomOrigin(latLng);
                                setSelectedPlace(null);
                              }
                            }}
                            className="px-1.5 py-1 bg-gym-accent text-black font-bold uppercase rounded-sm text-[8px]"
                          >
                            Set Start
                          </button>
                          <button
                            onClick={() => {
                              if (selectedPlace.location) {
                                const latLng = { lat: selectedPlace.location.lat(), lng: selectedPlace.location.lng() };
                                setActivePreset(null);
                                setCustomDestination(latLng);
                                setSelectedPlace(null);
                              }
                            }}
                            className="px-1.5 py-1 bg-[#a855f7] text-white font-bold uppercase rounded-sm text-[8px]"
                          >
                            Set End
                          </button>
                        </div>
                      </div>
                    </InfoWindow>
                  )}

                  {/* API Component integration for Routes drawing */}
                  <RouteTracker 
                    origin={originCoord} 
                    destination={destCoord} 
                    onStatsCalibrated={handleStatsCalibrated} 
                  />

                  {/* Places search connector */}
                  {activeSearch && (
                    <LocalPlacesSearch 
                      query={activeSearch} 
                      onPlacesFound={(places) => setFoundPlaces(places)} 
                      setSearchLoading={setSearchLoading}
                    />
                  )}

                </Map>

                {searchLoading && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center gap-3 z-30">
                    <Loader2 className="w-8 h-8 text-gym-accent animate-spin" />
                    <span className="text-xs text-white tracking-widest uppercase font-mono">Calibrating Local Spots...</span>
                  </div>
                )}
              </div>
            </APIProvider>
          </div>

          {/* Quick Stats Overviews for Places found near Search */}
          {foundPlaces.length > 0 && (
            <div className="bg-black/85 border border-white/10 p-5 rounded-sm space-y-4 backdrop-blur-md">
              <span className="text-[9px] text-white/60 font-black uppercase tracking-[0.25em] font-mono block">SUGGESTED DISCOVERY POINTS IN VIEWPORT ({foundPlaces.length})</span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {foundPlaces.slice(0, 6).map((place) => (
                  <div key={place.id} className="bg-white/[0.02] border border-white/5 p-3 rounded-sm flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-bold text-white block truncate">{place.displayName}</span>
                      <span className="text-[10px] text-white/40 block mt-1 line-clamp-2">{place.formattedAddress}</span>
                    </div>
                    <div className="flex gap-2 mt-3.5 pt-2 border-t border-white/5">
                      <button
                        onClick={() => {
                          if (place.location) {
                            const latLng = { lat: place.location.lat(), lng: place.location.lng() };
                            setActivePreset(null);
                            setCustomOrigin(latLng);
                            setMapCenter(latLng);
                          }
                        }}
                        className="flex-1 py-1 bg-gym-accent text-black font-black uppercase tracking-wider text-[8px] rounded-sm text-center cursor-pointer"
                      >
                        📍 Start Point
                      </button>
                      <button
                        onClick={() => {
                          if (place.location) {
                            const latLng = { lat: place.location.lat(), lng: place.location.lng() };
                            setActivePreset(null);
                            setCustomDestination(latLng);
                            setMapCenter(latLng);
                          }
                        }}
                        className="flex-1 py-1 bg-[#a855f7] text-white font-black uppercase tracking-wider text-[8px] rounded-sm text-center cursor-pointer"
                      >
                        🏁 End Point
                      </button>
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
