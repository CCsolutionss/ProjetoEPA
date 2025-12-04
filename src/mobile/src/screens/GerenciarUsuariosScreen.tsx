import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { Header } from '../components/Header';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { colors } from '../theme';

type GerenciarUsuariosScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'GerenciarUsuarios'
>;

interface Props {
  navigation: GerenciarUsuariosScreenNavigationProp;
}

const mockUsuarios = [
  { id: '1', nome: 'Juan Oliveira', permissao: 'Administrador' },
  { id: '2', nome: 'Empresa X', permissao: 'Parceiro' },
  { id: '3', nome: 'Lucas Silva', permissao: 'Desenvolvedor' },
  { id: '4', nome: 'Matheus Costa', permissao: 'Operador' },
];

export default function GerenciarUsuariosScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Header
        title="Gerenciar Usuários"
        showBackButton
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.pageTitle}>Usuários Cadastrados</Text>
          <Button
            title="Novo usuário"
            onPress={() => navigation.navigate('CriarUsuario')}
            variant="primary"
            style={styles.newButton}
          />
        </View>

        {mockUsuarios.map((usuario) => (
          <Card key={usuario.id} style={styles.usuarioCard}>
            <View style={styles.usuarioInfo}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {usuario.nome.substring(0, 2).toUpperCase()}
                </Text>
              </View>
              <View style={styles.usuarioDetails}>
                <Text style={styles.usuarioNome}>{usuario.nome}</Text>
                <Text style={styles.usuarioPermissao}>{usuario.permissao}</Text>
              </View>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity style={styles.editButton}>
                <Text style={styles.editButtonText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteButton}>
                <Text style={styles.deleteButtonText}>Remover</Text>
              </TouchableOpacity>
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
  header: {
    marginBottom: 20,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: 16,
  },
  newButton: {
    marginBottom: 4,
  },
  usuarioCard: {
    marginBottom: 12,
  },
  usuarioInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#9333EA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  usuarioDetails: {
    flex: 1,
  },
  usuarioNome: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.black,
    marginBottom: 2,
  },
  usuarioPermissao: {
    fontSize: 14,
    color: colors.gray[600],
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    flex: 1,
    backgroundColor: colors.primaryLight,
    paddingVertical: 10,
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
  deleteButton: {
    flex: 1,
    backgroundColor: colors.white,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.error,
    alignItems: 'center',
  },
  deleteButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.error,
  },
});
