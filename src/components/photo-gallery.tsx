import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";

interface PhotoItem {
    id: number;
    src: string;
    caption: string;
    description: string;
    rotation: string;
}

export default function PhotoGallery() {
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const photos: PhotoItem[] = [
        {
            id: 1,
            src: "/FOTOS/1.png",
            caption: "Sonrisa Radiante",
            description: "Reflejando la belleza y la frescura natural de Gerald.",
            rotation: "md:rotate-[-1deg]",
        },
        {
            id: 3,
            src: "/FOTOS/3.png",
            caption: "Elegancia de Reina",
            description: "La armonía perfecta en cada visita a nuestra clínica.",
            rotation: "md:rotate-[1deg]",
        },
        {
            id: 4,
            src: "/FOTOS/4.png",
            caption: "Miss Aucallama",
            description: "Representando con orgullo la salud y la belleza de su tierra.",
            rotation: "md:rotate-[-0.5deg]",
        },
        {
            id: 5,
            src: "/FOTOS/5.png",
            caption: "Cuidado de Estrellas",
            description: "Cuidando cada detalle para que su sonrisa siga brillando.",
            rotation: "md:rotate-[0.5deg]",
        },
    ];

    const selectedPhoto = photos.find((p) => p.id === selectedId);

    const navigate = (direction: "prev" | "next") => {
        if (selectedId === null) return;
        const currentIndex = photos.findIndex((p) => p.id === selectedId);
        let nextIndex = direction === "next" ? currentIndex + 1 : currentIndex - 1;
        if (nextIndex >= photos.length) nextIndex = 0;
        if (nextIndex < 0) nextIndex = photos.length - 1;
        setSelectedId(photos[nextIndex].id);
    };

    return (
        <div className="w-full py-12 relative">
            <div className="text-center mb-12">
                <h3 className="font-serif text-3xl text-zinc-900 font-bold mb-2 tracking-tight">
                    Nuestra Galería de Recuerdos
                </h3>
                <p className="text-zinc-500 max-w-lg mx-auto text-sm font-light">
                    Haz clic en cualquier fotografía para verla en tamaño completo y disfrutar de su brillo.
                </p>
                <div className="w-16 h-[1px] bg-brand-rose mx-auto mt-4" />
            </div>

            {/* Photo Grid Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto px-6">
                {photos.map((photo, index) => (
                    <motion.div
                        key={photo.id}
                        layoutId={`polaroid-container-${photo.id}`}
                        onClick={() => setSelectedId(photo.id)}
                        className={cn(
                            "cursor-pointer bg-white p-3 rounded-2xl border border-zinc-100 shadow-lg",
                            "transition-all duration-300 hover:shadow-2xl hover:shadow-brand-pink/20",
                            photo.rotation
                        )}
                        initial={{ opacity: 0, y: 30, scale: 0.96 }}
                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        whileHover={{ 
                            y: -8, 
                            rotate: 0, 
                            scale: 1.02,
                            transition: { duration: 0.2 } 
                        }}
                    >
                        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-zinc-50 group border border-zinc-50">
                            <img
                                src={photo.src}
                                alt={photo.caption}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
                                onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                    const parent = e.currentTarget.parentElement;
                                    if (parent) {
                                        const placeholder = parent.querySelector(".fallback-photo");
                                        if (placeholder) placeholder.classList.remove("hidden");
                                    }
                                }}
                            />
                            
                            {/* Fallback layout if photo is not copied yet */}
                            <div className="fallback-photo hidden absolute inset-0 flex flex-col items-center justify-center bg-zinc-100 text-zinc-400 p-4 text-center">
                                <span className="text-3xl mb-2">📸</span>
                                <span className="text-xs font-mono">Copia FOTOS/{photo.src.split("/").pop()}</span>
                            </div>

                            {/* Magnifying Glass Indicator on Hover */}
                            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                                <div className="bg-white/90 p-2.5 rounded-full shadow-lg border border-zinc-100">
                                    <ZoomIn className="w-4.5 h-4.5 text-zinc-800" />
                                </div>
                            </div>
                        </div>

                        {/* Elegantly styled caption */}
                        <div className="mt-4 text-center select-none pb-2">
                            <h4 className="font-serif text-lg font-bold text-zinc-800 leading-tight">
                                {photo.caption}
                            </h4>
                            <p className="text-xs text-zinc-400 font-sans mt-1 font-light">
                                {photo.description}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Lightbox Modal with AnimatePresence */}
            <AnimatePresence>
                {selectedId !== null && selectedPhoto && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-zinc-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setSelectedId(null)}
                    >
                        {/* Prevent clicks on content from closing modal */}
                        <motion.div
                            initial={{ scale: 0.95, y: 10 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 10 }}
                            transition={{ type: "spring", damping: 28, stiffness: 220 }}
                            className="relative max-w-lg w-full bg-white border border-zinc-100 rounded-3xl p-4 md:p-6 shadow-2xl shadow-brand-rose/10 flex flex-col items-center"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setSelectedId(null)}
                                className="absolute -top-3 -right-3 bg-white hover:bg-zinc-100 text-zinc-800 p-2 rounded-full border border-zinc-100 shadow-md cursor-pointer transition-colors z-10"
                            >
                                <X className="w-4 h-4 stroke-[2]" />
                            </button>

                            {/* Navigation Buttons */}
                            <button
                                onClick={() => navigate("prev")}
                                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2.5 rounded-full border border-zinc-100 shadow-md cursor-pointer z-10 hover:scale-105 transition-transform"
                            >
                                <ChevronLeft className="w-5 h-5 text-zinc-800 stroke-[2]" />
                            </button>

                            <button
                                onClick={() => navigate("next")}
                                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2.5 rounded-full border border-zinc-100 shadow-md cursor-pointer z-10 hover:scale-105 transition-transform"
                            >
                                <ChevronRight className="w-5 h-5 text-zinc-800 stroke-[2]" />
                            </button>

                            {/* Image Container */}
                            <div className="relative w-full h-[60vh] rounded-2xl bg-transparent mb-4 flex items-center justify-center">
                                <img
                                    src={selectedPhoto.src}
                                    alt={selectedPhoto.caption}
                                    className="max-w-full max-h-full object-contain rounded-2xl shadow-sm border border-zinc-100/30 mx-auto block"
                                    onError={(e) => {
                                        e.currentTarget.style.display = "none";
                                        const parent = e.currentTarget.parentElement;
                                        if (parent) {
                                            const fb = parent.querySelector(".lightbox-fallback");
                                            if (fb) fb.classList.remove("hidden");
                                        }
                                    }}
                                />
                                <div className="lightbox-fallback hidden text-center p-6 text-zinc-400 font-sans">
                                    <span className="text-4xl block mb-2">📸</span>
                                    <p className="font-semibold text-zinc-700">FOTOS/{selectedPhoto.src.split("/").pop()}</p>
                                    <p className="text-xs mt-1">Cópiala en public/FOTOS/ para visualizarla.</p>
                                </div>
                            </div>

                            {/* Caption text */}
                            <div className="text-center w-full">
                                <h3 className="font-serif text-2xl font-bold text-zinc-900">
                                    {selectedPhoto.caption}
                                </h3>
                                <p className="text-zinc-500 max-w-md mx-auto text-xs mt-1 font-light">
                                    {selectedPhoto.description}
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
