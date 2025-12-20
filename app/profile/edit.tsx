import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

export default function EditProfileScreen() {
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const { user, updateUser } = useAuth();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const handleSave = () => {
    if (user) {
      updateUser({ name, email, avatar });
      router.back();
    }
  };

  const handleAvatarChange = () => {
    Alert.alert('Change Avatar', 'This feature is not yet implemented.', [{ text: 'OK' }]);
  };

  return (
    <SafeAreaView style={[s.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      <View style={[s.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={s.headerButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[s.headerTitle, { color: colors.text }]}>Edit Profile</Text>
        <View style={s.headerButton} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={s.scrollContent}>
          <Animated.View style={[s.content, { opacity: fadeAnim }]}>
            <TouchableOpacity onPress={handleAvatarChange} style={s.avatarContainer}>
              <Image source={{ uri: avatar }} style={[s.avatar, { borderColor: colors.primary }]} />
              <LinearGradient
                colors={[`${colors.primary}00`, `${colors.primary}99`]}
                style={s.avatarOverlay}
              >
                <Ionicons name="camera" size={24} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>

            <View style={[s.form, { backgroundColor: colors.card, borderColor: colors.borderLight }]}>
              <View style={s.inputContainer}>
                <Text style={[s.label, { color: colors.textSecondary }]}>Full Name</Text>
                <View style={[s.inputWrapper, { borderColor: colors.border }]}>
                  <Ionicons name="person-outline" size={20} color={colors.textTertiary} style={s.inputIcon} />
                  <TextInput
                    style={[s.input, { color: colors.text }]}
                    value={name}
                    onChangeText={setName}
                    placeholder="Your Full Name"
                    placeholderTextColor={colors.textTertiary}
                  />
                </View>
              </View>

              <View style={s.inputContainer}>
                <Text style={[s.label, { color: colors.textSecondary }]}>Email Address</Text>
                <View style={[s.inputWrapper, { borderColor: colors.border }]}>
                  <Ionicons name="mail-outline" size={20} color={colors.textTertiary} style={s.inputIcon} />
                  <TextInput
                    style={[s.input, { color: colors.text }]}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="your.email@example.com"
                    placeholderTextColor={colors.textTertiary}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
              </View>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={[s.footer, { borderTopColor: colors.border }]}>
        <TouchableOpacity
          style={[s.saveBtn]}
          onPress={handleSave}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[colors.primary, colors.primaryDark]}
            style={s.saveBtnGradient}
          >
            <Text style={s.saveBtnText}>Save Changes</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 40,
  },
  content: {
    alignItems: 'center',
  },
  avatarContainer: {
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  avatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 5,
  },
  avatarOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  form: {
    width: '100%',
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
  },
  inputIcon: {
    paddingLeft: 16,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  footer: {
    padding: 20,
    paddingTop: 10,
    borderTopWidth: 1,
  },
  saveBtn: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  saveBtnGradient: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },
});
