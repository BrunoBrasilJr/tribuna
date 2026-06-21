import { useState } from "react";
import { ImagePlus, Send, Loader2, X } from "lucide-react";
import { criarPost, enviarImagemPost } from "../services/posts";

const CLUBES = [
  "Flamengo",
  "Palmeiras",
  "Corinthians",
  "São Paulo",
  "Santos",
  "Grêmio",
  "Internacional",
  "Cruzeiro",
  "Atlético-MG",
  "Vasco",
  "Botafogo",
  "Fluminense",
  "Bahia",
  "Fortaleza",
  "Athletico-PR",
];

function CriarPost({ usuario, aoCriar }) {
  const [texto, setTexto] = useState("");
  const [clubeTag, setClubeTag] = useState("");
  const [arquivo, setArquivo] = useState(null);
  const [previa, setPrevia] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState(null);

  function aoEscolherImagem(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    setArquivo(f);
    setPrevia(URL.createObjectURL(f));
  }

  function removerImagem() {
    setArquivo(null);
    setPrevia(null);
  }

  async function publicar() {
    if (!texto.trim()) {
      setErro("Escreva algo antes de publicar.");
      return;
    }

    setEnviando(true);
    setErro(null);

    try {
      let imagemUrl = null;
      if (arquivo) {
        imagemUrl = await enviarImagemPost(usuario.id, arquivo);
      }

      const novo = await criarPost({
        autorId: usuario.id,
        texto: texto.trim(),
        imagemUrl,
        clubeTag,
      });

      setTexto("");
      setClubeTag("");
      removerImagem();
      aoCriar(novo);
    } catch (e) {
      setErro(e.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="criar-post">
      <textarea
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder="No que você está pensando sobre o futebol de hoje?"
        maxLength={500}
        rows={3}
      />

      {previa && (
        <div className="criar-post-previa">
          <img src={previa} alt="Prévia" />
          <button className="criar-post-remover" onClick={removerImagem}>
            <X size={16} />
          </button>
        </div>
      )}

      {erro && <div className="auth-erro">{erro}</div>}

      <div className="criar-post-barra">
        <label className="criar-post-icone">
          <ImagePlus size={20} />
          <input
            type="file"
            accept="image/*"
            onChange={aoEscolherImagem}
            style={{ display: "none" }}
          />
        </label>

        <select
          className="criar-post-select"
          value={clubeTag}
          onChange={(e) => setClubeTag(e.target.value)}
        >
          <option value="">Sem clube</option>
          {CLUBES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <button
          className="criar-post-botao"
          onClick={publicar}
          disabled={enviando}
        >
          {enviando ? (
            <Loader2 className="girando" size={18} />
          ) : (
            <>
              <Send size={16} /> Publicar
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default CriarPost;
