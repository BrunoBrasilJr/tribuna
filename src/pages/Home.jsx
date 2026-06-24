import { useEffect, useState } from "react";
import { buscarJogosDeHoje } from "../services/api";
import CardJogo from "../components/CardJogo";
import CardJogoSkeleton from "../components/CardJogoSkeleton";
import { CalendarX, AlertTriangle, RotateCw } from "lucide-react";

function Home() {
  const [jogos, setJogos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [tentativa, setTentativa] = useState(0);

  useEffect(() => {
    let ativo = true;

    buscarJogosDeHoje()
      .then((dados) => {
        if (ativo) {
          setJogos(dados);
          setErro(null);
        }
      })
      .catch((e) => {
        if (ativo) setErro(e.message);
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });

    return () => {
      ativo = false;
    };
  }, [tentativa]);

  function tentarNovamente() {
    setCarregando(true);
    setErro(null);
    setJogos([]);
    setTentativa((t) => t + 1);
  }

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
          <button className="erro-box-botao" onClick={tentarNovamente}>
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
