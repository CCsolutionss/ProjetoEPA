# 📱 Guia de Migração - Web para Mobile

Este guia explica as principais diferenças entre a versão Web e Mobile do EPA.

## 🔄 Principais Mudanças

### 1. Estrutura de Arquivos

**Web:**
```
/pages/          → Páginas
/components/     → Componentes
/styles/         → CSS/Tailwind
```

**Mobile:**
```
/src/screens/    → Telas (equivalente a pages)
/src/components/ → Componentes
/src/theme.ts    → Estilos (StyleSheet)
```

### 2. Navegação

**Web (React Router):**
```tsx
const navigate = useNavigate();
navigate('/home');
```

**Mobile (React Navigation):**
```tsx
navigation.navigate('Home');
```

### 3. Estilos

**Web (Tailwind CSS):**
```tsx
<div className="bg-green-100 p-4 rounded-lg">
```

**Mobile (StyleSheet):**
```tsx
<View style={styles.container}>

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#EDFEE8',
    padding: 16,
    borderRadius: 12,
  },
});
```

### 4. Componentes HTML → React Native

| Web (HTML) | Mobile (React Native) |
|------------|----------------------|
| `<div>` | `<View>` |
| `<span>` | `<Text>` |
| `<input>` | `<TextInput>` |
| `<button>` | `<TouchableOpacity>` ou `<Button>` |
| `<img>` | `<Image>` |
| `<a>` | `<TouchableOpacity>` + `navigation` |

### 5. Armazenamento

**Web (localStorage):**
```tsx
localStorage.setItem('token', token);
const token = localStorage.getItem('token');
```

**Mobile (AsyncStorage):**
```tsx
await AsyncStorage.setItem('@EPA:token', token);
const token = await AsyncStorage.getItem('@EPA:token');
```

### 6. Alertas/Notificações

**Web (toast do sonner):**
```tsx
toast.success('Sucesso!');
toast.error('Erro!');
```

**Mobile (Alert nativo):**
```tsx
Alert.alert('Sucesso', 'Operação concluída!');
Alert.alert('Erro', 'Algo deu errado!');
```

### 7. Formulários

**Web:**
```tsx
<form onSubmit={handleSubmit}>
  <input type="text" />
  <button type="submit">Enviar</button>
</form>
```

**Mobile:**
```tsx
<View>
  <TextInput onChangeText={setText} />
  <Button title="Enviar" onPress={handleSubmit} />
</View>
```

### 8. Scroll

**Web:**
```tsx
<div style={{ overflowY: 'auto' }}>
  {/* conteúdo */}
</div>
```

**Mobile:**
```tsx
<ScrollView>
  {/* conteúdo */}
</ScrollView>
```

## 🎨 Cores EPA (Mantidas)

As mesmas cores foram mantidas:

```typescript
colors = {
  primary: '#00920C',        // Verde escuro
  primaryLight: '#00DC30',   // Verde claro/botões
  background: '#EDFEE8',     // Verde claro fundo
  white: '#FFFFFF',          // Branco
  black: '#000000',          // Preto
}
```

## 📦 Componentes Customizados

Criamos componentes equivalentes aos da versão Web:

| Web | Mobile |
|-----|--------|
| `Button` (shadcn) | `Button` (custom) |
| `Input` (shadcn) | `Input` (custom) |
| `Card` (shadcn) | `Card` (custom) |
| `Header` (custom) | `Header` (custom) |
| `Select` (shadcn) | `Picker` (RN) |

## 🔐 Autenticação

**Mantida a mesma lógica:**

```typescript
// Context idêntico em ambas versões
const { user, login, logout } = useAuth();

// Diferença apenas no armazenamento:
// Web: localStorage
// Mobile: AsyncStorage
```

## 🌐 API Integration

**Os mesmos endpoints podem ser usados:**

