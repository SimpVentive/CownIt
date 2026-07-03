import React, { useState } from 'react'
import { View, Text, StyleSheet, GestureResponderEvent } from 'react-native'

interface ImpactSliderProps {
  label: string
  value: number
  onChange: (value: number) => void
  color: string
}

export default function ImpactSlider({ label, value, onChange, color }: ImpactSliderProps) {
  const [isDragging, setIsDragging] = useState(false)

  const handlePress = (event: GestureResponderEvent) => {
    const { locationX } = event.nativeEvent
    const newValue = Math.round((locationX / 280) * 10)
    onChange(Math.max(0, Math.min(10, newValue)))
  }

  const percentage = (value / 10) * 100

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <Text style={[styles.value, { color }]}>{value}/10</Text>
      </View>
      <View
        style={styles.sliderTrack}
        onStartShouldSetResponder={() => true}
        onResponderGrant={(event) => {
          setIsDragging(true)
          handlePress(event)
        }}
        onResponderMove={(event) => {
          if (isDragging) {
            handlePress(event)
          }
        }}
        onResponderRelease={() => setIsDragging(false)}
      >
        <View
          style={[
            styles.sliderFill,
            {
              width: `${percentage}%`,
              backgroundColor: color
            }
          ]}
        />
        <View
          style={[
            styles.sliderThumb,
            {
              left: `${percentage}%`,
              backgroundColor: color,
              borderColor: color
            }
          ]}
        />
      </View>
      <View style={styles.guide}>
        <Text style={styles.guideText}>1–3</Text>
        <Text style={styles.guideText}>4–6</Text>
        <Text style={styles.guideText}>7–8</Text>
        <Text style={styles.guideText}>9–10</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: '#1A1A1A'
  },
  value: {
    fontSize: 14,
    fontWeight: '600'
  },
  sliderTrack: {
    height: 28,
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    marginBottom: 8,
    justifyContent: 'center',
    position: 'relative'
  },
  sliderFill: {
    height: 28,
    borderRadius: 4,
    opacity: 0.3,
    position: 'absolute',
    left: 0,
    top: 0
  },
  sliderThumb: {
    width: 20,
    height: 28,
    borderRadius: 4,
    borderWidth: 2,
    position: 'absolute',
    marginLeft: -10
  },
  guide: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4
  },
  guideText: {
    fontSize: 11,
    color: '#AAA'
  }
})
