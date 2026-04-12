export interface HouseModel {
  id: string;
  name: string;
  area: number;
  dimensions: string;
  bedrooms: number;
  bathrooms: number;
  price: number;
  description: string;
  image: string;
}

export const HOUSE_MODELS: HouseModel[] = [
  {
    id: "m36",
    name: "Modelo Esencial 36",
    area: 36,
    dimensions: "6x6",
    bedrooms: 2,
    bathrooms: 1,
    price: 12600000,
    description: "Ideal para parejas o inversión en zonas rurales.",
    image: "/images/modelos/casa42m2.webp"
  },
  {
    id: "m42",
    name: "Modelo Confort 42",
    area: 42,
    dimensions: "6x7",
    bedrooms: 2,
    bathrooms: 1,
    price: 14700000,
    description: "Espacios optimizados con diseño moderno.",
    image: "/images/modelos/casa42m2.webp"
  },
  {
    id: "m48",
    name: "Modelo Familiar 48",
    area: 48,
    dimensions: "6x8",
    bedrooms: 3,
    bathrooms: 1,
    price: 16800000,
    description: "Perfecta para familias pequeñas que buscan comodidad.",
    image: "/images/modelos/casa65m2.webp"
  },
  {
    id: "m54",
    name: "Modelo Amplio 54",
    area: 54,
    dimensions: "9x6",
    bedrooms: 3,
    bathrooms: 2,
    price: 18900000,
    description: "Distribución inteligente con dos baños completos.",
    image: "/images/modelos/casa65m2.webp"
  },
  {
    id: "m63",
    name: "Modelo Premium 63",
    area: 63,
    dimensions: "9x7",
    bedrooms: 3,
    bathrooms: 2,
    price: 22000000,
    description: "Nuestra casa más vendida por su equilibrio y diseño.",
    image: "/images/modelos/casa65m2.webp"
  },
  {
    id: "m72",
    name: "Modelo Residencia 72",
    area: 72,
    dimensions: "9x8",
    bedrooms: 4,
    bathrooms: 2,
    price: 25200000,
    description: "Gran amplitud para familias numerosas.",
    image: "/images/modelos/casa65m2.webp"
  },
  {
    id: "m100",
    name: "Modelo Mansión 100",
    area: 100,
    dimensions: "10x10",
    bedrooms: 4,
    bathrooms: 3,
    price: 35000000,
    description: "El máximo exponente de lujo y espacio prefabricado.",
    image: "/images/modelos/casa100m2.webp"
  }
];
