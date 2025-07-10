import React, { useState } from 'react';
import { View, Button, Text } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';

/**
 * Componente para seleccionar archivos de audio mp3 desde el dispositivo
 * Permite al usuario elegir un archivo y muestra el nombre del archivo seleccionado
 *
 * @param {function} onAudioSelected - Callback que recibe la URI del archivo seleccionado
 */
const AudioPicker = ({ onAudioSelected }) => {
  const [audioName, setAudioName] = useState(null);

  const pickAudio = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'audio/mpeg',
        copyToCacheDirectory: true,
        multiple: false,
      });
      if (result.type === 'success') {
        setAudioName(result.name);
        if (onAudioSelected) {
          onAudioSelected(result.uri);
        }
      }
    } catch (error) {
      console.warn('Error seleccionando audio:', error);
    }
  };

  return (
    <View style={{ marginVertical: 10 }}>
      <Button title="Seleccionar audio MP3" onPress={pickAudio} />
      {audioName && <Text style={{ marginTop: 8 }}>Archivo: {audioName}</Text>}
    </View>
  );
};

export default AudioPicker;
