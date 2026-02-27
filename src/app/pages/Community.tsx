import { useState } from "react";
import {
  Star,
  Search,
  MapPin,
  MessageCircle,
  ChevronRight,
  Zap,
  BookOpen,
  Hammer,
  Droplets,
  Plus,
  Users,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const electricianImg = "https://images.unsplash.com/photo-1751486289947-4f5f5961b3aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJpY2lhbiUyMHJlcGFpciUyMGhvbWUlMjB3b3JrfGVufDF8fHx8MTc3MjIwNzQwMnww&ixlib=rb-4.1.0&q=80&w=1080";
const communityImg = "https://images.unsplash.com/photo-1660044049301-7e98a91cf27c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjByZXNpZGVudHMlMjBuZWlnaGJvcmhvb2QlMjBNYWxheXNpYXxlbnwxfHx8fDE3NzIyMDczOTl8MA&ixlib=rb-4.1.0&q=80&w=1080";

const skillCategories = [
  { label: "Semua", icon: "🏘️" },
  { label: "Elektrik", icon: "⚡" },
  { label: "Paip", icon: "💧" },
  { label: "Pendidikan", icon: "📚" },
  { label: "Pertukangan", icon: "🔨" },
  { label: "Teknologi", icon: "💻" },
  { label: "Masakan", icon: "🍳" },
  { label: "Kecergasan", icon: "🏋️" },
];

const residents = [
  {
    id: "1",
    name: "Aziz bin Rahman",
    unit: "Unit 8-A",
    avatar: "AR",
    avatarColor: "from-blue-500 to-indigo-600",
    skill: "Juruterawan Elektrik",
    category: "Elektrik",
    icon: Zap,
    iconColor: "text-yellow-600 bg-yellow-50",
    rate: 50,
    rateUnit: "jam",
    rating: 4.9,
    reviews: 28,
    jobsDone: 34,
    available: true,
    bio: "Juruterawan elektrik berlesen dengan 12 tahun pengalaman. Khusus dalam pendawaian, panel fius, dan pemasangan AC.",
    tags: ["Pendawaian", "Panel Fius", "AC", "LED"],
    responseTime: "< 1 jam",
    image: electricianImg,
  },
  {
    id: "2",
    name: "Kavitha Rajan",
    unit: "Unit 15-C",
    avatar: "KR",
    avatarColor: "from-purple-500 to-pink-600",
    skill: "Guru Matematik & Sains",
    category: "Pendidikan",
    icon: BookOpen,
    iconColor: "text-purple-600 bg-purple-50",
    rate: 45,
    rateUnit: "jam",
    rating: 4.8,
    reviews: 19,
    jobsDone: 52,
    available: true,
    bio: "Bekas guru sekolah dengan 8 tahun pengalaman. Mengajar SPM, IGCSE, dan peperiksaan universiti.",
    tags: ["SPM", "IGCSE", "Matematik", "Fizik"],
    responseTime: "< 2 jam",
    image: communityImg,
  },
  {
    id: "3",
    name: "Rajan Pillai",
    unit: "Unit 2-F",
    avatar: "RP",
    avatarColor: "from-orange-500 to-red-500",
    skill: "Tukang Paip & Sanitari",
    category: "Paip",
    icon: Droplets,
    iconColor: "text-blue-600 bg-blue-50",
    rate: 60,
    rateUnit: "jam",
    rating: 4.7,
    reviews: 41,
    jobsDone: 78,
    available: false,
    bio: "Pakar paip bersijil dengan pengalaman luas dalam pembaikan kebocoran, pemasangan paip baru, dan sistem sanitari.",
    tags: ["Kebocoran", "Paip Baru", "Tandas", "Sinki"],
    responseTime: "2-4 jam",
    image: electricianImg,
  },
  {
    id: "4",
    name: "Wong Jia Hui",
    unit: "Unit 11-B",
    avatar: "WJ",
    avatarColor: "from-teal-500 to-emerald-600",
    skill: "Developer Web & Aplikasi",
    category: "Teknologi",
    icon: Zap,
    iconColor: "text-teal-600 bg-teal-50",
    rate: 80,
    rateUnit: "jam",
    rating: 5.0,
    reviews: 12,
    jobsDone: 15,
    available: true,
    bio: "Full-stack developer. Boleh bantu bina laman web perniagaan kecil, aplikasi mudah alih, atau selesaikan masalah komputer.",
    tags: ["React", "WordPress", "App", "IT Support"],
    responseTime: "< 30 min",
    image: communityImg,
  },
  {
    id: "5",
    name: "Faizal Iskandar",
    unit: "Unit 6-D",
    avatar: "FI",
    avatarColor: "from-amber-500 to-orange-500",
    skill: "Tukang Kayu & Perabot",
    category: "Pertukangan",
    icon: Hammer,
    iconColor: "text-amber-600 bg-amber-50",
    rate: 55,
    rateUnit: "jam",
    rating: 4.9,
    reviews: 33,
    jobsDone: 67,
    available: true,
    bio: "Pengrajin kayu dengan kemahiran membuat dan membaiki perabot, pintu, tingkap, dan kabinet dapur.",
    tags: ["Perabot", "Pintu", "Kabinet", "Pembaikan"],
    responseTime: "< 3 jam",
    image: electricianImg,
  },
];

const skillRequests = [
  { id: "r1", skill: "Pembaikan AC", postedBy: "Unit 9-C", budget: "RM 80-120", urgency: "urgent", posted: "1 jam lalu", responses: 2 },
  { id: "r2", skill: "Tuisyen BM SPM", postedBy: "Unit 4-A", budget: "RM 40/jam", urgency: "normal", posted: "3 jam lalu", responses: 5 },
  { id: "r3", skill: "Setting Wifi Router", postedBy: "Unit 12-B", budget: "RM 50", urgency: "normal", posted: "Semalam", responses: 3 },
];

export function Community() {
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"providers" | "requests">("providers");
  const [contactedIds, setContactedIds] = useState<Set<string>>(new Set());

  const filtered = residents.filter((r) => {
    const matchCat = selectedCategory === "Semua" || r.category === selectedCategory;
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.skill.toLowerCase().includes(search.toLowerCase()) ||
      r.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchSearch;
  });

  const handleContact = (id: string) => {
    setContactedIds(prev => new Set([...prev, id]));
  };

  return (
    <div className="pb-24 lg:pb-8">
      {/* Community Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-700 via-indigo-700 to-blue-700 px-4 lg:px-6 pt-6 pb-8">
        <div className="absolute inset-0 opacity-10">
          <img src={communityImg} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative">
          <p className="text-purple-200 text-xs font-medium mb-1">👥 Komuniti Penduduk</p>
          <h2 className="text-white font-bold text-xl mb-1">Kongsi Kemahiran, Jimat Bersama</h2>
          <p className="text-purple-200 text-xs">38 pakar dalam kawasan anda · Hubungi terus, tanpa perantara</p>
          <div className="flex gap-3 mt-4">
            {[
              { value: "38", label: "Pakar" },
              { value: "245", label: "Kerja Selesai" },
              { value: "4.8★", label: "Rating Avg" },
            ].map((s, i) => (
              <div key={i} className="bg-white/10 backdrop-blur border border-white/20 rounded-xl px-3 py-2 text-center">
                <p className="text-white font-bold">{s.value}</p>
                <p className="text-purple-200 text-[10px]">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-slate-100 px-4 lg:px-6">
        <div className="flex gap-0">
          {[
            { key: "providers", label: "Penyedia Kemahiran" },
            { key: "requests", label: "Permintaan Bantuan" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? "border-emerald-600 text-emerald-600"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "providers" ? (
        <>
          {/* Search + Filter */}
          <div className="bg-white border-b border-slate-50 px-4 lg:px-6 py-3 space-y-2.5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Cari kemahiran atau nama..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-sm bg-slate-100 rounded-xl border-0 outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {skillCategories.map((cat) => (
                <button
                  key={cat.label}
                  onClick={() => setSelectedCategory(cat.label)}
                  className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    selectedCategory === cat.label
                      ? "bg-purple-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  <span>{cat.icon}</span> {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="px-4 lg:px-6 py-4 space-y-3">
            <AnimatePresence>
              {filtered.map((resident, i) => {
                const contacted = contactedIds.has(resident.id);
                return (
                  <motion.div
                    key={resident.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
                  >
                    <div className="p-4">
                      <div className="flex items-start gap-3 mb-3">
                        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${resident.avatarColor} flex items-center justify-center text-white font-bold shrink-0`}>
                          {resident.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="font-semibold text-slate-800 text-sm">{resident.name}</p>
                              <div className="flex items-center gap-1 text-slate-500 text-xs mt-0.5">
                                <MapPin className="w-3 h-3" /> {resident.unit}
                              </div>
                            </div>
                            <div className={`px-2 py-1 rounded-full text-[10px] font-semibold flex items-center gap-1 ${
                              resident.available
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-slate-100 text-slate-500"
                            }`}>
                              {resident.available
                                ? <><CheckCircle2 className="w-3 h-3" /> Tersedia</>
                                : <><Clock className="w-3 h-3" /> Sibuk</>}
                            </div>
                          </div>
                          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg mt-1.5 ${resident.iconColor}`}>
                            <resident.icon className="w-3 h-3" />
                            <span className="text-xs font-medium">{resident.skill}</span>
                          </div>
                        </div>
                      </div>

                      <p className="text-xs text-slate-500 mb-3">{resident.bio}</p>

                      <div className="flex gap-1.5 flex-wrap mb-3">
                        {resident.tags.map((tag) => (
                          <span key={tag} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{tag}</span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between bg-slate-50 rounded-xl p-2.5 mb-3">
                        <div className="text-center">
                          <p className="text-sm font-bold text-slate-800">RM {resident.rate}</p>
                          <p className="text-[10px] text-slate-400">/{resident.rateUnit}</p>
                        </div>
                        <div className="w-px h-8 bg-slate-200" />
                        <div className="text-center">
                          <div className="flex items-center gap-0.5 justify-center">
                            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                            <span className="text-sm font-bold text-slate-800">{resident.rating}</span>
                          </div>
                          <p className="text-[10px] text-slate-400">{resident.reviews} ulasan</p>
                        </div>
                        <div className="w-px h-8 bg-slate-200" />
                        <div className="text-center">
                          <p className="text-sm font-bold text-slate-800">{resident.jobsDone}</p>
                          <p className="text-[10px] text-slate-400">Kerja selesai</p>
                        </div>
                        <div className="w-px h-8 bg-slate-200" />
                        <div className="text-center">
                          <p className="text-xs font-semibold text-emerald-600">{resident.responseTime}</p>
                          <p className="text-[10px] text-slate-400">Respons</p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleContact(resident.id)}
                        disabled={!resident.available}
                        className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                          contacted
                            ? "bg-purple-50 text-purple-600 border border-purple-200"
                            : !resident.available
                            ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                            : "bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-200"
                        }`}
                      >
                        <MessageCircle className="w-4 h-4" />
                        {contacted ? "Mesej Dihantar ✓" : !resident.available ? "Tidak Tersedia" : "Hubungi Sekarang"}
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {filtered.length === 0 && (
              <div className="text-center py-12 text-slate-400">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">Tiada pakar ditemui dalam kategori ini</p>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="px-4 lg:px-6 py-4 space-y-3">
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm text-slate-500">{skillRequests.length} permintaan aktif</p>
            <button className="flex items-center gap-1.5 bg-emerald-600 text-white text-xs px-3 py-2 rounded-xl font-semibold">
              <Plus className="w-3.5 h-3.5" /> Buat Permintaan
            </button>
          </div>
          {skillRequests.map((req, i) => (
            <motion.div
              key={req.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <p className="font-semibold text-slate-800 text-sm">{req.skill}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {req.postedBy}
                    </span>
                    <span className="text-xs text-slate-400">{req.posted}</span>
                  </div>
                </div>
                {req.urgency === "urgent" && (
                  <span className="text-[10px] bg-red-100 text-red-600 px-2 py-1 rounded-full font-semibold shrink-0">🔴 Segera</span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500">Bajet: <span className="font-semibold text-slate-700">{req.budget}</span></p>
                  <p className="text-xs text-emerald-600 mt-0.5">{req.responses} respons</p>
                </div>
                <button className="flex items-center gap-1.5 bg-purple-600 text-white text-xs px-3 py-2 rounded-xl font-semibold">
                  Tawar Bantuan <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}