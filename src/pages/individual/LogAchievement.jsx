import React, { useState } from 'react';
import { Upload } from 'lucide-react';

const CPQSDP_DIMS = [
  { key: 'C', label: 'Cost', color: '#534AB7' },
  { key: 'P', label: 'Productivity', color: '#0F6E56' },
  { key: 'Q', label: 'Quality', color: '#3B6D11' },
  { key: 'S', label: 'Safety', color: '#993C1D' },
  { key: 'D', label: 'Delivery', color: '#185FA5' },
  { key: 'O', label: 'People', color: '#854F0B' }
];

function LogAchievement({ state, onDataChange }) {
  const [title, setTitle] = useState('');
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedCommitId, setSelectedCommitId] = useState(null);
  const [evidence, setEvidence] = useState('');
  const [selectedDims, setSelectedDims] = useState([]);
  const [impactRating, setImpactRating] = useState(null);
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});

  const userCommits = state.data.commits.filter(c => c.personId === state.currentUserId);
  const levelCommits = selectedLevel
    ? userCommits.filter(c => c.level === selectedLevel)
    : [];

  const validate = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!selectedLevel) newErrors.level = 'Select a commitment level';
    if (!selectedCommitId) newErrors.commit = 'Select a commit';
    if (!evidence.trim()) newErrors.evidence = 'Evidence is required';
    if (selectedDims.length === 0) newErrors.dims = 'Select at least one dimension';
    if (!impactRating) newErrors.rating = 'Select an impact rating';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    const newAchievement = {
      id: 'a' + Date.now(),
      personId: state.currentUserId,
      commitId: selectedCommitId,
      title: title.trim(),
      evidence: evidence.trim(),
      cpqsdp: selectedDims,
      impactRating: impactRating,
      date: new Date().toISOString(),
      fileAttachment: file ? file.name : null
    };

    onDataChange('achievements', [...state.data.achievements, newAchievement]);

    // Reset form
    setTitle('');
    setSelectedLevel(null);
    setSelectedCommitId(null);
    setEvidence('');
    setSelectedDims([]);
    setImpactRating(null);
    setFile(null);
    setErrors({});
  };

  return (
    <div style={{ maxWidth: '600px' }}>
      <h2 style={{ margin: '0 0 24px 0', fontSize: '18px', fontWeight: 500 }}>
        Log achievement
      </h2>

      {/* Title */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 500 }}>
          What did you achieve?
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Brief title"
          style={{
            width: '100%',
            padding: '10px 12px',
            border: `0.5px solid ${errors.title ? '#dc3545' : '#e0e0e0'}`,
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: 400,
            boxSizing: 'border-box'
          }}
        />
        {errors.title && <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '4px' }}>{errors.title}</div>}
      </div>

      {/* Commitment Level */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 500 }}>
          Commitment level
        </label>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['self', 'team', 'org'].map(level => (
            <button
              key={level}
              onClick={() => {
                setSelectedLevel(level);
                setSelectedCommitId(null);
              }}
              style={{
                flex: 1,
                padding: '10px',
                backgroundColor: selectedLevel === level ? '#000' : '#f5f5f5',
                color: selectedLevel === level ? '#fff' : '#000',
                border: '0.5px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 400,
                cursor: 'pointer'
              }}
            >
              {level === 'self' ? 'Self' : level === 'team' ? 'Team / Dept' : 'Organisation'}
            </button>
          ))}
        </div>
        {errors.level && <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '4px' }}>{errors.level}</div>}
      </div>

      {/* Linked Commit */}
      {selectedLevel && (
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 500 }}>
            Select a commit
          </label>
          <select
            value={selectedCommitId || ''}
            onChange={(e) => setSelectedCommitId(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: `0.5px solid ${errors.commit ? '#dc3545' : '#e0e0e0'}`,
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 400,
              boxSizing: 'border-box'
            }}
          >
            <option value="">Choose a commit...</option>
            {levelCommits.map(commit => (
              <option key={commit.id} value={commit.id}>
                {commit.statement.substring(0, 50)}...
              </option>
            ))}
          </select>
          {errors.commit && <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '4px' }}>{errors.commit}</div>}
        </div>
      )}

      {/* Evidence */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 500 }}>
          Evidence / notes
        </label>
        <textarea
          value={evidence}
          onChange={(e) => setEvidence(e.target.value)}
          placeholder="What happened, when, who was involved, outcome..."
          style={{
            width: '100%',
            minHeight: '80px',
            padding: '10px 12px',
            border: `0.5px solid ${errors.evidence ? '#dc3545' : '#e0e0e0'}`,
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: 400,
            boxSizing: 'border-box',
            fontFamily: 'inherit',
            resize: 'vertical'
          }}
        />
        {errors.evidence && <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '4px' }}>{errors.evidence}</div>}
      </div>

      {/* File */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 500 }}>
          File attachment (optional)
        </label>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <label style={{ cursor: 'pointer' }}>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              style={{ display: 'none' }}
            />
            <div style={{
              padding: '10px 12px',
              backgroundColor: '#f5f5f5',
              border: '0.5px solid #e0e0e0',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 400,
              cursor: 'pointer',
              display: 'flex',
              gap: '8px',
              alignItems: 'center'
            }}>
              <Upload size={16} />
              Choose file
            </div>
          </label>
          {file && <span style={{ fontSize: '13px', color: '#666' }}>{file.name}</span>}
        </div>
      </div>

      {/* CPQSDP Dimensions */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 500 }}>
          Impact dimensions
        </label>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {CPQSDP_DIMS.map(dim => (
            <button
              key={dim.key}
              onClick={() => {
                setSelectedDims(
                  selectedDims.includes(dim.key)
                    ? selectedDims.filter(d => d !== dim.key)
                    : [...selectedDims, dim.key]
                );
              }}
              style={{
                padding: '8px 12px',
                backgroundColor: selectedDims.includes(dim.key) ? dim.color : '#f5f5f5',
                color: selectedDims.includes(dim.key) ? '#fff' : '#000',
                border: `0.5px solid ${selectedDims.includes(dim.key) ? dim.color : '#e0e0e0'}`,
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 400,
                cursor: 'pointer'
              }}
            >
              {dim.key} — {dim.label}
            </button>
          ))}
        </div>
        {errors.dims && <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '4px' }}>{errors.dims}</div>}
      </div>

      {/* Impact Rating */}
      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 500 }}>
          Impact rating
        </label>
        <div style={{ display: 'flex', gap: '6px' }}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
            <button
              key={num}
              onClick={() => setImpactRating(num)}
              style={{
                width: '32px',
                height: '32px',
                padding: 0,
                backgroundColor: impactRating === num ? '#000' : '#f5f5f5',
                color: impactRating === num ? '#fff' : '#000',
                border: '0.5px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 400,
                cursor: 'pointer'
              }}
            >
              {num}
            </button>
          ))}
        </div>
        <div style={{ fontSize: '12px', color: '#999', marginTop: '8px' }}>
          1–3 Minor · 4–6 Moderate · 7–8 Significant · 9–10 Transformational
        </div>
        {errors.rating && <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '4px' }}>{errors.rating}</div>}
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        style={{
          width: '100%',
          padding: '12px',
          backgroundColor: '#000',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          fontSize: '13px',
          fontWeight: 500,
          cursor: 'pointer'
        }}
      >
        Save achievement
      </button>
    </div>
  );
}

export default LogAchievement;
