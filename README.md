# Projeto - Assistente de IA Web (Parte 2)

## Descrição

Nesta segunda parte do projeto, evoluímos nossa aplicação de IA, trazendo melhorias na experiência do usuário e adicionando novas funcionalidades.
O foco desta etapa é ampliar as interações possíveis e otimizar a interface, garantindo mais praticidade e organização no código.

> 📄 Histórico completo de alterações disponível no arquivo [CHANGELOG.md](./CHANGELOG.md).

---

## Funcionalidades Adicionadas

### 1. Botão Limpar Resposta

- Remove a resposta atual da tela.
- Esconde a seção de resposta.
- Limpa também o campo de pergunta.
- Confirmação antes de limpar (opcional).

### 2. Botão Copiar Resposta

- Copia o texto gerado pela IA.
- Usa a API `navigator.clipboard`.
- Feedback visual de cópia bem-sucedida.
- Tratamento de erro para clipboard indisponível.

### 3. Melhorias na Interface

- Exibição da pergunta junto com a resposta.
- Botões organizados de forma intuitiva.
- Ícones para melhor experiência do usuário.
- Animações de entrada para elementos.

### 4. Responsividade Aprimorada

- Layout otimizado para dispositivos móveis.
- Botões e elementos adaptados para toque.
- Textos ajustados para telas pequenas.

### 5. Funcionalidades Extras

- Contador de caracteres no campo de texto.
- Salvar API Key no `localStorage` (opcional).

---

## Organização de Branches

- Removemos branches antigas utilizadas apenas na Parte 1:
  - `tatiane-souza`
  - `lauane-lima2`
  - `mariana-macedo`
- A estrutura atual mantém apenas as branches essenciais para a Parte 2.

---

## Próximos Passos (Ideias para Extensão)

- Histórico de conversas.
- Tema escuro/claro.
- Suporte a múltiplos provedores (Anthropic, Google, etc.).
- Markdown rendering.
- Exportar conversas em PDF/arquivo.
- Atalhos de teclado.
- Testes em múltiplos dispositivos.
- Explorar novas APIs do navegador.

---

## Como Executar

1. Clone este repositório:

   ```bash
   git clone <URL_DO_REPOSITORIO>

---
2.Acesse a pasta do projeto:

cd nome-do-projeto

---

3.Instale as dependências:

npm install

---
4.Execute localmente:

npm start

---
## Tecnologias Utilizadas:

HTML5

CSS3

JavaScript (ES6+)

APIs do navegador
