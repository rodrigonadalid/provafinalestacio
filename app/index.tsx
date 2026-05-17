import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, ScrollView, Alert, Platform } from 'react-native';
import { db } from './src/db/database';

export default function CreateProfileScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const colors = ['#FF2A7A', '#FF71A7', '#D10056', '#9B003C'];
  const [avatarColor, setAvatarColor] = useState(colors[0]);

  const handleCreate = async () => {
    if (!name || !email) {
      const msg = 'Nome e Email são obrigatórios.';
      Platform.OS === 'web' ? alert(msg) : Alert.alert('Error', msg);
      return;
    }

    try {
      await db.profiles.add({ name, email, bio, avatarColor });
      const successMsg = 'Perfil criado com sucesso!';
      Platform.OS === 'web' ? alert(successMsg) : Alert.alert('Success', successMsg);
      
      // Reset form
      setName('');
      setEmail('');
      setBio('');
    } catch (error) {
      console.error('Falha em salvar perfil:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>CRIAR CONTA</Text>
      
      <Text style={styles.label}>Nome</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Zé das Couves" placeholderTextColor="#555" />

      <Text style={styles.label}>Email</Text>
      <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="zezeborsetta@exemplo.com" placeholderTextColor="#555" keyboardType="email-address" />

      <Text style={styles.label}>Bio</Text>
      <TextInput style={[styles.input, styles.bioInput]} value={bio} onChangeText={setBio} placeholder="Descreva-se em algumas palavras..." placeholderTextColor="#555" multiline numberOfLines={3} />

      <Text style={styles.label}>Tema</Text>
      <View style={styles.colorContainer}>
        {colors.map((color) => (
          <TouchableOpacity key={color} style={[styles.colorDot, { backgroundColor: color }, avatarColor === color && styles.selectedDot]} onPress={() => setAvatarColor(color)} />
        ))}
      </View>

      <TouchableOpacity style={styles.button} onPress={handleCreate}>
        <Text style={styles.buttonText}>SALVAR</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#0A0A0A', padding: 24, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: '900', color: '#FF2A7A', marginBottom: 24, letterSpacing: 2, textAlign: 'center' },
  label: { color: '#FF71A7', fontSize: 14, fontWeight: '700', marginBottom: 8, textTransform: 'uppercase' },
  input: { backgroundColor: '#121212', borderWidth: 1, borderColor: '#FF2A7A', borderRadius: 8, padding: 12, color: '#FFF', marginBottom: 20, fontSize: 16 },
  bioInput: { height: 80, textAlignVertical: 'top' },
  colorContainer: { flexDirection: 'row', marginBottom: 30, gap: 15 },
  colorDot: { width: 40, height: 40, borderRadius: 20, borderWidth: 2, borderColor: 'transparent' },
  selectedDot: { borderColor: '#FFF', transform: [{ scale: 1.1 }] },
  button: { backgroundColor: '#FF2A7A', paddingVertical: 16, borderRadius: 8, alignItems: 'center', shadowColor: '#FF2A7A', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5 },
  buttonText: { color: '#000', fontSize: 16, fontWeight: '900', letterSpacing: 1 },
});