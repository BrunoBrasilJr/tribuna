import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/auth-context";
import { buscarPerfilPublico } from "../services/perfil";
import { acharClubePorNome } from "../services/clubes";
import { apagarPost } from "../services/posts";
import Post from "../components/Post";
import {
  ArrowLeft,
  User,
  Loader2,
  Heart,
  MessageSquare,
  FileText,
  Shield,
  CalendarDays,
} from "lucide-react";

function PerfilPublico() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { usuario } = useAuth();

  const [dados, setDados] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [naoEncontrado, setNaoEncontrado] = useState(false);

  useEffect(() => {
    let ativo = true;

    buscarPerfilPublico(id)
      .then((resultado) => {
        if (!ativo) return;
        if (!resultado) {
          setNaoEncontrado(true);
          setDados(null);
        } else {
          setDados(resultado);
          setNaoEncontrado(false);
        }
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });

    return () => {
      ativo = false;
    };
  }, [id]);

  async function aoApagar(postId) {
    try {
      await apagarPost(postId);
      setDados((atual) => ({
        ...atual,
        posts: atual.posts.filter((p) => p.id !== postId),
        stats: { ...atual.stats, totalPosts: atual.stats.totalPosts - 1 },
      }));
    } catch {
      // silencioso
    }
  }

  if (carregando) {
    return (
      <div className="page">
        <div className="aviso">
          <Loader2 className="girando" />
          <span>Carregando perfil...</span>
        </div>
      </div>
    );
  }

  if (naoEncontrado || !dados) {
    return (
      <div className="page">
        <button className="jogo-voltar" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} /> Voltar
        </button>
        <div className="aviso erro">Usuário não encontrado.</div>
      </div>
    );
  }

  const { perfil, posts, stats } = dados;
  const clube = perfil.clube_coracao
    ? acharClubePorNome(perfil.clube_coracao)
    : null;
  const ehMeuPerfil = usuario?.id === perfil.id;

  const membroDesde = perfil.criado_em
    ? new Date(perfil.criado_em).toLocaleDateString("pt-BR", {
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className="page">
      <button className="jogo-voltar" onClick={() => navigate(-1)}>
        <ArrowLeft size={18} /> Voltar
      </button>

      <div
        className="pp-header"
        style={
          clube
            ? { "--cor-clube": clube.cor }
            : { "--cor-clube": "var(--brand)" }
        }
      >
        <div className="pp-capa"></div>

        <div className="pp-identidade">
          <div className="pp-avatar">
            {perfil.foto_url ? (
              <img src={perfil.foto_url} alt={perfil.nome} />
            ) : (
              <User size={44} className="perfil-foto-vazia" />
            )}
          </div>

          <div className="pp-nome-area">
            <h1>{perfil.nome || "Torcedor"}</h1>
            {clube ? (
              <Link to={`/torcida/${clube.slug}`} className="pp-clube">
                <span
                  className="pp-clube-bola"
                  style={{ background: clube.cor }}
                >
                  <Shield size={12} />
                </span>
                Torcedor do {clube.nome}
              </Link>
            ) : (
              <span className="pp-clube-vazio">Sem clube do coração</span>
            )}
            {membroDesde && (
              <span className="pp-membro">
                <CalendarDays size={13} /> Membro desde {membroDesde}
              </span>
            )}
          </div>
        </div>

        {perfil.bio && <p className="pp-bio">{perfil.bio}</p>}
      </div>

      <div className="pp-stats">
        <div className="pp-stat">
          <FileText size={18} className="pp-stat-ico" />
          <span className="pp-stat-num">{stats.totalPosts}</span>
          <span className="pp-stat-label">Posts</span>
        </div>
        <div className="pp-stat">
          <Heart size={18} className="pp-stat-ico" />
          <span className="pp-stat-num">{stats.curtidasRecebidas}</span>
          <span className="pp-stat-label">Curtidas recebidas</span>
        </div>
        <div className="pp-stat">
          <MessageSquare size={18} className="pp-stat-ico" />
          <span className="pp-stat-num">{stats.comentariosFeitos}</span>
          <span className="pp-stat-label">Comentários</span>
        </div>
      </div>

      <h2 className="jogo-secao">
        {ehMeuPerfil ? "Seus posts" : `Posts de ${perfil.nome}`}
      </h2>

      {posts.length === 0 ? (
        <div className="aviso">
          <FileText />
          <span>
            {ehMeuPerfil
              ? "Você ainda não publicou nada."
              : "Nenhum post ainda."}
          </span>
        </div>
      ) : (
        <div className="feed-lista">
          {posts.map((post) => (
            <Post
              key={post.id}
              post={post}
              usuarioLogadoId={usuario?.id}
              usuario={usuario}
              aoApagar={aoApagar}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default PerfilPublico;
