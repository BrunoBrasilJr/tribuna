import { useState } from "react";
import { Link } from "react-router-dom";
import { User, Heart, Trash2, MessageCircle } from "lucide-react";
import { curtirPost, descurtirPost } from "../services/posts";
import { slugDoClube } from "../services/clubes";
import Comentarios from "./Comentarios";

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

function Post({ post, usuarioLogadoId, usuario, aoApagar }) {
  const [fotoFalhou, setFotoFalhou] = useState(false);
  const [curtido, setCurtido] = useState(post.curtidoPorMim);
  const [total, setTotal] = useState(post.totalCurtidas);
  const [processando, setProcessando] = useState(false);
  const [mostrarComentarios, setMostrarComentarios] = useState(false);
  const [totalComentarios, setTotalComentarios] = useState(
    post.totalComentarios || 0,
  );

  const autor = post.profiles || {};
  const ehMeuPost = post.autor_id === usuarioLogadoId;
  const mostrarFoto = autor.foto_url && !fotoFalhou;
  const slugClube = post.clube_tag ? slugDoClube(post.clube_tag) : null;

  async function alternarCurtida() {
    if (!usuarioLogadoId || processando) return;

    setProcessando(true);
    const novoEstado = !curtido;

    setCurtido(novoEstado);
    setTotal((t) => t + (novoEstado ? 1 : -1));

    try {
      if (novoEstado) {
        await curtirPost(post.id, usuarioLogadoId);
      } else {
        await descurtirPost(post.id, usuarioLogadoId);
      }
    } catch {
      setCurtido(!novoEstado);
      setTotal((t) => t + (novoEstado ? -1 : 1));
    } finally {
      setProcessando(false);
    }
  }

  return (
    <div className="post">
      <div className="post-cabecalho">
        <Link to={`/usuario/${post.autor_id}`} className="post-avatar-link">
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
        </Link>

        <div className="post-info-autor">
          <Link to={`/usuario/${post.autor_id}`} className="post-nome-link">
            <span className="post-nome">{autor.nome || "Torcedor"}</span>
          </Link>
          <span className="post-tempo">{tempoRelativo(post.criado_em)}</span>
        </div>

        {post.clube_tag &&
          (slugClube ? (
            <Link
              to={`/torcida/${slugClube}`}
              className="post-tag-clube post-tag-link"
            >
              {post.clube_tag}
            </Link>
          ) : (
            <span className="post-tag-clube">{post.clube_tag}</span>
          ))}
      </div>

      <p className="post-texto">{post.texto}</p>

      {post.imagem_url && (
        <div className="post-imagem">
          <img src={post.imagem_url} alt="Imagem do post" />
        </div>
      )}

      <div className="post-rodape">
        <button
          className={`post-curtir ${curtido ? "curtido" : ""}`}
          onClick={alternarCurtida}
          disabled={!usuarioLogadoId}
        >
          <Heart size={17} fill={curtido ? "currentColor" : "none"} />
          <span>{total}</span>
        </button>

        <button
          className="post-comentar"
          onClick={() => setMostrarComentarios((v) => !v)}
        >
          <MessageCircle size={17} />
          <span>{totalComentarios}</span>
        </button>

        {ehMeuPost && (
          <button className="post-apagar" onClick={() => aoApagar(post.id)}>
            <Trash2 size={15} /> Apagar
          </button>
        )}
      </div>

      {mostrarComentarios && (
        <Comentarios
          postId={post.id}
          usuario={usuario}
          aoMudarTotal={(delta) => setTotalComentarios((t) => t + delta)}
        />
      )}
    </div>
  );
}

export default Post;
