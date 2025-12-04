import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { useAuth } from '../context/AuthContext';
import { Header } from '../components/Header';
import { Card } from '../components/Card';
import { colors } from '../theme';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

interface DashboardCard {
  title: string;
  buttons: {
    label: string;
    variant: 'primary' | 'secondary';
    screen: keyof RootStackParamList;
  }[];
}

export default function HomeScreen({ navigation }: Props) {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigation.replace('Login');
  };

  const dashboardCards: DashboardCard[] = [
    {
      title: 'Medições',
      buttons: [
        { label: 'Nova medição', variant: 'primary', screen: 'NovaMedicao' },
        { label: 'Consultar Medições', variant: 'secondary', screen: 'Relatorios' },
      ],
    },
    {
      title: 'Bases de Medições',
      buttons: [
        { label: 'Cadastrar Base', variant: 'primary', screen: 'CadastrarBase' },
        { label: 'Consultar Base', variant: 'secondary', screen: 'ConsultarBase' },
      ],
    },
    {
      title: 'Usuários',
      buttons: [
        { label: 'Gerenciar Usuários', variant: 'primary', screen: 'GerenciarUsuarios' },
      ],
    },
    {
      title: 'Configurações e Segurança',
      buttons: [
        { label: 'Configurações', variant: 'primary', screen: 'Configuracoes' },
      ],
    },
  ];

  return (
    <View style={styles.container}>
      <Header
        title="Grupo EPA"
        subtitle="Portal de Medições"
        userName={user?.nomeCompleto}
        userRole={user?.cargo}
        onLogout={handleLogout}
      />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {dashboardCards.map((card, index) => (
          <Card key={index} style={styles.card}>
            <Text style={styles.cardTitle}>{card.title}</Text>
            <View style={styles.buttonsContainer}>
              {card.buttons.map((button, btnIndex) => (
                <TouchableOpacity
                  key={btnIndex}
                  style={[
                    styles.cardButton,
                    button.variant === 'primary'
                      ? styles.primaryButton
                      : styles.secondaryButton,
                  ]}
                  onPress={() => navigation.navigate(button.screen)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.cardButtonText,
                      button.variant === 'primary'
                        ? styles.primaryButtonText
                        : styles.secondaryButtonText,
                    ]}
                  >
                    {button.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: 16,
  },
  buttonsContainer: {
    gap: 12,
  },
  cardButton: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.black,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: colors.primaryLight,
  },
  secondaryButton: {
    backgroundColor: colors.white,
  },
  cardButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  primaryButtonText: {
    color: colors.black,
  },
  secondaryButtonText: {
    color: colors.black,
  },
});
