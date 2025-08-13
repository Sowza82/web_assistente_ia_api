# Changelog - Parte 2

Todas as mudanças relevantes neste projeto serão documentadas aqui.

## [2.0.0] - 2025-08-13

### Alterações Gerais

- **Organização de branches**:
  Foram removidas as seguintes branches para manter a estrutura limpa e organizada:
  - `tatiane-souza`
  - `lauane-lima2`
  - `mariana-macedo`

  Motivo: essas branches já cumpriram seu papel na fase anterior e não serão mais utilizadas nesta etapa.

### Novas Funcionalidades

1. **Botão Limpar Resposta**
   - Limpa a resposta atual da tela.
   - Esconde a seção de resposta.
   - Limpa o campo de pergunta.
   - Confirmação antes de limpar (opcional).

2. **Botão Copiar Resposta**
   - Copia o texto da resposta gerada pela IA.
   - Usa `navigator.clipboard` API.
   - Feedback visual de sucesso.
   - Tratamento de erro caso o clipboard não esteja disponível.

3. **Melhorias na Interface**
   - Exibe a pergunta junto com a resposta.
   - Botões organizados de forma intuitiva.
   - Ícones nos botões para melhor UX.
   - Animações de entrada para elementos.

4. **Responsividade Aprimorada**
   - Layout otimizado para mobile.
   - Botões adaptados para touch.
   - Textos legíveis em telas pequenas.

5. **Funcionalidades Extras**
   - Contador de caracteres no `textarea`.
   - Salvar API Key no `localStorage` (opcional).

### Próximos Passos (Ideias para Extensão)

- Histórico de conversas.
- Tema Dark/Light.
- Suporte a múltiplos provedores (Anthropic, Google, etc.).
- Markdown rendering.
- Exportar conversas em arquivo/PDF.
- Atalhos de teclado.
- Testes em diferentes dispositivos.
- Outras APIs do navegador.

---
**Legenda:**

- `Adicionado` → Nova funcionalidade.
- `Removido` → Funcionalidade ou branch removida.
- `Alterado` → Ajuste em algo existente.
