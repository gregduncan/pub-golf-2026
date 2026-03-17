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
    emoji: "🍺",
    coords: { lat: 33.6617, lng: -118.0017 },
  },
  {
    hole: 2,
    name: "HQ Gastropub",
    address: "155 5th St Suite F-183, Huntington Beach, CA 92648",
    emoji: "🍹",
    coords: { lat: 33.6560, lng: -117.9993 },
  },
  {
    hole: 3,
    name: "Sandy's Beach Shack",
    address: "315 Pacific Coast Hwy, Huntington Beach, CA 92648",
    emoji: "🥃",
    coords: { lat: 33.6553, lng: -117.9988 },
  },
  {
    hole: 4,
    name: "Four Sons on Main",
    address: "401 Main St #101, Huntington Beach, CA 92648",
    emoji: "🍻",
    coords: { lat: 33.6569, lng: -117.9965 },
  },
];

export default function App() {
  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans">
      {/* ===== HERO ===== */}
      <header className="hero-pattern text-white text-center py-16 px-4 relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-6xl mb-2">&#9971;</p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight drop-shadow-lg">
            Pub Golf 2026
          </h1>
          <p className="mt-3 text-lg sm:text-xl text-green-100 max-w-md mx-auto">
            A legendary night out on the course — no clubs required, just good vibes and better drinks.
          </p>
          <p className="mt-4 text-sm text-green-200 italic">
            Organised by Jim Silverstein
          </p>
        </div>
        {/* Decorative golf balls */}
        <div className="absolute top-4 left-4 text-4xl opacity-20 select-none" aria-hidden="true">&#9971;</div>
        <div className="absolute bottom-6 right-6 text-5xl opacity-15 select-none" aria-hidden="true">&#127866;</div>
      </header>

      {/* ===== MEETING POINT ===== */}
      <section className="px-4 py-10 flex justify-center">
        <div className="pulse-slow bg-yellow-50 border-2 border-yellow-300 rounded-2xl p-6 max-w-md w-full text-center shadow-lg">
          <p className="text-3xl mb-2">&#128276;</p>
          <h2 className="text-xl font-bold text-gray-900 mb-1">Meeting Point</h2>
          <p className="text-gray-700">
            Meet in the <span className="font-semibold">hotel lobby</span> at{" "}
            <span className="text-2xl font-extrabold text-green-700">8:00 PM</span>
          </p>
          <p className="text-gray-500 text-sm mt-2">Then we head out together!</p>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="px-4 py-8 max-w-lg mx-auto text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">&#127948; How Pub Golf Works</h2>
        <div className="text-left bg-green-50 rounded-2xl p-6 space-y-3 text-sm sm:text-base text-gray-700 shadow">
          <p>
            <span className="font-bold text-green-700">The Goal:</span> Complete all 4 "holes" (bars) and finish your assigned drink in the fewest sips — that's your score.
          </p>
          <p>
            <span className="font-bold text-green-700">Par:</span> The target number of sips to finish your drink at each hole.
          </p>
          <p>
            <span className="font-bold text-green-700">Birdie (−1):</span> Finish under par — nice one!
          </p>
          <p>
            <span className="font-bold text-green-700">Bogey (+1):</span> Over par — you'll do better at the next hole.
          </p>
          <p>
            <span className="font-bold text-green-700">Lowest total score wins!</span> Dress code: golf attire strongly encouraged (visors, polos, argyle socks).
          </p>
        </div>
      </section>

      {/* ===== THE COURSE (VENUES) ===== */}
      <section className="px-4 py-10">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">&#9971; The Course</h2>
        <div className="max-w-lg mx-auto space-y-5">
          {venues.map((venue, i) => (
            <div
              key={venue.hole}
              className="fade-up bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-lg transition-shadow overflow-hidden"
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              <div className="flex items-start gap-4 p-5">
                {/* Hole number badge */}
                <div className="flex-shrink-0 w-14 h-14 rounded-full bg-green-600 text-white flex flex-col items-center justify-center shadow">
                  <span className="text-[10px] font-semibold uppercase leading-none">Hole</span>
                  <span className="text-xl font-extrabold leading-none">{venue.hole}</span>
                </div>
                {/* Venue info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-gray-900 truncate">
                    {venue.emoji} {venue.name}
                  </h3>
                  <p className="text-sm text-gray-500 truncate">{venue.address}</p>
                </div>
              </div>
              {/* Small venue map */}
              <iframe
                title={`Map for ${venue.name}`}
                src={`https://www.google.com/maps?q=${venue.coords.lat},${venue.coords.lng}&z=16&output=embed`}
                width="100%"
                height="150"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          ))}
        </div>
      </section>

      {/* ===== MAP ===== */}
      <section className="px-4 py-10 bg-gray-50">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">&#128205; All Venues</h2>
        <div className="max-w-lg mx-auto rounded-2xl overflow-hidden shadow-lg border border-gray-200">
          <MapContainer
            center={[33.657, -117.999]}
            zoom={14}
            scrollWheelZoom={false}
            style={{ height: "350px", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {venues.map((venue) => (
              <Marker key={venue.hole} position={[venue.coords.lat, venue.coords.lng]}>
                <Popup>
                  <strong>Hole {venue.hole}: {venue.name}</strong>
                  <br />
                  {venue.address}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
        <p className="text-center text-sm text-gray-400 mt-3">
          Tap a pin to see venue details
        </p>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="text-center py-8 px-4 bg-green-700 text-green-100 text-sm">
        <p className="font-semibold text-white mb-1">Pub Golf 2026</p>
        <p>Organised with questionable judgement by Jim Silverstein</p>
        <p className="mt-2 text-green-300 text-xs">Please drink responsibly. Seriously.</p>
      </footer>
    </div>
  );
}