```typescript
// TODO markers idênticos em ambas versões
// TODO: backend - Fazer login
// Endpoint: POST /api/auth/login
// Body: { email, senha }
// Response: { token, user }
```

## 📊 Funcionalidades Equivalentes

| Funcionalidade | Web | Mobile |
|----------------|-----|--------|
| Login | ✅ | ✅ |
| Dashboard | ✅ | ✅ |
| Nova Medição | ✅ | ✅ |
| Relatórios | ✅ | ✅ (simplificado) |
| Cadastrar Base | ✅ | ✅ |
| Consultar Bases | ✅ | ✅ |
| Gerenciar Usuários | ✅ | ✅ |
| Criar Usuário | ✅ | ✅ |
| Configurações | ✅ | ✅ (simplificado) |

## 🚧 Funcionalidades a Adicionar

Estas funcionalidades da versão Web podem ser adicionadas ao Mobile:

1. **Gráficos** - Usar `react-native-chart-kit` ou `victory-native`
2. **Filtros avançados** - Adicionar mais opções de filtro
3. **Busca** - Implementar busca nas listagens
4. **Ordenação** - Adicionar ordenação de colunas
5. **Paginação** - Implementar scroll infinito
6. **Exportação** - Compartilhar arquivos via Share API
7. **Câmera** - Usar `expo-camera` para fotos
8. **Localização** - Usar `expo-location` para GPS
9. **Notificações Push** - Usar `expo-notifications`
10. **Modo Offline** - Usar `@react-native-async-storage` + sincronização

## 🔧 Dependências Principais

**Web:**
- React
- React Router
- Tailwind CSS
- shadcn/ui
- Sonner (toast)
- Recharts (gráficos)

**Mobile:**
- React Native
- React Navigation
- React Native Paper
- Expo
- AsyncStorage
- Picker

## 💡 Dicas de Migração

### 1. Eventos de Click

**Web:**
```tsx
<button onClick={handleClick}>
```

**Mobile:**
```tsx
<TouchableOpacity onPress={handleClick}>
```

### 2. Propriedades CSS

**Web:**
```tsx
style={{ display: 'flex', flexDirection: 'column' }}
```

**Mobile:**
```tsx
style={{ flexDirection: 'column' }} // display flex é padrão
```

### 3. Unidades de Medida

**Web:** `px`, `rem`, `%`, `vh`, `vw`  
**Mobile:** Apenas números (equivalente a `dp` no Android)

```tsx
// Web
padding: '16px'

// Mobile
padding: 16  // sem unidade
```

### 4. Imagens

**Web:**
```tsx
<img src="/logo.png" alt="Logo" />
```

**Mobile:**
```tsx
<Image source={require('./logo.png')} />
// ou
<Image source={{ uri: 'https://...' }} />
```

### 5. Inputs com Máscaras

**Web:** `react-input-mask`  
**Mobile:** `react-native-mask-input`

## 🎯 Próximos Passos

1. Testar todas as telas no dispositivo físico
2. Implementar funcionalidades específicas mobile:
   - Câmera para fotos das medições
   - GPS para localização das bases
   - Notificações push
   - Modo offline
3. Otimizar performance
4. Adicionar testes
5. Preparar para publicação nas lojas

## 📚 Recursos Úteis

- [React Native Docs](https://reactnative.dev/)
- [Expo Docs](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [React Native Paper](https://callstack.github.io/react-native-paper/)

## ✅ Checklist de Migração

- [x] Estrutura de pastas criada
- [x] Navegação configurada
- [x] AuthContext migrado
- [x] Tema e cores configurados
- [x] Componentes base criados (Button, Input, Card, Header)
- [x] Todas as telas migradas
- [x] Armazenamento local configurado (AsyncStorage)
- [ ] Testes no dispositivo físico
- [ ] Integração com API real
- [ ] Build de produção
- [ ] Publicação nas lojas

---

© 2024 Grupo EPA. Todos os direitos reservados.
