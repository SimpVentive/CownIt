import React from 'react';

const CPQSDP_LABELS = {
  C: 'Cost',
  P: 'Productivity',
  Q: 'Quality',
  S: 'Safety',
  D: 'Delivery',
  O: 'People'
};

const CPQSDP_COLORS = {
  C: '#534AB7',
  P: '#0F6E56',
  Q: '#3B6D11',
  S: '#993C1D',
  D: '#185FA5',
  O: '#854F0B'
};

function getColor(score) {
  if (score === null) return { bg: '#f5f5f5', text: '#999' };
  if (score >= 8) return { bg: '#e8f5e9', text: '#2e7d32' };
  if (score >= 6) return { bg: '#e3f2fd', text: '#1565c0' };
  if (score >= 4) return { bg: '#fff3e0', text: '#e65100' };
  return { bg: '#ffebee', text: '#c62828' };
}

function Heatmap({ state }) {
  const personDimensionScore = (personId, dimension) => {
    const achievements = state.data.achievements.filter(
      a => a.personId === personId && a.cpqsdp.includes(dimension)
    );
    if (achievements.length === 0) return null;
    return parseFloat((
      achievements.reduce((sum, a) => sum + a.impactRating, 0) / achievements.length
    ).toFixed(1));
  };

  const orgAvg = (dimension) => {
    const achievements = state.data.achievements.filter(a => a.cpqsdp.includes(dimension));
    if (achievements.length === 0) return null;
    return parseFloat((
      achievements.reduce((sum, a) => sum + a.impactRating, 0) / achievements.length
    ).toFixed(1));
  };

  return (
    <div>
      <h2 style={{ margin: '0 0 24px 0', fontSize: '18px', fontWeight: 500 }}>
        Impact heatmap
      </h2>

      {/* Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'auto repeat(6, 1fr)',
        gap: '4px',
        backgroundColor: '#fff',
        padding: '16px',
        borderRadius: '12px',
        border: '0.5px solid #e0e0e0',
        overflowX: 'auto'
      }}>
        {/* Header */}
        <div />
        {Object.entries(CPQSDP_LABELS).map(([key, label]) => (
          <div
            key={key}
            style={{
              padding: '8px',
              fontSize: '11px',
              fontWeight: 500,
              textAlign: 'center',
              color: '#666'
            }}
            title={label}
          >
            {key}
          </div>
        ))}

        {/* Person rows */}
        {state.data.people.map(person => (
          <React.Fragment key={person.id}>
            <div style={{ padding: '8px', fontSize: '12px', fontWeight: 400 }}>
              {person.name.split(' ')[0]}
            </div>
            {Object.keys(CPQSDP_LABELS).map(dim => {
              const score = personDimensionScore(person.id, dim);
              const color = getColor(score);

              return (
                <div
                  key={`${person.id}-${dim}`}
                  style={{
                    padding: '12px 4px',
                    backgroundColor: color.bg,
                    color: color.text,
                    borderRadius: '4px',
                    textAlign: 'center',
                    fontSize: '11px',
                    fontWeight: 500,
                    minHeight: '28px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {score || '—'}
                </div>
              );
            })}
          </React.Fragment>
        ))}

        {/* Separator */}
        <div style={{ gridColumn: '1 / -1', height: '1px', backgroundColor: '#e0e0e0' }} />

        {/* Org avg row */}
        <div style={{ padding: '8px', fontSize: '12px', fontWeight: 500 }}>
          Org avg
        </div>
        {Object.keys(CPQSDP_LABELS).map(dim => {
          const score = orgAvg(dim);
          const color = getColor(score);

          return (
            <div
              key={`avg-${dim}`}
              style={{
                padding: '12px 4px',
                backgroundColor: color.bg,
                color: color.text,
                borderRadius: '4px',
                textAlign: 'center',
                fontSize: '11px',
                fontWeight: 600,
                minHeight: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {score || '—'}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div style={{ marginTop: '24px', display: 'flex', gap: '24px', fontSize: '12px' }}>
        {[
          { bg: '#e8f5e9', label: '8–10 High' },
          { bg: '#e3f2fd', label: '6–7 Good' },
          { bg: '#fff3e0', label: '4–5 Moderate' },
          { bg: '#ffebee', label: '1–3 Low' }
        ].map((item, idx) => (
          <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <div style={{
              width: '12px',
              height: '12px',
              borderRadius: '3px',
              backgroundColor: item.bg,
              border: '0.5px solid #e0e0e0'
            }} />
            <span style={{ color: '#666' }}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Heatmap;
