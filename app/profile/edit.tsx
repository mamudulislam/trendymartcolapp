import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
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
  const slideAnim = useRef(new Animated.Value(30)).current;

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatar, setAvatar] = useState(user?.avatar || null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (!permissionResult.granted) {
      Alert.alert('Permission Required', 'Please allow access to your photos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      handleImageUpload(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    
    if (!permissionResult.granted) {
      Alert.alert('Permission Required', 'Please allow camera access.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      handleImageUpload(result.assets[0].uri);
    }
  };

  const handleImageUpload = async (imageUri: string) => {
    setUploading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      setAvatar(imageUri);
    } catch (error) {
      Alert.alert('Error', 'Failed to upload image.');
    } finally {
      setUploading(false);
    }
  };

  const handleAvatarChange = () => {
    Alert.alert(
      'Profile Picture',
      '',
      [
        { text: 'Take Photo', onPress: takePhoto },
        { text: 'Choose from Library', onPress: pickImage },
        avatar && { text: 'Remove', onPress: () => setAvatar(null), style: 'destructive' },
        { text: 'Cancel', style: 'cancel' },
      ].filter(Boolean) as any[]
    );
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }

    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }

    setIsLoading(true);
    try {
      await updateUser({ 
        ...user, 
        name, 
        email, 
        bio,
        avatar 
      });
      setTimeout(() => router.back(), 200);
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={[s.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <View style={[s.header]}>
        <TouchableOpacity 
          onPress={() => router.back()} 
          style={s.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        
        <Text style={[s.title, { color: colors.text }]}>
          Edit Profile
        </Text>
        
        <View style={s.emptySpace} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={s.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View style={[
            s.content, 
            { 
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}>
            
            {/* Avatar Section */}
            <View style={s.avatarSection}>
              <TouchableOpacity 
                onPress={handleAvatarChange}
                style={s.avatarContainer}
                disabled={uploading}
              >
                {avatar ? (
                  <Image 
                    source={{ uri: avatar }} 
                    style={[s.avatar, { borderColor: colors.primary }]} 
                  />
                ) : (
                  <View style={[s.avatarPlaceholder, { 
                    backgroundColor: colors.border,
                    borderColor: colors.primary 
                  }]}>
                    <Ionicons name="person" size={50} color={colors.textTertiary} />
                  </View>
                )}
                
                <View style={[s.cameraIcon, { backgroundColor: colors.primary }]}>
                  {uploading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Ionicons name="camera" size={20} color="#fff" />
                  )}
                </View>
              </TouchableOpacity>
              
              <Text style={[s.avatarText, { color: colors.textSecondary }]}>
                Tap to change photo
              </Text>
            </View>

            {/* Form Section */}
            <View style={s.formContainer}>
              {/* Name Field */}
              <View style={s.fieldGroup}>
                <View style={s.fieldHeader}>
                  <Ionicons name="person-outline" size={18} color={colors.textSecondary} />
                  <Text style={[s.fieldLabel, { color: colors.textSecondary }]}>
                    Full Name
                  </Text>
                </View>
                <View style={[s.inputWrapper, { 
                  backgroundColor: colors.card,
                  borderColor: colors.border 
                }]}>
                  <TextInput
                    style={[s.input, { color: colors.text }]}
                    value={name}
                    onChangeText={setName}
                    placeholder="Enter your full name"
                    placeholderTextColor={colors.textTertiary}
                    autoCapitalize="words"
                    returnKeyType="next"
                  />
                  {name.length > 0 && (
                    <TouchableOpacity 
                      onPress={() => setName('')}
                      style={s.clearButton}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                      <Ionicons name="close-circle" size={20} color={colors.textTertiary} />
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              {/* Email Field */}
              <View style={s.fieldGroup}>
                <View style={s.fieldHeader}>
                  <Ionicons name="mail-outline" size={18} color={colors.textSecondary} />
                  <Text style={[s.fieldLabel, { color: colors.textSecondary }]}>
                    Email Address
                  </Text>
                </View>
                <View style={[s.inputWrapper, { 
                  backgroundColor: colors.card,
                  borderColor: colors.border 
                }]}>
                  <TextInput
                    style={[s.input, { color: colors.text }]}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="your.email@example.com"
                    placeholderTextColor={colors.textTertiary}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    returnKeyType="next"
                  />
                  {email.length > 0 && (
                    <TouchableOpacity 
                      onPress={() => setEmail('')}
                      style={s.clearButton}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                      <Ionicons name="close-circle" size={20} color={colors.textTertiary} />
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              {/* Bio Field */}
              <View style={s.fieldGroup}>
                <View style={s.fieldHeader}>
                  <Ionicons name="document-text-outline" size={18} color={colors.textSecondary} />
                  <Text style={[s.fieldLabel, { color: colors.textSecondary }]}>
                    Bio
                    <Text style={s.optionalText}> (Optional)</Text>
                  </Text>
                </View>
                <View style={[s.bioWrapper, { 
                  backgroundColor: colors.card,
                  borderColor: colors.border 
                }]}>
                  <TextInput
                    style={[s.bioInput, { color: colors.text }]}
                    value={bio}
                    onChangeText={setBio}
                    placeholder="Tell something about yourself..."
                    placeholderTextColor={colors.textTertiary}
                    multiline
                    maxLength={150}
                    textAlignVertical="top"
                    returnKeyType="done"
                  />
                  <View style={s.bioFooter}>
                    <Text style={[s.charCount, { color: colors.textTertiary }]}>
                      {bio.length}/150
                    </Text>
                    {bio.length > 0 && (
                      <TouchableOpacity 
                        onPress={() => setBio('')}
                        style={s.clearBioButton}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      >
                        <Ionicons name="close-circle" size={18} color={colors.textTertiary} />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>
            </View>

            {/* Save Button */}
            <TouchableOpacity
              style={[s.saveButton, { 
                backgroundColor: colors.primary,
                opacity: isLoading ? 0.7 : 1 
              }]}
              onPress={handleSave}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Ionicons name="checkmark-circle" size={22} color="#fff" style={s.saveIcon} />
                  <Text style={s.saveButtonText}>Update Profile</Text>
                </>
              )}
            </TouchableOpacity>

            {/* Cancel Button */}
            <TouchableOpacity
              style={[s.cancelButton, { borderColor: colors.border }]}
              onPress={() => router.back()}
              activeOpacity={0.7}
            >
              <Text style={[s.cancelText, { color: colors.textSecondary }]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { 
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.03)',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  emptySpace: {
    width: 40,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  content: {
    paddingTop: 30,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 4,
  },
  avatarPlaceholder: {
    width: 130,
    height: 130,
    borderRadius: 65,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '500',
    opacity: 0.8,
  },
  formContainer: {
    gap: 24,
    marginBottom: 30,
  },
  fieldGroup: {
    gap: 10,
  },
  fieldHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  fieldLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  optionalText: {
    fontWeight: '400',
    opacity: 0.7,
  },
  inputWrapper: {
    borderWidth: 1.5,
    borderRadius: 14,
    height: 56,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  input: {
    fontSize: 16,
    fontWeight: '500',
    paddingVertical: 8,
  },
  bioWrapper: {
    borderWidth: 1.5,
    borderRadius: 14,
    padding: 16,
    minHeight: 120,
  },
  bioInput: {
    fontSize: 16,
    fontWeight: '500',
    minHeight: 80,
    lineHeight: 22,
  },
  bioFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  charCount: {
    fontSize: 13,
    fontWeight: '500',
  },
  clearButton: {
    position: 'absolute',
    right: 16,
  },
  clearBioButton: {
    padding: 4,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 14,
    gap: 10,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  saveIcon: {
    marginRight: 6,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  cancelButton: {
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1.5,
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '600',
  },
});