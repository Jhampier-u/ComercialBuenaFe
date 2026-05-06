'use strict';

const express = require('express');
const router  = express.Router();
const db      = require('../config/db');

async function adjuntarAtributos(productos) {
  if (!productos.length) return productos;
  const ids          = productos.map(p => p.id);
  const placeholders = ids.map(() => '?').join(',');
  const [atribs] = await db.query(
    `SELECT producto_id, atributo FROM producto_atributos WHERE producto_id IN (${placeholders}) ORDER BY producto_id, orden`,
    ids
  );
  const mapaAtribs = atribs.reduce((acc, row) => {
    if (!acc[row.producto_id]) acc[row.producto_id] = [];
    acc[row.producto_id].push(row.atributo);
    return acc;
  }, {});
  return productos.map(p => ({ ...p, atributos: mapaAtribs[p.id] || [] }));
}

router.get('/categorias', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT c.id, c.nombre, c.icono, COUNT(p.id) AS cantidad
      FROM categorias c
      LEFT JOIN productos p ON p.categoria_id = c.id AND p.activo = 1
      GROUP BY c.id, c.nombre, c.icono
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener categorías' });
  }
});

router.get('/productos', async (req, res) => {
  try {
    const { cat, q, orden, badge, limite } = req.query;
    let sql = 'SELECT * FROM vista_productos WHERE 1=1';
    const vals = [];
    if (cat)   { sql += ' AND categoria_id = ?'; vals.push(cat); }
    if (q)     { sql += ' AND (nombre LIKE ? OR descripcion LIKE ?)'; vals.push(`%${q}%`, `%${q}%`); }
    if (badge) { sql += ' AND badge = ?'; vals.push(badge); }
    const ordenes = { 'precio-asc': 'precio ASC', 'precio-desc': 'precio DESC', 'nombre': 'nombre ASC' };
    sql += ` ORDER BY ${ordenes[orden] || 'id ASC'}`;
    if (limite && !isNaN(Number(limite))) { sql += ' LIMIT ?'; vals.push(Number(limite)); }
    const [rows] = await db.query(sql, vals);
    res.json(await adjuntarAtributos(rows));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

router.get('/productos/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });
    const [rows] = await db.query('SELECT * FROM vista_productos WHERE id = ?', [id]);
    if (!rows.length) return res.status(404).json({ error: 'Producto no encontrado' });
    const [producto] = await adjuntarAtributos(rows);
    res.json(producto);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener el producto' });
  }
});

router.get('/productos/:id/relacionados', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [[base]] = await db.query('SELECT categoria_id FROM productos WHERE id = ? AND activo = 1', [id]);
    if (!base) return res.status(404).json({ error: 'Producto no encontrado' });
    const [rows] = await db.query(
      'SELECT * FROM vista_productos WHERE categoria_id = ? AND id <> ? ORDER BY RAND() LIMIT 4',
      [base.categoria_id, id]
    );
    res.json(await adjuntarAtributos(rows));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener relacionados' });
  }
});

router.get('/health', (_req, res) => res.json({ estado: 'ok' }));

module.exports = router;
