import React from 'react';

const DIMENSIONS = ['C', 'P', 'Q', 'S', 'D', 'O'];
const DIMENSION_LABELS = {
  C: 'Cost',
  P: 'Productivity',
  Q: 'Quality',
  S: 'Safety',
  D: 'Delivery',
  O: 'People'
};

const SURFACE_1 = '#f5f5f5';
const TEXT_MUTED = '#999';
const SECONDARY_TEXT = '#999';

function getCellColor(value) {
  if (value === null) {
    return {
      bg: SURFACE_1,
      text: TEXT_MUTED,
      display: '—'
    };
  }

  if (value >= 8) {
    return {
      bg: '#EAF3DE',
      text: '#3B6D11',
      display: value
    };
  }

  if (value >= 6) {
    return {
      bg: '#E6F1FB',
      text: '#185FA5',
      display: value
    };
  }

  if (value >= 4) {
    return {
      bg: '#FAEEDA',
      text: '#854F0B',
      display: value
    };
  }

  return {
    bg: '#FAECE7',
    text: '#993C1D',
    display: value
  };
}

function CEOHeatmap({ data }) {
  const personDimensionScore = (personId, dimension) => {
    const achievements = data.achievements.filter(
      a => a.personId === personId && a.cpqsdp.includes(dimension)
    );

    if (achievements.length === 0) return null;

    const avg =
      achievements.reduce((sum, a) => sum + a.impactRating, 0) /
      achievements.length;
    return parseFloat(avg.toFixed(1));
  };

  const orgAvg = (dimension) => {
    const achievements = data.achievements.filter(a =>
      a.cpqsdp.includes(dimension)
    );

    if (achievements.length === 0) return null;

    const avg =
      achievements.reduce((sum, a) => sum + a.impactRating, 0) /
      achievements.length;
    return parseFloat(avg.toFixed(1));
  };

  return (
    <div>
      <h2 style={{ marginBottom: '24px' }}>Impact heatmap</h2>

      {/* Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `auto repeat(6, 1fr)`,
          gap: '8px',
          marginBottom: '32px',
          padding: '16px',
          backgroundColor: '#fff',
          borderRadius: '4px',
          border: '1px solid #ddd'
        }}
      >
        {/* Header Row */}
        <div style={{ fontSize: '12px', fontWeight: '600', color: TEXT_MUTED }} />
        {DIMENSIONS.map(dim => (
          <div
            key={dim}
            style={{
              fontSize: '12px',
              fontWeight: '600',
              color: TEXT_MUTED,
              textAlign: 'center'
            }}
            title={DIMENSION_LABELS[dim]}
          >
            {dim}
          </div>
        ))}

        {/* Person Rows */}
        {data.people.map(person => (
          <React.Fragment key={person.id}>
            <div
              style={{
                fontSize: '12px',
                fontWeight: '500',
                color: '#333',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              {person.name.split(' ')[0]}
            </div>
            {DIMENSIONS.map(dim => {
              const score = personDimensionScore(person.id, dim);
              const cellColor = getCellColor(score);

              return (
                <div
                  key={`${person.id}-${dim}`}
                  style={{
                    height: '28px',
                    backgroundColor: cellColor.bg,
                    color: cellColor.text,
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}
                >
                  {cellColor.display}
                </div>
              );
            })}
          </React.Fragment>
        ))}

        {/* Separator */}
        <div
          style={{
            gridColumn: '1 / -1',
            height: '1px',
            backgroundColor: '#ddd',
            margin: '8px 0'
          }}
        />

        {/* Average Row */}
        <div
          style={{
            fontSize: '12px',
            fontWeight: '600',
            color: '#333',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          Org avg
        </div>
        {DIMENSIONS.map(dim => {
          const avgScore = orgAvg(dim);
          const cellColor = getCellColor(avgScore);

          return (
            <div
              key={`avg-${dim}`}
              style={{
                height: '28px',
                backgroundColor: cellColor.bg,
                color: cellColor.text,
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: '500',
                fontWeight: '600'
              }}
            >
              {cellColor.display}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: '24px', fontSize: '13px' }}>
        {[
          { color: '#EAF3DE', label: '8–10 High' },
          { color: '#E6F1FB', label: '6–7 Good' },
          { color: '#FAEEDA', label: '4–5 Moderate' },
          { color: '#FAECE7', label: '1–3 Low' }
        ].map((item, idx) => (
          <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <div
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '2px',
                backgroundColor: item.color,
                border: '1px solid #ddd'
              }}
            />
            <span style={{ color: SECONDARY_TEXT }}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CEOHeatmap;
