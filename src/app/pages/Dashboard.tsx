import { useState } from "react";
import { Link } from "react-router";
import {
  TrendingUp,
  Star,
  Users,
  Wrench,
  Camera,
  ChevronRight,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Zap,
  Shield,
  Leaf,
  Sparkles,
} from "lucide-react";
import { motion } from "motion/react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";


const savingsData = [
  { month: "Okt", savings: 8200, units: 180 },
  { month: "Nov", savings: 11400, units: 205 },
  { month: "Dis", savings: 13800, units: 220 },
  { month: "Jan", savings: 15200, units: 232 },
  { month: "Feb", savings: 16900, units: 240 },
  { month: "Mar", savings: 18400, units: 247 },
];

const recentIssues = [
  { id: 1, type: "Retakan Dinding", location: "Tingkat 3 Koridor", severity: "low", status: "resolved", aiMatch: "Faizal Rahman - Jurutukang", time: "2 jam lalu" },
  { id: 2, type: "Kebocoran Paip", location: "Blok B, Unit 7-C", severity: "medium", status: "in-progress", aiMatch: "Kumar Plumbing Works", time: "5 jam lalu" },
  { id: 3, type: "Masalah Elektrik", location: "Parking B2", severity: "high", status: "pending", aiMatch: "Aziz Electric Sdn Bhd", time: "Semalam" },
];

const quickActions = [
  { icon: Wrench, label: "Hire Service", labelMs: "Sewa Servis", to: "/services", color: "from-blue-500 to-indigo-600" },
  { icon: Users, label: "Community", labelMs: "Komuniti", to: "/community", color: "from-purple-500 to-pink-600" },
  { icon: Camera, label: "AI Diagnose", labelMs: "Diagnosis AI", to: "/diagnose", color: "from-emerald-500 to-teal-600" },
  { icon: TrendingUp, label: "Bulk Pricing", labelMs: "Harga Pukal", to: "/pricing", color: "from-amber-500 to-orange-600" },
];

const apartmentImg = "https://images.unsplash.com/photo-1758787401674-fd72265bfe56?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjBjb21wbGV4JTIwTWFsYXlzaWF8ZW58MXx8fHwxNzcyMjA3Mzk3fDA&ixlib=rb-4.1.0&q=80&w=1080";

const activeServices = [
  { name: "KleenMaster Sdn Bhd", type: "Cleaning", icon: "🧹", rating: 4.8, nextVisit: "Sabtu, 8 pagi", units: 247, price: "RM 12/unit" },
  { name: "SecureGuard Pro", type: "Security", icon: "🛡️", rating: 4.9, nextVisit: "Berterusan 24/7", units: 247, price: "RM 38/unit" },
  { name: "GreenScape MY", type: "Landscaping", icon: "🌿", rating: 4.7, nextVisit: "Rabu, 7 pagi", units: 189, price: "RM 8/unit" },
];

