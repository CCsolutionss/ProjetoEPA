import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/context/AuthContext';
import { theme } from './src/theme';

// Screens
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import NovaMedicaoScreen from './src/screens/NovaMedicaoScreen';
import RelatoriosScreen from './src/screens/RelatoriosScreen';
import CadastrarBaseScreen from './src/screens/CadastrarBaseScreen';
import ConsultarBaseScreen from './src/screens/ConsultarBaseScreen';
import GerenciarUsuariosScreen from './src/screens/GerenciarUsuariosScreen';
import CriarUsuarioScreen from './src/screens/CriarUsuarioScreen';
import ConfiguracoesScreen from './src/screens/ConfiguracoesScreen';

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  NovaMedicao: undefined;
  Relatorios: undefined;
  CadastrarBase: undefined;
  ConsultarBase: undefined;
  GerenciarUsuarios: undefined;
  CriarUsuario: undefined;
  Configuracoes: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <AuthProvider>
      <PaperProvider theme={theme}>
        <NavigationContainer>
          <StatusBar style="auto" />
          <Stack.Navigator
            initialRouteName="Login"
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="NovaMedicao" component={NovaMedicaoScreen} />
            <Stack.Screen name="Relatorios" component={RelatoriosScreen} />
            <Stack.Screen name="CadastrarBase" component={CadastrarBaseScreen} />
            <Stack.Screen name="ConsultarBase" component={ConsultarBaseScreen} />
            <Stack.Screen name="GerenciarUsuarios" component={GerenciarUsuariosScreen} />
            <Stack.Screen name="CriarUsuario" component={CriarUsuarioScreen} />
            <Stack.Screen name="Configuracoes" component={ConfiguracoesScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </AuthProvider>
  );
}
