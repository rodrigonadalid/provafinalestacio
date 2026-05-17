import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, ScrollView, Alert, Platform } from 'react-native';
import { useLocalSearchParams, useRouter, Redirect } from 'expo-router';
import { db } from './src/db/database';

export default function EditProfileScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [avatarColor, setAvatarColor] = useState('#FF2A7A');

  useEffect(() => {
    if (!id) return;
    const loadProfile = async () => {
      const profile = await db.profiles.get(Number(id));
      if (profile) {
        setName(profile.name);
        setEmail(profile.email);
        setBio(profile.bio);
        setAvatarColor(profile.avatarColor);
      }
    };
    loadProfile();
  }, [id]);

  const handleUpdate = async () => {
    if (!id) return;
    if (!name || !email) {
      const msg = 'Nome e Email são obrigatórios.';
      Platform.OS === 'web' ? alert(msg) : Alert.alert('Error', msg);
      return;
    }

    try {
      await db.profiles.update(Number(id), { name, email, bio, avatarColor });
      const successMsg = 'Perfil atualizado com sucesso!';
      Platform.OS === 'web' ? alert(successMsg) : Alert.alert('Success', successMsg);
      router.push('/view-profiles');
    } catch (error) {
      console.error('Atualização falhou:', error);
    }
  };

  if (!id) {
  // Instead of showing a dead-end text screen, silently redirect to the home screen
  return <Redirect href="/" />;
}

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>EDITAR PERFIL</Text>
      
      <Text style={styles.label}>Nome</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} placeholderTextColor="#555" />

      <Text style={styles.label}>Email</Text>
      <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholderTextColor="#555" keyboardType="email-address" />

      <Text style={styles.label}>Bio</Text>
      <TextInput style={[styles.input, styles.bioInput]} value={bio} onChangeText={setBio} placeholderTextColor="#555" multiline numberOfLines={3} />

      <TouchableOpacity style={styles.button} onPress={handleUpdate}>
        <Text style={styles.buttonText}>SALVAR MUDANÇAS</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#0A0A0A', padding: 24, justifyContent: 'center' },
  errorContainer: { flex: 1, backgroundColor: '#0A0A0A', justifyContent: 'center', alignItems: 'center', padding: 24 },
  errorText: { color: '#FF71A7', fontSize: 16, textAlign: 'center' },
  title: { fontSize: 24, fontWeight: '900', color: '#FF2A7A', marginBottom: 24, letterSpacing: 2, textAlign: 'center' },
  label: { color: '#FF71A7', fontSize: 14, fontWeight: '700', marginBottom: 8, textTransform: 'uppercase' },
  input: { backgroundColor: '#121212', borderWidth: 1, borderColor: '#FF2A7A', borderRadius: 8, padding: 12, color: '#FFF', marginBottom: 20, fontSize: 16 },
  bioInput: { height: 80, textAlignVertical: 'top' },
  button: { backgroundColor: '#FF2A7A', paddingVertical: 16, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#000', fontSize: 16, fontWeight: '900', letterSpacing: 1 },
});