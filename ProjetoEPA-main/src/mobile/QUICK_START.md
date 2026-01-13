# 🚀 Guia de Início Rápido - EPA Mobile

## ⚡ Instalação Rápida

### 1. Instalar Node.js
Se ainda não tem, baixe em: https://nodejs.org/

### 2. Instalar Expo CLI
```bash
npm install -g expo-cli
```

### 3. Instalar Dependências
```bash
cd mobile
npm install
```

### 4. Iniciar o App
```bash
npm start
```

## 📱 Testar no Celular

### Android
1. Baixe o **Expo Go** na Google Play Store
2. Abra o app Expo Go
3. Escaneie o QR Code que aparece no terminal

### iOS
1. Baixe o **Expo Go** na App Store
2. Abra o app Câmera do iPhone
3. Aponte para o QR Code que aparece no terminal
4. Toque na notificação para abrir no Expo Go

## 🎮 Testar no Emulador

### Android Studio (Android)
```bash
npm run android
```

### Xcode (iOS - apenas Mac)
```bash
npm run ios
```

## 🔑 Login de Teste

Use qualquer email e senha para fazer login (dados mockados):

```
Email: admin@epa.com
Senha: 123456
```

## 📋 Comandos Úteis

```bash
# Iniciar servidor
npm start

# Limpar cache
npm start -- --clear

# Android
npm run android

# iOS
npm run ios

# Web (experimental)
npm run web
```

## 🎨 Telas Disponíveis

1. **Login** - Autenticação
2. **Home** - Dashboard principal
3. **Nova Medição** - Cadastrar medição
4. **Relatórios** - Ver medições
5. **Cadastrar Base** - Adicionar base
6. **Consultar Base** - Listar bases
7. **Gerenciar Usuários** - Ver usuários
8. **Criar Usuário** - Adicionar usuário
9. **Configurações** - Configurações e logs

## 🔧 Solução de Problemas

### Erro ao instalar dependências
```bash
# Limpar cache do npm
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### App não abre no celular
- Certifique-se que o celular e computador estão na mesma rede Wi-Fi
- Desabilite VPN temporariamente
- Reinicie o servidor: `npm start -- --clear`

### Erro no Metro Bundler
```bash
# Limpar cache do Metro
npx expo start --clear
```

## 📞 Suporte

Se tiver problemas:
1. Verifique se o Node.js está instalado: `node --version`
2. Verifique se o Expo CLI está instalado: `expo --version`
3. Tente limpar o cache: `npm start -- --clear`
4. Reinstale as dependências

## ✅ Checklist de Instalação

- [ ] Node.js instalado (v18+)
- [ ] Expo CLI instalado globalmente
- [ ] Dependências instaladas (`npm install`)
- [ ] Servidor iniciado (`npm start`)
- [ ] Expo Go instalado no celular
- [ ] QR Code escaneado
- [ ] App funcionando

## 🎉 Pronto!

Agora você pode explorar todas as funcionalidades do app EPA Mobile!
