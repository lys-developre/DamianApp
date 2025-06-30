import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function AdminConfigScreen({ onBack }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configuración</Text>
      <TouchableOpacity style={styles.configButton}>
        <Text style={styles.buttonText}>Imagenes con temporizador</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.configButton}>
        <Text style={styles.buttonText}>Configurar temporizador</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.configButton}>
        <Text style={styles.buttonText}>Configurar frases</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Text style={styles.buttonText}>Volver</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 30,
  },
  configButton: {
    backgroundColor: '#45B7D1',
    paddingVertical: 16,
    paddingHorizontal: 20, // Menos padding horizontal para texto largo
    borderRadius: 16,
    marginBottom: 18,
    minWidth: 260,
    maxWidth: 320,
    alignItems: 'center',
  },
  backButton: {
    backgroundColor: '#F59E42',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 16,
    marginTop: 30,
    width: 180,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center', // Centrado para varias líneas
  },
});
