import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icon issue in bundled environments
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const venues = [
  {
    hole: 1,
    name: "Simmzy's Restaurant",
    address: "21028 California 1, PCH E-100, Huntington Beach, CA 92647",
    coords: { lat: 33.6617, lng: -118.0017 },
  },
  {
    hole: 2,
    name: "HQ Gastropub",
    address: "155 5th St Suite F-183, Huntington Beach, CA 92648",
    coords: { lat: 33.6560, lng: -117.9993 },
  },
  {
    hole: 3,
    name: "Sandy's Beach Shack",
    address: "315 Pacific Coast Hwy, Huntington Beach, CA 92648",
    coords: { lat: 33.6553, lng: -117.9988 },
  },
  {
    hole: 4,
    name: "Four Sons on Main",
    address: "401 Main St #101, Huntington Beach, CA 92648",
    coords: { lat: 33.6569, lng: -117.9965 },
  },
];

const bonusRules = [
  { id: "r1", num: 1, text: "Drink a green beer", pts: -1, maxCount: 2 },
  { id: "r2", num: 2, text: "Drink an Irish stout", pts: -1, maxCount: 2 },
  { id: "r3", num: 3, text: "Introduce yourself to a bartender", pts: -2, maxCount: 1 },
  { id: "r4", num: 4, text: "Drink a flight", pts: -1, maxCount: 2 },
  { id: "r5", num: 5, text: "Drink a beer in an Irish pub", pts: -1, maxCount: 2 },
  { id: "r7", num: 7, text: "Eat a taco", pts: -1, maxCount: 1 },
  { id: "r8", num: 8, text: "Wear something green", pts: -2, maxCount: 1 },
  { id: "r9", num: 9, text: "Drink only with your non-dominant hand", pts: -1, maxCount: 2 },
  { id: "r10", num: 10, text: "Go on the beach", pts: -1, maxCount: 1 },
  { id: "r11", num: 11, text: "Go in the ocean", pts: -2, maxCount: 1 },
];

const penaltyRules = [
  { id: "r6", num: 6, text: "Miss a location (skip a hole)", pts: 2, maxCount: 4 },
];

const allRules = [...bonusRules, ...penaltyRules];
const defaultCounts = Object.fromEntries(allRules.map((r) => [r.id, 0]));

