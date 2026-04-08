# Documentação do Projeto: FinTrack

## 1. Finalidade do Projeto
O **FinTrack** é um aplicativo de controle financeiro pessoal desenvolvido em Flutter. Sua principal função é permitir que os usuários gerenciem suas entradas (receitas) e saídas (despesas), visualizem seu saldo atual e acompanhem sua saúde financeira através de gráficos e históricos mensais.

## 2. Lógica de Funcionamento
O projeto segue uma arquitetura modular, separando a interface do usuário (UI) da lógica de negócios e persistência de dados.

- **Fluxo de Autenticação**: O aplicativo inicia no `AuthWrapper`. Se o usuário estiver autenticado via Firebase, ele é direcionado para a `DashboardScreen`; caso contrário, é enviado para a `LoginScreen`.
- **Gerenciamento de Estado**: Utiliza o pacote `Provider` para injetar serviços (`AuthService` e `FirestoreService`) e escutar as mudanças no estado do usuário autenticado de forma reativa.
- **Persistência de Dados**: Os dados são armazenados no **Google Cloud Firestore**. As transações são organizadas por usuário (subcoleções dentro de documentos de usuários) para garantir privacidade e segurança.
- **Filtragem**: As transações possuem um campo `month` (formato "yyyy-MM"), permitindo que o aplicativo carregue apenas os dados relevantes para o mês selecionado, otimizando o uso de dados.

## 3. Bibliotecas Utilizadas e Motivação

### **Core & UI**
- **`flutter`**: SDK principal para o desenvolvimento cross-platform.
- **`google_fonts`**: Utilizado para aplicar tipografia personalizada de forma dinâmica, melhorando a estética sem aumentar o tamanho do repositório com arquivos de fonte.
- **`cupertino_icons`**: Ícones padrão do iOS para manter a consistência visual.

### **Backend & Autenticação (Firebase)**
- **`firebase_core`**: Base necessária para utilizar qualquer serviço do Firebase.
- **`firebase_auth`**: Gerencia o sistema de login e cadastro. Escolhido pela segurança robusta e facilidade de implementação de múltiplos métodos de autenticação.
- **`cloud_firestore`**: Banco de dados NoSQL em tempo real. Escolhido pela capacidade de sincronização automática entre dispositivos e escalabilidade.

### **Ferramentas de Dados**
- **`provider`**: Utilizado para o gerenciamento de estado e injeção de dependências. É a recomendação oficial da equipe do Flutter para aplicativos de médio porte devido à sua simplicidade e performance.
- **`fl_chart`**: Biblioteca para criação de gráficos (Pizza, Linhas, Barras). Fundamental para a visualização de dados financeiros de forma intuitiva.
- **`intl`**: Essencial para a internacionalização e formatação de moedas (R$) e datas brasileiras, garantindo que os valores financeiros sejam exibidos corretamente.

## 4. Estrutura de Pastas
- `lib/models/`: Contém as classes de dados (ex: `FinanceTransaction`).
- `lib/services/`: Contém a lógica de comunicação com o Firebase (`Auth` e `Firestore`).
- `lib/screens/`: Telas principais do aplicativo.
- `lib/widgets/`: Componentes de UI reutilizáveis (ex: cards de resumo).
- `lib/theme.dart`: Centraliza a configuração visual (Cores, Estilos de Texto) do app.

---
Este relatório serve como guia para desenvolvedores que desejam entender ou expandir as funcionalidades do FinTrack.
