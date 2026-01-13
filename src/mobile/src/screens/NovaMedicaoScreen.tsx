import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { Header } from '../components/Header';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { colors } from '../theme';
import { Picker } from '@react-native-picker/picker';

type NovaMedicaoScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'NovaMedicao'
>;

interface Props {
  navigation: NovaMedicaoScreenNavigationProp;
}

const mockBases = [
  { id: '1', nome: 'Sistema de Refrigeração - Unidade A' },
  { id: '2', nome: 'Monitoramento Energético - Fábrica B' },
  { id: '3', nome: 'Qualidade do Ar - Escritório Central' },
  { id: '4', nome: 'Tratamento de Efluentes - Indústria C' },
];

const tiposAmostra = [
  { value: 'efluente_bruto', label: 'Efluente Bruto' },
  { value: 'equalizacao', label: 'Equalização' },
  { value: 'flotador', label: 'Flotador' },
  { value: 'bioreator', label: 'Bioreator' },
  { value: 'osmose_reversa', label: 'Osmose Reversa' },
];

export default function NovaMedicaoScreen({ navigation }: Props) {
  const [baseId, setBaseId] = useState('');
  const [tipoAmostra, setTipoAmostra] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [dataHora, setDataHora] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setDataHora(now.toLocaleString('pt-BR'));
    };
    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleEnviar = async () => {
    if (!baseId || !tipoAmostra) {
      Alert.alert('Erro', 'Selecione a base e o tipo de amostra!');
      return;
    }

    setLoading(true);
    try {
      // TODO: backend - Enviar medição
      await new Promise((resolve) => setTimeout(resolve, 1500));
      Alert.alert('Sucesso', 'Medição enviada com sucesso!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Erro', 'Erro ao enviar medição. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title="Nova Medição"
        showBackButton
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Card>
          <Text style={styles.sectionTitle}>Informações da Medição</Text>

          {/* Seleção de Base */}
          <View style={styles.pickerContainer}>
            <Text style={styles.label}>Selecione a base *</Text>
            <View style={styles.picker}>
              <Picker
                selectedValue={baseId}
                onValueChange={(itemValue) => setBaseId(itemValue)}
                style={styles.pickerInput}
              >
                <Picker.Item label="Selecione uma base" value="" />
                {mockBases.map((base) => (
                  <Picker.Item key={base.id} label={base.nome} value={base.id} />
                ))}
              </Picker>
            </View>
          </View>

          {/* Tipo de Amostra */}
          <View style={styles.pickerContainer}>
            <Text style={styles.label}>Tipo de Amostra *</Text>
            <View style={styles.picker}>
              <Picker
                selectedValue={tipoAmostra}
                onValueChange={(itemValue) => setTipoAmostra(itemValue)}
                style={styles.pickerInput}
                enabled={!!baseId}
              >
                <Picker.Item
                  label={baseId ? 'Selecione o tipo' : 'Selecione uma base primeiro'}
                  value=""
                />
                {tiposAmostra.map((tipo) => (
                  <Picker.Item key={tipo.value} label={tipo.label} value={tipo.value} />
                ))}
              </Picker>
            </View>
          </View>

          {/* Data/Hora */}
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Data/Hora atual:</Text>
            <Text style={styles.infoValue}>{dataHora}</Text>
            <Text style={styles.infoSubtext}>Atualização automática</Text>
          </View>

          {/* Observações */}
          <Input
            label="Observações (opcional)"
            value={observacoes}
            onChangeText={setObservacoes}
            placeholder="Adicione observações relevantes..."
            multiline
            numberOfLines={4}
            style={styles.textArea}
          />

          {/* Botões */}
          <View style={styles.buttonsContainer}>
            <Button
              title="Salvar rascunho"
              onPress={() => Alert.alert('Info', 'Rascunho salvo!')}
              variant="outline"
              disabled={loading || !baseId || !tipoAmostra}
            />
            <Button
              title={loading ? 'Enviando...' : 'Enviar medição'}
              onPress={handleEnviar}
              variant="primary"
              loading={loading}
              disabled={!baseId || !tipoAmostra}
            />
          </View>
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray[700],
    marginBottom: 8,
  },
  pickerContainer: {
    marginBottom: 16,
  },
  picker: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 8,
    overflow: 'hidden',
  },
  pickerInput: {
    height: 50,
  },
  infoBox: {
    backgroundColor: colors.gray[50],
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gray[200],
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.gray[600],
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.black,
    marginBottom: 4,
  },
  infoSubtext: {
    fontSize: 11,
    color: colors.gray[400],
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  buttonsContainer: {
    gap: 12,
    marginTop: 8,
  },
});
