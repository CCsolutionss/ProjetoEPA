import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Appbar } from 'react-native-paper';
import { colors } from '../theme';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  onLogout?: () => void;
  userName?: string;
  userRole?: string;
}

export const Header = ({
  title,
  subtitle,
  showBackButton,
  onBackPress,
  onLogout,
  userName,
  userRole,
}: HeaderProps) => {
  return (
    <Appbar.Header style={styles.header}>
      {showBackButton && onBackPress && (
        <Appbar.BackAction onPress={onBackPress} color={colors.black} />
      )}
      
      <View style={styles.logoContainer}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>EPA</Text>
        </View>
        <View style={styles.titleContainer}>
          <Appbar.Content
            title={title}
            subtitle={subtitle}
            titleStyle={styles.title}
            subtitleStyle={styles.subtitle}
          />
        </View>
      </View>

      {userName && (
        <View style={styles.userInfo}>
          <Text style={styles.userName} numberOfLines={1}>{userName}</Text>
          <Text style={styles.userRole} numberOfLines={1}>{userRole}</Text>
        </View>
      )}

      {onLogout && (
        <Appbar.Action icon="logout" onPress={onLogout} color={colors.black} />
      )}
    </Appbar.Header>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.white,
    borderBottomWidth: 2,
    borderBottomColor: colors.black,
    elevation: 0,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  logoText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    color: colors.black,
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtitle: {
    color: colors.gray[600],
    fontSize: 12,
  },
  userInfo: {
    marginRight: 8,
    alignItems: 'flex-end',
    maxWidth: 120,
  },
  userName: {
    color: colors.black,
    fontSize: 12,
    fontWeight: '600',
  },
  userRole: {
    color: colors.gray[600],
    fontSize: 10,
  },
});
