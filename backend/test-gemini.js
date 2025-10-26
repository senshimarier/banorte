// backend/test-gemini.js
require('dotenv').config();

async function testGemini() {
    const apiKey = process.env.GEMINI_API_KEY;
    
    console.log('API Key existe:', !!apiKey);
    console.log('Primeros 10 caracteres:', apiKey ? apiKey.substring(0, 10) : 'N/A');
    
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: 'Hola, ¿cómo estás?' }] }]
            })
        });
        
        console.log('Status:', response.status);
        const data = await response.json();
        console.log('Respuesta:', JSON.stringify(data, null, 2));
        
    } catch (error) {
        console.error('Error:', error);
    }
}

testGemini();
