import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth-context";
import { LogIn, UserPlus, Loader2 } from "lucide-react";

function Login() {
  const [modoCadastro, setModoCadastro] = useState(false);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState(null);
  const [carregando, setCarregando] = useState(false);

  const { cadastrar, entrar, entrarComGoogle } = useAuth();
  const navigate = useNavigate();

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

    setCarregando(true);

    const acao = modoCadastro ? cadastrar : entrar;
    const { error } = await acao(email, senha);

    setCarregando(false);

    if (error) {
      setErro(traduzirErro(error.message));
      return;
    }

    navigate("/");
  }

  async function aoEntrarComGoogle() {
    setErro(null);
    const { error } = await entrarComGoogle();
    if (error) {
      setErro(traduzirErro(error.message));
    }
  }

  function traduzirErro(msg) {
    if (msg.includes("Invalid login credentials"))
      return "Email ou senha incorretos.";
    if (msg.includes("already registered"))
      return "Este email já está cadastrado.";
    if (msg.includes("User already registered"))
      return "Este email já está cadastrado.";
    return msg;
  }

  return (
    <div className="page">
      <div className="auth-box">
        <h1>{modoCadastro ? "Criar conta" : "Entrar"}</h1>
        <p className="auth-sub">
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

export default Login;
