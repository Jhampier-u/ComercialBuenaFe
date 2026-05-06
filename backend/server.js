'use strict';
 
require('dotenv').config();
const express = require('express');
const cors    = require('cors');
 
const productosRouter = require('./routes/productos');
 
const app  = express();
const PORT = process.env.PORT || 3000;
 
app.use(cors({ origin: '*' }));
app.use(express.json());
 
app.get('/api/health', (_req, res) => {
  res.json({ estado: 'ok', timestamp: new Date().toISOString() });
});
 
app.use('/api', productosRouter);
 
app.use((_req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});
 
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});