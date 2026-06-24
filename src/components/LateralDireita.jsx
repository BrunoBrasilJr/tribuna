import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Shield, TrendingUp, Users, User } from "lucide-react";
import { torcidasPopulares, torcedoresAtivos } from "../services/perfil";
import { acharClubePorNome } from "../services/clubes";

function LateralDireita() {
  const [populares, setPopulares] = useState([]);
  const [ativos, setAtivos] = useState([]);

  useEffect(() => {
    let vivo = true;
    torcidasPopulares().then((lista) => {
      if (vivo) setPopulares(lista.slice(0, 5));
    });
    torcedoresAtivos(5).then((lista) => {
      if (vivo) setAtivos(lista);
    });
    return () => {
      vivo = false;
    };
  }, []);

  return (
    <aside className="lateral-dir">
      {populares.length > 0 && (
        <div className="lateral-card">
          <div className="lateral-card-titulo">
            <TrendingUp size={16} />
            <span>Torcidas populares</span>
          </div>
          <div className="lateral-torcidas">
            {populares.map((t) => {
              const clube = acharClubePorNome(t.nome);
              if (!clube) return null;
              return (
                <Link
                  key={clube.slug}
                  to={`/torcida/${clube.slug}`}
                  className="lateral-torcida"
                >
                  <span
                    className="lateral-torcida-bola"
                    style={{ background: clube.cor }}
                  >
                    <Shield size={13} />
                  </span>
                  <span className="lateral-torcida-nome">{clube.nome}</span>
                  <span className="lateral-torcida-num">
                    <Users size={12} /> {t.total}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {ativos.length > 0 && (
        <div className="lateral-card">
          <div className="lateral-card-titulo">
            <Users size={16} />
            <span>Torcedores ativos</span>
          </div>
          <div className="lateral-torcidas">
            {ativos.map((u) => (
              <Link
                key={u.id}
                to={`/usuario/${u.id}`}
                className="lateral-torcida"
              >
                <span className="lateral-ativo-avatar">
                  {u.foto_url ? (
                    <img src={u.foto_url} alt={u.nome} />
                  ) : (
                    <User size={14} />
                  )}
                </span>
                <span className="lateral-torcida-nome">{u.nome}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}

export default LateralDireita;
