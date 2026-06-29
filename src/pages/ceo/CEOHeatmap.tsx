import React from 'react'
import { ScrollView, View, Text, StyleSheet } from 'react-native'
import type { AppData } from '../../data/seed'
import { CPQSDP_COLORS } from '../../utils/constants'

interface CEOHeatmapProps {
  data: AppData
}

const DIMENSIONS = ['C', 'P', 'Q', 'S', 'D', 'O']

export default function CEOHeatmap({ data }: CEOHeatmapProps) {
  const personDimScore = (
    personId: string,
    dim: 'C' | 'P' | 'Q' | 'S' | 'D' | 'O'
  ): number | null => {
    const matching = data.achievements.filter(
      a => a.personId === personId && a.cpqsdp.includes(dim)
    )
    if (matching.length === 0) return null
    return +(
      matching.reduce((s, a) => s + a.impactRating, 0) / matching.length
    ).toFixed(1)
  }

  const orgAvg = (dim: 'C' | 'P' | 'Q' | 'S' | 'D' | 'O'): number | null => {
    const matching = data.achievements.filter(a =>
      a.cpqsdp.includes(dim)
    )
    if (matching.length === 0) return null
    return +(
      matching.reduce((s, a) => s + a.impactRating, 0) / matching.length
    ).toFixed(1)
  }

  const cellStyle = (value: number | null) => {
    if (value === null) {
      return { bg: '#F5F5F5', text: '#AAA', display: '—' }
    }
    if (value >= 8) {
      return { bg: '#EAF3DE', text: '#3B6D11', display: String(value) }
    }
    if (value >= 6) {
      return { bg: '#E6F1FB', text: '#185FA5', display: String(value) }
    }
    if (value >= 4) {
      return { bg: '#FAEEDA', text: '#854F0B', display: String(value) }
    }
    return { bg: '#FAECE7', text: '#993C1D', display: String(value) }
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Impact heatmap</Text>
      <Text style={styles.description}>
        Self-rated impact scores by person and dimension.
      </Text>

      {/* Heatmap Grid */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.grid}>
          {/* Header Row */}
          <View style={styles.headerRow}>
            <View style={styles.nameCell} />
            {(DIMENSIONS as Array<'C' | 'P' | 'Q' | 'S' | 'D' | 'O'>).map(dim => (
              <View key={dim} style={styles.headerCell}>
                <Text style={styles.dimChar}>{dim}</Text>
                <Text style={styles.dimLabel}>
                  {dim === 'C'
                    ? 'Cost'
                    : dim === 'P'
                      ? 'Prod'
                      : dim === 'Q'
                        ? 'Qual'
                        : dim === 'S'
                          ? 'Safe'
                          : dim === 'D'
                            ? 'Deliv'
                            : 'People'}
                </Text>
              </View>
            ))}
          </View>

          {/* Person Rows */}
          {data.people.map(person => (
            <View key={person.id} style={styles.personRow}>
              <View style={styles.nameCell}>
                <Text style={styles.personName}>
                  {person.name.split(' ')[0]}
                </Text>
              </View>
              {(DIMENSIONS as Array<'C' | 'P' | 'Q' | 'S' | 'D' | 'O'>).map(dim => {
                const score = personDimScore(person.id, dim)
                const style = cellStyle(score)
                return (
                  <View
                    key={`${person.id}-${dim}`}
                    style={[
                      styles.cell,
                      { backgroundColor: style.bg }
                    ]}
                  >
                    <Text
                      style={[
                        styles.cellText,
                        { color: style.text }
                      ]}
                    >
                      {style.display}
                    </Text>
                  </View>
                )
              })}
            </View>
          ))}

          {/* Average Row */}
          <View style={[styles.personRow, styles.avgRow]}>
            <View style={styles.nameCell}>
              <Text style={styles.avgLabel}>Avg</Text>
            </View>
            {(DIMENSIONS as Array<'C' | 'P' | 'Q' | 'S' | 'D' | 'O'>).map(dim => {
              const score = orgAvg(dim)
              const style = cellStyle(score)
              return (
                <View
                  key={`avg-${dim}`}
                  style={[
                    styles.cell,
                    { backgroundColor: style.bg }
                  ]}
                >
                  <Text
                    style={[
                      styles.cellTextBold,
                      { color: style.text }
                    ]}
                  >
                    {style.display}
                  </Text>
                </View>
              )
            })}
          </View>
        </View>
      </ScrollView>

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View
            style={[
              styles.legendSquare,
              { backgroundColor: '#EAF3DE' }
            ]}
          />
          <Text style={styles.legendLabel}>8–10 High</Text>
        </View>
        <View style={styles.legendItem}>
          <View
            style={[
              styles.legendSquare,
              { backgroundColor: '#E6F1FB' }
            ]}
          />
          <Text style={styles.legendLabel}>6–7 Good</Text>
        </View>
        <View style={styles.legendItem}>
          <View
            style={[
              styles.legendSquare,
              { backgroundColor: '#FAEEDA' }
            ]}
          />
          <Text style={styles.legendLabel}>4–5 Moderate</Text>
        </View>
        <View style={styles.legendItem}>
          <View
            style={[
              styles.legendSquare,
              { backgroundColor: '#FAECE7' }
            ]}
          />
          <Text style={styles.legendLabel}>1–3 Low</Text>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16
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
    marginBottom: 16,
    marginTop: 2
  },
  grid: {
    marginBottom: 24
  },
  headerRow: {
    flexDirection: 'row',
    marginBottom: 2
  },
  nameCell: {
    width: 70,
    justifyContent: 'center',
    paddingRight: 8
  },
  headerCell: {
    width: 40,
    marginHorizontal: 2,
    alignItems: 'center',
    paddingVertical: 4
  },
  dimChar: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666'
  },
  dimLabel: {
    fontSize: 9,
    color: '#AAA',
    marginTop: 2
  },
  personRow: {
    flexDirection: 'row',
    marginBottom: 2
  },
  avgRow: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingVertical: 4,
    marginTop: 4
  },
  personName: {
    fontSize: 12,
    color: '#444'
  },
  avgLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666'
  },
  cell: {
    width: 40,
    height: 28,
    marginHorizontal: 2,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center'
  },
  cellText: {
    fontSize: 12,
    fontWeight: '500'
  },
  cellTextBold: {
    fontSize: 12,
    fontWeight: '600'
  },
  legend: {
    flexDirection: 'row',
    gap: 16,
    paddingVertical: 12,
    borderTopWidth: 0.5,
    borderTopColor: '#E0E0E0',
    marginTop: 16,
    marginBottom: 40
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  legendSquare: {
    width: 10,
    height: 10,
    borderRadius: 2
  },
  legendLabel: {
    fontSize: 11,
    color: '#666'
  }
})
