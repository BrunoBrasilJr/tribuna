import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { buscarDetalhesJogo, traduzirTime } from "../services/api";
import {
  ArrowLeft,
  RectangleVertical,
  ArrowUp,
  ArrowDown,
  ArrowLeftRight,
  Loader2,
  Clock,
  MapPin,
  Trophy,
} from "lucide-react";

function EscudoTime({ src, nome }) {
  const [falhou, setFalhou] = useState(false);
  const inicial = nome ? nome.charAt(0).toUpperCase() : "?";
  const mostrar = src && !falhou;

  return (
    <div className="jogo-escudo">
      {mostrar ? (
        <img src={src} alt={nome} onError={() => setFalhou(true)} />
      ) : (
        <div className="jogo-escudo-fallback">{inicial}</div>
      )}
    </div>
  );
}

function traduzirDetalheGol(detalhe) {
  const mapa = {
    "Normal Goal": "Gol",
    Penalty: "Gol de pênalti",
    "Own Goal": "Gol contra",
    "Missed Penalty": "Pênalti perdido",
    "Goal Disallowed - offside": "Gol anulado - impedimento",
    "Goal Disallowed": "Gol anulado",
  };
  return mapa[detalhe] || "Gol";
}

function traduzirRodada(round) {
  if (!round) return "";
  let r = round;
  r = r.replace("Group Stage", "Fase de Grupos");
  r = r.replace("Round of 16", "Oitavas de final");
  r = r.replace("Quarter-finals", "Quartas de final");
  r = r.replace("Semi-finals", "Semifinais");
  r = r.replace("Group", "Grupo");
  r = r.replace("Regular Season", "Temporada Regular");
  r = r.replace("- ", "· ");
  return r;
}

function Jogo() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [jogo, setJogo] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    buscarDetalhesJogo(id)
      .then((dados) => {
        if (!dados) setErro("Jogo não encontrado.");
        else setJogo(dados);
      })
      .catch((e) => setErro(e.message))
      .finally(() => setCarregando(false));
  }, [id]);

  if (carregando) {
    return (
      <div className="page">
        <div className="aviso">
          <Loader2 className="girando" />
          <span>Carregando jogo...</span>
        </div>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="page">
        <button className="jogo-voltar" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} /> Voltar
        </button>
        <div className="aviso erro">{erro}</div>
      </div>
    );
  }

  const { teams, goals, fixture, league, events } = jogo;
  const status = fixture.status.short;
  const aoVivo = ["1H", "2H", "HT", "ET", "LIVE"].includes(status);
  const encerrado = ["FT", "AET", "PEN"].includes(status);
  const naoComecou = status === "NS";

  const dataHora = new Date(fixture.date).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
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
  else etiqueta = <span className="badge agendado">{dataHora}</span>;

  const eventosOrdenados = (events || [])
    .slice()
    .sort((a, b) => (b.time.elapsed ?? 0) - (a.time.elapsed ?? 0));

  function renderIconeTopo(ev) {
    if (ev.type === "Goal") return <span className="ev-bola"></span>;
    if (ev.type === "Card") {
      const amarelo = ev.detail === "Yellow Card";
      return (
        <RectangleVertical
          size={15}
          style={{ color: amarelo ? "var(--gold)" : "var(--danger)" }}
          fill={amarelo ? "var(--gold)" : "var(--danger)"}
        />
      );
    }
    if (ev.type === "subst")
      return <ArrowLeftRight size={15} className="ev-subst-ico" />;
    return <Clock size={15} className="ev-subst-ico" />;
  }

  function renderConteudoEvento(ev) {
    if (ev.type === "subst") {
      return (
        <>
          <div className="ev-subst-linha entra">
            <ArrowUp size={14} />
            <span>{ev.player?.name || "—"}</span>
          </div>
          <div className="ev-subst-linha sai">
            <ArrowDown size={14} />
            <span>{ev.assist?.name || "—"}</span>
          </div>
        </>
      );
    }

    if (ev.type === "Goal") {
      return (
        <>
          <div className="ev-jogador">{ev.player?.name || "—"}</div>
          <div className="ev-tipo">{traduzirDetalheGol(ev.detail)}</div>
        </>
      );
    }

    if (ev.type === "Card") {
      const amarelo = ev.detail === "Yellow Card";
      return (
        <>
          <div className="ev-jogador">{ev.player?.name || "—"}</div>
          <div className="ev-tipo">
            {amarelo ? "Cartão amarelo" : "Cartão vermelho"}
          </div>
        </>
      );
    }

    return (
      <>
        <div className="ev-jogador">{ev.player?.name || "—"}</div>
        <div className="ev-tipo">{ev.detail || ev.type}</div>
      </>
    );
  }

  return (
    <div className="page">
      <button className="jogo-voltar" onClick={() => navigate(-1)}>
        <ArrowLeft size={18} /> Voltar
      </button>

      <div className="jogo-liga">
        <Trophy size={14} />
        <span>
          {league.name}
          {league.round ? ` · ${traduzirRodada(league.round)}` : ""}
        </span>
      </div>

      <div className="jogo-placar-box">
        <div className="jogo-time">
          <EscudoTime src={teams.home.logo} nome={teams.home.name} />
          <span className="jogo-time-nome">
            {traduzirTime(teams.home.name)}
          </span>
        </div>

        <div className="jogo-centro">
          {naoComecou ? (
            <div className="jogo-vs">VS</div>
          ) : (
            <div className="jogo-numeros">
              <span>{goals.home ?? 0}</span>
              <span className="jogo-tra">–</span>
              <span>{goals.away ?? 0}</span>
            </div>
          )}
          {etiqueta}
        </div>

        <div className="jogo-time">
          <EscudoTime src={teams.away.logo} nome={teams.away.name} />
          <span className="jogo-time-nome">
            {traduzirTime(teams.away.name)}
          </span>
        </div>
      </div>

      <div className="jogo-info">
        <div className="jogo-info-item">
          <Clock size={15} />
          <span>{dataHora}</span>
        </div>
        {fixture.venue?.name && (
          <div className="jogo-info-item">
            <MapPin size={15} />
            <span>
              {fixture.venue.name}
              {fixture.venue.city ? `, ${fixture.venue.city}` : ""}
            </span>
          </div>
        )}
      </div>

      <h2 className="jogo-secao">Lances do jogo</h2>

      {eventosOrdenados.length === 0 ? (
        <div className="aviso">
          <span>
            {naoComecou
              ? "O jogo ainda não começou."
              : "Nenhum lance registrado ainda."}
          </span>
        </div>
      ) : (
        <div className="timeline">
          {eventosOrdenados.map((ev, i) => {
            const doMandante = ev.team.id === teams.home.id;
            return (
              <div key={i} className={`ev ${doMandante ? "ev-esq" : "ev-dir"}`}>
                <div className="ev-conteudo">
                  <div className="ev-topo">
                    {renderIconeTopo(ev)}
                    <span className="ev-min">{ev.time.elapsed}′</span>
                  </div>
                  {renderConteudoEvento(ev)}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Jogo;
