const API_KEY = import.meta.env.VITE_API_FOOTBALL_KEY;
const BASE_URL = "https://v3.football.api-sports.io";
const TIMEZONE = "America/Sao_Paulo";

const LIGAS_PRINCIPAIS = [71, 39, 135, 140, 61, 2, 1];

const CACHE_MINUTOS = 5;
const cache = {};

const TRADUCAO_TIMES = {
  Germany: "Alemanha",
  Netherlands: "Holanda",
  Sweden: "Suécia",
  "Ivory Coast": "Costa do Marfim",
  Ecuador: "Equador",
  Curacao: "Curaçao",
  Brazil: "Brasil",
  Haiti: "Haiti",
  Türkiye: "Turquia",
  Paraguay: "Paraguai",
  Tunisia: "Tunísia",
  Japan: "Japão",
  Spain: "Espanha",
  "Saudi Arabia": "Arábia Saudita",
  Belgium: "Bélgica",
  Iran: "Irã",
  "IR Iran": "Irã",
  Uruguay: "Uruguai",
  "Cape Verde Islands": "Cabo Verde",
  "New Zealand": "Nova Zelândia",
  Egypt: "Egito",
  Argentina: "Argentina",
  Austria: "Áustria",
  France: "França",
  Iraq: "Iraque",
  Norway: "Noruega",
  Senegal: "Senegal",
  Jordan: "Jordânia",
  Algeria: "Argélia",
  Portugal: "Portugal",
  Uzbekistan: "Uzbequistão",
  USA: "Estados Unidos",
  Australia: "Austrália",
  Scotland: "Escócia",
  Morocco: "Marrocos",
  Mexico: "México",
  "Korea Republic": "Coreia do Sul",
  "South Korea": "Coreia do Sul",
  Canada: "Canadá",
  Qatar: "Catar",
  Switzerland: "Suíça",
  "Bosnia and Herzegovina": "Bósnia e Herzegovina",
  Czechia: "Tchéquia",
  "South Africa": "África do Sul",
  England: "Inglaterra",
  Italy: "Itália",
  Croatia: "Croácia",
  Denmark: "Dinamarca",
  Poland: "Polônia",
  Colombia: "Colômbia",
  Wales: "País de Gales",
  Serbia: "Sérvia",
  Ghana: "Gana",
  Cameroon: "Camarões",
  Nigeria: "Nigéria",
  Panama: "Panamá",
  "Costa Rica": "Costa Rica",
};

export function traduzirTime(nome) {
  return TRADUCAO_TIMES[nome] || nome;
}

function hoje() {
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return fmt.format(new Date());
}

const ORDEM_STATUS = { "1H": 0, HT: 0, "2H": 0, ET: 0, LIVE: 0, NS: 1 };

function checarErrosDaApi(json) {
  const errs = json.errors;
  if (!errs) return;

  if (Array.isArray(errs)) {
    if (errs.length > 0) {
      throw new Error(
        "A API de futebol retornou um erro. Tente novamente em instantes.",
      );
    }
    return;
  }

  if (typeof errs === "object" && Object.keys(errs).length > 0) {
    const primeiro = Object.values(errs)[0];
    if (
      typeof primeiro === "string" &&
      primeiro.toLowerCase().includes("limit")
    ) {
      throw new Error(
        "O limite de consultas de hoje foi atingido. Tente novamente mais tarde.",
      );
    }
    throw new Error(
      "A API de futebol retornou um erro. Tente novamente em instantes.",
    );
  }
}

export async function buscarJogosDeHoje() {
  const data = hoje();
  const chaveCache = `jogos-${data}`;
  const agora = Date.now();

  if (
    cache[chaveCache] &&
    agora - cache[chaveCache].quando < CACHE_MINUTOS * 60 * 1000
  ) {
    return cache[chaveCache].dados;
  }

  const resposta = await fetch(
    `${BASE_URL}/fixtures?date=${data}&timezone=${TIMEZONE}`,
    { headers: { "x-apisports-key": API_KEY } },
  );

  if (!resposta.ok) {
    throw new Error(`Erro na API: ${resposta.status}`);
  }

  const json = await resposta.json();
  checarErrosDaApi(json);

  const jogos = (json.response || [])
    .filter((j) => LIGAS_PRINCIPAIS.includes(j.league.id))
    .sort((a, b) => {
      const sa = ORDEM_STATUS[a.fixture.status.short] ?? 2;
      const sb = ORDEM_STATUS[b.fixture.status.short] ?? 2;
      if (sa !== sb) return sa - sb;
      return new Date(a.fixture.date) - new Date(b.fixture.date);
    });

  cache[chaveCache] = { dados: jogos, quando: agora };
  return jogos;
}

export async function buscarDetalhesJogo(fixtureId) {
  const chaveCache = `detalhe-${fixtureId}`;
  const agora = Date.now();

  if (
    cache[chaveCache] &&
    agora - cache[chaveCache].quando < CACHE_MINUTOS * 60 * 1000
  ) {
    return cache[chaveCache].dados;
  }

  const resposta = await fetch(
    `${BASE_URL}/fixtures?id=${fixtureId}&timezone=${TIMEZONE}`,
    { headers: { "x-apisports-key": API_KEY } },
  );

  if (!resposta.ok) {
    throw new Error(`Erro na API: ${resposta.status}`);
  }

  const json = await resposta.json();
  checarErrosDaApi(json);

  const detalhe = (json.response || [])[0] || null;

  cache[chaveCache] = { dados: detalhe, quando: agora };
  return detalhe;
}
