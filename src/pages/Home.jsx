import { useEffect, useState, useCallback } from "react";
import { buscarJogosDeHoje } from "../services/api";
import CardJogo from "../components/CardJogo";
import CardJogoSkeleton from "../components/CardJogoSkeleton";
import { CalendarX, AlertTriangle, RotateCw } from "lucide-react";

function Home() {
  const [jogos, setJogos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  const carregar = useCallback(() => {
    setCarregando(true);
    setErro(null);
    buscarJogosDeHoje()
      .then((dados) => setJogos(dados))
      .catch((e) => setErro(e.message))
      .finally(() => setCarregando(false));
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  return (
    <div className="page">
      <h1>Jogos de Hoje</h1>

      {carregando && (
        <div className="lista-jogos">
          {Array.from({ length: 5 }).map((_, i) => (
            <CardJogoSkeleton key={i} />
          ))}
        </div>
      )}

      {!carregando && erro && (
        <div className="erro-box">
          <AlertTriangle size={28} className="erro-box-ico" />
          <p className="erro-box-msg">{erro}</p>
          <button className="erro-box-botao" onClick={carregar}>
            <RotateCw size={16} /> Tentar novamente
          </button>
        </div>
      )}

      {!carregando && !erro && jogos.length === 0 && (
        <div className="aviso">
          <CalendarX />
          <span>Nenhum jogo das ligas principais hoje.</span>
        </div>
      )}

      {!carregando && !erro && jogos.length > 0 && (
        <div className="lista-jogos">
          {jogos.map((jogo) => (
            <CardJogo key={jogo.fixture.id} jogo={jogo} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
