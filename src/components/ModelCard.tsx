import React from 'react';
import { ArrowRight, Bed, Bath, Layers } from 'lucide-react';
import { motion } from 'motion/react';

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

interface ModelCardProps {
  model: Model;
  onQuote: () => void;
}

const ModelCard: React.FC<ModelCardProps> = ({ model, onQuote }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="group bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:border-brand/50 transition-all"
    >
      <div className="relative h-80 overflow-hidden">
        <img 
          src={model.img} 
          alt={model.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          referrerPolicy="no-referrer"
          onError={(e) => {
            // Fallback to local asset to avoid external dependency
            (e.target as HTMLImageElement).src = '/images/modelos/casa65m2.webp';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
          <div>
            <span className="text-4xl font-black text-white tracking-tighter">{model.size} m²</span>
          </div>
          <div className="text-right">
            <span className="block text-[10px] font-bold text-white/60 uppercase tracking-widest">{model.dim}</span>
          </div>
        </div>
      </div>
      <div className="p-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <span className="block text-[10px] font-bold text-brand uppercase tracking-widest mb-1">{model.type}</span>
            <h3 className="text-xl font-black uppercase tracking-tight">{model.name}</h3>
          </div>
          <div className="text-right">
            <span className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Desde</span>
            <span className="text-xl font-black text-brand">${model.price}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white/5 p-3 rounded-xl text-center">
            <Bed size={16} className="mx-auto mb-2 text-brand" />
            <span className="block text-lg font-black leading-none">{model.hab}</span>
            <span className="text-[8px] font-bold uppercase tracking-widest text-white/40">Hab.</span>
          </div>
          <div className="bg-white/5 p-3 rounded-xl text-center">
            <Bath size={16} className="mx-auto mb-2 text-brand" />
            <span className="block text-lg font-black leading-none">{model.bath}</span>
            <span className="text-[8px] font-bold uppercase tracking-widest text-white/40">Baños</span>
          </div>
          <div className="bg-white/5 p-3 rounded-xl text-center">
            <Layers size={16} className="mx-auto mb-2 text-brand" />
            <span className="block text-lg font-black leading-none">{model.floors}</span>
            <span className="text-[8px] font-bold uppercase tracking-widest text-white/40">Pisos</span>
          </div>
        </div>

        <button 
          onClick={onQuote}
          className="w-full bg-brand text-dark py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-white transition-colors"
        >
          Cotizar este modelo <ArrowRight size={14} />
        </button>
      </div>
    </motion.div>
  );
};

export default ModelCard;
