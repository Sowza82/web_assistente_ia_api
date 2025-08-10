# Assistente de IA Web

**Equipe CodeNova**

---

## Descrição

Aplicação web que conecta perguntas feitas pelo usuário a APIs de Inteligência Artificial (IA) para fornecer respostas em tempo real. Desenvolvida com HTML, CSS e JavaScript puro, sem frameworks — só código limpo e funcional.

Suporta atualmente os seguintes modelos:

- **GPT (OpenAI)** — integração oficial e estável.
- **Gemini (Google)** — integração experimental (API fictícia para testes).

---

## Tecnologias

- HTML5  
- CSS3 (tema escuro roxo, moderno e acessível)  
- JavaScript ES6+  
- [live-server](https://www.npmjs.com/package/live-server) (como devDependency para desenvolvimento local)

---

## Pré-requisitos

- Node.js e npm instalados (https://nodejs.org/)  
- Chave de API válida da OpenAI (começa com `sk-`)  
- Chave da API Google Gemini (atualmente experimental/fictícia)

---

## Dependências

- **live-server** (devDependency): servidor local para desenvolvimento que recarrega a página automaticamente ao salvar.  
Instalado com:

```bash
npm install --save-dev live-server

---
O comando para rodar o servidor está definido em package.json como:

npm start


---

Como clonar e rodar o projeto

1. Clone o repositório:



git clone https://github.com/Sowza82/web_assistente_ia_api.git

2. Entre na pasta:



cd web_assistente_ia_api

3. Instale as dependências:



npm install

4. Inicie o servidor local:



npm start

5. Abra no navegador o endereço:



http://localhost:3000


---

Como usar a aplicação

1. No campo Sua chave da API, cole sua chave válida da OpenAI (exemplo: sk-abcdef123456...).

A chave deve começar com "sk-" para ser aceita.

A chave é salva no localStorage para uso futuro.



2. Escolha o modelo:

GPT (OpenAI) — recomendado e estável.

Gemini (Google) — experimental e em desenvolvimento.



3. Digite sua pergunta no campo apropriado.


4. Clique no botão Perguntar.


5. Aguarde o spinner e visualize a resposta da IA na área de resposta.




---

Estrutura do projeto

/ (raiz)
├── index.html          # Estrutura da aplicação
├── style.css           # Estilos em CSS
├── script.js           # Lógica JavaScript para API e UI
├── package.json        # Configuração do projeto e dependências
└── README.md           # Este arquivo


---

Próximos passos e melhorias

Integração oficial da API Gemini quando liberada.

Melhorias na validação da chave e feedback para o usuário.

Suporte a mais APIs e modelos.

Implementação de testes automatizados.



---

Segurança

Não exponha sua chave de API publicamente.

Para produção, utilize variáveis de ambiente ou back-end para proteger a chave.



---