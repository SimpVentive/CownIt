import React, { useState } from 'react';

const ACCENT_COLOR = '#007bff';
const SECONDARY_TEXT = '#999';
const ERROR_COLOR = '#dc3545';
const SURFACE_1 = '#f5f5f5';
const BORDER_COLOR = '#ddd';

const CPQSDP_OPTIONS = [
  { value: 'C', label: 'Cost' },
  { value: 'P', label: 'Productivity' },
  { value: 'Q', label: 'Quality' },
  { value: 'S', label: 'Safety' },
  { value: 'D', label: 'Delivery' },
  { value: 'O', label: 'People' }
];

function LogAchievement({ data, currentPersonId, onDataChange, onNavigate }) {
  const [state, setState] = useState({
    title: '',
    selectedLevel: null,
    selectedCommitId: null,
    evidence: '',
    selectedCPQSDP: [],
    impactRating: null,
    fileAttachment: null,
    errors: {}
  });

  const fileInputRef = React.useRef(null);

  const handleTitleChange = (e) => {
    setState({ ...state, title: e.target.value });
  };

  const handleLevelSelect = (level) => {
    setState({
      ...state,
      selectedLevel: level,
      selectedCommitId: null
    });
  };

  const handleCommitSelect = (e) => {
    setState({ ...state, selectedCommitId: e.target.value });
  };

  const handleEvidenceChange = (e) => {
    setState({ ...state, evidence: e.target.value });
  };

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setState({ ...state, fileAttachment: file.name });
    }
  };

  const handleCPQSDPToggle = (value) => {
    setState({
      ...state,
      selectedCPQSDP: state.selectedCPQSDP.includes(value)
        ? state.selectedCPQSDP.filter(v => v !== value)
        : [...state.selectedCPQSDP, value]
    });
  };

  const handleImpactRating = (rating) => {
    setState({ ...state, impactRating: rating });
  };

  const validate = () => {
    const errors = {};

    if (!state.title.trim()) {
      errors.title = 'Title is required';
    } else if (state.title.trim().length < 5) {
      errors.title = 'Title must be at least 5 characters';
    }

    if (!state.selectedLevel) {
      errors.selectedLevel = 'Please select a commitment level';
    }

    if (!state.selectedCommitId) {
      errors.selectedCommitId = 'Please select a related commit';
    }

    if (!state.evidence.trim()) {
      errors.evidence = 'Evidence is required';
    } else if (state.evidence.trim().length < 20) {
      errors.evidence = 'Evidence must be at least 20 characters';
    }

    if (state.selectedCPQSDP.length === 0) {
      errors.selectedCPQSDP = 'Select at least one impact dimension';
    }

    if (!state.impactRating) {
      errors.impactRating = 'Please select an impact rating';
    }

    return errors;
  };

  const handleSave = () => {
    const errors = validate();

    if (Object.keys(errors).length > 0) {
      setState({ ...state, errors });
      return;
    }

    const newAchievement = {
      id: 'a' + Date.now(),
      personId: currentPersonId,
      commitId: state.selectedCommitId,
      title: state.title.trim(),
      evidence: state.evidence.trim(),
      cpqsdp: state.selectedCPQSDP,
      impactRating: state.impactRating,
      date: new Date().toISOString(),
      fileAttachment: state.fileAttachment
    };

    onDataChange('achievements', [...data.achievements, newAchievement]);

    setState({
      title: '',
      selectedLevel: null,
      selectedCommitId: null,
      evidence: '',
      selectedCPQSDP: [],
      impactRating: null,
      fileAttachment: null,
      errors: {}
    });

    onNavigate('my-impact');
  };

  const filteredCommits = state.selectedLevel
    ? data.commits.filter(
        c => c.personId === currentPersonId && c.level === state.selectedLevel
      )
    : [];

  return (
    <div style={{ maxWidth: '600px' }}>
      <h2 style={{ marginBottom: '24px' }}>Log achievement</h2>

      {/* Title */}
      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
          What did you achieve?
        </label>
        <input
          type="text"
          value={state.title}
          onChange={handleTitleChange}
          placeholder="Brief title of what happened"
          style={{
            width: '100%',
            padding: '10px 12px',
            border: `1px solid ${state.errors.title ? ERROR_COLOR : BORDER_COLOR}`,
            borderRadius: '4px',
            fontSize: '14px',
            boxSizing: 'border-box'
          }}
        />
        {state.errors.title && (
          <div style={{ color: ERROR_COLOR, fontSize: '12px', marginTop: '4px' }}>
            {state.errors.title}
          </div>
        )}
      </div>

      {/* Commit Level */}
      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'block', marginBottom: '12px', fontWeight: '500' }}>
          Commitment level
        </label>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['self', 'team', 'org'].map(level => (
            <button
              key={level}
              onClick={() => handleLevelSelect(level)}
              style={{
                padding: '10px 16px',
                backgroundColor:
                  state.selectedLevel === level ? ACCENT_COLOR : 'transparent',
                color: state.selectedLevel === level ? '#fff' : '#333',
                border: `1px solid ${
                  state.selectedLevel === level ? ACCENT_COLOR : BORDER_COLOR
                }`,
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.2s'
              }}
            >
              {level === 'self' && 'Self'}
              {level === 'team' && 'Team / dept'}
              {level === 'org' && 'Organisation'}
            </button>
          ))}
        </div>
        {state.errors.selectedLevel && (
          <div style={{ color: ERROR_COLOR, fontSize: '12px', marginTop: '4px' }}>
            {state.errors.selectedLevel}
          </div>
        )}
      </div>

      {/* Linked Commit */}
      {state.selectedLevel && (
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
            Linked commit
          </label>
          <select
            value={state.selectedCommitId || ''}
            onChange={handleCommitSelect}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: `1px solid ${
                state.errors.selectedCommitId ? ERROR_COLOR : BORDER_COLOR
              }`,
              borderRadius: '4px',
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
          >
            <option value="">Select the specific commit this relates to</option>
            {filteredCommits.map(commit => (
              <option key={commit.id} value={commit.id}>
                {commit.statement.length > 60
                  ? commit.statement.substring(0, 60) + '...'
                  : commit.statement}
              </option>
            ))}
          </select>
          {state.errors.selectedCommitId && (
            <div style={{ color: ERROR_COLOR, fontSize: '12px', marginTop: '4px' }}>
              {state.errors.selectedCommitId}
            </div>
          )}
        </div>
      )}

      {/* Evidence */}
      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
          Evidence / notes
        </label>
        <textarea
          value={state.evidence}
          onChange={handleEvidenceChange}
          placeholder="What happened, when, who was involved, any measurable outcome — be specific"
          style={{
            width: '100%',
            minHeight: '80px',
            padding: '10px 12px',
            border: `1px solid ${state.errors.evidence ? ERROR_COLOR : BORDER_COLOR}`,
            borderRadius: '4px',
            fontSize: '14px',
            fontFamily: 'inherit',
            boxSizing: 'border-box',
            resize: 'vertical'
          }}
        />
        {state.errors.evidence && (
          <div style={{ color: ERROR_COLOR, fontSize: '12px', marginTop: '4px' }}>
            {state.errors.evidence}
          </div>
        )}
      </div>

      {/* File Attachment */}
      <div style={{ marginBottom: '24px' }}>
        <button
          onClick={handleFileButtonClick}
          style={{
            padding: '10px 16px',
            backgroundColor: SURFACE_1,
            color: '#333',
            border: `1px solid ${BORDER_COLOR}`,
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          Upload file (optional)
        </button>
        {state.fileAttachment && (
          <div style={{ marginTop: '8px', fontSize: '14px', color: SECONDARY_TEXT }}>
            {state.fileAttachment}
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
      </div>

      {/* CPQSDP Tags */}
      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'block', marginBottom: '12px', fontWeight: '500' }}>
          Impact dimension (select all that apply)
        </label>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {CPQSDP_OPTIONS.map(option => (
            <button
              key={option.value}
              onClick={() => handleCPQSDPToggle(option.value)}
              style={{
                padding: '8px 14px',
                backgroundColor: state.selectedCPQSDP.includes(option.value)
                  ? ACCENT_COLOR
                  : 'transparent',
                color: state.selectedCPQSDP.includes(option.value)
                  ? '#fff'
                  : '#333',
                border: `1px solid ${
                  state.selectedCPQSDP.includes(option.value)
                    ? ACCENT_COLOR
                    : BORDER_COLOR
                }`,
                borderRadius: '20px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.2s'
              }}
            >
              {option.value} — {option.label}
            </button>
          ))}
        </div>
        {state.errors.selectedCPQSDP && (
          <div style={{ color: ERROR_COLOR, fontSize: '12px', marginTop: '4px' }}>
            {state.errors.selectedCPQSDP}
          </div>
        )}
      </div>

      {/* Impact Rating */}
      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'block', marginBottom: '12px', fontWeight: '500' }}>
          Impact rating
        </label>
        <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(rating => (
            <button
              key={rating}
              onClick={() => handleImpactRating(rating)}
              style={{
                width: '36px',
                height: '36px',
                padding: 0,
                backgroundColor:
                  state.impactRating === rating ? ACCENT_COLOR : 'transparent',
                color: state.impactRating === rating ? '#fff' : '#333',
                border: `1px solid ${
                  state.impactRating === rating ? ACCENT_COLOR : BORDER_COLOR
                }`,
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.2s'
              }}
            >
              {rating}
            </button>
          ))}
        </div>
        <div style={{ fontSize: '11px', color: SECONDARY_TEXT }}>
          1–3 Minor · 4–6 Moderate · 7–8 Significant · 9–10 Transformational
        </div>
        {state.errors.impactRating && (
          <div style={{ color: ERROR_COLOR, fontSize: '12px', marginTop: '4px' }}>
            {state.errors.impactRating}
          </div>
        )}
      </div>

      {/* Save Button */}
      <div>
        <button
          onClick={handleSave}
          style={{
            width: '100%',
            padding: '12px 16px',
            backgroundColor: ACCENT_COLOR,
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#0056b3';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = ACCENT_COLOR;
          }}
        >
          Save achievement
        </button>
      </div>
    </div>
  );
}

export default LogAchievement;
