import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useApp } from '../contexts/AppContext';
import { useTheme } from '../contexts/ThemeContext';

export default function CheckoutScreen() {
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const { cart, getCartTotal } = useApp();

  const subtotal = getCartTotal();
  const tax = subtotal * 0.08; // 8% tax example
  const total = subtotal + tax;

  const renderCartItem = ({ item }: { item: any }) => (
    <View style={[s.itemContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={s.itemDetails}>
        <Text style={[s.itemName, { color: colors.text }]}>{item.name} (x{item.quantity})</Text>
        <Text style={[s.itemPrice, { color: colors.primary }]}>${(item.price * item.quantity).toFixed(2)}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[s.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <View style={[s.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={s.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[s.headerTitle, { color: colors.text }]}>Checkout</Text>
        <View style={s.backButton} />
      </View>

      <FlatList
        data={cart}
        renderItem={renderCartItem}
        keyExtractor={item => item.id.toString()}
        ListHeaderComponent={
          <Text style={[s.listHeader, { color: colors.text }]}>Order Summary</Text>
        }
        ListFooterComponent={
          <>
            <View style={[s.summaryContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={s.summaryRow}>
                <Text style={[s.summaryLabel, { color: colors.textSecondary }]}>Subtotal</Text>
                <Text style={[s.summaryValue, { color: colors.text }]}>${subtotal.toFixed(2)}</Text>
              </View>
              <View style={s.summaryRow}>
                <Text style={[s.summaryLabel, { color: colors.textSecondary }]}>Tax (8%)</Text>
                <Text style={[s.summaryValue, { color: colors.text }]}>${tax.toFixed(2)}</Text>
              </View>
              <View style={[s.summaryDivider, { backgroundColor: colors.border }]} />
              <View style={s.summaryRow}>
                <Text style={[s.summaryTotalLabel, { color: colors.text }]}>Total</Text>
                <Text style={[s.summaryTotalValue, { color: colors.primary }]}>${total.toFixed(2)}</Text>
              </View>
            </View>

            <TouchableOpacity style={[s.placeOrderButton, { backgroundColor: colors.primary }]}>
              <Text style={s.placeOrderButtonText}>Place Order</Text>
            </TouchableOpacity>
          </>
        }
        contentContainerStyle={s.listContainer}
      />
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
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 20,
  },
  listHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  itemContainer: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  itemDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '600',
  },
  summaryContainer: {
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 15,
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: '500',
  },
  summaryDivider: {
    height: 1,
    marginVertical: 12,
  },
  summaryTotalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  summaryTotalValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  placeOrderButton: {
    marginTop: 32,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
  },
  placeOrderButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },
});
