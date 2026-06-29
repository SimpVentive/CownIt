import React, { useState } from 'react'
import { ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import type { AppData, Commit, MonthlyUpdate } from '../../data/seed'
import { formatDateShort, formatDate, currentMonth, currentYear, currentMonthName, lastDayOfNextMonth } from '../../utils/formatDate'
import { LEVEL_COLORS } from '../../utils/constants'

interface MyCommitsProps {
  data: AppData
  currentPersonId: string
  onDataChange: (entity: keyof AppData, newArray: any[]) => void
}

export default function MyCommits({ data, currentPersonId, onDataChange }: MyCommitsProps) {
  const [addingCommit, setAddingCommit] = useState<{ level: string; slot: number } | null>(null)
  const [draftStatement, setDraftStatement] = useState('')
  const [showUpdateForm, setShowUpdateForm] = useState(false)
  const [updateNote, setUpdateNote] = useState('')

  const levels = ['self', 'team', 'org']

  const saveCommit = () => {
    if (draftStatement.trim().length < 5) return
    const newCommit: Commit = {
      id: 'c' + Date.now(),
      personId: currentPersonId,
      level: addingCommit!.level as 'self' | 'team' | 'org',
      statement: draftStatement.trim(),
      createdAt: new Date().toISOString()
    }
    onDataChange('commits', [...data.commits, newCommit])
    setAddingCommit(null)
    setDraftStatement('')
  }

  const saveUpdate = () => {
    if (updateNote.trim().length < 3) return
    const newUpdate: MonthlyUpdate = {
      id: 'u' + Date.now(),
      personId: currentPersonId,
      month: currentMonth(),
      year: currentYear(),
      note: updateNote.trim(),
      updatedAt: new Date().toISOString()
    }
    onDataChange('monthlyUpdates', [...data.monthlyUpdates, newUpdate])
    setShowUpdateForm(false)
    setUpdateNote('')
  }

  const monthlyUpdate = data.monthlyUpdates.find(
    u => u.personId === currentPersonId && u.month === currentMonth() && u.year === currentYear()
  )

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>My commits</Text>
      <Text style={styles.description}>
        Your 3-level commitment — self, team, and organisation.
      </Text>

      {levels.map(level => {
        const levelColor = LEVEL_COLORS[level]
        const commits = data.commits
          .filter(c => c.personId === currentPersonId && c.level === level)
          .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())

        return (
          <View key={level} style={styles.section}>
            <View style={styles.sectionHeader}>
              <View
                style={[
                  styles.badge,
                  { backgroundColor: levelColor.bg }
                ]}
              >
                <Text style={[styles.badgeText, { color: levelColor.text }]}>
                  {levelColor.label}
                </Text>
              </View>
            </View>

            {[0, 1, 2].map(slotIndex => {
              const commit = commits[slotIndex]
              const isAdding =
                addingCommit && addingCommit.level === level && addingCommit.slot === slotIndex

              if (commit) {
                return (
                  <View key={`${level}-${slotIndex}`} style={styles.commitCard}>
                    <Text style={styles.commitStatement}>{commit.statement}</Text>
                    <Text style={styles.commitDate}>{formatDateShort(commit.createdAt)}</Text>
                  </View>
                )
              }

              if (isAdding) {
                return (
                  <View key={`${level}-${slotIndex}`}>
                    <TextInput
                      multiline
                      placeholder="Write your commit statement..."
                      value={draftStatement}
                      onChangeText={setDraftStatement}
                      style={styles.textInput}
                    />
                    <View style={styles.buttonRow}>
                      <TouchableOpacity
                        onPress={saveCommit}
                        disabled={draftStatement.trim().length < 5}
                        style={[
                          styles.buttonSave,
                          draftStatement.trim().length < 5 && styles.buttonDisabled
                        ]}
                      >
                        <Text style={styles.buttonSaveText}>Save</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          setAddingCommit(null)
                          setDraftStatement('')
                        }}
                        style={styles.buttonCancel}
                      >
                        <Text style={styles.buttonCancelText}>Cancel</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )
              }

              return (
                <TouchableOpacity
                  key={`${level}-${slotIndex}`}
                  onPress={() => setAddingCommit({ level, slot: slotIndex })}
                  style={styles.addCard}
                >
                  <Text style={styles.addText}>+ Add commit {slotIndex + 1}</Text>
                </TouchableOpacity>
              )
            })}
          </View>
        )
      })}

      <View style={styles.updateCardContainer}>
        {monthlyUpdate ? (
          <View style={styles.updateCardCompleted}>
            <View style={styles.completedRow}>
              <View style={styles.greenDot} />
              <Text style={styles.completedText}>{currentMonthName()} updated</Text>
            </View>
            <Text style={styles.updateMetaText}>
              Last updated: {formatDate(monthlyUpdate.updatedAt)}
            </Text>
            <Text style={styles.updateMetaText}>
              Next due: {lastDayOfNextMonth()}
            </Text>
          </View>
        ) : (
          <View style={styles.updateCardPending}>
            <Text style={styles.pendingText}>{currentMonthName()} update pending</Text>
            <Text style={styles.pendingDescText}>
              Log at least one achievement to mark this month complete.
            </Text>
            {!showUpdateForm ? (
              <TouchableOpacity
                onPress={() => setShowUpdateForm(true)}
                style={styles.recordButton}
              >
                <Text style={styles.recordButtonText}>Record update note</Text>
              </TouchableOpacity>
            ) : (
              <>
                <TextInput
                  multiline
                  placeholder="Brief note on your progress this month..."
                  value={updateNote}
                  onChangeText={setUpdateNote}
                  style={styles.updateTextInput}
                />
                <TouchableOpacity
                  onPress={saveUpdate}
                  disabled={updateNote.trim().length < 3}
                  style={[
                    styles.saveUpdateButton,
                    updateNote.trim().length < 3 && styles.buttonDisabled
                  ]}
                >
                  <Text style={styles.saveUpdateButtonText}>Save update</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        )}
      </View>
    </ScrollView>
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
    marginBottom: 24
  },
  sectionHeader: {
    marginBottom: 12
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
    alignSelf: 'flex-start'
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '500'
  },
  commitCard: {
    backgroundColor: '#fff',
    borderWidth: 0.5,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8
  },
  commitStatement: {
    fontSize: 13,
    color: '#444',
    lineHeight: 20
  },
  commitDate: {
    fontSize: 11,
    color: '#AAA',
    marginTop: 4
  },
  addCard: {
    borderWidth: 0.5,
    borderColor: '#D0D0D0',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  addText: {
    fontSize: 13,
    color: '#AAA'
  },
  textInput: {
    borderWidth: 0.5,
    borderColor: '#534AB7',
    borderRadius: 8,
    padding: 10,
    minHeight: 72,
    fontSize: 13,
    marginBottom: 8,
    textAlignVertical: 'top'
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8
  },
  buttonSave: {
    backgroundColor: '#534AB7',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 6,
    flex: 1,
    alignItems: 'center'
  },
  buttonSaveText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500'
  },
  buttonCancel: {
    borderWidth: 0.5,
    borderColor: '#D0D0D0',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 6,
    flex: 1,
    alignItems: 'center'
  },
  buttonCancelText: {
    color: '#666',
    fontSize: 12,
    fontWeight: '400'
  },
  buttonDisabled: {
    opacity: 0.5
  },
  updateCardContainer: {
    marginBottom: 40
  },
  updateCardCompleted: {
    backgroundColor: '#E1F5EE',
    borderWidth: 0.5,
    borderColor: '#9FE1CB',
    borderRadius: 12,
    padding: 14
  },
  completedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8
  },
  greenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3B6D11'
  },
  completedText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#085041'
  },
  updateMetaText: {
    fontSize: 12,
    color: '#888',
    marginTop: 4
  },
  updateCardPending: {
    backgroundColor: '#FAEEDA',
    borderWidth: 0.5,
    borderColor: '#FAC775',
    borderRadius: 12,
    padding: 14
  },
  pendingText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#633806',
    marginBottom: 8
  },
  pendingDescText: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
    marginBottom: 12
  },
  recordButton: {
    backgroundColor: '#534AB7',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    alignSelf: 'flex-start'
  },
  recordButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500'
  },
  updateTextInput: {
    borderWidth: 0.5,
    borderColor: '#D0D0D0',
    borderRadius: 8,
    padding: 10,
    minHeight: 60,
    fontSize: 13,
    marginVertical: 12,
    textAlignVertical: 'top'
  },
  saveUpdateButton: {
    backgroundColor: '#534AB7',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    alignSelf: 'flex-start'
  },
  saveUpdateButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500'
  }
})
