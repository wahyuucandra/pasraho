"use client";

const SARAN_POOL = [
  { icon: "🧘", text: "Tarik napas dalam-dalam, hitung sampai 5" },
  { icon: "☕", text: "Minum teh atau kopi dulu sebentar" },
  { icon: "🎵", text: "Putar lagu favorit Anda" },
  { icon: "🌳", text: "Bayangkan sedang jalan-jalan di taman" },
  { icon: "💰", text: "Pikirkan bonus tahunan yang akan datang" },
  { icon: "🏖️", text: "Ingat bahwa weekend tinggal sebentar lagi" },
  { icon: "🍕", text: "Nanti makan siang yang enak" },
  { icon: "😌", text: "Senyum tipis dulu aja, pelan-pelan" },
  { icon: "🐱", text: "Buka video lucu kucing di YouTube" },
  { icon: "🧃", text: "Minum yang segar dulu biar adem" },
];

function getRandomSaran() {
  const shuffled = [...SARAN_POOL].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3);
}

export default function SmilePopup({ show, onClose }) {
  if (!show) return null;

  const saran = getRandomSaran();

  return (
    <div className="modal-overlay fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="modal-content mx-4 max-w-md rounded-3xl bg-white p-8 shadow-2xl">
        {/* Emoji */}
        <div className="mb-4 text-center">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-red-100 to-orange-100 text-4xl">
            😤
          </div>
        </div>

        {/* Title */}
        <h3 className="mb-2 text-center text-2xl font-bold text-gray-900">
          Wajah Anda Belum Tersenyum
        </h3>
        <p className="mb-6 text-center text-gray-500">
          Demi keselamatan karier, yuk rileks dulu sebentar:
        </p>

        {/* Saran */}
        <div className="mb-6 space-y-3">
          {saran.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-xl bg-stone-50 p-4"
            >
              <span className="text-2xl">{item.icon}</span>
              <p className="text-sm text-gray-700">{item.text}</p>
            </div>
          ))}
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          className="w-full rounded-xl bg-emerald-500 py-3 font-semibold text-white transition-all hover:bg-emerald-600 active:scale-[0.98]"
        >
          OK, Saya Coba Lagi
        </button>
      </div>
    </div>
  );
}
