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
