import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { StyleSheet } from 'react-native';

export default function RootLayout() {
  return (
    // GestureHandlerRootView eliminates common touch-event errors on android devices
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          headerStyle: {
            backgroundColor: '#0A0A0A',
            borderBottomWidth: 1,
            borderBottomColor: '#FF2A7A',
          },
          headerTintColor: '#FF2A7A',
          headerTitleStyle: {
            fontWeight: '900',
            letterSpacing: 1,
          },
          drawerStyle: {
            backgroundColor: '#0A0A0A',
            width: 250,
            borderRightWidth: 1,
            borderRightColor: '#FF2A7A',
          },
          drawerActiveTintColor: '#FF2A7A',
          drawerInactiveTintColor: '#FF71A7',
          drawerActiveBackgroundColor: '#1A000A',
        }}
      >
        <Drawer.Screen
          name="index"
          options={{
            drawerLabel: 'Criar Conta',
            title: 'NOVO PERFIL',
          }}
        />
        <Drawer.Screen
          name="view-profiles"
          options={{
            drawerLabel: 'Contas Criadas',
            title: 'DASHBOARD',
          }}
        />
        <Drawer.Screen
          name="edit-profile"
          options={{
            drawerLabel: 'Atualizar Perfis',
            title: 'CONTAS CRIADAS',
            // Keeps the edit viewport tucked cleanly inside drawer contexts
            drawerItemStyle: { display: 'none' } 
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}