# Controle Financeiro - Web (JS/React)

## ✨ Funcionalidades

- **Autenticação:** Login e Cadastro via Firebase Auth.
- **Login Google:** Suporte a login rápido com conta Google.
- **Gestão Financeira:** Adição e exclusão de transações (Entradas/Saídas).
- **Dashboard:** Resumo de saldos e gráfico de fluxo mensal.
- **Filtro por Mês:** Visualize seus gastos de meses específicos.
- **Visual Moderno:** Interface com gradientes e sombras suaves.

## 🚀 Tecnologias

- **React + TypeScript**
- **Vite** (Build ultra-rápido)
- **Firebase** (Auth & Firestore)
- **Recharts** (Gráficos)
- **Lucide-React** (Ícones)
- **CSS Puro** (Leveza máxima)

## 🛠️ Como Rodar o Projeto

1.  Certifique-se de ter o [Node.js](https://nodejs.org/) instalado.
2.  Instale as dependências:
    ```bash
    npm install
    ```
3.  Inicie o servidor de desenvolvimento:
    ```bash
    npm run dev
    ```
4.  Abra o navegador no endereço indicado (geralmente `http://localhost:5173`).

## 🔥 Configuração do Firebase

Para que o projeto funcione corretamente (Autenticação e Banco de Dados), siga estas etapas no [Console do Firebase](https://console.firebase.google.com/):

### 1. Authentication
- Vá em **Sign-in method** e ative os provedores:
    - **E-mail/Senha** (Email/Password)
    - **Google**
- Vá em **Settings > Authorized domains** e adicione o domínio do seu site no GitHub Pages:
    - `caioalves99.github.io` (e `localhost` para testes locais).

### 2. Firestore Database (Regras de Segurança)
Vá em **Rules** e cole as seguintes regras para garantir que cada usuário só possa ver e editar seus próprios dados:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Permite que o usuário acesse apenas seus próprios documentos de transações
    match /users/{userId}/transactions/{transactionId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 📁 Estrutura do Projeto

- `src/components`: Componentes reutilizáveis (Gráficos, Cards).
- `src/pages`: Telas principais (Login, Dashboard).
- `src/services`: Integração com Firebase.
- `src/models`: Definições de tipos TypeScript.
- `src/firebase.ts`: Configuração do banco de dados.
- `src/index.css`: Estilização moderna com gradientes.
