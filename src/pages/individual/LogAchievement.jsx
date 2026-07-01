import React, { useState } from 'react';
import { Upload } from 'lucide-react-native';
import { Picker } from '@react-native-picker/picker';
import * as DocumentPicker from 'expo-document-picker';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
} from "react-native";

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

  const pickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      copyToCacheDirectory: true,
      multiple: false,
    });

    if (!result.canceled) {
      setFile(result.assets[0]);
    }
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
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{
        padding: 20,
        paddingBottom: 40,
      }}
      showsVerticalScrollIndicator={false}
    >
      <Text
        style={{
          fontSize: 22,
          fontWeight: '700',
          marginBottom: 24,
        }}
      >
        Log Achievement
      </Text>

      {/* Title */}
      <View style={{ marginBottom: 20 }}>
        <Text style={{ marginBottom: 8, fontWeight: '600' }}>
          What did you achieve?
        </Text>

        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Brief title"
          style={{
            borderWidth: 1,
            borderColor: errors.title ? '#dc3545' : '#ddd',
            borderRadius: 8,
            padding: 12,
          }}
        />

        {errors.title && (
          <Text style={{ color: '#dc3545', marginTop: 5 }}>
            {errors.title}
          </Text>
        )}
      </View>

      {/* Commitment Level */}
      <View style={{ marginBottom: 20 }}>
        <Text style={{ marginBottom: 10, fontWeight: '600' }}>
          Commitment Level
        </Text>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          {['self', 'team', 'org'].map(level => (
            <Pressable
              key={level}
              onPress={() => {
                setSelectedLevel(level);
                setSelectedCommitId(null);
              }}
              style={{
                flex: 1,
                marginHorizontal: 3,
                paddingVertical: 12,
                borderRadius: 8,
                backgroundColor:
                  selectedLevel === level ? '#000' : '#f5f5f5',
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  color:
                    selectedLevel === level ? '#fff' : '#000',
                }}
              >
                {level === 'self'
                  ? 'Self'
                  : level === 'team'
                  ? 'Team / Dept'
                  : 'Organisation'}
              </Text>
            </Pressable>
          ))}
        </View>

        {errors.level && (
          <Text style={{ color: '#dc3545', marginTop: 5 }}>
            {errors.level}
          </Text>
        )}
      </View>

      {/* Commit Picker */}
      {selectedLevel && (
        <View style={{ marginBottom: 20 }}>
          <Text style={{ marginBottom: 8, fontWeight: '600' }}>
            Select Commit
          </Text>

          <View
            style={{
              borderWidth: 1,
              borderColor: '#ddd',
              borderRadius: 8,
            }}
          >
            <Picker
              selectedValue={selectedCommitId}
              onValueChange={setSelectedCommitId}
            >
              <Picker.Item
                label="Choose a commit..."
                value={null}
              />

              {levelCommits.map(commit => (
                <Picker.Item
                  key={commit.id}
                  label={commit.statement.substring(0, 50)}
                  value={commit.id}
                />
              ))}
            </Picker>
          </View>

          {errors.commit && (
            <Text style={{ color: '#dc3545', marginTop: 5 }}>
              {errors.commit}
            </Text>
          )}
        </View>
      )}

      {/* Evidence */}
      <View style={{ marginBottom: 20 }}>
        <Text style={{ marginBottom: 8, fontWeight: '600' }}>
          Evidence / Notes
        </Text>

        <TextInput
          value={evidence}
          onChangeText={setEvidence}
          multiline
          numberOfLines={5}
          textAlignVertical="top"
          placeholder="Describe your achievement..."
          style={{
            borderWidth: 1,
            borderColor: errors.evidence ? '#dc3545' : '#ddd',
            borderRadius: 8,
            padding: 12,
            minHeight: 120,
          }}
        />

        {errors.evidence && (
          <Text style={{ color: '#dc3545', marginTop: 5 }}>
            {errors.evidence}
          </Text>
        )}
      </View>

      {/* File Upload */}
      <View style={{ marginBottom: 20 }}>
        <Text style={{ marginBottom: 8, fontWeight: '600' }}>
          File Attachment
        </Text>

        <Pressable
          onPress={pickDocument}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#f5f5f5',
            padding: 12,
            borderRadius: 8,
          }}
        >
          <Upload size={18} />

          <Text style={{ marginLeft: 10 }}>
            {file ? file.name : 'Choose File'}
          </Text>
        </Pressable>
      </View>

      {/* CPQSDP */}
      <View style={{ marginBottom: 20 }}>
        <Text style={{ marginBottom: 10, fontWeight: '600' }}>
          Impact Dimensions
        </Text>

        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
          }}
        >
          {CPQSDP_DIMS.map(dim => (
            <Pressable
              key={dim.key}
              onPress={() => {
                setSelectedDims(
                  selectedDims.includes(dim.key)
                    ? selectedDims.filter(
                        d => d !== dim.key
                      )
                    : [...selectedDims, dim.key]
                );
              }}
              style={{
                margin: 4,
                paddingHorizontal: 14,
                paddingVertical: 10,
                borderRadius: 20,
                backgroundColor: selectedDims.includes(dim.key)
                  ? dim.color
                  : '#f5f5f5',
              }}
            >
              <Text
                style={{
                  color: selectedDims.includes(dim.key)
                    ? '#fff'
                    : '#000',
                }}
              >
                {dim.key} - {dim.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {errors.dims && (
          <Text style={{ color: '#dc3545' }}>
            {errors.dims}
          </Text>
        )}
      </View>

      {/* Impact Rating */}
      <View style={{ marginBottom: 25 }}>
        <Text style={{ marginBottom: 10, fontWeight: '600' }}>
          Impact Rating
        </Text>

        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
          }}
        >
          {[1,2,3,4,5,6,7,8,9,10].map(num => (
            <Pressable
              key={num}
              onPress={() => setImpactRating(num)}
              style={{
                width: 40,
                height: 40,
                margin: 4,
                borderRadius: 20,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor:
                  impactRating === num
                    ? '#000'
                    : '#eee',
              }}
            >
              <Text
                style={{
                  color:
                    impactRating === num
                      ? '#fff'
                      : '#000',
                }}
              >
                {num}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text
          style={{
            marginTop: 10,
            color: '#777',
            fontSize: 12,
          }}
        >
          1–3 Minor • 4–6 Moderate • 7–8 Significant • 9–10 Transformational
        </Text>

        {errors.rating && (
          <Text style={{ color: '#dc3545' }}>
            {errors.rating}
          </Text>
        )}
      </View>

      {/* Save */}
      <Pressable
        onPress={handleSave}
        style={{
          backgroundColor: '#000',
          paddingVertical: 16,
          borderRadius: 10,
          alignItems: 'center',
        }}
      >
        <Text
          style={{
            color: '#fff',
            fontWeight: '700',
            fontSize: 16,
          }}
        >
          Save Achievement
        </Text>
      </Pressable>
    </ScrollView>
  );
}

export default LogAchievement;
