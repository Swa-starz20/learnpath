import { Outlet, useLocation } from "react-router-dom";

const navLinks = [
  { href: "/", label: "Dashboard", icon: "⊞" },
  { href: "/roadmap", label: "Roadmap", icon: "◈" },
  { href: "/mentor", label: "AI Mentor", icon: "◉" },
  { href: "/assessments", label: "Assessments", icon: "◧" },
  { href: "#", label: "Courses", icon: "◨" },
  { href: "#", label: "Placements", icon: "◫" },
];

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/mentor": "AI Mentor",
  "/roadmap": "Adaptive Roadmap",
  "/assessments": "Assessments",
  "/assessments/personality": "Personality Profiling",
  "/assessments/aptitude": "Aptitude Analysis",
  "/assessments/behavioral": "Behavioral Analysis",
  "/assessments/results": "Assessment Results",
};

const DashboardLayout = () => {
  const location = useLocation();
  const isMentor = location.pathname === "/mentor";
  const pageTitle = pageTitles[location.pathname] ?? "LearnPath AI";

  const isActive = (href: string) =>
    href === "/"
      ? location.pathname === "/"
      : href !== "#" && location.pathname.startsWith(href);

  return (
    <div className="min-h-screen bg-[#0b1326] text-white">
      <div className="flex">
        {/* ── Sidebar ──────────────────────────────────────────── */}
        <aside className="w-64 min-h-screen border-r border-white/[0.07] bg-[rgba(255,255,255,0.02)] backdrop-blur-xl flex-shrink-0 sticky top-0 h-screen flex flex-col">
          {/* Logo */}
          <div className="p-6 pb-4">
            <h1 className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-2xl font-bold text-transparent font-['Hanken_Grotesk',_sans-serif]">
              LearnPath AI
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_6px_rgba(76,215,246,0.7)]" />
              <p className="text-[10px] font-mono tracking-widest text-cyan-400/70 uppercase">
                AI Pulse: Active
              </p>
            </div>
          </div>

          {/* Nav */}
          <nav className="px-3 flex-1 space-y-0.5">
          {navLinks.map((item) => {
  const active = isActive(item.href);

  return (
    <div key={item.label}>
      <a
        href={item.href}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-200 ${
          active
            ? "bg-violet-500/[0.15] border border-violet-500/25 text-violet-300 font-semibold shadow-[0_0_12px_rgba(192,193,255,0.06)]"
            : item.label === "Placements"
            ? "text-white/20 hover:bg-white/[0.03] hover:text-white/35 border border-transparent"
            : "text-white/40 hover:bg-white/[0.04] hover:text-white/70 border border-transparent"
        }`}
      >
        <span className="text-base leading-none">
          {item.icon}
        </span>

        <span className="font-['Inter',_sans-serif]">
          {item.label}
        </span>

        {active &&
          item.href === "/assessments" &&
          location.pathname !== "/assessments" && (
            <span className="ml-auto text-[9px] font-mono text-violet-400/50 tracking-widest">
              {pageTitle}
            </span>
          )}
      </a>

      {/* Assessment sub-nav */}
      {item.href === "/assessments" &&
        location.pathname.startsWith("/assessments") &&
        location.pathname !== "/assessments" && (
          <div className="ml-4 mt-1 mb-2 space-y-0.5 border-l border-violet-500/15 pl-3">
            {[
              {
                href: "/assessments/personality",
                label: "Personality",
              },
              {
                href: "/assessments/aptitude",
                label: "Aptitude",
              },
              {
                href: "/assessments/behavioral",
                label: "Behavioral",
              },
              {
                href: "/assessments/results",
                label: "Results",
              },
            ].map((sub) => (
              <a
                key={sub.label}
                href={sub.href}
                className={`block px-3 py-2 rounded-lg text-[11px] font-mono transition-all ${
                  location.pathname === sub.href
                    ? "text-violet-300 bg-violet-500/10"
                    : "text-white/25 hover:text-white/50"
                }`}
              >
                {sub.label}
              </a>
            ))}
          </div>
        )}
    </div>
  );
})}

            
          </nav>

          {/* Bottom: Pro upgrade */}
          <div className="p-3">
            <div className="p-4 rounded-2xl bg-violet-900/[0.15] border border-violet-500/15">
              <p className="text-[10px] font-mono tracking-widest text-violet-400/70 uppercase mb-1">
                Pro Access
              </p>
              <p className="text-[11px] text-white/35 mb-3 font-['Inter',_sans-serif]">
                Unlock advanced analytics and AI insights.
              </p>
              <button className="w-full py-2 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 text-white text-xs font-bold font-['Hanken_Grotesk',_sans-serif] tracking-wide hover:brightness-110 transition-all shadow-[0_0_16px_rgba(192,193,255,0.2)]">
                Upgrade to Pro
              </button>
            </div>
          </div>
        </aside>

        {/* ── Main ──────────────────────────────────────────────── */}
        <main className={`flex-1 flex flex-col ${isMentor ? "h-screen overflow-hidden" : "min-h-screen"}`}>
          {/* Header */}
          <header className="flex-shrink-0 flex items-center justify-between border-b border-white/[0.07] bg-[rgba(255,255,255,0.01)] backdrop-blur-xl px-8 py-4 h-16 sticky top-0 z-40">
            <div className="flex items-center gap-3">
              {/* Back breadcrumb for nested assessment pages */}
              {location.pathname.startsWith("/assessments/") && (
                <a
                  href="/assessments"
                  className="flex items-center gap-1 text-white/25 hover:text-white/50 text-xs font-mono transition-colors mr-2"
                >
                  ← Assessments
                </a>
              )}
              <h2 className="text-base font-semibold text-white/70 font-['Hanken_Grotesk',_sans-serif]">
                {pageTitle}
              </h2>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-white/80">Alex Rivera</p>
                <p className="text-[10px] font-mono text-cyan-400/70 tracking-wider">ENGINEERING LVL 4</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center border border-white/10 shadow-[0_0_12px_rgba(192,193,255,0.2)]">
                <span className="text-[11px] font-bold text-white font-mono">AR</span>
              </div>
            </div>
          </header>

          {/* Page content */}
          <div className={`flex-1 ${isMentor ? "overflow-hidden" : "overflow-auto p-8"}`}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;