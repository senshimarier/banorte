// ai-enhanced.js - Sistema de IA integrado con Google Gemini
class AIFinancialAssistant {
    constructor() {
        this.apiKey = null;
        this.geminiEndpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
        console.log('✅ AI Assistant inicializado (Google Gemini)');
    }

    async enhanceResults(formType, formData, backendResults) {
        if (!this.apiKey) {
            console.log('ℹ️ IA no disponible - API Key no configurada');
            return backendResults;
        }

        try {
            const aiContext = this.buildAIContext(formType, formData, backendResults);
            const aiResponse = await this.callGemini(aiContext);
            
            return {
                ...backendResults,
                aiInsights: aiResponse,
                enhanced: true
            };
        } catch (error) {
            console.error('❌ Error en IA:', error);
            return backendResults;
        }
    }

    buildAIContext(formType, formData, results) {
        const contexts = {
            'analizar': `Análisis financiero detallado para ${formData.tipo} con ID: ${formData.id}. 
                         Categoría: ${formData.categoria || 'Todas'}. 
                         Tipo de transacción: ${formData.tipoTransaccion || 'Todas'}.
                         Resultados del sistema: ${JSON.stringify(results)}`,
            
            'consultar': `Consulta de movimientos financieros en categoría ${formData.categoria} 
                          del ${formData.fechaInicio} al ${formData.fechaFin}. 
                          Tipo: ${formData.tipo}. 
                          Resultados: ${JSON.stringify(results)}`,
            
            'comparar': `Comparación de periodos financieros para categoría ${formData.categoria}. 
                         Periodo 1: ${formData.periodo1}, Periodo 2: ${formData.periodo2}. 
                         Tipo: ${formData.tipo}. 
                         Resultados: ${JSON.stringify(results)}`,
            
            'proyectar': `Proyección financiera a ${formData.meses || formData.trimestres} periodos
