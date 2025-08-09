document.addEventListener('DOMContentLoaded', () => {
    // Elementos da DOM
    const apiKeyInput = document.getElementById('api-key');
    const saveKeyButton = document.getElementById('save-key');
    const questionInput = document.getElementById('question');
    const askButton = document.getElementById('ask-button');
    const responseContainer = document.querySelector('.response-container');
    const responseContent = document.getElementById('response');
    const copyButton = document.getElementById('copy-button');
    const clearButton = document.getElementById('clear-button');

    // Carrega API Key salva (se existir)
    if (localStorage.getItem('openai_api_key')) {
        apiKeyInput.value = localStorage.getItem('openai_api_key');
    }

    // Event Listeners
    saveKeyButton.addEventListener('click', saveApiKey);
    askButton.addEventListener('click', askQuestion);
    copyButton.addEventListener('click', copyResponse);
    clearButton.addEventListener('click', clearResponse);

    // Função para salvar API Key
    function saveApiKey() {
        const apiKey = apiKeyInput.value.trim();
        if (apiKey) {
            localStorage.setItem('openai_api_key', apiKey);
            alert('Chave de API salva com sucesso!');
        } else {
            alert('Por favor, insira uma chave de API válida.');
        }
    }

    // Função principal para fazer perguntas à IA
    async function askQuestion() {
    const apiKey = localStorage.getItem('openai_api_key');
    const question = questionInput.value.trim();

          if (!apiKey) {
              alert('Por favor, insira e salve sua chave de API primeiro.');
              return;
          }

          if (!question) {
              alert('Por favor, digite uma pergunta.');
              return;
          }

          try {
              askButton.disabled = true;
              askButton.textContent = 'Processando...';
              responseContainer.classList.remove('hidden');
              responseContent.textContent = "Aguarde, processando sua pergunta...";

              console.log("Enviando para API:", { 
                  apiKey: apiKey.slice(0, 5) + '...', 
                  question: question 
              });

              const response = await fetchOpenAI(apiKey, question);
              
              if (!response) {
                  throw new Error("Resposta vazia da API");
              }
              
              displayResponse(response);
              
          } catch (error) {
              console.error('Erro detalhado:', error);
              displayResponse(`Erro: ${error.message}\n\nDetalhes completos no console (F12)`);
          } finally {
              askButton.disabled = false;
              askButton.textContent = 'Perguntar';
          }
      }

    // Função para fazer requisição à API OpenAI
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

          console.log("Status da resposta:", response.status);
          
          if (!response.ok) {
              const errorData = await response.json();
              console.error("Erro da API:", errorData);
              throw new Error(`API retornou status ${response.status}`);
          }

          const data = await response.json();
          console.log("Resposta completa:", data);
          
          return data.choices[0]?.message?.content || "Não foi possível obter a resposta";
      }

    // Funções auxiliares
    function displayResponse(text) {
        responseContent.textContent = text;
        responseContainer.classList.remove('hidden');
    }

    function copyResponse() {
        navigator.clipboard.writeText(responseContent.textContent);
        alert('Resposta copiada!');
    }

    function clearResponse() {
        responseContent.textContent = '';
        responseContainer.classList.add('hidden');
        questionInput.value = '';
        questionInput.focus();
    }

    async function getAIResponse(question) {
    try {
        // Tenta OpenAI primeiro
        return await fetchOpenAI(localStorage.getItem('openai_api_key'), question);
    } catch (error) {
        console.warn('Falha na OpenAI, tentando Gemini...', error);
        return await fetchGemini('SUA_CHAVE_GEMINI', question);
    }
}

});