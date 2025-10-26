require('dotenv').config();
const express = require('express');
const cors = require('cors');
const financialRoutes = require('./routes/financialRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', financialRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor MCP corriendo en puerto ${PORT}`));