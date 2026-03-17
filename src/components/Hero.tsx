import { ArrowRight, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

type HeroProps = {
  handleWhatsApp: (msg?: string) => void;
  scrollTo: (id: string) => void;
};

const Hero = ({ handleWhatsApp, scrollTo }: HeroProps) => {
  return (
    <section id="inicio" className="relative min-h-[70vh] md:min-h-screen flex items-center mt-6 md:mt-0 lg:mt-0 pt-16 md:pt-24 lg:pt-32 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://picsum.photos/seed/house-modern/1920/1080" 
          alt="Hero Background" 
          className="w-full h-full object-cover opacity-40"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-dark via-dark/80 to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="h-[1px] w-8 bg-brand"></div>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand">Bogotá, Colombia — Est. 2020</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black leading-[0.9] tracking-tighter uppercase mb-8">
            Construye <br />
            <span className="text-brand">Tu Hogar</span> <br />
            En 30 Días.
          </h1>
          <p className="text-slate-400 max-w-md text-lg mb-10 leading-relaxed">
            Casas prefabricadas modernas, eficientes y sismo-resistentes (NSR-10), adaptadas al clima y estilo de vida colombiano. Desde $12.600.000 COP.
          </p>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() =>
                document.getElementById("cotizador-seccion")?.scrollIntoView({ behavior: "smooth" })
              }
              className="bg-brand text-dark px-8 py-4 rounded-sm font-black uppercase tracking-widest flex items-center gap-3 hover:bg-white transition-colors"
            >
              Cotiza tu casa <ArrowRight size={18} />
            </button>
            <button 
              onClick={() => scrollTo('modelos-destacados')}
              className="border border-white/20 text-white px-8 py-4 rounded-sm font-black uppercase tracking-widest hover:bg-white hover:text-dark transition-colors"
            >
              Ver Catálogo
            </button>
          </div>
          <div className="mt-12 flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">
            <ShieldCheck size={14} className="text-brand" />
            Certificado NSR-10 / Ley 400/2010 • Sistema Probado +30 años en Colombia
          </div>
        </motion.div>

        <div className="hidden md:block relative">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="relative aspect-square"
          >
            {/* Floating Cards */}
            <div className="absolute top-10 right-0 bg-card/80 backdrop-blur-md p-6 border border-white/10 rounded-sm z-20 shadow-2xl">
              <div className="text-brand font-black text-2xl mb-1">30 días</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Tiempo de entrega</div>
            </div>
            <div className="absolute bottom-20 -left-10 bg-card/80 backdrop-blur-md p-6 border border-white/10 rounded-sm z-20 shadow-2xl">
              <div className="text-brand font-black text-2xl mb-1">$12.6M</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Desde COP</div>
            </div>
            <div className="absolute top-1/2 -right-4 bg-brand p-6 rounded-sm z-20 shadow-2xl">
              <div className="text-dark font-black text-2xl mb-1">NSR-10</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-dark/60">Sismo-resistente</div>
            </div>

            <img 
              src="https://picsum.photos/seed/house-render/800/800" 
              alt="House Render" 
              className="w-full h-full object-cover rounded-sm grayscale hover:grayscale-0 transition-all duration-700"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
