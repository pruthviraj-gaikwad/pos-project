const SummaryCard = ({ title, value, icon }) => {
  return (
    <div className="card shadow-sm">
      <div className="card-body d-flex align-items-center justify-content-between">
        <div>
          <h6 className="text-muted">{title}</h6>
          <h4 className="fw-bold">{value}</h4>
        </div>
        <div style={{ fontSize: '2rem' }}>{icon}</div>
      </div>
    </div>
  );
};

export default SummaryCard;
