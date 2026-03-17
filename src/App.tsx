import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  ShieldCheck, 
  Leaf, 
  Menu, 
  X,
  Home,
  Clock,
  Zap,
  CheckCircle2,
  Settings,
  Maximize
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ASSETS } from './assets';
import Hero from './components/Hero';
import Catalogo from './components/Catalogo';
import Footer from './components/Footer';

const WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbwMhXAgo9e4iJehJitW8GImfnHmhCch2V0rM5p3Wy44Oj0Jyx6ZH7bv1tVrEUeJj09k/exec";

const AutomaticQuoter = ({ handleWhatsApp }: { handleWhatsApp: (msg?: string) => void }) => {
  const SIZE_OPTIONS = [36, 42, 48, 54, 63, 72, 100];
  const [sizeIndex, setSizeIndex] = useState(0);
  const meters = SIZE_OPTIONS[sizeIndex];
  const [floors, setFloors] = useState(1);
  const [rooms, setRooms] = useState(2);
  const [bathrooms, setBathrooms] = useState(1);
  const [material, setMaterial] = useState('concreto');
  const [extras, setExtras] = useState({
    terraza: false,
    garaje: false,
    acabados: false,
    cocina: false
  });
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    city: ''
  });

  const allowedRoomsBySize: Record<number, number[]> = {
    36: [1, 2],
    42: [2],
    48: [2, 3],
    54: [3],
    63: [3],
    72: [3, 4],
    100: [4]
  };
  const allowedRooms = allowedRoomsBySize[meters] ?? [2];

  useEffect(() => {
    if (!allowedRooms.includes(rooms)) {
      setRooms(allowedRooms[0]);
    }
  }, [meters, rooms, allowedRooms]);

  const basePrices: Record<number, number> = {
    36: 12600000,
    42: 14700000,
    48: 16800000,
    54: 18900000,
    63: 22000000,
    72: 25200000,
    100: 35000000
  };
  const basePrice = basePrices[meters] ?? 0;
  const floorMultiplier = floors === 2 ? 1.35 : 1;
  const materialMultiplier = material === 'acero' ? 1.08 : 1;
  const baseWithMultipliers = basePrice * floorMultiplier * materialMultiplier;
  const bathroomsExtra = Math.max(0, bathrooms - 1) * 3000000;
  const extrasPrice = 
    (extras.terraza ? 2500000 : 0) +
    (extras.garaje ? 3500000 : 0) +
    (extras.acabados ? 5000000 : 0) +
    (extras.cocina ? 2000000 : 0);
  
  const totalPrice = baseWithMultipliers + bathroomsExtra;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(price);
  };

  const sanitize = (str: string) => {
    return str
      .replace(/<[^>]*>?/gm, '')
      .replace(/[\u0000-\u001F\u007F]/g, '')
      .trim();
  };

  const validateInputs = (data: { name: string; whatsapp: string; email: string; city: string }) => {
    const name = sanitize(data.name);
    const whatsapp = sanitize(data.whatsapp);
    const email = sanitize(data.email);
    const city = sanitize(data.city);

    if (!name || name.length > 80) return false;
    if (!/^\d{10,15}$/.test(whatsapp)) return false;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return false;
    if (!city || city.length > 60) return false;
    return true;
  };

  const materialLabel = material === 'concreto' ? 'Concreto Prefabricado' : 'Acero Galvanizado';
  const buildWhatsAppMessage = () => {
    return `Hola, quiero cotizar una casa prefabricada.

Área: ${meters} m²
Pisos: ${floors}
Habitaciones: ${rooms}
Baños: ${bathrooms}
Material: ${materialLabel}

Precio estimado: ${formatPrice(totalPrice)}

Estoy interesado en recibir más información.`;
  };

  const isFormValid = () => {
    return Boolean(
      formData.name.trim() &&
      formData.phone.trim() &&
      formData.email.trim() &&
      formData.city.trim()
    );
  };

  const saveQuote = async () => {
    try {
      const payload = {
        token: "vive-tu-hogar-2026",
        name: sanitize(formData.name),
        whatsapp: sanitize(formData.phone),
        email: sanitize(formData.email),
        city: sanitize(formData.city),
        m2: meters,
        floors,
        rooms,
        bathrooms,
        material,
        price: totalPrice
      };
      await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain;charset=utf-8"
        },
        body: JSON.stringify(payload)
      });
      return true;
    } catch (error) {
      console.error("Error guardando cotización", error);
      return false;
    }
  };

  const resetQuote = () => {
    setFormData({
      name: '',
      phone: '',
      email: '',
      city: ''
    });
    setSizeIndex(0);
    setFloors(1);
    setRooms(2);
    setBathrooms(1);
    setMaterial('concreto');
    setExtras({
      terraza: false,
      garaje: false,
      acabados: false,
      cocina: false
    });
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid() || !validateInputs({
      name: formData.name,
      whatsapp: formData.phone,
      email: formData.email,
      city: formData.city
    })) {
      alert('Por favor completa Nombre, WhatsApp, Correo y Ciudad.');
      return;
    }
    const saved = await saveQuote();
    if (!saved) return;
    const message = buildWhatsAppMessage();
    handleWhatsApp(message);
    resetQuote();
  };

  return (
    <section id="cotizador-seccion" className="py-24 bg-dark text-white border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="mb-16">
          <span className="text-brand font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">Cotizador Automático</span>
          <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter leading-none">
            CALCULA EL PRECIO <br />
            <span className="text-brand">DE TU CASA.</span>
          </h2>
          <p className="text-slate-400 max-w-2xl text-sm">
            Ajusta las especificaciones y obtén tu precio estimado en tiempo real. Sin compromiso.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Controls */}
          <div className="space-y-12">
            {/* Meters */}
            <div className="space-y-6">
              <div className="flex justify-between items-end">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Metros Cuadrados</label>
                <span className="text-4xl font-black text-brand">{meters} m²</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max={SIZE_OPTIONS.length - 1} 
                value={sizeIndex} 
                onChange={(e) => setSizeIndex(parseInt(e.target.value))}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand"
              />
              <div className="flex justify-between text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                <span>36 m²</span>
                <span>100 m²</span>
              </div>
            </div>

            {/* Grid Options */}
            <div className="grid sm:grid-cols-2 gap-8">
              {/* Floors */}
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Número de Pisos</label>
                <div className="flex gap-2">
                  {[1, 2].map(n => (
                    <button 
                      key={n}
                      onClick={() => {
                        setFloors(n);
                      }}
                      className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${floors === n ? 'bg-brand text-dark' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
                    >
                      {n} {n === 1 ? 'Piso' : 'Pisos'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rooms */}
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Habitaciones</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4].map((n) => (
                    <button 
                      key={n}
                      onClick={() => {
                        if (allowedRooms.includes(n)) {
                          setRooms(n);
                        }
                      }}
                      className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${rooms === n ? 'bg-brand text-dark' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
                    >
                      {n} Hab.
                    </button>
                  ))}
                </div>
              </div>
            </div>

                                    {/* Bathrooms */}
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Baños</label>
              <div className="flex gap-2">
                {[1, 2, 3].map((n) => (
                  <button 
                    key={n}
                    onClick={() => {
                      setBathrooms(n);
                    }}
                    className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${bathrooms === n ? 'bg-brand text-dark' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
                  >
                    {n} {n === 1 ? 'Baño' : 'Baños'}
                  </button>
                ))}
              </div>
            </div>

            {/* Material */}
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Material de Estructura</label>
              <div className="grid sm:grid-cols-2 gap-4">
                <button 
                  onClick={() => setMaterial('concreto')}
                  className={`p-6 rounded-2xl border text-left transition-all ${material === 'concreto' ? 'bg-brand/10 border-brand' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                >
                  <Home size={24} className={`mb-4 ${material === 'concreto' ? 'text-brand' : 'text-slate-500'}`} />
                  <span className={`block font-black uppercase tracking-widest text-xs mb-1 ${material === 'concreto' ? 'text-brand' : 'text-white'}`}>Concreto Prefabricado</span>
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest leading-relaxed">Módulos 3.5 cm, 2500-3000 PSI. Mayor inercia térmica.</span>
                </button>
                <button 
                  onClick={() => setMaterial('acero')}
                  className={`p-6 rounded-2xl border text-left transition-all ${material === 'acero' ? 'bg-brand/10 border-brand' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                >
                  <Zap size={24} className={`mb-4 ${material === 'acero' ? 'text-brand' : 'text-slate-500'}`} />
                  <span className={`block font-black uppercase tracking-widest text-xs mb-1 ${material === 'acero' ? 'text-brand' : 'text-white'}`}>Acero Galvanizado</span>
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest leading-relaxed">Perfiles cal. 22. Resistente a corrosión. Estructura liviana.</span>
                </button>
              </div>
            </div>

            {/* Extras */}
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Extras Opcionales</label>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { id: 'terraza', label: 'Terraza', price: 2500000 },
                  { id: 'garaje', label: 'Garaje', price: 3500000 },
                  { id: 'acabados', label: 'Acabados Premium', price: 5000000 },
                  { id: 'cocina', label: 'Cocina Integral', price: 2000000 }
                ].map(extra => (
                  <button 
                    key={extra.id}
                    onClick={() => setExtras(prev => ({ ...prev, [extra.id]: !prev[extra.id as keyof typeof prev] }))}
                    className={`p-4 rounded-xl border flex items-center justify-between transition-all ${extras[extra.id as keyof typeof extras] ? 'bg-brand/10 border-brand' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${extras[extra.id as keyof typeof extras] ? 'bg-brand border-brand' : 'border-white/20'}`}>
                        {extras[extra.id as keyof typeof extras] && <CheckCircle2 size={12} className="text-dark" />}
                      </div>
                      <div className="text-left">
                        <span className={`block text-xs font-black uppercase tracking-widest ${extras[extra.id as keyof typeof extras] ? 'text-brand' : 'text-white'}`}>{extra.label}</span>
                        <span className="text-[10px] text-slate-500 font-bold">+{formatPrice(extra.price)}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Result & Form */}
          <div className="lg:sticky lg:top-32 h-fit">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 space-y-12">
              <div className="space-y-8">
                <span className="text-brand font-black uppercase tracking-[0.3em] text-[10px] block">Tu Cotización</span>
                
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-1">
                    <span className="block text-2xl font-black">{meters} m²</span>
                    <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Área</span>
                  </div>
                  <div className="space-y-1">
                    <span className="block text-2xl font-black">{floors}</span>
                    <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Pisos</span>
                  </div>
                  <div className="space-y-1">
                    <span className="block text-2xl font-black">{rooms}</span>
                    <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Habitaciones</span>
                  </div>
                  <div className="space-y-1">
                    <span className="block text-2xl font-black">{bathrooms}</span>
                    <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Baños</span>
                  </div>
                </div>

                <div className="pt-8 border-t border-white/10 space-y-4">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-400">
                    <span>Base ({meters} m²)</span>
                    <span>{formatPrice(basePrice)}</span>
                  </div>
                  {Object.entries(extras).some(([_, v]) => v) && (
                    <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-400">
                      <span>Extras Seleccionados</span>
                      <span>{formatPrice(extrasPrice)}</span>
                    </div>
                  )}
                  <div className="pt-4 flex flex-col gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Precio Total Estimado</span>
                    <span className="text-5xl md:text-6xl font-black text-brand tracking-tighter">{formatPrice(totalPrice)}</span>
                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">COP · Precio referencial, sujeto a visita técnica</span>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSend} className="space-y-4 pt-8 border-t border-white/10">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-4">Tus datos para la cotización</span>
                <input 
                  type="text" 
                  placeholder="Nombre completo" 
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-sm focus:outline-none focus:border-brand transition-colors"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                <input 
                  type="tel" 
                  placeholder="Teléfono / WhatsApp" 
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-sm focus:outline-none focus:border-brand transition-colors"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
                <input 
                  type="email" 
                  placeholder="Correo electrónico" 
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-sm focus:outline-none focus:border-brand transition-colors"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <input 
                  type="text" 
                  placeholder="Ciudad / Municipio" 
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-sm focus:outline-none focus:border-brand transition-colors"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
                <button 
                  type="submit"
                  className="w-full bg-brand text-dark py-5 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform mt-4"
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  ENVIAR COTIZACIÓN POR WHATSAPP
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-24 grid sm:grid-cols-2 lg:grid-cols-4 gap-8 border-t border-white/5 pt-12">
          {[
            { icon: <ShieldCheck size={20} />, text: 'NSR-10 / Ley 400/2010 Sismo-resistente' },
            { icon: <Clock size={20} />, text: 'Entrega garantizada en 30 días' },
            { icon: <Settings size={20} />, text: 'Acompañamiento desde diseño hasta entrega' },
            { icon: <Maximize size={20} />, text: 'Medidas personalizadas a tu gusto' }
          ].map((feature, i) => (
            <div key={i} className="flex items-center gap-4 text-slate-500">
              <div className="text-brand">{feature.icon}</div>
              <span className="text-[10px] font-bold uppercase tracking-widest leading-relaxed">{feature.text}</span>
            </div>
          ))}
        </div>

        {/* Footnote */}
        <div className="mt-12 text-center">
          <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest leading-relaxed max-w-3xl mx-auto">
            * El precio calculado es una estimación base. El precio final puede variar según el tipo de terreno, acabados específicos, transporte y condiciones del proyecto. Solicita una visita técnica gratuita con un asesor al 3183767228.
          </p>
        </div>
      </div>
    </section>
  );
};

const App = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const WHATSAPP_NUMBER = '3144366748';
  const DEFAULT_MESSAGE = "Hola, estoy interesado en una casa prefabricada. ¿Podrían darme información?";

  const getWhatsAppUrl = (message?: string) => {
    const text = encodeURIComponent(message || DEFAULT_MESSAGE);
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
  };

  const handleWhatsApp = (message?: string) => {
    window.open(getWhatsAppUrl(message), '_blank');
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const [activeFilter, setActiveFilter] = useState('TODOS');

const models = [
  { id: 1, size: 36, dim: '6x6 METROS', type: 'MODELO BÁSICO', name: 'BÁSICO 36', price: '12.600.000', hab: 2, bath: 1, floors: 1, category: 'BÁSICO', img: '/images/modelos/casa36m2.webp' },
  { id: 2, size: 42, dim: '6x7 METROS', type: 'MODELO BÁSICO', name: 'BÁSICO 42', price: '14.700.000', hab: 2, bath: 1, floors: 1, category: 'BÁSICO', img: '/images/modelos/casa42m2.webp' },
  { id: 3, size: 48, dim: '6x8 METROS', type: 'MODELO FAMILIAR', name: 'FAMILIAR 48', price: '16.800.000', hab: 3, bath: 2, floors: 1, category: 'FAMILIAR', img: '/images/modelos/casa48m2.webp' },
  { id: 4, size: 54, dim: '9x6 METROS', type: 'MODELO FAMILIAR', name: 'FAMILIAR 54', price: '18.900.000', hab: 3, bath: 2, floors: 1, category: 'FAMILIAR', img: '/images/modelos/casa54m2.webp' },
  { id: 5, size: 63, dim: '9x7 METROS', type: 'MODELO FAMILIAR', name: 'FAMILIAR 63', price: '22.000.000', hab: 3, bath: 2, floors: 1, category: 'FAMILIAR', img: '/images/modelos/casa63m2.webp' },
  { id: 6, size: 72, dim: '9x8 METROS', type: 'MODELO PREMIUM', name: 'PREMIUM 72', price: '25.200.000', hab: 4, bath: 2, floors: 1, category: 'PREMIUM', img: '/images/modelos/casa72m2.webp' },
  { id: 7, size: 100, dim: '10x10 METROS', type: 'MODELO PREMIUM', name: 'PREMIUM 100', price: '35.000.000', hab: 4, bath: 2, floors: 2, category: 'PREMIUM', img: '/images/modelos/casa100m2.webp' },
];

  const filteredModels = activeFilter === 'TODOS' 
    ? models 
    : models.filter(m => m.hab === parseInt(activeFilter));

  const scrollTo = (id: string) => {
    const cleanId = id.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const element = document.getElementById(cleanId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark selection:bg-brand selection:text-dark">
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-dark/90 backdrop-blur-md py-4 border-b border-white/10' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center h-24 md:h-28">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => scrollTo('inicio')}>
            <div className="flex items-center justify-center h-24 md:h-28">
              <img src={ASSETS.logo} alt="Logo Vive Tu Hogar" className="h-20 md:h-24 lg:h-28 w-auto object-contain" referrerPolicy="no-referrer" />
            </div>
            <div className="leading-none">
              <span className="block text-base font-black tracking-tighter uppercase text-white">Vive Tu Hogar</span>
              <span className="block text-[10px] font-bold text-brand uppercase tracking-widest">Casas Prefabricadas</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-10">
            {['Inicio', 'Catálogo', 'Cotizador'].map((item) => (
              <button 
                key={item} 
                onClick={() => scrollTo(item === 'Catálogo' ? 'modelos-destacados' : item === 'Cotizador' ? 'cotizador-seccion' : item)}
                className="text-xs font-bold uppercase tracking-widest hover:text-brand transition-colors"
              >
                {item}
              </button>
            ))}
            <button 
              onClick={() => scrollTo('cotizador-seccion')}
              className="bg-brand text-dark px-6 py-2.5 rounded-sm text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:bg-white transition-colors"
            >
              Cotiza tu casa <ArrowRight size={14} />
            </button>
          </div>

          <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed inset-0 z-40 bg-dark pt-32 px-10 md:hidden"
          >
            <div className="flex flex-col gap-8">
              {['Inicio', 'Catálogo', 'Cotizador'].map((item) => (
                <button 
                  key={item} 
                  onClick={() => scrollTo(item === 'Catálogo' ? 'modelos-destacados' : item === 'Cotizador' ? 'cotizador-seccion' : item)}
                  className="text-4xl font-black uppercase tracking-tighter text-left"
                >
                  {item}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <Hero handleWhatsApp={handleWhatsApp} scrollTo={scrollTo} />

      {/* Marquee */}
      <div className="bg-brand py-4 overflow-hidden border-y border-dark">
        <div className="flex whitespace-nowrap animate-marquee">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-8 px-4">
              <span className="text-dark font-black uppercase tracking-widest text-sm">Colombia</span>
              <div className="w-2 h-2 bg-dark rounded-full"></div>
              <span className="text-dark font-black uppercase tracking-widest text-sm">NSR-10 Certificado</span>
              <div className="w-2 h-2 bg-dark rounded-full"></div>
              <span className="text-dark font-black uppercase tracking-widest text-sm">Entrega en 30 días</span>
              <div className="w-2 h-2 bg-dark rounded-full"></div>
              <span className="text-dark font-black uppercase tracking-widest text-sm">Casas Prefabricadas</span>
              <div className="w-2 h-2 bg-dark rounded-full"></div>
              <span className="text-dark font-black uppercase tracking-widest text-sm">Bogotá, Colombia</span>
              <div className="w-2 h-2 bg-dark rounded-full"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Why Choose Us */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-[1px] w-8 bg-brand"></div>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand">Por qué elegirnos</span>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                title: "Construcción Ultra-Rápida", 
                desc: "Módulos prefabricados en fábrica. Solo ensamblamos en tu terreno con precisión geométrica garantizada.", 
                icon: "30",
                sub: "Días de entrega"
              },
              { 
                title: "Sismo-Resistente", 
                desc: "Sistema probado por +30 años en Colombia. Estructura auto-portante con elementos independientes.", 
                icon: <ShieldCheck size={40} />,
                sub: "Ley 400/2010"
              },
              { 
                title: "Sostenible", 
                desc: "Construcción en seco. Cero desperdicios. Sin ruido de maquinaria. Mínimo impacto ambiental.", 
                icon: <Leaf size={40} />,
                sub: "Construcción Verde"
              }
            ].map((item, idx) => (
              <div key={idx} className="bg-card p-10 border border-white/5 hover:border-brand/30 transition-all group">
                <div className="text-brand mb-8 group-hover:scale-110 transition-transform duration-500">
                  {typeof item.icon === 'string' ? (
                    <span className="text-6xl font-black">{item.icon}</span>
                  ) : item.icon}
                </div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">{item.sub}</div>
                <h3 className="text-2xl font-black uppercase tracking-tight mb-4">{item.title}</h3>
                <p className="text-slate-400 leading-relaxed text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Bar */}
      <section className="bg-card border-y border-white/10 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-brand mb-1">Precios desde</div>
            <div className="text-4xl font-black">$12.600.000</div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">COP — Casa 36 m², 2 habitaciones</div>
          </div>
          <button className="bg-brand text-dark px-10 py-5 rounded-sm font-black uppercase tracking-widest hover:bg-white transition-colors">
            Calcular Precio
          </button>
          <div className="hidden lg:block">
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">Proyectos en</div>
            <div className="flex gap-2">
              {['Muzo-Boyaca', 'Pradilla-Cundinamarca', 'Timana-Huila', 'Villarica-Tolima'].map(city => (
                <span key={city} className="text-[10px] font-bold uppercase tracking-widest border border-white/10 px-3 py-1 rounded-full">{city}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Models Preview */}
      <section id="modelos-destacados" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-16">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-[1px] w-8 bg-brand"></div>
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand">Nuestros Modelos</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter">Catálogo de <br /> <span className="text-brand">Casas.</span></h2>
            </div>
            <button 
              onClick={() => scrollTo('catalogo')}
              className="hidden md:flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:text-brand transition-colors mb-4"
            >
              Ver todos los modelos <ArrowRight size={14} />
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { id: "42m2", name: "Modelo Básico", area: "42 m²", rooms: 2, baths: 1, floors: 1, price: "$14.700.000", img: ASSETS.catalogo.modelo42 },
              { id: "65m2", name: "Modelo Familiar", area: "63 m²", rooms: 3, baths: 2, floors: 1, price: "$22.000.000", img: ASSETS.catalogo.modelo65 },
              { id: "100m2", name: "Modelo Premium", area: "100 m²", rooms: 4, baths: 2, floors: 2, price: "$35.000.000", img: ASSETS.catalogo.modelo100 }
            ].map((model, idx) => (
              <div key={idx} className="bg-card border border-white/5 overflow-hidden group">
                <div className="relative h-64 overflow-hidden bg-dark/50">
                  <img 
                    src={model.img} 
                    alt={model.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 bg-brand text-dark px-3 py-1 text-xs font-black uppercase tracking-widest">
                    {model.area}
                  </div>
                </div>
                <div className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-xl font-black uppercase tracking-tight mb-1">{model.name}</h3>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{model.rooms} Habitaciones</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] font-bold uppercase tracking-widest text-brand mb-1">Desde</div>
                      <div className="text-lg font-black">{model.price}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mb-8 py-4 border-y border-white/5">
                    <div className="text-center">
                      <div className="text-lg font-black">{model.rooms}</div>
                      <div className="text-[8px] font-bold uppercase tracking-widest text-slate-500">Hab.</div>
                    </div>
                    <div className="text-center border-x border-white/5">
                      <div className="text-lg font-black">{model.baths}</div>
                      <div className="text-[8px] font-bold uppercase tracking-widest text-slate-500">Baños</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-black">{model.floors}</div>
                      <div className="text-[8px] font-bold uppercase tracking-widest text-slate-500">Pisos</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => scrollTo('cotizador-seccion')}
                    className="w-full bg-brand text-dark py-4 rounded-sm font-black uppercase tracking-widest text-xs hover:bg-white transition-colors"
                  >
                    Cotizar este modelo
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section id="proceso" className="py-32 px-6 bg-card/30">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-16">
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-[1px] w-8 bg-brand"></div>
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand">Proceso</span>
            </div>
            <h2 className="text-5xl font-black uppercase tracking-tighter mb-8">Cómo <br /> <span className="text-brand">Trabajamos.</span></h2>
            <p className="text-slate-400 mb-10 text-sm leading-relaxed">
              Desde el diseño hasta la entrega en tu terreno. Todo en 30 días.
            </p>
            <div className="inline-flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-brand border border-brand/30 px-4 py-2 rounded-full">
              <ShieldCheck size={14} />
              NSR-10 Certificado
            </div>
          </div>
          <div className="md:col-span-2 grid grid-cols-2 gap-4">
            {[
              { num: "01", title: "Diseño", desc: "Planificamos cada detalle según tus necesidades y terreno" },
              { num: "02", title: "Cimentación", desc: "Placa flotante de concreto armado 8-10 cm con malla soldada" },
              { num: "03", title: "Fabricación", desc: "Módulos de concreto 3.5 cm, 2500-3000 PSI en fábrica" },
              { num: "04", title: "Montaje", desc: "Ensamble en sitio con perfiles de acero galvanizado cal. 22" },
              { num: "05", title: "Acabados", desc: "Puertas, ventanas, instalaciones y terminados interiores" },
              { num: "06", title: "Entrega", desc: "Tu hogar listo en 30 días con garantía estructural" }
            ].map((step, idx) => (
              <div key={idx} className="bg-card p-8 border border-white/5 hover:border-brand/20 transition-all">
                <div className="text-4xl font-black text-white/10 mb-4">{step.num}</div>
                <h3 className="text-lg font-black uppercase tracking-tight mb-2">{step.title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section id="proyectos" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-[1px] w-8 bg-brand"></div>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand">Galería de Proyectos</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-16">Proyectos <br /> <span className="text-brand">Realizados.</span></h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {ASSETS.proyectos.map((proj, idx) => (
              <div key={idx} className={`${idx === 0 ? 'md:col-span-2 md:row-span-2' : idx === 1 ? 'md:col-span-2' : ''} relative group overflow-hidden`}>
                <img src={proj.url} alt={proj.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
                <div className="absolute bottom-6 left-6 bg-dark/60 backdrop-blur-md px-4 py-2 text-[10px] font-bold uppercase tracking-widest">{proj.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Catalogo
        models={models}
        filteredModels={filteredModels}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        scrollTo={scrollTo}
      />

      {/* Materiales Disponibles */}
      <section className="py-24 bg-[#141414] text-white">
        <div className="container mx-auto px-6">
          <div className="mb-16">
            <span className="text-brand font-black uppercase tracking-[0.3em] text-xs mb-4 block">Materiales Disponibles</span>
            <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter leading-none">
              CONCRETO O ACERO. <br />
              <span className="text-brand">TÚ ELIGES.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-10 hover:border-brand/30 transition-all">
              <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-8">
                <Home size={24} className="text-brand" />
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tight mb-4">CONCRETO PREFABRICADO</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-8">
                Módulos de concreto de 3.5 cm de espesor con resistencia de 2500 a 3000 PSI. Mayor inercia térmica y aislamiento acústico.
              </p>
              <ul className="space-y-4">
                {[
                  'Módulos de 3.5 cm — 2500 a 3000 PSI',
                  'Precisión geométrica garantizada en fábrica',
                  'Estructura auto-portante sismo-resistente',
                  'Placa flotante de concreto armado 8-10 cm',
                  'Malla eléctrica soldada incluida',
                  'Paredes más pesadas que cubierta (NSR-10)'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-xs font-bold text-slate-300 uppercase tracking-widest">
                    <CheckCircle2 size={14} className="text-brand mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-10 hover:border-brand/30 transition-all">
              <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-8">
                <Zap size={24} className="text-brand" />
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tight mb-4">ACERO GALVANIZADO</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-8">
                Perfiles de lámina de acero galvanizado calibre 22. Alta resistencia a la corrosión, estructura liviana y de rápido ensamble.
              </p>
              <ul className="space-y-4">
                {[
                  'Lámina galvanizada calibre 22',
                  'Resistencia a corrosión garantizada',
                  'Conecta y confina módulos de concreto',
                  'Marcos de puerta calibre 22 anticorrosivo',
                  'Ventanas metálicas Cold Rolled anticorrosivo',
                  'Estructura liviana — traslado fácil'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-xs font-bold text-slate-300 uppercase tracking-widest">
                    <CheckCircle2 size={14} className="text-brand mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Cotizador Automático */}
      <AutomaticQuoter handleWhatsApp={handleWhatsApp} />

      {/* CTA Final */}
      <section id="cotizador" className="py-24 bg-[#1a1a1a] text-white text-center">
        <div className="container mx-auto px-6">
          <span className="text-brand font-black uppercase tracking-[0.3em] text-[10px] mb-6 block">¿Listo para empezar?</span>
          <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter leading-none">
            OBTÉN TU COTIZACIÓN <br />
            <span className="text-brand">EN MINUTOS.</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto mb-12 text-lg">
            Usa nuestro cotizador automático o habla directamente con un asesor. Sin compromiso, sin costo.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={() => scrollTo('cotizador-seccion')}
              className="bg-brand text-dark px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:scale-105 transition-transform"
            >
              COTIZADOR AUTOMÁTICO <ArrowRight size={16} />
            </button>
            <button 
              onClick={() =>
                document.getElementById('cotizador')?.scrollIntoView({
                  behavior: 'smooth'
                })
              }
              className="bg-white/5 border border-white/10 px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-white/10 transition-colors"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" className="text-brand">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg> WHATSAPP
            </button>
          </div>
          <div className="mt-12 pt-12 border-t border-white/10">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
              Cra 80 | # 57 b - 23 Sur, Roma, Bogotá · 
              <a href="tel:+573183767228" className="hover:text-brand transition-colors"> 3183767228 </a> · 
              <a href="tel:+573181167228" className="hover:text-brand transition-colors"> 3181167228 </a>
            </p>
          </div>
        </div>
      </section>

      <Footer scrollTo={scrollTo} />

      {/* WhatsApp Floating Button */}
      <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-4">
        <button 
          onClick={() =>
            document.getElementById('cotizador')?.scrollIntoView({
              behavior: 'smooth'
            })
          }
          className="relative w-16 h-16 bg-brand text-dark rounded-full shadow-[0_0_20px_rgba(242,125,38,0.4)] flex items-center justify-center hover:scale-110 transition-transform group overflow-hidden"
        >
          {/* Pulse Effect */}
          <div className="absolute inset-0 bg-brand rounded-full animate-ping opacity-20" />
          
          <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor" className="relative z-10">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          
          <span className="absolute right-full mr-4 bg-white text-dark px-4 py-2 rounded-lg text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl">
            ¿Hablamos por WhatsApp?
          </span>
        </button>
      </div>
    </div>
  );
};

export default App;
