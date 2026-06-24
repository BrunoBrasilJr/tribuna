import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth-context";
import { supabase } from "../services/supabase";
import { buscarPosts, apagarPost } from "../services/posts";
import { acharClubePorSlug } from "../services/clubes";
import Post from "../components/Post";
import {
  ArrowLeft,
  Users,
  Loader2,
  MessagesSquare,
  Shield,
} from "lucide-react";

function Torcida() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { usuario } = useAuth();

  const clube = acharClubePorSlug(slug);

  const [posts, setPosts] = useState([]);
  const [totalTorcedores, setTotalTorcedores] = useState(0);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    if (!clube) return;

    let ativo = true;

    async function carregar() {
      try {
        const { count } = await supabase
          .from("profiles")
          .select("id", { count: "exact", head: true })
          .eq("clube_coracao", clube.nome);

        const todos = await buscarPosts(null, usuario?.id);

        if (!ativo) return;
        setTotalTorcedores(count || 0);
        setPosts(todos.filter((p) => p.clube_tag === clube.nome));
      } catch {
        // silencioso
      } finally {
        if (ativo) setCarregando(false);
      }
    }

    carregar();

    return () => {
      ativo = false;
    };
  }, [clube, usuario]);

  async function aoApagar(postId) {
    try {
      await apagarPost(postId);
      setPosts((atual) => atual.filter((p) => p.id !== postId));
    } catch {
      // silencioso
    }
  }

  if (!clube) {
    return (
      <div className="page">
        <button className="jogo-voltar" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} /> Voltar
        </button>
        <div className="aviso erro">Clube não encontrado.</div>
      </div>
    );
  }

  return (
    <div className="page">
      <button className="jogo-voltar" onClick={() => navigate(-1)}>
        <ArrowLeft size={18} /> Voltar
      </button>

      <div className="torcida-header" style={{ "--cor-clube": clube.cor }}>
        <div className="torcida-escudo">
          <Shield size={32} />
        </div>
        <div className="torcida-info">
          <h1>{clube.nome}</h1>
          <div className="torcida-torcedores">
            <Users size={15} />
            <span>
              {totalTorcedores}{" "}
              {totalTorcedores === 1 ? "torcedor" : "torcedores"}
            </span>
          </div>
        </div>
      </div>

      <h2 className="jogo-secao">Mural da torcida</h2>

      {carregando ? (
        <div className="aviso">
          <Loader2 className="girando" />
          <span>Carregando...</span>
        </div>
      ) : posts.length === 0 ? (
        <div className="aviso">
          <MessagesSquare />
          <span>Nenhum post sobre o {clube.nome} ainda.</span>
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

export default Torcida;
