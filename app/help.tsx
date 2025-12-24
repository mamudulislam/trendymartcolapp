import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Alert,
  Linking,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

type FAQItem = {
  id: string;
  question: string;
  answer: string;
  category: string;
};

export default function HelpScreen() {
  const { colors, isDark } = useTheme();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const faqData: FAQItem[] = [
    // Account & Profile
    {
      id: '1',
      question: 'How do I reset my password?',
      answer: 'Go to Settings > Account > Change Password. You\'ll receive an email with a reset link. If you don\'t see it, check your spam folder.',
      category: 'account',
    },
    {
      id: '2',
      question: 'How do I update my profile information?',
      answer: 'Navigate to your profile page and tap "Edit Profile". You can update your name, email, profile picture, and bio from there.',
      category: 'account',
    },
    {
      id: '3',
      question: 'Can I delete my account?',
      answer: 'Yes, you can delete your account from Settings > Account > Delete Account. Please note this action is irreversible and all your data will be permanently removed.',
      category: 'account',
    },

    // Payment & Billing
    {
      id: '4',
      question: 'How do I add a payment method?',
      answer: 'Go to Payment Methods section and tap "Add Payment Method". You can add credit/debit cards, PayPal, or Apple Pay.',
      category: 'payment',
    },
    {
      id: '5',
      question: 'Is my payment information secure?',
      answer: 'Yes, all payment information is encrypted and securely stored. We use industry-standard SSL encryption and never store your full card details on our servers.',
      category: 'payment',
    },
    {
      id: '6',
      question: 'How do I update my billing address?',
      answer: 'Navigate to Payment Methods, select your payment method, and tap "Edit" to update your billing information.',
      category: 'payment',
    },

    // App Features
    {
      id: '7',
      question: 'How do I enable dark mode?',
      answer: 'Go to Settings > Appearance and toggle "Dark Mode". The app will automatically switch based on your device settings if you enable "Follow System".',
      category: 'features',
    },
    {
      id: '8',
      question: 'Can I use the app offline?',
      answer: 'Some features are available offline, but you need an internet connection for most functionality. We\'re working on expanding offline capabilities.',
      category: 'features',
    },
    {
      id: '9',
      question: 'How do I clear app cache?',
      answer: 'Go to Settings > Storage > Clear Cache. This will free up storage space without deleting your personal data.',
      category: 'features',
    },

    // Troubleshooting
    {
      id: '10',
      question: 'The app keeps crashing, what should I do?',
      answer: 'Try these steps: 1) Force close and reopen the app, 2) Update to the latest version, 3) Clear app cache, 4) Reinstall the app.',
      category: 'troubleshoot',
    },
    {
      id: '11',
      question: 'I\'m not receiving notifications, how can I fix this?',
      answer: 'Check: 1) App notification permissions in device settings, 2) Notification settings within the app, 3) Do Not Disturb mode, 4) App is not force stopped.',
      category: 'troubleshoot',
    },
    {
      id: '12',
      question: 'How do I report a bug?',
      answer: 'You can report bugs by going to Settings > Help & Support > Report a Bug. Please include details about the issue and your device information.',
      category: 'troubleshoot',
    },

    // Privacy & Security
    {
      id: '13',
      question: 'How is my data protected?',
      answer: 'We use end-to-end encryption for sensitive data, regular security audits, and comply with global privacy regulations. Your data is never sold to third parties.',
      category: 'privacy',
    },
    {
      id: '14',
      question: 'Can I export my data?',
      answer: 'Yes, go to Settings > Privacy > Export Data. You\'ll receive a downloadable file containing all your data in a readable format.',
      category: 'privacy',
    },
    {
      id: '15',
      question: 'How do I manage app permissions?',
      answer: 'Navigate to Settings > Privacy > Permissions. You can manage camera, location, contacts, and other permissions from there.',
      category: 'privacy',
    },
  ];

  const categories = [
    { id: 'all', name: 'All Questions', icon: 'help-circle' },
    { id: 'account', name: 'Account', icon: 'person' },
    { id: 'payment', name: 'Payment', icon: 'card' },
    { id: 'features', name: 'Features', icon: 'apps' },
    { id: 'troubleshoot', name: 'Troubleshoot', icon: 'construct' },
    { id: 'privacy', name: 'Privacy', icon: 'shield-checkmark' },
  ];

  const filteredFAQs = activeCategory === 'all' 
    ? faqData 
    : faqData.filter(faq => faq.category === activeCategory);

  const toggleFAQ = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const openEmail = () => {
    Linking.openURL('mailto:support@yourapp.com?subject=Help Request&body=Hello, I need assistance with:');
  };

  const openPhone = () => {
    Linking.openURL('tel:+1234567890');
  };

  const openChat = () => {
    Alert.alert('Live Chat', 'Connecting you with our support team...', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Continue', onPress: () => console.log('Open chat') },
    ]);
  };

  const renderFAQItem = (faq: FAQItem) => {
    const isExpanded = expandedId === faq.id;

    return (
      <TouchableOpacity
        key={faq.id}
        style={[
          styles.faqItem,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
        onPress={() => toggleFAQ(faq.id)}
        activeOpacity={0.7}
      >
        <View style={styles.faqHeader}>
          <View style={styles.questionContainer}>
            <Ionicons
              name="help-circle-outline"
              size={20}
              color={colors.primary}
              style={styles.questionIcon}
            />
            <Text style={[styles.question, { color: colors.text }]}>
              {faq.question}
            </Text>
          </View>
          <Ionicons
            name={isExpanded ? 'chevron-up' : 'chevron-down'}
            size={20}
            color={colors.textTertiary}
          />
        </View>

        {isExpanded && (
          <View style={styles.answerContainer}>
            <View style={[styles.answerDivider, { backgroundColor: colors.border }]} />
            <View style={styles.answerContent}>
              <Ionicons
                name="information-circle-outline"
                size={18}
                color={colors.primary}
                style={styles.answerIcon}
              />
              <Text style={[styles.answer, { color: colors.textSecondary }]}>
                {faq.answer}
              </Text>
            </View>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            Help & Support
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Find answers to common questions or contact support
          </Text>
        </View>

        {/* Quick Actions */}
        <View style={[styles.quickActions, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Get Help Quickly
          </Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.primary + '15' }]}
              onPress={openChat}
              activeOpacity={0.7}
            >
              <View style={[styles.actionIcon, { backgroundColor: colors.primary }]}>
                <Ionicons name="chatbubbles" size={22} color="#fff" />
              </View>
              <Text style={[styles.actionText, { color: colors.text }]}>
                Live Chat
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.primary + '15' }]}
              onPress={openEmail}
              activeOpacity={0.7}
            >
              <View style={[styles.actionIcon, { backgroundColor: colors.primary }]}>
                <Ionicons name="mail" size={22} color="#fff" />
              </View>
              <Text style={[styles.actionText, { color: colors.text }]}>
                Email Us
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.primary + '15' }]}
              onPress={openPhone}
              activeOpacity={0.7}
            >
              <View style={[styles.actionIcon, { backgroundColor: colors.primary }]}>
                <Ionicons name="call" size={22} color="#fff" />
              </View>
              <Text style={[styles.actionText, { color: colors.text }]}>
                Call Support
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.primary + '15' }]}
              onPress={() => Alert.alert('Coming Soon', 'Video tutorials are coming soon!')}
              activeOpacity={0.7}
            >
              <View style={[styles.actionIcon, { backgroundColor: colors.primary }]}>
                <Ionicons name="videocam" size={22} color="#fff" />
              </View>
              <Text style={[styles.actionText, { color: colors.text }]}>
                Tutorials
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* FAQ Categories */}
        <View style={styles.categoriesSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Browse by Category
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          >
            {categories.map(category => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryButton,
                  {
                    backgroundColor: activeCategory === category.id ? colors.primary : colors.card,
                    borderColor: colors.border,
                  },
                ]}
                onPress={() => setActiveCategory(category.id)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={category.icon as any}
                  size={18}
                  color={activeCategory === category.id ? '#fff' : colors.text}
                  style={styles.categoryIcon}
                />
                <Text
                  style={[
                    styles.categoryText,
                    { color: activeCategory === category.id ? '#fff' : colors.text },
                  ]}
                >
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* FAQ List */}
        <View style={styles.faqSection}>
          <View style={styles.faqHeaderSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Frequently Asked Questions
            </Text>
            <Text style={[styles.faqCount, { color: colors.textSecondary }]}>
              {filteredFAQs.length} questions
            </Text>
          </View>

          <View style={styles.faqList}>
            {filteredFAQs.map(renderFAQItem)}
          </View>
        </View>

        {/* Contact Section */}
        <View style={[styles.contactSection, { backgroundColor: colors.card }]}>
          <Text style={[styles.contactTitle, { color: colors.text }]}>
            Still Need Help?
          </Text>
          <Text style={[styles.contactText, { color: colors.textSecondary }]}>
            Our support team is available 24/7 to assist you
          </Text>
          
          <View style={styles.contactInfo}>
            <View style={styles.contactItem}>
              <Ionicons name="time-outline" size={20} color={colors.primary} />
              <View style={styles.contactDetails}>
                <Text style={[styles.contactLabel, { color: colors.text }]}>
                  Support Hours
                </Text>
                <Text style={[styles.contactValue, { color: colors.textSecondary }]}>
                  24/7, 365 days
                </Text>
              </View>
            </View>
            
            <View style={styles.contactItem}>
              <Ionicons name="mail-outline" size={20} color={colors.primary} />
              <View style={styles.contactDetails}>
                <Text style={[styles.contactLabel, { color: colors.text }]}>
                  Email
                </Text>
                <Text style={[styles.contactValue, { color: colors.textSecondary }]}>
                  support@yourapp.com
                </Text>
              </View>
            </View>
            
            <View style={styles.contactItem}>
              <Ionicons name="call-outline" size={20} color={colors.primary} />
              <View style={styles.contactDetails}>
                <Text style={[styles.contactLabel, { color: colors.text }]}>
                  Phone
                </Text>
                <Text style={[styles.contactValue, { color: colors.textSecondary }]}>
                  +1 (555) 123-4567
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textTertiary }]}>
            Last updated: Today
          </Text>
          <Text style={[styles.footerText, { color: colors.textTertiary }]}>
            Version 1.0.0
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
  },
  quickActions: {
    marginHorizontal: 20,
    marginTop: 10,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  categoriesSection: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  categoriesContainer: {
    gap: 10,
    paddingBottom: 5,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    gap: 8,
    marginRight: 8,
  },
  categoryIcon: {
    marginRight: 4,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
  },
  faqSection: {
    marginTop: 24,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  faqHeaderSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  faqCount: {
    fontSize: 14,
    fontWeight: '500',
  },
  faqList: {
    gap: 12,
  },
  faqItem: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  questionContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  questionIcon: {
    marginTop: 2,
  },
  question: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
  },
  answerContainer: {
    marginTop: 12,
  },
  answerDivider: {
    height: 1,
    marginBottom: 12,
  },
  answerContent: {
    flexDirection: 'row',
    gap: 12,
  },
  answerIcon: {
    marginTop: 2,
  },
  answer: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
  },
  contactSection: {
    marginHorizontal: 20,
    marginTop: 10,
    padding: 20,
    borderRadius: 16,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  contactText: {
    fontSize: 14,
    marginBottom: 20,
  },
  contactInfo: {
    gap: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  contactDetails: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 14,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    alignItems: 'center',
    gap: 8,
  },
  footerText: {
    fontSize: 12,
  },
});