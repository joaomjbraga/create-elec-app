# Changelog

Todas as alterações significativas deste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/spec/v2.0.0.html).

## [0.1.3] - 2026-04-04

### Adicionado

- Adicionar `edge-cases.test.ts` com 30 novos testes unitários
- Testar edge cases de `isValidPackageName` (caracteres especiais, unicode, hífens)
- Testar edge cases de `toValidPackageName` (múltiplos caracteres inválidos, tabs, quebras de linha)
- Testar `emptyDir` que preserva `.git` e trata diretórios não existentes
- Testar `copy` e `copyDir` com diretórios aninhados
- Testar `editFile` com várias modificações de conteúdo
- Adicionar scripts de teste: `test:watch`, `test:unit`, `test:integration`

## [0.1.2] - 2026-04-04

### Corrigido

- Verificação inválida de `dependencies` em `vite.config.ts` (sempre retornava true)
- Arquivos SVG não existentes sendo copiados do diretório `electron/`
- Geração de `vite.config.ts` com posicionamento incorreto de imports
- Problemas de idempotência em operações de edição de arquivos

### Refatorado

- Simplificação da geração de snippet IPC
- Regex melhorada para detecção de `plugins: [react()]`
- Melhores verificações de idempotência para `tsconfig.json` e `.gitignore`

### Removido

- Funções de cores não utilizadas (`gary`, `cyan`, `yellow`, `green`)
- Chamada desnecessária de `editFile` para `App.tsx`
- Código morto do codebase

### Manutenção

- Adicionado script `pretest` para build automático antes dos testes
- Atualizado teste para usar o nome correto `vite.svg`
- Adicionado tratamento de erros para `electron/package.json` ausente

## [0.1.1] - 2026-04-04

### Corrigido

- Melhorado electron main e preload com melhores comentários e API IPC

## [0.1.0] - 2026-04-04

### Adicionado

- Lançamento inicial
- Scaffold de Electron + Vite + React + TypeScript
- Configuração do Electron Builder
- Exemplo de comunicação IPC
- Testes unitários e de integração
