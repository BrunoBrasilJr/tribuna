import { useState } from "react";
import { Trophy } from "lucide-react";
import { traduzirTime } from "../services/api";

const LIGAS_SEM_LOGO = [1];

function Escudo({ src, nome, tipo = "time", forcarFallback = false }) {
  const [falhou, setFalhou] = useState(false);
  const inicial = nome ? nome.charAt(0).toUpperCase() : "?";
  const mostrarImagem = src && !falhou && !forcarFallback;

  return (
    <div className={`escudo-wrap ${tipo === "liga" ? "escudo-liga" : ""}`}>
      {mostrarImagem ? (
        <img
          src={src}
          alt={nome}
          className="time-logo"
          onError={() => setFalhou(true)}
        />
      ) : (
        <div className="escudo-fallback">
          {tipo === "liga" ? <Trophy className="icone-trofeu" /> : inicial}
        </div>
      )}
    </div>
  );
}

function CardJogo({ jogo }) {
  const { teams, goals, fixture, league } = jogo;
  const status = fixture.status.short;
  const aoVivo = ["1H", "2H", "HT", "ET", "LIVE"].includes(status);
  const encerrado = ["FT", "AET", "PEN"].includes(status);
  const ligaSemLogo = LIGAS_SEM_LOGO.includes(league.id);

  const horario = new Date(fixture.date).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  let etiqueta;
  if (aoVivo)
    etiqueta = (
      <span className="badge ao-vivo">{fixture.status.elapsed}′ AO VIVO</span>
    );
  else if (encerrado)
    etiqueta = <span className="badge encerrado">Encerrado</span>;
  else etiqueta = <span className="badge agendado">{horario}</span>;

  return (
    <div className={`card-jogo ${aoVivo ? "destaque-vivo" : ""}`}>
      <div className="card-topo">
        <div className="card-liga">
          <Escudo
            src={league.logo}
            nome={league.name}
            tipo="liga"
            forcarFallback={ligaSemLogo}
          />
          <span>{league.name}</span>
        </div>
        {etiqueta}
      </div>

      <div className="card-times">
        <div className="time">
          <Escudo src={teams.home.logo} nome={teams.home.name} />
          <span className="time-nome">{traduzirTime(teams.home.name)}</span>
        </div>

        <div className="placar">
          <span className="gols">{goals.home ?? "–"}</span>
          <span className="x">×</span>
          <span className="gols">{goals.away ?? "–"}</span>
        </div>

        <div className="time time-dir">
          <span className="time-nome">{traduzirTime(teams.away.name)}</span>
          <Escudo src={teams.away.logo} nome={teams.away.name} />
        </div>
      </div>
    </div>
  );
}

export default CardJogo;
