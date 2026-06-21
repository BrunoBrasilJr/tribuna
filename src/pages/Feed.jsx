import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth-context";
import { supabase } from "../services/supabase";
import { buscarPosts, apagarPost } from "../services/posts";
import CriarPost from "../components/CriarPost";
import Post from "../components/Post";
import { Loader2, MessagesSquare } from "lucide-react";

function Feed() {
  const { usuario } = useAuth();
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [clubeCoracao, setClubeCoracao] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    if (!usuario) {
      navigate("/login");
      return;
    }

    async function carregar() {
      try {
        const { data: perfil } = await supabase
          .from("profiles")
          .select("clube_coracao")
          .eq("id", usuario.id)
          .maybeSingle();

        const clube = perfil?.clube_coracao ?? "";
        setClubeCoracao(clube);

        const lista = await buscarPosts(clube);
        setPosts(lista);
      } catch (e) {
        setErro(e.message);
      } finally {
        setCarregando(false);
      }
    }

    carregar();
  }, [usuario, navigate]);

  function aoCriarPost() {
    buscarPosts(clubeCoracao)
      .then(setPosts)
      .catch((e) => setErro(e.message));
  }

  async function aoApagar(postId) {
    try {
      await apagarPost(postId);
      setPosts((atual) => atual.filter((p) => p.id !== postId));
    } catch (e) {
      setErro(e.message);
    }
  }

  return (
    <div className="page">
      <h1>Feed da Torcida</h1>
      {clubeCoracao && (
        <p className="feed-sub">
          Mostrando primeiro os posts sobre o {clubeCoracao}
        </p>
      )}

      {usuario && <CriarPost usuario={usuario} aoCriar={aoCriarPost} />}

      {erro && <div className="auth-erro">{erro}</div>}

      {carregando ? (
        <div className="aviso">
          <Loader2 className="girando" />
          <span>Carregando o feed...</span>
        </div>
      ) : posts.length === 0 ? (
        <div className="aviso">
          <MessagesSquare />
          <span>Ainda não há posts. Seja o primeiro a publicar!</span>
        </div>
      ) : (
        <div className="feed-lista">
          {posts.map((post) => (
            <Post
              key={post.id}
              post={post}
              usuarioLogadoId={usuario?.id}
              aoApagar={aoApagar}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Feed;
