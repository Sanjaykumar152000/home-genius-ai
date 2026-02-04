import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const [form, setForm] = useState({
    plotLength: "",
    plotWidth: "",
    facing: "North",
    floors: 1,
    bedrooms: 2,
    style: "Modern",
    vastu: "Tamil Nadu",
  });

  // Splash screen auto-hide
  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2200);
    return () => clearTimeout(timer);
  }, []);

  const generateDesign = async () => {
    try {
      setLoading(true);
      setResult(null);
      const res = await axios.post(
        "https://home-genius-ai.onrender.com/api/design/generate",
        form
      );
      setResult(res.data);
    } catch (err) {
      alert(err.response?.data?.error || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* 🔥 BACKGROUND IMAGE */}
      <div
        className="absolute inset-0 bg-cover bg-center scale-105"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1600585154340-be6161a56a0c)",
        }}
      />
      <div className="absolute inset-0 bg-black/40 backdrop-blur-xl" />

      {/* 🔥 SPLASH SCREEN */}
      <AnimatePresence>
        {showSplash && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center text-white"
            >
              <h1 className="text-5xl font-extrabold tracking-tight">
                🏠 Home Genius AI
              </h1>
              <p className="mt-4 text-lg text-gray-300">
                Design smarter. Build better.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🔥 MAIN CONTENT */}
      {!showSplash && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 flex justify-center px-6 py-16"
        >
          <div className="w-full max-w-6xl bg-white/70 backdrop-blur-2xl rounded-3xl shadow-2xl p-10">
            {/* HEADER */}
            <div className="text-center mb-10">
              <h2 className="text-4xl font-extrabold">
                AI House Planner
              </h2>
              <p className="text-gray-600 mt-2">
                Intelligent 2D, 3D & Exterior Design
              </p>
            </div>

            {/* FORM */}
            <div className="grid md:grid-cols-2 gap-5">
              <Input label="Plot Length (ft)" onChange={(v) => setForm({ ...form, plotLength: v })} />
              <Input label="Plot Width (ft)" onChange={(v) => setForm({ ...form, plotWidth: v })} />

              <Select label="Facing" options={["North", "South", "East", "West"]}
                onChange={(v) => setForm({ ...form, facing: v })}
              />

              <Select label="Floors" options={["Ground", "G+1", "G+2"]}
                onChange={(v) => setForm({ ...form, floors: v })}
              />

              <Select label="Bedrooms" options={["2", "3", "4"]}
                onChange={(v) => setForm({ ...form, bedrooms: v })}
              />

              <Select label="Style" options={["Modern", "Luxury", "Traditional", "American"]}
                onChange={(v) => setForm({ ...form, style: v })}
              />

              <Select label="Vastu" options={["Tamil Nadu", "Karnataka", "No Vastu"]}
                onChange={(v) => setForm({ ...form, vastu: v })}
                full
              />
            </div>

            {/* BUTTON */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={generateDesign}
              disabled={loading}
              className="mt-8 w-full bg-black text-white py-5 rounded-2xl text-lg font-semibold shadow-xl"
            >
              {loading ? "Generating AI Designs..." : "Generate House Design"}
            </motion.button>

            {/* LOADING */}
            {loading && (
              <div className="mt-10 space-y-4">
                <Skeleton />
                <Skeleton />
                <Skeleton />
              </div>
            )}

            {/* RESULTS */}
            {result && (
              <div className="mt-14 space-y-14">
                <Result title="2D Floor Plan" img={result.floor2D} />
                <Result title="3D Floor Plan" img={result.floor3D} />
                <Result title="Exterior Elevation" img={result.exterior} />
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}

/* ---------- UI COMPONENTS ---------- */

const Input = ({ label, onChange }) => (
  <input
    placeholder={label}
    className="border rounded-xl p-4 bg-white/80 focus:ring-2 focus:ring-black"
    onChange={(e) => onChange(e.target.value)}
  />
);

const Select = ({ label, options, onChange, full }) => (
  <select
    className={`border rounded-xl p-4 bg-white/80 ${full ? "md:col-span-2" : ""}`}
    onChange={(e) => onChange(e.target.value)}
  >
    {options.map((o) => (
      <option key={o}>{o}</option>
    ))}
  </select>
);

const Result = ({ title, img }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
    <h3 className="text-2xl font-semibold mb-4">{title}</h3>
    <img
      src={img}
      className="rounded-2xl shadow-xl hover:scale-[1.02] transition"
      alt={title}
    />
  </motion.div>
);

const Skeleton = () => (
  <div className="h-64 rounded-2xl bg-gray-300 animate-pulse" />
);
