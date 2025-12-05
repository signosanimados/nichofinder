# NichoFinder AI

Uma ferramenta completa de analise de nichos e tendencias virais para YouTube, alimentada por IA.

## Funcionalidades

### Nicho Finder
- Descubra seu nicho de ouro combinando paixoes, habilidades, mercado e monetizacao
- Receba 3-5 sugestoes de nichos personalizados
- Plano de acao de 7 dias para comecar

### Viral Analyzer
- Analise nichos, canais, palavras-chave ou tendencias
- Descubra o que esta viralizando no momento
- Padroes de titulos e thumbnails que funcionam
- 10+ ideias de videos virais
- Calendario de conteudo de 7 dias
- Micro-nichos promissores

### Recursos Extras
- **Historico de analises** - Todas suas analises ficam salvas
- **Export PDF** - Baixe relatorios completos em PDF
- **Dados do YouTube** - Integracao com YouTube Data API para dados reais
- **Backend seguro** - Suas API keys ficam no servidor

## Instalacao

### 1. Clone o repositorio

```bash
git clone <url-do-repo>
cd nichofinder
```

### 2. Instale as dependencias

```bash
npm run setup
```

### 3. Configure as variaveis de ambiente

```bash
cd server
cp .env.example .env
```

Edite o arquivo `.env` com suas API keys:

```env
# Obrigatorio
GEMINI_API_KEY=sua_chave_gemini_aqui

# Opcional (recomendado para dados reais do YouTube)
YOUTUBE_API_KEY=sua_chave_youtube_aqui
```

#### Como obter as API Keys:

**Gemini API Key:**
1. Acesse https://aistudio.google.com/app/apikey
2. Clique em "Create API Key"
3. Copie a chave

**YouTube Data API Key (opcional):**
1. Acesse https://console.cloud.google.com/
2. Crie um novo projeto ou selecione um existente
3. Ative a "YouTube Data API v3"
4. Va em Credentials > Create Credentials > API Key
5. Copie a chave

### 4. Inicie a aplicacao

```bash
npm start
```

Isso vai iniciar:
- Backend: http://localhost:3001
- Frontend: http://localhost:5173

## Uso

1. Acesse http://localhost:5173
2. Escolha entre **Nicho Finder** ou **Viral Analyzer**
3. Siga as instrucoes na tela
4. Explore os resultados
5. Exporte para PDF se desejar
6. Acesse o historico clicando no icone no canto inferior direito

## Estrutura do Projeto

```
nichofinder/
|-- server/                 # Backend Node.js
|   |-- index.js           # Servidor Express
|   |-- database.js        # SQLite database
|   |-- geminiService.js   # Integracao Gemini AI
|   |-- youtubeService.js  # Integracao YouTube API
|   |-- pdfService.js      # Geracao de PDFs
|   |-- .env.example       # Template de configuracao
|-- components/            # Componentes React
|-- services/              # Servicos do frontend
|-- App.tsx               # Componente principal
|-- types.ts              # TypeScript types
|-- constants.ts          # Constantes e prompts
```

## API Endpoints

| Metodo | Endpoint | Descricao |
|--------|----------|-----------|
| GET | /api/health | Health check |
| POST | /api/analyze/niche | Analise de nicho |
| POST | /api/analyze/viral | Analise viral |
| GET | /api/youtube/search | Busca no YouTube |
| GET | /api/history | Lista historico |
| GET | /api/history/:id | Busca analise especifica |
| DELETE | /api/history/:id | Deleta analise |
| POST | /api/export/pdf | Gera PDF |

## Tecnologias

- **Frontend:** React, TypeScript, Vite, Framer Motion, TailwindCSS
- **Backend:** Node.js, Express
- **Database:** SQLite (better-sqlite3)
- **AI:** Google Gemini 2.0 Flash
- **APIs:** YouTube Data API v3
- **PDF:** PDFKit
