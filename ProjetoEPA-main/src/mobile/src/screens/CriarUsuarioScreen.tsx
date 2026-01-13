import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { Header } from '../components/Header';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { colors } from '../theme';
import { Picker } from '@react-native-picker/picker';

type CriarUsuarioScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'CriarUsuario'
>;

interface Props {
  navigation: CriarUsuarioScreenNavigationProp;
}

export default function CriarUsuarioScreen({ navigation }: Props) {
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [cargo, setCargo] = useState('');
  const [permissao, setPermissao] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCriarUsuario = async () => {
    if (!nomeCompleto || !email || !senha || !confirmarSenha || !cargo || !permissao) {
      Alert.alert('Erro', 'Preencha todos os campos!');
      return;
    }

    if (senha !== confirmarSenha) {
      Alert.alert('Erro', 'As senhas não coincidem!');
      return;
    }

    setLoading(true);
    try {
      // TODO: backend - Criar usuário
      await new Promise((resolve) => setTimeout(resolve, 1500));
      Alert.alert('Sucesso', 'Usuário criado com sucesso!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Erro', 'Erro ao criar usuário. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title="Criar Usuário"
        showBackButton
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Card>
          <Text style={styles.sectionTitle}>Novo Usuário</Text>

          <Input
            label="Nome Completo *"
            value={nomeCompleto}
            onChangeText={setNomeCompleto}
            placeholder="Digite o nome completo"
          />

          <Input
            label="Email *"
            value={email}
            onChangeText={setEmail}
            placeholder="exemplo@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Input
            label="Senha *"
            value={senha}
            onChangeText={setSenha}
            placeholder="Digite a senha"
            secureTextEntry
          />

          <Input
            label="Confirmar Senha *"
            value={confirmarSenha}
            onChangeText={setConfirmarSenha}
            placeholder="Confirme a senha"
            secureTextEntry
          />

          <Input
            label="Cargo *"
            value={cargo}
            onChangeText={setCargo}
            placeholder="Ex: Operador, Técnico..."
          />

          <View style={styles.pickerContainer}>
            <Text style={styles.label}>Permissão *</Text>
            <View style={styles.picker}>
              <Picker
                selectedValue={permissao}
                onValueChange={(itemValue) => setPermissao(itemValue)}
                style={styles.pickerInput}
              >
                <Picker.Item label="Selecione a permissão" value="" />
                <Picker.Item label="Administrador" value="admin" />
                <Picker.Item label="Desenvolvedor" value="dev" />
                <Picker.Item label="Operador" value="operador" />
                <Picker.Item label="Usuário Padrão" value="user" />
              </Picker>
            </View>
          </View>

          <Button
            title={loading ? 'Criando...' : 'Criar usuário'}
            onPress={handleCriarUsuario}
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
  button: {
    marginTop: 8,
  },
});
