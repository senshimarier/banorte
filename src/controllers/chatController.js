/*exports.chatWithAI = async (req, res) => {
  const { question, type } = req.body;  // type opcional
  const context = await loadFinancialData(type || 'personales');
  const response = await getAIResponse(question, context);
  res.json({ response });
};
*/