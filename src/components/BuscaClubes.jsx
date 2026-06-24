import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Shield } from "lucide-react";
import { CLUBES } from "../services/clubes";

function BuscaClubes() {
  const navigate = useNavigate();
  const [busca, setBusca] = useState("");
  const wrapRef = useRef(null);

  const resultados = busca.trim()
    ? CLUBES.filter((c) =>
        c.nome.toLowerCase().includes(busca.trim().toLowerCase()),
      )
    : [];

  const dropdownAberto = busca.trim().length > 0;

  useEffect(() => {
    if (dropdownAberto) {
      document.body.classList.add("busca-ativa");
    } else {
      document.body.classList.remove("busca-ativa");
    }
    return () => document.body.classList.remove("busca-ativa");
  }, [dropdownAberto]);

  useEffect(() => {
    function aoClicarFora(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setBusca("");
      }
    }
    if (dropdownAberto) {
      document.addEventListener("mousedown", aoClicarFora);
    }
    return () => document.removeEventListener("mousedown", aoClicarFora);
  }, [dropdownAberto]);

  function fechar() {
    setBusca("");
  }

  function irPraClube(slug) {
    fechar();
    navigate(`/torcida/${slug}`);
  }

  return (
    <div className="busca-campo" ref={wrapRef}>
      <Search size={16} className="busca-campo-ico" />
      <input
        type="text"
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        placeholder="Pesquisar"
        onKeyDown={(e) => {
          if (e.key === "Escape") fechar();
          if (e.key === "Enter" && resultados[0])
            irPraClube(resultados[0].slug);
        }}
      />

      {dropdownAberto && (
        <div className="busca-dropdown">
          {resultados.length > 0 ? (
            resultados.map((c) => (
              <button
                key={c.slug}
                className="busca-item"
                onClick={() => irPraClube(c.slug)}
                style={{ "--cor-clube": c.cor }}
              >
                <span className="busca-item-escudo">
                  <Shield size={15} />
                </span>
                {c.nome}
              </button>
            ))
          ) : (
            <div className="busca-vazio">Nenhuma torcida encontrada.</div>
          )}
        </div>
      )}
    </div>
  );
}

export default BuscaClubes;
