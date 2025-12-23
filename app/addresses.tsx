import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Modal,
  SafeAreaView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface Address {
  id: string;
  title: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

const { width } = Dimensions.get('window');

export default function AddressesScreen() {
  const { colors } = useTheme();
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: '1',
      title: 'Home',
      name: 'John Doe',
      phone: '+1 (555) 123-4567',
      address: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'United States',
      isDefault: true,
    },
    {
      id: '2',
      title: 'Work',
      name: 'John Doe',
      phone: '+1 (555) 987-6543',
      address: '456 Business Ave',
      city: 'New York',
      state: 'NY',
      zipCode: '10002',
      country: 'United States',
      isDefault: false,
    },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState<Omit<Address, 'id'>>({
    title: '',
    name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    isDefault: false,
  });

  const openAddModal = () => {
    setFormData({
      title: 'Home',
      name: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States',
      isDefault: false,
    });
    setIsEditing(false);
    setModalVisible(true);
  };

  const openEditModal = (address: Address) => {
    setFormData({
      title: address.title,
      name: address.name,
      phone: address.phone,
      address: address.address,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      country: address.country,
      isDefault: address.isDefault,
    });
    setEditingAddress(address);
    setIsEditing(true);
    setModalVisible(true);
  };

  const handleSaveAddress = () => {
    if (!formData.title.trim() || !formData.name.trim() || !formData.address.trim() || !formData.city.trim()) {
      Alert.alert('Missing Information', 'Please fill in all required fields');
      return;
    }

    if (isEditing && editingAddress) {
      const updatedAddresses = addresses.map(addr =>
        addr.id === editingAddress.id
          ? { ...formData, id: editingAddress.id }
          : formData.isDefault ? { ...addr, isDefault: false } : addr
      );
      setAddresses(updatedAddresses);
      Alert.alert('Success', 'Address updated successfully');
    } else {
      const newAddress = {
        ...formData,
        id: Date.now().toString(),
      };
      
      const updatedAddresses = formData.isDefault
        ? addresses.map(addr => ({ ...addr, isDefault: false })).concat(newAddress)
        : addresses.concat(newAddress);
      
      setAddresses(updatedAddresses);
      Alert.alert('Success', 'New address added successfully');
    }
    
    setModalVisible(false);
    setEditingAddress(null);
  };

  const handleDeleteAddress = (id: string) => {
    Alert.alert(
      'Delete Address',
      'Are you sure you want to delete this address?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const updatedAddresses = addresses.filter(addr => addr.id !== id);
            setAddresses(updatedAddresses);
            Alert.alert('Deleted', 'Address deleted successfully');
          },
        },
      ]
    );
  };

  const handleSetDefault = (id: string) => {
    const updatedAddresses = addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id,
    }));
    setAddresses(updatedAddresses);
    Alert.alert('Updated', 'Default address changed');
  };

  const getIconForTitle = (title: string) => {
    switch (title.toLowerCase()) {
      case 'home': return 'home';
      case 'work': return 'business';
      case 'office': return 'business';
      case 'other': return 'location';
      default: return 'location';
    }
  };

  const renderAddressItem = ({ item }: { item: Address }) => (
    <View style={[
      styles.addressCard, 
      { 
        backgroundColor: colors.card,
        borderLeftWidth: 4,
        borderLeftColor: item.isDefault ? colors.primary : 'transparent',
      }
    ]}>
      <View style={styles.cardHeader}>
        <View style={styles.cardTitleContainer}>
          <View style={[
            styles.iconCircle,
            { backgroundColor: `${colors.primary}15` }
          ]}>
            <Ionicons 
              name={getIconForTitle(item.title)} 
              size={18} 
              color={colors.primary} 
            />
          </View>
          <View style={styles.titleContainer}>
            <Text style={[styles.addressTitle, { color: colors.text }]}>
              {item.title}
            </Text>
            {item.isDefault && (
              <View style={styles.defaultTag}>
                <Ionicons name="checkmark-circle" size={12} color={colors.primary} />
                <Text style={[styles.defaultTagText, { color: colors.primary }]}>
                  Default
                </Text>
              </View>
            )}
          </View>
        </View>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            onPress={() => openEditModal(item)} 
            style={[styles.iconButton, { backgroundColor: `${colors.primary}10` }]}
          >
            <Ionicons name="create-outline" size={18} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => handleDeleteAddress(item.id)} 
            style={[styles.iconButton, { backgroundColor: `${colors.danger}10` }]}
          >
            <Ionicons name="trash-outline" size={18} color={colors.danger} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.addressInfo}>
        <View style={styles.infoRow}>
          <Ionicons name="person-outline" size={14} color={colors.textTertiary} />
          <Text style={[styles.infoText, { color: colors.text }]}>{item.name}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Ionicons name="call-outline" size={14} color={colors.textTertiary} />
          <Text style={[styles.infoText, { color: colors.text }]}>{item.phone}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={14} color={colors.textTertiary} />
          <Text style={[styles.infoText, { color: colors.text }]} numberOfLines={2}>
            {item.address}, {item.city}, {item.state} {item.zipCode}
          </Text>
        </View>
      </View>

      {!item.isDefault && (
        <TouchableOpacity
          onPress={() => handleSetDefault(item.id)}
          style={[styles.defaultButton, { backgroundColor: `${colors.primary}10` }]}
        >
          <Ionicons name="star-outline" size={16} color={colors.primary} />
          <Text style={[styles.defaultButtonText, { color: colors.primary }]}>
            Set as Default
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Shipping Addresses
          </Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
            Manage your delivery locations
          </Text>
        </View>
        <View style={[styles.addressCount, { backgroundColor: `${colors.primary}10` }]}>
          <Text style={[styles.addressCountText, { color: colors.primary }]}>
            {addresses.length}
          </Text>
        </View>
      </View>

      <FlatList
        data={addresses}
        renderItem={renderAddressItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <View style={[styles.emptyIcon, { backgroundColor: `${colors.primary}10` }]}>
              <Ionicons name="location-outline" size={40} color={colors.primary} />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              No addresses saved
            </Text>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              Add your first shipping address to get started
            </Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.addButtonWrapper}
        onPress={openAddModal}
        activeOpacity={0.9}
      >
        <View style={[styles.addButton, { backgroundColor: colors.primary }]}>
          <Ionicons name="add" size={22} color="#fff" />
          <Text style={styles.addButtonText}>Add New Address</Text>
        </View>
      </TouchableOpacity>

      {/* Modern Modal Design */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleRow}>
                <View style={[styles.modalIcon, { backgroundColor: `${colors.primary}15` }]}>
                  <Ionicons 
                    name={isEditing ? "create-outline" : "add-circle-outline"} 
                    size={24} 
                    color={colors.primary} 
                  />
                </View>
                <View>
                  <Text style={[styles.modalTitle, { color: colors.text }]}>
                    {isEditing ? 'Edit Address' : 'Add New Address'}
                  </Text>
                  <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
                    {isEditing ? 'Update your information' : 'Fill in the details'}
                  </Text>
                </View>
              </View>
              <TouchableOpacity 
                onPress={() => setModalVisible(false)}
                style={[styles.closeButton, { backgroundColor: `${colors.text}10` }]}
              >
                <Ionicons name="close" size={20} color={colors.text} />
              </TouchableOpacity>
            </View>

            <FlatList
              data={[]}
              renderItem={null}
              ListHeaderComponent={
                <View style={styles.formContainer}>
                  {/* Address Type */}
                  <View style={styles.formSection}>
                    <Text style={[styles.sectionLabel, { color: colors.text }]}>
                      Address Type
                    </Text>
                    <View style={styles.addressTypeGrid}>
                      {['Home', 'Work', 'Office', 'Other'].map((type) => (
                        <TouchableOpacity
                          key={type}
                          style={[
                            styles.typeOption,
                            {
                              backgroundColor: formData.title === type ? colors.primary : `${colors.primary}08`,
                              borderColor: formData.title === type ? colors.primary : colors.border,
                            },
                          ]}
                          onPress={() => setFormData({ ...formData, title: type })}
                        >
                          <Ionicons
                            name={getIconForTitle(type)}
                            size={18}
                            color={formData.title === type ? '#fff' : colors.primary}
                          />
                          <Text
                            style={[
                              styles.typeOptionText,
                              { color: formData.title === type ? '#fff' : colors.text }
                            ]}
                          >
                            {type}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  {/* Personal Details */}
                  <View style={styles.formSection}>
                    <Text style={[styles.sectionLabel, { color: colors.text }]}>
                      Personal Details
                    </Text>
                    <View style={styles.inputGroup}>
                      <Text style={[styles.inputLabel, { color: colors.text }]}>Full Name *</Text>
                      <TextInput
                        style={[
                          styles.inputField,
                          { 
                            backgroundColor: colors.card,
                            color: colors.text,
                            borderColor: colors.border
                          }
                        ]}
                        value={formData.name}
                        onChangeText={text => setFormData({ ...formData, name: text })}
                        placeholder="John Doe"
                        placeholderTextColor={colors.textTertiary}
                      />
                    </View>
                    
                    <View style={styles.inputGroup}>
                      <Text style={[styles.inputLabel, { color: colors.text }]}>Phone Number *</Text>
                      <TextInput
                        style={[
                          styles.inputField,
                          { 
                            backgroundColor: colors.card,
                            color: colors.text,
                            borderColor: colors.border
                          }
                        ]}
                        value={formData.phone}
                        onChangeText={text => setFormData({ ...formData, phone: text })}
                        placeholder="+1 (555) 123-4567"
                        placeholderTextColor={colors.textTertiary}
                        keyboardType="phone-pad"
                      />
                    </View>
                  </View>

                  {/* Address Details */}
                  <View style={styles.formSection}>
                    <Text style={[styles.sectionLabel, { color: colors.text }]}>
                      Address Details
                    </Text>
                    <View style={styles.inputGroup}>
                      <Text style={[styles.inputLabel, { color: colors.text }]}>Street Address *</Text>
                      <TextInput
                        style={[
                          styles.inputField,
                          { 
                            backgroundColor: colors.card,
                            color: colors.text,
                            borderColor: colors.border
                          }
                        ]}
                        value={formData.address}
                        onChangeText={text => setFormData({ ...formData, address: text })}
                        placeholder="123 Main Street"
                        placeholderTextColor={colors.textTertiary}
                        multiline
                      />
                    </View>
                    
                    <View style={styles.rowInputs}>
                      <View style={[styles.inputGroup, { flex: 2 }]}>
                        <Text style={[styles.inputLabel, { color: colors.text }]}>City *</Text>
                        <TextInput
                          style={[
                            styles.inputField,
                            { 
                              backgroundColor: colors.card,
                              color: colors.text,
                              borderColor: colors.border
                            }
                          ]}
                          value={formData.city}
                          onChangeText={text => setFormData({ ...formData, city: text })}
                          placeholder="New York"
                          placeholderTextColor={colors.textTertiary}
                        />
                      </View>
                      
                      <View style={[styles.inputGroup, { flex: 1, marginLeft: 12 }]}>
                        <Text style={[styles.inputLabel, { color: colors.text }]}>State</Text>
                        <TextInput
                          style={[
                            styles.inputField,
                            { 
                              backgroundColor: colors.card,
                              color: colors.text,
                              borderColor: colors.border
                            }
                          ]}
                          value={formData.state}
                          onChangeText={text => setFormData({ ...formData, state: text })}
                          placeholder="NY"
                          placeholderTextColor={colors.textTertiary}
                        />
                      </View>
                    </View>
                    
                    <View style={styles.inputGroup}>
                      <Text style={[styles.inputLabel, { color: colors.text }]}>ZIP Code</Text>
                      <TextInput
                        style={[
                          styles.inputField,
                          { 
                            backgroundColor: colors.card,
                            color: colors.text,
                            borderColor: colors.border
                          }
                        ]}
                        value={formData.zipCode}
                        onChangeText={text => setFormData({ ...formData, zipCode: text })}
                        placeholder="10001"
                        placeholderTextColor={colors.textTertiary}
                        keyboardType="number-pad"
                      />
                    </View>
                  </View>

                  {/* Default Address */}
                  <View style={[
                    styles.defaultToggle,
                    { backgroundColor: colors.card }
                  ]}>
                    <View style={styles.toggleContent}>
                      <View style={[styles.toggleIcon, { backgroundColor: `${colors.primary}15` }]}>
                        <Ionicons name="star" size={18} color={colors.primary} />
                      </View>
                      <View style={styles.toggleTexts}>
                        <Text style={[styles.toggleTitle, { color: colors.text }]}>
                          Set as default address
                        </Text>
                        <Text style={[styles.toggleSubtitle, { color: colors.textSecondary }]}>
                          This will be your primary delivery address
                        </Text>
                      </View>
                    </View>
                    <Switch
                      value={formData.isDefault}
                      onValueChange={value => setFormData({ ...formData, isDefault: value })}
                      trackColor={{ false: colors.border, true: colors.primary }}
                      thumbColor="#fff"
                    />
                  </View>
                </View>
              }
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  styles.cancelAction,
                  { borderColor: colors.border }
                ]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={[styles.cancelText, { color: colors.text }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  styles.saveAction,
                  { backgroundColor: colors.primary }
                ]}
                onPress={handleSaveAddress}
              >
                <Ionicons name="checkmark" size={20} color="#fff" />
                <Text style={styles.saveText}>
                  {isEditing ? 'Update Address' : 'Save Address'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 4,
  },
  addressCount: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addressCountText: {
    fontSize: 16,
    fontWeight: '700',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  addressCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  cardTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
  },
  addressTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 4,
  },
  defaultTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  defaultTagText: {
    fontSize: 12,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addressInfo: {
    gap: 10,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  defaultButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  defaultButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    maxWidth: 250,
    lineHeight: 20,
    opacity: 0.7,
  },
  addButtonWrapper: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 20,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 14,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '90%',
    paddingBottom: 34,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.08)',
  },
  modalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  modalIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 13,
    opacity: 0.7,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  formSection: {
    marginBottom: 28,
  },
  sectionLabel: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 16,
    letterSpacing: -0.2,
  },
  addressTypeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  typeOption: {
    flex: 1,
    minWidth: (width - 96) / 4 - 9,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  typeOptionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    opacity: 0.9,
  },
  inputField: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 16,
  },
  rowInputs: {
    flexDirection: 'row',
  },
  defaultToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    marginTop: 8,
  },
  toggleContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  toggleIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleTexts: {
    flex: 1,
  },
  toggleTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  toggleSubtitle: {
    fontSize: 13,
    opacity: 0.7,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 24,
    paddingTop: 20,
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.08)',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 14,
    gap: 8,
  },
  cancelAction: {
    borderWidth: 1,
  },
  saveAction: {
    borderWidth: 0,
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '600',
  },
  saveText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});