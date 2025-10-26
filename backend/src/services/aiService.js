// backend/services/aiService.js
// Servicio de IA usando Google Gemini

async function getAIResponse(question, context) {
    const apiKey = process.env.GEMINI_API_KEY;
    
    // Validar que existe la API Key
    if (!apiKey) {
        console.warn('⚠️ GEMINI_API_KEY no encontrada en .env');
        return 'Análisis con IA no disponible. Por favor configura GEMINI_API_KEY en el archivo .env';
    }

     const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;
    
    // Construir el prompt para Gemini
    const prompt = `Eres un asesor financiero experto de Banorte México. 

Datos financieros: ${JSON.stringify(context)}

Pregunta del usuario: ${question}

Por favor, proporciona:
1. Un análisis detallado de la situación financiera
2. Recomendaciones específicas y accionables
3. Alertas sobre posibles riesgos
4. Oportunidades de optimización

Responde en español de manera clara y profesional.`;
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 1024,
                    stopSequences: []
                },
                safetySettings: [
                    {
                        category: "HARM_CATEGORY_HARASSMENT",
                        threshold: "BLOCK_MEDIUM_AND_ABOVE"
                    },
                    {
                        category: "HARM_CATEGORY_HATE_SPEECH",
                        threshold: "BLOCK_MEDIUM_AND_ABOVE"
                    },
                    {
                        category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                        threshold: "BLOCK_MEDIUM_AND_ABOVE"
                    },
                    {
                        category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                        threshold: "BLOCK_MEDIUM_AND_ABOVE"
                    }
                ]
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error de Gemini API:', errorData);
            throw new Error(`Error ${response.status}: ${errorData.error?.message || 'Error desconocido'}`);
        }

        const data = await response.json();
        
        // Extraer la respuesta de Gemini
        if (data.candidates && data.candidates.length > 0) {
            const candidate = data.candidates[0];
            if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
                return candidate.content.parts[0].text;
            }
        }
        
        console.warn('Respuesta de Gemini vacía o en formato inesperado');
        return 'No se pudo generar una respuesta de IA. Por favor, intenta nuevamente.';
        
    } catch (error) {
        console.error('Error al llamar a Gemini:', error.message);
        return `Error al consultar IA: ${error.message}. Verifica tu API Key y conexión a internet.`;
    }
}

module.exports = { getAIResponse };