const severityConfig = {
  low: { label: "Rendah", color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
  medium: { label: "Sederhana", color: "text-amber-600 bg-amber-50 border-amber-200" },
  high: { label: "Tinggi", color: "text-red-600 bg-red-50 border-red-200" },
};

const statusConfig = {
  resolved: { label: "Selesai", icon: CheckCircle2, color: "text-emerald-600" },
  "in-progress": { label: "Dalam Proses", icon: Clock, color: "text-amber-600" },
  pending: { label: "Menunggu", icon: AlertTriangle, color: "text-red-500" },
};

export function Dashboard() {
  const [activeTab, setActiveTab] = useState<"issues" | "services">("issues");

  return (
    <div className="pb-20 lg:pb-6">
      {/* Hero Banner */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={apartmentImg} alt="Building" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/60 to-slate-50" />
        </div>
        <div className="relative px-4 lg:px-6 pt-6 pb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-emerald-300 text-sm font-medium mb-1">Selamat Datang Kembali 👋</p>
            <h2 className="text-white text-2xl font-bold mb-1">Taman Bayu Perdana</h2>
            <p className="text-slate-300 text-sm">Petaling Jaya, Selangor · Blok A–F</p>
            <div className="flex items-center gap-3 mt-4">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-2.5">
                <p className="text-white/70 text-xs">Penjimatan Bulanan</p>
                <p className="text-white font-bold text-lg">RM 18,400</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-2.5">
                <p className="text-white/70 text-xs">Unit Menyertai</p>
                <p className="text-white font-bold text-lg">247 / 312</p>
              </div>
              <div className="bg-emerald-500/80 backdrop-blur-sm border border-emerald-400/30 rounded-xl px-4 py-2.5">
                <p className="text-emerald-100 text-xs">Skor Kawasan</p>
                <p className="text-white font-bold text-lg flex items-center gap-1"><Star className="w-4 h-4 text-amber-300" /> 4.8</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="px-4 lg:px-6 -mt-6 space-y-5">
        {/* Quick Actions */}
        <div className="relative z-10 grid grid-cols-4 gap-2.5">
          {quickActions.map((action, i) => (
            <motion.div
              key={action.to}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="relative z-20"
            >
              <Link to={action.to} className="flex flex-col items-center gap-2 bg-white rounded-2xl p-3 shadow-sm border border-slate-100 hover:shadow-md transition-all active:scale-95">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center shadow-sm`}>
                  <action.icon className="w-5 h-5 text-white" />
                </div>
                <div className="text-center">
                  <p className="text-xs font-semibold text-slate-700 leading-tight">{action.label}</p>
                  <p className="text-[10px] text-slate-400">{action.labelMs}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Shield, label: "Servis Aktif", value: "6", sub: "3 kategori", color: "text-blue-600 bg-blue-50" },
            { icon: Zap, label: "Isu Selesai", value: "24", sub: "Bulan ini", color: "text-emerald-600 bg-emerald-50" },
            { icon: Leaf, label: "Pakar Komuniti", value: "38", sub: "Penduduk", color: "text-purple-600 bg-purple-50" },
          ].map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 + i * 0.07 }}
              className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
              <div className={`w-9 h-9 rounded-xl ${stat.color} flex items-center justify-center mb-2`}>
                <stat.icon className="w-4.5 h-4.5" />
              </div>
              <p className="text-xl font-bold text-slate-800">{stat.value}</p>
              <p className="text-xs font-medium text-slate-600">{stat.label}</p>
              <p className="text-[10px] text-slate-400">{stat.sub}</p>
            </motion.div>
          ))}
        </div>

        {/* AI Diagnose Promo Card */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Link to="/diagnose">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-4 shadow-lg overflow-hidden relative">
              <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full" />
              <div className="absolute -right-2 bottom-0 w-20 h-20 bg-white/5 rounded-full" />
              <div className="relative flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
                  <Camera className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span className="text-emerald-100 text-xs font-semibold uppercase tracking-wide">Dikuasakan AI</span>
                  </div>
                  <p className="text-white font-bold text-base leading-tight">Snap & Diagnose</p>
                  <p className="text-emerald-100 text-xs mt-0.5">Ambil foto isu bangunan, AI akan mengenal pasti masalah & mencari pakar</p>
                </div>
                <ArrowUpRight className="w-5 h-5 text-white/60 shrink-0" />
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Savings Chart */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
          className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-slate-800 text-sm">Penjimatan Kumulatif</h3>
              <p className="text-xs text-slate-500">Perbandingan dengan harga individu</p>
            </div>
            <span className="flex items-center gap-1 text-emerald-600 text-xs font-semibold bg-emerald-50 px-2.5 py-1 rounded-full">
              <TrendingUp className="w-3 h-3" /> +8.8%
            </span>
          </div>
          <ResponsiveContainer width="100%" height={140}>
            <AreaChart data={savingsData}>
              <defs>
                <linearGradient id="savingsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#059669" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `RM${(v/1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, fontSize: 12 }}
                formatter={(v: number) => [`RM ${v.toLocaleString()}`, "Penjimatan"]}
              />
              <Area type="monotone" dataKey="savings" stroke="#059669" strokeWidth={2.5} fill="url(#savingsGrad)" dot={{ r: 4, fill: "#059669" }} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Tabs: Recent Issues / Active Services */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="flex border-b border-slate-100">
            {[
              { key: "issues", label: "Isu Terkini" },
              { key: "services", label: "Servis Aktif" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as typeof activeTab)}
                className={`flex-1 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? "text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50/50"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="divide-y divide-slate-50">
            {activeTab === "issues"
              ? recentIssues.map((issue) => {
                  const sev = severityConfig[issue.severity as keyof typeof severityConfig];
                  const stat = statusConfig[issue.status as keyof typeof statusConfig];
                  const StatusIcon = stat.icon;
                  return (
                    <div key={issue.id} className="p-4 hover:bg-slate-50 cursor-pointer transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center text-lg shrink-0">
                          {issue.type.includes("Elektrik") ? "⚡" : issue.type.includes("Paip") ? "💧" : "🏗️"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-sm font-semibold text-slate-800">{issue.type}</p>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${sev.color}`}>{sev.label}</span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">{issue.location}</p>
                          <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> AI: {issue.aiMatch}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <div className={`flex items-center gap-1 justify-end ${stat.color}`}>
                            <StatusIcon className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-medium">{stat.label}</span>
                          </div>
                          <p className="text-[10px] text-slate-400 mt-1">{issue.time}</p>
                        </div>
                      </div>
                    </div>
                  );
                })
              : activeServices.map((svc, i) => (
                  <div key={i} className="p-4 hover:bg-slate-50 cursor-pointer transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-xl shrink-0">
                        {svc.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-800">{svc.name}</p>
                        <p className="text-xs text-slate-500">{svc.type} · {svc.units} unit</p>
                        <p className="text-xs text-slate-400">Lawatan: {svc.nextVisit}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold text-slate-800">{svc.price}</p>
                        <div className="flex items-center gap-1 justify-end mt-1">
                          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                          <span className="text-xs text-slate-600">{svc.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
          </div>
          <div className="p-3 border-t border-slate-50">
            <Link
              to={activeTab === "issues" ? "/diagnose" : "/services"}
              className="flex items-center justify-center gap-2 text-sm text-emerald-600 font-medium hover:text-emerald-700"
            >
              Lihat semua <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
