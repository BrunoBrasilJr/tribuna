import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth-context";
import { supabase } from "../services/supabase";
import { nomeDisponivel } from "../services/perfil";
import {
  Loader2,
  Save,
  CheckCircle,
  Camera,
  User,
  Pencil,
  Check,
  X,
} from "lucide-react";

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

const DIAS_BLOQUEIO = 14;

function Perfil() {
  const { usuario } = useAuth();
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [nomeOriginal, setNomeOriginal] = useState("");
  const [nomeAlteradoEm, setNomeAlteradoEm] = useState(null);
  const [editandoNome, setEditandoNome] = useState(false);
  const [statusNome, setStatusNome] = useState(null);
  const [salvandoNome, setSalvandoNome] = useState(false);
  const [avisoNome, setAvisoNome] = useState(null);
  const timerNome = useRef(null);

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
      navigate("/");
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
        setNomeOriginal(data.nome ?? "");
        setNomeAlteradoEm(data.nome_alterado_em ?? null);
        setBio(data.bio ?? "");
        setClube(data.clube_coracao ?? "");
        setFotoUrl(data.foto_url ?? "");
      }
      setCarregando(false);
    }

    carregarPerfil();
  }, [usuario, navigate]);

  function aoDigitarNome(valor) {
    setNome(valor);

    if (timerNome.current) clearTimeout(timerNome.current);

    const limpo = valor.trim();
    if (limpo === nomeOriginal || limpo.length < 3) {
      setStatusNome(null);
      return;
    }

    setStatusNome("checando");
    timerNome.current = setTimeout(async () => {
      const livre = await nomeDisponivel(limpo);
      setStatusNome(livre ? "livre" : "ocupado");
    }, 500);
  }

  function calcularDiasRestantes() {
    if (!nomeAlteradoEm) return 0;
    const passou =
      (Date.now() - new Date(nomeAlteradoEm).getTime()) / (1000 * 60 * 60 * 24);
    return Math.ceil(DIAS_BLOQUEIO - passou);
  }

  function iniciarEdicaoNome() {
    const restantes = calcularDiasRestantes();
    if (restantes > 0) {
      setAvisoNome(
        `Você poderá alterar o nome novamente em ${restantes} dia(s).`,
      );
      return;
    }
    setAvisoNome(null);
    setEditandoNome(true);
  }

  function cancelarEdicaoNome() {
    if (timerNome.current) clearTimeout(timerNome.current);
    setNome(nomeOriginal);
    setEditandoNome(false);
    setStatusNome(null);
    setAvisoNome(null);
  }

  async function salvarNome() {
    if (nome.trim().length < 3) {
      setAvisoNome("O nome precisa ter pelo menos 3 caracteres.");
      return;
    }
    if (nome.trim() === nomeOriginal) {
      setEditandoNome(false);
      return;
    }
    if (statusNome === "ocupado") {
      setAvisoNome("Este nome de usuário já está em uso.");
      return;
    }

    setSalvandoNome(true);
    setAvisoNome(null);

    const agora = new Date().toISOString();
    const { error } = await supabase
      .from("profiles")
      .upsert({ id: usuario.id, nome: nome.trim(), nome_alterado_em: agora });

    setSalvandoNome(false);

    if (error) {
      setAvisoNome("Não foi possível salvar. Tente outro nome.");
      return;
    }

    setNomeOriginal(nome.trim());
    setNomeAlteradoEm(agora);
    setEditandoNome(false);
    setStatusNome(null);
  }

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

          {editandoNome ? (
            <>
              <div className="campo-com-status">
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => aoDigitarNome(e.target.value)}
                  maxLength={20}
                  autoFocus
                />
                {statusNome === "checando" && (
                  <Loader2 size={16} className="girando status-ico" />
                )}
                {statusNome === "livre" && (
                  <Check size={16} className="status-ico status-ok" />
                )}
                {statusNome === "ocupado" && (
                  <X size={16} className="status-ico status-erro" />
                )}
              </div>
              <div className="nome-acoes">
                <button
                  className="nome-salvar"
                  onClick={salvarNome}
                  disabled={salvandoNome}
                >
                  {salvandoNome ? (
                    <Loader2 size={14} className="girando" />
                  ) : (
                    <Check size={14} />
                  )}
                  Salvar nome
                </button>
                <button className="nome-cancelar" onClick={cancelarEdicaoNome}>
                  <X size={14} /> Cancelar
                </button>
              </div>
            </>
          ) : (
            <div className="nome-display">
              <span className="nome-valor">{nomeOriginal || "Sem nome"}</span>
              <button
                className="nome-editar"
                onClick={iniciarEdicaoNome}
                aria-label="Editar nome"
              >
                <Pencil size={15} />
              </button>
            </div>
          )}

          <span className="campo-aviso-placeholder">
            Só é possível alterar o nome a cada {DIAS_BLOQUEIO} dias.
          </span>
          {avisoNome && <span className="campo-aviso erro">{avisoNome}</span>}
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
