import { useState } from "react";
import { Link } from "react-router";
import {
  Star,
  Users,
  Clock,
  CheckCircle2,
  Filter,
  Search,
  Wrench,
  TrendingDown,
  ArrowUpRight,
  ThumbsUp,
  Shield,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const cleaningImg = "https://images.unsplash.com/photo-1579141132886-e86d831034ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGVhbmluZyUyMHNlcnZpY2UlMjBwcm9mZXNzaW9uYWwlMjB0ZWFtfGVufDF8fHx8MTc3MjExMzU2NHww&ixlib=rb-4.1.0&q=80&w=1080";
const securityImg = "https://images.unsplash.com/photo-1652148555073-4b1d2ecd664c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWN1cml0eSUyMGd1YXJkJTIwYnVpbGRpbmclMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzcyMjA3NDAyfDA&ixlib=rb-4.1.0&q=80&w=1080";
const landscapingImg = "https://images.unsplash.com/photo-1750762286053-28632f48e717?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYW5kc2NhcGluZyUyMGdhcmRlbiUyMHRyb3BpY2FsfGVufDF8fHx8MTc3MjIwNzQwMXww&ixlib=rb-4.1.0&q=80&w=1080";

const categories = ["Semua", "Keselamatan", "Kebersihan", "Landskap", "Elektrik", "Paip", "Kawalan Perosak"];

const services = [
  {
    id: "1",
    name: "KleenMaster Sdn Bhd",
    category: "Kebersihan",
    emoji: "🧹",
    image: cleaningImg,
    rating: 4.8,
    reviews: 142,
    unitPrice: 12,
    bulkPrice: 8.5,
    savings: 29,
    unitsJoined: 247,
    totalUnits: 312,
    description: "Perkhidmatan pembersihan profesional untuk kawasan umum, koridor, lif, dan kemudahan bersama.",
    nextAvailable: "Sabtu, 8:00 pagi",
    verifiedVendor: true,
    tags: ["Kawasan Umum", "Lif", "Parking"],
    hired: true,
  },
  {
    id: "2",
    name: "SecureGuard Pro MY",
    category: "Keselamatan",
    emoji: "🛡️",
    image: securityImg,
    rating: 4.9,
    reviews: 89,
    unitPrice: 55,
    bulkPrice: 38,
    savings: 31,
    unitsJoined: 247,
    totalUnits: 312,
    description: "Pengawal keselamatan bertauliah 24/7 dengan sistem CCTV bersepadu dan patrol berkala.",
    nextAvailable: "Berterusan",
    verifiedVendor: true,
    tags: ["24/7 Patrol", "CCTV", "Emergency Response"],
    hired: true,
  },
  {
    id: "3",
    name: "GreenScape MY",
    category: "Landskap",
    emoji: "🌿",
    image: landscapingImg,
    rating: 4.7,
    reviews: 63,
    unitPrice: 14,
    bulkPrice: 8,
    savings: 43,
    unitsJoined: 189,
    totalUnits: 312,
    description: "Penyelenggaraan taman, pokok, dan kawasan hijau dengan peralatan moden dan baja organik.",
    nextAvailable: "Rabu, 7:00 pagi",
    verifiedVendor: true,
    tags: ["Taman", "Pokok", "Kolam"],
    hired: true,
  },
  {
    id: "4",
    name: "PestBusters KL",
    category: "Kawalan Perosak",
    emoji: "🐜",
    image: cleaningImg,
    rating: 4.6,
    reviews: 41,
    unitPrice: 25,
    bulkPrice: 15,
    savings: 40,
    unitsJoined: 98,
    totalUnits: 312,
    description: "Rawatan kawalan perosak mesra alam untuk kawasan perumahan dan tandas awam.",
    nextAvailable: "Jumaat, 9:00 pagi",
    verifiedVendor: false,
    tags: ["Tikus", "Lipas", "Anai-anai"],
    hired: false,
  },
  {
    id: "5",
    name: "Voltz Electrical Services",
    category: "Elektrik",
    emoji: "⚡",
    image: securityImg,
    rating: 4.8,
    reviews: 55,
    unitPrice: 30,
    bulkPrice: 20,
    savings: 33,
    unitsJoined: 134,
    totalUnits: 312,
    description: "Penyelenggaraan sistem elektrik, penggantian lampu, dan pemeriksaan panel kawalan.",
    nextAvailable: "Isnin, 10:00 pagi",
    verifiedVendor: true,
    tags: ["Lampu", "Panel", "Wiring"],
    hired: false,
  },
];

export function Services() {
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [search, setSearch] = useState("");
  const [votedServices, setVotedServices] = useState<Set<string>>(new Set(["1", "2", "3"]));

  const filtered = services.filter((s) => {
    const matchCat = selectedCategory === "Semua" || s.category === selectedCategory;
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const toggleVote = (id: string) => {
    setVotedServices((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="pb-24 lg:pb-8">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 px-4 lg:px-6 py-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-bold text-slate-900 text-lg">Marketplace Servis</h2>
            <p className="text-slate-500 text-sm">Sewaan kolektif untuk penjimatan maksimum</p>
          </div>
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-1.5">
            <TrendingDown className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-emerald-700 text-xs font-semibold">Jimat 29–43%</span>
          </div>
        </div>
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari servis..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm bg-slate-100 rounded-xl border-0 outline-none focus:ring-2 focus:ring-emerald-500 text-slate-700 placeholder:text-slate-400"
          />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-white rounded-lg shadow-sm border border-slate-200">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
          </button>
        </div>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Collective Hiring Info */}
      <div className="px-4 lg:px-6 py-4">
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-3 flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div>
            <p className="text-sm font-semibold text-amber-800">Bagaimana Sewaan Kolektif Berfungsi?</p>
            <p className="text-xs text-amber-700 mt-0.5">Lebih banyak unit yang menyertai = harga lebih rendah untuk semua. Undi untuk servis yang anda mahu, dan harga turun secara automatik!</p>
          </div>
        </div>
      </div>

      <div className="px-4 lg:px-6 space-y-4">
        <AnimatePresence>
          {filtered.map((service, i) => {
            const participationPct = Math.round((service.unitsJoined / service.totalUnits) * 100);
            const voted = votedServices.has(service.id);
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ delay: i * 0.07 }}
                className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
              >
                {/* Image */}
                <div className="relative h-36 overflow-hidden">
                  <img src={service.image} alt={service.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="bg-white/90 backdrop-blur text-slate-700 text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
                      <span>{service.emoji}</span> {service.category}
                    </span>
                    {service.verifiedVendor && (
                      <span className="bg-emerald-500 text-white text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
                        <Shield className="w-3 h-3" /> Disahkan
                      </span>
                    )}
                  </div>
                  {service.hired && (
                    <div className="absolute top-3 right-3 bg-emerald-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Aktif
                    </div>
                  )}
                  <div className="absolute bottom-3 left-3 right-3">
                    <p className="text-white font-bold text-base">{service.name}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span className="text-white text-xs font-semibold">{service.rating}</span>
                        <span className="text-white/70 text-xs">({service.reviews})</span>
                      </div>
                      <div className="flex items-center gap-1 text-white/80 text-xs">
                        <Clock className="w-3 h-3" /> {service.nextAvailable}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  <p className="text-xs text-slate-500 mb-3">{service.description}</p>

                  {/* Tags */}
                  <div className="flex gap-1.5 flex-wrap mb-3">
                    {service.tags.map((tag) => (
                      <span key={tag} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{tag}</span>
                    ))}
                  </div>

                  {/* Participation Bar */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5 text-xs text-slate-600">
                        <Users className="w-3.5 h-3.5 text-emerald-600" />
                        <span><span className="font-bold text-slate-800">{service.unitsJoined}</span> / {service.totalUnits} unit menyertai</span>
                      </div>
                      <span className="text-xs font-semibold text-emerald-600">{participationPct}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${participationPct}%` }}
                        transition={{ duration: 1, delay: 0.3 }}
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                      />
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="flex items-center justify-between bg-slate-50 rounded-xl p-3 mb-3">
                    <div>
                      <p className="text-[10px] text-slate-400">Harga Individu</p>
                      <p className="text-sm font-medium text-slate-500 line-through">RM {service.unitPrice}/unit</p>
                    </div>
                    <div className="text-center">
                      <div className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full">JIMAT {service.savings}%</div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-slate-400">Harga Kolektif</p>
                      <p className="text-base font-bold text-emerald-600">RM {service.bulkPrice}/unit</p>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleVote(service.id)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all border ${
                        voted
                          ? "bg-blue-50 text-blue-600 border-blue-200"
                          : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
                      }`}
                    >
                      <ThumbsUp className={`w-3.5 h-3.5 ${voted ? "fill-blue-500" : ""}`} />
                      {voted ? "Diundi" : "Undi"} ({service.unitsJoined + (voted ? 1 : 0)})
                    </button>
                    <Link to={`/services/${service.id}`} className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-xl text-xs font-semibold transition-all">
                      {service.hired ? "Urus Langganan" : "Sertai Kolektif"}
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            <Wrench className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">Tiada servis ditemui</p>
          </div>
        )}
      </div>
    </div>
  );
}