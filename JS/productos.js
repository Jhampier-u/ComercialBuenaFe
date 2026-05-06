/* ============================================
   COMERCIAL BUEN FE — Cliente API + Fallback Local
   ============================================ */

const API_BASE = 'http://localhost:3000/api';

/* ---- Datos estáticos de respaldo (se usan si la API no está disponible) ---- */
const PRODUCTOS_FALLBACK = [
  { id:1,  nombre:'Nueces Peladas',       categoria:'frutos-secos', precio:8.50,  unidad:'lb', badge:'popular', descripcion:'Nueces de primera calidad, naturales y sin aditivos. Ricas en omega-3, antioxidantes y grasas saludables.', atributos:['Sin aditivos','Alto en omega-3','Cosecha selecta','Empaque sellado'] },
  { id:2,  nombre:'Almendras Tostadas',   categoria:'frutos-secos', precio:9.00,  unidad:'lb', badge:'popular', descripcion:'Almendras cuidadosamente tostadas al natural, sin aceite ni sal añadida. Crujientes y nutritivas.', atributos:['Sin aceite añadido','Alto en proteína','Tostado natural','Sin conservantes'] },
  { id:3,  nombre:'Maní Tostado',         categoria:'frutos-secos', precio:3.50,  unidad:'lb', badge:null,      descripcion:'Maní tostado al natural, sin aceite ni sal añadida. Fuente de proteínas y grasas buenas.', atributos:['Sin sal añadida','100% natural','Sin gluten'] },
  { id:4,  nombre:'Avellanas',            categoria:'frutos-secos', precio:11.00, unidad:'lb', badge:null,      descripcion:'Avellanas enteras con piel, ideales para repostería. Ricas en vitamina E.', atributos:['Con piel natural','Alto en vit. E','Sabor intenso'] },
  { id:5,  nombre:'Pistachos',            categoria:'frutos-secos', precio:12.00, unidad:'lb', badge:'nuevo',   descripcion:'Pistachos selectos, tostados y ligeramente salados. Ricos en fibra y proteínas.', atributos:['Ligeramente salado','Alto en fibra','Tostado artesanal'] },
  { id:6,  nombre:'Anacardos (Cashews)',  categoria:'frutos-secos', precio:10.00, unidad:'lb', badge:null,      descripcion:'Anacardos enteros de primera calidad, cremosos y nutritivos.', atributos:['Enteros seleccionados','Cremosos','Sin cáscara'] },
  { id:7,  nombre:'Quinua Perlada',       categoria:'granos',       precio:5.00,  unidad:'lb', badge:'popular', descripcion:'Quinua blanca premium de origen andino, libre de gluten y rica en proteínas completas.', atributos:['Sin gluten','Proteína completa','Origen andino'] },
  { id:8,  nombre:'Arroz Integral',       categoria:'granos',       precio:2.50,  unidad:'lb', badge:null,      descripcion:'Arroz integral de grano largo, rico en fibra y vitaminas B.', atributos:['Grano largo','Alto en fibra','Con salvado'] },
  { id:9,  nombre:'Lentejas Verdes',      categoria:'granos',       precio:2.00,  unidad:'lb', badge:null,      descripcion:'Lentejas verdes seleccionadas. Gran fuente de proteína vegetal y hierro.', atributos:['Alto en hierro','Proteína vegetal','Rápida cocción'] },
  { id:10, nombre:'Garbanzos',            categoria:'granos',       precio:2.50,  unidad:'lb', badge:null,      descripcion:'Garbanzos grandes y tiernos, perfectos para hummus y cocidos.', atributos:['Tamaño grande','Alto en fibra','Versátiles'] },
  { id:11, nombre:'Frijoles Negros',      categoria:'granos',       precio:2.00,  unidad:'lb', badge:null,      descripcion:'Frijoles negros seleccionados. Ricos en antioxidantes y hierro.', atributos:['Rico en antioxidantes','Alto en hierro'] },
  { id:12, nombre:'Maíz Mote',            categoria:'granos',       precio:2.00,  unidad:'lb', badge:null,      descripcion:'Maíz mote pelado de primera calidad, tradicional de la gastronomía andina.', atributos:['Tradición andina','Pelado listo'] },
  { id:13, nombre:'Semillas de Chía',     categoria:'semillas',     precio:6.00,  unidad:'lb', badge:'nuevo',   descripcion:'Semillas de chía ricas en omega-3, fibra y proteínas.', atributos:['Rico en omega-3','Alto en fibra','Sin gluten'] },
  { id:14, nombre:'Semillas de Sésamo',   categoria:'semillas',     precio:4.00,  unidad:'lb', badge:null,      descripcion:'Semillas de sésamo tostadas, ideales para cocina asiática. Ricas en calcio.', atributos:['Alto en calcio','Tostadas','Versátiles'] },
  { id:15, nombre:'Semillas de Girasol',  categoria:'semillas',     precio:3.00,  unidad:'lb', badge:null,      descripcion:'Semillas de girasol peladas y tostadas. Ricas en vitamina E.', atributos:['Alto en vit. E','Peladas','Snack energético'] },
  { id:16, nombre:'Pasas de Uva',         categoria:'deshidratados', precio:4.50, unidad:'lb', badge:null,      descripcion:'Pasas naturales sin azúcar añadida. Perfectas para repostería y snacks.', atributos:['Sin azúcar añadida','Sin conservantes'] },
  { id:17, nombre:'Orejones de Durazno',  categoria:'deshidratados', precio:6.00, unidad:'lb', badge:null,      descripcion:'Duraznos deshidratados sin conservantes, naturalmente dulces.', atributos:['Sin conservantes','Rico en potasio'] },
  { id:18, nombre:'Coco Rallado',         categoria:'deshidratados', precio:5.50, unidad:'lb', badge:null,      descripcion:'Coco rallado deshidratado sin azúcar añadida, perfecto para repostería.', atributos:['Sin azúcar','Para repostería'] },
];

