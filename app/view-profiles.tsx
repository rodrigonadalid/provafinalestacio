import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Platform, Alert } from 'react-native';
import { useNavigation } from 'expo-router';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { db, type UserProfile } from './src/db/database';

export default function ViewProfilesScreen() {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const navigation = useNavigation<DrawerNavigationProp<any>>();

  // Live query database implementation
  useEffect(() => {
    const fetchProfiles = async () => {
      const data = await db.profiles.toArray();
      setProfiles(data);
    };

    fetchProfiles();
    // Re-fetch when screen focuses to prevent stale states
    const unsubscribe = navigation.addListener('focus', fetchProfiles);
    return unsubscribe;
  }, [navigation]);

  const handleDelete = async (id: number) => {
    const performDelete = async () => {
      await db.profiles.delete(id);
      setProfiles(profiles.filter(p => p.id !== id));
    };

    if (Platform.OS === 'web') {
      if (confirm('Tem certeza que quer deletar este perfil?')) performDelete();
    } else {
      Alert.alert('Deletar', 'Está certo?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: performDelete }
      ]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>CONTAS DE USUARIOS</Text>
      {profiles.length === 0 ? (
        <Text style={styles.emptyText}>Ainda não existem perfis criados. Crie algum selcionando o menu à esquerda!</Text>
      ) : (
        <FlatList
          data={profiles}
          keyExtractor={(item) => item.id!.toString()}
          renderItem={({ item }) => (
            <View style={[styles.card, { borderColor: item.avatarColor }]}>
              <View style={styles.cardHeader}>
                <View style={[styles.avatar, { backgroundColor: item.avatarColor }]} />
                <View style={styles.headerText}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.email}>{item.email}</Text>
                </View>
              </View>
              {item.bio ? <Text style={styles.bio}>{item.bio}</Text> : null}
              <View style={styles.actions}>
                <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('edit-profile', { id: item.id })}>
                  <Text style={styles.editText}>EDITAR</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id!)}>
                  <Text style={styles.deleteText}>DELETAR</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A', padding: 24 },
  title: { fontSize: 24, fontWeight: '900', color: '#FF2A7A', marginBottom: 24, letterSpacing: 2, textAlign: 'center' },
  emptyText: { color: '#555', textAlign: 'center', marginTop: 40, fontSize: 16 },
  card: { backgroundColor: '#121212', borderWidth: 1, borderRadius: 12, padding: 16, marginBottom: 16 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 12 },
  headerText: { flex: 1 },
  name: { color: '#FFF', fontSize: 18, fontWeight: '700' },
  email: { color: '#FF71A7', fontSize: 14 },
  bio: { color: '#CCC', fontSize: 14, marginBottom: 16, lineHeight: 20 },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12 },
  editButton: { borderWidth: 1, borderColor: '#FF71A7', paddingVertical: 6, paddingHorizontal: 16, borderRadius: 4 },
  editText: { color: '#FF71A7', fontWeight: '700', fontSize: 12 },
  deleteButton: { backgroundColor: '#D10056', paddingVertical: 6, paddingHorizontal: 16, borderRadius: 4 },
  deleteText: { color: '#FFF', fontWeight: '700', fontSize: 12 },
});