import { Button } from "@/components/ui/button";
import { Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export interface PricingTier {
    name: string;
    icon: React.ReactNode;
    price: number | string;
    originalPrice?: number | string;
    description: string;
    features: string[];
    popular?: boolean;
    color: "mint" | "pink" | "teal" | "cream" | "rose";
    buttonText: string;
    onButtonClick?: () => void;
}

function CreativePricing({
    tag = "Beneficios de Ortodoncia",
    title = "Tu Sonrisa de Reina",
    description = "Un plan de descuento exclusivo en brackets diseñado especialmente para ti, Miss Aucallama",
    tiers,
}: {
    tag?: string;
    title?: string;
    description?: string;
    tiers: PricingTier[];
}) {
    // Map colors to soft gradients for luxury card backgrounds
    const bgStyles = {
        mint: "bg-gradient-to-b from-[#f0f9f9] to-white border-[#C8EDED]",
        pink: "bg-gradient-to-b from-[#fff6f9] to-white border-[#FDD4E3]",
        teal: "bg-gradient-to-b from-[#f2f7f7] to-white border-[#80B0AA]/40",
        cream: "bg-gradient-to-b from-[#fdfbf6] to-white border-[#F9EAC1]",
        rose: "bg-gradient-to-b from-[#fff2f6] to-white border-brand-rose/40 ring-1 ring-brand-rose/20",
    };


    return (
        <div className="w-full max-w-6xl mx-auto px-4 py-8 relative">
            
            {/* Elegant Background Blobs */}
            <div className="absolute -z-10 inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/10 w-96 h-96 rounded-full bg-brand-pink/15 blur-3xl" />
                <div className="absolute bottom-1/4 right-1/10 w-96 h-96 rounded-full bg-brand-mint/15 blur-3xl" />
            </div>

            <div className="text-center space-y-4 mb-16">
                <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="font-handwritten text-3xl text-brand-teal tracking-wide font-medium"
                >
                    {tag}
                </motion.div>
                
                <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="relative inline-block"
                >
                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-zinc-900 tracking-tight px-6 py-2">
                        {title}
                    </h2>
                    <div className="w-24 h-0.5 bg-gradient-to-r from-brand-rose via-brand-gold to-brand-teal mx-auto mt-2 rounded-full" />
                </motion.div>
                
                <motion.p 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="max-w-xl mx-auto text-md text-zinc-500 font-sans mt-4 font-light leading-relaxed"
                >
                    {description}
                </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
                {tiers.map((tier, index) => {
                    const isVip = tier.popular;
                    
                    return (
                        <motion.div
                            key={tier.name}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.15 }}
                            whileHover={{ y: -8 }}
                            className={cn(
                                "relative flex flex-col justify-between rounded-3xl p-8 transition-all duration-300",
                                "bg-white border shadow-md hover:shadow-2xl",
                                isVip 
                                    ? "shadow-brand-rose/10 border-brand-rose/30 bg-gradient-to-b from-[#fff6f9] to-white md:scale-[1.03] z-10" 
                                    : "border-zinc-200/80 shadow-zinc-200/50",
                                bgStyles[tier.color]
                            )}
                        >
                            {/* VIP Card Glow effect */}
                            {isVip && (
                                <div className="absolute inset-0 bg-gradient-to-tr from-brand-pink/10 to-brand-mint/5 rounded-3xl pointer-events-none" />
                            )}

                            <div>
                                {/* VIP Header Badge */}
                                {isVip && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-brand-gold to-[#f0c84c] text-zinc-950 font-serif font-semibold text-xs tracking-wider uppercase px-5 py-1.5 rounded-full border border-white shadow-md flex items-center gap-1">
                                        <Sparkles className="w-3.5 h-3.5 fill-current text-zinc-950" />
                                        Miss Gerald VIP
                                    </div>
                                )}

                                <div className="mb-6">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-serif text-2xl font-bold text-zinc-900">
                                            {tier.name}
                                        </h3>
                                        
                                        {/* Icon Container */}
                                        <div className={cn(
                                            "w-10 h-10 rounded-full flex items-center justify-center border border-current",
                                            isVip ? "text-brand-rose bg-white" : "text-brand-teal bg-white"
                                        )}>
                                            {tier.icon}
                                        </div>
                                    </div>
                                    <p className="text-xs text-zinc-500 font-light mt-2 min-h-10 leading-relaxed">
                                        {tier.description}
                                    </p>
                                </div>

                                {/* Divider line */}
                                <div className="h-[1px] w-full bg-zinc-100 my-4" />

                                {/* Pricing Section */}
                                <div className="my-6">
                                    {tier.originalPrice && (
                                        <div className="text-zinc-400 line-through font-sans text-sm font-light">
                                            Antes S/. {tier.originalPrice}
                                        </div>
                                    )}
                                    <div className="flex items-baseline mt-1">
                                        <span className="text-5xl font-serif font-extrabold text-zinc-900 tracking-tight">
                                            {typeof tier.price === 'number' ? `S/. ${tier.price}` : tier.price}
                                        </span>
                                        {typeof tier.price === 'number' && (
                                            <span className="text-xs font-light text-zinc-400 ml-1.5">
                                                (inicial)
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Features List */}
                                <div className="space-y-4 mb-8">
                                    {tier.features.map((feature, fIdx) => (
                                        <div
                                            key={fIdx}
                                            className="flex items-start gap-3 text-sm text-zinc-600 font-sans"
                                        >
                                            <div className="mt-0.5 shrink-0">
                                                <Check className={cn(
                                                    "w-4 h-4 stroke-[2.5]",
                                                    isVip ? "text-brand-rose" : "text-brand-teal"
                                                )} />
                                            </div>
                                            <span className="leading-tight font-light">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Button */}
                            <Button
                                onClick={tier.onButtonClick}
                                className={cn(
                                    "w-full h-12 text-sm font-medium tracking-wide rounded-full cursor-pointer transition-all duration-300",
                                    isVip
                                        ? "bg-gradient-to-r from-brand-rose to-brand-pink text-white hover:opacity-95 hover:shadow-lg hover:shadow-brand-rose/25"
                                        : "bg-white hover:bg-zinc-50 text-zinc-800 border border-zinc-200/80 hover:border-zinc-300 shadow-sm"
                                )}
                            >
                                {tier.buttonText}
                            </Button>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}

export { CreativePricing };
