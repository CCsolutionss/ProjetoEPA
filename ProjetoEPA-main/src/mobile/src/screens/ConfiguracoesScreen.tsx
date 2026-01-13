import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { Header } from '../components/Header';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { colors } from '../theme';

type ConfiguracoesScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Configuracoes'
>;

interface Props {
  navigation: ConfiguracoesScreenNavigationProp;
}

const mockLogs = [
  {
    id: '1',
    dataHora: '13/10/2024 10:51',
    usuario: 'Rodrigo',
    acao: 'Exportação',
    detalhes: 'Relatório exportado',
  },
  {
    id: '2',
    dataHora: '20/10/2024 13:15',
    usuario: 'Juan',
    acao: 'Medição',
    detalhes: 'Adicionado medição',
  },
  {
    id: '3',
    dataHora: '22/12/2024 12:01',
    usuario: 'Lucas',
    acao: 'Exportação',
    detalhes: 'Relatório exportado',
  },
];

export default function ConfiguracoesScreen({ navigation }: Props) {
  const [loading, setLoading] = useState(false);

  const handleSalvarPreferencias = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      Alert.alert('Sucesso', 'Preferências salvas com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Erro ao salvar preferências.');
    } finally {
      setLoading(false);
    }
  };

  const handleExportarLog = () => {
    Alert.alert('Info', 'Funcionalidade de exportação será implementada.');
  };

  return (
    <View style={styles.container}>
      <Header
        title="Configurações"
        showBackButton
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Backup</Text>
          <Text style={styles.infoText}>
            Configure o horário de backup automático diário do sistema.
          </Text>
          <View style={styles.backupInfo}>
            <Text style={styles.label}>Horário de Backup:</Text>
            <Text style={styles.value}>02:00</Text>
          </View>
          <Button
            title={loading ? 'Salvando...' : 'Salvar preferências'}
            onPress={handleSalvarPreferencias}
            loading={loading}
            variant="primary"
          />
        </Card>

        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Logs do Sistema</Text>
          {mockLogs.map((log) => (
            <View key={log.id} style={styles.logItem}>
              <View style={styles.logHeader}>
                <Text style={styles.logData}>{log.dataHora}</Text>
                <Text style={styles.logUsuario}>{log.usuario}</Text>
              </View>
              <Text style={styles.logAcao}>{log.acao}</Text>
              <Text style={styles.logDetalhes}>{log.detalhes}</Text>
            </View>
          ))}
          <Button
            title="Exportar Log"
            onPress={handleExportarLog}
            variant="outline"
            style={styles.exportButton}
          />
        </Card>
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
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: colors.gray[600],
    marginBottom: 16,
  },
  backupInfo: {
    backgroundColor: colors.gray[50],
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    color: colors.gray[600],
    marginBottom: 4,
  },
  value: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.black,
  },
  logItem: {
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
    paddingVertical: 12,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  logData: {
    fontSize: 12,
    color: colors.gray[600],
  },
  logUsuario: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  logAcao: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.black,
    marginBottom: 2,
  },
  logDetalhes: {
    fontSize: 13,
    color: colors.gray[600],
  },
  exportButton: {
    marginTop: 12,
  },
});
