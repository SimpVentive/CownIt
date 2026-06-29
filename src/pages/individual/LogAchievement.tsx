import React, { useState } from 'react'
import { ScrollView, View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, StyleSheet, Platform, ActivityIndicator } from 'react-native'
import type { AppData, Achievement } from '../../data/seed'
import { CPQSDP_COLORS, CPQSDP_LABELS, LEVEL_COLORS } from '../../utils/constants'
import * as api from '../../services/api'

interface LogAchievementProps {
  data: AppData
  currentPersonId: string
  onDataChange: (entity: keyof AppData, newArray: any[]) => void
  onNavigate: (page: string) => void
}

export default function LogAchievement({
  data,
  currentPersonId,
  onDataChange,
  onNavigate
}: LogAchievementProps) {
  const [title, setTitle] = useState('')
  const [selectedLevel, setSelectedLevel] = useState<'self' | 'team' | 'org' | null>(null)
  const [selectedCommitId, setSelectedCommitId] = useState<string | null>(null)
  const [evidence, setEvidence] = useState('')
  const [selectedCPQSDP, setSelectedCPQSDP] = useState<string[]>([])
  const [impactRating, setImpactRating] = useState<number | null>(null)
  const [fileAttachment, setFileAttachment] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSaving, setIsSaving] = useState(false)

  const toggleCPQSDP = (key: string) => {
    setSelectedCPQSDP(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    )
  }

  const validateAndSave = async () => {
    const newErrors: Record<string, string> = {}

    if (title.trim().length < 5) {
      newErrors.title = 'Enter at least 5 characters'
    }
    if (!selectedLevel) {
      newErrors.selectedLevel = 'Select a commit level'
    }
    if (!selectedCommitId) {
      newErrors.selectedCommitId = 'Select a specific commit'
    }
    if (evidence.trim().length < 20) {
      newErrors.evidence = 'Add more detail — at least 20 characters'
    }
    if (selectedCPQSDP.length === 0) {
      newErrors.selectedCPQSDP = 'Tag at least one dimension'
    }
    if (!impactRating) {
      newErrors.impactRating = 'Select an impact rating'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsSaving(true)
    try {
      const newAchievement: Achievement = {
        id: 'a' + Date.now(),
        personId: currentPersonId,
        commitId: selectedCommitId!,
        title: title.trim(),
        evidence: evidence.trim(),
        cpqsdp: selectedCPQSDP as Array<'C' | 'P' | 'Q' | 'S' | 'D' | 'O'>,
        impactRating: impactRating!,
        date: new Date().toISOString(),
        fileAttachment: fileAttachment
      }

      await api.createAchievement(newAchievement)
      onDataChange('achievements', [...data.achievements, newAchievement])
      setTitle('')
      setSelectedLevel(null)
      setSelectedCommitId(null)
      setEvidence('')
      setSelectedCPQSDP([])
      setImpactRating(null)
      setFileAttachment(null)
      setErrors({})
      onNavigate('my-impact')
    } catch (err) {
      console.error('Failed to save achievement:', err)
      setErrors({ save: 'Failed to save achievement. Please try again.' })
    } finally {
      setIsSaving(false)
    }
  }

  const levelButtons = [
    { value: 'self' as const, label: 'Self' },
    { value: 'team' as const, label: 'Team / dept' },
    { value: 'org' as const, label: 'Organisation' }
  ]

  const commits = selectedLevel
    ? data.commits.filter(
        c => c.personId === currentPersonId && c.level === selectedLevel
      )
    : []

  const cpqsdpKeys = ['C', 'P', 'Q', 'S', 'D', 'O']

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView style={styles.container}>
        <Text style={styles.heading}>Log an achievement</Text>
        <Text style={styles.description}>
          Record what you did against one of your commits.
        </Text>

        {/* Title */}
        <View style={styles.section}>
          <Text style={styles.label}>What did you achieve?</Text>
          <TextInput
            placeholder="Brief title — keep it to one line"
            value={title}
            onChangeText={setTitle}
            style={styles.textInput}
          />
          {errors.title && <Text style={styles.error}>{errors.title}</Text>}
        </View>

        {/* Commit Level */}
        <View style={styles.section}>
          <Text style={styles.label}>Commit level</Text>
          <View style={styles.levelButtonsContainer}>
            {levelButtons.map(btn => (
              <TouchableOpacity
                key={btn.value}
                onPress={() => {
                  setSelectedLevel(btn.value)
                  setSelectedCommitId(null)
                }}
                style={[
                  styles.levelButton,
                  selectedLevel === btn.value && styles.levelButtonActive
                ]}
              >
                <Text
                  style={[
                    styles.levelButtonText,
                    selectedLevel === btn.value && styles.levelButtonTextActive
                  ]}
                >
                  {btn.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {errors.selectedLevel && <Text style={styles.error}>{errors.selectedLevel}</Text>}
        </View>

        {/* Linked Commit */}
        {selectedLevel && (
          <View style={styles.section}>
            <Text style={styles.label}>Which commit does this relate to?</Text>
            <View style={styles.commitList}>
              {commits.map(commit => (
                <TouchableOpacity
                  key={commit.id}
                  onPress={() => setSelectedCommitId(commit.id)}
                  style={[
                    styles.commitCard,
                    selectedCommitId === commit.id && styles.commitCardSelected
                  ]}
                >
                  <Text style={styles.commitText}>{commit.statement}</Text>
                </TouchableOpacity>
              ))}
            </View>
            {errors.selectedCommitId && <Text style={styles.error}>{errors.selectedCommitId}</Text>}
          </View>
        )}

        {/* Evidence */}
        <View style={styles.section}>
          <Text style={styles.label}>Evidence / notes</Text>
          <TextInput
            multiline
            placeholder="What happened, when, who was involved, any measurable outcome — be specific"
            value={evidence}
            onChangeText={setEvidence}
            style={[styles.textInput, styles.textInputMulti]}
          />
          {errors.evidence && <Text style={styles.error}>{errors.evidence}</Text>}
        </View>

        {/* File Attachment */}
        <View style={styles.section}>
          <Text style={styles.label}>Attach a file (optional)</Text>
          <TouchableOpacity
            onPress={() => setFileAttachment('document_' + Date.now() + '.pdf')}
            style={styles.uploadButton}
          >
            <Text style={styles.uploadButtonText}>Upload file</Text>
          </TouchableOpacity>
          {fileAttachment && (
            <Text style={styles.fileText}>📎 {fileAttachment}</Text>
          )}
        </View>

        {/* CPQSDP */}
        <View style={styles.section}>
          <Text style={styles.label}>Impact dimension — select all that apply</Text>
          {errors.selectedCPQSDP && <Text style={styles.error}>{errors.selectedCPQSDP}</Text>}
          <View style={styles.cpqsdpContainer}>
            {cpqsdpKeys.map((key, idx) => (
              <TouchableOpacity
                key={key}
                onPress={() => toggleCPQSDP(key)}
                style={[
                  styles.cpqsdpPill,
                  selectedCPQSDP.includes(key) && {
                    borderColor: CPQSDP_COLORS[key],
                    backgroundColor: CPQSDP_COLORS[key] + '26'
                  }
                ]}
              >
                <Text
                  style={[
                    styles.cpqsdpPillText,
                    selectedCPQSDP.includes(key) && {
                      color: CPQSDP_COLORS[key],
                      fontWeight: '500'
                    }
                  ]}
                >
                  {key} — {CPQSDP_LABELS[key]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Impact Rating */}
        <View style={styles.section}>
          <Text style={styles.label}>Impact rating — 1 to 10</Text>
          <View style={styles.ratingContainer}>
            {Array.from({ length: 10 }, (_, i) => i + 1).map(num => (
              <TouchableOpacity
                key={num}
                onPress={() => setImpactRating(num)}
                style={[
                  styles.ratingSquare,
                  impactRating === num && styles.ratingSquareActive
                ]}
              >
                <Text
                  style={[
                    styles.ratingText,
                    impactRating === num && styles.ratingTextActive
                  ]}
                >
                  {num}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.ratingGuide}>
            <Text style={styles.ratingGuideText}>1–3 Minor</Text>
            <Text style={styles.ratingGuideText}>4–6 Moderate</Text>
            <Text style={styles.ratingGuideText}>7–8 Significant</Text>
            <Text style={styles.ratingGuideText}>9–10 Transformational</Text>
          </View>
          {errors.impactRating && <Text style={styles.error}>{errors.impactRating}</Text>}
        </View>

        {/* Save Button */}
        <TouchableOpacity
          onPress={validateAndSave}
          disabled={isSaving}
          style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
        >
          {isSaving ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>Save achievement</Text>
          )}
        </TouchableOpacity>

        {errors.save && <Text style={styles.error}>{errors.save}</Text>}

        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff'
  },
  heading: {
    fontSize: 20,
    fontWeight: '500',
    color: '#1A1A1A',
    marginBottom: 8
  },
  description: {
    fontSize: 13,
    color: '#888',
    marginBottom: 24,
    marginTop: 2
  },
  section: {
    marginBottom: 20
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: '#1A1A1A',
    marginBottom: 8
  },
  textInput: {
    borderWidth: 0.5,
    borderColor: '#D0D0D0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: '#1A1A1A'
  },
  textInputMulti: {
    minHeight: 80,
    textAlignVertical: 'top'
  },
  error: {
    color: '#dc3545',
    fontSize: 12,
    marginTop: 4
  },
  levelButtonsContainer: {
    flexDirection: 'row',
    gap: 8
  },
  levelButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 0.5,
    borderColor: '#D0D0D0',
    borderRadius: 6,
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  levelButtonActive: {
    backgroundColor: '#534AB7',
    borderColor: '#534AB7'
  },
  levelButtonText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '400'
  },
  levelButtonTextActive: {
    color: '#fff',
    fontWeight: '500'
  },
  commitList: {
    gap: 8
  },
  commitCard: {
    borderWidth: 0.5,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff'
  },
  commitCardSelected: {
    borderColor: '#534AB7',
    backgroundColor: '#EEEDFE'
  },
  commitText: {
    fontSize: 13,
    color: '#444',
    lineHeight: 20
  },
  uploadButton: {
    borderWidth: 0.5,
    borderColor: '#D0D0D0',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  uploadButtonText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '400'
  },
  fileText: {
    fontSize: 12,
    color: '#534AB7',
    marginTop: 8
  },
  cpqsdpContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  cpqsdpPill: {
    flex: 1,
    minWidth: '31%',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderWidth: 0.5,
    borderColor: '#D0D0D0',
    borderRadius: 6,
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  cpqsdpPillText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '400',
    textAlign: 'center'
  },
  ratingContainer: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 12
  },
  ratingSquare: {
    width: 28,
    height: 28,
    borderWidth: 0.5,
    borderColor: '#D0D0D0',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  ratingSquareActive: {
    backgroundColor: '#534AB7',
    borderColor: '#534AB7'
  },
  ratingText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '400'
  },
  ratingTextActive: {
    color: '#fff',
    fontWeight: '500'
  },
  ratingGuide: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4
  },
  ratingGuideText: {
    fontSize: 11,
    color: '#AAA'
  },
  saveButton: {
    backgroundColor: '#534AB7',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20
  },
  saveButtonDisabled: {
    opacity: 0.5
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#fff'
  }
})
