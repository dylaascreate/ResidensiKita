import { useState } from "react";
import { Outlet, NavLink, useLocation } from "react-router";
import {
  Home,
  Wrench,
  Users,
  Camera,
  BarChart3,
  Menu,
  X,
  Bell,
  ChevronRight,
  Building2,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const navItems = [
  { path: "/", label: "Dashboard", icon: Home, labelMs: "Utama" },
  { path: "/services", label: "Services", icon: Wrench, labelMs: "Perkhidmatan" },
  { path: "/community", label: "Community", icon: Users, labelMs: "Komuniti" },
  { path: "/diagnose", label: "AI Diagnose", icon: Camera, labelMs: "Diagnosis AI", badge: "AI" },
  { path: "/pricing", label: "Bulk Pricing", icon: BarChart3, labelMs: "Harga Pukal" },
];

export function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const location = useLocation();

  const currentPage = navItems.find((n) =>
    n.path === "/" ? location.pathname === "/" : location.pathname.startsWith(n.path)
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200 fixed h-full z-30">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-slate-900 font-bold text-lg tracking-tight">Residensi<span className="text-emerald-600">Kita</span></span>
              <p className="text-slate-400 text-xs">Kawasan Cemerlang</p>
            </div>
          </div>
        </div>

        {/* Resident Badge */}
        <div className="mx-4 mt-4 mb-2 bg-emerald-50 rounded-xl px-4 py-3 border border-emerald-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-sm font-bold">
              AH
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800 truncate">Ahmad Hafiz</p>
              <p className="text-xs text-slate-500">Unit 12-C · Blok Melati</p>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xs font-bold text-emerald-600">4.9★</span>
              <span className="text-[10px] text-slate-400">rating</span>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-2 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group ${
                  isActive
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-200"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className={`w-4.5 h-4.5 shrink-0 ${isActive ? "text-white" : "text-slate-500 group-hover:text-slate-700"}`} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${isActive ? "text-white" : ""}`}>{item.label}</p>
                    <p className={`text-xs ${isActive ? "text-emerald-100" : "text-slate-400"}`}>{item.labelMs}</p>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${isActive ? "bg-white/20 text-white" : "bg-emerald-100 text-emerald-700"}`}>
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-white/60" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Stats Footer */}
        <div className="p-4 border-t border-slate-100">
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-3 border border-emerald-100">
            <p className="text-xs font-semibold text-emerald-800 mb-2 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Kawasan Stats
            </p>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-lg font-bold text-slate-800">247</p>
                <p className="text-[10px] text-slate-500">Unit Aktif</p>
              </div>
              <div>
                <p className="text-lg font-bold text-emerald-600">RM 18k</p>
                <p className="text-[10px] text-slate-500">Jimat/bulan</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
          <div className="flex items-center justify-between px-4 lg:px-6 py-3">
            <div className="flex items-center gap-3">
              <button
                className="lg:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-600"
                onClick={() => setMobileOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="lg:hidden flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-slate-900">Residensi<span className="text-emerald-600">Kita</span></span>
              </div>
              <div className="hidden lg:block">
                <h1 className="text-base font-semibold text-slate-800">{currentPage?.label || "Dashboard"}</h1>
                <p className="text-xs text-slate-400">Taman Bayu Perdana, Petaling Jaya</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <button
                  onClick={() => setNotifOpen(!notifOpen)}
                  className="p-2 rounded-xl hover:bg-slate-100 text-slate-600 relative"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white" />
                </button>
                <AnimatePresence>
                  {notifOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50"
                    >
                      <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                        <p className="font-semibold text-slate-800">Notifikasi</p>
                        <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">3 baru</span>
                      </div>
                      {[
                        { icon: "🔧", title: "Cleaning crew confirmed", sub: "Minggu depan, Sabtu 8 pagi", time: "2 jam lalu" },
                        { icon: "💡", title: "Aziz menawarkan servis elektrik", sub: "Unit 8-A · RM 50/jam", time: "4 jam lalu" },
                        { icon: "🏢", title: "Laporan retakan dinding baru", sub: "AI telah menganalisis — Kecil", time: "Semalam" },
                      ].map((n, i) => (
                        <div key={i} className="px-4 py-3 border-b border-slate-50 hover:bg-slate-50 cursor-pointer flex gap-3">
                          <span className="text-xl">{n.icon}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-800">{n.title}</p>
                            <p className="text-xs text-slate-500 truncate">{n.sub}</p>
                          </div>
                          <p className="text-xs text-slate-400 shrink-0">{n.time}</p>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-xs font-bold cursor-pointer">
                AH
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1">
          <Outlet />
        </main>

        {/* Bottom Nav - Mobile */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-20">
          <div className="grid grid-cols-5 h-16">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center gap-1 relative ${
                    isActive ? "text-emerald-600" : "text-slate-400"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.div
                        layoutId="bottomNavIndicator"
                        className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-emerald-600 rounded-full"
                      />
                    )}
                    <item.icon className="w-5 h-5" />
                    <span className="text-[10px] font-medium">{item.label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </nav>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/40 z-40"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-72 bg-white z-50 flex flex-col"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                    <Building2 className="w-4.5 h-4.5 text-white" />
                  </div>
                  <span className="font-bold text-lg text-slate-900">Residensi<span className="text-emerald-600">Kita</span></span>
                </div>
                <button onClick={() => setMobileOpen(false)} className="p-2 rounded-lg hover:bg-slate-100">
                  <X className="w-4.5 h-4.5 text-slate-500" />
                </button>
              </div>
              <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === "/"}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                        isActive
                          ? "bg-emerald-600 text-white"
                          : "text-slate-600 hover:bg-slate-100"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <item.icon className={`w-5 h-5 ${isActive ? "text-white" : "text-slate-500"}`} />
                        <div>
                          <p className="text-sm font-medium">{item.label}</p>
                          <p className={`text-xs ${isActive ? "text-emerald-100" : "text-slate-400"}`}>{item.labelMs}</p>
                        </div>
                        {item.badge && (
                          <span className={`ml-auto text-[10px] px-1.5 py-0.5 rounded-full font-bold ${isActive ? "bg-white/20 text-white" : "bg-emerald-100 text-emerald-700"}`}>
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                ))}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
