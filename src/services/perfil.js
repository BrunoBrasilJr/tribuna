import { supabase } from "./supabase";

export async function nomeDisponivel(nome) {
  const { data, error } = await supabase
    .from("profiles")
    .select("id")
    .eq("nome", nome)
    .maybeSingle();

  if (error) return true;
  return !data;
}

export async function salvarUsername(usuarioId, nome) {
  const { error } = await supabase
    .from("profiles")
    .upsert({
      id: usuarioId,
      nome,
      nome_alterado_em: new Date().toISOString(),
    });
  return error;
}

export async function buscarPerfil(usuarioId) {
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", usuarioId)
    .maybeSingle();
  return data;
}

export async function buscarPerfilPublico(usuarioId) {
  const { data: perfil, error } = await supabase
    .from("profiles")
    .select("id, nome, bio, foto_url, clube_coracao, criado_em")
    .eq("id", usuarioId)
    .maybeSingle();

  if (error || !perfil) return null;

  const { data: posts } = await supabase
    .from("posts")
    .select(
      `
      id,
      texto,
      imagem_url,
      clube_tag,
      criado_em,
      autor_id,
      profiles ( nome, foto_url, clube_coracao ),
      curtidas ( usuario_id ),
      comentarios ( id )
    `,
    )
    .eq("autor_id", usuarioId)
    .order("criado_em", { ascending: false });

  const listaPosts = (posts || []).map((p) => ({
    ...p,
    totalCurtidas: p.curtidas ? p.curtidas.length : 0,
    totalComentarios: p.comentarios ? p.comentarios.length : 0,
  }));

  const curtidasRecebidas = listaPosts.reduce(
    (soma, p) => soma + p.totalCurtidas,
    0,
  );

  const { count: comentariosFeitos } = await supabase
    .from("comentarios")
    .select("id", { count: "exact", head: true })
    .eq("autor_id", usuarioId);

  return {
    perfil,
    posts: listaPosts,
    stats: {
      totalPosts: listaPosts.length,
      curtidasRecebidas,
      comentariosFeitos: comentariosFeitos || 0,
    },
  };
}

export async function torcidasPopulares() {
  const { data, error } = await supabase
    .from("profiles")
    .select("clube_coracao")
    .not("clube_coracao", "is", null);

  if (error || !data) return [];

  const contagem = {};
  for (const linha of data) {
    const clube = linha.clube_coracao;
    if (!clube) continue;
    contagem[clube] = (contagem[clube] || 0) + 1;
  }

  return Object.entries(contagem)
    .map(([nome, total]) => ({ nome, total }))
    .sort((a, b) => b.total - a.total);
}

export async function torcedoresAtivos(limite = 5) {
  const { data, error } = await supabase
    .from("posts")
    .select("autor_id, criado_em, profiles ( nome, foto_url )")
    .order("criado_em", { ascending: false })
    .limit(30);

  if (error || !data) return [];

  const vistos = new Set();
  const ativos = [];
  for (const post of data) {
    if (vistos.has(post.autor_id)) continue;
    vistos.add(post.autor_id);
    ativos.push({
      id: post.autor_id,
      nome: post.profiles?.nome || "Torcedor",
      foto_url: post.profiles?.foto_url || null,
    });
    if (ativos.length >= limite) break;
  }
  return ativos;
}