const CATEGORIAS_FALLBACK = [
  { id: 'frutos-secos',  nombre: 'Frutos Secos',  activo: true },
  { id: 'granos',        nombre: 'Granos',         activo: true },
  { id: 'semillas',      nombre: 'Semillas',       activo: true },
  { id: 'deshidratados', nombre: 'Deshidratados',  activo: true },
];

/* Emojis locales por ID de producto (evita problemas de encoding en MySQL) */
const EMOJI_PRODUCTOS = {
  1: '🌰', 2: '🫘', 3: '🥜', 4:  '🌰', 5:  '🫛', 6:  '🥜',
  7: '🌾', 8: '🍚', 9: '🫘', 10: '🫘', 11: '🫘', 12: '🌽',
  13: '🌱', 14: '🌾', 15: '🌻', 16: '🍇', 17: '🍑', 18: '🥥'
};

const EMOJI_CATEGORIAS = {
  'frutos-secos':  '🌰',
  'granos':        '🌾',
  'semillas':      '🌱',
  'deshidratados': '🍇',
};

/* Estado global */
let PRODUCTOS        = [];
let CATEGORIAS       = [];
let CATEGORIA_LABELS = {};

/* ---- Carga inicial de datos ---- */
async function cargarDatos() {
  try {
    const [productos, categorias] = await Promise.all([
      apiFetch('/productos'),
      apiFetch('/categorias'),
    ]);

    // Reemplazar icono con emoji local para evitar problemas de encoding
    PRODUCTOS = productos.map(p => ({
      ...p,
      icono: EMOJI_PRODUCTOS[p.id] || '📦',
    }));

    CATEGORIAS = [
      { id: 'todos', nombre: 'Todos los productos', icono: '🛒', cantidad: productos.length },
      ...categorias.map(c => ({ ...c, icono: EMOJI_CATEGORIAS[c.id] || '📦' })),
    ];

    categorias.forEach(c => {
      CATEGORIA_LABELS[c.id] = c.nombre;
    });
  } catch (err) {
    console.warn('API no disponible — usando datos locales:', err.message);
    cargarDatosLocales();
  }
}

/* ---- Fallback: datos del admin (localStorage) o estáticos ---- */
function cargarDatosLocales() {
  const adminProds = localStorage.getItem('cbf_admin_productos');
  const adminCats  = localStorage.getItem('cbf_admin_categorias');

  const prods = adminProds
    ? JSON.parse(adminProds).filter(p => p.activo !== false)
    : PRODUCTOS_FALLBACK;

  const cats = adminCats
    ? JSON.parse(adminCats).filter(c => c.activo !== false)
    : CATEGORIAS_FALLBACK;

  PRODUCTOS = prods.map(p => ({
    ...p,
    icono: EMOJI_PRODUCTOS[p.id] || p.icono || '📦',
  }));

  CATEGORIAS = [
    { id: 'todos', nombre: 'Todos los productos', icono: '🛒', cantidad: PRODUCTOS.length },
    ...cats.map(c => ({
      ...c,
      icono: EMOJI_CATEGORIAS[c.id] || c.icono || '📦',
      cantidad: PRODUCTOS.filter(p => p.categoria === c.id).length,
    })),
  ];

  cats.forEach(c => { CATEGORIA_LABELS[c.id] = c.nombre; });
}

/* ---- Fetch centralizado ---- */
async function apiFetch(ruta, opciones = {}) {
  const res = await fetch(`${API_BASE}${ruta}`, {
    headers: { 'Content-Type': 'application/json' },
    ...opciones,
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `HTTP ${res.status}`);
  }
  return res.json();
}

/* ---- Aviso de error de conexión ---- */
function mostrarErrorConexion() {
  const aviso = document.createElement('div');
  aviso.style.cssText = `
    position:fixed; bottom:80px; left:50%; transform:translateX(-50%);
    background:#4a2f1d; color:#fff; padding:12px 22px; border-radius:10px;
    font-size:14px; z-index:9999; border-left:3px solid #e53e3e;
    box-shadow:0 4px 20px rgba(0,0,0,0.3); max-width:360px; text-align:center;`;
  aviso.textContent = '⚠️ No se pudo conectar al servidor. Revisa que el backend esté corriendo.';
  document.body.appendChild(aviso);
  setTimeout(() => aviso.remove(), 6000);
}
