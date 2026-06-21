# Tribuna

Rede social de futebol com placares ao vivo. O Tribuna combina o acompanhamento de partidas em tempo real com um espaço onde torcedores publicam e debatem sobre seus clubes, unindo dado e comunidade num só lugar.

Projeto desenvolvido para fins de aprendizado e portfólio.

## Sobre o projeto

A maioria das plataformas de placares ao vivo entrega apenas o dado bruto, sem espaço para a voz da torcida. O Tribuna propõe um caminho diferente: além dos jogos do dia, das ligas principais e da busca por times e competições, cada usuário escolhe seu clube do coração e participa de um feed onde a comunidade publica conteúdo sobre seus times.

## Funcionalidades

### Disponíveis

- Placares ao vivo das principais competições, atualizados a partir da API-Football
- Exibição de jogos do dia com escudos, bandeiras e status da partida (ao vivo, encerrado, agendado)
- Tradução dos nomes de seleções para português
- Tratamento visual para competições e times sem logo disponível
- Cache de requisições para uso eficiente da API
- Interface responsiva com tema escuro

### Planejadas

- [ ] Página de detalhes da partida com escalações, eventos e estatísticas
- [ ] Busca de times, jogadores e competições
- [ ] Cadastro e login de usuários
- [ ] Perfil editável (nome, foto e biografia)
- [ ] Seleção de clube do coração com personalização da experiência
- [ ] Feed da torcida com publicação de texto e imagem
- [ ] Moderação de conteúdo (filtro de imagem, denúncias e painel administrativo)

## Tecnologias

- React
- Vite
- React Router
- Lucide React (ícones)
- API-Football (dados de partidas)
- Supabase (autenticação e banco de dados) — em implementação

## Como executar localmente

Pré-requisitos: Node.js instalado.

Clonar o repositório:

    git clone https://github.com/BrunoBrasilJr/tribuna.git

Entrar na pasta:

    cd tribuna

Instalar as dependências:

    npm install

Rodar o projeto:

    npm run dev

O projeto utiliza uma chave da API-Football. Para rodar localmente, crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:

    VITE_API_FOOTBALL_KEY=sua_chave_aqui

A chave gratuita pode ser obtida em https://dashboard.api-football.com.

## Status

Em desenvolvimento. As funcionalidades de placares ao vivo estão operacionais; o módulo de rede social está em construção.

## Autor

Bruno Brasil

- GitHub: https://github.com/BrunoBrasilJr
- LinkedIn: https://www.linkedin.com/in/bruno-brasil-2474263a3/
