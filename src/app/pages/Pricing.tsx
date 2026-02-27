import { useState } from "react";
import { TrendingDown, Users, CheckCircle2, Info, Star, ChevronDown, ChevronUp, Zap } from "lucide-react";
import { motion } from "motion/react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
} from "recharts";

const pricingTiers = [
  { units: "1–50", multiplier: 1.0, label: "Individu" },
  { units: "51–100", multiplier: 0.85, label: "Kecil" },
  { units: "101–150", multiplier: 0.75, label: "Sederhana" },
  { units: "151–200", multiplier: 0.65, label: "Besar" },
  { units: "201–250", multiplier: 0.58, label: "Premium" },
  { units: "251+", multiplier: 0.52, label: "Komuniti" },
];

const services = [
  {
    id: "cleaning",
    name: "Pembersihan",
    emoji: "🧹",
    basePrice: 12,
    category: "Bulanan",
    color: "from-blue-500 to-indigo-600",
    currentUnits: 247,
    features: ["Koridor & Lif", "Kawasan Pool", "Tempat Letak Kereta", "Bilik Sampah"],
  },
  {
    id: "security",
    name: "Keselamatan",
    emoji: "🛡️",
    basePrice: 55,
    category: "Bulanan",
    color: "from-slate-600 to-slate-800",
    currentUnits: 247,
    features: ["24/7 Patrol", "CCTV 48 Kamera", "Emergency Response", "Laporan Harian"],
  },
  {
    id: "landscaping",
    name: "Landskap",
    emoji: "🌿",
    basePrice: 14,
    category: "Bulanan",
    color: "from-emerald-500 to-teal-600",
    currentUnits: 189,
    features: ["Taman Utama", "Kolam & Longkang", "Pokok & Pagar", "Baja Organik"],
  },
  {
    id: "pest",
    name: "Kawalan Perosak",
    emoji: "🐜",
    basePrice: 25,
    category: "Suku Tahun",
    color: "from-orange-500 to-red-500",
    currentUnits: 98,
    features: ["Semburan Anti-lipas", "Umpan Tikus", "Rawatan Anai-anai", "Laporan Bertulis"],
  },
];

function getPrice(basePrice: number, units: number) {
  if (units <= 50) return basePrice;
  if (units <= 100) return basePrice * 0.85;
  if (units <= 150) return basePrice * 0.75;
  if (units <= 200) return basePrice * 0.65;
  if (units <= 250) return basePrice * 0.58;
  return basePrice * 0.52;
}

function getChartData(basePrice: number) {
  return [
    { label: "10 unit", units: 10, price: basePrice },
    { label: "50 unit", units: 50, price: +(basePrice * 1.0).toFixed(2) },
    { label: "100 unit", units: 100, price: +(basePrice * 0.85).toFixed(2) },
    { label: "150 unit", units: 150, price: +(basePrice * 0.75).toFixed(2) },
    { label: "200 unit", units: 200, price: +(basePrice * 0.65).toFixed(2) },
    { label: "247 unit", units: 247, price: +(basePrice * 0.58).toFixed(2), current: true },
    { label: "312 unit", units: 312, price: +(basePrice * 0.52).toFixed(2) },
  ];
}

const faqItems = [
  {
    q: "Bagaimana harga kolektif dikira?",
    a: "Harga dikira berdasarkan jumlah unit yang menyertai. Lebih ramai yang sertai = harga lebih murah untuk semua. Sistem kami mengemas kini harga secara automatik setiap bulan.",
  },
  {
    q: "Bolehkah saya keluar dari perkhidmatan?",
    a: "Ya, anda boleh berhenti pada bila-bila masa dengan notis 30 hari. Jika anda keluar, harga mungkin berubah untuk unit lain bergantung pada jumlah yang tinggal.",
  },
  {
    q: "Siapa yang menguruskan pembayaran?",
    a: "Pembayaran dikumpulkan oleh pejabat pengurusan kawasan. Anda hanya bayar satu bil bulanan yang termasuk semua perkhidmatan yang anda sertai.",
  },
  {
    q: "Bagaimana jika saya tidak berpuas hati dengan servis?",
    a: "Setiap vendor dinilai oleh penduduk selepas setiap lawatan. Jika rating turun di bawah 4.0, vendor akan diganti secara automatik tanpa penalti.",
  },
];

