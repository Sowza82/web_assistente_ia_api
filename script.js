document.addEventListener('DOMContentLoaded', () => {
    // Elementos da DOM - Adaptados para o novo HTML
    const apiKeyInput = document.getElementById('campo-chave');
    const modelSelector = document.getElementById('seletor-modelo');
    const questionInput = document.getElementById('campo-pergunta');
    const askButton = document.getElementById('botao-enviar');
    const responseContainer = document.getElementById('area-resposta');
    const responseContent = document.getElementById('texto-resposta');

    // Carrega API Key salva (se existir)
    if (localStorage.getItem('api_key')) {
        apiKeyInput.value = localStorage.getItem('api_key');
    }

    // Carrega modelo preferido (se existir)
    if (localStorage.getItem('preferred_model')) {
        modelSelector.value = localStorage.getItem('preferred_model');
    }

    // Event Listeners
    askButton.addEventListener('click', askQuestion);
    apiKeyInput.addEventListener('change', saveSettings);
    modelSelector.addEventListener('change', saveSettings);

    // Função para salvar configurações
    function saveSettings() {
        const apiKey = apiKeyInput.value.trim();
        if (apiKey) {
            localStorage.setItem('api_key', apiKey);
        }
        localStorage.setItem('preferred_model', modelSelector.value);
    }

    // Função principal para fazer perguntas à IA
    async function askQuestion() {
        const apiKey = apiKeyInput.value.trim();
        const question = questionInput.value.trim();
        const model = modelSelector.value;

        if (!apiKey) {
            alert('Por favor, insira sua chave de API.');
            return;
        }

        if (!question) {
            alert('Por favor, digite uma pergunta.');
            return;
        }

        try {
            askButton.disabled = true;
            askButton.textContent = 'Processando...';
            responseContent.textContent = "Aguarde, processando sua pergunta...";

            let response;
            if (model === 'gpt') {
                response = await fetchOpenAI(apiKey, question);
            } else if (model === 'gemini') {
                // Implementação do Gemini viria aqui
                response = "Suporte ao Gemini ainda não implementado";
            }
            
            displayResponse(response);
            
        } catch (error) {
            console.error('Erro:', error);
            displayResponse(`Erro: ${error.message}`);
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

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Erro da API:", errorData);
            throw new Error(`Erro na API: ${errorData.error?.message || 'Erro desconhecido'}`);
        }

        const data = await response.json();
        return data.choices[0]?.message?.content || "Não foi possível obter a resposta";
    }

    // Função para exibir a resposta
    function displayResponse(text) {
        responseContent.innerHTML = text.replace(/\n/g, '<br>');
        responseContainer.style.display = 'block';
    }
});