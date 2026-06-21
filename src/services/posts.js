import { supabase } from "./supabase";

export async function buscarPosts(clubeCoracao) {
  const { data, error } = await supabase
    .from("posts")
    .select(
      `
      id,
      texto,
      imagem_url,
      clube_tag,
      criado_em,
      autor_id,
      profiles ( nome, foto_url, clube_coracao )
    `,
    )
    .order("criado_em", { ascending: false });

  if (error) throw error;

  const posts = data || [];

  if (clubeCoracao) {
    posts.sort((a, b) => {
      const aDoClube = a.clube_tag === clubeCoracao ? 1 : 0;
      const bDoClube = b.clube_tag === clubeCoracao ? 1 : 0;
      if (aDoClube !== bDoClube) return bDoClube - aDoClube;
      return new Date(b.criado_em) - new Date(a.criado_em);
    });
  }

  return posts;
}

export async function criarPost({ autorId, texto, imagemUrl, clubeTag }) {
  const { data, error } = await supabase
    .from("posts")
    .insert({
      autor_id: autorId,
      texto,
      imagem_url: imagemUrl || null,
      clube_tag: clubeTag || null,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function apagarPost(postId) {
  const { error } = await supabase.from("posts").delete().eq("id", postId);
  if (error) throw error;
}

export async function enviarImagemPost(usuarioId, arquivo) {
  const extensao = arquivo.name.split(".").pop();
  const caminho = `${usuarioId}/${Date.now()}.${extensao}`;

  const { error: erroUpload } = await supabase.storage
    .from("posts")
    .upload(caminho, arquivo);

  if (erroUpload) throw erroUpload;

  const { data } = supabase.storage.from("posts").getPublicUrl(caminho);
  return data.publicUrl;
}
