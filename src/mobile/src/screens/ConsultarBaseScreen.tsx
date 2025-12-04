import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { Header } from '../components/Header';
import { Card } from '../components/Card';
import { colors } from '../theme';

type ConsultarBaseScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ConsultarBase'
>;

interface Props {
  navigation: ConsultarBaseScreenNavigationProp;
}

const mockBases = [
  {
    id: '1',
    nome: 'Sistema de Refrigeração - Unidade A',
    endereco: 'Rua das Flores, 123 - São Paulo/SP',
    status: 'Ativa',
  },
  {
    id: '2',
    nome: 'Monitoramento Energético - Fábrica B',
    endereco: 'Av. Industrial, 456 - Guarulhos/SP',
    status: 'Ativa',
  },
  {
    id: '3',
    nome: 'Qualidade do Ar - Escritório Central',
    endereco: 'Rua Comercial, 789 - São Paulo/SP',
    status: 'Ativa',
  },
];

export default function ConsultarBaseScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Header
        title="Consultar Bases"
        showBackButton
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Text style={styles.pageTitle}>Bases Cadastradas</Text>

        {mockBases.map((base) => (
          <Card key={base.id} style={styles.baseCard}>
            <Text style={styles.baseName}>{base.nome}</Text>
            <Text style={styles.baseEndereco}>{base.endereco}</Text>
            <View style={styles.statusContainer}>
              <View style={[styles.statusBadge, styles.statusAtiva]}>
                <Text style={styles.statusText}>{base.status}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.editButton}>
              <Text style={styles.editButtonText}>Editar</Text>
            </TouchableOpacity>
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
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: 20,
  },
  baseCard: {
    marginBottom: 16,
  },
  baseName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: 8,
  },
  baseEndereco: {
    fontSize: 14,
    color: colors.gray[600],
    marginBottom: 12,
  },
  statusContainer: {
    marginBottom: 12,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  statusAtiva: {
    backgroundColor: colors.primary,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.white,
  },
  editButton: {
    backgroundColor: colors.primaryLight,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.black,
    alignItems: 'center',
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.black,
  },
});
