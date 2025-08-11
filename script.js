document.addEventListener('DOMContentLoaded', () => {
  // Elementos da DOM
  const apiKeyInput = document.getElementById('campo-chave');
  const modelSelector = document.getElementById('seletor-modelo');
  const questionInput = document.getElementById('campo-pergunta');
  const askButton = document.getElementById('botao-enviar');
  const responseContainer = document.getElementById('area-resposta');
  const responseContent = document.getElementById('texto-resposta');
  const spinner = document.getElementById('spinner');

  // Criação do botão limpar
  const limparButton = document.createElement('button');
  limparButton.id = 'botao-limpar';
  limparButton.textContent = 'Limpar';
  limparButton.style.display = 'none';
  askButton.parentNode.appendChild(limparButton);

  // Carregar configurações salvas
  if (localStorage.getItem('api_key')) {
    apiKeyInput.value = localStorage.getItem('api_key');
  }
  if (localStorage.getItem('preferred_model')) {
    modelSelector.value = localStorage.getItem('preferred_model');
  }

  // Event Listeners
  askButton.addEventListener('click', askQuestion);
  limparButton.addEventListener('click', limparCampos);
  apiKeyInput.addEventListener('change', saveSettings);
  modelSelector.addEventListener('change', saveSettings);

  // Função para validar chave Gemini
  async function validateGeminiKey(apiKey) {
    if (!apiKey.startsWith('AIza')) return false;
    
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro?key=${apiKey}`);
      return response.ok;
    } catch {
      return false;
    }
  }

  // Salvar configurações com validação
  async function saveSettings() {
    const apiKey = apiKeyInput.value.trim();
    const model = modelSelector.value;

    if (!apiKey) {
      showToast('Por favor, insira uma chave API', 'error');
      return;
    }

    if (model === 'gemini') {
      if (!apiKey.startsWith('AIza')) {
        showToast('Chave Gemini inválida! Deve começar com "AIza..."', 'error');
        return;
      }

      try {
        spinner.style.display = 'block';
        const isValid = await validateGeminiKey(apiKey);
        if (!isValid) {
          showToast('Chave Gemini não autorizada', 'error');
          return;
        }
      } finally {
        spinner.style.display = 'none';
      }
    }

    localStorage.setItem('api_key', apiKey);
    localStorage.setItem('preferred_model', model);
    showToast('Configurações salvas!', 'success');
  }

  // Função principal para perguntas
  async function askQuestion() {
    const apiKey = apiKeyInput.value.trim();
    const question = questionInput.value.trim();
    const model = modelSelector.value;

    if (!question) {
      showToast('Por favor, digite uma pergunta', 'warning');
      return;
    }

    try {
      // Configura UI durante processamento
      askButton.disabled = true;
      limparButton.disabled = true;
      askButton.textContent = 'Processando...';
      responseContent.textContent = '';
      responseContainer.style.display = 'block';
      spinner.style.display = 'block';
      limparButton.style.display = 'none';

      let response;
      if (model === 'gpt') {
        response = await fetchOpenAI(apiKey, question);
      } else if (model === 'gemini') {
        response = await fetchGemini(apiKey, question);
      }

      displayResponse(response, model);
      limparButton.style.display = 'inline-block';

    } catch (error) {
      console.error('Erro:', error);
      displayResponse(getErrorMessage(error, question), modelSelector.value);
      limparButton.style.display = 'inline-block';
    } finally {
      askButton.disabled = false;
      limparButton.disabled = false;
      askButton.textContent = 'Perguntar';
      spinner.style.display = 'none';
    }
  }

  // Função para OpenAI
  async function fetchOpenAI(apiKey, question) {
    const endpoint = "https://api.openai.com/v1/chat/completions";

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: question }],
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI: ${errorData.error?.message || 'Erro desconhecido'}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content;
  }

  // Função para Gemini (implementação completa)
  async function fetchGemini(apiKey, question) {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=${apiKey}`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: question }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Erro completo da API:", errorData);
      throw new Error(`Gemini: ${errorData.error?.message || 'Erro desconhecido'}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  }

  // Exibir resposta formatada
  function displayResponse(text, model) {
    const formattedText = text.replace(/\n/g, '<br>');
    
    if (model === 'gemini') {
      responseContent.innerHTML = `
        <div class="gemini-response">
          <span class="model-badge">Gemini</span>
          ${formattedText}
        </div>
      `;
    } else {
      responseContent.innerHTML = `
        <div class="openai-response">
          <span class="model-badge">GPT</span>
          ${formattedText}
        </div>
      `;
    }
  }

  // Mensagens de erro aprimoradas
  function getErrorMessage(error, question) {
    if (error.message.includes('quota')) {
      return `
        <div class="error-message">
          <h3>🔒 Limite de uso excedido</h3>
          <p>${error.message}</p>
          <ul>
            <li>Atualize seu plano em ${error.message.includes('OpenAI') ? 
              '<a href="https://platform.openai.com/account/billing" target="_blank">OpenAI</a>' : 
              '<a href="https://ai.google.dev/pricing" target="_blank">Google AI Studio</a>'}</li>
            <li>Experimente outro modelo</li>
          </ul>
        </div>
      `;
    }
    return `Erro: ${error.message}`;
  }

  // Limpar campos
  function limparCampos() {
    questionInput.value = '';
    responseContent.textContent = '';
    responseContainer.style.display = 'none';
    limparButton.style.display = 'none';
  }

  // Mostrar notificação
  function showToast(message, type) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }
});