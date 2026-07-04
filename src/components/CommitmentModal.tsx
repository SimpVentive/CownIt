import React from 'react'
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native'

interface CommitmentModalProps {
  visible: boolean
  commitmentCount: number
  onNavigateToAddCommitment: () => void
}

export default function CommitmentModal({
  visible,
  commitmentCount,
  onNavigateToAddCommitment
}: CommitmentModalProps) {
  const remaining = 3 - commitmentCount

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Complete Your Commitments</Text>

          <Text style={styles.message}>
            You need to enter at least 3 commitments (self, team, organization) to get started.
          </Text>

          <View style={styles.progressSection}>
            <Text style={styles.progressLabel}>
              Progress: {commitmentCount} of 3
            </Text>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${(commitmentCount / 3) * 100}%` }
                ]}
              />
            </View>
          </View>

          {remaining > 0 && (
            <Text style={styles.remainingText}>
              {remaining} more {remaining === 1 ? 'commitment' : 'commitments'} needed
            </Text>
          )}

          <TouchableOpacity
            onPress={onNavigateToAddCommitment}
            style={styles.addButton}
          >
            <Text style={styles.addButtonText}>Add Commitments</Text>
          </TouchableOpacity>

          <Text style={styles.helpText}>
            Your commitments help us track your progress across self, team, and organizational goals.
          </Text>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxWidth: 400
  },
  title: {
    fontSize: 18,
    fontWeight: '500',
    color: '#1A1A1A',
    marginBottom: 12,
    textAlign: 'center'
  },
  message: {
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
    textAlign: 'center'
  },
  progressSection: {
    marginVertical: 16
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1A1A1A',
    marginBottom: 8
  },
  progressBar: {
    height: 6,
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    overflow: 'hidden'
  },
  progressFill: {
    height: 6,
    backgroundColor: '#534AB7',
    borderRadius: 4
  },
  remainingText: {
    fontSize: 12,
    color: '#993C1D',
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 16
  },
  addButton: {
    backgroundColor: '#534AB7',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 12
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#fff'
  },
  helpText: {
    fontSize: 11,
    color: '#888',
    textAlign: 'center',
    lineHeight: 16
  }
})