export function Pricing() {
  const [selectedService, setSelectedService] = useState(services[0]);
  const [simulatedUnits, setSimulatedUnits] = useState(247);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const currentPrice = getPrice(selectedService.basePrice, simulatedUnits);
  const savings = selectedService.basePrice - currentPrice;
  const savingsPct = Math.round((savings / selectedService.basePrice) * 100);
  const chartData = getChartData(selectedService.basePrice);

  const currentTier = pricingTiers.find((t) => {
    if (t.units.includes("+")) return simulatedUnits >= 251;
    const [min, max] = t.units.split("–").map(Number);
    return simulatedUnits >= min && simulatedUnits <= max;
  });

  return (
    <div className="pb-24 lg:pb-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 px-4 lg:px-6 pt-6 pb-8">
        <p className="text-slate-400 text-xs mb-1">💰 Harga Telus</p>
        <h2 className="text-white font-bold text-xl mb-1">Harga Pukal Kawasan</h2>
        <p className="text-slate-400 text-sm">Lebih ramai menyertai, lebih murah harganya untuk semua</p>

        <div className="grid grid-cols-3 gap-3 mt-5">
          {[
            { label: "Penjimatan Maks", value: "48%", sub: "vs harga individu", color: "text-emerald-400" },
            { label: "Unit Aktif", value: "247", sub: "daripada 312", color: "text-blue-400" },
            { label: "Penjimatan/bulan", value: "RM 18k", sub: "Kawasan keseluruhan", color: "text-amber-400" },
          ].map((stat, i) => (
            <div key={i} className="bg-white/10 backdrop-blur border border-white/10 rounded-xl p-3 text-center">
              <p className={`text-lg font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-white text-[10px] font-medium">{stat.label}</p>
              <p className="text-slate-400 text-[10px]">{stat.sub}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 lg:px-6 py-5 space-y-5">
        {/* Service Selector */}
        <div>
          <p className="text-sm font-semibold text-slate-700 mb-2.5">Pilih Perkhidmatan</p>
          <div className="grid grid-cols-2 gap-2">
            {services.map((svc) => (
              <button
                key={svc.id}
                onClick={() => setSelectedService(svc)}
                className={`flex items-center gap-2.5 p-3 rounded-xl border transition-all text-left ${
                  selectedService.id === svc.id
                    ? "border-emerald-500 bg-emerald-50 shadow-sm"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <span className="text-xl">{svc.emoji}</span>
                <div>
                  <p className={`text-xs font-semibold ${selectedService.id === svc.id ? "text-emerald-700" : "text-slate-700"}`}>{svc.name}</p>
                  <p className="text-[10px] text-slate-400">{svc.category}</p>
                </div>
                {selectedService.id === svc.id && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 ml-auto" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Pricing Simulator */}
        <motion.div
          key={selectedService.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100"
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">{selectedService.emoji}</span>
            <div>
              <p className="font-semibold text-slate-800">{selectedService.name}</p>
              <p className="text-xs text-slate-500">Harga asas: RM {selectedService.basePrice}/unit/{selectedService.category.toLowerCase()}</p>
            </div>
          </div>

          {/* Simulator Slider */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <Users className="w-3.5 h-3.5" /> Simulasi jumlah unit
              </p>
              <span className="text-sm font-bold text-slate-800">{simulatedUnits} unit</span>
            </div>
            <input
              type="range"
              min={10}
              max={312}
              value={simulatedUnits}
              onChange={(e) => setSimulatedUnits(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-emerald-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>10</span>
              <span className="text-emerald-600 font-semibold">Semasa: {selectedService.currentUnits}</span>
              <span>312</span>
            </div>
          </div>

          {/* Tier Badge */}
          <div className="flex items-center gap-2 mb-4">
            <div className={`flex-1 bg-gradient-to-r ${selectedService.color} rounded-xl p-3 text-white`}>
              <p className="text-[10px] opacity-80 mb-0.5">Peringkat Semasa</p>
              <p className="font-bold">{currentTier?.label || "Komuniti"} · {currentTier?.units} unit</p>
            </div>
            <div className="text-center bg-emerald-50 border border-emerald-200 rounded-xl p-3">
              <p className="text-[10px] text-emerald-700 mb-0.5">Jimat</p>
              <p className="text-xl font-bold text-emerald-600">{savingsPct}%</p>
            </div>
          </div>

          {/* Price Comparison */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="bg-slate-50 rounded-xl p-3 text-center">
              <p className="text-[10px] text-slate-400 mb-1">Harga Individu</p>
              <p className="text-base font-bold text-slate-500 line-through">RM {selectedService.basePrice}</p>
              <p className="text-[10px] text-slate-400">/unit</p>
            </div>
            <div className="bg-emerald-600 rounded-xl p-3 text-center">
              <p className="text-[10px] text-emerald-100 mb-1">Harga Kolektif</p>
              <p className="text-base font-bold text-white">RM {currentPrice.toFixed(2)}</p>
              <p className="text-[10px] text-emerald-200">/unit</p>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-center">
              <p className="text-[10px] text-amber-600 mb-1">Anda Jimat</p>
              <p className="text-base font-bold text-amber-700">RM {savings.toFixed(2)}</p>
              <p className="text-[10px] text-amber-500">/unit/bulan</p>
            </div>
          </div>

          {/* Community Savings */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500 flex items-center justify-center shrink-0">
              <Zap className="w-4.5 h-4.5 text-white" />
            </div>
            <div>
              <p className="text-xs font-semibold text-blue-800">Penjimatan Seluruh Kawasan</p>
              <p className="text-xs text-blue-600">
                {simulatedUnits} unit × RM {savings.toFixed(2)} = <span className="font-bold">RM {(simulatedUnits * savings).toLocaleString("en-MY", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}/bulan</span>
              </p>
            </div>
          </div>
        </motion.div>

        {/* Price Curve Chart */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-semibold text-slate-800 text-sm">Graf Harga Kolektif</p>
              <p className="text-xs text-slate-500">{selectedService.name} · RM/unit</p>
            </div>
            <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 rounded-xl px-2.5 py-1">
              <TrendingDown className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-xs font-semibold text-emerald-700">Turun {savingsPct}%</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="label" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `RM${v}`} />
              <Tooltip
                contentStyle={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, fontSize: 11 }}
                formatter={(v: number) => [`RM ${v}`, "Harga/unit"]}
              />
              <Bar dataKey="price" fill="#059669" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, index) => (
                  <rect key={index} fill={entry.current ? "#f59e0b" : "#059669"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <p className="text-[10px] text-slate-400 text-center mt-1">🟡 Tahap semasa kawasan anda</p>
        </div>

        {/* Pricing Tiers Table */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
          <p className="font-semibold text-slate-800 text-sm mb-3">Jadual Harga {selectedService.name}</p>
          <div className="overflow-hidden rounded-xl border border-slate-100">
            {pricingTiers.map((tier, i) => {
              const price = getPrice(selectedService.basePrice, i === 0 ? 10 : i === 1 ? 75 : i === 2 ? 125 : i === 3 ? 175 : i === 4 ? 225 : 260);
              const isActive = currentTier?.label === tier.label;
              return (
                <div key={i} className={`flex items-center justify-between px-4 py-2.5 border-b border-slate-50 last:border-0 ${isActive ? "bg-emerald-50" : "hover:bg-slate-50"}`}>
                  <div className="flex items-center gap-2.5">
                    {isActive ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-200" />
                    )}
                    <div>
                      <p className={`text-xs font-semibold ${isActive ? "text-emerald-700" : "text-slate-700"}`}>{tier.label}</p>
                      <p className="text-[10px] text-slate-400">{tier.units} unit</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
                      -{Math.round((1 - tier.multiplier) * 100)}%
                    </span>
                    <p className={`text-sm font-bold ${isActive ? "text-emerald-600" : "text-slate-700"}`}>
                      RM {price.toFixed(2)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* What's Included */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
          <p className="font-semibold text-slate-800 text-sm mb-3">Termasuk dalam Pakej {selectedService.name}</p>
          <div className="grid grid-cols-2 gap-2">
            {selectedService.features.map((feature, i) => (
              <div key={i} className="flex items-center gap-2 bg-slate-50 rounded-xl p-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="text-xs text-slate-600">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-4 border-b border-slate-50">
            <p className="font-semibold text-slate-800 text-sm flex items-center gap-2">
              <Info className="w-4 h-4 text-blue-500" /> Soalan Lazim
            </p>
          </div>
          {faqItems.map((faq, i) => (
            <div key={i} className="border-b border-slate-50 last:border-0">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-slate-50 transition-colors"
              >
                <p className="text-sm font-medium text-slate-700 pr-4">{faq.q}</p>
                {openFaq === i
                  ? <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                  : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
              </button>
              {openFaq === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  className="px-4 pb-3"
                >
                  <p className="text-xs text-slate-500 leading-relaxed">{faq.a}</p>
                </motion.div>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-5 text-white">
          <p className="font-bold text-base mb-1">Jemput Jiran Anda!</p>
          <p className="text-emerald-100 text-sm mb-4">Setiap unit baru yang sertai mengurangkan harga untuk semua. Kongsi pautan dan jimat lebih banyak!</p>
          <div className="flex gap-2">
            <div className="flex-1 bg-white/10 backdrop-blur border border-white/20 rounded-xl px-3 py-2 text-sm font-mono text-white/80">
              residensikita.my/invite/tbp247
            </div>
            <button className="bg-white text-emerald-700 px-4 py-2 rounded-xl text-sm font-bold">
              Salin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
