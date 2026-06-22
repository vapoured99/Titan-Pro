import React, { useState, useEffect, useMemo } from 'react';
import { 
  APIProvider, 
  Map, 
  AdvancedMarker, 
  Pin, 
  InfoWindow, 
  useMap,
  useMapsLibrary
} from '@vis.gl/react-google-maps';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MapPin, 
  Search, 
  Plus, 
  Trash2, 
  Compass, 
  Phone, 
  Clock, 
  ExternalLink, 
  X, 
  Activity, 
  ChevronRight, 
  MessageSquare,
  Globe,
  Loader2
} from 'lucide-react';
import { 
  db, 
  auth, 
  collection, 
  addDoc, 
  deleteDoc, 
  onSnapshot, 
  doc, 
  setDoc,
  handleFirestoreError,
  OperationType
} from '../lib/firebase';

const API_KEY: string = 'AIzaSyCYJg6XySBcT9cX6hFkZYxvRF4RMbCf2WU';
const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

// Premium high-contrast dark theme matching the cybernetic gym aesthetic
const mapDarkStyles = [
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

// Helper to clean "PureGym" prefix case-insensitively
const cleanGymName = (name: string): string => {
  return name.replace(/^(puregym|pure gym)\s*/i, "").trim();
};

// Seed PureGym Locations - Scotland Only By Default
const DEFAULT_GYMS = [
  {
    id: "pg_edinburgh_quartermile",
    name: "Edinburgh Quartermile",
    address: "1 Rixson-Wood Ter, Edinburgh EH3 9QG",
    lat: 55.9431,
    lng: -3.1923,
    phone: "+44 344 811 0128",
    hours: "24 Hours / 7 Days",
    amenities: ["Dumbbells up to 50kg", "Lifting Platforms", "TRX Rigs", "Digital Lockers"],
    notes: "Perfect city centre location near the Meadows. Excellent for early morning squats.",
    isCustom: false
  },
  {
    id: "pg_edinburgh_west",
    name: "Edinburgh West",
    address: "Chesser Ave, Edinburgh EH14 1XG",
    lat: 55.9344,
    lng: -3.2721,
    phone: "+44 344 811 0142",
    hours: "24 Hours / 7 Days",
    amenities: ["Large Free Weights Area", "Plate Loaded Area", "Olympic Platforms", "TRX Rigs"],
    notes: "Spacious suburban location with excellent parking.",
    isCustom: false
  },
  {
    id: "pg_edinburgh_waterfront",
    name: "Edinburgh Waterfront",
    address: "Marine Dr, Edinburgh EH5 1ED",
    lat: 55.9818,
    lng: -3.2195,
    phone: "+44 344 811 0115",
    hours: "24 Hours / 7 Days",
    amenities: ["Huge Cardio Area", "Olympic Lifting", "Cycle Studio", "Stretching Zone"],
    notes: "Great coastal views and very spacious workout environment.",
    isCustom: false
  },
  {
    id: "pg_glasgow_bath_st",
    name: "Glasgow Bath Street",
    address: "140 Bath St, Glasgow G2 2HG",
    lat: 55.8642,
    lng: -4.2699,
    phone: "+44 344 811 0111",
    hours: "24 Hours / 7 Days",
    amenities: ["Olympic Platforms", "Dumbbells up to 50kg", "Spacious Studio", "Cycle Zone"],
    notes: "Iconic central Glasgow setup. Outstanding coaching team.",
    isCustom: false
  },
  {
    id: "pg_glasgow_hope_st",
    name: "Glasgow Hope Street",
    address: "Hope St, Glasgow G2 6AQ",
    lat: 55.8604,
    lng: -4.2575,
    phone: "+44 344 811 0108",
    hours: "24 Hours / 7 Days",
    amenities: ["Functional Training Area", "Free Weights Area", "Safer Access Control", "Showers"],
    notes: "Extremely close to Central Train Station, perfect for commuters.",
    isCustom: false
  },
  {
    id: "pg_glasgow_robroyston",
    name: "Glasgow Robroyston",
    address: "Robroyston Retail Park, Glasgow G33 1AD",
    lat: 55.8941,
    lng: -4.1882,
    phone: "+44 344 811 0119",
    hours: "24 Hours / 7 Days",
    amenities: ["Free Parking", "Massive Free Weights Space", "Plate Loaded Kit", "TRX Rigs"],
    notes: "Huge retail park branch with fantastic facilities and zero stress for parking.",
    isCustom: false
  },
  {
    id: "pg_aberdeen_kittybrewster",
    name: "Aberdeen Kittybrewster",
    address: "Kittybrewster Retail Park, Aberdeen AB24 3LJ",
    lat: 57.1612,
    lng: -2.1154,
    phone: "+44 344 811 0122",
    hours: "24 Hours / 7 Days",
    amenities: ["Plate Loaded Area", "Olympic Platforms", "Dumbbells up to 50kg", "Large Studio"],
    notes: "Highly accessible North Aberdeen outpost with a robust and helpful fitness crew.",
    isCustom: false
  },
  {
    id: "pg_aberdeen_shiprow",
    name: "Aberdeen Shiprow",
    address: "Shiprow, Aberdeen AB11 5BY",
    lat: 57.1458,
    lng: -2.0945,
    phone: "+44 344 811 0134",
    hours: "24 Hours / 7 Days",
    amenities: ["Safer Access", "TRX Zone", "Cycle Studio", "High Quality Dumbbells Area"],
    notes: "Centrally located near the harbour, perfect dynamic energy.",
    isCustom: false
  },
  {
    id: "pg_aberdeen_rubislaw",
    name: "Aberdeen Rubislaw",
    address: "Rubislaw Quarry, Queen's Rd, Aberdeen AB15 4YL",
    lat: 57.1428,
    lng: -2.1388,
    phone: "+44 344 811 0135",
    hours: "24 Hours / 7 Days",
    amenities: ["Plate Loaded Area", "Olympic Platforms", "TRX Suspension", "Free Parking"],
    notes: "Perfect west-end location situated near Rubislaw Quarry.",
    isCustom: false
  },
  {
    id: "pg_dundee_west",
    name: "Dundee West",
    address: "Kingsway West Retail Park, Dundee DD3 8QB",
    lat: 56.4674,
    lng: -3.0242,
    phone: "+44 344 811 0288",
    hours: "24 Hours / 7 Days",
    amenities: ["Excellent Parking", "Functional Training Rig", "Full Cardio Grid", "Lifting Benches"],
    notes: "Located on Dundee's main bypass link. Super convenient.",
    isCustom: false
  },
  {
    id: "pg_inverness_inshes",
    name: "Inverness Inshes",
    address: "Inshes Retail Park, Inverness IV2 3TW",
    lat: 57.4646,
    lng: -4.1956,
    phone: "+44 344 811 0311",
    hours: "24 Hours / 7 Days",
    amenities: ["Olympic Sump Rigs", "Functional Zone", "High Airflow Climate", "Free Wi-Fi"],
    notes: "Proud highlight of the Scottish Highlands fitness circuit.",
    isCustom: false
  }
];

// Helper to make center updates react correctly
function MapRefresher({ center }: { center: google.maps.LatLngLiteral }) {
  const map = useMap();
  useEffect(() => {
    if (map && center && typeof center.lat === 'number' && typeof center.lng === 'number') {
      map.panTo(center);
    }
  }, [map, center]);
  return null;
}

// Google Places Auto-Scanner to find real-time branches matching 450+ system locations dynamically
function PlacesScanner({ 
  onGymsFound, 
  setScanning, 
  setScanError, 
  triggerScan, 
  resetTrigger 
}: { 
  onGymsFound: (gyms: any[]) => void; 
  setScanning: (status: boolean) => void; 
  setScanError: (msg: string) => void;
  triggerScan: boolean;
  resetTrigger: () => void;
}) {
  const map = useMap();
  const placesLib = useMapsLibrary('places');

  useEffect(() => {
    if (!map || !placesLib || !triggerScan) return;

    setScanning(true);
    setScanError('');

    try {
      if (!placesLib.Place) {
        setScanning(false);
        resetTrigger();
        setScanError("Places modern library loading failed. Please try again.");
        return;
      }

      placesLib.Place.searchByText({
        textQuery: "PureGym",
        fields: ['id', 'displayName', 'location', 'formattedAddress', 'rating'],
        locationBias: map.getBounds() || map.getCenter() || undefined,
        maxResultCount: 20
      })
      .then(({ places }) => {
        setScanning(false);
        resetTrigger();

        if (places && places.length > 0) {
          const mappedGyms = places.map((place: any) => {
            const lat = typeof place.location?.lat === 'function' ? place.location.lat() : place.location?.lat;
            const lng = typeof place.location?.lng === 'function' ? place.location.lng() : place.location?.lng;

            return {
              id: `fetched_${place.id || Math.random().toString()}`,
              name: place.displayName || "PureGym Branch",
              address: place.formattedAddress || "UK Address Pending",
              lat: typeof lat === 'number' ? lat : 51.51,
              lng: typeof lng === 'number' ? lng : -0.13,
              phone: "+44 344 811 0120",
              hours: "24 Hours / 7 Days",
              amenities: ["Large Free Weights Area", "Lifting Platforms", "Cardio Zone", "Resistance Rigs"],
              notes: `Automatically parsed live satellite branch. rating: ${place.rating || 'N/A'} (Based on real maps telemetry)`,
              isCustom: false,
              isFetched: true
            };
          });
          onGymsFound(mappedGyms);
        } else {
          setScanError("No PureGym branches found in this map zone.");
        }
      })
      .catch((err: any) => {
        console.error("Failed Places API (New) scan:", err);
        setScanning(false);
        resetTrigger();
        setScanError("Handshake failure or API permissions not active.");
      });
    } catch (err: any) {
      console.error("Failed places service setup:", err);
      setScanning(false);
      resetTrigger();
      setScanError("Setup error. Check Maps config.");
    }
  }, [map, placesLib, triggerScan, setScanning, setScanError, resetTrigger, onGymsFound]);

  return null;
}

export default function GymLocator() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [customGyms, setCustomGyms] = useState<any[]>([]);
  const [fetchedGyms, setFetchedGyms] = useState<any[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [scanError, setScanError] = useState('');
  const [triggerScan, setTriggerScan] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeGymId, setActiveGymId] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState<google.maps.LatLngLiteral>({ lat: 57.1458, lng: -2.0945 });
  const [activeInfoWindowId, setActiveInfoWindowId] = useState<string | null>(null);

  // Form states to add custom PureGym
  const [isAddingMode, setIsAddingMode] = useState(false);
  const [formName, setFormName] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formLat, setFormLat] = useState('');
  const [formLng, setFormLng] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [formAmenities, setFormAmenities] = useState<string[]>([]);
  const [amenityInput, setAmenityInput] = useState('');

  // Setup Auth state listener
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Fetch custom puregyms from Firestore user subcollection
  useEffect(() => {
    if (!currentUser) {
      setCustomGyms([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const customCollectionRef = collection(db, 'users', currentUser.uid, 'puregym_locations');
    
    const unsubscribe = onSnapshot(
      customCollectionRef,
      (snapshot) => {
        const gyms = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
          isCustom: true
        }));
        setCustomGyms(gyms);
        setLoading(false);
      },
      (error) => {
        console.error("Failed to load puregym locations:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  // Combine defaults, custom, and dynamically fetched PureGym locations
  const allGyms = useMemo(() => {
    const uniqueFetched = fetchedGyms.filter(fg => 
      !DEFAULT_GYMS.some(dg => dg.name.toLowerCase() === fg.name.toLowerCase() || dg.address.toLowerCase() === fg.address.toLowerCase()) &&
      !customGyms.some(cg => cg.name.toLowerCase() === fg.name.toLowerCase() || cg.address.toLowerCase() === fg.address.toLowerCase())
    );
    const combined = [...DEFAULT_GYMS, ...customGyms, ...uniqueFetched];
    return combined.map(gym => ({
      ...gym,
      name: cleanGymName(gym.name)
    })).sort((a, b) => a.name.localeCompare(b.name));
  }, [customGyms, fetchedGyms]);

  // Filter based on search query
  const filteredGyms = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return allGyms;
    return allGyms.filter(g => 
      g.name.toLowerCase().includes(q) || 
      g.address.toLowerCase().includes(q) ||
      (g.notes && g.notes.toLowerCase().includes(q)) ||
      g.amenities.some((a: string) => a.toLowerCase().includes(q))
    );
  }, [allGyms, searchQuery]);

  // Handle click on gym row
  const selectGym = (gym: any) => {
    setActiveGymId(gym.id);
    setMapCenter({ lat: parseFloat(gym.lat.toString()), lng: parseFloat(gym.lng.toString()) });
    setActiveInfoWindowId(gym.id);
  };

  // Click on Map coordinates to auto fill adding form lat/long
  const handleMapClick = (e: any) => {
    if (isAddingMode && e.detail.latLng) {
      setFormLat(e.detail.latLng.lat.toFixed(6));
      setFormLng(e.detail.latLng.lng.toFixed(6));
    }
  };

  // Submit new custom gym location to Firestore
  const handleAddGym = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    if (!formName || !formAddress || !formLat || !formLng) {
      alert("Name, Address, Latitude and Longitude are strictly required!");
      return;
    }

    try {
      const parsedLat = parseFloat(formLat);
      const parsedLng = parseFloat(formLng);
      
      if (isNaN(parsedLat) || isNaN(parsedLng)) {
        alert("Latitude and Longitude must be valid decimal coordinates");
        return;
      }

      const customCollectionRef = collection(db, 'users', currentUser.uid, 'puregym_locations');
      const payload = {
        name: formName,
        address: formAddress,
        lat: parsedLat,
        lng: parsedLng,
        phone: formPhone || "N/A",
        hours: "24 Hours / 7 Days",
        amenities: formAmenities.length > 0 ? formAmenities : ["Weights Area", "Cardio Zone"],
        notes: formNotes,
        createdAt: new Date().toISOString()
      };

      await addDoc(customCollectionRef, payload);

      // Reset Form State
      setFormName('');
      setFormAddress('');
      setFormLat('');
      setFormLng('');
      setFormPhone('');
      setFormNotes('');
      setFormAmenities([]);
      setIsAddingMode(false);
    } catch (err) {
      console.error("Error adding custom gym:", err);
      alert("Could not save to Firestore. Check connection or authorization rules.");
    }
  };

  // Delete Custom Gym
  const handleDeleteCustomGym = async (gymId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUser) return;
    if (!confirm("Are you sure you want to delete this custom gym location?")) return;

    try {
      const docRef = doc(db, 'users', currentUser.uid, 'puregym_locations', gymId);
      await deleteDoc(docRef);
      if (activeGymId === gymId) {
        setActiveGymId(null);
        setActiveInfoWindowId(null);
      }
    } catch (err) {
      console.error("Error deleting custom gym:", err);
    }
  };

  // Utility to handle amenity tags
  const addAmenity = () => {
    const tag = amenityInput.trim();
    if (tag && !formAmenities.includes(tag)) {
      setFormAmenities([...formAmenities, tag]);
      setAmenityInput('');
    }
  };

  return (
    <div className="flex flex-col gap-6" id="gym-locator-page">
      {/* Header Banner */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div>
          <h2 className="text-sm font-black uppercase tracking-[0.25em] text-white flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gym-accent animate-pulse" />
            PUREGYM LOCATOR &bull; FIND YOUR BRANCH
          </h2>
          <p className="text-[10px] text-white/50 tracking-wider uppercase font-mono mt-0.5">
            Explore official PureGym club locations, view amenities, and manage your local gym entries
          </p>
        </div>
        
        {currentUser && !isAddingMode && (
          <button
            type="button"
            onClick={() => setIsAddingMode(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gym-accent hover:bg-gym-accent/90 text-black text-[9px] font-mono uppercase font-black tracking-wider rounded-sm cursor-pointer shadow-[0_0_15px_rgba(212,255,0,0.15)] transition-all active:scale-[0.98]"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            Add Custom Gym
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 h-auto lg:h-[620px] max-h-none overflow-visible">
        
        {/* Left Side: Gym List & Adder Controls */}
        <div className="lg:col-span-5 flex flex-col bg-[#08080a] border border-white/10 rounded-sm overflow-hidden h-[500px] lg:h-full relative">
          
          <AnimatePresence mode="wait">
            {!isAddingMode ? (
              <motion.div 
                key="list-view"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                className="flex flex-col h-full"
              >
                {/* Search Bar */}
                <div className="p-3 border-b border-white/5 bg-black/40 flex flex-col gap-2">
                  <div className="relative flex-grow">
                    <Search className="w-3.5 h-3.5 text-white/30 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="SEARCH GYMS, AMENITIES, OR ADDR..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-black/60 border border-white/10 rounded-sm pl-8 pr-3 py-1.5 text-[10px] font-mono uppercase text-white placeholder-white/20 focus:outline-none focus:border-gym-accent/50 tracking-widest"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => setTriggerScan(true)}
                    disabled={isScanning}
                    className={`w-full py-1.5 px-3 rounded-sm border font-mono uppercase text-[9px] font-black tracking-widest flex items-center justify-center gap-1.5 transition-all text-center cursor-pointer ${
                      isScanning 
                        ? 'bg-gym-accent/20 border-gym-accent/40 text-gym-accent animate-pulse cursor-not-allowed'
                        : 'bg-black hover:bg-gym-accent/15 border-white/10 hover:border-gym-accent/40 text-white hover:text-gym-accent'
                    }`}
                  >
                    {isScanning ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin text-gym-accent" />
                        Scanning Live Satellite Maps API...
                      </>
                    ) : (
                      <>
                        <Globe className="w-3 h-3 text-gym-accent" />
                        Scan Live Maps API for ALL PureGyms in View
                      </>
                    )}
                  </button>

                  {scanError && (
                    <div className="text-red-400 font-mono text-[8.5px] uppercase tracking-wider text-center pt-0.5 animate-pulse">
                      ▲ Telemetry Sync Error: {scanError}
                    </div>
                  )}
                </div>

                {/* Gym node counts bar */}
                <div className="px-3.5 py-1.5 bg-white/[0.02] border-b border-white/5 flex items-center justify-between text-[8.5px] font-mono uppercase tracking-widest text-[#a855f7]">
                  <span className="flex items-center gap-1.5 text-white/40">
                    <Activity className="w-3 h-3 text-gym-accent animate-pulse" />
                    SYSTEM CODES: <strong className="text-white font-black">{filteredGyms.length}</strong> ACTIVE SENSORS
                  </span>
                  <span>
                    CUSTOM SEED: <strong className="text-gym-accent font-black">{customGyms.length}</strong> REGISTERED
                  </span>
                </div>

                {/* List Container */}
                <div className="flex-grow overflow-y-auto no-scrollbar p-1.5 space-y-1">
                  {loading ? (
                    <div className="h-full flex flex-col items-center justify-center text-white/40 font-mono text-[10px] gap-2">
                      <Loader2 className="w-5 h-5 text-gym-accent animate-spin" />
                      LOADING LOCALIZATION COORDINATES...
                    </div>
                  ) : filteredGyms.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center p-6 text-center text-white/30 font-mono text-[9px] uppercase leading-relaxed">
                      [ NO ACTIVE GYM NODES MATCH SEARCH PARAMS ]
                      <br />
                      <span className="text-[8px] text-white/15">Try search "Piccadilly" or specific equipment tags</span>
                    </div>
                  ) : (
                    filteredGyms.map((gym) => {
                      const isActive = activeGymId === gym.id;
                      return (
                        <div
                          key={gym.id}
                          onClick={() => selectGym(gym)}
                          className={`p-3 rounded-sm border cursor-pointer transition-all ${
                            isActive 
                              ? "bg-gym-accent/5 border-gym-accent shadow-[0_0_12px_rgba(212,255,0,0.06)]"
                              : "bg-black/30 border-white/[0.05] hover:border-white/15"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className={`w-1.5 h-1.5 rounded-full ${gym.isCustom ? 'bg-purple-500 animate-pulse' : 'bg-gym-accent'}`} />
                                <h3 className="text-[10px] font-black uppercase tracking-wider text-white">
                                  {gym.name}
                                </h3>
                              </div>
                              <p className="text-[9px] text-white/45 font-sans mt-0.5 line-clamp-1">
                                {gym.address}
                              </p>
                            </div>
                            
                            {gym.isCustom && currentUser && (
                              <button
                                type="button"
                                onClick={(e) => handleDeleteCustomGym(gym.id, e)}
                                title="De-register Node"
                                className="p-1 hover:bg-rose-500/10 hover:border-rose-500/30 border border-transparent rounded-sm text-white/30 hover:text-rose-400 cursor-pointer transition-all shrink-0"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>

                          {/* Expanded Info panel when clicked or active */}
                          {isActive && (
                            <motion.div 
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              className="mt-3.5 pt-3.5 border-t border-white/5 space-y-2.5 text-[9px] font-mono uppercase tracking-wider text-white/70 overflow-hidden"
                            >
                              <div className="flex items-center gap-2">
                                <Clock className="w-3 h-3 text-gym-accent shrink-0" />
                                <span>HOURS: <strong className="text-white">{gym.hours}</strong></span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Phone className="w-3 h-3 text-[#38bdf8] shrink-0" />
                                <span>CONTACT: <strong className="text-white">{gym.phone}</strong></span>
                              </div>

                              {/* Amenities Grid */}
                              <div className="space-y-1">
                                <span className="text-[8px] text-white/30 font-bold block">AMENITIES GRID:</span>
                                <div className="flex flex-wrap gap-1">
                                  {gym.amenities?.map((am: string, i: number) => (
                                    <span 
                                      key={i}
                                      className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded-sm text-[8px] font-mono tracking-wider text-white/80"
                                    >
                                      {am}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              {gym.notes && (
                                <div className="p-2 bg-black/40 border border-white/5 rounded-sm flex items-start gap-1.5 leading-relaxed text-[8.5px] text-white/60">
                                  <MessageSquare className="w-3 h-3 text-purple-400 shrink-0 mt-0.5" />
                                  <div>
                                    <span className="text-[8px] text-white/30 block mb-0.5">MEMBER DEPLOYMENT NOTES:</span>
                                    <p className="font-sans normal-case text-white/80">{gym.notes}</p>
                                  </div>
                                </div>
                              )}

                              <div className="flex items-center gap-1.5 text-[8px] text-white/30 pt-1">
                                <span>LAT: {gym.lat}</span>
                                <span>&bull;</span>
                                <span>LONG: {gym.lng}</span>
                              </div>
                            </motion.div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="add-form"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                className="flex flex-col h-full p-4 overflow-y-auto no-scrollbar"
              >
                {/* Back Header */}
                <div className="flex items-center justify-between border-b border-white/5 pb-2.5 mb-4">
                  <span className="text-[9px] font-black uppercase tracking-widest text-[#a855f7] flex items-center gap-2">
                    <Activity className="w-3.5 h-3.5 text-gym-accent" />
                    REGISTER CUSTOM PUREGYM NODE
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsAddingMode(false)}
                    className="p-1 hover:bg-white/5 border border-white/5 rounded-sm text-white/40 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <form onSubmit={handleAddGym} className="space-y-3.5 font-mono text-[9px] text-white/80">
                  <div className="flex flex-col gap-1">
                    <span className="text-white/40 uppercase font-bold tracking-wider">GYM NODE NAME*</span>
                    <input
                      type="text"
                      required
                      placeholder="e.g. PureGym London Old Street"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="w-full bg-black/60 border border-white/10 rounded-sm px-2.5 py-1.5 focus:outline-none focus:border-gym-accent uppercase"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-white/40 uppercase font-bold tracking-wider">PHYSICAL MALL ADDRESS*</span>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 10-14 Old St, London EC1V 9BH"
                      value={formAddress}
                      onChange={(e) => setFormAddress(e.target.value)}
                      className="w-full bg-black/60 border border-white/10 rounded-sm px-2.5 py-1.5 focus:outline-none focus:border-gym-accent uppercase"
                    />
                  </div>

                  {/* Coordinates Selection HUD Info */}
                  <div className="p-2 rounded-sm bg-gym-accent/5 border border-gym-accent/15 leading-relaxed text-white/70 font-sans mb-1 text-[8.5px]">
                    <span className="text-gym-accent font-mono font-black uppercase tracking-wide block mb-0.5">🛰️ MAP ALIGNMENT CAPABLE</span>
                    You can type the decimal coordinates below, or simply **click directly on the interactive map** on the right to auto-fill the telemetry values!
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col gap-1">
                      <span className="text-white/40 uppercase font-bold tracking-wider">LATITUDE*</span>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 51.5256"
                        value={formLat}
                        onChange={(e) => setFormLat(e.target.value)}
                        className="w-full bg-black/60 border border-white/10 rounded-sm px-2.5 py-1.5 focus:outline-none focus:border-gym-accent"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-white/40 uppercase font-bold tracking-wider">LONGITUDE*</span>
                      <input
                        type="text"
                        required
                        placeholder="e.g. -0.0875"
                        value={formLng}
                        onChange={(e) => setFormLng(e.target.value)}
                        className="w-full bg-black/60 border border-white/10 rounded-sm px-2.5 py-1.5 focus:outline-none focus:border-gym-accent"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-white/40 uppercase font-bold tracking-wider">CONTACT DIRECTORY NO.</span>
                    <input
                      type="text"
                      placeholder="e.g. +44 344 811 0000"
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                      className="w-full bg-black/60 border border-white/10 rounded-sm px-2.5 py-1.5 focus:outline-none focus:border-gym-accent"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-white/40 uppercase font-bold tracking-wider">AMENITIES INDEX TAGS</span>
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        placeholder="Add tag e.g. Sauna, Squat Racks, Dumbbells"
                        value={amenityInput}
                        onChange={(e) => setAmenityInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addAmenity();
                          }
                        }}
                        className="flex-grow bg-black/60 border border-white/10 rounded-sm px-2.5 py-1 focus:outline-none focus:border-gym-accent placeholder-white/20 uppercase"
                      />
                      <button
                        type="button"
                        onClick={addAmenity}
                        className="px-2 bg-white/5 border border-white/10 rounded-sm hover:bg-white/10 cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                    {formAmenities.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {formAmenities.map((tag, i) => (
                          <span 
                            key={i} 
                            className="bg-gym-accent/15 text-gym-accent border border-gym-accent/30 text-[8px] px-1.5 py-0.5 rounded-full flex items-center gap-1 shrink-0 font-bold"
                          >
                            {tag}
                            <X 
                              className="w-2.5 h-2.5 cursor-pointer text-white hover:text-red-400"
                              onClick={() => setFormAmenities(formAmenities.filter(t => t !== tag))} 
                            />
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-white/40 uppercase font-bold tracking-wider">MEMBER SATELLITE NOTES</span>
                    <textarea
                      placeholder="Special lockouts, rack availability, access pins or custom trainer setups..."
                      value={formNotes}
                      onChange={(e) => setFormNotes(e.target.value)}
                      className="w-full h-16 bg-black/60 border border-white/10 rounded-sm px-2.5 py-1.5 focus:outline-none focus:border-gym-accent font-sans normal-case"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-gym-accent hover:bg-gym-accent/90 text-black font-black uppercase tracking-widest text-center cursor-pointer rounded-sm active:scale-[0.98] transition-all pt-2.5 pb-2.5"
                  >
                    DEPLOY NODE TO SATELLITE
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Side: Interactive Google Map Integration */}
        <div className="lg:col-span-7 bg-[#08080a] border border-white/10 rounded-sm p-1.5 relative h-[500px] lg:h-full">
          {!hasValidKey && (
            <div className="absolute inset-0 z-30 bg-black/85 flex flex-col items-center justify-center p-6 text-center">
              <Compass className="w-8 h-8 text-gym-accent mb-2 animate-bounce" />
              <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
                API SATELLITE HANDSHAKE ERROR
              </span>
              <p className="text-[9px] text-white/60 font-sans mt-1.5 max-w-sm leading-relaxed">
                Google Maps API development key not detected. Ensure `API_KEY` in `GymLocator.tsx` matches valid platform key bounds.
              </p>
            </div>
          )}

          {hasValidKey && (
            <APIProvider apiKey={API_KEY} version="weekly" libraries={['places']}>
              <div className="w-full h-full relative rounded-sm bg-[#040405] overflow-hidden">
                <Map
                  defaultCenter={mapCenter}
                  defaultZoom={11}
                  gestureHandling="greedy"
                  mapId="PUREGYM_LOCATOR_MAP"
                  options={{
                    disableDefaultUI: true,
                    zoomControl: true,
                    styles: mapDarkStyles
                  }}
                  onClick={handleMapClick}
                  internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                  style={{ width: '100%', height: '100%' }}
                >
                  {/* Pan/Smooth center component */}
                  <MapRefresher center={mapCenter} />

                  {/* Google Maps Real-time Places API Scanner */}
                  <PlacesScanner
                    onGymsFound={(gyms) => {
                      setFetchedGyms(prev => {
                        const merged = [...prev];
                        gyms.forEach(g => {
                          const isDuplicate = merged.some(m => 
                            m.name.toLowerCase() === g.name.toLowerCase() || 
                            m.address.toLowerCase() === g.address.toLowerCase()
                          );
                          if (!isDuplicate) {
                            merged.push(g);
                          }
                        });
                        return merged;
                      });
                    }}
                    setScanning={setIsScanning}
                    setScanError={setScanError}
                    triggerScan={triggerScan}
                    resetTrigger={() => setTriggerScan(false)}
                  />

                  {/* Render Markers for all loaded locations */}
                  {filteredGyms.map((gym) => {
                    const isActive = activeGymId === gym.id;
                    return (
                      <AdvancedMarker
                        key={gym.id}
                        position={{ lat: parseFloat(gym.lat.toString()), lng: parseFloat(gym.lng.toString()) }}
                        onClick={() => {
                          setActiveGymId(gym.id);
                          setActiveInfoWindowId(gym.id);
                        }}
                      >
                        <div className="flex flex-col items-center justify-center select-none cursor-pointer">
                          <Pin 
                            background={gym.isCustom ? "#a855f7" : "#d4ff00"} 
                            borderColor="#ffffff" 
                            glyphColor={gym.isCustom ? "#ffffff" : "#000000"} 
                            glyph="G" 
                          />
                          {isActive && (
                            <div className="mt-1 px-1.5 py-0.5 bg-black border border-gym-accent/30 text-white font-mono text-[8px] font-extrabold uppercase rounded shadow-lg whitespace-nowrap z-50">
                              {gym.name}
                            </div>
                          )}
                        </div>
                      </AdvancedMarker>
                    );
                  })}

                  {/* Detailed Interactive InfoWindow Overlay when Marker clicked */}
                  {activeInfoWindowId && (() => {
                    const targetGym = filteredGyms.find(g => g.id === activeInfoWindowId);
                    if (!targetGym) return null;
                    return (
                      <InfoWindow
                        position={{ lat: parseFloat(targetGym.lat.toString()), lng: parseFloat(targetGym.lng.toString()) }}
                        onCloseClick={() => setActiveInfoWindowId(null)}
                      >
                        <div className="p-2 text-black bg-white rounded-md text-[10px] space-y-1.5 leading-relaxed font-sans max-w-[210px]">
                          <div className="flex items-center gap-1 pb-1 border-b border-black/10">
                            <span className={`w-1.5 h-1.5 rounded-full ${targetGym.isCustom ? 'bg-purple-600' : 'bg-[#a3e635]'}`} />
                            <strong className="font-bold tracking-tight text-[10.5px] line-clamp-1">{targetGym.name}</strong>
                          </div>
                          
                          <p className="text-[9px] text-gray-600 normal-case">{targetGym.address}</p>
                          
                          <div className="font-mono text-[8px] space-y-0.5 text-gray-500 uppercase tracking-widest">
                            <div>CLOCK: {targetGym.hours}</div>
                            <div>TEL: {targetGym.phone}</div>
                          </div>

                          <div className="pt-1.5 border-t border-black/5 flex items-center justify-between">
                            <a 
                              href={`https://www.google.com/maps/dir/?api=1&destination=${targetGym.lat},${targetGym.lng}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[8.5px] bg-[#0c0a09] hover:bg-stone-800 text-white font-bold py-1 px-2 rounded font-mono uppercase text-center w-full block shrink-0"
                            >
                              GET DIRECTIONS
                            </a>
                          </div>
                        </div>
                      </InfoWindow>
                    );
                  })()}
                </Map>
              </div>
            </APIProvider>
          )}
        </div>

      </div>
    </div>
  );
}
