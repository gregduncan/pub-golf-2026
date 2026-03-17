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

export default function App() {
  return (
    <div className="min-h-screen bg-[var(--color-surface)] text-[var(--color-text-primary)] font-sans">
      {/* ===== HERO ===== */}
      <header className="hero-gradient text-center py-20 px-4 relative">
        <div className="relative z-10 max-w-lg mx-auto">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-accent)] mb-4">
            Huntington Beach, CA
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white">
            Pub Golf 2026
          </h1>
          <div className="glow-line w-24 mx-auto mt-5 mb-5" />
          <p className="text-base sm:text-lg text-[var(--color-text-secondary)] max-w-md mx-auto leading-relaxed">
            Four bars. One night. No clubs required — just good company and better drinks.
          </p>
          <p className="mt-5 text-sm text-[var(--color-text-muted)]">
            Organised by Jim Silverstein
          </p>
        </div>
      </header>

      {/* ===== MEETING POINT ===== */}
      <section className="px-4 py-12 flex justify-center">
        <div className="bg-[var(--color-surface-raised)] border border-[var(--color-border)] rounded-xl p-6 max-w-md w-full text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)] mb-3">
            Meeting Point
          </p>
          <p className="text-[var(--color-text-primary)] text-lg">
            Hotel Lobby &mdash;{" "}
            <span className="text-2xl font-bold text-[var(--color-accent)]">8:00 PM</span>
          </p>
          <p className="text-[var(--color-text-muted)] text-sm mt-2">
            We head out together from there.
          </p>
        </div>
      </section>

      <div className="glow-line max-w-xs mx-auto" />

      {/* ===== HOW IT WORKS ===== */}
      <section className="px-4 py-12 max-w-lg mx-auto">
        <h2 className="text-xl font-bold text-center text-white mb-6">How It Works</h2>
        <div className="space-y-4 text-sm sm:text-base text-[var(--color-text-secondary)]">
          <div className="flex gap-3">
            <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-[var(--color-accent-glow)] border border-[var(--color-accent-dim)] flex items-center justify-center text-[var(--color-accent)] text-xs font-bold">1</span>
            <p><span className="text-white font-medium">The Goal</span> — Complete all 4 holes and finish your drink at each bar in the fewest sips. That's your score.</p>
          </div>
          <div className="flex gap-3">
            <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-[var(--color-accent-glow)] border border-[var(--color-accent-dim)] flex items-center justify-center text-[var(--color-accent)] text-xs font-bold">2</span>
            <p><span className="text-white font-medium">Par</span> — Each hole has a target number of sips. Beat it for a birdie, miss it for a bogey.</p>
          </div>
          <div className="flex gap-3">
            <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-[var(--color-accent-glow)] border border-[var(--color-accent-dim)] flex items-center justify-center text-[var(--color-accent)] text-xs font-bold">3</span>
            <p><span className="text-white font-medium">Lowest total score wins.</span> Golf attire strongly encouraged — visors, polos, argyle socks.</p>
          </div>
        </div>
      </section>

      <div className="glow-line max-w-xs mx-auto" />

      {/* ===== THE COURSE (VENUES) ===== */}
      <section className="px-4 py-12">
        <h2 className="text-xl font-bold text-center text-white mb-8">The Course</h2>
        <div className="max-w-lg mx-auto space-y-4">
          {venues.map((venue, i) => (
            <div
              key={venue.hole}
              className="fade-up bg-[var(--color-surface-raised)] border border-[var(--color-border)] rounded-xl overflow-hidden hover:border-[var(--color-accent-dim)] transition-colors"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="flex items-center gap-4 p-4">
                {/* Hole number */}
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-[var(--color-accent-glow)] border border-[var(--color-accent-dim)] flex flex-col items-center justify-center">
                  <span className="text-[9px] font-semibold uppercase text-[var(--color-accent)] leading-none tracking-wider">Hole</span>
                  <span className="text-lg font-extrabold text-[var(--color-accent)] leading-none">{venue.hole}</span>
                </div>
                {/* Venue info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-white truncate">
                    {venue.name}
                  </h3>
                  <p className="text-sm text-[var(--color-text-muted)] truncate">{venue.address}</p>
                </div>
              </div>
              {/* Small venue map */}
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
      </section>

      <div className="glow-line max-w-xs mx-auto" />

      {/* ===== MAP ===== */}
      <section className="px-4 py-12">
        <h2 className="text-xl font-bold text-center text-white mb-6">All Venues</h2>
        <div className="max-w-lg mx-auto rounded-xl overflow-hidden border border-[var(--color-border)]">
          <MapContainer
            center={[33.657, -117.999]}
            zoom={14}
            scrollWheelZoom={false}
            style={{ height: "350px", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
            {venues.map((venue) => (
              <Marker key={venue.hole} position={[venue.coords.lat, venue.coords.lng]}>
                <Popup>
                  <strong>Hole {venue.hole}: {venue.name}</strong>
                  <br />
                  <span style={{ fontSize: "0.85em", opacity: 0.8 }}>{venue.address}</span>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
        <p className="text-center text-xs text-[var(--color-text-muted)] mt-3">
          Tap a pin for venue details
        </p>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="text-center py-10 px-4 border-t border-[var(--color-border)]">
        <p className="text-sm font-semibold text-white">Pub Golf 2026</p>
        <p className="text-xs text-[var(--color-text-muted)] mt-1">
          Organised by Jim Silverstein
        </p>
        <p className="text-xs text-[var(--color-text-muted)] mt-3 opacity-60">
          Please drink responsibly.
        </p>
      </footer>
    </div>
  );
}
