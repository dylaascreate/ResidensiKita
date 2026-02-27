import React, { useState, useRef, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithCustomToken, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, onSnapshot, doc, setDoc, addDoc, updateDoc } from 'firebase/firestore';
import { 
  Upload, 
  Camera, 
  Wrench, 
  AlertTriangle, 
  CheckCircle, 
  Loader2, 
  MapPin, 
  Star, 
  Phone, 
  ArrowRight,
  ShieldAlert,
  Info,
  Users,
  Briefcase,
  BookOpen,
  Shield,
  Leaf,
  Sparkles,
  Zap,
  TrendingUp,
  PlusCircle,
  Check,
  Clock
} from 'lucide-react';

const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

// The execution environment provides the API key
const apiKey = "";

// --- MOCK DATABASE OF LOCAL EXPERTS ---
const MOCK_EXPERTS = [
  { id: 1, name: "Ah Chong Plumbing Services", skills: ["Plumber", "Plumbing", "Leaks"], rating: 4.8, jobs: 124, contact: "012-345 6789", distance: "1.2 km", price: "$$" },
  { id: 2, name: "Muthu Electrical Pros", skills: ["Electrician", "Electrical", "Wiring"], rating: 4.9, jobs: 89, contact: "019-876 5432", distance: "2.5 km", price: "$$$" },
  { id: 3, name: "Zul Pest Control", skills: ["Pest Control", "Termites", "Insects"], rating: 4.6, jobs: 56, contact: "011-223 3445", distance: "3.1 km", price: "$$" },
  { id: 4, name: "Hassan Structural Repairs", skills: ["Contractor", "Structural", "Cracks", "Painting"], rating: 4.7, jobs: 210, contact: "017-665 5443", distance: "0.8 km", price: "$$$" },
  { id: 5, name: "Wong Handyman Solutions", skills: ["Handyman", "Plumbing", "General Repair", "Doors"], rating: 4.5, jobs: 45, contact: "013-445 5667", distance: "1.5 km", price: "$" },
  { id: 6, name: "KL Rapid Leaks", skills: ["Plumber", "Plumbing", "Waterproofing"], rating: 4.4, jobs: 312, contact: "018-998 8776", distance: "4.0 km", price: "$$" },
];

// --- MOCK DATABASE FOR BULK SERVICES ---
const BULK_SERVICES = [
  { id: 1, category: 'Cleaning', title: 'Monthly Corridor Deep Clean', provider: 'Kilat Cleaners', originalPrice: 'RM 1,500/mo', bulkPrice: 'RM 900/mo', joined: 45, target: 50, icon: Sparkles, color: 'text-blue-600', bg: 'bg-blue-100' },
  { id: 2, category: 'Security', title: 'Night Patrol Drone Upgrade', provider: 'SafeGuard Sec', originalPrice: 'RM 50/unit', bulkPrice: 'RM 35/unit', joined: 120, target: 200, icon: Shield, color: 'text-purple-600', bg: 'bg-purple-100' },
  { id: 3, category: 'Landscaping', title: 'Courtyard Beautification', provider: 'GreenThumb', originalPrice: 'RM 3,000', bulkPrice: 'RM 2,000', joined: 8, target: 15, icon: Leaf, color: 'text-green-600', bg: 'bg-green-100' }
];

