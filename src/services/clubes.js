export const CLUBES = [
  { nome: "Flamengo", slug: "flamengo", cor: "#E2271E" },
  { nome: "Palmeiras", slug: "palmeiras", cor: "#1B7A3D" },
  { nome: "Corinthians", slug: "corinthians", cor: "#000000" },
  { nome: "São Paulo", slug: "sao-paulo", cor: "#E5101D" },
  { nome: "Santos", slug: "santos", cor: "#111111" },
  { nome: "Grêmio", slug: "gremio", cor: "#0D80BF" },
  { nome: "Internacional", slug: "internacional", cor: "#E10E14" },
  { nome: "Cruzeiro", slug: "cruzeiro", cor: "#1B458F" },
  { nome: "Atlético-MG", slug: "atletico-mg", cor: "#111111" },
  { nome: "Vasco", slug: "vasco", cor: "#111111" },
  { nome: "Botafogo", slug: "botafogo", cor: "#111111" },
  { nome: "Fluminense", slug: "fluminense", cor: "#7A1228" },
  { nome: "Bahia", slug: "bahia", cor: "#0D80BF" },
  { nome: "Fortaleza", slug: "fortaleza", cor: "#0B3B8C" },
  { nome: "Athletico-PR", slug: "athletico-pr", cor: "#E30613" },
];

export function acharClubePorSlug(slug) {
  return CLUBES.find((c) => c.slug === slug) || null;
}

export function acharClubePorNome(nome) {
  return CLUBES.find((c) => c.nome === nome) || null;
}

export function slugDoClube(nome) {
  const c = acharClubePorNome(nome);
  return c ? c.slug : null;
}
