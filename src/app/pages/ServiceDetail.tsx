import { useState } from "react";
import { useParams, Link } from "react-router";
import { ArrowLeft, Star, Users, CheckCircle2, Calendar, Phone, Shield, TrendingDown } from "lucide-react";
import { motion } from "motion/react";

const cleaningImg = "https://images.unsplash.com/photo-1579141132886-e86d831034ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGVhbmluZyUyMHNlcnZpY2UlMjBwcm9mZXNzaW9uYWwlMjB0ZWFtfGVufDF8fHx8MTc3MjExMzU2NHww&ixlib=rb-4.1.0&q=80&w=1080";

const reviews = [
  { name: "Siti Rahimah", unit: "Unit 3-A", rating: 5, comment: "Sangat profesional dan bersih! Pasukan mereka datang tepat waktu.", time: "2 hari lalu" },
  { name: "David Lim", unit: "Unit 7-F", rating: 4, comment: "Kerja yang bagus. Kadang-kadang lewat sikit tapi kualiti terjamin.", time: "1 minggu lalu" },
  { name: "Priya Nair", unit: "Unit 15-B", rating: 5, comment: "Harga kolektif sangat berbaloi. Jimat banyak berbanding sebelum ini.", time: "2 minggu lalu" },
];

export function ServiceDetail() {
  const { id } = useParams();
  const [joined, setJoined] = useState(false);

  return (
    <div className="pb-24 lg:pb-8">
      <div className="relative">
        <img src={cleaningImg} alt="Service" className="w-full h-52 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20" />
        <div className="absolute top-4 left-4">
          <Link to="/services" className="flex items-center gap-1.5 text-white text-sm bg-white/20 backdrop-blur px-3 py-1.5 rounded-full">
            <ArrowLeft className="w-4 h-4" /> Kembali
          </Link>
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <p className="text-white/80 text-xs mb-1">🧹 Kebersihan · Disahkan</p>
          <p className="text-white font-bold text-xl">KleenMaster Sdn Bhd</p>
          <div className="flex items-center gap-3 mt-1.5">
            <div className="flex items-center gap-1">
              {[1,2,3,4,5].map(s => <Star key={s} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />)}
              <span className="text-white text-xs ml-1">4.8 (142 ulasan)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 lg:px-6 py-5 space-y-4">
        {/* Price Card */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-4 text-white">
          <p className="text-emerald-100 text-xs mb-1 flex items-center gap-1">
            <TrendingDown className="w-3.5 h-3.5" /> Harga Kolektif Aktif
          </p>
          <div className="flex items-end gap-3">
            <div>
              <p className="text-3xl font-bold">RM 8.50</p>
              <p className="text-emerald-100 text-xs">per unit / bulan</p>
            </div>
            <div className="mb-1">
              <p className="text-emerald-200 text-sm line-through">RM 12.00</p>
              <p className="text-amber-300 text-xs font-semibold">Jimat 29%</p>
            </div>
          </div>
          <div className="mt-3 bg-white/10 rounded-xl p-3">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5 text-xs">
                <Users className="w-3.5 h-3.5" /> 247 / 312 unit menyertai
              </div>
              <span className="text-xs font-bold">79%</span>
            </div>
            <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white rounded-full" style={{ width: "79%" }} />
            </div>
            <p className="text-xs text-emerald-100 mt-1.5">65 unit lagi untuk jimat tambahan RM 1.50!</p>
          </div>
        </motion.div>

        {/* Details */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 space-y-3">
          <h3 className="font-semibold text-slate-800 text-sm">Butiran Perkhidmatan</h3>
          {[
            { icon: CheckCircle2, label: "Skop", value: "Koridor, lif, parking, bilik sampah, kawasan pool" },
            { icon: Calendar, label: "Jadual", value: "Setiap Sabtu & Rabu, 8:00 – 12:00 pagi" },
            { icon: Users, label: "Pasukan", value: "6 pekerja bertauliah + 1 penyelia" },
            { icon: Shield, label: "Insurans", value: "Dilindungi sepenuhnya, sijil verified" },
            { icon: Phone, label: "Hotline", value: "+60 12-345 6789 (24 jam)" },
          ].map((item, i) => (
            <div key={i} className="flex gap-3">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                <item.icon className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-slate-400">{item.label}</p>
                <p className="text-sm text-slate-700">{item.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Reviews */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
          <h3 className="font-semibold text-slate-800 text-sm mb-3">Ulasan Penduduk</h3>
          <div className="space-y-3">
            {reviews.map((r, i) => (
              <div key={i} className="pb-3 border-b border-slate-50 last:border-0 last:pb-0">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-xs font-bold">
                      {r.name[0]}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-700">{r.name}</p>
                      <p className="text-[10px] text-slate-400">{r.unit}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: r.rating }).map((_, si) => (
                      <Star key={si} className="w-3 h-3 text-amber-400 fill-amber-400" />
                    ))}
                    <span className="text-[10px] text-slate-400 ml-1">{r.time}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 pl-9">{r.comment}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={() => setJoined(!joined)}
          className={`w-full py-3.5 rounded-2xl font-semibold text-sm transition-all ${
            joined
              ? "bg-slate-200 text-slate-600"
              : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200"
          }`}
        >
          {joined ? "✓ Telah Menyertai Kolektif" : "Sertai Kolektif Sekarang — RM 8.50/bulan"}
        </button>
      </div>
    </div>
  );
}