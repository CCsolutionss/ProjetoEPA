import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { Header } from '../components/Header';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { colors } from '../theme';

type CadastrarBaseScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'CadastrarBase'
>;

interface Props {
  navigation: CadastrarBaseScreenNavigationProp;
}

export default function CadastrarBaseScreen({ navigation }: Props) {
  const [nomeBase, setNomeBase] = useState('');
  const [cep, setCep] = useState('');
  const [logradouro, setLogradouro] = useState('');
  const [cidade, setCidade] = useState('');
  const [bairro, setBairro] = useState('');
  const [estado, setEstado] = useState('');
  const [numero, setNumero] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCriarBase = async () => {
    if (!nomeBase || !cep || !logradouro || !cidade || !estado) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios!');
      return;
    }

    setLoading(true);
    try {
      // TODO: backend - Criar base
      await new Promise((resolve) => setTimeout(resolve, 1500));
      Alert.alert('Sucesso', 'Base criada com sucesso!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Erro', 'Erro ao criar base. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title="Adicionar Base"
        showBackButton
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Card>
          <Text style={styles.sectionTitle}>Cadastrar Nova Base</Text>

          <Input
            label="Nome da base *"
            value={nomeBase}
            onChangeText={setNomeBase}
            placeholder="Digite o nome da base"
          />

          <Input
            label="CEP *"
            value={cep}
            onChangeText={setCep}
            placeholder="00000-000"
            keyboardType="numeric"
            maxLength={9}
          />

          <Input
            label="Logradouro *"
            value={logradouro}
            onChangeText={setLogradouro}
            placeholder="Rua, Avenida..."
          />

          <View style={styles.row}>
            <View style={styles.halfWidth}>
              <Input
                label="Cidade *"
                value={cidade}
                onChangeText={setCidade}
                placeholder="Cidade"
              />
            </View>
            <View style={styles.halfWidth}>
              <Input
                label="Bairro"
                value={bairro}
                onChangeText={setBairro}
                placeholder="Bairro"
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.halfWidth}>
              <Input
                label="Estado (UF) *"
                value={estado}
                onChangeText={(text) => setEstado(text.toUpperCase())}
                placeholder="SP"
                maxLength={2}
                autoCapitalize="characters"
              />
            </View>
            <View style={styles.halfWidth}>
              <Input
                label="Número"
                value={numero}
                onChangeText={setNumero}
                placeholder="123"
                keyboardType="numeric"
              />
            </View>
          </View>

          <Button
            title={loading ? 'Criando...' : 'Criar nova base'}
            onPress={handleCriarBase}
            loading={loading}
            variant="primary"
            style={styles.button}
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  button: {
    marginTop: 8,
  },
});
