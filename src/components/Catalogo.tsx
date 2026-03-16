import { ShieldCheck, Zap } from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import ModelCard from './ModelCard';

type Model = {
  id: number;
  size: number;
  dim: string;
  type: string;
  name: string;
  price: string;
  hab: number;
  bath: number;
  floors: number;
  category: string;
  img: string;
};

type CatalogoProps = {
  models: Model[];
  filteredModels: Model[];
  activeFilter: string;
  setActiveFilter: (value: string) => void;
  scrollTo: (id: string) => void;
};

const Catalogo = ({
  models,
  filteredModels,
  activeFilter,
  setActiveFilter,
  scrollTo
}: CatalogoProps) => {
  const roomToSizes: Record<string, number[]> = {
    '2': [36, 42],
    '3': [48, 54, 63],
    '4': [72, 100]
  };

  const visibleModels =
    activeFilter === 'TODOS'
      ? models
      : models.filter((model) => roomToSizes[activeFilter]?.includes(model.size));

  return (
    <section id="catalogo" className="py-24 bg-[#1a1a1a] text-white">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-2xl">
            <span className="text-brand font-black uppercase tracking-[0.3em] text-xs mb-4 block">Catálogo de Modelos</span>
            <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter leading-none">
              CASAS PARA <br />
              <span className="text-brand">CADA FAMILIA.</span>
            </h2>
            <p className="text-slate-400 text-lg">
              Desde 36 m² hasta 100 m². Concreto prefabricado o acero galvanizado. Medidas estándar o a tu gusto. Todos los modelos certificados NSR-10.
            </p>
            <div className="flex flex-wrap gap-4 mt-8">
              <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-full flex items-center gap-2">
                <ShieldCheck size={14} className="text-brand" />
                <span className="text-[10px] font-bold uppercase tracking-widest">NSR-10 / LEY 400/2010</span>
              </div>
              <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-full flex items-center gap-2">
                <ShieldCheck size={14} className="text-brand" />
                <span className="text-[10px] font-bold uppercase tracking-widest">SISMO-RESISTENTE</span>
              </div>
              <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-full flex items-center gap-2">
                <ShieldCheck size={14} className="text-brand" />
                <span className="text-[10px] font-bold uppercase tracking-widest">+30 AÑOS DE SISTEMA</span>
              </div>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl text-center min-w-[120px]">
              <span className="block text-3xl font-black text-brand mb-1">{models.length}</span>
              <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-500">Modelos</span>
            </div>
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl text-center min-w-[120px]">
              <span className="block text-3xl font-black text-brand mb-1">30d</span>
              <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-500">Entrega</span>
            </div>
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl text-center min-w-[120px]">
              <span className="block text-3xl font-black text-brand mb-1">$12.6M</span>
              <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-500">Desde COP</span>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 border-y border-white/10 py-6 gap-6">
          <div className="flex items-center gap-4 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 whitespace-nowrap">Habitaciones:</span>
            {['TODOS', '2 HAB.', '3 HAB.', '4 HAB.'].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter.split(' ')[0])}
                className={`px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
                  activeFilter === filter.split(' ')[0]
                    ? 'bg-brand text-dark'
                    : 'bg-white/5 text-white hover:bg-white/10'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{visibleModels.length} modelos encontrados</span>
            <button
              onClick={() => scrollTo('cotizador-seccion')}
              className="bg-brand text-dark px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform"
            >
              Cotizar
            </button>
          </div>
        </div>

        {/* Grid de Modelos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {visibleModels.map((model) => (
              <ModelCard
                key={model.id}
                model={model}
                onQuote={() =>
                  document.getElementById('cotizador')?.scrollIntoView({
                    behavior: 'smooth'
                  })
                }
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Banner Medida Personalizada */}
        <div className="mt-16 bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-brand/10 rounded-2xl flex items-center justify-center text-brand">
              <Zap size={32} />
            </div>
            <div>
              <h4 className="text-xl font-black uppercase tracking-tight mb-2">¿No encuentras el tamaño ideal?</h4>
              <p className="text-slate-400 text-sm">"Diseñamos las medidas a su gusto." Contáctanos y construimos tu casa con las dimensiones exactas.</p>
            </div>
          </div>
          <button
            onClick={() =>
              document.getElementById('cotizador')?.scrollIntoView({
                behavior: 'smooth'
              })
            }
            className="bg-brand text-dark px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:scale-105 transition-transform w-full md:w-auto"
          >
            Diseñar casa personalizada
          </button>
        </div>
      </div>
    </section>
  );
};

export default Catalogo;
