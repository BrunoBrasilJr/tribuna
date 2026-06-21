import { useEffect, useState } from "react";
import { buscarJogosDeHoje } from "../services/api";
import CardJogo from "../components/CardJogo";
import { Loader2, CalendarX } from "lucide-react";

function Home() {
  const [jogos, setJogos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    buscarJogosDeHoje()
      .then((dados) => setJogos(dados))
      .catch((e) => setErro(e.message))
      .finally(() => setCarregando(false));
  }, []);

  return (
    <div className="page">
      <h1>Jogos de Hoje</h1>

      {carregando && (
        <div className="aviso">
          <Loader2 className="girando" />
          <span>Carregando jogos...</span>
        </div>
      )}

      {erro && <div className="aviso erro">Erro ao carregar: {erro}</div>}

      {!carregando && !erro && jogos.length === 0 && (
        <div className="aviso">
          <CalendarX />
          <span>Nenhum jogo das ligas principais hoje.</span>
        </div>
      )}

      <div className="lista-jogos">
        {jogos.map((jogo) => (
          <CardJogo key={jogo.fixture.id} jogo={jogo} />
        ))}
      </div>
    </div>
  );
}

export default Home;
