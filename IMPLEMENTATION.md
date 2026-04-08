# 🏗️ Documentação de Implementação — FinTrack

Este documento detalha as etapas de construção do projeto FinTrack, um controle financeiro multiplataforma desenvolvido com Flutter e Firebase.

---

## 📅 Etapa 1: Setup Inicial e Dependências
**Ação:** Inicialização do projeto e configuração do ecossistema.
- Executado `flutter create` para gerar a base do projeto.
- Configurado `pubspec.yaml` com as bibliotecas essenciais:
  - `firebase_core` & `firebase_auth` & `cloud_firestore`: Core do Backend.
  - `fl_chart`: Motor de gráficos modernos.
  - `intl`: Formatação de moedas (R$) e datas brasileiras.
  - `provider`: Gerenciamento de estado simples e eficiente.
  - `google_fonts`: Importação das fontes **Syne** (Títulos) e **DM Mono** (Dados).

---

## 📂 Etapa 2: Estrutura de Pastas (Arquitetura)
**Ação:** Organização do código seguindo padrões de escalabilidade.
- `lib/models/`: Definição dos objetos de dados.
- `lib/services/`: Lógica de comunicação com Firebase (Auth e DB).
- `lib/screens/`: Interfaces principais (Login, Dashboard).
- `lib/widgets/`: Componentes reutilizáveis (Cards, Gráficos).

---

## 🔧 Etapa 3: Camada de Dados (Model & Services)
**Ação:** Implementação da lógica de negócio e persistência.
- **`transaction.dart`**: Criado o modelo `FinanceTransaction` que mapeia os campos do Firestore (descrição, valor, tipo, data, mês, ícone).
- **`firestore_service.dart`**: Implementado o CRUD completo. As queries são filtradas por `userId` e `month`, garantindo que você veja apenas os dados do mês selecionado.
- **`auth_service.dart`**: Gerenciamento de login e cadastro via Firebase Authentication.

---

## 🎨 Etapa 4: Identidade Visual e UI
**Ação:** Transposição do protótipo visual para código Flutter.
- **`theme.dart`**: Centralização de cores (Dark Mode) e estilos de texto.
- **`summary_card.dart`**: Widget customizado para exibir Entradas, Saídas e Saldo com indicadores de variação.
- **`bar_chart_widget.dart`**: Integração com a biblioteca `fl_chart` para exibir o gráfico de colunas comparativo.
- **`dashboard_screen.dart`**: 
  - Sidebar funcional com navegação de meses.
  - Topbar com botão de "Nova Transação".
  - Lista dinâmica que consome o `Stream` do Firestore.
  - Modal (Dialog) para inserção de novas despesas/receitas.

---

## 🚀 Etapa 5: Deploy e CI/CD
**Ação:** Automatização da hospedagem.
- **`.github/workflows/deploy.yml`**: Configurado GitHub Actions que:
  1. Instala o Flutter no servidor do GitHub.
  2. Compila a versão Web (`release`).
  3. Sobe automaticamente para o **GitHub Pages**.

---

## 🛠️ Próximas Etapas Necessárias (Ação do Usuário)
Para que o projeto funcione no seu ambiente real, siga este passo a passo detalhado:

### 1. Configuração do Firebase CLI
- Se ainda não tiver, instale as ferramentas do Firebase globalmente via npm:
  ```bash
  npm install -g firebase-tools
  ```
- Realize o login na sua conta Google vinculada ao Firebase:
  ```bash
  firebase login
  ```

### 2. Instalação do FlutterFire CLI
- Ative o CLI do FlutterFire para facilitar a configuração do ambiente Flutter:
  ```bash
  dart pub global activate flutterfire_cli
  ```
- *Nota: Certifique-se de que o diretório de binários do Dart está no seu PATH.*

### 3. Vinculação com o Projeto Firebase
- Na raiz do projeto `controle_financeiro`, execute o comando:
  ```bash
  flutterfire configure
  ```
- Selecione seu projeto existente ou crie um novo.
- Escolha as plataformas desejadas (Android, iOS, Web).
- Isso atualizará/criará o arquivo `lib/firebase_options.dart` com as chaves de API corretas.

### 4. Configurações no Console do Firebase
Acesse o [Console do Firebase](https://console.firebase.google.com/) e configure os serviços:

- **Authentication:**
  - Vá em **Build > Authentication > Get Started**.
  - Na aba **Sign-in method**, ative o provedor **Email/Password**.

- **Cloud Firestore:**
  - Vá em **Build > Firestore Database > Create database**.
  - Escolha o local do servidor (ex: `southamerica-east1` para o Brasil).
  - Inicie em **Modo de Produção**.
  - Na aba **Rules (Regras)**, aplique as regras de segurança abaixo para garantir a privacidade dos dados:
    ```javascript
    rules_version = '2';
    service cloud.firestore {
      match /databases/{database}/documents {
        match /transactions/{transactionId} {
          allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
          allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
        }
      }
    }
    ```

### 5. Execução
- Com tudo configurado, instale as dependências e rode o app:
  ```bash
  flutter pub get
  ```
  ```bash
  flutter run
  ```
