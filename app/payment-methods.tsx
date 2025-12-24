import { FontAwesome, Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

const PaymentMethodsScreen = () => {
  const { colors, isDark } = useTheme();
  
  const [methods, setMethods] = useState([
    {
      id: '1',
      type: 'card',
      name: 'Visa',
      last4: '4242',
      isDefault: true,
      color: '#007AFF',
    },
    {
      id: '2',
      type: 'card',
      name: 'Mastercard',
      last4: '8888',
      isDefault: false,
      color: '#FF6B00',
    },
    {
      id: '3',
      type: 'paypal',
      name: 'PayPal',
      isDefault: false,
      color: '#0070BA',
    },
    {
      id: '4',
      type: 'applepay',
      name: 'Apple Pay',
      isDefault: false,
      color: '#000000',
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newCard, setNewCard] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
  });

  const setDefault = (id) => {
    const updated = methods.map(m => ({
      ...m,
      isDefault: m.id === id,
    }));
    setMethods(updated);
  };

  const removeMethod = (id) => {
    Alert.alert(
      'Remove Payment Method',
      'Are you sure you want to delete this payment method?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const methodToDelete = methods.find(m => m.id === id);
            let updatedMethods = methods.filter(m => m.id !== id);
            
            // If deleting default method, set another as default
            if (methodToDelete?.isDefault && updatedMethods.length > 0) {
              updatedMethods[0].isDefault = true;
            }
            
            setMethods(updatedMethods);
            Alert.alert('Success', 'Payment method deleted successfully');
          },
        },
      ]
    );
  };

  const addNewCard = () => {
    if (!newCard.number || !newCard.name || !newCard.expiry) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (newCard.number.length < 16) {
      Alert.alert('Error', 'Please enter a valid 16-digit card number');
      return;
    }

    if (newCard.expiry.length < 5) {
      Alert.alert('Error', 'Please enter expiry date in MM/YY format');
      return;
    }

    if (newCard.cvv.length < 3) {
      Alert.alert('Error', 'Please enter a valid 3-digit CVV');
      return;
    }

    const last4 = newCard.number.slice(-4);
    const newMethod = {
      id: Date.now().toString(),
      type: 'card',
      name: 'Visa',
      last4,
      isDefault: methods.length === 0,
      color: '#34C759',
    };

    const updatedMethods = newMethod.isDefault
      ? methods.map(m => ({ ...m, isDefault: false })).concat(newMethod)
      : methods.concat(newMethod);
    
    setMethods(updatedMethods);
    setShowAddModal(false);
    setNewCard({ number: '', name: '', expiry: '', cvv: '' });
    Alert.alert('Success', 'Payment method added successfully');
  };

  const renderMethod = ({ item }) => (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: item.isDefault ? colors.primary : colors.border,
        },
      ]}
    >
      {item.isDefault && (
        <View style={[styles.defaultBadge, { backgroundColor: colors.primary }]}>
          <Ionicons name="checkmark-circle" size={12} color="#fff" />
          <Text style={styles.defaultBadgeText}>Default</Text>
        </View>
      )}
      
      <View style={styles.cardHeader}>
        <View style={[styles.iconBox, { backgroundColor: `${item.color}15` }]}>
          {item.type === 'paypal' ? (
            <FontAwesome name="paypal" size={24} color={item.color} />
          ) : item.type === 'applepay' ? (
            <FontAwesome name="apple" size={24} color={item.color} />
          ) : (
            <Ionicons name="card" size={24} color={item.color} />
          )}
        </View>
        <View style={styles.cardInfo}>
          <Text style={[styles.cardName, { color: colors.text }]}>{item.name}</Text>
          <Text style={[styles.cardNumber, { color: colors.textSecondary }]}>
            •••• {item.last4}
          </Text>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <TouchableOpacity
          onPress={() => setDefault(item.id)}
          style={[
            styles.defaultButton,
            {
              backgroundColor: item.isDefault ? colors.primary + '20' : colors.background,
              borderColor: colors.border,
            },
          ]}
          disabled={item.isDefault}
        >
          <Text
            style={[
              styles.defaultButtonText,
              { color: item.isDefault ? colors.primary : colors.textSecondary },
            ]}
          >
            {item.isDefault ? '✓ Primary' : 'Set as Primary'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={() => removeMethod(item.id)}
          style={[styles.actionButton]}
        >
          <Ionicons name="trash-outline" size={20} color="#ff4444" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Payment Methods
        </Text>
        <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
          {methods.length} saved {methods.length === 1 ? 'method' : 'methods'}
        </Text>
      </View>

      <FlatList
        data={methods}
        renderItem={renderMethod}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <View style={[styles.emptyIcon, { backgroundColor: colors.border }]}>
              <Ionicons name="card-outline" size={50} color={colors.textTertiary} />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              No payment methods
            </Text>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              Add your first payment method to get started
            </Text>
          </View>
        }
      />

      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: colors.primary }]}
        onPress={() => setShowAddModal(true)}
        activeOpacity={0.9}
      >
        <Ionicons name="add" size={24} color="#fff" />
        <Text style={styles.addButtonText}>Add Payment Method</Text>
      </TouchableOpacity>

      {/* Add Card Modal */}
      <Modal
        visible={showAddModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                Add New Card
              </Text>
              <TouchableOpacity
                onPress={() => setShowAddModal(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.form}>
                <View style={styles.inputGroup}>
                  <Text style={[styles.label, { color: colors.textSecondary }]}>
                    Card Number *
                  </Text>
                  <View style={[styles.inputWrapper, { borderColor: colors.border }]}>
                    <TextInput
                      style={[styles.input, { color: colors.text }]}
                      value={newCard.number}
                      onChangeText={text => {
                        // Format as 1234 5678 9012 3456
                        const formatted = text.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
                        setNewCard({...newCard, number: text.replace(/\s/g, '')});
                      }}
                      placeholder="1234 5678 9012 3456"
                      keyboardType="number-pad"
                      maxLength={19}
                    />
                    <Ionicons name="card-outline" size={20} color={colors.textTertiary} />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.label, { color: colors.textSecondary }]}>
                    Cardholder Name *
                  </Text>
                  <View style={[styles.inputWrapper, { borderColor: colors.border }]}>
                    <TextInput
                      style={[styles.input, { color: colors.text }]}
                      value={newCard.name}
                      onChangeText={text => setNewCard({...newCard, name: text})}
                      placeholder="John Doe"
                      autoCapitalize="words"
                    />
                    <Ionicons name="person-outline" size={20} color={colors.textTertiary} />
                  </View>
                </View>

                <View style={styles.row}>
                  <View style={[styles.inputGroup, { flex: 1 }]}>
                    <Text style={[styles.label, { color: colors.textSecondary }]}>
                      Expiry Date *
                    </Text>
                    <View style={[styles.inputWrapper, { borderColor: colors.border }]}>
                      <TextInput
                        style={[styles.input, { color: colors.text }]}
                        value={newCard.expiry}
                        onChangeText={text => {
                          // Format as MM/YY
                          let formatted = text.replace(/\D/g, '');
                          if (formatted.length > 2) {
                            formatted = formatted.slice(0, 2) + '/' + formatted.slice(2, 4);
                          }
                          setNewCard({...newCard, expiry: formatted});
                        }}
                        placeholder="MM/YY"
                        maxLength={5}
                      />
                      <Ionicons name="calendar-outline" size={20} color={colors.textTertiary} />
                    </View>
                  </View>
                  
                  <View style={[styles.inputGroup, { flex: 1, marginLeft: 10 }]}>
                    <Text style={[styles.label, { color: colors.textSecondary }]}>
                      CVV *
                    </Text>
                    <View style={[styles.inputWrapper, { borderColor: colors.border }]}>
                      <TextInput
                        style={[styles.input, { color: colors.text }]}
                        value={newCard.cvv}
                        onChangeText={text => setNewCard({...newCard, cvv: text.replace(/\D/g, '')})}
                        placeholder="123"
                        keyboardType="number-pad"
                        maxLength={4}
                        secureTextEntry
                      />
                      <Ionicons name="lock-closed-outline" size={20} color={colors.textTertiary} />
                    </View>
                  </View>
                </View>
                
                <View style={[styles.note, { backgroundColor: colors.primary + '10', borderColor: colors.primary + '30' }]}>
                  <Ionicons name="shield-checkmark-outline" size={18} color={colors.primary} />
                  <Text style={[styles.noteText, { color: colors.text }]}>
                    Your payment details are secured and encrypted
                  </Text>
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.cancelButton, { borderColor: colors.border }]}
                onPress={() => setShowAddModal(false)}
              >
                <Text style={[styles.cancelButtonText, { color: colors.text }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.saveButton, { backgroundColor: colors.primary }]}
                onPress={addNewCard}
              >
                <Ionicons name="checkmark" size={20} color="#fff" style={styles.saveIcon} />
                <Text style={styles.saveButtonText}>Add Card</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
  },
  list: {
    padding: 20,
    paddingTop: 0,
  },
  card: {
    borderRadius: 16,
    borderWidth: 2,
    padding: 20,
    marginBottom: 16,
    position: 'relative',
    backgroundColor: '#000000ff',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8
  },
  defaultBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  defaultBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardInfo: {
    flex: 1,
  },
  cardName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardNumber: {
    fontSize: 14,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  defaultButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    minWidth: 120,
    alignItems: 'center',
  },
  defaultButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 68, 68, 0.1)',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    maxWidth: 200,
    lineHeight: 20,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 14,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    maxHeight: '70%',
  },
  form: {
    padding: 20,
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 56,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    paddingVertical: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  note: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 8,
  },
  noteText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  saveIcon: {
    marginRight: 4,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PaymentMethodsScreen;