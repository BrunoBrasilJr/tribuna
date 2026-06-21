import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth-context";
import { supabase } from "../services/supabase";
import { Loader2, Save, CheckCircle, Camera, User } from "lucide-react";

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

function Perfil() {
  const { usuario } = useAuth();
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [bio, setBio] = useState("");
  const [clube, setClube] = useState("");
  const [fotoUrl, setFotoUrl] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [enviandoFoto, setEnviandoFoto] = useState(false);
  const [salvo, setSalvo] = useState(false);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    if (!usuario) {
      navigate("/login");
      return;
    }

    async function carregarPerfil() {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", usuario.id)
        .maybeSingle();

      if (error) {
        setErro(error.message);
      } else if (data) {
        setNome(data.nome ?? "");
        setBio(data.bio ?? "");
        setClube(data.clube_coracao ?? "");
        setFotoUrl(data.foto_url ?? "");
      }
      setCarregando(false);
    }

    carregarPerfil();
  }, [usuario, navigate]);

  async function aoEscolherFoto(e) {
    const arquivo = e.target.files?.[0];
    if (!arquivo) return;

    setErro(null);
    setEnviandoFoto(true);

    const extensao = arquivo.name.split(".").pop();
    const caminho = `${usuario.id}/avatar.${extensao}`;

    const { error: erroUpload } = await supabase.storage
      .from("avatars")
      .upload(caminho, arquivo, { upsert: true });

    if (erroUpload) {
      setErro(erroUpload.message);
      setEnviandoFoto(false);
      return;
    }

    const { data } = supabase.storage.from("avatars").getPublicUrl(caminho);
    const urlComCacheBust = `${data.publicUrl}?t=${Date.now()}`;
    setFotoUrl(urlComCacheBust);

    await supabase.from("profiles").upsert({
      id: usuario.id,
      foto_url: urlComCacheBust,
    });

    setEnviandoFoto(false);
  }

  async function salvar() {
    setSalvando(true);
    setErro(null);
    setSalvo(false);

    const { error } = await supabase.from("profiles").upsert({
      id: usuario.id,
      nome,
      bio,
      clube_coracao: clube,
    });

    setSalvando(false);

    if (error) {
      setErro(error.message);
    } else {
      setSalvo(true);
      setTimeout(() => setSalvo(false), 2500);
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

  return (
    <div className="page">
      <div className="perfil-box">
        <h1>Meu Perfil</h1>
        <p className="perfil-email">{usuario?.email}</p>

        <div className="perfil-foto-area">
          <div className="perfil-foto">
            {fotoUrl ? (
              <img src={fotoUrl} alt="Foto de perfil" />
            ) : (
              <User size={40} className="perfil-foto-vazia" />
            )}
            {enviandoFoto && (
              <div className="perfil-foto-loading">
                <Loader2 className="girando" size={24} />
              </div>
            )}
          </div>

          <label className="perfil-foto-botao">
            <Camera size={16} />
            Trocar foto
            <input
              type="file"
              accept="image/*"
              onChange={aoEscolherFoto}
              style={{ display: "none" }}
            />
          </label>
        </div>

        <div className="auth-campo">
          <label>Nome de usuário</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Como você quer ser chamado"
            maxLength={40}
          />
        </div>

        <div className="auth-campo">
          <label>Biografia</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Fale um pouco sobre você e seu amor pelo futebol"
            maxLength={200}
            rows={3}
          />
        </div>

        <div className="auth-campo">
          <label>Clube do coração</label>
          <select value={clube} onChange={(e) => setClube(e.target.value)}>
            <option value="">Selecione seu clube</option>
            {CLUBES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {erro && <div className="auth-erro">{erro}</div>}

        <button className="auth-botao" onClick={salvar} disabled={salvando}>
          {salvando ? (
            <Loader2 className="girando" size={18} />
          ) : salvo ? (
            <>
              <CheckCircle size={18} /> Salvo!
            </>
          ) : (
            <>
              <Save size={18} /> Salvar perfil
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default Perfil;
