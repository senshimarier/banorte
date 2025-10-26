   const OpenAI = require('openai');
   const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

   async function getAIResponse(question, context) {
     const prompt = `Eres un asesor financiero IA. Datos: ${JSON.stringify(context)}. Pregunta: ${question}. Responde con recomendaciones.`;
     const response = await openai.chat.completions.create({
       model: 'gpt-3.5-turbo',
       messages: [{ role: 'user', content: prompt }],
     });
     return response.choices[0].message.content;
   }

   module.exports = { getAIResponse };
   