# Tribuna

Rede social de futebol com placares ao vivo. O Tribuna une o acompanhamento de partidas em tempo real com um espaço onde torcedores publicam, curtem e debatem sobre futebol — combinando dado e comunidade num só lugar.

**Acesse o projeto no ar:** https://tribuna-seven.vercel.app

Projeto desenvolvido para fins de aprendizado e portfólio.

## Sobre o projeto

A maioria das plataformas de placares ao vivo entrega apenas o dado bruto, sem espaço para a voz da torcida. O Tribuna propõe um caminho diferente: além dos jogos do dia e dos detalhes de cada partida, cada usuário escolhe seu clube do coração, participa de um feed social e tem uma página de torcida dedicada a cada clube.

## Funcionalidades

- Placares ao vivo das principais competições (Brasileirão, Premier League, La Liga, Serie A, Ligue 1, Champions League e Copa do Mundo), atualizados pela API-Football
- Página de detalhes da partida com placar, informações do jogo e timeline de eventos (gols, cartões e substituições)
- Cadastro e login por e-mail/senha e login social com Google
- Perfil editável com nome, biografia, foto de perfil e clube do coração
- Feed da torcida: publicação de posts com texto e imagem, marcação opcional de clube e priorização dos posts do clube do coração
- Curtidas e comentários nos posts, com atualização instantânea (otimista)
- Página de torcida por clube, com identidade visual do time, contagem de torcedores e mural exclusivo
- Busca de torcidas na barra de navegação, com desfoque de fundo
- Tradução de nomes de seleções e tratamento visual para times e competições sem logo
- Interface responsiva com tema escuro, animações e carregamento por skeletons
- Tratamento de falhas da API com mensagem clara e opção de tentar novamente

## Tecnologias

- React + Vite
- React Router
- Supabase (autenticação, banco de dados PostgreSQL e storage de imagens)
- API-Football (dados de partidas)
- Lucide React (ícones)
- Vercel (hospedagem com deploy contínuo)

## Decisões técnicas

Algumas escolhas que valem destacar:

- **Segurança no banco (Row Level Security):** todas as tabelas usam políticas de RLS no Supabase, garantindo que cada usuário só possa editar ou apagar os próprios dados (perfil, posts, curtidas, comentários), mesmo que a chave pública esteja exposta no front-end.
- **Cache de requisições:** as respostas da API-Football são guardadas em memória por alguns minutos, reduzindo o consumo do limite diário do plano gratuito.
- **Atualização otimista:** curtidas e comentários refletem na interface imediatamente, antes da confirmação do servidor, com reversão automática em caso de falha.
- **Design defensivo:** quando um escudo, logo ou foto não carrega, a interface exibe um fallback elegante em vez de imagem quebrada.
- **Variáveis de ambiente:** chaves de API e credenciais ficam fora do código versionado, configuradas localmente e na hospedagem.

## Como executar localmente

Pré-requisitos: Node.js instalado.

Clonar o repositório:

    git clone https://github.com/BrunoBrasilJr/tribuna.git

Entrar na pasta:

    cd tribuna

Instalar as dependências:

    npm install

Criar um arquivo `.env` na raiz com as chaves necessárias:

    VITE_API_FOOTBALL_KEY=sua_chave_da_api_football
    VITE_SUPABASE_URL=sua_url_do_supabase
    VITE_SUPABASE_KEY=sua_chave_publica_do_supabase

Rodar o projeto:

    npm run dev

A chave gratuita da API-Football pode ser obtida em https://dashboard.api-football.com e as credenciais do Supabase no painel do projeto em https://supabase.com.

## Status

Em desenvolvimento contínuo. As funcionalidades principais estão operacionais e o projeto está hospedado e acessível ao público.

## Autor

Bruno Brasil

- GitHub: https://github.com/BrunoBrasilJr
- LinkedIn: https://www.linkedin.com/in/bruno-brasil-2474263a3/
