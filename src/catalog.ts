// Datos de demostración de la agencia.

export interface Trip {
  id: string;
  destination: string;
  region: string;
  nights: number;
  includes: string[];
  price: number;
  /** Colores de la ilustración: [montañas, cielo medio, cielo alto]. */
  scene: [string, string, string];
}

export interface PaymentMethod {
  id: string;
  title: string;
  via: string;
  icon: "card" | "bank" | "wallet" | "qr";
  min: number;
  max: number;
  /** Único medio real: el checkout embebido de Totalcoin. El resto son simulados. */
  totalcoin?: boolean;
}

export const trips: Trip[] = [
  {
    id: "bariloche",
    destination: "Bariloche",
    region: "Río Negro, Argentina",
    nights: 5,
    includes: ["Vuelo ida y vuelta", "Hotel 4★ con desayuno", "Traslados"],
    price: 485000,
    scene: ["#0f766e", "#155e75", "#e0f2fe"],
  },
  {
    id: "iguazu",
    destination: "Cataratas del Iguazú",
    region: "Misiones, Argentina",
    nights: 3,
    includes: ["Vuelo ida y vuelta", "Hotel 3★ con desayuno", "Excursión a Cataratas"],
    price: 312000,
    scene: ["#166534", "#0e7490", "#dcfce7"],
  },
  {
    id: "salta",
    destination: "Salta y Jujuy",
    region: "Noroeste argentino",
    nights: 6,
    includes: ["Vuelo ida y vuelta", "Hoteles boutique", "Auto 4x4 6 días"],
    price: 540000,
    scene: ["#c2410c", "#9f1239", "#ffedd5"],
  },
  {
    id: "mendoza",
    destination: "Mendoza",
    region: "Cuyo, Argentina",
    nights: 4,
    includes: ["Vuelo ida y vuelta", "Hotel 4★", "2 visitas a bodegas"],
    price: 398000,
    scene: ["#7e22ce", "#be123c", "#f3e8ff"],
  },
  {
    id: "ushuaia",
    destination: "Ushuaia",
    region: "Tierra del Fuego, Argentina",
    nights: 5,
    includes: ["Vuelo ida y vuelta", "Hotel 4★ con desayuno", "Navegación Canal Beagle"],
    price: 620000,
    scene: ["#1e3a8a", "#0369a1", "#e0e7ff"],
  },
  {
    id: "rio",
    destination: "Río de Janeiro",
    region: "Brasil",
    nights: 7,
    includes: ["Vuelo ida y vuelta", "Hotel frente al mar", "City tour"],
    price: 890000,
    scene: ["#ca8a04", "#0d9488", "#fef9c3"],
  },
];

export const paymentMethods: PaymentMethod[] = [
  { id: "totalcoin", title: "Tarjeta de crédito o débito", via: "TotalCoin", icon: "card", min: 1000, max: 1000000, totalcoin: true },
  { id: "bind-transfer", title: "Transferencia bancaria", via: "Bind", icon: "bank", min: 1000, max: 3000000 },
  { id: "mp-account", title: "Dinero en cuenta", via: "MercadoPago", icon: "wallet", min: 1000, max: 3000000 },
  { id: "tc-qr", title: "Depositar con QR", via: "TotalCoin", icon: "qr", min: 1000, max: 1500000 },
  { id: "mp-credit", title: "Tarjeta de crédito", via: "MercadoPago", icon: "card", min: 1000, max: 100000 },
];

/** `$ 485.000` */
export const formatMoney = (amount: number) => "$ " + amount.toLocaleString("es-AR");
