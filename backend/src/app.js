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
app.get('/api/config/api-key', (req, res) => {
    // La API Key debe estar en tu .env como GEMINI_API_KEY
    res.json({ apiKey: process.env.AIzaSyAhcEfOyXYexbkC3Remhoi3_M-syfveU9o });
});

