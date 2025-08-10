document.addEventListener('DOMContentLoaded', () => {
    const apiKeyInput = document.getElementById('campo-chave');
    const modelSelector = document.getElementById('seletor-modelo');
    const questionInput = document.getElementById('campo-pergunta');
    const askButton = document.getElementById('botao-enviar');
    const responseContainer = document.getElementById('area-resposta');
    const responseContent = document.getElementById('texto-resposta');
    const spinner = document.getElementById('spinner');

    // Carregar configs salvas
    if (localStorage.getItem('api_key')) {
        apiKeyInput.value = localStorage.getItem('api_key');
    }
    if (localStorage.getItem('preferred_model')) {
        modelSelector.value = localStorage.getItem('preferred_model');
    }

    // Eventos
    askButton.addEventListener('click', askQuestion);
    apiKeyInput.addEventListener('change', saveSettings);
    modelSelector.addEventListener('change', saveSettings);

    // Salvar configurações com validação
    function saveSettings() {
        const apiKey = apiKeyInput.value.trim();
        if (apiKey && apiKey.startsWith('sk-')) {
            localStorage.setItem('api_key', apiKey);
        } else {
            alert('Chave de API inválida. Deve começar com "sk-".');
            localStorage.removeItem('api_key');
            apiKeyInput.value = '';
            return;
        }
        localStorage.setItem('preferred_model', modelSelector.value);
    }

    // Função principal para perguntar à IA
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
            responseContent.textContent = '';
            responseContainer.style.display = 'block';
            spinner.style.display = 'block';

            let response;
            if (model === 'gpt') {
                response = await fetchOpenAI(apiKey, question, 'gpt-3.5-turbo');
            } else if (model === 'gemini') {
                response = await fetchGemini(apiKey, question);
            } else {
                response = "Modelo desconhecido selecionado.";
            }

            displayResponse(response);

        } catch (error) {
            console.error('Erro:', error);
            displayResponse(`Erro: ${error.message}`);
        } finally {
            askButton.disabled = false;
            askButton.textContent = 'Perguntar';
            spinner.style.display = 'none';
        }
    }

    // Fetch para OpenAI
    async function fetchOpenAI(apiKey, question, model) {
        const endpoint = "https://api.openai.com/v1/chat/completions";

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: model,
                messages: [{ role: 'user', content: question }],
                temperature: 0.7
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Erro da API OpenAI:", errorData);
            throw new Error(`Erro na API OpenAI: ${errorData.error?.message || 'Erro desconhecido'}`);
        }

        const data = await response.json();
        return data.choices[0]?.message?.content || "Não foi possível obter a resposta";
    }

    // Fetch para Gemini (exemplo fictício)
    async function fetchGemini(apiKey, question) {
        const endpoint = "https://api.google.com/gemini/v1/chat/completions"; // ajustar quando oficial

        const body = {
            model: "gemini-1",
            messages: [{ role: "user", content: question }],
            temperature: 0.7
        };

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Erro na API Gemini:", errorData);
            throw new Error(`Erro na API Gemini: ${errorData.error?.message || 'Erro desconhecido'}`);
        }

        const data = await response.json();

        return data.choices[0]?.message?.content || "Não foi possível obter resposta do Gemini";
    }

    // Exibir resposta
    function displayResponse(text) {
        responseContent.innerHTML = text.replace(/\n/g, '<br>');
        responseContent.style.display = 'block';
    }
});
