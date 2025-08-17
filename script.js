document.addEventListener('DOMContentLoaded', () => {
  // Elementos da DOM
  const apiKeyInput = document.getElementById('campo-chave');
  const saveKeyButton = document.getElementById('botao-salvar');
  const modelSelector = document.getElementById('seletor-modelo');
  const questionInput = document.getElementById('campo-pergunta');
  const askButton = document.getElementById('botao-enviar');
  const clearButton = document.getElementById('botao-limpar');
  const copyButton = document.getElementById('botao-copiar');
  const responseContainer = document.getElementById('area-resposta');
  const responseContent = document.getElementById('texto-resposta');
  const previousQuestion = document.getElementById('pergunta-anterior');
  const spinner = document.getElementById('spinner');
  const charCounter = document.getElementById('contador-caracteres');
  const themeToggle = document.getElementById('toggle-theme');

  // ======================== CARREGAR CONFIGURAÇÕES ========================//
  loadSettings();
  loadTheme();
  updateKeyButtonDynamic();
  updateCharCounter();

  // ======================== EVENT LISTENERS ======================//
  askButton.addEventListener('click', askQuestion);
  clearButton.addEventListener('click', clearFields);
  copyButton.addEventListener('click', copyResponse);
  apiKeyInput.addEventListener('input', () => updateKeyButtonDynamic());
  modelSelector.addEventListener('change', saveSettings);
  questionInput.addEventListener('input', updateCharCounter);
  themeToggle?.addEventListener('click', toggleTheme);

  questionInput.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'Enter') askQuestion();
  });

  // ======================== FUNÇÕES DE CONFIGURAÇÃO =====================//
  function loadSettings() {
    const savedApiKey = localStorage.getItem('ai_assistant_api_key');
    const savedModel = localStorage.getItem('ai_assistant_model');
    if (savedApiKey) apiKeyInput.value = savedApiKey;
    if (savedModel) modelSelector.value = savedModel;
  }

  function saveSettings() {
    const apiKey = apiKeyInput.value.trim();
    const model = modelSelector.value;
    if (apiKey) localStorage.setItem('ai_assistant_api_key', apiKey);
    localStorage.setItem('ai_assistant_model', model);
  }

  // ======================== BOTÃO DE CHAVE DINÂMICO ========================//
  function updateKeyButtonDynamic() {
    const apiKey = apiKeyInput.value.trim();
    const savedKey = localStorage.getItem('ai_assistant_api_key');

    if (apiKey && apiKey !== savedKey) {
      // Campo preenchido e diferente da chave salva → botão SALVAR
      saveKeyButton.style.display = 'inline-flex';
      saveKeyButton.innerHTML = '<i class="fas fa-save"></i> Salvar';
      saveKeyButton.onclick = saveApiKey;
    } else if (savedKey) {
      // Há chave salva (campo vazio ou igual à salva) → botão LIMPAR
      saveKeyButton.style.display = 'inline-flex';
      saveKeyButton.innerHTML = '<i class="fas fa-eraser"></i> Limpar chave';
      saveKeyButton.onclick = clearApiKey;
    } else {
      // Nenhuma chave no campo nem no localStorage → botão escondido
      saveKeyButton.style.display = 'none';
    }
  }

  function saveApiKey() {
    const key = apiKeyInput.value.trim();
    if (!key) return;
    localStorage.setItem('ai_assistant_api_key', key);
    showNotification('Chave salva com sucesso!', 'success');
    updateKeyButtonDynamic();
  }

  function clearApiKey() {
    localStorage.removeItem('ai_assistant_api_key');
    apiKeyInput.value = '';
    showNotification('Chave removida!', 'info');
    updateKeyButtonDynamic();
  }

  // ======================== TOGGLE TEMA ==================//
  function loadTheme() {
    const theme = localStorage.getItem('ai_assistant_theme') || 'dark';
    if (theme === 'dark') document.body.classList.add('dark');
    updateThemeIcon(theme);
  }

  function toggleTheme() {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    localStorage.setItem('ai_assistant_theme', isDark ? 'dark' : 'light');
    updateThemeIcon(isDark ? 'dark' : 'light');
    showNotification(`Tema ${isDark ? 'Escuro' : 'Claro'} ativado!`, 'info');
  }

  function updateThemeIcon(theme) {
    if (!themeToggle) return;
    themeToggle.textContent = theme === 'dark' ? '🌙' : '☀️';
  }

  // ======================== CONTADOR DE CARACTERES =====================//
  function updateCharCounter() {
    const currentLength = questionInput.value.length;
    const maxLength = questionInput.getAttribute('maxlength');
    charCounter.textContent = `${currentLength} / ${maxLength}`;
    charCounter.style.color = currentLength > maxLength * 0.8 ? '#ff6b6b' : 'var(--text-secondary)';
  }

  // ======================== PERGUNTA =====================//
  async function askQuestion() {
    const apiKey = apiKeyInput.value.trim();
    const question = questionInput.value.trim();
    const model = modelSelector.value;

    if (!apiKey) return showNotification('Por favor, insira sua chave da API', 'error');
    if (!question) return showNotification('Por favor, digite uma pergunta', 'warning');

    try {
      setLoadingState(true);
      previousQuestion.textContent = `Pergunta: ${question}`;
      responseContainer.style.display = 'block';

      let response;
      if (model === 'gpt') response = await fetchOpenAI(apiKey, question);
      else if (model === 'gemini') response = await fetchGemini(apiKey, question);

      displayResponse(response, model);
      clearButton.style.display = 'inline-flex';
    } catch (error) {
      console.error('Erro na requisição:', error);
      displayError(error, model);
      clearButton.style.display = 'inline-flex';
    } finally {
      setLoadingState(false);
    }
  }

  function setLoadingState(isLoading) {
    askButton.disabled = isLoading;
    clearButton.disabled = isLoading;
    askButton.innerHTML = isLoading
      ? '<i class="fas fa-spinner fa-spin"></i> Processando...'
      : '<i class="fas fa-paper-plane"></i> Perguntar';
    spinner.style.display = isLoading ? 'block' : 'none';
    if (isLoading) responseContent.innerHTML = '';
  }

  // ======================== FETCH APIs ========================//
  async function fetchOpenAI(apiKey, question) {
    const endpoint = "https://api.openai.com/v1/chat/completions";
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: question }],
        temperature: 0.7,
        max_tokens: 1000
      })
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Erro desconhecido OpenAI');
    }
    const data = await response.json();
    return data.choices[0]?.message?.content || 'Resposta vazia recebida.';
  }

  async function fetchGemini(apiKey, question) {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=${apiKey}`;
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: question }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 1000, topK: 40, topP: 0.95 }
      })
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Erro desconhecido Gemini');
    }
    const data = await response.json();
    if (!data.candidates?.[0]?.content) throw new Error('Resposta inválida da API Gemini');
    return data.candidates[0].content.parts[0].text;
  }

  // ======================== DISPLAY =======================//
  function displayResponse(text, model) {
    if (!text) return displayError(new Error('Resposta vazia'), model);
    const modelName = model === 'gpt' ? 'GPT' : 'Gemini';
    const modelColor = model === 'gpt' ? '#10a37f' : '#4285f4';
    responseContent.innerHTML = `
      <div class="response-container">
        <div class="model-badge" style="background: linear-gradient(135deg, ${modelColor}, ${modelColor}dd);">
          <i class="fas fa-robot"></i> ${modelName}
        </div>
        <div class="response-text">${formatResponseText(text)}</div>
      </div>
    `;
    responseContent.style.opacity = '0';
    setTimeout(() => { responseContent.style.opacity = '1'; }, 100);
  }

  function formatResponseText(text) {
    return `<p>${text.replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>')
      .replace(/\*(.*?)\*/g,'<em>$1</em>')
      .replace(/`(.*?)`/g,'<code>$1</code>')
      .replace(/\n\n/g,'</p><p>')
      .replace(/\n/g,'<br>')}</p>`;
  }

  function displayError(error, model) {
    const modelName = model === 'gpt' ? 'GPT' : 'Gemini';
    responseContent.innerHTML = `
      <div class="error-container">
        <div class="error-badge"><i class="fas fa-exclamation-triangle"></i> Erro ${modelName}</div>
        <div class="error-text">
          <p><strong>Ocorreu um erro:</strong></p>
          <p>${error.message}</p>
          <p><strong>Sugestões:</strong></p>
          <ul>
            <li>Verifique sua chave da API</li>
            <li>Verifique créditos/cota</li>
            <li>Tente reformular a pergunta</li>
            <li>Verifique a conexão</li>
          </ul>
        </div>
      </div>
    `;
  }

  // ======================== COPY / LIMPAR / NOTIFICAÇÕES =================//
  async function copyResponse() {
    const responseText = responseContent.textContent || '';
    if (!responseText.trim()) return showNotification('Nenhuma resposta para copiar', 'warning');
    try {
      await navigator.clipboard.writeText(responseText);
      const originalIcon = copyButton.innerHTML;
      copyButton.innerHTML = '<i class="fas fa-check"></i> Copiado!';
      setTimeout(() => copyButton.innerHTML = originalIcon, 2000);
      showNotification('Resposta copiada!', 'success');
    } catch {
      showNotification('Erro ao copiar resposta', 'error');
    }
  }

  function clearFields() {
    questionInput.value = '';
    responseContent.innerHTML = '';
    previousQuestion.textContent = '';
    responseContainer.style.display = 'none';
    clearButton.style.display = 'none';
    updateCharCounter();
    updateKeyButtonDynamic();
    questionInput.focus();
    showNotification('Campos limpos!', 'info');
  }

  function showNotification(message, type = 'info') {
    document.querySelectorAll('.toast-notification').forEach(t => t.remove());
    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${type}`;
    const icons = { success:'fas fa-check-circle', error:'fas fa-exclamation-circle', warning:'fas fa-exclamation-triangle', info:'fas fa-info-circle' };
    toast.innerHTML = `<i class="${icons[type]}"></i> <span>${message}</span>`;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => { toast.classList.add('hide'); setTimeout(()=>toast.remove(), 300); }, 4000);
  }

  console.log('🤖 Assistente de IA Web carregado com sucesso!');
});
