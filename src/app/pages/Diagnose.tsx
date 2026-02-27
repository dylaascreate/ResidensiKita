import { useState, useRef, useCallback } from "react";
import {
  Camera,
  Upload,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Phone,
  Star,
  ChevronRight,
  RefreshCw,
  Zap,
  Droplets,
  Bug,
  Home,
  X,
  Info,
  ArrowRight,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const crackImg = "https://images.unsplash.com/photo-1670078763002-59f7982d493e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YWxsJTIwY3JhY2slMjBidWlsZGluZyUyMGRhbWFnZSUyMGluc3BlY3Rpb258ZW58MXx8fHwxNzcyMjA3NDA0fDA&ixlib=rb-4.1.0&q=80&w=1080";
const plumberImg = "https://images.unsplash.com/photo-1581720604719-ee1b1a4e44b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwbHVtYmVyJTIwcGlwZSUyMGxlYWslMjB3YXRlciUyMHJlcGFpcnxlbnwxfHx8fDE3NzIyMDc0MDV8MA&ixlib=rb-4.1.0&q=80&w=1080";
const maintenanceImg = "https://images.unsplash.com/photo-1759250451406-d01cfb0655da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidWlsZGluZyUyMG1haW50ZW5hbmNlJTIwd29ya2VyJTIwcmVwYWlyfGVufDF8fHx8MTc3MjIwNzM5N3ww&ixlib=rb-4.1.0&q=80&w=1080";

type DiagnoseState = "idle" | "uploading" | "analyzing" | "results";

type IssueSeverity = "low" | "medium" | "high" | "critical";

interface DiagnosisResult {
  issueType: string;
  emoji: string;
  description: string;
  severity: IssueSeverity;
  confidence: number;
  causeAnalysis: string[];
  immediateActions: string[];
  longTermFix: string;
  estimatedCost: { min: number; max: number };
  urgency: string;
  matchedExperts: Expert[];
  communityMatches: CommunityExpert[];
}

interface Expert {
  name: string;
  company: string;
  rating: number;
  reviews: number;
  price: string;
  availability: string;
  distance: string;
  certified: boolean;
}

interface CommunityExpert {
  name: string;
  unit: string;
  skill: string;
  rate: number;
  rating: number;
}

const mockDiagnoses: DiagnosisResult[] = [
  {
    issueType: "Retakan Dinding – Struktur Ringan",
    emoji: "🏗️",
    description: "AI mengesan retakan halus (hairline crack) pada permukaan plaster. Kemungkinan besar disebabkan pengembangan dan pengecutan bahan akibat perubahan suhu.",
    severity: "low",
    confidence: 91,
    causeAnalysis: [
      "Perubahan suhu harian yang menyebabkan pengembangan material",
      "Plaster lama yang mula mengering dan pecah",
      "Kemungkinan getaran kecil dari trafik jalan raya",
    ],
    immediateActions: [
      "Tandakan kawasan retakan dengan pita perekat untuk memantau perkembangan",
      "Bersihkan kawasan dari habuk dan kotoran",
      "Elakkan penggunaan air berdekatan kawasan retakan",
    ],
    longTermFix: "Tampal dengan filler dinding berkualiti tinggi, keringkan 24 jam, kemudian cat semula. Pemantauan 3 bulan disyorkan.",
    estimatedCost: { min: 150, max: 450 },
    urgency: "Dalam 30 hari",
    matchedExperts: [
      { name: "Faizal Construction", company: "FC Renovation Works", rating: 4.9, reviews: 67, price: "RM 150–300", availability: "Khamis ini", distance: "1.2 km", certified: true },
      { name: "BuildRight MY", company: "BuildRight Sdn Bhd", rating: 4.7, reviews: 42, price: "RM 200–400", availability: "Minggu depan", distance: "3.5 km", certified: true },
    ],
    communityMatches: [
      { name: "Faizal Iskandar", unit: "Unit 6-D", skill: "Tukang Kayu & Renovasi", rate: 55, rating: 4.9 },
    ],
  },
  {
    issueType: "Kebocoran Paip – Tahap Sederhana",
    emoji: "💧",
    description: "AI mengesan tanda-tanda kelembapan berlebihan dan kemungkinan kebocoran paip tersembunyi. Kesan berair pada dinding menunjukkan kebocoran aktif.",
    severity: "medium",
    confidence: 87,
    causeAnalysis: [
      "Paip tersembunyi dalam dinding mungkin mengalami kebocoran",
      "Sambungan paip yang longgar atau berkarat",
      "Tekanan air berlebihan menyebabkan keretakan pada paip",
    ],
    immediateActions: [
      "SEGERA tutup injap air utama bangunan",
      "Hubungi pejabat pengurusan untuk tindakan segera",
      "Jauhkan peralatan elektrik dari kawasan basah",
    ],
    longTermFix: "Penggantian bahagian paip yang rosak, pemeriksaan menyeluruh sistem paip, dan waterproofing semula dinding.",
    estimatedCost: { min: 400, max: 1200 },
    urgency: "Dalam 48 jam",
    matchedExperts: [
      { name: "Rajan Plumbing", company: "Rajan & Sons Plumbing", rating: 4.8, reviews: 89, price: "RM 400–800", availability: "Hari ini", distance: "0.8 km", certified: true },
      { name: "AquaFix Pro", company: "AquaFix Services", rating: 4.6, reviews: 55, price: "RM 350–700", availability: "Esok", distance: "2.1 km", certified: false },
    ],
    communityMatches: [
      { name: "Rajan Pillai", unit: "Unit 2-F", skill: "Tukang Paip & Sanitari", rate: 60, rating: 4.7 },
    ],
  },
  {
    issueType: "Serangan Anai-anai – Kritikal",
    emoji: "🐜",
    description: "AI mengesan kerosakan struktur kayu yang konsisten dengan serangan anai-anai. Terdapat terowong tanah dan kayu berlubang yang visible.",
    severity: "critical",
    confidence: 94,
    causeAnalysis: [
      "Kelembapan tinggi yang menarik anai-anai tanah",
      "Kayu struktur tidak dirawat dengan bahan anti-anai",
      "Jarak terlalu dekat antara kayu dan tanah",
    ],
    immediateActions: [
      "JANGAN ganggu kawasan — anai-anai mungkin merebak",
      "Hubungi syarikat kawalan perosak SEGERA",
      "Dokumentasi semua kawasan yang terjejas dengan foto",
    ],
    longTermFix: "Rawatan fumigasi profesional, penggantian kayu yang rosak, dan pemasangan sistem anti-anai jangka panjang.",
    estimatedCost: { min: 800, max: 3000 },
    urgency: "SEGERA – Hari ini",
    matchedExperts: [
      { name: "PestBusters KL", company: "PestBusters Sdn Bhd", rating: 4.9, reviews: 134, price: "RM 800–2000", availability: "Dalam 2 jam", distance: "1.5 km", certified: true },
    ],
    communityMatches: [],
  },
];

const severityConfig = {
  low: { label: "Rendah", color: "text-emerald-700 bg-emerald-50 border-emerald-200", barColor: "bg-emerald-500", icon: CheckCircle2, iconColor: "text-emerald-600" },
  medium: { label: "Sederhana", color: "text-amber-700 bg-amber-50 border-amber-200", barColor: "bg-amber-500", icon: AlertTriangle, iconColor: "text-amber-500" },
  high: { label: "Tinggi", color: "text-orange-700 bg-orange-50 border-orange-200", barColor: "bg-orange-500", icon: AlertTriangle, iconColor: "text-orange-500" },
  critical: { label: "KRITIKAL", color: "text-red-700 bg-red-50 border-red-200", barColor: "bg-red-500", icon: AlertTriangle, iconColor: "text-red-500" },
};

const exampleIssues = [
  { icon: Home, label: "Retakan Dinding", desc: "Hairline cracks", color: "text-orange-600 bg-orange-50" },
  { icon: Droplets, label: "Kebocoran", desc: "Paip atau bumbung", color: "text-blue-600 bg-blue-50" },
  { icon: Bug, label: "Perosak", desc: "Anai-anai, lipas", color: "text-red-600 bg-red-50" },
  { icon: Zap, label: "Elektrik", desc: "Wayar terdedah", color: "text-yellow-600 bg-yellow-50" },
];

export function Diagnose() {
  const [state, setState] = useState<DiagnoseState>("idle");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult | null>(null);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [selectedIssueHint, setSelectedIssueHint] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const analysisSteps = [
    "Memuat naik gambar...",
    "Menganalisis imej dengan Vision AI...",
    "Mengenal pasti jenis kerosakan...",
    "Mengukur tahap keterukan...",
    "Mencari pakar tempatan yang sesuai...",
    "Menyediakan laporan diagnosis...",
  ];

  const runAnalysis = useCallback(() => {
    setState("analyzing");
    setAnalysisStep(0);

    const steps = analysisSteps.length;
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setAnalysisStep(step);
      if (step >= steps) {
        clearInterval(interval);
        setTimeout(() => {
          // Pick a random diagnosis or based on hint
          let resultIndex = Math.floor(Math.random() * mockDiagnoses.length);
          if (selectedIssueHint === "Kebocoran") resultIndex = 1;
          else if (selectedIssueHint === "Perosak") resultIndex = 2;
          else if (selectedIssueHint === "Retakan Dinding") resultIndex = 0;
          setDiagnosis(mockDiagnoses[resultIndex]);
          setState("results");
        }, 600);
      }
    }, 700);
  }, [selectedIssueHint]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setUploadedImage(ev.target?.result as string);
        setState("uploading");
        setTimeout(() => runAnalysis(), 1200);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDemoAnalysis = (demoImage: string) => {
    setUploadedImage(demoImage);
    setState("uploading");
    setTimeout(() => runAnalysis(), 1000);
  };

  const reset = () => {
    setState("idle");
    setUploadedImage(null);
    setDiagnosis(null);
    setAnalysisStep(0);
    setSelectedIssueHint(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  if (state === "results" && diagnosis) {
    const sev = severityConfig[diagnosis.severity];
    const SevIcon = sev.icon;
    return (
      <div className="pb-24 lg:pb-8">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 px-4 lg:px-6 pt-5 pb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <p className="text-white text-sm font-semibold">Laporan AI Diagnosis</p>
                <p className="text-slate-400 text-xs">Google Vision AI · Keyakinan {diagnosis.confidence}%</p>
              </div>
            </div>
            <button onClick={reset} className="flex items-center gap-1.5 text-slate-400 hover:text-white text-xs bg-white/10 px-3 py-1.5 rounded-xl">
              <RefreshCw className="w-3.5 h-3.5" /> Imbas Baru
            </button>
          </div>

          <div className="relative rounded-2xl overflow-hidden mb-4">
            <img src={uploadedImage || crackImg} alt="Uploaded" className="w-full h-44 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            {/* AI Overlay Simulation */}
            <div className="absolute top-3 left-3">
              <div className="border-2 border-emerald-400 rounded-lg w-16 h-16 flex items-center justify-center">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-ping absolute" />
              </div>
            </div>
            <div className="absolute bottom-3 right-3 bg-emerald-500 text-white text-xs px-2.5 py-1.5 rounded-xl font-semibold">
              ✓ Dianalisis
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-3xl">{diagnosis.emoji}</span>
            <div>
              <p className="text-white font-bold text-base">{diagnosis.issueType}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs px-2.5 py-0.5 rounded-full border font-semibold flex items-center gap-1 ${sev.color}`}>
                  <SevIcon className="w-3 h-3" /> {sev.label}
                </span>
                <span className="text-slate-400 text-xs">{diagnosis.urgency}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 lg:px-6 py-4 space-y-4">
          {/* AI Summary */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-xl bg-emerald-100 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <p className="font-semibold text-slate-800 text-sm">Analisis AI</p>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">{diagnosis.description}</p>

            {/* Confidence Bar */}
            <div className="mt-3">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-500">Keyakinan AI</span>
                <span className="font-semibold text-slate-700">{diagnosis.confidence}%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${diagnosis.confidence}%` }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  className={`h-full ${sev.barColor} rounded-full`}
                />
              </div>
            </div>
          </motion.div>

          {/* Cause Analysis */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
            <p className="font-semibold text-slate-800 text-sm mb-3 flex items-center gap-2">
              <span className="text-lg">🔍</span> Punca Yang Mungkin
            </p>
            <ul className="space-y-2">
              {diagnosis.causeAnalysis.map((cause, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs text-slate-600">
                  <span className="w-4 h-4 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">{i + 1}</span>
                  {cause}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Immediate Actions */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className={`rounded-2xl p-4 border ${diagnosis.severity === "critical" ? "bg-red-50 border-red-200" : "bg-amber-50 border-amber-200"}`}>
            <p className="font-semibold text-slate-800 text-sm mb-3 flex items-center gap-2">
              <span className="text-lg">⚡</span> Tindakan Segera
            </p>
            <ul className="space-y-2">
              {diagnosis.immediateActions.map((action, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  {action}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Cost Estimate */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-800 text-sm mb-0.5">Anggaran Kos Pembaikan</p>
                <p className="text-xs text-slate-500">{diagnosis.longTermFix}</p>
              </div>
              <div className="text-right shrink-0 ml-4">
                <p className="text-xl font-bold text-emerald-600">RM {diagnosis.estimatedCost.min}–{diagnosis.estimatedCost.max}</p>
                <p className="text-[10px] text-slate-400">Anggaran kasar</p>
              </div>
            </div>
          </motion.div>

          {/* Community Experts */}
          {diagnosis.communityMatches.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
              className="bg-purple-50 border border-purple-200 rounded-2xl p-4">
              <p className="font-semibold text-slate-800 text-sm mb-3 flex items-center gap-2">
                <span className="text-lg">👥</span> Pakar Komuniti Kawasan Anda
              </p>
              {diagnosis.communityMatches.map((expert, i) => (
                <div key={i} className="flex items-center justify-between bg-white rounded-xl p-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
                      {expert.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{expert.name}</p>
                      <p className="text-xs text-slate-500">{expert.unit} · {expert.skill}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-800">RM {expert.rate}/jam</p>
                    <div className="flex items-center gap-0.5 justify-end">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span className="text-xs text-slate-600">{expert.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* Matched Experts */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
            <p className="font-semibold text-slate-800 text-sm mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" /> Kontraktor Disyorkan AI
            </p>
            <div className="space-y-3">
              {diagnosis.matchedExperts.map((expert, i) => (
                <div key={i} className="border border-slate-100 rounded-xl p-3 hover:bg-slate-50 cursor-pointer transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {expert.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{expert.name}</p>
                          <p className="text-xs text-slate-500">{expert.company}</p>
                        </div>
                        {expert.certified && (
                          <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium shrink-0">✓ Berdaftar</span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-1.5">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                          <span className="text-xs text-slate-700">{expert.rating} ({expert.reviews})</span>
                        </div>
                        <span className="text-xs text-slate-500">{expert.distance}</span>
                        <span className="text-xs text-emerald-600 font-medium">{expert.availability}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <p className="text-sm font-bold text-slate-800">{expert.price}</p>
                    <button className="flex items-center gap-1.5 bg-emerald-600 text-white text-xs px-3 py-2 rounded-xl font-semibold">
                      <Phone className="w-3 h-3" /> Hubungi
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <button onClick={reset} className="w-full py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 transition-all">
            <RefreshCw className="w-4 h-4" /> Mulakan Diagnosis Baru
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24 lg:pb-8">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-emerald-950 to-teal-900 px-4 lg:px-6 pt-6 pb-10">
        <div className="absolute inset-0 opacity-20">
          <img src={maintenanceImg} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 backdrop-blur flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-emerald-300 text-xs font-semibold uppercase tracking-widest">Google Vision AI</p>
              <p className="text-white font-bold text-lg">AI Building Diagnosis</p>
            </div>
          </div>
          <p className="text-slate-300 text-sm leading-relaxed mb-5">
            Snap foto isu bangunan anda — retakan, kebocoran, perosak, atau kerosakan lain. AI kami akan menganalisis dan mencarikan pakar terbaik dalam kawasan anda.
          </p>

          {/* Issue Type Hints */}
          <p className="text-slate-400 text-xs mb-2">Pilih jenis isu (pilihan):</p>
          <div className="grid grid-cols-4 gap-2">
            {exampleIssues.map((issue) => (
              <button
                key={issue.label}
                onClick={() => setSelectedIssueHint(selectedIssueHint === issue.label ? null : issue.label)}
                className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl border transition-all ${
                  selectedIssueHint === issue.label
                    ? "border-emerald-400 bg-emerald-500/20"
                    : "border-white/10 bg-white/10 hover:bg-white/15"
                }`}
              >
                <div className={`w-8 h-8 rounded-lg ${selectedIssueHint === issue.label ? "bg-emerald-500" : "bg-white/10"} flex items-center justify-center`}>
                  <issue.icon className={`w-4 h-4 ${selectedIssueHint === issue.label ? "text-white" : "text-white/70"}`} />
                </div>
                <span className="text-[10px] text-white/80 text-center leading-tight">{issue.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 lg:px-6 py-5 space-y-4">
        {state === "idle" && (
          <>
            {/* Upload Area */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleFileUpload}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-emerald-300 bg-emerald-50 hover:bg-emerald-100 rounded-2xl p-8 flex flex-col items-center gap-3 transition-all active:scale-98 group"
              >
                <div className="w-16 h-16 rounded-2xl bg-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-emerald-200">
                  <Camera className="w-8 h-8 text-white" />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-slate-800">Ambil Foto / Muat Naik</p>
                  <p className="text-sm text-slate-500 mt-1">JPG, PNG, HEIC · Maksimum 20MB</p>
                </div>
                <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-full">
                  <Sparkles className="w-3 h-3" /> Dikuasakan Google Vision AI
                </div>
              </button>
            </motion.div>

            {/* Demo Examples */}
            <div>
              <p className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-500" /> Cuba contoh demonstrasi:
              </p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { img: crackImg, label: "Retakan Dinding", sub: "Struktur ringan" },
                  { img: plumberImg, label: "Kebocoran Paip", sub: "Sederhana" },
                  { img: maintenanceImg, label: "Kerosakan Umum", sub: "Perlu pemeriksaan" },
                ].map((demo, i) => (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    onClick={() => handleDemoAnalysis(demo.img)}
                    className="relative rounded-xl overflow-hidden aspect-square group"
                  >
                    <img src={demo.img} alt={demo.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-2">
                      <p className="text-white text-[10px] font-semibold">{demo.label}</p>
                      <p className="text-white/70 text-[9px]">{demo.sub}</p>
                    </div>
                    <div className="absolute top-2 right-2 bg-emerald-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold">DEMO</div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* How It Works */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
              <p className="font-semibold text-slate-800 text-sm mb-3">Cara Ia Berfungsi</p>
              <div className="space-y-3">
                {[
                  { step: "1", label: "Snap Foto", desc: "Ambil gambar isu bangunan dari sebarang sudut", icon: Camera },
                  { step: "2", label: "Analisis AI", desc: "Google Vision AI menganalisis imej dalam beberapa saat", icon: Sparkles },
                  { step: "3", label: "Laporan Lengkap", desc: "Terima diagnosis, anggaran kos, dan cadangan pakar", icon: CheckCircle2 },
                  { step: "4", label: "Hubungi Pakar", desc: "Terus hubungi kontraktor atau pakar komuniti kawasan", icon: ArrowRight },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {item.step}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-700">{item.label}</p>
                      <p className="text-xs text-slate-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Uploading / Analyzing State */}
        {(state === "uploading" || state === "analyzing") && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            {uploadedImage && (
              <div className="relative rounded-2xl overflow-hidden">
                <img src={uploadedImage} alt="Uploaded" className="w-full h-48 object-cover" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full border-4 border-emerald-400 border-t-transparent animate-spin mx-auto mb-3" />
                    <p className="text-white font-semibold text-sm">Menganalisis...</p>
                  </div>
                </div>
              </div>
            )}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800">AI Sedang Menganalisis</p>
                  <p className="text-xs text-slate-500">Google Vision AI · Building Diagnostics</p>
                </div>
              </div>
              <div className="space-y-2.5">
                {analysisSteps.map((step, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all ${
                      i < analysisStep
                        ? "bg-emerald-500"
                        : i === analysisStep
                        ? "border-2 border-emerald-500 border-t-transparent animate-spin"
                        : "border-2 border-slate-200"
                    }`}>
                      {i < analysisStep && <CheckCircle2 className="w-3 h-3 text-white" />}
                    </div>
                    <span className={`text-sm transition-all ${
                      i < analysisStep
                        ? "text-slate-500 line-through"
                        : i === analysisStep
                        ? "text-emerald-600 font-medium"
                        : "text-slate-300"
                    }`}>
                      {step}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
