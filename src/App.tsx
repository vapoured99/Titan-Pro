import React, { useState, useEffect } from 'react';
import { 
  ChevronDown, 
  Dumbbell, 
  Flame, 
  Trophy, 
  ArrowLeftRight, 
  ArrowDown, 
  Activity, 
  ArrowUp, 
  ArrowUpCircle, 
  RotateCw,
  Search,
  RefreshCw,
  LogOut,
  User as UserIcon,
  Loader2,
  History,
  Scale,
  TrendingUp,
  Plus,
  Trash2,
  ExternalLink,
  Save,
  Layout,
  Medal,
  Award,
  Crown,
  Shield,
  BookOpen,
  Cloud,
  Download,
  Upload
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import AnatomyChart from './components/AnatomyChart';
import AvatarPanel from './components/AvatarPanel';
import { 
  auth, 
  db, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged, 
  doc, 
  getDoc, 
  setDoc, 
  getDocs,
  addDoc,
  query,
  orderBy,
  handleFirestoreError, 
  OperationType,
  serverTimestamp,
  collection,
  User,
  deleteDoc,
  writeBatch,
  onSnapshot
} from './lib/firebase';
import { Exercise, POOLS } from './data/exercises';

// --- Background Images ---
import ironTempleBg from './assets/images/iron_temple_bg_1779282140548.png';
import neonPumpBg from './assets/images/neon_pump_bg_1779282162002.png';
import beastModeBg from './assets/images/beast_mode_bg_1779282188045.png';
import zenLifterBg from './assets/images/zen_lifter_bg_1779282209692.png';
import midnightCityBg from './assets/images/midnight_city_bg_1779282230526.png';

// --- Types ---
interface GymTheme {
  id: string;
  name: string;
  description: string;
  accent: string;
  accentRgb: string;
  accentLight: string;
  accentDark: string;
  bg: string;
  bgImage: string;
  opacity: string;
  textVibe: string;
  testPrimary: string;
  testMuted: string;
  testSubtle: string;
}

const GYM_THEMES: Record<string, GymTheme> = {
  default: {
    id: 'default',
    name: 'Default Theme',
    description: 'Golden highlights on dark canvas.',
    accent: '#D4AF37',
    accentRgb: '212, 175, 55',
    accentLight: '#F1E5AC',
    accentDark: '#C5A028',
    bg: '#050505',
    bgImage: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=2070&auto=format&fit=crop',
    opacity: 'opacity-25',
    textVibe: 'Titan Gold. Original athletic layout.',
    testPrimary: '#ffffff',
    testMuted: 'rgba(255, 255, 255, 0.45)',
    testSubtle: 'rgba(255, 255, 255, 0.2)'
  },
  iron: {
    id: 'iron',
    name: 'Iron Temple',
    description: 'Ancient stone & classical discipline.',
    accent: '#cdaa5c',
    accentRgb: '205, 170, 92',
    accentLight: '#f3e8cb',
    accentDark: '#8a6e30',
    bg: '#0b0a08',
    bgImage: ironTempleBg,
    opacity: 'opacity-30',
    textVibe: 'Ancient stone. Raw discipline. Unbreakable focus.',
    testPrimary: '#f3e8cb',
    testMuted: 'rgba(243, 232, 203, 0.45)',
    testSubtle: 'rgba(243, 232, 203, 0.2)'
  },
  neon: {
    id: 'neon',
    name: 'Neon Pump',
    description: 'Vaporwave synth-lights & heavy pulses.',
    accent: '#ff007f',
    accentRgb: '255, 0, 127',
    accentLight: '#ff80bf',
    accentDark: '#b30059',
    bg: '#0b0112',
    bgImage: neonPumpBg,
    opacity: 'opacity-35',
    textVibe: 'Retro lights. High energy. Push harder than yesterday.',
    testPrimary: '#ffe6f2',
    testMuted: 'rgba(255, 128, 191, 0.45)',
    testSubtle: 'rgba(255, 128, 191, 0.2)'
  },
  beast: {
    id: 'beast',
    name: 'Beast Mode',
    description: 'Aggressive crimson shadows & steel.',
    accent: '#ff3333',
    accentRgb: '255, 51, 51',
    accentLight: '#ff8888',
    accentDark: '#b30000',
    bg: '#060000',
    bgImage: beastModeBg,
    opacity: 'opacity-30',
    textVibe: 'Dark. Aggressive. Built for beasts who never skip leg day.',
    testPrimary: '#ffcccc',
    testMuted: 'rgba(255, 136, 136, 0.45)',
    testSubtle: 'rgba(255, 136, 136, 0.2)'
  },
  zen: {
    id: 'zen',
    name: 'Zen Lifter',
    description: 'Calming forest mists & quiet focus.',
    accent: '#00d294',
    accentRgb: '0, 210, 148',
    accentLight: '#8cfcd7',
    accentDark: '#008f62',
    bg: '#080d09',
    bgImage: zenLifterBg,
    opacity: 'opacity-40',
    textVibe: 'Clean mind. Strong body. Balance is the ultimate progress.',
    testPrimary: '#e2fdf5',
    testMuted: 'rgba(0, 210, 148, 0.45)',
    testSubtle: 'rgba(0, 210, 148, 0.2)'
  },
  midnight: {
    id: 'midnight',
    name: 'Midnight City',
    description: 'Late-night cyber skylines & cyber teal.',
    accent: '#00e5ff',
    accentRgb: '0, 229, 255',
    accentLight: '#80f2ff',
    accentDark: '#009aab',
    bg: '#010813',
    bgImage: midnightCityBg,
    opacity: 'opacity-35',
    textVibe: 'Late nights. Big goals. The city never stops, neither do you.',
    testPrimary: '#e0f7fa',
    testMuted: 'rgba(128, 242, 255, 0.45)',
    testSubtle: 'rgba(128, 242, 255, 0.2)'
  }
};

interface PB {
  lastWeight: number;
  lastReps: number;
  lastDate: string;
  bestWeight: number;
  bestReps: number;
  bestDate: string;
  exerciseName: string;
}

interface SessionSet {
  id?: string;
  exerciseName: string;
  weight: number;
  reps: number;
  date: string;
  timestamp: any;
}

interface WeightEntry {
  id?: string;
  weight: number;
  date: string;
  timestamp: any;
}

const DAY_CONFIG = [
  { label: "Day 1", name: "Chest & Triceps", pools: ['chest', 'triceps'], icon: <Dumbbell className="w-5 h-5 text-gym-accent" />, bg: "bg-white/[0.03]", border: "border-gym-accent/10", text: "text-white" },
  { label: "Day 2", name: "Back & Biceps", pools: ['back', 'biceps'], icon: <ArrowUp className="w-5 h-5 text-gym-accent" />, bg: "bg-white/[0.03]", border: "border-gym-accent/10", text: "text-white" },
  { label: "Day 3", name: "Shoulders", pools: ['shoulders'], icon: <ArrowUpCircle className="w-5 h-5 text-gym-accent" />, bg: "bg-white/[0.03]", border: "border-gym-accent/10", text: "text-white" },
  { label: "Day 4", name: "Legs & Core", pools: ['legs', 'core'], icon: <Flame className="w-5 h-5 text-gym-accent" />, bg: "bg-white/[0.03]", border: "border-gym-accent/10", text: "text-white" },
];

const iconMap: Record<string, any> = {
  Dumbbell, ArrowLeftRight, ArrowDown, Activity, ArrowUp, ArrowUpCircle, RotateCw, RefreshCw, Plus, Flame
};

// --- Helpers ---

// --- Components ---
const PBBlock = ({ 
  exName, 
  pbs, 
  showLatest = true,
  sessionSets = [],
  archivedWorkouts = []
}: { 
  exName: string; 
  pbs: Record<string, PB>; 
  showLatest?: boolean;
  sessionSets?: SessionSet[];
  archivedWorkouts?: any[];
}) => {
  const pb = pbs[exName];

  // Gather previous logged data
  const exerciseSets: { weight: number; reps: number; date?: string }[] = [];

  // 1. From active session
  sessionSets.forEach(s => {
    if (s && s.exerciseName && s.exerciseName.trim().toLowerCase() === exName.trim().toLowerCase()) {
      exerciseSets.push({ weight: s.weight, reps: s.reps, date: s.date });
    }
  });

  // 2. From archived sessions
  archivedWorkouts.forEach(w => {
    if (w && Array.isArray(w.sets)) {
      w.sets.forEach((s: any) => {
        if (s && s.exerciseName && s.exerciseName.trim().toLowerCase() === exName.trim().toLowerCase()) {
          exerciseSets.push({ weight: s.weight, reps: s.reps, date: s.date || w.date });
        }
      });
    }
  });

  // 3. From PB if exists
  if (pb) {
    if (pb.bestWeight > 0 && pb.bestReps > 0) {
      exerciseSets.push({ weight: pb.bestWeight, reps: pb.bestReps, date: pb.bestDate });
    }
    if (pb.lastWeight > 0 && pb.lastReps > 0) {
      exerciseSets.push({ weight: pb.lastWeight, reps: pb.lastReps, date: pb.lastDate });
    }
  }

  // Calculate maximum 1 Rep Max (1RM) using Epley Formula
  let max1RM = 0;
  let maxBaseSet: { weight: number; reps: number; date?: string } | null = null;

  exerciseSets.forEach(set => {
    if (set.weight > 0 && set.reps > 0) {
      const base1RM = set.reps === 1 ? set.weight : set.weight * (1 + set.reps / 30);
      if (base1RM > max1RM) {
        max1RM = base1RM;
        maxBaseSet = set;
      }
    }
  });

  if (!pb && max1RM === 0) {
    return (
      <div className="mt-3 p-3 rounded-xl bg-gym-accent/5 border border-gym-accent/20">
        <div className="text-[10px] text-gym-accent font-bold uppercase mb-1 tracking-wider">No History</div>
        <div className="text-xs text-white/20">Save a set to track progress</div>
      </div>
    );
  }

  return (
    <div className="mt-3 p-4 rounded-sm bg-white/5 border border-gym-accent/10">
      {pb && (
        <div className={`text-[10px] text-gym-accent font-bold uppercase tracking-wider flex items-center gap-2 ${showLatest ? 'mb-4' : ''}`}>
          <Trophy className="w-3 h-3 text-gym-accent" /> Peak: <span className="text-gym-accent-light">{pb.bestWeight}kg × {pb.bestReps}</span> <span className="opacity-40 text-[9px] ml-1 tracking-normal font-light">({pb.bestDate})</span>
        </div>
      )}
      
      {showLatest && pb && (
        <div className="flex items-end justify-between">
          <div className="flex gap-6">
            <div className="flex flex-col">
              <span className="text-[10px] opacity-40 uppercase tracking-widest mb-1">Weight</span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-light text-white">{pb.lastWeight}</span>
                <span className="text-[10px] text-white/30 uppercase font-medium">kg</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] opacity-40 uppercase tracking-widest mb-1">Reps</span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-light text-white">{pb.lastReps}</span>
                <span className="text-[10px] text-white/30 uppercase font-medium">reps</span>
              </div>
            </div>
          </div>
          <div className="text-[10px] text-white/20 uppercase tracking-tighter">Latest: {pb.lastDate}</div>
        </div>
      )}

      {max1RM > 0 && (
        <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] opacity-40 uppercase tracking-widest flex items-center gap-1">
              <Flame className="w-3 h-3 text-gym-accent animate-pulse" /> Est. 1 Rep Max
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl font-semibold text-gym-accent">{max1RM.toFixed(1)}</span>
              <span className="text-[10px] text-gym-accent-light uppercase font-medium">kg</span>
            </div>
          </div>
          {maxBaseSet && (
            <div className="text-right flex flex-col justify-end">
              <span className="text-[9px] text-white/20 uppercase tracking-tighter">Based on</span>
              <span className="text-[10px] text-white/50 font-mono">
                {maxBaseSet.weight}kg × {maxBaseSet.reps}
              </span>
              {maxBaseSet.date && (
                <span className="text-[8px] text-white/30">
                  ({(() => {
                    if (maxBaseSet.date.includes('-')) {
                      const parts = maxBaseSet.date.split('-').map(Number);
                      if (parts.length === 3) {
                        const d = new Date(parts[0], parts[1] - 1, parts[2]);
                        return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
                      }
                    }
                    return maxBaseSet.date;
                  })()})
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

interface UserProfile {
  displayName?: string;
  photoURL?: string;
  startDate?: string;
  streakCount?: number;
  lastWorkoutDate?: string;
  activeView?: string;
  themeId?: string;
}

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'reset'>('login');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authMessage, setAuthMessage] = useState("");
  const [firebaseConnected, setFirebaseConnected] = useState(false);
  
  const [currentDays, setCurrentDays] = useState<Exercise[][]>([[], [], [], []]);
  const [personalBests, setPersonalBests] = useState<Record<string, PB>>({});
  const [weightHistory, setWeightHistory] = useState<WeightEntry[]>([]);
  const [sessionSets, setSessionSets] = useState<SessionSet[]>([]);
  const [archivedWorkouts, setArchivedWorkouts] = useState<any[]>([]);
  // State for session view selection
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<string | null>(null);
  const [showHistoryMenu, setShowHistoryMenu] = useState(false);
  const [activeView, setActiveView] = useState<'workout' | 'library' | 'progress' | 'session' | 'profile' | 'anatomy' | 'avatar'>('workout');
  const [guidanceEx, setGuidanceEx] = useState<Exercise | null>(null);

  const [toast, setToast] = useState<{message: string, type: 'success' | 'pb' | 'info'} | null>(null);

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [currentThemeId, setCurrentThemeId] = useState<string>(() => {
    return localStorage.getItem('gym-theme-id') || 'default';
  });
  const [expandedDays, setExpandedDays] = useState<Record<number, boolean>>({});
  const [flashMessage, setFlashMessage] = useState<Record<string, string>>({});
  const [newWeight, setNewWeight] = useState<string>("");
  const [newWeightDate, setNewWeightDate] = useState<string>("");
  const [showWeightHistoryList, setShowWeightHistoryList] = useState(false);
  const [googleDriveToken, setGoogleDriveToken] = useState<string | null>(null);
  const [googleDriveBackups, setGoogleDriveBackups] = useState<any[]>([]);
  const [loadingDriveBackups, setLoadingDriveBackups] = useState(false);
  const [exportingToDrive, setExportingToDrive] = useState(false);
  const [driveConfirmAction, setDriveConfirmAction] = useState<{
    type: 'delete' | 'restore';
    fileId: string;
    fileName: string;
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [addingToDay, setAddingToDay] = useState<number | null>(null);
  const [modalSearch, setModalSearch] = useState("");
  const [expandedProgressSections, setExpandedProgressSections] = useState<Record<string, boolean>>({
    weight: true,
    trending: false
  });
  const [volumeTimeframe, setVolumeTimeframe] = useState<'day' | 'week' | 'month'>('day');
  const [expandedLibrarySections, setExpandedLibrarySections] = useState<Record<string, boolean>>({});

  const findExerciseByName = (name: string): Exercise | null => {
    if (!name) return null;
    const searchName = name.trim().toLowerCase();
    for (const pool of Object.values(POOLS)) {
      const ex = pool.find(e => e.name.trim().toLowerCase() === searchName);
      if (ex) return ex;
    }
    return null;
  };

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Data Sync
  useEffect(() => {
    if (!currentUser) return;

    const workoutPath = `users/${currentUser.uid}/workout/current`;
    const settingsPath = `users/${currentUser.uid}/profile/settings`;
    const setsPath = `users/${currentUser.uid}/sets`;
    const pbsPath = `users/${currentUser.uid}/pbs`;
    const weightPath = `users/${currentUser.uid}/weightEntries`;

    // Real-time listener for Workout & Settings
    const unsubscribeWorkout = onSnapshot(doc(db, workoutPath), (wDoc) => {
      setFirebaseConnected(true);
      if (wDoc.exists()) {
        const data = wDoc.data() as { days: Record<string, Exercise[]>, version?: number };
        if (data.days) {
          let daysArr: Exercise[][] = [];
          if (!Array.isArray(data.days)) {
            for (let i = 0; i < 4; i++) daysArr.push(data.days[`d${i}`] || []);
          } else {
            daysArr = data.days as Exercise[][];
          }
          setCurrentDays(daysArr);
        }
      }
    }, (err) => console.error("Workout listener error:", err));

    const unsubscribeSettings = onSnapshot(doc(db, settingsPath), (sDoc) => {
      if (sDoc.exists()) {
        const data = sDoc.data() as UserProfile;
        if (data.activeView) setActiveView(data.activeView as any);
        if (data.themeId) {
          setCurrentThemeId(data.themeId);
          localStorage.setItem('gym-theme-id', data.themeId);
        }
        setProfile(data);
      }
    }, (err) => console.error("Settings listener error:", err));

    // Remove loadStatic and integrate it into its own useEffect if needed, but onSnapshot handles initial load too.
    const initializeProfile = async () => {
      try {
        const sDoc = await getDoc(doc(db, settingsPath));
        if (!sDoc.exists()) {
          const initialProfile: UserProfile = {
            startDate: new Date().toISOString(),
            streakCount: 0,
            activeView: 'workout',
            displayName: currentUser.displayName || "",
            photoURL: currentUser.photoURL || ""
          };
          await setDoc(doc(db, settingsPath), {
            ...initialProfile,
            updatedAt: serverTimestamp()
          });
        }
      } catch (err: any) {
        console.warn("Could not check/initialize profile from server (offline?):", err.message || err);
      }
    };
    initializeProfile();

    // Real-time listeners for Session Data
    const unsubscribeSets = onSnapshot(collection(db, setsPath), (snapshot) => {
      const sets: SessionSet[] = [];
      snapshot.forEach(d => sets.push({ id: d.id, ...d.data() } as SessionSet));
      setSessionSets(sets.sort((a, b) => (a.timestamp?.seconds || 0) - (b.timestamp?.seconds || 0)));
    }, (err) => console.error("Sets listener error:", err));

    const unsubscribeWorkouts = onSnapshot(query(collection(db, `users/${currentUser.uid}/workouts`), orderBy("timestamp", "desc")), (snapshot) => {
      const workouts: any[] = [];
      snapshot.forEach(d => workouts.push({ id: d.id, ...d.data() }));
      setArchivedWorkouts(workouts);
    }, (err) => console.error("Workouts listener error:", err));

    const unsubscribePbs = onSnapshot(collection(db, pbsPath), (snapshot) => {
      const pbs: Record<string, PB> = {};
      snapshot.forEach(d => { pbs[d.id] = d.data() as PB; });
      setPersonalBests(pbs);
    }, (err) => console.error("PBs listener error:", err));

    const unsubscribeWeight = onSnapshot(collection(db, weightPath), (snapshot) => {
      const weights: WeightEntry[] = [];
      snapshot.forEach(d => {
        const data = d.data();
        if (data && typeof data.weight === 'number') {
          weights.push({ 
            id: d.id, 
            weight: data.weight,
            date: data.date || new Date().toISOString().split('T')[0],
            timestamp: data.timestamp
          });
        }
      });
      
      const sorted = weights.sort((a, b) => {
        const dateA = new Date(a.date).getTime() || 0;
        const dateB = new Date(b.date).getTime() || 0;
        if (dateA !== dateB) return dateA - dateB;
        
        const getTs = (ts: any) => {
          if (!ts) return 0;
          if (typeof ts.toMillis === 'function') return ts.toMillis();
          if (ts.seconds) return ts.seconds * 1000;
          return Date.now(); // Fallback to now if no timestamp yet (optimistic)
        };
        return getTs(a.timestamp) - getTs(b.timestamp);
      });
      
      console.log("Weight History Updated:", sorted);
      setWeightHistory([...sorted]);
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, weightPath);
    });

    return () => {
      unsubscribeWorkout();
      unsubscribeSettings();
      unsubscribeSets();
      unsubscribeWorkouts();
      unsubscribePbs();
      unsubscribeWeight();
    };
  }, [currentUser]);

  useEffect(() => {
    if (searchQuery.trim()) {
      const allSections = Object.keys(POOLS).map(k => k.charAt(0).toUpperCase() + k.slice(1));
      const newState: Record<string, boolean> = {};
      allSections.forEach(s => newState[s] = true);
      setExpandedLibrarySections(newState);
    }
  }, [searchQuery]);

  const getVolumeData = () => {
    if (archivedWorkouts.length === 0) return [];
    
    const sorted = [...archivedWorkouts].sort((a, b) => {
      const dateA = new Date(a.date).getTime() || 0;
      const dateB = new Date(b.date).getTime() || 0;
      return dateA - dateB;
    });

    if (volumeTimeframe === 'day') {
      const grouped = sorted.reduce((acc, w) => {
        const d = w.date;
        acc[d] = (acc[d] || 0) + (w.totalVolume || 0);
        return acc;
      }, {} as Record<string, number>);
      return Object.entries(grouped).map(([date, volume]) => ({ date, volume }));
    }

    if (volumeTimeframe === 'week') {
      const grouped = sorted.reduce((acc, w) => {
        const date = new Date(w.date);
        const day = date.getDay();
        const diff = date.getDate() - day + (day === 0 ? -6 : 1);
        const monday = new Date(date.setDate(diff));
        const weekStr = monday.toISOString().split('T')[0];
        acc[weekStr] = (acc[weekStr] || 0) + (w.totalVolume || 0);
        return acc;
      }, {} as Record<string, number>);
      return Object.entries(grouped).map(([date, volume]) => ({ date, volume }));
    }

    if (volumeTimeframe === 'month') {
      const grouped = sorted.reduce((acc, w) => {
        const d = w.date.substring(0, 7) + "-01";
        acc[d] = (acc[d] || 0) + (w.totalVolume || 0);
        return acc;
      }, {} as Record<string, number>);
      return Object.entries(grouped).map(([date, volume]) => ({ date, volume }));
    }

    return [];
  };

  const saveWorkout = async (days: Exercise[][]) => {
    if (!currentUser) return;
    const path = `users/${currentUser.uid}/workout/current`;
    try {
      // Map 2D array to object to avoid "Nested arrays are not supported" error in Firestore
      const daysObj: Record<string, Exercise[]> = {};
      days.forEach((day, i) => {
        daysObj[`d${i}`] = day;
      });
      
      await setDoc(doc(db, path), {
        days: daysObj,
        version: 2,
        updatedAt: serverTimestamp()
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  };

  const saveSettings = async (settings: any) => {
    if (!currentUser) return;
    const path = `users/${currentUser.uid}/profile/settings`;
    try {
      await setDoc(doc(db, path), {
        ...settings,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  };

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthMessage("");
    if (!email || !password) return;
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setAuthError(err.message);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthMessage("");
    if (!email || !password) return;
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setAuthError(err.message);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthMessage("");
    if (!email) return;
    try {
      await sendPasswordResetEmail(auth, email);
      setAuthMessage("Password reset email sent!");
    } catch (err: any) {
      setAuthError(err.message);
    }
  };

  const handleLogout = () => {
    auth.signOut();
    setGoogleDriveToken(null);
  };
  
  const handleGoogleLogin = async () => {
    setAuthError("");
    const provider = new GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/drive.file');
    provider.addScope('https://www.googleapis.com/auth/drive.readonly');
    try {
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (credential?.accessToken) {
        setGoogleDriveToken(credential.accessToken);
      }
    } catch (err: any) {
      setAuthError(err.message);
    }
  };

  const handleConnectGoogleDrive = async () => {
    const provider = new GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/drive.file');
    provider.addScope('https://www.googleapis.com/auth/drive.readonly');
    try {
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (credential?.accessToken) {
        setGoogleDriveToken(credential.accessToken);
        setToast({ message: "Google Drive connected successfully!", type: "success" });
      } else {
        throw new Error("No Google access token received");
      }
    } catch (err: any) {
      setToast({ message: `Failed to connect Google Drive: ${err.message}`, type: "info" });
    }
  };

  const loadGoogleDriveBackups = async (token: string) => {
    setLoadingDriveBackups(true);
    try {
      const q = encodeURIComponent("name contains 'GymArchive_Backup_' and trashed = false");
      const url = `https://www.googleapis.com/drive/v3/files?q=${q}&fields=files(id,name,createdTime)&orderBy=createdTime+desc`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setGoogleDriveBackups(data.files || []);
      } else {
        console.error("Failed to list backups from Drive", await res.text());
      }
    } catch (err) {
      console.error("Error listing Drive backups", err);
    } finally {
      setLoadingDriveBackups(false);
    }
  };

  const handleExportBackup = async () => {
    if (!currentUser || !googleDriveToken) return;
    setExportingToDrive(true);
    try {
      const backupData = {
        version: 1,
        backupDate: new Date().toISOString(),
        currentDays: currentDays,
        personalBests: personalBests,
        weightHistory: weightHistory,
        sessionSets: sessionSets,
        archivedWorkouts: archivedWorkouts,
        profile: profile
      };

      const filename = `GymArchive_Backup_${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
      
      const boundary = 'gym_archive_boundary_unique';
      const delimiter = `\r\n--${boundary}\r\n`;
      const close_delim = `\r\n--${boundary}--`;

      const metadata = {
        name: filename,
        mimeType: 'application/json',
      };

      const multipartRequestBody =
        delimiter +
        'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
        JSON.stringify(metadata) +
        delimiter +
        'Content-Type: application/json\r\n\r\n' +
        JSON.stringify(backupData) +
        close_delim;

      const response = await fetch(
        'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${googleDriveToken}`,
            'Content-Type': `multipart/related; boundary=${boundary}`,
          },
          body: multipartRequestBody,
        }
      );

      if (response.ok) {
        setToast({ message: "Backup exported to Google Drive!", type: "success" });
        loadGoogleDriveBackups(googleDriveToken);
      } else {
        const errorText = await response.text();
        throw new Error(errorText || "Upload failed");
      }
    } catch (err: any) {
      console.error(err);
      setToast({ message: `Export failed: ${err.message}`, type: "info" });
    } finally {
      setExportingToDrive(false);
    }
  };

  const handleRestoreBackup = (fileId: string, fileName: string) => {
    setDriveConfirmAction({ type: 'restore', fileId, fileName });
  };

  const handleDeleteBackup = (fileId: string, fileName: string) => {
    setDriveConfirmAction({ type: 'delete', fileId, fileName });
  };

  const executeRestoreBackup = async (fileId: string) => {
    if (!currentUser || !googleDriveToken) return;
    setLoadingDriveBackups(true);
    try {
      const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
        headers: { Authorization: `Bearer ${googleDriveToken}` }
      });
      if (!res.ok) {
        throw new Error(`Failed to download backup: ${res.statusText}`);
      }

      const backupData = await res.json();
      
      if (!backupData || typeof backupData !== 'object') {
        throw new Error("Invalid backup file structure");
      }

      const batch = writeBatch(db);

      // 1. Current Days
      if (backupData.currentDays) {
        const workoutRef = doc(db, `users/${currentUser.uid}/workout/current`);
        batch.set(workoutRef, { days: backupData.currentDays });
      }

      // 2. Profile
      if (backupData.profile) {
        const settingsRef = doc(db, `users/${currentUser.uid}/profile/settings`);
        batch.set(settingsRef, backupData.profile);
      }

      // 3. Weight History
      if (Array.isArray(backupData.weightHistory)) {
        for (const entry of backupData.weightHistory) {
          if (entry.id) {
            const ref = doc(db, `users/${currentUser.uid}/weightEntries/${entry.id}`);
            batch.set(ref, {
              weight: entry.weight ?? "",
              date: entry.date ?? "",
              timestamp: entry.timestamp ?? serverTimestamp()
            });
          }
        }
      }

      // 4. Session Sets
      if (Array.isArray(backupData.sessionSets)) {
        for (const set of backupData.sessionSets) {
          if (set.id) {
            const ref = doc(db, `users/${currentUser.uid}/sets/${set.id}`);
            batch.set(ref, set);
          }
        }
      }

      // 5. Personal Bests
      if (backupData.personalBests && typeof backupData.personalBests === 'object') {
        for (const [exName, pb] of Object.entries(backupData.personalBests)) {
          const ref = doc(db, `users/${currentUser.uid}/pbs/${exName}`);
          batch.set(ref, pb as any);
        }
      }

      // 6. Archived Workouts
      if (Array.isArray(backupData.archivedWorkouts)) {
        for (const w of backupData.archivedWorkouts) {
          if (w.id) {
            const ref = doc(db, `users/${currentUser.uid}/workouts/${w.id}`);
            batch.set(ref, w);
          }
        }
      }

      await batch.commit();
      setToast({ message: "Backup successfully restored!", type: "success" });
    } catch (err: any) {
      console.error(err);
      setToast({ message: `Restore failed: ${err.message}`, type: "info" });
    } finally {
      setDriveConfirmAction(null);
      if (googleDriveToken) {
        loadGoogleDriveBackups(googleDriveToken);
      } else {
        setLoadingDriveBackups(false);
      }
    }
  };

  const executeDeleteBackup = async (fileId: string) => {
    if (!googleDriveToken) return;
    setLoadingDriveBackups(true);
    try {
      const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${googleDriveToken}` }
      });
      if (res.ok) {
        setToast({ message: "Backup deleted successfully", type: "success" });
        loadGoogleDriveBackups(googleDriveToken);
      } else {
        const errorText = await res.text();
        throw new Error(errorText || "Delete failed");
      }
    } catch (err: any) {
      console.error(err);
      setToast({ message: `Delete failed: ${err.message}`, type: "info" });
    } finally {
      setDriveConfirmAction(null);
      if (googleDriveToken) {
        loadGoogleDriveBackups(googleDriveToken);
      } else {
        setLoadingDriveBackups(false);
      }
    }
  };

  useEffect(() => {
    if (googleDriveToken) {
      loadGoogleDriveBackups(googleDriveToken);
    } else {
      setGoogleDriveBackups([]);
    }
  }, [googleDriveToken]);

  const handleSwap = (dayIndex: number, exIndex: number) => {
    if (!currentDays[dayIndex]) return;
    const day = [...currentDays[dayIndex]];
    const ex = day[exIndex];
    if (!ex) return;

    let poolKey = ex.pool;
    if (!poolKey || !POOLS[poolKey]) {
      const lowerExName = ex.name.trim().toLowerCase();
      // Search across ALL pools to find which one contains this exercise
      for (const [key, exercises] of Object.entries(POOLS)) {
        if (exercises.some(e => e.name.trim().toLowerCase() === lowerExName)) {
          poolKey = key as any;
          break;
        }
      }
    }

    if (!poolKey || !POOLS[poolKey]) {
      console.warn("Could not find pool for exercise:", ex.name, "poolKey:", poolKey);
      // Fallback: If we still can't find it, try to guess from common strings or default to chest
      const low = ex.name.toLowerCase();
      if (low.includes("chest") || low.includes("press") || low.includes("bench") || low.includes("fly")) poolKey = "chest";
      else if (low.includes("row") || low.includes("lat") || low.includes("back") || low.includes("pull")) poolKey = "back";
      else if (low.includes("bicep") || low.includes("curl")) poolKey = "biceps";
      else if (low.includes("tricep") || low.includes("skull") || low.includes("dip")) poolKey = "triceps";
      else if (low.includes("squat") || low.includes("leg") || low.includes("deadlift") || low.includes("hamstring")) poolKey = "legs";
      else if (low.includes("shoulder") || low.includes("raise") || low.includes("press")) poolKey = "shoulders";
      else if (low.includes("ab") || low.includes("crunch") || low.includes("core") || low.includes("sit up") || low.includes("plank")) poolKey = "core";
      
      if (!poolKey) {
        alert(`Cannot determine exercise category for "${ex.name}". Please manually swap via Library.`);
        return;
      }
    }

    const pool = POOLS[poolKey];
    // Filter out current exercise and any other exercise already in the day
    const currentDayExNames = new Set(day.map(d => d.name.trim().toLowerCase()));
    const otherExercises = pool.filter(e => {
        const normalizedEName = e.name.trim().toLowerCase();
        return normalizedEName !== ex.name.trim().toLowerCase() && !currentDayExNames.has(normalizedEName);
    });
    
    if (otherExercises.length === 0) {
      alert("No more unique exercises left in this category to swap!");
      return;
    }
    
    const newEx = otherExercises[Math.floor(Math.random() * otherExercises.length)];
    day[exIndex] = newEx;
    
    const nextCurrentDays = [...currentDays];
    nextCurrentDays[dayIndex] = day;
    setCurrentDays(nextCurrentDays);
    saveWorkout(nextCurrentDays);

    // Provide immediate visual feedback
    setFlashMessage(prev => ({ ...prev, [newEx.name]: 'SWAPPED' }));
    setTimeout(() => {
      setFlashMessage(prev => {
        const next = { ...prev };
        delete next[newEx.name];
        return next;
      });
    }, 2000);
  };

  const handleAddExerciseToPlan = (dayIndex: number, ex: Exercise) => {
    const nextDays = [...currentDays];
    // Prevent duplicates
    if (nextDays[dayIndex].some(e => e.name === ex.name)) {
      alert("Exercise already in plan for this day.");
      return;
    }
    nextDays[dayIndex] = [...nextDays[dayIndex], ex];
    setCurrentDays(nextDays);
    saveWorkout(nextDays);
    setAddingToDay(null);
    setModalSearch("");
  };

  const handleRemoveExerciseFromPlan = (dayIndex: number, exIndex: number) => {
    const nextDays = [...currentDays];
    nextDays[dayIndex] = nextDays[dayIndex].filter((_, i) => i !== exIndex);
    setCurrentDays(nextDays);
    saveWorkout(nextDays);
  };

  const handleSaveSet = async (exName: string, weight: string, reps: string) => {
    if (!weight || !currentUser) return;
    const nWeight = parseFloat(weight) || 0;
    const nReps = parseInt(reps) || 0;
    const dateStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    const fullDate = new Date().toISOString().split('T')[0];
    
    const existing = personalBests[exName];
    let isNewPB = false;

    if (!existing) {
      isNewPB = true;
    } else {
      if (nWeight > existing.bestWeight) {
        isNewPB = true;
      } else if (nWeight === existing.bestWeight && nReps > existing.bestReps) {
        isNewPB = true;
      }
    }

    const updatedPB: PB = {
      exerciseName: exName,
      lastWeight: nWeight,
      lastReps: nReps,
      lastDate: dateStr,
      bestWeight: isNewPB ? nWeight : (existing?.bestWeight || nWeight),
      bestReps: isNewPB ? nReps : (existing?.bestReps || nReps),
      bestDate: isNewPB ? dateStr : (existing?.bestDate || dateStr)
    };

    setPersonalBests(prev => ({ ...prev, [exName]: updatedPB }));
    setFlashMessage(prev => ({ ...prev, [exName]: isNewPB ? '🏆 NEW PB!' : '✓ SAVED' }));
    
    const setId = `${fullDate}-${exName}-${Date.now()}`;
    
    const newSet: SessionSet = {
      id: setId,
      exerciseName: exName,
      weight: nWeight,
      reps: nReps,
      date: fullDate,
      timestamp: { seconds: Math.floor(Date.now() / 1000) }
    };

    // Optimistic Update
    setSessionSets(prev => [...prev, newSet]);
    
    setToast({ 
      message: isNewPB ? `New PB: ${exName}!` : `Logged ${exName}: ${nWeight}kg × ${nReps}`, 
      type: isNewPB ? 'pb' : 'success' 
    });
    setTimeout(() => setToast(null), 3000);
    
    try {
      const pbsPath = `users/${currentUser.uid}/pbs/${exName}`;
      const setsPath = `users/${currentUser.uid}/sets/${setId}`;
      const settingsPath = `users/${currentUser.uid}/profile/settings`;
      
      const today = new Date().toISOString().split('T')[0];
      let streakUpdate = {};
      if (profile && profile.lastWorkoutDate !== today) {
        const last = profile.lastWorkoutDate ? new Date(profile.lastWorkoutDate) : null;
        const t = new Date(today);
        const diffTime = last ? Math.abs(t.getTime() - last.getTime()) : Infinity;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        const newStreak = (diffDays === 1) ? (profile.streakCount || 0) + 1 : 1;
        streakUpdate = { streakCount: newStreak, lastWorkoutDate: today };
      }

      // Gamification Reward logic for completing a set
      const xpEarned = isNewPB ? 120 : 15;
      const creditsEarned = isNewPB ? 80 : 10;

      let nextLevel = profile?.avatarLevel ?? 1;
      let nextXp = (profile?.avatarXp ?? 0) + xpEarned;
      const nextCredits = (profile?.avatarCredits ?? 5000) + creditsEarned;

      const getXpNeeded = (lvl: number) => lvl * 500 + 2000;
      let leveledUp = false;

      while (nextXp >= getXpNeeded(nextLevel)) {
        nextXp -= getXpNeeded(nextLevel);
        nextLevel += 1;
        leveledUp = true;
      }

      const avatarUpdate = {
        avatarLevel: nextLevel,
        avatarXp: nextXp,
        avatarCredits: nextCredits
      };

      setProfile(prev => prev ? { ...prev, ...streakUpdate, ...avatarUpdate } : null);

      if (leveledUp) {
        setToast({
          message: `🔥 LEVEL UP! You are now Level ${nextLevel}!`,
          type: 'success'
        });
        setTimeout(() => setToast(null), 3500);
      }

      const p1 = setDoc(doc(db, pbsPath), {
        ...updatedPB,
        updatedAt: serverTimestamp()
      });

      const p2 = setDoc(doc(db, setsPath), {
        exerciseName: exName,
        weight: nWeight,
        reps: nReps,
        date: fullDate,
        timestamp: serverTimestamp()
      });

      const p3 = setDoc(doc(db, settingsPath), { 
        ...streakUpdate, 
        ...avatarUpdate, 
        updatedAt: serverTimestamp() 
      }, { merge: true });

      await Promise.all([p1, p2, p3]);
    } catch (err) {
      // Revert optimistic update if needed, but for now just log
      handleFirestoreError(err, OperationType.WRITE, `users/${currentUser.uid}/save-set`);
    }

    setTimeout(() => setFlashMessage(prev => {
      const next = { ...prev };
      delete next[exName];
      return next;
    }), 1500);
  };

  const handleDeleteSet = async (setId: string) => {
    if (!currentUser) return;
    try {
      await deleteDoc(doc(db, `users/${currentUser.uid}/sets/${setId}`));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `users/${currentUser.uid}/sets/${setId}`);
    }
  };

  const handleArchiveWorkout = async () => {
    if (!currentUser || sessionSets.length === 0) return;

    try {
      setDataLoading(true);
      const batch = writeBatch(db);
      
      const dates = Array.from(new Set(sessionSets.map(s => s.date))).sort((a: string, b: string) => b.localeCompare(a));
      const targetDate = dates[0] || new Date().toISOString().split('T')[0];
      
      const totalVolume = sessionSets.reduce((sum, s) => sum + (s.weight * s.reps), 0);
      const workoutRef = doc(collection(db, `users/${currentUser.uid}/workouts`));
      
      const workoutData = {
        date: targetDate,
        timestamp: serverTimestamp(),
        sets: sessionSets,
        totalVolume,
        exercisesCount: new Set(sessionSets.map(s => s.exerciseName)).size,
        totalSets: sessionSets.length
      };
      
      batch.set(workoutRef, workoutData);
      
      // Delete all current sets from Firestore
      sessionSets.forEach(s => {
        if (s.id) {
          batch.delete(doc(db, `users/${currentUser.uid}/sets/${s.id}`));
        }
      });

      // Reward user upon successfully archiving a full workout: +250 Credits and +400 XP!
      const finalXpEarned = 400;
      const finalCreditsEarned = 250;

      let nextLevel = profile?.avatarLevel ?? 1;
      let nextXp = (profile?.avatarXp ?? 0) + finalXpEarned;
      const nextCredits = (profile?.avatarCredits ?? 5000) + finalCreditsEarned;

      const getXpNeeded = (lvl: number) => lvl * 500 + 2000;
      let leveledUp = false;

      while (nextXp >= getXpNeeded(nextLevel)) {
        nextXp -= getXpNeeded(nextLevel);
        nextLevel += 1;
        leveledUp = true;
      }

      const avatarUpdate = {
        avatarLevel: nextLevel,
        avatarXp: nextXp,
        avatarCredits: nextCredits
      };

      setProfile(prev => prev ? { ...prev, ...avatarUpdate } : null);

      if (leveledUp) {
        setToast({
          message: `🔥 LEVEL UP! You are now Level ${nextLevel}!`,
          type: 'success'
        });
        setTimeout(() => setToast(null), 3500);
      }

      const settingsRef = doc(db, `users/${currentUser.uid}/profile/settings`);
      batch.set(settingsRef, { 
        ...avatarUpdate,
        updatedAt: serverTimestamp() 
      }, { merge: true });

      await batch.commit();
      
      // sessionSets will be cleared via onSnapshot
      setSelectedWorkoutId(workoutRef.id);
      alert(`Workout session from ${targetDate} captured and archived!`);
      
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${currentUser.uid}/workouts`);
    } finally {
      setDataLoading(false);
    }
  };

  const handleDeleteWorkout = async (id: string | undefined) => {
    if (!currentUser || !id) return;
    
    try {
      setDataLoading(true);
      await deleteDoc(doc(db, `users/${currentUser.uid}/workouts/${id}`));
      
      // Update local state immediately for instant UI feedback
      setArchivedWorkouts(prev => prev.filter(w => w.id !== id));
      
      if (selectedWorkoutId === id) {
        setSelectedWorkoutId(null);
      }
      
      // We don't use alert() as it can be blocked in iframe
      console.log("Evolution Record permanently excluded from the archive.");
    } catch (error) {
      console.error("Delete error:", error);
    } finally {
      setDataLoading(false);
    }
  };

  const handleClearActiveSession = async () => {
    if (!currentUser || sessionSets.length === 0) return;
    
    try {
      setDataLoading(true);
      const batch = writeBatch(db);
      sessionSets.forEach(s => {
        if (s.id) {
          batch.delete(doc(db, `users/${currentUser.uid}/sets/${s.id}`));
        }
      });
      await batch.commit();
      console.log("Active performance log cleared.");
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `users/${currentUser.uid}/sets`);
    } finally {
      setDataLoading(false);
    }
  };

  const [expandedWorkouts, setExpandedWorkouts] = useState<Record<string, boolean>>({});
  const toggleWorkoutExpansion = (id: string) => {
    setExpandedWorkouts(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const [isSavingWeight, setIsSavingWeight] = useState(false);
  const [weightFlash, setWeightFlash] = useState("");

  const handleSaveWeight = async () => {
    if (!newWeight || !newWeightDate || !currentUser || isSavingWeight) {
      if (!newWeightDate) {
        setWeightFlash("Enter date");
        setTimeout(() => setWeightFlash(""), 2000);
      }
      return;
    }
    
    const w = parseFloat(newWeight);
    if (isNaN(w) || w <= 0) {
      setWeightFlash("Invalid weight");
      setTimeout(() => setWeightFlash(""), 2000);
      return;
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(newWeightDate)) {
      setWeightFlash("Invalid date");
      setTimeout(() => setWeightFlash(""), 2000);
      return;
    }

    setIsSavingWeight(true);
    const date = newWeightDate;
    
    const entry: Omit<WeightEntry, 'id'> = { 
      weight: w, 
      date, 
      timestamp: serverTimestamp() 
    };
    
    try {
      const weightColPath = `users/${currentUser.uid}/weightEntries`;
      const docId = `w-${Date.now()}`;
      
      await setDoc(doc(db, weightColPath, docId), entry);
      
      setNewWeight("");
      setNewWeightDate("");
      setWeightFlash("✓ SAVED");
      
      setTimeout(() => setWeightFlash(""), 2000);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `users/${currentUser.uid}/weightEntries`);
      setWeightFlash("Error saving");
      setTimeout(() => setWeightFlash(""), 3000);
    } finally {
      setIsSavingWeight(false);
    }
  };

  const handleClearHistory = async () => {
    if (!currentUser) return;
    
    try {
      setDataLoading(true);
      setShowClearConfirm(false);
      
      // Optimistically clear ONLY session sets from UI
      setSessionSets([]);
      
      const userId = currentUser.uid;
      const setsPath = `users/${userId}/sets`;
      
      // Only fetch sets to delete
      const snap = await getDocs(collection(db, setsPath));
      
      if (!snap.empty) {
        const batch = writeBatch(db);
        let count = 0;
        snap.forEach(d => {
          batch.delete(d.ref);
          count++;
        });
        await batch.commit();
        console.log(`Cleared ${count} session recordings.`);
      }

      // Clear any temporary input values in elements
      const inputs = document.querySelectorAll('input');
      inputs.forEach((input: any) => {
        if (input.type === 'number' || input.type === 'text') {
          input.value = "";
        }
      });

    } catch (err) {
      console.error("Failed to clear session history:", err);
      handleFirestoreError(err, OperationType.DELETE, `users/${currentUser.uid}/sets-wipe`);
    } finally {
      setDataLoading(false);
    }
  };

  const authTheme = GYM_THEMES[currentThemeId] || GYM_THEMES.default;
  const authStyles = {
    '--gym-accent': authTheme.accent,
    '--gym-accent-light': authTheme.accentLight,
    '--gym-accent-dark': authTheme.accentDark,
    '--gym-accent-rgb': authTheme.accentRgb,
    '--theme-text': authTheme.testPrimary,
    '--theme-text-muted': authTheme.testMuted,
    '--theme-text-subtle': authTheme.testSubtle,
    backgroundColor: authTheme.bg,
  } as React.CSSProperties;

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden transition-all duration-500" style={authStyles}>
        <style>{`
          :root {
            --gym-accent: ${authTheme.accent} !important;
            --gym-accent-light: ${authTheme.accentLight} !important;
            --gym-accent-dark: ${authTheme.accentDark} !important;
            --gym-accent-rgb: ${authTheme.accentRgb} !important;
            --theme-text: ${authTheme.testPrimary} !important;
            --theme-text-muted: ${authTheme.testMuted} !important;
            --theme-text-subtle: ${authTheme.testSubtle} !important;
          }
        `}</style>
        {/* Background Image */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <img 
            src={authTheme.bgImage} 
            alt="Gym Background" 
            className={`w-full h-full object-cover transition-all duration-700 ${authTheme.opacity}`}
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 transition-colors duration-500" style={{ background: `linear-gradient(to bottom, ${authTheme.bg}a0, ${authTheme.bg}40, ${authTheme.bg}ff)` }} />
        </div>
        <Loader2 className="w-12 h-12 text-gym-accent animate-spin relative z-10" />
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center relative overflow-hidden transition-all duration-500" style={authStyles}>
        <style>{`
          :root {
            --gym-accent: ${authTheme.accent} !important;
            --gym-accent-light: ${authTheme.accentLight} !important;
            --gym-accent-dark: ${authTheme.accentDark} !important;
            --gym-accent-rgb: ${authTheme.accentRgb} !important;
            --theme-text: ${authTheme.testPrimary} !important;
            --theme-text-muted: ${authTheme.testMuted} !important;
            --theme-text-subtle: ${authTheme.testSubtle} !important;
          }
        `}</style>
        {/* Background Image */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <img 
            src={authTheme.bgImage} 
            alt="Gym Background" 
            className={`w-full h-full object-cover transition-all duration-700 ${authTheme.opacity} scale-105`}
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 transition-colors duration-500" style={{ background: `linear-gradient(to bottom, ${authTheme.bg}a0, ${authTheme.bg}60, ${authTheme.bg}ff)` }} />
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 max-w-md w-full p-10 border border-white/10 rounded-sm bg-black/40 backdrop-blur-md"
        >
          <span className="text-[10px] uppercase tracking-[0.3em] text-gym-accent mb-2 block font-bold">Est. 2026</span>
          <h1 className="text-4xl font-light italic font-serif tracking-widest mb-4 text-white">Titan <span className="text-gym-accent accent-glow">Pro</span></h1>
          <p className="text-white/40 mb-10 text-sm font-light leading-relaxed">The sophisticated approach to physical excellence.</p>
          
          <form 
            onSubmit={
              authMode === 'login' ? handleEmailLogin : 
              authMode === 'signup' ? handleEmailSignup : 
              handleResetPassword
            }
            className="space-y-4 text-left"
          >
            <div className="space-y-1">
              <span className="text-[10px] text-white/30 uppercase tracking-widest font-bold ml-1">Email</span>
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-4 text-sm font-light focus:outline-none focus:border-gym-accent transition-all text-white"
                placeholder="Ex. athlete@gympro.com"
                required
              />
            </div>
            
            {authMode !== 'reset' && (
              <div className="space-y-1">
                <span className="text-[10px] text-white/30 uppercase tracking-widest font-bold ml-1">Password</span>
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-4 text-sm font-light focus:outline-none focus:border-gym-accent transition-all text-white"
                  placeholder="••••••••"
                  required={authMode !== 'reset'}
                />
              </div>
            )}

            {authError && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest ml-1">{authError}</p>}
            {authMessage && <p className="text-gym-accent text-[10px] font-bold uppercase tracking-widest ml-1">{authMessage}</p>}

            <button 
              type="submit"
              className="w-full bg-gym-accent text-black py-4 rounded-sm font-bold uppercase tracking-widest hover:brightness-110 transition-all transform active:scale-[0.98] flex items-center justify-center gap-3 cursor-pointer shadow-lg shadow-gym-accent/20 mt-6"
            >
              {authMode === 'login' ? 'Enter Archive' : authMode === 'signup' ? 'Commence Training' : 'Recover Access'}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative flex items-center justify-center mb-6">
              <div className="border-t border-white/5 w-full"></div>
              <span className="absolute px-4 bg-[#0a0a0a] text-[8px] text-white/30 uppercase tracking-[0.3em] font-bold">Or Continue With</span>
            </div>

            <button 
              onClick={handleGoogleLogin}
              className="w-full bg-white/5 border border-white/10 text-white/60 py-4 rounded-sm font-bold uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all transform active:scale-[0.98] flex items-center justify-center gap-3 cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                <path d="M1 1h22v22H1z" fill="none" />
              </svg>
              Standard Google Identity
            </button>
          </div>

          <div className="mt-8 pt-8 border-t border-white/5 flex flex-col gap-4">
              <div className="flex justify-between items-center px-2">
                {authMode === 'login' ? (
                  <>
                    <button onClick={() => setAuthMode('signup')} className="text-[10px] text-white/30 hover:text-gym-accent uppercase tracking-widest font-bold cursor-pointer">Register</button>
                    <button onClick={() => setAuthMode('reset')} className="text-[10px] text-white/30 hover:text-gym-accent uppercase tracking-widest font-bold cursor-pointer">Lost Password?</button>
                  </>
                ) : (
                  <button onClick={() => setAuthMode('login')} className="text-[10px] text-white/30 hover:text-gym-accent uppercase tracking-widest font-bold cursor-pointer w-full text-center">Return to Login</button>
                )}
              </div>
          </div>
        </motion.div>
      </div>
    );
  }

  const activeTheme = GYM_THEMES[currentThemeId] || GYM_THEMES.default;

  const dynamicStyles = {
    '--gym-accent': activeTheme.accent,
    '--gym-accent-light': activeTheme.accentLight,
    '--gym-accent-dark': activeTheme.accentDark,
    '--gym-accent-rgb': activeTheme.accentRgb,
    '--theme-text': activeTheme.testPrimary,
    '--theme-text-muted': activeTheme.testMuted,
    '--theme-text-subtle': activeTheme.testSubtle,
    backgroundColor: activeTheme.bg,
  } as React.CSSProperties;

  return (
    <div className="min-h-screen text-white relative overflow-hidden transition-all duration-500" style={dynamicStyles}>
      <style>{`
        :root {
          --gym-accent: ${activeTheme.accent} !important;
          --gym-accent-light: ${activeTheme.accentLight} !important;
          --gym-accent-dark: ${activeTheme.accentDark} !important;
          --gym-accent-rgb: ${activeTheme.accentRgb} !important;
          --theme-text: ${activeTheme.testPrimary} !important;
          --theme-text-muted: ${activeTheme.testMuted} !important;
          --theme-text-subtle: ${activeTheme.testSubtle} !important;
        }
      `}</style>
      {/* Background Image */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img 
          src={activeTheme.bgImage} 
          alt="Gym Background" 
          className={`w-full h-full object-cover transition-all duration-700 ${activeTheme.opacity}`}
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 transition-colors duration-500" style={{ background: `linear-gradient(to bottom, ${activeTheme.bg}a0, ${activeTheme.bg}40, ${activeTheme.bg}ff)` }} />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-12 pb-32">
      {/* Header */}
      <header className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6 border-b border-gym-accent/20 pb-10">
        <div className="flex flex-col items-start gap-1">
          <span className="text-[10px] uppercase tracking-[0.3em] text-gym-accent font-bold">Premium Session</span>
          <h1 className="text-5xl font-light italic font-serif tracking-widest text-theme-text leading-none">Titan <span className="text-gym-accent accent-glow-strong">Pro</span></h1>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end text-right">
            <p className="text-[10px] text-theme-text-muted uppercase tracking-widest mb-0.5 flex items-center gap-2 justify-end">
              {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' })}
              <span className={`w-1.5 h-1.5 rounded-full ${firebaseConnected ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-red-500 animate-pulse'}`} title={firebaseConnected ? "Cloud Sync Active" : "Connecting to Cloud..."} />
            </p>
            <p className="text-lg font-medium text-theme-text">{profile?.displayName || currentUser.displayName || "Athlete"}</p>
          </div>
          <div className="h-10 w-px bg-white/10" />
          <div className="flex gap-2">
            <button 
              onClick={() => {
                setActiveView('profile');
                saveSettings({ activeView: 'profile' });
              }}
              className={`p-1 border rounded-full transition-all cursor-pointer flex items-center justify-center overflow-hidden w-10 h-10 ${activeView === 'profile' ? 'border-gym-accent bg-gym-accent/10' : 'border-white/10 bg-white/5 hover:border-white/20'}`}
              title="Profile"
            >
              {profile?.photoURL || currentUser.photoURL ? (
                <img src={profile?.photoURL || currentUser.photoURL || ""} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <UserIcon className="w-4 h-4 text-theme-text-muted" />
              )}
            </button>
            <button 
              onClick={handleLogout}
              className="p-2.5 bg-white/5 border border-white/10 rounded-sm text-theme-text-muted hover:text-theme-text hover:bg-white/10 transition-all cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Tabs / Navigation */}
      <nav className="flex flex-wrap gap-8 mb-12 border-b border-white/10 pb-6 overflow-x-auto no-scrollbar">
        {[
          { id: 'workout', label: 'Programming', icon: Dumbbell },
          { id: 'library', label: 'Library', icon: Search },
          { id: 'progress', label: 'Progress', icon: Scale },
          { id: 'anatomy', label: 'Anatomy', icon: Layout },
          { id: 'session', label: 'Session', icon: History },
          { id: 'avatar', label: 'Avatar', icon: Crown }
        ].map(nav => (
          <button
            key={nav.id}
            onClick={() => {
              setActiveView(nav.id as any);
              saveSettings({ activeView: nav.id });
            }}
            className={`relative text-xs font-bold uppercase tracking-[0.2em] transition-all cursor-pointer pb-1 ${
              activeView === nav.id ? "text-theme-text" : "text-theme-text-muted hover:text-theme-text"
            }`}
          >
            {nav.label}
            {activeView === nav.id && (
              <motion.div 
                layoutId="nav-underline" 
                className="absolute -bottom-[25px] left-0 right-0 h-0.5 bg-gym-accent accent-shadow-nav" 
              />
            )}
          </button>
        ))}
      </nav>

      {/* Main Content */}
      <main className="space-y-3">
        <AnimatePresence mode="wait">
          {dataLoading ? (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 text-gym-accent animate-spin" />
            </motion.div>
          ) : activeView === 'library' ? (
            <motion.div 
              key="library"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="pb-12"
            >
              <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-8">
                <div>
                  <h3 className="text-xl font-light italic font-serif flex items-center gap-3 mb-1">
                    Exercise Archive
                  </h3>
                  <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold">Comprehensive Exercise Library</p>
                </div>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                  <input 
                    type="text"
                    placeholder="Search by name or category..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-sm pl-11 pr-4 py-3 text-sm font-light focus:outline-none focus:border-gym-accent transition-all w-full md:w-72 text-white"
                  />
                  <div className="absolute top-full right-0 mt-2">
                    <a 
                      href="https://www.puregym.com/exercises/" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-[9px] text-gym-accent/60 hover:text-gym-accent uppercase tracking-[0.2em] font-bold transition-colors flex items-center gap-2"
                    >
                      <ExternalLink className="w-2.5 h-2.5" />
                      Official PureGym Guides
                    </a>
                  </div>
                </div>
              </div>

              <div className="h-6" /> 

              {[
                ...Object.entries(POOLS).map(([key, list]) => ({ 
                  title: key.charAt(0).toUpperCase() + key.slice(1), 
                  list: list.filter(ex => 
                    ex.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                    ex.pool.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                }))
              ].filter(s => s.list.length > 0).map(section => (
                <div key={section.title} className="mb-6 border border-white/5 rounded-sm overflow-hidden bg-white/[0.01]">
                  <button 
                    onClick={() => setExpandedLibrarySections(prev => ({ ...prev, [section.title]: !prev[section.title] }))}
                    className="w-full text-left px-6 py-5 flex items-center justify-between hover:bg-white/[0.02] transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-4">
                      <h3 className="text-[10px] font-black text-gym-accent uppercase tracking-[0.4em]">
                        {section.title}
                      </h3>
                      <span className="text-[10px] text-white/20 font-bold bg-white/5 px-2 py-0.5 rounded-full uppercase tracking-widest">{section.list.length} Exercises</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-white/20 group-hover:text-gym-accent transition-all ${expandedLibrarySections[section.title] ? 'rotate-180' : ''}`} />
                  </button>
                  
                  <AnimatePresence>
                    {expandedLibrarySections[section.title] && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                      >
                        <div className="px-6 pb-8 pt-2">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {section.list.map(ex => {
                              const Icon = iconMap[ex.icon] || Dumbbell;
                              return (
                                <div key={ex.name} className="bg-white/[0.02] border border-white/5 rounded-sm p-5 hover:border-white/20 transition-all group">
                                  <div className="flex items-center justify-between mb-2">
                                     <div className="flex items-center gap-3">
                                        <Icon className="w-4 h-4 text-white/30 group-hover:text-gym-accent transition-colors" />
                                        <span className="font-medium text-sm text-white/90 group-hover:text-white transition-colors">{ex.name}</span>
                                     </div>
                                     <AnimatePresence>
                                        {flashMessage[ex.name] && (
                                          <motion.span 
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            className="text-[8px] font-bold text-gym-accent uppercase tracking-widest"
                                          >
                                            {flashMessage[ex.name]}
                                          </motion.span>
                                        )}
                                     </AnimatePresence>
                                  </div>
                                  
                                  <div className="flex gap-4 mb-4 mt-6">
                                    <div className="flex flex-col flex-1">
                                      <span className="text-[9px] text-white/20 uppercase tracking-widest mb-1 font-bold">Weight</span>
                                      <input 
                                        type="number"
                                        inputMode="decimal"
                                        placeholder="---"
                                        id={`lib-w-${ex.name.replace(/\s+/g, '-')}`}
                                        className="w-full bg-transparent border-b border-white/10 py-1 text-xl font-light focus:outline-none focus:border-gym-accent transition-all text-white"
                                      />
                                    </div>
                                    <div className="flex flex-col flex-1">
                                      <span className="text-[9px] text-white/20 uppercase tracking-widest mb-1 font-bold">Reps</span>
                                      <input 
                                        type="number"
                                        inputMode="numeric"
                                        placeholder="---"
                                        id={`lib-r-${ex.name.replace(/\s+/g, '-')}`}
                                        className="w-full bg-transparent border-b border-white/10 py-1 text-xl font-light focus:outline-none focus:border-gym-accent transition-all text-white"
                                      />
                                    </div>
                                    <button 
                                      onClick={() => {
                                        const idSafe = ex.name.replace(/\s+/g, '-');
                                        const wInput = document.getElementById(`lib-w-${idSafe}`) as HTMLInputElement;
                                        const rInput = document.getElementById(`lib-r-${idSafe}`) as HTMLInputElement;
                                        const w = wInput?.value;
                                        const r = rInput?.value;
                                        if (w && r) {
                                          handleSaveSet(ex.name, w, r);
                                          if (wInput) wInput.value = "";
                                          if (rInput) rInput.value = "";
                                        }
                                      }}
                                      className="bg-transparent border border-white/20 hover:border-gym-accent hover:text-gym-accent text-white/60 px-4 py-2 rounded-sm text-[9px] font-bold uppercase tracking-widest transition-all active:scale-95 cursor-pointer mt-auto"
                                    >
                                      Log
                                    </button>
                                  </div>

                                  <PBBlock 
                                    exName={ex.name} 
                                    pbs={personalBests} 
                                    showLatest={true} 
                                    sessionSets={sessionSets}
                                    archivedWorkouts={archivedWorkouts}
                                  />
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </motion.div>
          ) : activeView === 'progress' ? (
            <motion.div 
              key="progress"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Weight Tracking Section */}
              <div className="border border-white/5 rounded-sm overflow-hidden bg-white/[0.01]">
                <button 
                  onClick={() => setExpandedProgressSections(prev => ({ ...prev, weight: !prev.weight }))}
                  className="w-full text-left px-8 py-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors cursor-pointer group"
                >
                  <div>
                    <h3 className="text-xl font-light italic font-serif flex items-center gap-3 mb-1">
                      Weight Tracking
                    </h3>
                    <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold">Physical progression tracking</p>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-white/20 group-hover:text-gym-accent transition-all ${expandedProgressSections.weight ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {expandedProgressSections.weight && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-8 pb-10 pt-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-end gap-4 mb-10 pb-8 border-b border-white/5">
                          <div className="flex flex-wrap items-center gap-4">
                            <div className="relative">
                              <input 
                                type="number"
                                inputMode="decimal"
                                placeholder="Weight (kg)"
                                value={newWeight}
                                onChange={(e) => setNewWeight(e.target.value)}
                                disabled={isSavingWeight}
                                className="bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-sm font-light focus:outline-none focus:border-gym-accent transition-all w-32 disabled:opacity-50 text-white"
                              />
                            </div>
                            <div className="relative">
                              <input 
                                type="date"
                                value={newWeightDate}
                                onChange={(e) => setNewWeightDate(e.target.value)}
                                disabled={isSavingWeight}
                                className="bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-sm font-light focus:outline-none focus:border-gym-accent transition-all w-44 disabled:opacity-50 text-white [color-scheme:dark]"
                              />
                              <AnimatePresence>
                                {weightFlash && (
                                  <motion.div 
                                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.8, y: 10 }}
                                    className={`absolute -bottom-8 left-0 right-0 text-center text-[9px] font-bold uppercase tracking-widest ${weightFlash.includes('Error') || weightFlash.includes('Invalid') || weightFlash.includes('Enter') ? 'text-red-500' : 'text-gym-accent'}`}
                                  >
                                    {weightFlash}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                            <button 
                              onClick={handleSaveWeight}
                              disabled={isSavingWeight || !newWeight || !newWeightDate}
                              className="bg-gym-accent text-black px-6 py-3 rounded-sm font-bold text-[10px] uppercase tracking-widest transition-all active:scale-95 flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed accent-shadow-btn"
                            >
                              {isSavingWeight ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <Plus className="w-3 h-3" />
                              )}
                              Record
                            </button>
                          </div>
                        </div>

                        <div className="h-[350px] w-full mb-10">
                          {weightHistory.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center bg-white/5 rounded-sm border border-white/5 border-dashed">
                              <TrendingUp className="w-12 h-12 text-white/10 mb-2" />
                              <p className="text-white/20 font-bold text-sm">Add your weight to see your progress data</p>
                            </div>
                          ) : (
                            <ResponsiveContainer width="100%" height="100%">
                              <AreaChart 
                                data={(() => {
                                   const grouped = weightHistory.reduce((acc, entry) => {
                                     acc[entry.date] = entry; 
                                     return acc;
                                   }, {} as Record<string, WeightEntry>);
                                   return (Object.values(grouped) as WeightEntry[]).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
                                })()} 
                                margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
                              >
                                <defs>
                                  <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={activeTheme.accent} stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor={activeTheme.accent} stopOpacity={0}/>
                                  </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                <XAxis 
                                  dataKey="date" 
                                  stroke="#ffffff33" 
                                  fontSize={10} 
                                  tickLine={false}
                                  axisLine={false}
                                  dy={15}
                                  minTickGap={20}
                                  tickFormatter={(str) => {
                                    if (!str) return '';
                                    try {
                                      const [y, m, d] = str.split('-').map(Number);
                                      const date = new Date(y, m - 1, d);
                                      return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
                                    } catch (e) {
                                      return str;
                                    }
                                  }}
                                />
                                <YAxis 
                                  domain={[(dataMin: number) => Math.max(0, Math.floor(dataMin - 5)), (dataMax: number) => Math.ceil(dataMax + 5)]} 
                                  stroke="#ffffff33" 
                                  fontSize={10} 
                                  tickLine={false}
                                  axisLine={false}
                                  width={40}
                                  tickFormatter={(val) => `${val}kg`}
                                />
                                <Tooltip 
                                  cursor={{ stroke: activeTheme.accent, strokeWidth: 1, strokeDasharray: '4 4' }}
                                  contentStyle={{ 
                                    backgroundColor: '#0d0d0d', 
                                    borderColor: '#ffffff10', 
                                    borderRadius: '4px',
                                    boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                                    padding: '12px'
                                  }}
                                  itemStyle={{ color: activeTheme.accent, fontWeight: 'bold' }}
                                  labelStyle={{ color: '#ffffff50', fontSize: '10px', textTransform: 'uppercase', fontWeight: '900', marginBottom: '4px', letterSpacing: '0.1em' }}
                                  labelFormatter={(str) => {
                                    if (!str) return 'Date';
                                    try {
                                      const [y, m, d] = str.split('-').map(Number);
                                      const date = new Date(y, m - 1, d);
                                      return date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
                                    } catch (e) {
                                      return str;
                                    }
                                  }}
                                  formatter={(value: any) => [`${value} kg`, 'Weight']}
                                />
                                <Area 
                                  type="basis" 
                                  dataKey="weight" 
                                  stroke={activeTheme.accent} 
                                  strokeWidth={3}
                                  fillOpacity={1} 
                                  fill="url(#colorWeight)" 
                                  animationDuration={2500}
                                />
                                <Area 
                                  type="basis" 
                                  dataKey="weight" 
                                  stroke="none" 
                                  fill={activeTheme.accent} 
                                  fillOpacity={0.05} 
                                />
                              </AreaChart>
                            </ResponsiveContainer>
                          )}
                        </div>

                        <div className="mt-6">
                          <button
                            onClick={() => setShowWeightHistoryList(!showWeightHistoryList)}
                            type="button"
                            className="w-full flex items-center justify-between px-6 py-4 bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 rounded-sm text-[10px] font-bold uppercase tracking-widest text-white/60 hover:text-white transition-all cursor-pointer group"
                          >
                            <span className="flex items-center gap-2">
                              <History className="w-3.5 h-3.5 text-gym-accent group-hover:scale-110 transition-transform" />
                              {showWeightHistoryList ? "Hide Weight Logs" : `View Weight Logs (${weightHistory.length})`}
                            </span>
                            <ChevronDown className={`w-4 h-4 text-white/30 group-hover:text-gym-accent transition-transform duration-300 ${showWeightHistoryList ? "rotate-180" : ""}`} />
                          </button>

                          <AnimatePresence>
                            {showWeightHistoryList && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.25 }}
                                className="overflow-hidden"
                              >
                                {weightHistory.length === 0 ? (
                                  <div className="py-8 text-center text-xs text-white/20 italic bg-white/[0.01] border border-white/5 border-t-0 rounded-b-sm">
                                    No logged weight entries yet
                                  </div>
                                ) : (
                                  <div className="mt-2 max-h-56 overflow-y-auto divide-y divide-white/5 border border-white/5 rounded-sm bg-[#0a0a0a]/80 backdrop-blur-md">
                                    {[...weightHistory].reverse().map((entry, i) => (
                                      <div key={entry.id || i} className="flex items-center justify-between px-6 py-3.5 hover:bg-white/[0.02] transition-colors group">
                                        <div className="flex flex-col gap-0.5">
                                          <div className="flex items-baseline gap-1.5">
                                            <span className="text-base font-medium text-white">
                                              {entry.weight}
                                            </span>
                                            <span className="text-[10px] text-white/40">kg</span>
                                          </div>
                                          <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest">
                                            {(() => {
                                              if (!entry.date) return 'Unknown Date';
                                              const parts = entry.date.split('-').map(Number);
                                              if (parts.length !== 3) return entry.date;
                                              const date = new Date(parts[0], parts[1] - 1, parts[2]);
                                              return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
                                            })()}
                                          </span>
                                        </div>
                                        {entry.id && (
                                          <button 
                                            onClick={async () => {
                                              if (!currentUser) return;
                                              try {
                                                await deleteDoc(doc(db, `users/${currentUser.uid}/weightEntries/${entry.id}`));
                                              } catch (err) {
                                                handleFirestoreError(err, OperationType.DELETE, `weightEntries/${entry.id}`);
                                              }
                                            }}
                                            className="p-2 text-white/25 hover:text-red-500 hover:bg-red-500/10 rounded-sm transition-all cursor-pointer"
                                            title="Delete entry"
                                          >
                                            <Trash2 className="w-3.5 h-3.5" />
                                          </button>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Trending Section */}
              <div className="border border-white/5 rounded-sm overflow-hidden bg-white/[0.01]">
                <button 
                  onClick={() => setExpandedProgressSections(prev => ({ ...prev, trending: !prev.trending }))}
                  className="w-full text-left px-8 py-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors cursor-pointer group"
                >
                  <div>
                    <h3 className="text-xl font-light italic font-serif flex items-center gap-3 mb-1">
                      Trending
                    </h3>
                    <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold">Volume & Output Analysis</p>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-white/20 group-hover:text-gym-accent transition-all ${expandedProgressSections.trending ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {expandedProgressSections.trending && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-8 pb-10 pt-4">
                        <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/5">
                           <div className="flex bg-white/5 p-1 rounded-sm">
                             {(['day', 'week', 'month'] as const).map(tf => (
                               <button
                                 key={tf}
                                 onClick={() => setVolumeTimeframe(tf)}
                                 className={`px-4 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-sm transition-all ${volumeTimeframe === tf ? 'bg-gym-accent text-black shadow-lg' : 'text-white/40 hover:text-white'}`}
                               >
                                 {tf}
                               </button>
                             ))}
                           </div>
                           <div className="text-right">
                             <p className="text-[9px] text-white/20 uppercase tracking-widest font-black mb-1">Current Metric</p>
                             <p className="text-sm font-light text-gym-accent italic font-serif">Total Training Volume (kg)</p>
                           </div>
                        </div>



                        <div className="h-[350px] w-full">
                          {archivedWorkouts.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center bg-white/5 rounded-sm border border-white/5 border-dashed">
                              <Activity className="w-12 h-12 text-white/10 mb-2" />
                              <p className="text-white/20 font-bold text-sm">Capture workouts to see your volume trending</p>
                            </div>
                          ) : (
                            <ResponsiveContainer width="100%" height="100%">
                              <AreaChart 
                                data={getVolumeData()} 
                                margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
                              >
                                <defs>
                                  <linearGradient id="colorVol" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={activeTheme.accent} stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor={activeTheme.accent} stopOpacity={0}/>
                                  </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                <XAxis 
                                  dataKey="date" 
                                  stroke="#ffffff33" 
                                  fontSize={10} 
                                  tickLine={false}
                                  axisLine={false}
                                  dy={15}
                                  tickFormatter={(str) => {
                                    if (!str) return '';
                                    try {
                                       if (volumeTimeframe === 'month') {
                                         const [y, m] = str.split('-');
                                         const date = new Date(Number(y), Number(m) - 1, 1);
                                         return date.toLocaleDateString('en-GB', { month: 'short', year: '2-digit' });
                                       }
                                       if (volumeTimeframe === 'week') return `W/C ${str.split('-').slice(1).reverse().join('/')}`;
                                       const [y, m, d] = str.split('-').map(Number);
                                       return new Date(y, m-1, d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
                                    } catch (e) { return str }
                                  }}
                                />
                                <YAxis 
                                  stroke="#ffffff33" 
                                  fontSize={10} 
                                  tickLine={false}
                                  axisLine={false}
                                  width={45}
                                  tickFormatter={(val) => val >= 1000 ? `${(val/1000).toFixed(1)}t` : `${val}kg`}
                                />
                                <Tooltip 
                                  cursor={{ stroke: activeTheme.accent, strokeWidth: 1, strokeDasharray: '4 4' }}
                                  contentStyle={{ 
                                    backgroundColor: '#0d0d0d', 
                                    borderColor: '#ffffff10', 
                                    borderRadius: '4px',
                                    boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                                    padding: '12px'
                                  }}
                                  itemStyle={{ color: activeTheme.accent, fontWeight: 'bold' }}
                                  labelStyle={{ color: '#ffffff50', fontSize: '10px', textTransform: 'uppercase', fontWeight: '900', marginBottom: '4px', letterSpacing: '0.1em' }}
                                  formatter={(value: any) => [`${Number(value).toLocaleString()} kg`, 'Volume']}
                                />
                                <Area 
                                  type="basis" 
                                  dataKey="volume" 
                                  stroke={activeTheme.accent} 
                                  strokeWidth={3}
                                  fillOpacity={1} 
                                  fill="url(#colorVol)" 
                                  animationDuration={2500}
                                />
                                <Area 
                                  type="basis" 
                                  dataKey="volume" 
                                  stroke="none" 
                                  fill={activeTheme.accent} 
                                  fillOpacity={0.05} 
                                />
                              </AreaChart>
                            </ResponsiveContainer>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ) : activeView === 'anatomy' ? (
            <motion.div 
              key="anatomy"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <div className="border-b border-white/5 pb-8">
                <h3 className="text-xl font-light italic font-serif flex items-center gap-3 mb-1">
                  Physiological Analysis
                </h3>
                <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold">Real-time muscle recruitment mapping</p>
              </div>

              <AnatomyChart sets={sessionSets} />
              
              {sessionSets.length === 0 && (
                <div className="py-12 px-8 bg-white/[0.02] border border-white/5 rounded-sm text-center">
                   <Activity className="w-8 h-8 text-white/10 mx-auto mb-4" />
                   <p className="text-sm font-light text-white/40 italic font-serif">No active session data recorded to map physiological evolution.</p>
                   <button 
                     onClick={() => setActiveView('workout')}
                     className="mt-6 text-[10px] text-gym-accent font-bold uppercase tracking-widest border-b border-gym-accent/30 hover:border-gym-accent transition-all cursor-pointer"
                   >
                     Commence Recording in Programming
                   </button>
                </div>
              )}
            </motion.div>
          ) : activeView === 'session' ? (
            <motion.div 
              key="session"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8 pb-20"
            >
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h3 className="text-xl font-light italic font-serif flex items-center gap-3">
                    Session Records
                  </h3>
                  <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold mt-1">Archived workout intelligence</p>
                </div>
                
                <div className="flex items-center gap-4">
                </div>
              </div>

              {archivedWorkouts.length === 0 && sessionSets.length === 0 ? (
                <div className="py-20 text-center bg-white/5 rounded-3xl border border-dashed border-white/10">
                  <Dumbbell className="w-12 h-12 text-white/10 mx-auto mb-4" />
                  <p className="text-white/30 font-medium">No archived sessions found.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Active Performance Log Section */}
                  {sessionSets.length > 0 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-12">
                       <div className="flex items-center justify-between mb-6">
                         <h4 className="text-[10px] text-gym-accent font-bold uppercase tracking-[0.3em] flex items-center gap-3">
                           <Activity className="w-4 h-4" />
                           Active Performance Log
                         </h4>
                       </div>
                       
                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                         {Object.entries(
                            sessionSets.reduce((acc, set) => {
                              if (!acc[set.exerciseName]) acc[set.exerciseName] = [];
                              acc[set.exerciseName].push(set);
                              return acc;
                            }, {} as Record<string, SessionSet[]>)
                          ).map(([name, exerciseSets]: [string, SessionSet[]]) => (
                            <div key={name} className="bg-white/[0.03] border border-gym-accent/30 rounded-sm p-4 relative overflow-hidden group">
                              <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-bold text-white/60 uppercase">{name}</span>
                                  <button 
                                    onClick={() => {
                                      const ex = findExerciseByName(name);
                                      if (ex) setGuidanceEx(ex);
                                    }}
                                    className="p-1 text-white/10 hover:text-gym-accent transition-all cursor-pointer"
                                    title="View Guidance"
                                  >
                                    <BookOpen className="w-3 h-3" />
                                  </button>
                                </div>
                                <span className="text-[9px] text-gym-accent font-black uppercase tracking-widest">{exerciseSets.length} Sets</span>
                              </div>
                              <div className="space-y-2">
                                {exerciseSets.map((s, idx) => (
                                  <div key={idx} className="flex items-center justify-between group/set">
                                    <div className="flex items-center gap-3">
                                      <span className="text-[11px] tabular-nums text-white/90">{s.weight}kg</span>
                                      <span className="text-[11px] tabular-nums text-white/40">×</span>
                                      <span className="text-[11px] tabular-nums text-white/90">{s.reps}</span>
                                    </div>
                                    <button
                                      onClick={() => s.id && handleDeleteSet(s.id)}
                                      className="opacity-0 group-hover/set:opacity-100 p-1 text-white/10 hover:text-red-500 transition-all cursor-pointer"
                                      title="Delete set"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                       </div>
 
                       <div className="mt-8 flex items-center justify-center gap-4">
                         <button 
                           onClick={handleClearActiveSession}
                           className="px-6 py-4 border border-red-500/20 text-red-500/60 text-[10px] font-bold uppercase tracking-widest hover:bg-red-500/10 transition-all cursor-pointer rounded-sm"
                         >
                           Discard Session
                         </button>
                          <button 
                            onClick={handleArchiveWorkout}
                            className="px-6 py-4 border border-gym-accent/30 text-gym-accent text-[10px] font-bold uppercase tracking-widest hover:bg-gym-accent/10 transition-all cursor-pointer rounded-sm flex items-center gap-3"
                          >
                            <Save className="w-4 h-4 animate-pulse" />
                            Capture Workout Session
                          </button>
                       </div>
                    </motion.div>
                  )}

                  {/* Archived Sessions Section */}
                  {(archivedWorkouts.length > 0) && (
                    <div className="space-y-8">
                       <div className="flex items-center justify-between border-b border-white/5 pb-6">
                          <h4 className="text-[10px] text-white/40 font-bold uppercase tracking-[0.3em] flex items-center gap-3">
                            <History className="w-4 h-4 text-gym-accent" />
                            Archived Evolutions
                          </h4>
                          
                          <div className="relative">
                            <button 
                              onClick={() => setShowHistoryMenu(!showHistoryMenu)}
                              className="bg-white/5 border border-white/10 px-4 py-2 rounded-sm text-[10px] font-bold uppercase tracking-widest text-gym-accent hover:bg-white/10 transition-all flex items-center gap-3 cursor-pointer"
                            >
                              <History className="w-3 h-3" />
                              {selectedWorkoutId && archivedWorkouts.find(w => w.id === selectedWorkoutId) ? 
                                archivedWorkouts.find(w => w.id === selectedWorkoutId)?.date : 
                                "History Explorer"
                              }
                              <ChevronDown className={`w-3 h-3 transition-transform ${showHistoryMenu ? 'rotate-180' : ''}`} />
                            </button>
                            
                            <AnimatePresence>
                              {showHistoryMenu && (
                                <motion.div 
                                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                  className="absolute top-full right-0 mt-2 w-64 bg-[#0d0d0d] border border-white/10 rounded-sm shadow-2xl z-50 overflow-hidden"
                                >
                                  <div className="max-h-72 overflow-y-auto py-2">
                                    {archivedWorkouts.map((w) => {
                                      const d = new Date(w.date);
                                      return (
                                        <div
                                          key={w.id}
                                          className={`group/item w-full text-left px-4 py-3 hover:bg-white/5 transition-colors flex items-center justify-between ${selectedWorkoutId === w.id ? 'bg-gym-accent/10 border-l-2 border-gym-accent' : ''}`}
                                        >
                                          <div 
                                            className="flex flex-col flex-grow cursor-pointer"
                                            onClick={() => {
                                              setSelectedWorkoutId(w.id);
                                              setShowHistoryMenu(false);
                                            }}
                                          >
                                            <span className="text-[10px] font-bold text-white/80 uppercase tracking-widest">
                                              {d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                                            </span>
                                            <span className="text-[9px] text-white/20 uppercase">
                                              {d.toLocaleDateString('en-GB', { weekday: 'long' })}
                                            </span>
                                          </div>
                                          <div className="flex items-center gap-3">
                                            <div className="text-[10px] text-gym-accent/60 font-bold tabular-nums">
                                              {w.exercisesCount} Ex.
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                       </div>

                       {/* Selected or Latest Workout Display */}
                       {(() => {
                         const workout = selectedWorkoutId ? 
                           archivedWorkouts.find(w => w.id === selectedWorkoutId) : 
                           null;
                         
                         if (!workout) {
                           return (
                             <motion.div 
                               initial={{ opacity: 0 }}
                               animate={{ opacity: 1 }}
                               className="flex flex-col items-center justify-center p-20 border border-white/5 border-dashed rounded-sm bg-white/[0.01]"
                             >
                               <History className="w-12 h-12 text-white/5 mb-6" />
                               <h3 className="text-xl font-serif italic text-white/40 text-center px-10">Sync Required: Select Another Session Date Above</h3>
                               <p className="text-[10px] text-gym-accent/30 uppercase tracking-[0.4em] font-black mt-4">Evolutionary records are available in the history explorer</p>
                             </motion.div>
                           );
                         }
                         
                         const dateObj = new Date(workout.date);
                         return (
                           <motion.div 
                             key={workout.id}
                             initial={{ opacity: 0, y: 20 }}
                             animate={{ opacity: 1, y: 0 }}
                             className="border border-white/10 rounded-sm overflow-hidden bg-white/[0.01]"
                           >
                              <div className="p-8 border-b border-white/5 bg-white/[0.02] flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="flex items-center gap-8">
                                  <div className="w-16 h-16 bg-gym-accent/10 border border-gym-accent/20 rounded-sm flex flex-col items-center justify-center">
                                    <span className="text-xl font-light text-gym-accent">{dateObj.getDate()}</span>
                                    <span className="text-[9px] font-black text-gym-accent/60 uppercase tracking-tighter">{dateObj.toLocaleDateString('en-GB', { month: 'short' })}</span>
                                  </div>
                                  <div>
                                    <h4 className="text-3xl font-light italic font-serif text-white/90 mb-1">
                                      {dateObj.toLocaleDateString('en-GB', { weekday: 'long' })}
                                    </h4>
                                    <div className="flex items-center gap-6">
                                      <div className="flex items-center gap-2">
                                        <Activity className="w-3 h-3 text-gym-accent/60" />
                                        <span className="text-[10px] text-white/30 uppercase tracking-widest font-black">{workout.totalVolume?.toLocaleString()} kg Volume</span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Dumbbell className="w-3 h-3 text-gym-accent/60" />
                                        <span className="text-[10px] text-white/30 uppercase tracking-widest font-black">{workout.exercisesCount} Exercises</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <button 
                                    onClick={() => handleDeleteWorkout(workout.id)}
                                    disabled={dataLoading}
                                    className={`flex items-center gap-2 px-6 py-3 border rounded-sm text-[10px] font-bold uppercase tracking-[0.3em] transition-all cursor-pointer group shadow-lg ${dataLoading ? 'bg-white/5 border-white/10 text-white/20' : 'bg-red-500/5 border-red-500/20 text-red-500/60 hover:bg-red-500 hover:text-white hover:border-red-500 shadow-red-500/5'}`}
                                  >
                                    {dataLoading ? (
                                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                    ) : (
                                      <Trash2 className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                                    )}
                                    {dataLoading ? 'Excluding...' : 'Exclude Record'}
                                  </button>
                                </div>
                              </div>
                              
                              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                                {Object.entries(
                                  workout.sets.reduce((acc: any, set: any) => {
                                    if (!acc[set.exerciseName]) acc[set.exerciseName] = [];
                                    acc[set.exerciseName].push(set);
                                    return acc;
                                  }, {})
                                ).map(([name, exerciseSets]: [string, any]) => (
                                  <div key={name} className="space-y-4">
                                    <div className="flex items-center justify-between">
                                      <h5 className="text-[10px] text-white/70 font-bold uppercase tracking-[0.2em]">{name}</h5>
                                      <span className="text-[9px] text-white/20 font-bold uppercase">{exerciseSets.length} Sets</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                      {exerciseSets.map((s: any, idx: number) => (
                                        <div key={idx} className="bg-white/[0.04] border border-white/5 p-3 flex items-center justify-between">
                                          <div className="flex flex-col">
                                            <span className="text-[7px] text-white/20 uppercase font-black">Weight</span>
                                            <span className="text-sm font-light text-white tabular-nums">{s.weight}kg</span>
                                          </div>
                                          <div className="flex flex-col items-end">
                                            <span className="text-[7px] text-white/20 uppercase font-black">Reps</span>
                                            <span className="text-sm font-light text-white tabular-nums">{s.reps}</span>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                           </motion.div>
                         );
                       })()}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          ) : activeView === 'avatar' ? (
            <motion.div
              key="avatar"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <AvatarPanel
                profile={profile}
                setProfile={setProfile}
                saveSettings={saveSettings}
                setToast={setToast}
                archivedWorkouts={archivedWorkouts}
              />
            </motion.div>
          ) : activeView === 'profile' ? (() => {
            const totalLifetimeVolume = archivedWorkouts.reduce((sum, w) => sum + (w.totalVolume || 0), 0);
            const milestones = [
              { target: 10000, label: 'Novice', icon: Shield },
              { target: 100000, label: 'Warrior', icon: Medal },
              { target: 500000, label: 'Titan', icon: Award },
              { target: 1000000, label: 'Immortal', icon: Crown }
            ];
            const currentMilestoneIndex = milestones.findIndex(m => totalLifetimeVolume < m.target);
            const nextMilestone = currentMilestoneIndex === -1 ? milestones[milestones.length - 1] : milestones[currentMilestoneIndex];
            const isMaxed = currentMilestoneIndex === -1;
            const progressPercent = isMaxed ? 100 : Math.min((totalLifetimeVolume / nextMilestone.target) * 100, 100);

            return (
            <motion.div 
              key="profile"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-2xl mx-auto space-y-12 pb-20"
            >
              <div className="flex flex-col items-center text-center">
                <div className="relative group mb-6">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-gym-accent/20 bg-white/5 flex items-center justify-center">
                    {profile?.photoURL || currentUser.photoURL ? (
                      <img src={profile?.photoURL || currentUser.photoURL || ""} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <UserIcon className="w-12 h-12 text-white/10" />
                    )}
                  </div>
                </div>
                <h3 className="text-3xl font-light italic font-serif text-white mb-2">{profile?.displayName || currentUser.displayName || "Athlete Profile"}</h3>
                <p className="text-[10px] text-white/30 uppercase tracking-[0.4em] font-black">Archive Identity</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/[0.02] border border-white/10 rounded-sm p-8 flex flex-col items-center justify-center relative overflow-hidden group">
                  <Flame className="w-8 h-8 text-gym-accent mb-4 relative z-10" />
                   <div className="text-4xl font-light text-white mb-1 relative z-10">{profile?.streakCount || 0}</div>
                   <div className="text-[10px] text-white/30 uppercase tracking-widest font-black relative z-10">Current Streak</div>
                   <div className="absolute top-0 right-0 p-2 opacity-5">
                      <Flame className="w-16 h-16 text-gym-accent" />
                   </div>
                </div>
                <div className="bg-white/[0.02] border border-white/10 rounded-sm p-8 flex flex-col items-center justify-center relative overflow-hidden group">
                  <Activity className="w-8 h-8 text-gym-accent mb-4 relative z-10" />
                   <div className="text-4xl font-light text-white mb-1 relative z-10">{archivedWorkouts.length}</div>
                   <div className="text-[10px] text-white/30 uppercase tracking-widest font-black relative z-10">Captured Sessions</div>
                   <div className="absolute top-0 right-0 p-2 opacity-5">
                      <Activity className="w-16 h-16 text-gym-accent" />
                   </div>
                </div>
              </div>

              {/* Volume Gamification Section */}
              <div className="bg-white/[0.02] border border-gym-accent/10 rounded-sm p-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gym-accent/30 to-transparent" />
                
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                  <div>
                    <h4 className="text-[10px] font-black text-gym-accent uppercase tracking-[0.3em] mb-2">Volume Evolution</h4>
                    <div className="flex items-baseline gap-2">
                       <span className="text-5xl font-light text-white tracking-tighter tabular-nums">
                         {totalLifetimeVolume.toLocaleString()}
                       </span>
                       <span className="text-xs text-white/40 uppercase tracking-widest font-bold">KG Lifted</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] text-white/30 uppercase tracking-widest mb-1">Status</p>
                    <p className="text-lg font-serif italic text-gym-accent">
                      {isMaxed ? "Immortal Legend" : milestones[currentMilestoneIndex === -1 ? 3 : Math.max(0, currentMilestoneIndex - 1)].label}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <span className="text-[9px] text-white/30 uppercase tracking-widest font-bold">Progress to {nextMilestone.label}</span>
                    <span className="text-[10px] text-gym-accent font-black tracking-widest">{isMaxed ? 'MAXED' : `${nextMilestone.target.toLocaleString()} KG`}</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 shadow-inner">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercent}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-gym-accent/60 via-gym-accent to-gym-accent-light accent-shadow-bar"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4 mt-12">
                   {milestones.map((m, idx) => {
                     const isEarned = totalLifetimeVolume >= m.target;
                     const Icon = m.icon;
                     return (
                       <div key={idx} className="flex flex-col items-center gap-3">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-700 ${
                            isEarned 
                              ? 'bg-gym-accent/10 border border-gym-accent/30 text-gym-accent accent-shadow-badge' 
                              : 'bg-white/[0.02] border border-white/5 text-white/5'
                          }`}>
                            <Icon className={`w-5 h-5 ${isEarned ? 'animate-pulse' : ''}`} />
                          </div>
                          <div className="flex flex-col items-center text-center">
                            <span className={`text-[8px] font-black uppercase tracking-widest ${isEarned ? 'text-white/80' : 'text-white/10'}`}>{m.label}</span>
                            <span className={`text-[7px] font-bold ${isEarned ? 'text-gym-accent/60' : 'text-white/5'}`}>{m.target/1000}K</span>
                          </div>
                          {isEarned && (
                            <motion.div 
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="mt-1"
                            >
                              <Trophy className="w-3 h-3 text-gym-accent" />
                            </motion.div>
                          )}
                       </div>
                     );
                   })}
                </div>
              </div>

              <div className="bg-white/[0.02] border border-white/10 rounded-sm p-8 space-y-8">
                <div>
                  <h4 className="text-[10px] font-black text-gym-accent uppercase tracking-[0.3em] mb-6 border-b border-white/5 pb-4">Personal Details</h4>
                  
                  <div className="space-y-6">
                    <div className="flex flex-col gap-2">
                       <span className="text-[9px] text-white/20 uppercase tracking-widest font-bold">Display Name</span>
                       <input 
                         type="text"
                         defaultValue={profile?.displayName || currentUser.displayName || ""}
                         className="bg-transparent border-b border-white/10 py-2 text-sm font-light focus:outline-none focus:border-gym-accent transition-all text-white"
                         onBlur={(e) => {
                           const name = e.target.value;
                           if (name && name !== profile?.displayName) {
                             saveSettings({ displayName: name });
                             setProfile(prev => prev ? { ...prev, displayName: name } : null);
                           }
                         }}
                       />
                    </div>
                    <div className="flex flex-col gap-2">
                       <span className="text-[9px] text-white/20 uppercase tracking-widest font-bold">Avatar URL</span>
                       <input 
                         type="text"
                         defaultValue={profile?.photoURL || currentUser.photoURL || ""}
                         className="bg-transparent border-b border-white/10 py-2 text-sm font-light focus:outline-none focus:border-gym-accent transition-all text-white"
                         placeholder="https://..."
                         onBlur={(e) => {
                           const url = e.target.value;
                           if (url && url !== profile?.photoURL) {
                             saveSettings({ photoURL: url });
                             setProfile(prev => prev ? { ...prev, photoURL: url } : null);
                           }
                         }}
                       />
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/5 pt-8">
                  <h4 className="text-[10px] font-black text-gym-accent uppercase tracking-[0.3em] mb-4 flex items-center justify-between">
                    <span>App Atmosphere</span>
                    <span className="text-[8px] opacity-40 uppercase tracking-widest font-bold">Theme Customizer</span>
                  </h4>
                  <p className="text-xs text-white/40 mb-6 font-light leading-relaxed">
                    Select a visual theme to align with your training mentality. Each atmosphere re-defines the color scheme, accents, and deep focus background.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {Object.values(GYM_THEMES).map((theme) => {
                      const isActive = theme.id === currentThemeId;
                      return (
                        <button
                          key={theme.id}
                          onClick={async () => {
                            setCurrentThemeId(theme.id);
                            localStorage.setItem('gym-theme-id', theme.id);
                            saveSettings({ themeId: theme.id });
                          }}
                          type="button"
                          className={`relative text-left p-4 rounded-sm border cursor-pointer overflow-hidden transition-all duration-300 group flex flex-col justify-between h-24 ${
                            isActive 
                              ? 'border-gym-accent bg-gym-accent/5 accent-shadow-card' 
                              : 'border-white/5 bg-white/[0.01] hover:border-white/20 hover:bg-white/[0.03]'
                          }`}
                        >
                          {/* Mini Background Preview */}
                          <div className="absolute inset-0 z-0 opacity-10 group-hover:opacity-15 transition-opacity">
                            <img src={theme.bgImage} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                          
                          <div className="relative z-10 w-full flex flex-col justify-between h-full">
                            <div className="flex justify-between items-start">
                              <span className={`text-[9px] font-black uppercase tracking-widest transition-colors ${isActive ? 'text-gym-accent font-black' : 'text-white/60'}`}>
                                {theme.name}
                              </span>
                              {isActive && (
                                <span className="w-2 h-2 rounded-full bg-gym-accent accent-shadow-dot" />
                              )}
                            </div>
                            
                            <div>
                              <p className="text-[8px] text-white/40 group-hover:text-white/60 transition-colors leading-tight font-light line-clamp-2">
                                {theme.textVibe}
                              </p>
                              {/* Accent Color Pill */}
                              <div className="flex gap-1 mt-1.5">
                                <span className="w-2.5 h-1 rounded-full" style={{ backgroundColor: theme.accent }} />
                                <span className="w-1.5 h-1 rounded-full" style={{ backgroundColor: theme.accentLight }} />
                                <span className="w-1.5 h-1 rounded-full" style={{ backgroundColor: theme.accentDark }} />
                              </div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                   <h4 className="text-[10px] font-black text-gym-accent uppercase tracking-[0.3em] mb-4 border-b border-white/5 pb-4">Lifecycle</h4>
                   <div className="flex items-center justify-between py-2">
                      <span className="text-[10px] text-white/30 uppercase tracking-widest">Archive Created</span>
                      <span className="text-sm font-light text-white/80">
                        {profile?.startDate ? new Date(profile.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '---'}
                      </span>
                   </div>
                </div>
              </div>



              <div className="flex justify-center">
                 <button 
                   onClick={handleLogout}
                   className="text-[10px] text-white/20 hover:text-red-500 uppercase tracking-[0.3em] font-black underline underline-offset-8 decoration-white/10 hover:decoration-red-500 transition-all cursor-pointer"
                 >
                   Deactivate Session
                 </button>
              </div>
            </motion.div>
          )})() : activeView === 'workout' ? (
            <motion.div 
              key="workout-view"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-3"
            >
              <div className="mb-6 pb-6 border-b border-white/5 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-light italic font-serif">Training Programming</h3>
                  <p className="text-[10px] text-white/20 uppercase tracking-[0.2em] font-bold">Curate your physical evolution</p>
                </div>
              </div>

              {DAY_CONFIG.map((day, di) => (
                <div key={di} className="group">
                  <button
                    onClick={() => setExpandedDays(prev => ({ ...prev, [di]: !prev[di] }))}
                    className="w-full flex items-center justify-between p-6 rounded-sm bg-white/[0.02] border border-white/10 hover:bg-white/[0.04] transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] font-bold text-gym-accent uppercase tracking-[0.2em]">{day.label}</span>
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-light italic font-serif text-white/90">{day.name}</h3>
                        <span className="text-[9px] text-white/10 px-2 py-0.5 border border-white/5 rounded-full uppercase tabular-nums">
                          {currentDays[di]?.length || 0} Ex.
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {!expandedDays[di] && currentDays[di]?.length === 0 && (
                        <span className="text-[9px] text-gym-accent font-bold uppercase tracking-widest opacity-60 group-hover:opacity-100">Click to Create Plan</span>
                      )}
                      <ChevronDown className={`w-4 h-4 transition-transform duration-500 ${expandedDays[di] ? 'rotate-180' : ''} text-white/20 group-hover:text-gym-accent`} />
                    </div>
                  </button>
                  
                  <AnimatePresence>
                    {expandedDays[di] && (
                      <motion.div
                        initial={{ height: 0, opacity: 0, marginTop: 0 }}
                        animate={{ height: "auto", opacity: 1, marginTop: 12 }}
                        exit={{ height: 0, opacity: 0, marginTop: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-6">
                          {currentDays[di]?.map((ex, ei) => {
                            const Icon = iconMap[ex.icon] || Dumbbell;
                            return (
                              <motion.div 
                                key={`${ei}-${ex.name}`} 
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: ei * 0.05 }}
                                className="bg-white/[0.02] border border-white/10 rounded-sm p-6 flex flex-col group/card"
                              >
                                <div className="flex items-center justify-between mb-6">
                                  <div className="flex flex-col">
                                    <span className="text-[10px] text-gym-accent font-bold uppercase tracking-widest">Exercise {ei + 1}</span>
                                    <h4 className="text-2xl font-light italic font-serif text-gym-accent mt-1 drop-shadow-sm">{ex.name}</h4>
                                  </div>
                                  <div className="flex gap-2">
                                    <button 
                                      onClick={() => setGuidanceEx(ex)}
                                      className="p-3 bg-white/5 border border-white/10 text-white/40 hover:text-gym-accent hover:bg-gym-accent/5 transition-all cursor-pointer rounded-sm"
                                      title="Guidance & Instructions"
                                    >
                                      <BookOpen className="w-4 h-4" />
                                    </button>
                                    <button 
                                      onClick={() => handleSwap(di, ei)}
                                      className="p-3 bg-white/5 border border-white/10 text-white/40 hover:text-gym-accent hover:bg-gym-accent/5 transition-all cursor-pointer rounded-sm"
                                      title="Swap Exercise"
                                    >
                                      <RefreshCw className="w-4 h-4" />
                                    </button>
                                    <button 
                                      onClick={() => handleRemoveExerciseFromPlan(di, ei)}
                                      className="p-3 bg-white/5 border border-white/10 text-white/40 hover:text-red-500 hover:bg-red-500/5 transition-all cursor-pointer rounded-sm"
                                      title="Remove"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                                
                                <div className="flex gap-4 mb-4 mt-auto">
                                  <div className="flex flex-col flex-1">
                                    <span className="text-[9px] text-white/20 uppercase tracking-widest mb-1 font-bold">Weight</span>
                                    <input 
                                      type="number"
                                      inputMode="decimal"
                                      placeholder="---"
                                      id={`w-${di}-${ei}`}
                                      className="w-full bg-transparent border-b border-white/10 py-1 text-xl font-light focus:outline-none focus:border-gym-accent transition-all text-white"
                                    />
                                  </div>
                                  <div className="flex flex-col flex-1">
                                    <span className="text-[9px] text-white/20 uppercase tracking-widest mb-1 font-bold">Reps</span>
                                    <input 
                                      type="number"
                                      inputMode="numeric"
                                      placeholder="---"
                                      id={`r-${di}-${ei}`}
                                      className="w-full bg-transparent border-b border-white/10 py-1 text-xl font-light focus:outline-none focus:border-gym-accent transition-all text-white"
                                    />
                                  </div>
                                  <button 
                                    onClick={() => {
                                      const wInput = document.getElementById(`w-${di}-${ei}`) as HTMLInputElement;
                                      const rInput = document.getElementById(`r-${di}-${ei}`) as HTMLInputElement;
                                      const w = wInput?.value;
                                      const r = rInput?.value;
                                      if (w && r) {
                                        handleSaveSet(ex.name, w, r);
                                        if (wInput) wInput.value = "";
                                        if (rInput) rInput.value = "";
                                      }
                                    }}
                                    className="bg-transparent border border-white/20 hover:border-gym-accent hover:text-gym-accent text-white/60 px-4 py-2 rounded-sm text-[9px] font-bold uppercase tracking-widest transition-all active:scale-95 cursor-pointer mt-auto"
                                  >
                                    Log
                                  </button>
                                </div>

                                <PBBlock 
                                  exName={ex.name} 
                                  pbs={personalBests} 
                                  sessionSets={sessionSets}
                                  archivedWorkouts={archivedWorkouts}
                                />
                              </motion.div>
                            );
                          })}

                          {/* Add Exercise Slot */}
                          <button 
                            onClick={() => setAddingToDay(di)}
                            className="bg-white/[0.01] border border-white/5 border-dashed rounded-sm p-8 flex flex-col items-center justify-center gap-3 hover:bg-white/[0.03] hover:border-gym-accent/30 transition-all cursor-pointer group/add min-h-[280px]"
                          >
                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover/add:bg-gym-accent group-hover/add:text-black transition-all">
                              <Plus className="w-4 h-4" />
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 group-hover/add:text-white transition-all">Add Exercise</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-24 text-center opacity-40 px-8"
            >
              <div className="w-16 h-16 bg-gym-accent/10 rounded-full flex items-center justify-center mb-6">
                <Flame className="w-8 h-8 text-gym-accent" />
              </div>
              <h2 className="text-xl font-bold mb-2">Ready to crush it?</h2>
              <p className="text-sm">Select a category from the navigation above to start your journey.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Add Exercise Modal */}
      <AnimatePresence>
        {addingToDay !== null && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setAddingToDay(null); setModalSearch(""); }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-sm overflow-hidden flex flex-col max-h-[80vh] shadow-2xl"
            >
              <div className="p-8 border-b border-white/5">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gym-accent font-bold uppercase tracking-[0.3em] mb-1">Select Exercise</span>
                    <h3 className="text-xl font-light italic font-serif">Add to {DAY_CONFIG[addingToDay].name}</h3>
                  </div>
                  <button 
                    onClick={() => { setAddingToDay(null); setModalSearch(""); }}
                    className="p-2 text-white/20 hover:text-white transition-all cursor-pointer"
                  >
                    Close
                  </button>
                </div>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                  <input 
                    type="text"
                    placeholder="Search relevant exercises..."
                    autoFocus
                    value={modalSearch}
                    onChange={(e) => setModalSearch(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-sm pl-12 pr-4 py-4 text-sm font-light focus:outline-none focus:border-gym-accent transition-all text-white"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                {DAY_CONFIG[addingToDay].pools.map(poolKey => {
                  const pool = POOLS[poolKey] || [];
                  const filtered = pool.filter(ex => 
                    ex.name.toLowerCase().includes(modalSearch.toLowerCase()) &&
                    !currentDays[addingToDay].some(p => p.name === ex.name)
                  );
                  
                  if (filtered.length === 0) return null;

                  const renderExercise = (ex: Exercise) => (
                    <div key={ex.name} className="relative group">
                      <button
                        onClick={() => handleAddExerciseToPlan(addingToDay, ex)}
                        className="w-full flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-sm hover:bg-white/5 hover:border-gym-accent/30 transition-all text-left cursor-pointer group/inner"
                      >
                        <span className="text-xs font-medium text-white/70 group-hover/inner:text-gym-accent transition-colors">{ex.name}</span>
                        <Plus className="w-3 h-3 text-white/10 group-hover/inner:text-gym-accent" />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setGuidanceEx(ex);
                        }}
                        className="absolute right-12 top-1/2 -translate-y-1/2 p-2 text-white/10 hover:text-gym-accent transition-all cursor-pointer"
                        title="View Guidance"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );

                  if (poolKey === 'legs') {
                    const groups = ['quads', 'hamstrings', 'glutes', 'calves'] as const;

                    return (
                      <div key={poolKey} className="mb-8">
                        {groups.map(group => {
                          const groupExercises = filtered.filter(e => e.muscleGroup === group);
                          if (groupExercises.length === 0) return null;

                          return (
                            <div key={group} className="mb-6">
                              <h4 className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em] mb-4 ml-2 border-l border-gym-accent/40 pl-3">
                                {group} Assets
                              </h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {groupExercises.map(renderExercise)}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  }

                  if (poolKey === 'core') {
                    return (
                      <div key={poolKey} className="mb-8">
                        <h4 className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em] mb-4 ml-2 border-l border-gym-accent/40 pl-3">
                          Abs/Core Assets
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {filtered.map(renderExercise)}
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div key={poolKey} className="mb-8">
                      <h4 className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em] mb-4 ml-2 border-l border-gym-accent/40 pl-3">
                        {poolKey} Assets
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {filtered.map(renderExercise)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Guidance Modal */}
      <AnimatePresence>
        {guidanceEx && (() => {
          const resolvedEx = findExerciseByName(guidanceEx.name) || guidanceEx;
          return (
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setGuidanceEx(null)}
                className="absolute inset-0 bg-black/90 backdrop-blur-md"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 30 }}
                className="relative w-full max-w-xl bg-[#0a0a0a] border border-white/10 rounded-sm overflow-hidden flex flex-col shadow-2xl"
              >
                <div className="p-10 border-b border-white/5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gym-accent/5 rounded-full blur-3xl -mr-16 -mt-16" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-sm flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-gym-accent" />
                      </div>
                      <div>
                        <span className="text-[10px] text-gym-accent font-bold uppercase tracking-[0.4em] block mb-1">Evolutionary Guidance</span>
                        <h3 className="text-3xl font-light italic font-serif text-white tracking-tight">{resolvedEx.name}</h3>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="flex flex-col">
                        <span className="text-[8px] text-white/20 uppercase tracking-widest font-black mb-1">Focus Area</span>
                        <span className="text-[10px] text-white/60 font-bold uppercase tracking-widest border border-white/10 px-2 py-1 rounded-sm bg-white/[0.02]">
                          {resolvedEx.pool}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[8px] text-white/20 uppercase tracking-widest font-black mb-1">Source</span>
                        <span className="text-[10px] text-gym-accent font-black uppercase tracking-widest flex items-center gap-1">
                          PureGym Intelligence <ExternalLink className="w-2 h-2" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-10 bg-white/[0.01]">
                  <h4 className="text-[9px] font-black text-gym-accent uppercase tracking-[0.4em] mb-8 flex items-center gap-3">
                    <div className="h-px flex-1 bg-gym-accent/20" />
                    Execution Sequence
                    <div className="h-px flex-1 bg-gym-accent/20" />
                  </h4>
                  
                  <div className="space-y-6">
                    {resolvedEx.instructions && resolvedEx.instructions.length > 0 ? (
                      resolvedEx.instructions.map((step, idx) => (
                        <motion.div 
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 + (idx * 0.1) }}
                          key={idx} 
                          className="flex gap-6 group"
                        >
                          <div className="flex-shrink-0 w-8 h-8 rounded-sm bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-black text-gym-accent group-hover:bg-gym-accent group-hover:text-black transition-all">
                            {idx + 1}
                          </div>
                          <p className="text-[14px] leading-relaxed text-white/70 font-light pt-1.5">{step}</p>
                        </motion.div>
                      ))
                    ) : (
                      <div className="py-12 flex flex-col items-center justify-center text-center opacity-30">
                        <RefreshCw className="w-10 h-10 animate-spin mb-4" />
                        <p className="text-[10px] font-bold uppercase tracking-widest">Compiling guide from PureGym archive...</p>
                        <p className="text-[10px] uppercase tracking-widest mt-1 italic opacity-50">This record is currently being indexed</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-8 border-t border-white/5 bg-white/[0.02] flex justify-end">
                  <button 
                    onClick={() => setGuidanceEx(null)}
                    className="px-10 py-4 bg-white/5 border border-white/10 text-white/60 hover:text-white hover:border-gym-accent hover:bg-gym-accent/5 transition-all text-[10px] font-black uppercase tracking-[0.3em] cursor-pointer rounded-sm"
                  >
                    Close Archive
                  </button>
                </div>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>
      
      {/* Google Drive Action Confirmation Dialog */}
      <AnimatePresence>
        {driveConfirmAction && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDriveConfirmAction(null)}
              className="absolute inset-0 bg-black/95 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="relative w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-sm overflow-hidden flex flex-col shadow-2xl"
            >
              <div className="p-8 border-b border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gym-accent/5 rounded-full blur-2xl -mr-12 -mt-12" />
                <div className="relative z-10 flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-sm flex items-center justify-center border ${
                    driveConfirmAction.type === 'delete' 
                      ? 'bg-red-500/10 border-red-500/25 text-red-500' 
                      : 'bg-gym-accent/10 border-gym-accent/20 text-gym-accent'
                  }`}>
                    {driveConfirmAction.type === 'delete' ? (
                      <Trash2 className="w-5 h-5" />
                    ) : (
                      <Download className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <span className="text-[10px] text-white/40 font-bold uppercase tracking-[0.4em] block mb-1">
                      {driveConfirmAction.type === 'delete' ? 'Destructive Action' : 'System Restoration'}
                    </span>
                    <h3 className="text-lg font-bold text-white uppercase tracking-wider">
                      {driveConfirmAction.type === 'delete' ? 'Confirm Deletion' : 'Confirm Restore'}
                    </h3>
                  </div>
                </div>
              </div>

              <div className="p-8 space-y-4">
                <p className="text-xs text-white/60 leading-relaxed font-light">
                  {driveConfirmAction.type === 'delete' ? (
                    <>
                      Are you sure you want to permanently delete <span className="font-semibold text-white font-mono break-all">{driveConfirmAction.fileName}</span> from your Google Drive? This action is irreversible.
                    </>
                  ) : (
                    <>
                      Are you sure you want to restore the backup file <span className="font-semibold text-white font-mono break-all">{driveConfirmAction.fileName}</span>? This will overwrite your active training days, progress logs, and personal best history.
                    </>
                  )}
                </p>
              </div>

              <div className="p-6 border-t border-white/5 bg-white/[0.01] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setDriveConfirmAction(null)}
                  className="px-5 py-3 hover:text-white text-white/40 text-[10px] font-bold uppercase tracking-widest cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (driveConfirmAction.type === 'delete') {
                      executeDeleteBackup(driveConfirmAction.fileId);
                    } else {
                      executeRestoreBackup(driveConfirmAction.fileId);
                    }
                  }}
                  className={`px-6 py-3 text-black text-[10px] font-black uppercase tracking-widest cursor-pointer rounded-sm transition-all hover:brightness-110 ${
                    driveConfirmAction.type === 'delete' ? 'bg-red-500 text-white shadow-lg shadow-red-500/10' : 'bg-gym-accent text-black shadow-lg shadow-gym-accent/10'
                  }`}
                >
                  {driveConfirmAction.type === 'delete' ? 'Permanently Delete' : 'Confirm Restore'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className={`fixed bottom-10 left-1/2 z-[200] px-6 py-3 rounded-sm border shadow-2xl flex items-center gap-3 min-w-[280px] ${
              toast.type === 'pb' 
                ? 'bg-gym-accent border-gym-accent text-black' 
                : 'bg-[#0d0d0d] border-gym-accent/30 text-white'
            }`}
          >
            {toast.type === 'pb' ? <Trophy className="w-4 h-4" /> : <div className="w-2 h-2 rounded-full bg-gym-accent animate-pulse" />}
            <span className="text-[11px] font-bold uppercase tracking-widest">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  </div>
  );
}
