import { useMemo, useState } from 'react';
import {
  ImageBackground,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const contactBg = require('../../assets/bg-imgs/contactbg.png');
const MAX_CONTACTS = 3;

const emptyForm = {
  name: '',
  email: '',
  phone: '',
  message: '',
};

export default function ContactsScreen() {
  const insets = useSafeAreaInsets();
  const [contacts, setContacts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [formVisible, setFormVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  const isAtLimit = contacts.length >= MAX_CONTACTS;
  const addButtonLabel = isAtLimit ? 'Add' : 'Add';
  const addButtonDisabled = isAtLimit;

  const formTitle = useMemo(
    () => (editingId ? 'Edit Contact' : 'Add Contact'),
    [editingId]
  );

  const handleOpenAdd = () => {
    if (isAtLimit) {
      return;
    }
    setForm(emptyForm);
    setEditingId(null);
    setError('');
    setFormVisible(true);
  };

  const handleOpenEdit = contact => {
    setForm({
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      message: contact.message,
    });
    setEditingId(contact.id);
    setError('');
    setFormVisible(true);
  };

  const handleCloseForm = () => {
    setFormVisible(false);
    setEditingId(null);
    setForm(emptyForm);
    setError('');
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.email.trim()) {
      setError('Name and email are required.');
      return;
    }

    if (editingId) {
      setContacts(prev =>
        prev.map(item =>
          item.id === editingId
            ? { ...item, ...form }
            : item
        )
      );
      handleCloseForm();
      return;
    }

    if (contacts.length >= MAX_CONTACTS) {
      setError('You reach max contacts limit.');
      return;
    }

    const newContact = {
      id: `${Date.now()}`,
      ...form,
    };

    setContacts(prev => [...prev, newContact]);
    handleCloseForm();
  };

  const handleDelete = id => {
    setContacts(prev => prev.filter(item => item.id !== id));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 140 + insets.bottom }]}
      >
        <Text style={styles.title}>Contacts</Text>

        {contacts.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Zero Contacts</Text>
            <Text style={styles.emptyText}>Add Now</Text>
          </View>
        ) : (
          <View style={styles.list}>
            {contacts.map(contact => (
              <ImageBackground
                key={contact.id}
                source={contactBg}
                resizeMode="cover"
                imageStyle={styles.cardImage}
                style={[styles.card, styles.cardShadow]}
              >
                <View style={styles.cardContent}>
                  <Text style={styles.cardName}>{contact.name}</Text>
                  <Text style={styles.cardEmail}>{contact.email}</Text>
                  {contact.phone ? (
                    <Text style={styles.cardMeta}>{contact.phone}</Text>
                  ) : null}
                  {contact.message ? (
                    <Text style={styles.cardMessage}>{contact.message}</Text>
                  ) : null}
                </View>

                <View style={styles.cardActions}>
                  <Pressable
                    onPress={() => handleOpenEdit(contact)}
                    style={styles.actionButton}
                  >
                    <Ionicons name="pencil" size={18} color="#111111" />
                  </Pressable>
                  <Pressable
                    onPress={() => handleDelete(contact.id)}
                    style={styles.actionButton}
                  >
                    <Ionicons name="close" size={18} color="#111111" />
                  </Pressable>
                </View>
              </ImageBackground>
            ))}
          </View>
        )}
      </ScrollView>

      <View style={[styles.addButtonWrap, { bottom: 88 + insets.bottom }]}>
        {isAtLimit ? (
          <Text style={styles.limitText}>You Reach Max Contacts Limit</Text>
        ) : null}
        <Pressable
          onPress={handleOpenAdd}
          disabled={addButtonDisabled}
          style={[styles.addButton, addButtonDisabled && styles.addButtonDisabled]}
        >
          <Text style={styles.addButtonText}>{addButtonLabel}</Text>
        </Pressable>
      </View>

      <Modal
        visible={formVisible}
        transparent
        animationType="fade"
        onRequestClose={handleCloseForm}
      >
        <Pressable onPress={handleCloseForm} style={styles.modalOverlay}>
          <Pressable onPress={() => {}} style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{formTitle}</Text>
              <Pressable onPress={handleCloseForm}>
                <Ionicons name="close" size={22} color="#111111" />
              </Pressable>
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <View style={styles.formFields}>
              <TextInput
                placeholder="Enter Name"
                value={form.name}
                onChangeText={text => setForm(prev => ({ ...prev, name: text }))}
                style={styles.input}
              />
              <TextInput
                placeholder="Email"
                value={form.email}
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={text => setForm(prev => ({ ...prev, email: text }))}
                style={styles.input}
              />
              <TextInput
                placeholder="Contact Number"
                value={form.phone}
                keyboardType="phone-pad"
                onChangeText={text => setForm(prev => ({ ...prev, phone: text }))}
                style={styles.input}
              />
              <TextInput
                placeholder="Message"
                value={form.message}
                multiline
                numberOfLines={4}
                onChangeText={text => setForm(prev => ({ ...prev, message: text }))}
                style={[styles.input, styles.messageInput]}
              />
            </View>

            <Pressable onPress={handleSave} style={styles.submitButton}>
              <Text style={styles.submitButtonText}>Add</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  title: {
    marginTop: 16,
    fontSize: 30,
    fontWeight: '600',
    color: '#0f172a',
  },
  emptyState: {
    marginTop: 64,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#64748b',
  },
  list: {
    marginTop: 16,
    gap: 16,
  },
  card: {
    borderRadius: 16,
    backgroundColor: '#ffffff',
    overflow: 'hidden',
  },
  cardShadow: {
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  cardImage: {
    borderRadius: 16,
    opacity: 0.35,
  },
  cardContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  cardName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
  },
  cardEmail: {
    marginTop: 2,
    fontSize: 14,
    color: '#334155',
  },
  cardMeta: {
    fontSize: 14,
    color: '#475569',
  },
  cardMessage: {
    marginTop: 8,
    fontSize: 14,
    color: '#475569',
  },
  cardActions: {
    position: 'absolute',
    right: 12,
    top: 12,
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    height: 36,
    width: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: '#fee2e2',
  },
  addButtonWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    paddingHorizontal: 16,
  },
  limitText: {
    marginBottom: 8,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
    color: '#475569',
  },
  addButton: {
    alignItems: 'center',
    borderRadius: 12,
    paddingVertical: 24,
    backgroundColor: '#000000',
  },
  addButtonDisabled: {
    backgroundColor: '#94a3b8',
  },
  addButtonText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#ffffff',
  },
  modalOverlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    paddingHorizontal: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 380,
    borderRadius: 24,
    backgroundColor: '#ffffff',
    padding: 20,
  },
  modalHeader: {
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
  },
  errorText: {
    marginBottom: 12,
    fontSize: 14,
    fontWeight: '500',
    color: '#e11d48',
  },
  formFields: {
    gap: 12,
  },
  input: {
    borderRadius: 16,
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#0f172a',
  },
  messageInput: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  submitButton: {
    marginTop: 20,
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: '#000000',
    paddingVertical: 16,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '300',
    color: '#ffffff',
  },
});
