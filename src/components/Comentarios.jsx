import { useEffect, useState } from "react";
import { User, Send, Loader2, Trash2 } from "lucide-react";
import {
  buscarComentarios,
  criarComentario,
  apagarComentario,
} from "../services/posts";

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

function Comentarios({ postId, usuario, aoMudarTotal }) {
  const [comentarios, setComentarios] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [texto, setTexto] = useState("");
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    buscarComentarios(postId)
      .then(setComentarios)
      .catch(() => {})
      .finally(() => setCarregando(false));
  }, [postId]);

  async function enviar() {
    if (!texto.trim() || enviando) return;
    setEnviando(true);
    try {
      const novo = await criarComentario(postId, usuario.id, texto.trim());
      setComentarios((atual) => [...atual, novo]);
      setTexto("");
      aoMudarTotal(1);
    } catch {
      // silencioso
    } finally {
      setEnviando(false);
    }
  }

  async function apagar(id) {
    try {
      await apagarComentario(id);
      setComentarios((atual) => atual.filter((c) => c.id !== id));
      aoMudarTotal(-1);
    } catch {
      // silencioso
    }
  }

  return (
    <div className="comentarios">
      <div className="comentario-criar">
        <input
          type="text"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Escreva um comentário..."
          maxLength={300}
          onKeyDown={(e) => e.key === "Enter" && enviar()}
        />
        <button onClick={enviar} disabled={enviando || !texto.trim()}>
          {enviando ? (
            <Loader2 size={16} className="girando" />
          ) : (
            <Send size={16} />
          )}
        </button>
      </div>

      {carregando ? (
        <div className="comentario-vazio">Carregando comentários...</div>
      ) : comentarios.length === 0 ? (
        <div className="comentario-vazio">
          Nenhum comentário ainda. Seja o primeiro.
        </div>
      ) : (
        <div className="comentario-lista">
          {comentarios.map((c) => {
            const autor = c.profiles || {};
            const meu = c.autor_id === usuario?.id;
            return (
              <div key={c.id} className="comentario">
                <div className="comentario-avatar">
                  {autor.foto_url ? (
                    <img src={autor.foto_url} alt={autor.nome} />
                  ) : (
                    <User size={15} className="post-avatar-vazio" />
                  )}
                </div>
                <div className="comentario-corpo">
                  <div className="comentario-cab">
                    <span className="comentario-nome">
                      {autor.nome || "Torcedor"}
                    </span>
                    <span className="comentario-tempo">
                      {tempoRelativo(c.criado_em)}
                    </span>
                    {meu && (
                      <button
                        className="comentario-apagar"
                        onClick={() => apagar(c.id)}
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                  <p className="comentario-texto">{c.texto}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Comentarios;
