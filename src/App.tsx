import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import confetti from "canvas-confetti";
import {
  Crown, Sparkles, Heart, Star, Phone, MapPin,
  ChevronLeft, ChevronRight, X, ZoomIn, Check, Gift, Gem
} from "lucide-react";

/* ═══════════════════════════════════════════════════
   CONFETTI RAIN
═══════════════════════════════════════════════════ */
function useConfettiRain() {
  useEffect(() => {
    const colors = ["#c03060", "#e8709a", "#c9a96e", "#e8cc9a", "#f5ede0", "#ffffff"];
    let active = true;
    function drop() {
      if (!active) return;
      confetti({
        particleCount: 1, startVelocity: 0, ticks: 380,
        origin: { x: Math.random(), y: 0 },
        colors: [colors[Math.floor(Math.random() * colors.length)]],
        gravity: 0.4 + Math.random() * 0.25,
        scalar: 0.5 + Math.random() * 0.35,
        drift: (Math.random() - 0.5) * 0.6,
        shapes: ["circle", "square"],
      });
      setTimeout(drop, 75);
    }
    drop();
    return () => { active = false; };
  }, []);
}

/* ═══════════════════════════════════════════════════
   FLOATING ROSE PETALS
═══════════════════════════════════════════════════ */
function FloatingPetals() {
  const petals = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    left: `${5 + (i * 8.5) % 90}%`,
    delay: i * 1.4,
    dur: 8 + (i % 5) * 2,
    size: 10 + (i % 4) * 4,
    rotate: (i % 2 === 0) ? 1 : -1,
  }));
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {petals.map((p) => (
        <div
          key={p.id}
          className="absolute top-0"
          style={{
            left: p.left,
            animation: `petal-fall ${p.dur}s ${p.delay}s ease-in infinite`,
          }}
        >
          <svg width={p.size} height={p.size} viewBox="0 0 20 20" style={{ transform: `rotate(${30 * p.rotate}deg)` }}>
            <ellipse cx="10" cy="12" rx="5" ry="8" fill="#c03060" fillOpacity="0.35" />
            <ellipse cx="10" cy="10" rx="3" ry="6" fill="#e8709a" fillOpacity="0.25" />
          </svg>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   STAR FIELD
═══════════════════════════════════════════════════ */
function StarField() {
  const stars = Array.from({ length: 35 }, (_, i) => ({
    id: i, x: Math.random() * 100, y: Math.random() * 100,
    size: 1 + Math.random() * 2.5, delay: Math.random() * 5, dur: 2 + Math.random() * 4,
  }));
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
      {stars.map((s) => (
        <motion.div
          key={s.id}
          className="absolute rounded-full"
          style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size,
            background: `radial-gradient(circle, #e8cc9a, #c9a96e)` }}
          animate={{ opacity: [0.05, 0.7, 0.05], scale: [1, 1.5, 1] }}
          transition={{ duration: s.dur, delay: s.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   ORNAMENT DIVIDER
═══════════════════════════════════════════════════ */
function OrnamentDivider({ icon = "◆" }: { icon?: string }) {
  return (
    <div className="ornament-line my-10 text-[#c9a96e] text-sm opacity-60">
      <span>{icon}</span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   PHOTO GALLERY – ASYMMETRIC GRID
═══════════════════════════════════════════════════ */
const PHOTOS = [
  { id: 2, src: "/FOTOS/2.png", caption: "Geraldine Romero Mora", tag: "Miss Aucallama" },
  { id: 1, src: "/FOTOS/1.png", caption: "Nuestra Reina",         tag: "Elegancia" },
  { id: 3, src: "/FOTOS/3.png", caption: "Miss Aucallama",         tag: "Realeza" },
  { id: 4, src: "/FOTOS/4.png", caption: "Sonrisa Radiante",       tag: "Belleza" },
  { id: 5, src: "/FOTOS/5.png", caption: "Orgullo de Huaral",      tag: "Gracia" },
  { id: 6, src: "/FOTOS/6.jpg", caption: "Dulce Sonrisa",          tag: "Carisma" },
  { id: 7, src: "/FOTOS/7.jpg", caption: "Pasarela Real",          tag: "Glamour" },
  { id: 8, src: "/FOTOS/8.jpg", caption: "Encanto de Aucallama",   tag: "Soberana" },
];

function PhotoGallery() {
  const [selected, setSelected] = useState<number | null>(null);
  const selectedPhoto = PHOTOS.find((p) => p.id === selected);

  // Intercept browser popstate to close lightbox on back button (mobile navigation)
  useEffect(() => {
    const handlePopState = () => {
      setSelected(null);
    };
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const openLightbox = (id: number) => {
    setSelected(id);
    window.history.pushState({ lightbox: id }, "");
  };

  const closeLightbox = () => {
    setSelected(null);
    if (window.history.state?.lightbox !== undefined) {
      window.history.back();
    }
  };

  const navigate = (dir: "prev" | "next") => {
    if (selected === null) return;
    const idx = PHOTOS.findIndex((p) => p.id === selected);
    const next = dir === "next" ? (idx + 1) % PHOTOS.length : (idx - 1 + PHOTOS.length) % PHOTOS.length;
    const nextId = PHOTOS[next].id;
    setSelected(nextId);
    window.history.replaceState({ lightbox: nextId }, "");
  };

  return (
    <section className="relative py-28 px-4">
      <motion.div className="text-center mb-16"
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
        <p className="text-[#c9a96e] text-[10px] tracking-[0.35em] uppercase mb-4 font-light">Galería Exclusiva</p>
        <h2 className="font-['Cormorant_Garamond'] text-5xl md:text-6xl text-[#fdf8f2] font-light italic">
          Momentos que <span className="animate-shimmer">Brillan</span>
        </h2>
        <OrnamentDivider />
      </motion.div>

      {/* Masonry Asymmetric Column Layout */}
      <div className="columns-2 md:columns-3 lg:columns-4 gap-4 max-w-5xl mx-auto space-y-4">
        {PHOTOS.map((photo, index) => (
          <motion.div
            key={photo.id}
            className="break-inside-avoid mb-4 relative group cursor-pointer rounded-2xl overflow-hidden card-luxury border border-[#2a1a2e] block"
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: (index % 4) * 0.1 }}
            whileHover={{ scale: 1.015 }}
            onClick={() => openLightbox(photo.id)}
          >
            <img
              src={photo.src}
              alt={photo.caption}
              className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
            <PhotoOverlay photo={photo} />
          </motion.div>
        ))}
      </div>
      {/* Lightbox */}
      <AnimatePresence>
        {selected !== null && selectedPhoto && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={closeLightbox}>
            
            {/* Floating Close Button on Backdrop */}
            <button
              onClick={(e) => { e.stopPropagation(); closeLightbox(); }}
              className="absolute top-6 right-6 sm:top-8 sm:right-8 w-11 h-11 rounded-full bg-[#18101c]/80 border border-[#2a1a2e] flex items-center justify-center hover:bg-[#c03060]/20 transition-colors z-50 cursor-pointer text-[#f5ede0]"
            >
              <X className="w-5 h-5" />
            </button>

            <motion.div
              initial={{ scale: 0.88, y: 24 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.88, y: 24 }}
              transition={{ type: "spring", damping: 24, stiffness: 200 }}
              className="relative max-w-lg w-full card-luxury gloss-card p-4 flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}>
              {["prev","next"].map((dir) => (
                <button key={dir} onClick={() => navigate(dir as "prev"|"next")}
                  className={`absolute ${dir==="prev"?"left-3":"right-3"} top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/70 border border-[#2a1a2e] flex items-center justify-center hover:border-[#c9a96e]/50 transition-colors z-10 cursor-pointer`}>
                  {dir==="prev" ? <ChevronLeft className="w-4 h-4 text-[#f5ede0]" /> : <ChevronRight className="w-4 h-4 text-[#f5ede0]" />}
                </button>
              ))}
              <div className="w-full rounded-xl overflow-hidden mb-4" style={{ maxHeight: "65vh" }}>
                <img src={selectedPhoto.src} alt={selectedPhoto.caption}
                  className="w-full h-full object-contain mx-auto block" style={{ maxHeight: "65vh" }} />
              </div>
              <p className="text-[#c9a96e] text-[10px] uppercase tracking-[0.25em] mb-1">{selectedPhoto.tag}</p>
              <h3 className="font-['Cormorant_Garamond'] text-2xl text-[#fdf8f2] italic">{selectedPhoto.caption}</h3>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function PhotoOverlay({ photo, large }: { photo: typeof PHOTOS[0]; large?: boolean }) {
  return (
    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400">
      <div className="flex items-center gap-1.5 mb-1">
        <div className="w-4 h-px bg-[#c9a96e]" />
        <span className="text-[#c9a96e] text-[9px] uppercase tracking-[0.25em]">{photo.tag}</span>
      </div>
      <p className={`font-['Cormorant_Garamond'] text-white italic ${large ? "text-2xl" : "text-xl"}`}>{photo.caption}</p>
      <div className="flex items-center gap-1.5 mt-2">
        <ZoomIn className="w-3 h-3 text-[#c9a96e]" />
        <span className="text-[#c9a96e] text-[9px] uppercase tracking-widest">Ver foto</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   PRICING CARD
═══════════════════════════════════════════════════ */
interface PriceCardProps {
  icon: React.ReactNode; title: string; original?: number;
  price: number; badge?: string; features: string[];
  highlight?: boolean; buttonLabel: string; onAction: () => void;
}

function PriceCard({ icon, title, original, price, badge, features, highlight, buttonLabel, onAction }: PriceCardProps) {
  return (
    <div className={`relative ${badge ? "pt-5" : ""} h-full flex flex-col`}>
      {badge && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10 bg-gradient-to-r from-[#c03060] to-[#8c1a38] text-[#fdf8f2] text-[10px] font-semibold tracking-[0.22em] uppercase px-5 py-1.5 rounded-full whitespace-nowrap shadow-lg shadow-[#c03060]/40">
          {badge}
        </div>
      )}

      <motion.div
        whileHover={{ y: -8, scale: highlight ? 1.015 : 1.01 }}
        transition={{ type: "spring", stiffness: 220 }}
        className={`relative flex flex-col flex-1 overflow-hidden rounded-[22px] ${highlight ? "card-vip-border animate-glow-vip p-[1.5px]" : ""}`}
      >
        <div className={`relative flex flex-col flex-1 rounded-[21px] p-7 gap-5 gloss-card
          ${highlight
            ? "bg-gradient-to-b from-[#1e1020] via-[#180d1e] to-[#120a15]"
            : "card-luxury"}`}>

          {/* VIP watermark ornament */}
          {highlight && (
            <>
              <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-[#c03060]/8 blur-2xl pointer-events-none" />
              <div className="absolute top-4 right-4 opacity-[0.07] text-5xl select-none pointer-events-none font-['Cormorant_Garamond'] italic text-[#c9a96e]">♛</div>
            </>
          )}

          {/* Header row */}
          <div className="flex items-start gap-3 mt-1">
            <div className={`p-2.5 rounded-xl shrink-0 ${highlight ? "bg-[#c03060]/20 text-[#e8709a]" : "bg-[#2a1a2e] text-[#c9a96e]"}`}>
              {icon}
            </div>
            <div className="min-w-0">
              <p className="text-[#857080] text-[10px] uppercase tracking-widest font-light">{title}</p>
              <div className="flex items-baseline gap-2 mt-1 flex-wrap">
                <span className="font-['Cormorant_Garamond'] text-5xl font-light text-[#fdf8f2] leading-none">
                  S/. {price}
                </span>
                {original && <span className="text-[#857080] text-sm line-through">S/. {original}</span>}
              </div>
              {original
                ? <p className="text-[#c9a96e] text-xs mt-1">¡Ahorras S/. {original - price}!</p>
                : <p className="text-[#857080] text-xs mt-1 opacity-0 select-none">–</p>}
            </div>
          </div>

          {/* VIP savings spotlight */}
          {highlight && (
            <div className="relative overflow-hidden rounded-xl border border-[#c9a96e]/20 bg-gradient-to-r from-[#c9a96e]/8 to-[#c03060]/8 px-4 py-3 text-center">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#c9a96e]/5 to-transparent animate-shimmer" style={{ backgroundSize: "200% auto" }} />
              <p className="text-[#c9a96e] text-[10px] uppercase tracking-[0.25em] mb-0.5">Descuento Total</p>
              <p className="font-['Cormorant_Garamond'] text-3xl text-[#e8cc9a] font-light">S/. 400 de regalo</p>
            </div>
          )}

          {/* Features */}
          <ul className="space-y-2.5 flex-1">
            {features.map((f, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <Check className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${highlight ? "text-[#e8709a]" : "text-[#c9a96e]"}`} />
                <span className="text-[#f5ede0] text-sm font-light leading-snug">{f}</span>
              </li>
            ))}
          </ul>

          {/* Divider */}
          <div className="ornament-line text-[#c9a96e]/30 text-xs">
            <span>{highlight ? "✦" : "◆"}</span>
          </div>

          {/* Button */}
          <button onClick={onAction}
            className={`btn-royal w-full justify-center text-xs ${highlight ? "btn-gold" : "!bg-gradient-to-r !from-[#18101c] !to-[#2a1a2e] !text-[#f5ede0] hover:!brightness-125 border border-[#2a1a2e]"}`}>
            {buttonLabel}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN APP
═══════════════════════════════════════════════════ */
export default function App() {
  useConfettiRain();

  const [customAlert, setCustomAlert] = useState<{
    title: string;
    message: string;
    actionText?: string;
    onConfirm?: () => void;
  } | null>(null);

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY       = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const nameScale   = useTransform(scrollYProgress, [0, 0.5], [1, 0.85]);

  const burstConfetti = () => {
    const colors = ["#c03060", "#e8709a", "#c9a96e", "#e8cc9a", "#ffffff"];
    confetti({ particleCount: 200, spread: 85, origin: { y: 0.55 }, colors });
    setTimeout(() => confetti({ particleCount: 100, spread: 130, angle: 60,  origin: { y: 0.5, x: 0.1 }, colors }), 200);
    setTimeout(() => confetti({ particleCount: 100, spread: 130, angle: 120, origin: { y: 0.5, x: 0.9 }, colors }), 400);
  };

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: "#07050a", color: "#f5ede0" }}>

      <FloatingPetals />

      {/* ══ HERO ══════════════════════════════════════ */}
      <section ref={heroRef} className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        <StarField />

        {/* Radial ambient glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div style={{ position: "absolute", top: "20%", left: "50%", transform: "translate(-50%,-50%)", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle, rgba(192,48,96,0.12) 0%, transparent 70%)" }} />
          <div style={{ position: "absolute", bottom: "10%", right: "10%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(201,169,110,0.07) 0%, transparent 70%)" }} />
        </div>

        {/* Background portrait — Geraldine photo */}
        <motion.div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ y: heroY, opacity: heroOpacity }}>
          <img src="/FOTOS/2.png" alt="Geraldine Romero Mora"
            style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center center", opacity: 0.22, filter: "saturate(0.75) blur(0.5px)" }} />
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "linear-gradient(to top, #07050a 0%, rgba(7,5,10,0.4) 40%, rgba(7,5,10,0.1) 65%, #07050a 100%)" }} />
        </motion.div>

        {/* Hero content */}
        <motion.div className="relative z-10 flex flex-col items-center text-center px-4 pt-20"
          style={{ scale: nameScale }}
          initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, ease: "easeOut" }}>

          {/* Clinic badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3, duration: 0.6 }}
            className="flex items-center gap-2 border text-[9px] sm:text-[10px] uppercase tracking-[0.25em] sm:tracking-[0.3em] px-4 sm:px-5 py-2 rounded-full mb-6 md:mb-10"
            style={{ background: "rgba(192,48,96,0.08)", borderColor: "rgba(192,48,96,0.3)", color: "#e8709a" }}>
            <Crown className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span>Odonto Sonrisa Huaral — Para Ti</span>
            <Crown className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </motion.div>


          {/* Big script name */}
          <motion.h1
            className="text-[#fdf8f2] leading-none mb-1 mt-2"
            style={{ fontFamily: "'Great Vibes', cursive", fontSize: "clamp(3rem, 12vw, 6.5rem)", textShadow: "0 0 60px rgba(201,169,110,0.4)" }}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.9 }}>
            Geraldine
          </motion.h1>

          <motion.p
            className="font-['Cormorant_Garamond'] text-xl sm:text-2xl md:text-3xl font-light italic tracking-wider mb-2"
            style={{ color: "#c9a96e" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7, duration: 0.8 }}>
            Romero Mora
          </motion.p>

          <div className="ornament-line my-3 text-[#c9a96e]/50 text-sm mx-auto" style={{ width: 220 }}>
            <span>◆</span>
          </div>

          <motion.p className="text-[#857080] text-[10px] sm:text-[11px] uppercase tracking-[0.4em] sm:tracking-[0.5em] mb-8 md:mb-14"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
            Miss Aucallama
          </motion.p>

          {/* Stars row */}
          <motion.div className="flex items-center gap-1.5 mb-6 md:mb-8"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}>
            {[...Array(5)].map((_, i) => (
              <motion.div key={i} animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.2, 1] }}
                transition={{ duration: 2, delay: i * 0.25, repeat: Infinity }}>
                <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" style={{ color: "#c9a96e" }} />
              </motion.div>
            ))}
          </motion.div>

          {/* Scroll cue */}
          <motion.div className="flex flex-col items-center gap-1.5 mt-2"
            animate={{ y: [0, 6, 0], opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity }}>
            <span className="text-[#857080] text-[9px] uppercase tracking-[0.25em]">Tu regalo especial</span>
            <div style={{ width: 1, height: 36, background: "linear-gradient(to bottom, #c9a96e80, transparent)" }} />
          </motion.div>
        </motion.div>

        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 100, background: "linear-gradient(to top, #07050a, transparent)", pointerEvents: "none" }} />
      </section>

      {/* ══ STICKY HEADER ══════════════════════════════ */}
      <header style={{ position: "sticky", top: 0, zIndex: 40, background: "rgba(7,5,10,0.85)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(42,26,46,0.8)" }}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🦷</span>
            <span className="font-['Cormorant_Garamond'] text-xl font-light" style={{ color: "#fdf8f2" }}>
              Odonto<span style={{ color: "#c03060" }}>Sonrisa</span>
            </span>
          </div>
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest" style={{ color: "#c9a96e" }}>
            <Sparkles className="w-3.5 h-3.5 animate-sparkle" />
            <span className="hidden sm:inline">Descuento VIP — Geraldine Romero Mora</span>
            <span className="sm:hidden">Descuento VIP</span>
          </div>
        </div>
      </header>

      {/* ══ THANK YOU LETTER ═══════════════════════════ */}
      <section className="max-w-3xl mx-auto px-6 py-28">
        <motion.div
          initial={{ opacity: 0, y: 35 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1 }}
          className="relative"
        >
          {/* Outer gold glow ring */}
          <div className="absolute -inset-px rounded-[26px] pointer-events-none" style={{ background: "linear-gradient(135deg, rgba(201,169,110,0.25), transparent 40%, rgba(192,48,96,0.2) 100%)" }} />

          <div className="relative card-luxury gloss-card rounded-[24px] !overflow-visible">
            {/* Wax seal – top right */}
            <div className="absolute -top-6 -right-2 sm:-top-8 sm:-right-4 wax-seal z-10">
              <span style={{ fontSize: 22 }}>♛</span>
            </div>

            {/* Corner ornaments */}
            {["top-4 left-5", "top-4 right-5 rotate-180", "bottom-4 left-5 -rotate-90", "bottom-4 right-5 rotate-90"].map((pos) => (
              <div key={pos} className={`absolute ${pos} text-3xl select-none pointer-events-none hidden sm:block`} style={{ color: "rgba(201,169,110,0.15)" }}>❧</div>
            ))}

            <div className="p-6 sm:p-10 md:p-14">
              {/* Letter header */}
              <div className="text-center mb-10">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ background: "rgba(192,48,96,0.12)", border: "1px solid rgba(192,48,96,0.3)" }}>
                  <Heart className="w-5 h-5 fill-current" style={{ color: "#e8709a" }} />
                </div>
                <p className="text-[10px] uppercase tracking-[0.35em] mb-2 font-light" style={{ color: "#c9a96e" }}>Carta de Agradecimiento</p>
                <h2 className="font-['Cormorant_Garamond'] text-3xl sm:text-4xl md:text-5xl font-light italic" style={{ color: "#fdf8f2" }}>Para Nuestra Reina</h2>
                <OrnamentDivider icon="✦" />
              </div>

              {/* Body */}
              <div className="space-y-6 font-light leading-relaxed text-[14px] sm:text-[15px]" style={{ color: "rgba(245,237,224,0.8)" }}>
                <p><span className="font-['Cormorant_Garamond'] text-xl italic" style={{ color: "#fdf8f2" }}>Querida Geraldine Romero Mora,</span></p>
                <p>
                  Es un inmenso honor y una alegría genuina para todo el equipo de{" "}
                  <span className="font-medium" style={{ color: "#e8709a" }}>Odonto Sonrisa Huaral</span>{" "}
                  ser la clínica de confianza que cuida de tu sonrisa. Tu carisma, tu elegancia y tu belleza interior representan con orgullo a toda Aucallama.
                </p>
                <p>
                  Sabemos lo mucho que significa para una reina como tú lucir una sonrisa perfecta — en cada pasarela, en cada fotografía, en cada momento especial. Por eso, hemos preparado para ti un{" "}
                  <span className="font-medium" style={{ color: "#c9a96e" }}>descuentaso absolutamente exclusivo</span>{" "}
                  en tu tratamiento de ortodoncia, como expresión sincera de cuánto te admiramos y apreciamos.
                </p>

                {/* Highlighted quote */}
                <div className="relative my-6 py-6 px-4 sm:px-8 text-center rounded-2xl"
                  style={{ background: "linear-gradient(135deg, rgba(192,48,96,0.06), rgba(201,169,110,0.06))", border: "1px solid rgba(192,48,96,0.2)" }}>
                  <div className="absolute top-2 left-4 text-4xl select-none" style={{ color: "rgba(201,169,110,0.2)", fontFamily: "'Cormorant Garamond', serif" }}>"</div>
                  <p className="font-['Cormorant_Garamond'] text-lg sm:text-2xl md:text-3xl italic leading-snug" style={{ color: "#fdf8f2" }}>
                    Tu sonrisa es tu corona más valiosa —<br className="hidden md:block" />
                    ¡y nosotros te la cuidamos con amor!
                  </p>
                  <div className="flex items-center justify-center gap-1.5 mt-4">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" style={{ color: "#c9a96e" }} />)}
                  </div>
                  <div className="absolute bottom-2 right-4 text-4xl select-none" style={{ color: "rgba(201,169,110,0.2)", fontFamily: "'Cormorant Garamond', serif" }}>"</div>
                </div>

                <p>
                  Eres un ejemplo de gracia y dedicación, y nos sentimos muy felices de caminar junto a ti en este proceso que te acercará aún más a la sonrisa de tus sueños.
                </p>
              </div>

              {/* Signature */}
              <div className="mt-10 pt-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between text-center sm:text-left" style={{ borderTop: "1px solid rgba(42,26,46,0.8)" }}>
                <div>
                  <p className="text-xs font-light mb-1" style={{ color: "#857080" }}>Con inmenso cariño,</p>
                  <p className="text-3xl" style={{ fontFamily: "'Great Vibes', cursive", color: "#c9a96e" }}>El Equipo Odonto Sonrisa</p>
                </div>
                <div className="flex gap-1 justify-center sm:justify-start">
                  {[...Array(3)].map((_, i) => (
                    <motion.div key={i} animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, delay: i * 0.35, repeat: Infinity }}>
                      <Heart className="w-4 h-4 fill-current" style={{ color: "#c03060" }} />
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ══ PHOTO GALLERY ══════════════════════════════ */}
      <PhotoGallery />

      {/* ══ PRICING SECTION ════════════════════════════ */}
      <section className="relative py-28 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none" style={{ width: 900, height: 500, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(192,48,96,0.07) 0%, transparent 70%)", filter: "blur(20px)" }} />

        <motion.div className="text-center mb-16"
          initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
          <p className="text-[10px] uppercase tracking-[0.4em] mb-4 font-light" style={{ color: "#c9a96e" }}>Beneficio Exclusivo</p>
          <h2 className="font-['Cormorant_Garamond'] text-5xl md:text-6xl font-light" style={{ color: "#fdf8f2" }}>
            Tu <span className="animate-shimmer">Descuento Especial</span>
          </h2>
          <p className="font-light max-w-lg mx-auto mt-5 text-sm leading-relaxed" style={{ color: "#857080" }}>
            Geraldine, de un pago inicial de S/. 600, para ti es solo S/. 200.<br />
            <span style={{ color: "#c9a96e" }}>¡Un ahorro real de S/. 400 que mereces con todo nuestro corazón!</span>
          </p>
          <OrnamentDivider />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto mt-8 items-stretch">
          {[
            {
              icon: <Gem className="w-5 h-5" />, title: "Geraldine VIP", price: 200, original: 600,
              badge: "✦ Exclusivo Para Ti ✦", highlight: true,
              features: ["S/. 400 de descuento exclusivo", "Brackets metálicos autoligables", "Evaluación + radiografía inicial GRATIS", "Brackets Morelli brasileños", "Limpieza dental"],
              buttonLabel: "Reclamar mi descuento exclusivo",
              onAction: () => {
                burstConfetti();
                setCustomAlert({
                  title: "¡Beneficio Exclusivo Confirmado!",
                  message: "Geraldine, tu cupón de S/. 400 de descuento especial + S/. 30 de descuento adicional por cada control mensual ha sido reservado con éxito.\n\nHaz clic a continuación para enviar tu mensaje de reclamación directamente a nuestro WhatsApp oficial.",
                  actionText: "Enviar a WhatsApp",
                  onConfirm: () => {
                    const message = "Hola Odonto Sonrisa, quiero reclamar mi cupón especial de descuento de 400 soles + descuento de 30 soles adicional por control mensual.";
                    window.open(`https://wa.me/51986543449?text=${encodeURIComponent(message)}`, "_blank");
                  }
                });
              },
              delay: 0.15,
            },
            {
              icon: <Gift className="w-5 h-5" />, title: "Control Mensual VIP", price: 150, original: 180,
              features: ["Ahorra S/. 30 en cada control", "Ajuste y cambio de ligaduras a tu color", "Profilaxis en controles seleccionados", "Atención prioritaria con agenda preferencial", "Monitoreo por nuestro especialista principal"],
              buttonLabel: "Agendar control mensual",
              onAction: () => {
                setCustomAlert({
                  title: "Control Mensual VIP",
                  message: "Tu tarifa de control preferencial incluye:\n\n• Ahorro de S/. 30 en cada control mensual (S/. 150 en vez de S/. 180)\n• Ajuste y cambio de ligaduras a tu elección\n• Profilaxis dental en controles seleccionados\n• Agenda preferente y atención prioritaria\n\nHaz clic a continuación para agendar tu cita.",
                  actionText: "Agendar por WhatsApp",
                  onConfirm: () => {
                    const message = "Hola Odonto Sonrisa, quiero agendar mi cita de control mensual VIP con mi tarifa preferencial de S/. 150.";
                    window.open(`https://wa.me/51986543449?text=${encodeURIComponent(message)}`, "_blank");
                  }
                });
              },
              delay: 0.3,
            },
          ].map((card, i) => (
            <motion.div key={i} className="h-full"
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: card.delay }}>
              <PriceCard {...card} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══ WHY CHOOSE US ══════════════════════════════ */}
      <section className="py-24 px-6 max-w-5xl mx-auto">
        <motion.div className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
          <p className="text-[10px] uppercase tracking-[0.4em] mb-4 font-light" style={{ color: "#c9a96e" }}>Nuestra Promesa</p>
          <h2 className="font-['Cormorant_Garamond'] text-5xl font-light italic" style={{ color: "#fdf8f2" }}>
            ¿Por qué Geraldine nos elige?
          </h2>
          <OrnamentDivider />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: <Gem className="w-6 h-6" />, title: "Tratamientos Estéticos VIP", desc: "Brackets e insumos de última generación que garantizan resultados rápidos, estéticos y sin molestias." },
            { icon: <Heart className="w-6 h-6 fill-current" />, title: "Especialistas de Confianza", desc: "Odontólogos calificados que brindan atención cálida, profesional y personalizada en cada visita." },
            { icon: <MapPin className="w-6 h-6" />, title: "Clínica en Huaral", desc: "Ambientes modernos, cómodos y bioseguros ubicados estratégicamente en Huaral para tu comodidad." },
          ].map((item, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.15 }}
              whileHover={{ y: -6, scale: 1.01 }} className="card-luxury p-7 group">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform"
                style={{ background: "rgba(192,48,96,0.1)", border: "1px solid rgba(192,48,96,0.2)", color: "#e8709a" }}>
                {item.icon}
              </div>
              <h3 className="font-['Cormorant_Garamond'] text-xl italic mb-2" style={{ color: "#fdf8f2" }}>{item.title}</h3>
              <p className="font-light text-sm leading-relaxed" style={{ color: "#857080" }}>{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══ FOOTER ═════════════════════════════════════ */}
      <footer style={{ borderTop: "1px solid #2a1a2e", background: "#100c14" }} className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🦷</span>
                <span className="font-['Cormorant_Garamond'] text-2xl font-light" style={{ color: "#fdf8f2" }}>
                  Odonto<span style={{ color: "#c03060" }}>Sonrisa</span>
                </span>
              </div>
              <p className="font-light text-sm leading-relaxed" style={{ color: "#857080" }}>
                Cuidamos tu sonrisa y tu salud bucal con el cariño de toda una familia. Huaral, Perú.
              </p>
            </div>
            <div>
              <h4 className="font-['Cormorant_Garamond'] text-lg italic mb-4" style={{ color: "#fdf8f2" }}>Contacto y Citas</h4>
              <ul className="space-y-3 font-light text-sm" style={{ color: "#857080" }}>
                <li className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 shrink-0" style={{ color: "#c9a96e" }} />
                  <a href="tel:986543449" className="hover:text-[#c9a96e] transition-colors">986 543 449</a>
                </li>
                <li className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 shrink-0" style={{ color: "#c03060" }} />
                  <a href="https://maps.google.com/?q=Pje.Animas+155,+Huaral,+Peru,+15201" target="_blank" rel="noopener noreferrer" className="hover:text-[#e8709a] transition-colors leading-snug">
                    Pje. Animas 155, Huaral, Perú, 15201
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-['Cormorant_Garamond'] text-lg italic mb-4" style={{ color: "#fdf8f2" }}>Horario de Atención</h4>
              <p className="font-light text-sm leading-relaxed" style={{ color: "#857080" }}>
                Lunes a Sábado<br />9:00 AM – 8:00 PM<br />
                <span className="text-xs" style={{ color: "rgba(201,169,110,0.7)" }}>Atención previa cita programada</span>
              </p>
            </div>
          </div>

          <div className="pt-8 text-center" style={{ borderTop: "1px solid #2a1a2e" }}>
            <div className="flex items-center justify-center gap-2 mb-3">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-current" style={{ color: "#c9a96e" }} />)}
            </div>
            <p className="font-light text-xs" style={{ color: "#857080" }}>
              © 2026 Odonto Sonrisa Huaral · Hecho con{" "}
              <Heart className="w-3 h-3 fill-current inline" style={{ color: "#c03060" }} />{" "}
              para <span className="font-medium" style={{ color: "#c9a96e" }}>Geraldine Romero Mora, Miss Aucallama 👑</span>
            </p>
          </div>
        </div>
      </footer>

      {/* Custom Alert Modal */}
      <AnimatePresence>
        {customAlert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={() => setCustomAlert(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="relative max-w-md w-full card-luxury gloss-card p-8 flex flex-col items-center text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setCustomAlert(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#18101c] border border-[#2a1a2e] flex items-center justify-center hover:bg-[#c03060]/20 transition-colors z-10 cursor-pointer"
              >
                <X className="w-4 h-4 text-[#f5ede0]" />
              </button>

              <div className="w-12 h-12 rounded-full flex items-center justify-center mb-5"
                style={{ background: "rgba(201,169,110,0.12)", border: "1px solid rgba(201,169,110,0.3)" }}>
                <Sparkles className="w-5 h-5 text-[#c9a96e] animate-pulse" />
              </div>

              <h3 className="font-['Cormorant_Garamond'] text-3xl text-[#fdf8f2] mb-3 italic">
                {customAlert.title}
              </h3>
              
              <p className="text-sm font-light leading-relaxed text-[#857080] mb-8 whitespace-pre-line">
                {customAlert.message}
              </p>

              <button
                onClick={() => {
                  if (customAlert.onConfirm) {
                    customAlert.onConfirm();
                  }
                  setCustomAlert(null);
                }}
                className="btn-royal btn-gold w-full justify-center text-xs"
              >
                {customAlert.actionText || "Aceptar"}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