// --- MOCK DATABASE FOR RESIDENT SKILLS (MICRO-GIGS) ---
const RESIDENT_SKILLS = [
  { id: 1, name: 'Ahmad T.', unit: 'Blk B-12-04', skill: 'Electrician', category: 'Maintenance', rate: 'RM 50/hr', rating: 4.9, reviews: 34, icon: Zap },
  { id: 2, name: 'Sarah L.', unit: 'Blk A-05-11', skill: 'Math Tutor', category: 'Education', rate: 'RM 40/hr', rating: 4.8, reviews: 12, icon: BookOpen },
  { id: 3, name: 'Uncle Raj', unit: 'Blk C-02-01', skill: 'Plumber', category: 'Maintenance', rate: 'RM 60/hr', rating: 5.0, reviews: 89, icon: Wrench },
  { id: 4, name: 'Mei Ling', unit: 'Blk B-08-08', skill: 'Accounting/Tax', category: 'Professional', rate: 'RM 100/job', rating: 4.7, reviews: 55, icon: Briefcase },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('ai-diagnostic'); // 'ai-diagnostic', 'bulk-services', 'resident-skills', 'requests'
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [diagnosis, setDiagnosis] = useState(null);
  const [matchedExperts, setMatchedExperts] = useState([]);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  // --- FIREBASE STATE ---
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: '', unit: '', phone: '' });
  
  const [requests, setRequests] = useState([]);
  const [services, setServices] = useState([]);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestForm, setRequestForm] = useState({ title: '', description: '', price: '', category: 'Maintenance' });

  // Handle Firebase Auth & Profile
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (e) { console.error("Auth error", e); }
    };
    initAuth();

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Fetch Profile & Data
  useEffect(() => {
    if (!user) return;

    // Fetch Profile
    const unsubProfile = onSnapshot(doc(db, 'artifacts', appId, 'users', user.uid, 'profile', 'data'), (docSnap) => {
      if (docSnap.exists()) {
        setProfile(docSnap.data());
        setShowProfileModal(false);
      } else {
        setShowProfileModal(true);
      }
    }, (err) => console.error(err));

    // Fetch Requests
    const unsubReqs = onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'requests'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a,b) => b.createdAt - a.createdAt);
      setRequests(data);
    }, (err) => console.error(err));

    // Fetch Services
    const unsubServ = onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'services'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a,b) => b.createdAt - a.createdAt);
      setServices(data);
    }, (err) => console.error(err));

    return () => { unsubProfile(); unsubReqs(); unsubServ(); };
  }, [user]);

  const saveProfile = async (e) => {
    e.preventDefault();
    if (!user || !profileForm.name) return;
    try {
      await setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'profile', 'data'), {
        name: profileForm.name,
        unit: profileForm.unit || 'Pending',
        phone: profileForm.phone || ''
      });
    } catch (err) { console.error(err); }
  };

  const submitRequest = async (e) => {
    e.preventDefault();
    if (!user || !profile) return;
    try {
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'requests'), {
        ...requestForm,
        authorId: user.uid,
        authorName: profile.name,
        authorUnit: profile.unit,
        authorPhone: profile.phone || '',
        status: 'open',
        createdAt: Date.now()
      });
      setShowRequestModal(false);
      setRequestForm({ title: '', description: '', price: '', category: 'Maintenance' });
    } catch (err) { console.error(err); }
  };

  const acceptRequest = async (reqId) => {
    if (!user || !profile) return;
    try {
      await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'requests', reqId), {
        status: 'accepted',
        runnerId: user.uid,
        runnerName: profile.name
      });
    } catch (err) { console.error(err); }
  };

  const seedMockJobs = async () => {
    try {
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'requests'), {
        title: 'Fix Leaking Aircon',
        description: 'My aircon in the living room is dripping water. Need someone to flush the pipe today.',
        price: 'RM 80',
        category: 'Maintenance',
        status: 'open',
        authorId: 'fake-neighbor-1',
        authorName: 'Siti N.',
        authorUnit: 'Blk C-04-12',
        authorPhone: '012-345 6789',
        createdAt: Date.now() - 3600000
      });
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'requests'), {
        title: 'Help Assemble IKEA Wardrobe',
        description: 'Need an extra pair of hands to assemble a PAX wardrobe this weekend. Tools provided!',
        price: 'RM 120',
        category: 'Other',
        status: 'open',
        authorId: 'fake-neighbor-2',
        authorName: 'Jason L.',
        authorUnit: 'Blk A-10-02',
        authorPhone: '019-876 5432',
        createdAt: Date.now() - 7200000
      });
    } catch (err) { console.error(err); }
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      processFile(file);
    }
  };

  // Handle drag and drop
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      processFile(file);
    }
  };

  const processFile = (file) => {
    setImageFile(file);
    setError(null);
    setDiagnosis(null);
    setMatchedExperts([]);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // --- AI ANALYSIS WITH GEMINI ---
  const analyzeImage = async () => {
    if (!previewUrl) return;
    
    setIsAnalyzing(true);
    setError(null);

    try {
      // Extract base64 data
      const base64Data = previewUrl.split(',')[1];
      const mimeType = imageFile.type;

      const payload = {
        contents: [
          {
            role: "user",
            parts: [
              { text: "You are an AI building infrastructure inspector. Analyze this image of a residential building issue. Provide a detailed diagnosis." },
              { inlineData: { mimeType: mimeType, data: base64Data } }
            ]
          }
        ],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              title: { type: "STRING", description: "Short, clear title of the issue (e.g., 'Ceiling Water Leak')" },
              category: { type: "STRING", description: "Main category: Plumbing, Electrical, Structural, Pest Control, or General Repair" },
              severity: { type: "STRING", description: "Severity level: Low, Medium, High, or Critical" },
              suggestedAction: { type: "STRING", description: "Immediate 1-2 steps the resident should take before help arrives" },
              estimatedCostRange: { type: "STRING", description: "Estimated repair cost in RM (Malaysian Ringgit), e.g., 'RM 100 - RM 250'" },
              requiredSkill: { type: "STRING", description: "The specific professional required: Plumber, Electrician, Handyman, Contractor, or Pest Control" }
            },
            required: ["title", "category", "severity", "suggestedAction", "estimatedCostRange", "requiredSkill"]
          }
        }
      };

      // Implement retry logic with exponential backoff
      const maxRetries = 5;
      let attempt = 0;
      let response;
      
      while (attempt < maxRetries) {
        try {
          const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          
          if (!res.ok) throw new Error(`API error: ${res.status}`);
          response = await res.json();
          break; // Success
        } catch (err) {
          attempt++;
          if (attempt >= maxRetries) throw err;
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        }
      }

      if (response?.candidates?.[0]?.content?.parts?.[0]?.text) {
        const jsonText = response.candidates[0].content.parts[0].text;
        const parsedDiagnosis = JSON.parse(jsonText);
        setDiagnosis(parsedDiagnosis);
        matchExperts(parsedDiagnosis.requiredSkill);
      } else {
        throw new Error("Invalid response format from AI");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to analyze the image. Please try again or check your connection.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // --- RULE-BASED MATCHING ENGINE ---
  const matchExperts = (requiredSkill) => {
    const searchSkill = requiredSkill.toLowerCase();
    
    // Filter and rank experts
    const matched = MOCK_EXPERTS.filter(expert => 
      expert.skills.some(skill => skill.toLowerCase().includes(searchSkill) || searchSkill.includes(skill.toLowerCase()))
    ).sort((a, b) => b.rating - a.rating); // Rank by rating highest first
    
    // Fallback if no exact match (show general handyman)
    if (matched.length === 0) {
      const fallback = MOCK_EXPERTS.filter(e => e.skills.includes("Handyman") || e.skills.includes("Contractor"));
      setMatchedExperts(fallback);
    } else {
      setMatchedExperts(matched);
    }
  };

  const resetApp = () => {
    setImageFile(null);
    setPreviewUrl(null);
    setDiagnosis(null);
    setMatchedExperts([]);
    setError(null);
  };

  // Helper for UI colors based on severity
  const getSeverityColors = (severity) => {
    switch(severity?.toLowerCase()) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Navbar */}
      <nav className="bg-gradient-to-r from-blue-700 to-purple-800 shadow-md p-4 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 text-white cursor-pointer" onClick={resetApp}>
            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
              <ShieldAlert size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">RESIDENSIKITA</h1>
              <p className="text-xs text-blue-100 opacity-80 uppercase tracking-widest -mt-1 font-semibold">AI Infrastructure</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center space-x-4 text-sm font-medium text-white/90">
            {profile ? (
              <span className="flex items-center gap-2 bg-blue-800/50 px-3 py-1 rounded-full border border-blue-600/50">
                <Users size={14} /> {profile.name} ({profile.unit})
              </span>
            ) : null}
            <span className="bg-white/10 px-3 py-1 rounded-full text-xs border border-white/20">KitaHack 2026</span>
          </div>
        </div>
      </nav>

      {/* Secondary Navigation (Tabs) */}
      <div className="bg-white border-b border-slate-200 sticky top-[72px] z-40 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 flex overflow-x-auto hide-scrollbar">
          <button 
            onClick={() => setActiveTab('ai-diagnostic')}
            className={`flex items-center gap-2 px-6 py-4 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${activeTab === 'ai-diagnostic' ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}
          >
            <Camera size={18} />
            AI Diagnostic Hook
          </button>
          <button 
            onClick={() => setActiveTab('bulk-services')}
            className={`flex items-center gap-2 px-6 py-4 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${activeTab === 'bulk-services' ? 'border-purple-600 text-purple-700' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}
          >
            <Users size={18} />
            Bulk Community Services
          </button>
          <button 
            onClick={() => setActiveTab('resident-skills')}
            className={`flex items-center gap-2 px-6 py-4 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${activeTab === 'resident-skills' ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}
          >
            <Briefcase size={18} />
            Resident Micro-Gigs
          </button>
          <button 
            onClick={() => setActiveTab('requests')}
            className={`flex items-center gap-2 px-6 py-4 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${activeTab === 'requests' ? 'border-amber-600 text-amber-700' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}
          >
            <PlusCircle size={18} />
            Service Requests
          </button>
        </div>
      </div>

      <main className="max-w-6xl mx-auto p-4 md:p-6 lg:p-8">
        
        {/* --- AI DIAGNOSTIC TAB --- */}
        {activeTab === 'ai-diagnostic' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Intro/Hero - Only show when no diagnosis is present */}
            {!diagnosis && !isAnalyzing && (
              <div className="text-center max-w-2xl mx-auto mb-10 mt-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* STEP 1: UPLOAD & PREVIEW */}
        {!diagnosis && (
          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition-all">
            
            {!previewUrl ? (
              // Upload Area
              <div 
                className="p-10 border-2 border-dashed border-slate-300 hover:border-blue-500 hover:bg-blue-50 transition-colors text-center cursor-pointer min-h-[300px] flex flex-col items-center justify-center rounded-xl m-4"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="bg-gradient-to-br from-blue-100 to-purple-100 w-20 h-20 rounded-full flex items-center justify-center mb-4">
                  <Upload size={32} className="text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-slate-800">Upload Issue Photo</h3>
                <p className="text-slate-500 mb-6 max-w-sm">Drag and drop an image of the crack, leak, or damage, or click to browse files.</p>
                <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium py-2.5 px-6 rounded-lg hover:shadow-lg transition-shadow">
                  Select Image
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
            ) : (
              // Preview & Action Area
              <div className="flex flex-col h-full">
                <div className="bg-slate-900 relative h-64 md:h-80 w-full flex items-center justify-center overflow-hidden">
                  <img src={previewUrl} alt="Issue preview" className="max-h-full max-w-full object-contain" />
                  
                  {isAnalyzing && (
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex flex-col items-center justify-center text-white">
                      <Loader2 size={48} className="animate-spin mb-4 text-blue-400" />
                      <p className="text-lg font-medium animate-pulse">AI is diagnosing the issue...</p>
                      <p className="text-sm text-slate-300 mt-2">Powered by Gemini Vision API</p>
                    </div>
                  )}
                </div>
                
                <div className="p-6 bg-white flex justify-between items-center border-t border-slate-100">
                  <button 
                    onClick={() => setPreviewUrl(null)} 
                    disabled={isAnalyzing}
                    className="text-slate-500 font-medium hover:text-slate-700 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={analyzeImage}
                    disabled={isAnalyzing}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium py-3 px-8 rounded-lg shadow-md hover:shadow-xl transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isAnalyzing ? "Analyzing..." : "Analyze Issue"}
                    {!isAnalyzing && <ArrowRight size={18} />}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 2: RESULTS (Diagnosis & Matching) */}
        {diagnosis && (
          <div className="mt-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Analysis Results</h2>
              <button 
                onClick={resetApp}
                className="text-blue-600 bg-blue-50 hover:bg-blue-100 font-medium py-2 px-4 rounded-lg transition-colors text-sm flex items-center gap-2"
              >
                <Upload size={16} /> Submit Another
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: AI Diagnosis Card */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="h-48 bg-slate-100 relative">
                    <img src={previewUrl} alt="Analyzed" className="w-full h-full object-cover" />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-slate-700 shadow-sm flex items-center gap-1">
                      <CheckCircle size={14} className="text-green-500" /> AI Verified
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-1">{diagnosis.category}</p>
                        <h3 className="text-xl font-bold text-slate-900">{diagnosis.title}</h3>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getSeverityColors(diagnosis.severity)}`}>
                        {diagnosis.severity} Severity
                      </span>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                        <div className="flex items-center gap-2 text-slate-800 font-semibold mb-2">
                          <Info size={18} className="text-blue-500" />
                          Suggested Immediate Action
                        </div>
                        <p className="text-slate-600 text-sm leading-relaxed">
                          {diagnosis.suggestedAction}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                          <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Est. Cost Range</p>
                          <p className="font-bold text-slate-800">{diagnosis.estimatedCostRange}</p>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                          <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Required Skill</p>
                          <p className="font-bold text-slate-800">{diagnosis.requiredSkill}</p>
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => {
                          setRequestForm({
                            title: diagnosis.title,
                            description: diagnosis.suggestedAction,
                            price: diagnosis.estimatedCostRange,
                            category: diagnosis.category || 'Maintenance'
                          });
                          setActiveTab('requests');
                          setShowRequestModal(true);
                        }}
                        className="w-full mt-5 bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-4 rounded-xl transition-colors shadow-sm flex justify-center items-center gap-2"
                      >
                        <PlusCircle size={18} /> Post this issue to Community Runners
                      </button>
                    </div>
                  </div>
                </div>

                {/* SDG Alignment Info Box from Pitch Deck */}
                <div className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-2xl p-6 text-white shadow-md">
                  <h4 className="font-bold mb-3 flex items-center gap-2">
                    <MapPin size={18} className="text-blue-300" />
                    Community Impact
                  </h4>
                  <ul className="space-y-2 text-sm text-blue-100">
                    <li className="flex gap-2"><span className="font-bold text-white">SDG 11:</span> Proactive infrastructure management</li>
                    <li className="flex gap-2"><span className="font-bold text-white">SDG 8:</span> Creates micro-opportunities for local skills</li>
                    <li className="flex gap-2"><span className="font-bold text-white">SDG 9:</span> Digitizes maintenance systems</li>
                  </ul>
                </div>
              </div>

              {/* Right Column: Matched Experts */}
              <div className="lg:col-span-7">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 h-full">
                  <div className="flex justify-between items-end mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <Wrench size={20} className="text-purple-600" />
                        Smart Local Matching
                      </h3>
                      <p className="text-sm text-slate-500 mt-1">
                        Found {matchedExperts.length} local experts for "{diagnosis.requiredSkill}"
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {matchedExperts.map((expert, index) => (
                      <div key={expert.id} className="border border-slate-100 hover:border-blue-300 hover:shadow-md transition-all rounded-xl p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center bg-slate-50/50">
                        
                        {/* Avatar/Initial */}
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-100 to-purple-200 flex items-center justify-center text-blue-800 font-bold text-lg shrink-0">
                          {expert.name.charAt(0)}
                        </div>
                        
                        {/* Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-bold text-slate-900">{expert.name}</h4>
                            {index === 0 && <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Top Match</span>}
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600 mb-2">
                            <div className="flex items-center gap-1 text-amber-500 font-medium">
                              <Star size={14} fill="currentColor" /> {expert.rating}
                            </div>
                            <span className="text-slate-300">•</span>
                            <span>{expert.jobs} jobs</span>
                            <span className="text-slate-300">•</span>
                            <span className="flex items-center gap-1"><MapPin size={12} /> {expert.distance}</span>
                            <span className="text-slate-300">•</span>
                            <span className="font-medium text-slate-500">{expert.price}</span>
                          </div>

                          <div className="flex flex-wrap gap-1">
                            {expert.skills.map(skill => (
                              <span key={skill} className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-md">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Action CTA */}
                        <div className="w-full sm:w-auto mt-2 sm:mt-0">
                          <button className="w-full sm:w-auto bg-white border border-slate-200 hover:border-blue-600 hover:text-blue-700 text-slate-700 font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm">
                            <Phone size={16} /> Contact
                          </button>
                        </div>
                      </div>
                    ))}

                    {matchedExperts.length === 0 && (
                      <div className="text-center p-8 text-slate-500 border-2 border-dashed border-slate-200 rounded-xl">
                        No immediate local matches found for this specific issue. Please contact your building management.
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        )}
          </div>
        )}

        {/* --- BULK SERVICES TAB --- */}
        {activeTab === 'bulk-services' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
            <div className="text-center max-w-2xl mx-auto mb-8 mt-4">
              <h2 className="text-3xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">Collective Neighborhood Hiring</h2>
              <p className="text-slate-600 text-lg">
                Transparent pricing for bulk neighborhood services. Join these contracts, and when we hit the target, the whole community gets the discount!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {BULK_SERVICES.map(service => {
                const progress = (service.joined / service.target) * 100;
                return (
                  <div key={service.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow relative overflow-hidden flex flex-col h-full">
                    <div className="flex justify-between items-start mb-4">
                      <div className={`p-3 rounded-xl ${service.bg}`}>
                        <service.icon size={24} className={service.color} />
                      </div>
                      <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full uppercase tracking-wider">{service.category}</span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-slate-900 mb-1">{service.title}</h3>
                    <p className="text-sm text-slate-500 mb-4 flex items-center gap-1"><Briefcase size={14}/> {service.provider}</p>
                    
                    <div className="flex items-center gap-3 mb-6 bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <div className="line-through text-slate-400 text-sm">{service.originalPrice}</div>
                      <div className="text-lg font-bold text-green-600 flex items-center gap-1"><TrendingUp size={18} /> {service.bulkPrice}</div>
                    </div>

                    <div className="space-y-2 mb-6 flex-1">
                      <div className="flex justify-between text-sm font-medium">
                        <span className="text-slate-700">{service.joined} joined</span>
                        <span className="text-slate-500">Target: {service.target}</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                        <div className={`h-2.5 rounded-full ${progress >= 100 ? 'bg-green-500' : 'bg-purple-600'}`} style={{ width: `${Math.min(progress, 100)}%` }}></div>
                      </div>
                      <p className="text-xs text-slate-500 text-center mt-1">
                        {service.target - service.joined > 0 ? `${service.target - service.joined} more needed for discount` : 'Target reached! Discount secured.'}
                      </p>
                    </div>

                    <button className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 rounded-lg transition-colors mt-auto">
                      Join Bulk Contract
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* --- RESIDENT SKILLS TAB --- */}
        {activeTab === 'resident-skills' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
            <div className="text-center max-w-2xl mx-auto mb-8 mt-4">
              <h2 className="text-3xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600">Community Micro-Gigs</h2>
              <p className="text-slate-600 text-lg">
                Skill-sharing within the community. Hire your neighbors or offer your own skills—keeping the economy inside our building (SDG 8).
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6">
              <div className="flex flex-wrap gap-2">
                 {['All', 'Maintenance', 'Education', 'Professional'].map((filter, i) => (
                   <button key={filter} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${i === 0 ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-700'}`}>
                     {filter}
                   </button>
                 ))}
              </div>
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors w-full sm:w-auto justify-center">
                <Briefcase size={16} /> List My Skill
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...services, ...RESIDENT_SKILLS].map(skill => {
                const IconToUse = skill.icon || Briefcase;
                return (
                <div key={skill.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all group flex flex-col h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-700 font-bold shrink-0">
                        {skill.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 leading-tight">{skill.name}</h4>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5"><MapPin size={10} /> {skill.unit || 'Community'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4 flex-1">
                    <div className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">{skill.category}</div>
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                      <IconToUse size={18} className="text-slate-400" /> {skill.skill}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between mb-5 text-sm">
                    <div className="font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded">{skill.rate || skill.price}</div>
                    <div className="flex items-center gap-1 text-amber-500 font-medium">
                      <Star size={14} fill="currentColor" /> {skill.rating || 'New'} <span className="text-slate-400 font-normal text-xs">({skill.reviews || 0})</span>
                    </div>
                  </div>

                  <button className="w-full bg-white border border-slate-300 group-hover:bg-indigo-50 group-hover:border-indigo-300 group-hover:text-indigo-700 text-slate-700 font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2 mt-auto">
                    <Phone size={16} /> Contact Neighbor
                  </button>
                </div>
              )})}
            </div>
          </div>
        )}

        {/* --- SERVICE REQUESTS TAB --- */}
        {activeTab === 'requests' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
            <div className="text-center max-w-2xl mx-auto mb-8 mt-4">
              <h2 className="text-3xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">Service Requests</h2>
              <p className="text-slate-600 text-lg">
                Post an issue you need fixed, or pick up a job posted by a neighbor to earn extra income!
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6">
              <h3 className="font-bold text-slate-700 text-lg px-2">Open Community Jobs ({requests.length})</h3>
              <div className="flex gap-2 w-full sm:w-auto">
                <button 
                  onClick={seedMockJobs}
                  className="flex-1 sm:flex-none bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-sm border border-slate-300"
                >
                  <Users size={18} /> Load Examples
                </button>
                <button 
                  onClick={() => setShowRequestModal(true)}
                  className="flex-1 sm:flex-none bg-amber-500 hover:bg-amber-600 text-white px-5 py-2.5 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <PlusCircle size={18} /> Post a Request
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {requests.map(req => {
                const isAuthor = req.authorId === user?.uid;
                const isRunner = req.runnerId === user?.uid;
                const canViewPrivateInfo = isAuthor || isRunner;

                return (
                <div key={req.id} className={`bg-white border ${req.status === 'open' ? 'border-amber-200' : 'border-slate-200'} rounded-2xl p-6 shadow-sm flex flex-col h-full relative overflow-hidden`}>
                  {req.status === 'accepted' && (
                    <div className="absolute top-0 right-0 bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-bl-lg flex items-center gap-1 shadow-sm">
                      <Check size={12} /> Accepted by {req.runnerName}
                    </div>
                  )}
                  
                  <div className="flex justify-between items-start mb-3 mt-2">
                    <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full uppercase tracking-wider">{req.category}</span>
                    <span className="font-bold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-lg">{req.price}</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{req.title}</h3>
                  <p className="text-sm text-slate-600 mb-6 flex-1 line-clamp-3">{req.description}</p>
                  
                  <div className="flex items-center gap-3 text-sm text-slate-500 border-t border-slate-100 pt-4 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center font-bold text-slate-600 border border-slate-300">
                      {req.authorName?.charAt(0) || '?'}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 leading-tight">{req.authorName || 'Resident'}</p>
                      <p className="text-xs">{canViewPrivateInfo ? req.authorUnit : 'Unit Hidden'} • <Clock size={10} className="inline ml-1" /> Just now</p>
                    </div>
                  </div>

                  {req.status === 'accepted' && canViewPrivateInfo && (
                    <div className="mb-4 bg-blue-50 p-3 rounded-lg border border-blue-100 flex flex-col gap-1.5">
                      <p className="text-xs font-bold text-blue-800 uppercase tracking-wider flex items-center gap-1"><Shield size={12}/> Contact Details Unlocked</p>
                      <p className="text-sm text-blue-900 flex items-center gap-2 font-medium"><MapPin size={14} className="text-blue-500"/> {req.authorUnit}</p>
                      <p className="text-sm text-blue-900 flex items-center gap-2 font-medium"><Phone size={14} className="text-blue-500"/> {req.authorPhone || 'No phone provided'}</p>
                    </div>
                  )}

                  {req.status === 'open' && (req.authorId !== user?.uid) && (
                    <button 
                      onClick={() => acceptRequest(req.id)}
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <CheckCircle size={16} /> Accept Job
                    </button>
                  )}
                  {req.status === 'open' && (req.authorId === user?.uid) && (
                    <button disabled className="w-full bg-slate-100 text-slate-400 font-medium py-2.5 rounded-lg border border-slate-200 cursor-not-allowed flex justify-center items-center gap-2">
                       <Loader2 size={16} className="animate-spin" /> Waiting for Runner...
                    </button>
                  )}
                  {req.status === 'accepted' && (
                    <button disabled className="w-full bg-green-50 text-green-700 font-medium py-2.5 rounded-lg border border-green-200 cursor-not-allowed">
                       Job in Progress
                    </button>
                  )}
                </div>
              )})}
              
              {requests.length === 0 && (
                <div className="col-span-full text-center p-12 text-slate-500 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                  <Wrench size={48} className="mx-auto text-slate-300 mb-4" />
                  <h3 className="text-lg font-bold text-slate-700 mb-1">No Open Requests</h3>
                  <p>Be the first to post a service request for the community!</p>
                </div>
              )}
            </div>
          </div>
        )}

      </main>

      {/* --- MODALS --- */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6 mx-auto">
              <Users size={32} />
            </div>
            <h2 className="text-2xl font-bold text-center mb-2">Welcome!</h2>
            <p className="text-slate-600 text-center mb-8 text-sm">Please set up your resident profile to interact with the community marketplace.</p>
            <form onSubmit={saveProfile}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Display Name</label>
                  <input required type="text" value={profileForm.name} onChange={e => setProfileForm({...profileForm, name: e.target.value})} className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-shadow" placeholder="e.g. Ahmad T." />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Unit Number</label>
                  <input required type="text" value={profileForm.unit} onChange={e => setProfileForm({...profileForm, unit: e.target.value})} className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-shadow" placeholder="e.g. Blk A-12-04" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Phone Number (For Runners)</label>
                  <input required type="tel" value={profileForm.phone} onChange={e => setProfileForm({...profileForm, phone: e.target.value})} className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-shadow" placeholder="e.g. 012-345 6789" />
                </div>
              </div>
              <button type="submit" className="w-full mt-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg text-white font-bold py-3.5 rounded-xl transition-all hover:scale-[1.02]">
                Save & Enter
              </button>
            </form>
          </div>
        </div>
      )}

      {showRequestModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Post a Request</h2>
              <button onClick={() => setShowRequestModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors bg-slate-100 hover:bg-slate-200 w-8 h-8 rounded-full flex items-center justify-center font-bold">&times;</button>
            </div>
            <form onSubmit={submitRequest}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Issue Title</label>
                  <input required type="text" value={requestForm.title} onChange={e => setRequestForm({...requestForm, title: e.target.value})} className="w-full border border-slate-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-amber-500 outline-none" placeholder="e.g. Leaking kitchen sink" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Category</label>
                    <select value={requestForm.category} onChange={e => setRequestForm({...requestForm, category: e.target.value})} className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-amber-500 outline-none bg-white">
                      <option>Maintenance</option>
                      <option>Cleaning</option>
                      <option>Delivery</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Price Offer</label>
                    <input required type="text" value={requestForm.price} onChange={e => setRequestForm({...requestForm, price: e.target.value})} className="w-full border border-slate-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-amber-500 outline-none" placeholder="RM 50" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Description</label>
                  <textarea required value={requestForm.description} onChange={e => setRequestForm({...requestForm, description: e.target.value})} className="w-full border border-slate-300 rounded-xl px-4 py-3 h-28 focus:ring-2 focus:ring-amber-500 outline-none resize-none" placeholder="Describe what you need help with..." />
                </div>
              </div>
              <button type="submit" className="w-full mt-8 bg-amber-500 hover:bg-amber-600 shadow-lg shadow-amber-500/30 text-white font-bold py-3.5 rounded-xl transition-all hover:scale-[1.02] flex items-center justify-center gap-2">
                <PlusCircle size={18} /> Post Community Job
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}