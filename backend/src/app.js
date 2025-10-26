require('dotenv').config();
const express = require('express');
const cors = require('cors');
const financialRoutes = require('./routes/financialRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// Montar rutas en /api/v1
app.use('/api/v1', financialRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en puerto ${PORT}`);
    console.log(`✅ Rutas disponibles en http://localhost:${PORT}/api/v1`);
});
