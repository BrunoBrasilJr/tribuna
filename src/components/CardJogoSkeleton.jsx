function CardJogoSkeleton() {
  return (
    <div className="card-jogo skeleton-card">
      <div className="card-topo">
        <div className="skeleton skel-liga"></div>
        <div className="skeleton skel-badge"></div>
      </div>
      <div className="card-times">
        <div className="time">
          <div className="skeleton skel-escudo"></div>
          <div className="skeleton skel-nome"></div>
        </div>
        <div className="skeleton skel-placar"></div>
        <div className="time time-dir">
          <div className="skeleton skel-nome"></div>
          <div className="skeleton skel-escudo"></div>
        </div>
      </div>
    </div>
  );
}

export default CardJogoSkeleton;
