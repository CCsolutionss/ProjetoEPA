import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { Header } from '../components/Header';
import { Card } from '../components/Card';
import { colors } from '../theme';

type RelatoriosScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Relatorios'
>;

interface Props {
  navigation: RelatoriosScreenNavigationProp;
}

const mockMedicoes = [
  {
    id: '1',
    base: 'Sistema de Refrigeração - Unidade A',
    tipo: 'Efluente Bruto',
    data: '15/11/2024 10:30',
    operador: 'Juan Oliveira',
  },
  {
    id: '2',
    base: 'Tratamento de Efluentes - Indústria C',
    tipo: 'Bioreator',
    data: '14/11/2024 14:20',
    operador: 'Lucas Silva',
  },
  {
    id: '3',
    base: 'Qualidade do Ar - Escritório Central',
    tipo: 'Flotador',
    data: '13/11/2024 09:15',
    operador: 'Matheus Costa',
  },
];

export default function RelatoriosScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Header
        title="Relatórios e Medições"
        showBackButton
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Text style={styles.pageTitle}>Consultar Medições</Text>

        {mockMedicoes.map((medicao) => (
          <Card key={medicao.id} style={styles.medicaoCard}>
            <View style={styles.medicaoHeader}>
              <Text style={styles.medicaoTipo}>{medicao.tipo}</Text>
              <Text style={styles.medicaoData}>{medicao.data}</Text>
            </View>
            <Text style={styles.medicaoBase}>{medicao.base}</Text>
            <Text style={styles.medicaoOperador}>Operador: {medicao.operador}</Text>
            <TouchableOpacity style={styles.detailsButton}>
              <Text style={styles.detailsButtonText}>Ver detalhes</Text>
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
  medicaoCard: {
    marginBottom: 16,
  },
  medicaoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  medicaoTipo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    flex: 1,
  },
  medicaoData: {
    fontSize: 12,
    color: colors.gray[600],
  },
  medicaoBase: {
    fontSize: 14,
    color: colors.gray[700],
    marginBottom: 4,
  },
  medicaoOperador: {
    fontSize: 12,
    color: colors.gray[500],
    marginBottom: 12,
  },
  detailsButton: {
    backgroundColor: colors.primaryLight,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.black,
    alignItems: 'center',
  },
  detailsButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.black,
  },
});
