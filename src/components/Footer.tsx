import { Instagram, Facebook, Phone, Mail, MapPin } from 'lucide-react';
import { ASSETS } from '../assets';

type FooterProps = {
  scrollTo: (id: string) => void;
};

const Footer = ({ scrollTo }: FooterProps) => {
  return (
    <footer className="bg-dark py-20 px-6 border-t border-white/5">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
        <div className="md:col-span-2">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-20 flex items-center justify-center overflow-hidden">
              <img src={ASSETS.logo} alt="Logo Vive Tu Hogar" className="h-20 md:h-24 lg:h-28 w-auto object-contain" referrerPolicy="no-referrer" />
            </div>
            <div className="leading-none">
              <span className="block text-lg font-black tracking-tighter uppercase text-white">Vive Tu Hogar</span>
              <span className="block text-[10px] font-bold text-brand uppercase tracking-widest">Casas Prefabricadas</span>
            </div>
          </div>
          <p className="text-slate-500 max-w-sm text-sm leading-relaxed mb-8">
            Diseñamos tu casa, construimos tus sueños. Líderes en construcción prefabricada de alta calidad en Colombia.
          </p>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 border border-white/10 flex items-center justify-center rounded-full hover:bg-brand hover:text-dark transition-all"><Instagram size={18} /></a>
            <a href="#" className="w-10 h-10 border border-white/10 flex items-center justify-center rounded-full hover:bg-brand hover:text-dark transition-all"><Facebook size={18} /></a>
            <a href="https://www.tiktok.com/@clickcasas?is_from_webapp=1&sender_device=pc" target="_blank" rel="noopener noreferrer" className="w-10 h-10 border border-white/10 flex items-center justify-center rounded-full hover:bg-brand hover:text-dark transition-all">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
              </svg>
            </a>
          </div>
        </div>
        <div>
          <h4 className="text-xs font-black uppercase tracking-widest mb-8">Navegación</h4>
          <ul className="flex flex-col gap-4">
            {['Inicio', 'Catálogo', 'Cotizador', 'Proyectos'].map(item => (
              <li key={item}>
                <button onClick={() => scrollTo(item === 'Catálogo' ? 'modelos-destacados' : item === 'Cotizador' ? 'cotizador-seccion' : item)} className="text-xs font-bold text-slate-500 hover:text-brand uppercase tracking-widest transition-colors">{item}</button>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-black uppercase tracking-widest mb-8">Contacto</h4>
          <ul className="flex flex-col gap-4">
            <li className="flex items-center gap-3 text-xs font-bold text-slate-500 uppercase tracking-widest">
              <Phone size={14} className="text-brand" /> 
              <a href="tel:+573183767228" className="hover:text-brand transition-colors">3183767228</a>
            </li>
            <li className="flex items-center gap-3 text-xs font-bold text-slate-500 uppercase tracking-widest">
              <Mail size={14} className="text-brand" /> vivetuhogar.crm@gmail.com
            </li>
            <li className="flex items-center gap-3 text-xs font-bold text-slate-500 uppercase tracking-widest">
              <MapPin size={14} className="text-brand" /> Bogotá, Colombia
            </li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-[10px] font-bold uppercase tracking-widest text-slate-600">
          © 2026 Vive Tu Hogar Casas Prefabricadas. Bogotá, Colombia.
        </div>
        <div className="flex gap-8">
          <a href="#" className="text-[10px] font-bold uppercase tracking-widest text-slate-600 hover:text-white transition-colors">Privacidad</a>
          <a href="#" className="text-[10px] font-bold uppercase tracking-widest text-slate-600 hover:text-white transition-colors">Términos</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
