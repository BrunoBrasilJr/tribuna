import { useState } from "react";
import { User, Trash2 } from "lucide-react";

function tempoRelativo(data) {
  const agora = new Date();
  const criado = new Date(data);
  const segundos = Math.floor((agora - criado) / 1000);

  if (segundos < 60) return "agora";
  const minutos = Math.floor(segundos / 60);
  if (minutos < 60) return `${minutos}min`;
  const horas = Math.floor(minutos / 60);
  if (horas < 24) return `${horas}h`;
  const dias = Math.floor(horas / 24);
  if (dias < 7) return `${dias}d`;
  return criado.toLocaleDateString("pt-BR");
}

function Post({ post, usuarioLogadoId, aoApagar }) {
  const [fotoFalhou, setFotoFalhou] = useState(false);
  const autor = post.profiles || {};
  const ehMeuPost = post.autor_id === usuarioLogadoId;
  const mostrarFoto = autor.foto_url && !fotoFalhou;

  return (
    <div className="post">
      <div className="post-cabecalho">
        <div className="post-avatar">
          {mostrarFoto ? (
            <img
              src={autor.foto_url}
              alt={autor.nome}
              onError={() => setFotoFalhou(true)}
            />
          ) : (
            <User size={20} className="post-avatar-vazio" />
          )}
        </div>

        <div className="post-info-autor">
          <span className="post-nome">{autor.nome || "Torcedor"}</span>
          <span className="post-tempo">{tempoRelativo(post.criado_em)}</span>
        </div>

        {post.clube_tag && (
          <span className="post-tag-clube">{post.clube_tag}</span>
        )}
      </div>

      <p className="post-texto">{post.texto}</p>

      {post.imagem_url && (
        <div className="post-imagem">
          <img src={post.imagem_url} alt="Imagem do post" />
        </div>
      )}

      {ehMeuPost && (
        <div className="post-acoes">
          <button className="post-apagar" onClick={() => aoApagar(post.id)}>
            <Trash2 size={15} /> Apagar
          </button>
        </div>
      )}
    </div>
  );
}

export default Post;
