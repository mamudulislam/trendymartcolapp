import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Alert,
  Linking,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

export default function PrivacyScreen() {
  const { colors, isDark } = useTheme();
  const [acceptedTerms, setAcceptedTerms] = useState(true);
  const [dataSharing, setDataSharing] = useState(false);
  const [marketingEmails, setMarketingEmails] = useState(true);
  const [analytics, setAnalytics] = useState(true);
  
  const [activeSection, setActiveSection] = useState('privacy');

  const openExternalLink = (url: string) => {
    Linking.openURL(url).catch(err => 
      Alert.alert('Error', 'Could not open link')
    );
  };

  const handleExportData = () => {
    Alert.alert(
      'Export Data',
      'Your data export will be prepared and sent to your email within 24 hours.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Export', onPress: () => {
          Alert.alert('Success', 'Data export has been initiated. Check your email.');
        }},
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This will permanently delete your account and all associated data. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => {
          Alert.alert('Account Deleted', 'Your account has been scheduled for deletion.');
        }},
      ]
    );
  };

  const renderPrivacyPolicy = () => (
    <View style={styles.contentSection}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        Privacy Policy
      </Text>
      
      <Text style={[styles.updateDate, { color: colors.textSecondary }]}>
        Last updated: December 2024
      </Text>

      <View style={styles.policySection}>
        <Text style={[styles.policyTitle, { color: colors.text }]}>
          1. Information We Collect
        </Text>
        <Text style={[styles.policyText, { color: colors.textSecondary }]}>
          We collect information you provide directly, including name, email, profile data, 
          and payment information. We also automatically collect usage data, device information, 
          and location data (with permission).
        </Text>
      </View>

      <View style={styles.policySection}>
        <Text style={[styles.policyTitle, { color: colors.text }]}>
          2. How We Use Your Information
        </Text>
        <Text style={[styles.policyText, { color: colors.textSecondary }]}>
          • To provide and maintain our services{"\n"}
          • To process transactions and send receipts{"\n"}
          • To communicate with you about updates{"\n"}
          • To improve our app and services{"\n"}
          • To ensure security and prevent fraud
        </Text>
      </View>

      <View style={styles.policySection}>
        <Text style={[styles.policyTitle, { color: colors.text }]}>
          3. Data Sharing & Disclosure
        </Text>
        <Text style={[styles.policyText, { color: colors.textSecondary }]}>
          We do not sell your personal data. We may share information with:{"\n\n"}
          • Service providers who assist our operations{"\n"}
          • Legal authorities when required by law{"\n"}
          • During business transfers (mergers/acquisitions){"\n"}
          • With your explicit consent
        </Text>
      </View>

      <View style={styles.policySection}>
        <Text style={[styles.policyTitle, { color: colors.text }]}>
          4. Data Security
        </Text>
        <Text style={[styles.policyText, { color: colors.textSecondary }]}>
          We implement industry-standard security measures including encryption, 
          secure servers, and regular security audits. However, no method of 
          transmission over the Internet is 100% secure.
        </Text>
      </View>

      <View style={styles.policySection}>
        <Text style={[styles.policyTitle, { color: colors.text }]}>
          5. Your Rights
        </Text>
        <Text style={[styles.policyText, { color: colors.textSecondary }]}>
          You have the right to:{"\n\n"}
          • Access your personal data{"\n"}
          • Correct inaccurate data{"\n"}
          • Request data deletion{"\n"}
          • Object to data processing{"\n"}
          • Data portability{"\n"}
          • Withdraw consent
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.linkButton, { borderColor: colors.border }]}
        onPress={() => openExternalLink('https://yourapp.com/full-privacy-policy')}
        activeOpacity={0.7}
      >
        <Text style={[styles.linkButtonText, { color: colors.primary }]}>
          View Full Privacy Policy
        </Text>
        <Ionicons name="open-outline" size={18} color={colors.primary} />
      </TouchableOpacity>
    </View>
  );

  const renderTermsOfService = () => (
    <View style={styles.contentSection}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        Terms of Service
      </Text>
      
      <Text style={[styles.updateDate, { color: colors.textSecondary }]}>
        Effective: December 2024
      </Text>

      <View style={styles.policySection}>
        <Text style={[styles.policyTitle, { color: colors.text }]}>
          1. Acceptance of Terms
        </Text>
        <Text style={[styles.policyText, { color: colors.textSecondary }]}>
          By accessing or using our services, you agree to be bound by these Terms. 
          If you disagree with any part, you may not use our services.
        </Text>
      </View>

      <View style={styles.policySection}>
        <Text style={[styles.policyTitle, { color: colors.text }]}>
          2. User Accounts
        </Text>
        <Text style={[styles.policyText, { color: colors.textSecondary }]}>
          You are responsible for maintaining the confidentiality of your account 
          and password. You agree to accept responsibility for all activities that 
          occur under your account.
        </Text>
      </View>

      <View style={styles.policySection}>
        <Text style={[styles.policyTitle, { color: colors.text }]}>
          3. Prohibited Activities
        </Text>
        <Text style={[styles.policyText, { color: colors.textSecondary }]}>
          You may not:{"\n\n"}
          • Violate any laws or regulations{"\n"}
          • Infringe on intellectual property rights{"\n"}
          • Harass, abuse, or harm others{"\n"}
          • Use the service for any illegal purpose{"\n"}
          • Attempt to gain unauthorized access
        </Text>
      </View>

      <View style={styles.policySection}>
        <Text style={[styles.policyTitle, { color: colors.text }]}>
          4. Service Modifications
        </Text>
        <Text style={[styles.policyText, { color: colors.textSecondary }]}>
          We reserve the right to modify or discontinue any service at any time 
          without notice. We shall not be liable for any modification, suspension, 
          or discontinuance.
        </Text>
      </View>

      <View style={styles.policySection}>
        <Text style={[styles.policyTitle, { color: colors.text }]}>
          5. Limitation of Liability
        </Text>
        <Text style={[styles.policyText, { color: colors.textSecondary }]}>
          In no event shall we be liable for any indirect, incidental, special, 
          consequential or punitive damages resulting from your use or inability 
          to use the service.
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.linkButton, { borderColor: colors.border }]}
        onPress={() => openExternalLink('https://yourapp.com/full-terms')}
        activeOpacity={0.7}
      >
        <Text style={[styles.linkButtonText, { color: colors.primary }]}>
          View Full Terms of Service
        </Text>
        <Ionicons name="open-outline" size={18} color={colors.primary} />
      </TouchableOpacity>
    </View>
  );

  const renderPrivacySettings = () => (
    <View style={styles.contentSection}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        Privacy Settings
      </Text>
      
      <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
        Control how your data is used and shared
      </Text>

      {/* Privacy Controls */}
      <View style={styles.settingsList}>
        <View style={[styles.settingItem, { borderBottomColor: colors.border }]}>
          <View style={styles.settingInfo}>
            <Ionicons name="shield-checkmark" size={22} color={colors.primary} />
            <View style={styles.settingText}>
              <Text style={[styles.settingTitle, { color: colors.text }]}>
                Data Collection
              </Text>
              <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                Allow basic data collection for app functionality
              </Text>
            </View>
          </View>
          <Switch
            value={acceptedTerms}
            onValueChange={setAcceptedTerms}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor="#fff"
          />
        </View>

        <View style={[styles.settingItem, { borderBottomColor: colors.border }]}>
          <View style={styles.settingInfo}>
            <Ionicons name="share-social" size={22} color={colors.primary} />
            <View style={styles.settingText}>
              <Text style={[styles.settingTitle, { color: colors.text }]}>
                Third-Party Data Sharing
              </Text>
              <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                Share anonymized data with trusted partners
              </Text>
            </View>
          </View>
          <Switch
            value={dataSharing}
            onValueChange={setDataSharing}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor="#fff"
          />
        </View>

        <View style={[styles.settingItem, { borderBottomColor: colors.border }]}>
          <View style={styles.settingInfo}>
            <Ionicons name="mail" size={22} color={colors.primary} />
            <View style={styles.settingText}>
              <Text style={[styles.settingTitle, { color: colors.text }]}>
                Marketing Emails
              </Text>
              <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                Receive promotional offers and updates
              </Text>
            </View>
          </View>
          <Switch
            value={marketingEmails}
            onValueChange={setMarketingEmails}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor="#fff"
          />
        </View>

        <View style={[styles.settingItem, { borderBottomColor: colors.border }]}>
          <View style={styles.settingInfo}>
            <Ionicons name="analytics" size={22} color={colors.primary} />
            <View style={styles.settingText}>
              <Text style={[styles.settingTitle, { color: colors.text }]}>
                Usage Analytics
              </Text>
              <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                Help us improve by sharing usage data
              </Text>
            </View>
          </View>
          <Switch
            value={analytics}
            onValueChange={setAnalytics}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor="#fff"
          />
        </View>
      </View>

      {/* Data Management Actions */}
      <Text style={[styles.actionSectionTitle, { color: colors.text, marginTop: 30 }]}>
        Data Management
      </Text>

      <TouchableOpacity
        style={[styles.actionButton, { borderColor: colors.border }]}
        onPress={() => openExternalLink('https://yourapp.com/data-request')}
        activeOpacity={0.7}
      >
        <View style={styles.actionButtonContent}>
          <Ionicons name="document-text" size={22} color={colors.primary} />
          <View style={styles.actionButtonText}>
            <Text style={[styles.actionButtonTitle, { color: colors.text }]}>
              Request My Data
            </Text>
            <Text style={[styles.actionButtonSubtitle, { color: colors.textSecondary }]}>
              Get a copy of all data we have about you
            </Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.actionButton, { borderColor: colors.border }]}
        onPress={handleExportData}
        activeOpacity={0.7}
      >
        <View style={styles.actionButtonContent}>
          <Ionicons name="download" size={22} color={colors.primary} />
          <View style={styles.actionButtonText}>
            <Text style={[styles.actionButtonTitle, { color: colors.text }]}>
              Export My Data
            </Text>
            <Text style={[styles.actionButtonSubtitle, { color: colors.textSecondary }]}>
              Download your data in portable format
            </Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.actionButton, { borderColor: colors.border }]}
        onPress={() => Alert.alert('Coming Soon', 'This feature is coming soon')}
        activeOpacity={0.7}
      >
        <View style={styles.actionButtonContent}>
          <Ionicons name="eye-off" size={22} color={colors.primary} />
          <View style={styles.actionButtonText}>
            <Text style={[styles.actionButtonTitle, { color: colors.text }]}>
              Clear My Data
            </Text>
            <Text style={[styles.actionButtonSubtitle, { color: colors.textSecondary }]}>
              Delete specific data categories
            </Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.deleteButton, { borderColor: '#ff4444' }]}
        onPress={handleDeleteAccount}
        activeOpacity={0.7}
      >
        <Ionicons name="trash-outline" size={20} color="#ff4444" />
        <Text style={styles.deleteButtonText}>
          Delete My Account
        </Text>
      </TouchableOpacity>

      <View style={[styles.noteBox, { backgroundColor: colors.primary + '10', borderColor: colors.primary + '30' }]}>
        <Ionicons name="information-circle" size={20} color={colors.primary} />
        <Text style={[styles.noteText, { color: colors.text }]}>
          Your privacy is important to us. Changes to settings may take 24-48 hours to process.
        </Text>
      </View>
    </View>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'privacy':
        return renderPrivacyPolicy();
      case 'terms':
        return renderTermsOfService();
      case 'settings':
        return renderPrivacySettings();
      default:
        return renderPrivacyPolicy();
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            Privacy & Terms
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Understand how we protect and use your data
          </Text>
        </View>

        {/* Navigation Tabs */}
        <View style={[styles.tabContainer, { backgroundColor: colors.card }]}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabContent}
          >
            <TouchableOpacity
              style={[
                styles.tabButton,
                {
                  backgroundColor: activeSection === 'privacy' ? colors.primary : 'transparent',
                  borderColor: colors.border,
                },
              ]}
              onPress={() => setActiveSection('privacy')}
              activeOpacity={0.7}
            >
              <Ionicons
                name="shield-checkmark"
                size={18}
                color={activeSection === 'privacy' ? '#fff' : colors.text}
              />
              <Text
                style={[
                  styles.tabText,
                  { color: activeSection === 'privacy' ? '#fff' : colors.text },
                ]}
              >
                Privacy Policy
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tabButton,
                {
                  backgroundColor: activeSection === 'terms' ? colors.primary : 'transparent',
                  borderColor: colors.border,
                },
              ]}
              onPress={() => setActiveSection('terms')}
              activeOpacity={0.7}
            >
              <Ionicons
                name="document-text"
                size={18}
                color={activeSection === 'terms' ? '#fff' : colors.text}
              />
              <Text
                style={[
                  styles.tabText,
                  { color: activeSection === 'terms' ? '#fff' : colors.text },
                ]}
              >
                Terms of Service
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tabButton,
                {
                  backgroundColor: activeSection === 'settings' ? colors.primary : 'transparent',
                  borderColor: colors.border,
                },
              ]}
              onPress={() => setActiveSection('settings')}
              activeOpacity={0.7}
            >
              <Ionicons
                name="settings"
                size={18}
                color={activeSection === 'settings' ? '#fff' : colors.text}
              />
              <Text
                style={[
                  styles.tabText,
                  { color: activeSection === 'settings' ? '#fff' : colors.text },
                ]}
              >
                Privacy Settings
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Content */}
        {renderContent()}

        {/* Footer */}
        <View style={styles.footer}>
          <View style={[styles.footerSection, { backgroundColor: colors.card }]}>
            <Text style={[styles.footerTitle, { color: colors.text }]}>
              Additional Resources
            </Text>
            
            <TouchableOpacity
              style={[styles.footerLink, { borderBottomColor: colors.border }]}
              onPress={() => openExternalLink('https://yourapp.com/cookie-policy')}
              activeOpacity={0.7}
            >
              <Text style={[styles.footerLinkText, { color: colors.text }]}>
                Cookie Policy
              </Text>
              <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.footerLink, { borderBottomColor: colors.border }]}
              onPress={() => openExternalLink('https://yourapp.com/ccpa')}
              activeOpacity={0.7}
            >
              <Text style={[styles.footerLinkText, { color: colors.text }]}>
                CCPA Compliance
              </Text>
              <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.footerLink, { borderBottomColor: colors.border }]}
              onPress={() => openExternalLink('https://yourapp.com/gdpr')}
              activeOpacity={0.7}
            >
              <Text style={[styles.footerLinkText, { color: colors.text }]}>
                GDPR Information
              </Text>
              <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.footerLink}
              onPress={() => openExternalLink('mailto:privacy@yourapp.com')}
              activeOpacity={0.7}
            >
              <Text style={[styles.footerLinkText, { color: colors.text }]}>
                Contact Privacy Team
              </Text>
              <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} />
            </TouchableOpacity>
          </View>

          <View style={[styles.versionInfo, { backgroundColor: colors.primary + '10' }]}>
            <Ionicons name="checkmark-done-circle" size={20} color={colors.primary} />
            <Text style={[styles.versionText, { color: colors.text }]}>
              Privacy Policy v2.4 • Updated December 2024
            </Text>
          </View>
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
  tabContainer: {
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  tabContent: {
    flexDirection: 'row',
    padding: 4,
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    marginRight: 8,
    gap: 8,
    minWidth: 120,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  contentSection: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  sectionSubtitle: {
    fontSize: 14,
    marginBottom: 20,
  },
  updateDate: {
    fontSize: 13,
    marginBottom: 20,
    fontStyle: 'italic',
  },
  policySection: {
    marginBottom: 24,
  },
  policyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  policyText: {
    fontSize: 15,
    lineHeight: 22,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
    marginTop: 20,
  },
  linkButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  settingsList: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
  actionSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  actionButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  actionButtonText: {
    flex: 1,
  },
  actionButtonTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  actionButtonSubtitle: {
    fontSize: 13,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 10,
    marginTop: 8,
    marginBottom: 20,
  },
  deleteButtonText: {
    color: '#ff4444',
    fontSize: 16,
    fontWeight: '600',
  },
  noteBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  noteText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  footerSection: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  footerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  footerLink: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  footerLinkText: {
    fontSize: 15,
    fontWeight: '500',
  },
  versionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 10,
  },
  versionText: {
    fontSize: 13,
    fontWeight: '500',
  },
});