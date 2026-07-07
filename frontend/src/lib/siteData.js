export const defaultConfig = {
  theme: { headingFont: "Sora", bodyFont: "Inter", radius: 10, accent: "#3FC16F" },
  announcementBar: {
    enabled: true,
    transition: "slide",
    interval: 4000,
    paddingY: 9,
    dismissible: true,
    textColor: "#062012",
    background: {
      type: "solid",
      color: "#3FC16F",
      gradient: { from: "#3FC16F", to: "#0B1510", angle: 90 },
      pattern: { id: "none", patternColor: "#FFFFFF", opacity: 0.12, size: 20, emoji: "🎉" },
    },
    announcements: [
      { text: "🎉 Gran Sorteo LotoCorp — ¡Boletos desde $150 MXN!", linkLabel: "Comprar ahora", link: "#" },
      { text: "🚚 Enviamos el premio a todo México sin costo", linkLabel: "Ver bases", link: "#" },
    ],
  },
  header: {
    logo: { mode: "image-text", text: "LotoCorp", image: "", size: 22, offsetX: 0, offsetY: 0, position: "inside", verified: true, verifiedIcon: "check", center: false },
    blockOrder: ["logo", "nav", "actions"],
    navLinks: [
      { label: "Sorteos", href: "#", normalColor: "#EAF2EC", hoverColor: "#3FC16F", activeColor: "#3FC16F" },
      { label: "Ganadores", href: "#", normalColor: "#EAF2EC", hoverColor: "#3FC16F", activeColor: "#3FC16F" },
      { label: "Cómo Participar", href: "#", normalColor: "#EAF2EC", hoverColor: "#3FC16F", activeColor: "#3FC16F" },
      { label: "Ayuda", href: "#", normalColor: "#EAF2EC", hoverColor: "#3FC16F", activeColor: "#3FC16F" },
    ],
    actions: [
      { type: "button", preset: "comprar", label: "Comprar boletos", href: "#", bg: "#3FC16F", color: "#062012", icon: "ticket" },
      { type: "icon", preset: "cuenta", label: "Mi cuenta", href: "#", bg: "transparent", color: "#EAF2EC", icon: "user" },
      { type: "icon-badge", preset: "carrito", label: "Carrito", href: "#", bg: "transparent", color: "#EAF2EC", icon: "cart" },
    ],
    shell: {
      paddingY: 16, sticky: true, shadow: true, pill: false, textColor: "#EAF2EC",
      background: { type: "solid", color: "#0B1510", gradient: { from: "#0B1510", to: "#122018", angle: 90 }, pattern: { id: "none", patternColor: "#3FC16F", opacity: 0.08, size: 24, emoji: "✦" } },
    },
  },
  sections: [
    { id: "sorteos", label: "Sorteos Activos", enabled: true },
    { id: "como", label: "Cómo Participar", enabled: true },
    { id: "ganadores", label: "Ganadores", enabled: true },
  ],
  footer: {
    brandName: "LotoCorp",
    tagline: "Sorteos transparentes y auditados. Permiso SEGOB No. 20260123.",
    background: { type: "solid", color: "#081109" },
    textColor: "#EAF2EC",
    columns: [
      { title: "Sorteos", links: [{ label: "Activos", href: "#" }, { label: "Próximos", href: "#" }, { label: "Finalizados", href: "#" }] },
      { title: "Empresa", links: [{ label: "Nosotros", href: "#" }, { label: "Transparencia", href: "#" }, { label: "Contacto", href: "#" }] },
      { title: "Ayuda", links: [{ label: "Cómo participar", href: "#" }, { label: "Preguntas frecuentes", href: "#" }, { label: "Bases legales", href: "#" }] },
    ],
    socials: [{ platform: "instagram", href: "#" }, { platform: "facebook", href: "#" }, { platform: "youtube", href: "#" }],
    copyright: "© 2026 LotoCorp México. Todos los derechos reservados.",
  },
  cart: {
    title: "Tus boletos",
    emptyText: "Aún no has agregado boletos.",
    checkoutLabel: "Ir a pagar",
    accentColor: "#3FC16F",
    showImages: true,
    freeShippingThreshold: 0,
  },
};

export const sorteos = [
  { id: "s1", title: "Mercedes-AMG GT", subtitle: "Sorteo #1042", tag: "Auto", price: 250, sold: 78, image: "https://images.unsplash.com/photo-1618642624018-a370cbf3cd80" },
  { id: "s2", title: "$500,000 en Efectivo", subtitle: "Sorteo #1043", tag: "Efectivo", price: 150, sold: 52, image: "https://images.pexels.com/photos/14655998/pexels-photo-14655998.jpeg" },
  { id: "s3", title: "Harley-Davidson Fat Boy", subtitle: "Sorteo #1044", tag: "Moto", price: 180, sold: 34, image: "https://images.pexels.com/photos/2440997/pexels-photo-2440997.jpeg" },
];

export const ganadores = [
  { id: "g1", name: "Ana Rodríguez", prize: "Toyota Hilux 2025", city: "Guadalajara, JAL", image: "https://images.unsplash.com/photo-1531742903308-ce1ef1631c3b" },
  { id: "g2", name: "Luis Hernández", prize: "$250,000 en efectivo", city: "Monterrey, NL", image: "https://images.unsplash.com/photo-1664076710651-1c971052f929" },
];

export const comoPasos = [
  { n: 1, title: "Elige tu sorteo", text: "Selecciona el premio que quieres ganar entre los sorteos activos." },
  { n: 2, title: "Compra tus boletos", text: "Paga de forma segura con tarjeta, transferencia o en tiendas afiliadas." },
  { n: 3, title: "Espera el sorteo", text: "Transmitimos en vivo con la Lotería Nacional. Todo auditado y transparente." },
];
