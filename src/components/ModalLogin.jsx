import { useState, useEffect } from "react";
import { useAuth } from "../context/auth-context";
import { nomeDisponivel, salvarUsername } from "../services/perfil";
import { LogIn, UserPlus, Loader2, X, Check, AlertCircle } from "lucide-react";

function ModalLogin() {
  const { modalAberto, fecharModal, cadastrar, entrar, entrarComGoogle } =
    useAuth();

  const [modoCadastro, setModoCadastro] = useState(false);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [username, setUsername] = useState("");
  const [aceitouTermos, setAceitouTermos] = useState(false);
  const [erro, setErro] = useState(null);
  const [carregando, setCarregando] = useState(false);

  const [statusNome, setStatusNome] = useState(null);

  useEffect(() => {
    if (!modoCadastro || username.trim().length < 3) {
      setStatusNome(null);
      return;
    }

    setStatusNome("checando");
    const timer = setTimeout(async () => {
      const livre = await nomeDisponivel(username.trim());
      setStatusNome(livre ? "livre" : "ocupado");
    }, 500);

    return () => clearTimeout(timer);
  }, [username, modoCadastro]);

  useEffect(() => {
    if (modalAberto) {
      document.body.classList.add("modal-ativo");
    } else {
      document.body.classList.remove("modal-ativo");
      setModoCadastro(false);
      setEmail("");
      setSenha("");
      setUsername("");
      setAceitouTermos(false);
      setErro(null);
      setStatusNome(null);
    }
    return () => document.body.classList.remove("modal-ativo");
  }, [modalAberto]);

  if (!modalAberto) return null;

  function traduzirErro(msg) {
    if (msg.includes("Invalid login credentials"))
      return "Email ou senha incorretos.";
    if (msg.includes("already registered"))
      return "Este email já está cadastrado.";
    if (msg.includes("User already registered"))
      return "Este email já está cadastrado.";
    return msg;
  }

  async function aoEnviar() {
    setErro(null);

    if (!email || !senha) {
      setErro("Preencha email e senha.");
      return;
    }
    if (senha.length < 6) {
      setErro("A senha precisa ter pelo menos 6 caracteres.");
      return;
    }

    if (modoCadastro) {
      if (username.trim().length < 3) {
        setErro("O nome de usuário precisa ter pelo menos 3 caracteres.");
        return;
      }
      if (statusNome === "ocupado") {
        setErro("Este nome de usuário já está em uso.");
        return;
      }
      if (!aceitouTermos) {
        setErro("Você precisa aceitar os termos para criar a conta.");
        return;
      }
    }

    setCarregando(true);

    if (modoCadastro) {
      const { data, error } = await cadastrar(email, senha);
      if (error) {
        setCarregando(false);
        setErro(traduzirErro(error.message));
        return;
      }
      const usuarioId = data.user?.id;
      if (usuarioId) {
        const erroNome = await salvarUsername(usuarioId, username.trim());
        if (erroNome) {
          setCarregando(false);
          setErro("Não foi possível salvar o nome de usuário. Tente outro.");
          return;
        }
      }
      setCarregando(false);
      fecharModal();
    } else {
      const { error } = await entrar(email, senha);
      setCarregando(false);
      if (error) {
        setErro(traduzirErro(error.message));
        return;
      }
      fecharModal();
    }
  }

  async function aoEntrarComGoogle() {
    setErro(null);
    const { error } = await entrarComGoogle();
    if (error) setErro(traduzirErro(error.message));
  }

  return (
    <div className="modal-overlay" onClick={fecharModal}>
      <div className="modal-login" onClick={(e) => e.stopPropagation()}>
        <button
          className="modal-fechar"
          onClick={fecharModal}
          aria-label="Fechar"
        >
          <X size={20} />
        </button>

        <h2 className="modal-titulo">
          {modoCadastro ? "Criar conta" : "Entrar"}
        </h2>
        <p className="modal-sub">
          {modoCadastro
            ? "Junte-se à torcida no Tribuna."
            : "Bem-vindo de volta à Tribuna."}
        </p>

        <button className="auth-google" onClick={aoEntrarComGoogle}>
          <img
            src="https://www.google.com/favicon.ico"
            alt="Google"
            className="google-icone"
          />
          Continuar com Google
        </button>

        <div className="auth-divisor">
          <span>ou</span>
        </div>

        {modoCadastro && (
          <div className="auth-campo">
            <label>Nome de usuário</label>
            <div className="campo-com-status">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Escolha um nome de usuário"
                maxLength={20}
              />
              {statusNome === "checando" && (
                <Loader2 size={16} className="girando status-ico" />
              )}
              {statusNome === "livre" && (
                <Check size={16} className="status-ico status-ok" />
              )}
              {statusNome === "ocupado" && (
                <AlertCircle size={16} className="status-ico status-erro" />
              )}
            </div>
            {statusNome === "ocupado" && (
              <span className="campo-aviso erro">
                Este nome já está indisponível.
              </span>
            )}
            {statusNome === "livre" && (
              <span className="campo-aviso ok">Nome disponível!</span>
            )}
          </div>
        )}

        <div className="auth-campo">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="voce@email.com"
            autoComplete="email"
          />
        </div>

        <div className="auth-campo">
          <label>Senha</label>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="mínimo 6 caracteres"
            autoComplete={modoCadastro ? "new-password" : "current-password"}
            onKeyDown={(e) => e.key === "Enter" && aoEnviar()}
          />
        </div>

        {modoCadastro && (
          <label className="termos-check">
            <input
              type="checkbox"
              checked={aceitouTermos}
              onChange={(e) => setAceitouTermos(e.target.checked)}
            />
            <span>
              Li e aceito os{" "}
              <a href="/termos" target="_blank" rel="noreferrer">
                termos de uso
              </a>
              .
            </span>
          </label>
        )}

        {erro && <div className="auth-erro">{erro}</div>}

        <button className="auth-botao" onClick={aoEnviar} disabled={carregando}>
          {carregando ? (
            <Loader2 className="girando" size={18} />
          ) : modoCadastro ? (
            <>
              <UserPlus size={18} /> Criar conta
            </>
          ) : (
            <>
              <LogIn size={18} /> Entrar
            </>
          )}
        </button>

        <div className="auth-troca">
          {modoCadastro ? "Já tem conta?" : "Ainda não tem conta?"}{" "}
          <button
            className="auth-link"
            onClick={() => {
              setModoCadastro(!modoCadastro);
              setErro(null);
            }}
          >
            {modoCadastro ? "Entrar" : "Criar conta"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalLogin;