export default function App() {
  const [counts, setCounts] = useState(() => {
    try {
      const saved = localStorage.getItem("pg_tally");
      if (saved) {
        const parsed = JSON.parse(saved);
        // Merge with defaults in case new rules were added
        return { ...defaultCounts, ...parsed };
      }
    } catch {}
    return { ...defaultCounts };
  });

  useEffect(() => {
    localStorage.setItem("pg_tally", JSON.stringify(counts));
  }, [counts]);

  const increment = (id, maxCount) => {
    setCounts((prev) => ({
      ...prev,
      [id]: Math.min(prev[id] + 1, maxCount),
    }));
  };

  const decrement = (id) => {
    setCounts((prev) => ({
      ...prev,
      [id]: Math.max(prev[id] - 1, 0),
    }));
  };

  const totalScore = allRules.reduce(
    (sum, rule) => sum + counts[rule.id] * rule.pts,
    0
  );

  const renderRuleRow = (rule) => {
    const earned = counts[rule.id] * rule.pts;
    const isBonus = rule.pts < 0;
    return (
      <div
        key={rule.id}
        className="flex items-center gap-2.5 px-4 py-2.5 border-t border-[rgba(255,255,255,0.05)]"
      >
        {/* Rule number */}
        <span
          className="text-[18px] text-[var(--color-muted)] min-w-[22px]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {rule.num}
        </span>

        {/* Rule text */}
        <span className="flex-1 text-sm text-[var(--color-text)] leading-snug min-w-0">
          {rule.text}
        </span>

        {/* Counter controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            className="counter-btn minus"
            onClick={() => decrement(rule.id)}
            disabled={counts[rule.id] === 0}
            aria-label={`Decrease ${rule.text}`}
          >
            &minus;
          </button>
          <span
            className="w-6 text-center text-sm font-semibold tabular-nums"
            style={{ fontFamily: "var(--font-display)", fontSize: "18px" }}
          >
            {counts[rule.id]}
          </span>
          <button
            className="counter-btn plus"
            onClick={() => increment(rule.id, rule.maxCount)}
            disabled={counts[rule.id] >= rule.maxCount}
            aria-label={`Increase ${rule.text}`}
          >
            +
          </button>
        </div>

        {/* Points earned */}
        <span
          className={`text-[13px] font-semibold w-[36px] text-right tabular-nums ${
            earned === 0
              ? "text-[var(--color-muted)]"
              : isBonus
                ? "text-[#4cde7a]"
                : "text-[#e85555]"
          }`}
        >
          {earned === 0 ? "—" : (earned > 0 ? "+" : "") + earned}
        </span>
      </div>
    );
  };
  return (
    <div className="min-h-screen bg-[var(--color-dark)] text-[var(--color-text)] font-sans">
      {/* ===== HEADER ===== */}
      <header className="header-gradient relative overflow-hidden text-center py-8 px-5 border-b-2 border-[var(--color-gold)]">
        <div className="relative z-10">
          <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[var(--color-gold-light)] mb-1.5">
            Huntington Beach &middot; St. Patrick's Day
          </p>
          <h1
            className="text-[52px] leading-none tracking-[0.04em] text-[var(--color-white)]"
            style={{ fontFamily: "var(--font-display)", textShadow: "0 2px 20px rgba(0,0,0,0.5)" }}
          >
            PUB <span className="text-[var(--color-gold-light)]">GOLF</span>
          </h1>
          <p className="text-[13px] text-[var(--color-muted)] mt-1.5">
            4 holes &middot; No clubs required, just good company
          </p>
          <p className="text-[13px] text-[var(--color-muted)] mt-1.5">
            No order, no official time, starting around 7-ish
          </p>
          <span className="inline-block mt-3 bg-[var(--color-gold)] text-[#1a1000] text-[11px] font-semibold tracking-[0.1em] uppercase px-3.5 py-1 rounded-full">
            Not organised by Milliman
          </span>
        </div>
      </header>

      {/* ===== THE COURSE ===== */}
      <section className="px-4 py-8">
        <div className="max-w-lg mx-auto">
          <h2
            className="text-[26px] tracking-[0.06em] text-[var(--color-white)] mb-1"
            style={{ fontFamily: "var(--font-display)" }}
          >
            The Course
          </h2>
          <p className="text-[13px] text-[var(--color-muted)] mb-5">4 holes through Surf City</p>

          <div className="space-y-3">
            {venues.map((venue, i) => (
              <div
                key={venue.hole}
                className="fade-up bg-[var(--color-card)] rounded-2xl border border-[rgba(255,255,255,0.08)] overflow-hidden"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {/* Card header */}
                <div className="flex items-center gap-3 px-4 py-3.5 bg-[rgba(255,255,255,0.03)] border-b border-[rgba(255,255,255,0.06)]">
                  <span
                    className="bg-[var(--color-green)] text-[#c8ffd4] text-[18px] px-2.5 py-1 rounded-lg whitespace-nowrap"
                    style={{ fontFamily: "var(--font-display)", letterSpacing: "0.08em" }}
                  >
                    HOLE {venue.hole}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-semibold text-[var(--color-white)] truncate">
                      {venue.name}
                    </p>
                    <p className="text-xs text-[var(--color-muted)] truncate mt-0.5">
                      {venue.address}
                    </p>
                  </div>
                </div>
                {/* Venue map */}
                <iframe
                  title={`Map for ${venue.name}`}
                  src={`https://www.google.com/maps?q=${venue.coords.lat},${venue.coords.lng}&z=16&output=embed`}
                  width="100%"
                  height="140"
                  style={{ border: 0, display: "block" }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== RULES ===== */}
      <section className="px-4 pb-8 max-w-lg mx-auto">
        <h2
          className="text-[26px] tracking-[0.06em] text-[var(--color-white)] mb-1"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Rules
        </h2>
        <p className="text-[13px] text-[var(--color-muted)] mb-5">How scoring works</p>

        {/* Tip box */}
        <div className="bg-[rgba(212,160,23,0.12)] border border-[rgba(212,160,23,0.25)] rounded-xl px-4 py-3.5 mb-3 text-[13px] text-[var(--color-gold-light)] leading-relaxed">
          <p className="font-semibold text-sm mb-1">How scoring works</p>
          Complete bonus actions to lower your score. Penalties add strokes.
          Wear green before you leave — it's worth -2 the whole round!
        </div>

        {/* Score summary */}
        <div className="score-bar rounded-xl px-4 py-3 mb-3 flex items-center justify-between">
          <span className="text-sm text-[var(--color-muted)]">Your Score</span>
          <span
            className={`text-[28px] font-bold tabular-nums ${
              totalScore === 0
                ? "text-[var(--color-white)]"
                : totalScore < 0
                  ? "text-[#4cde7a]"
                  : "text-[#e85555]"
            }`}
            style={{ fontFamily: "var(--font-display)", letterSpacing: "0.04em" }}
          >
            {totalScore === 0 ? "0" : (totalScore > 0 ? "+" : "") + totalScore}
          </span>
        </div>

        {/* Bonus rules card */}
        <div className="bg-[var(--color-card)] rounded-2xl border border-[rgba(255,255,255,0.08)] overflow-hidden mb-3">
          <div
            className="flex items-center justify-between px-4 py-3 bg-[rgba(26,107,58,0.3)] text-[#a0f0c0] text-[18px] tracking-[0.06em]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            <span>Bonus Rules (lower is better)</span>
            <span className="text-sm">-pts</span>
          </div>
          {bonusRules.map(renderRuleRow)}
        </div>

        {/* Penalty rules card */}
        <div className="bg-[var(--color-card)] rounded-2xl border border-[rgba(255,255,255,0.08)] overflow-hidden">
          <div
            className="flex items-center justify-between px-4 py-3 bg-[rgba(192,57,43,0.25)] text-[#f0a090] text-[18px] tracking-[0.06em]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            <span>Penalty Rule</span>
            <span className="text-sm">+pts</span>
          </div>
          {penaltyRules.map(renderRuleRow)}
        </div>
      </section>

      {/* ===== MEDAL / REPORTING ===== */}
      <section className="px-4 py-6 space-y-3">
        <div className="bg-[var(--color-card)] rounded-2xl border border-[rgba(255,255,255,0.08)] p-5 text-center space-y-2">
          <p
            className="text-lg text-[var(--color-gold)]"
            style={{ fontFamily: "var(--font-display)", letterSpacing: "0.06em" }}
          >
            Medal for winner
          </p>
          <p className="text-sm text-[var(--color-muted)]">
            Report your score to Jim S or Tanya
          </p>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="text-center py-8 px-4 border-t">
        <p
          className="text-lg text-[var(--color-white)]"
          style={{ fontFamily: "var(--font-display)", letterSpacing: "0.06em" }}
        >
          Pub Golf 2026
        </p>
        <p className="text-xs text-[var(--color-muted)] mt-3 opacity-60">
          Please drink responsibly.
        </p>
      </footer>
    </div>
  );
}
