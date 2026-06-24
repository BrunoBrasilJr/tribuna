import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/auth-context";
import { Home, Newspaper, User } from "lucide-react";

function LateralEsquerda() {
  const { usuario } = useAuth();
  const location = useLocation();

  function ativo(caminho) {
    return location.pathname === caminho
      ? "lateral-item ativo"
      : "lateral-item";
  }

  return (
    <aside className="lateral-esq">
      <nav className="lateral-nav">
        <Link to="/" className={ativo("/")}>
          <Home size={20} />
          <span>Início</span>
        </Link>

        {usuario && (
          <>
            <Link to="/feed" className={ativo("/feed")}>
              <Newspaper size={20} />
              <span>Feed</span>
            </Link>
            <Link to="/perfil" className={ativo("/perfil")}>
              <User size={20} />
              <span>Perfil</span>
            </Link>
          </>
        )}
      </nav>

      {usuario && (
        <Link to="/perfil" className="lateral-meu-perfil">
          <div className="lateral-meu-avatar">
            <User size={18} />
          </div>
          <div className="lateral-meu-info">
            <span className="lateral-meu-nome">
              {usuario.email?.split("@")[0]}
            </span>
            <span className="lateral-meu-label">Ver meu perfil</span>
          </div>
        </Link>
      )}
    </aside>
  );
}

export default LateralEsquerda;
