import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
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
import {
  createContact,
  deleteContact,
  fetchContacts,
} from '../../src/services/api/contacts';

const contactBg = require('../../assets/bg-imgs/contactbg.png');
const MAX_CONTACTS = 3;

const emptyForm = {
  name: '',
  email: '',
  number: '',
  message: '',
};

export default function ContactsScreen() {
  const insets = useSafeAreaInsets();
  const [contacts, setContacts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [formVisible, setFormVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [listError, setListError] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [maxAllowed, setMaxAllowed] = useState(MAX_CONTACTS);

  const isAtLimit = contacts.length >= maxAllowed;
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
      number: contact.number,
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

  const handleSave = async () => {
    if (!form.name.trim() || !form.email.trim() || !form.number.trim()) {
      setError('Name, email, and phone are required.');
      return;
    }
    if (!form.message.trim()) {
      setError('Message is required.');
      return;
    }

    if (editingId) {
      setError('Editing contacts is not available yet.');
      return;
    }

    if (contacts.length >= maxAllowed) {
      setError('You reach max contacts limit.');
      return;
    }

    try {
      setSaving(true);
      setError('');
      const data = await createContact({
        name: form.name,
        email: form.email,
        number: form.number,
        message: form.message,
      });
      if (data?.contact) {
        const newContact = {
          id: data.contact._id,
          name: data.contact.name,
          email: data.contact.email,
          number: data.contact.number,
          message: data.contact.message,
        };
        setContacts(prev => [newContact, ...prev]);
      }
      handleCloseForm();
    } catch (err) {
      setError(err.message || 'Unable to save contact.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = id => {
    Alert.alert('Delete contact?', 'This action cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteContact(id);
            setContacts(prev => prev.filter(item => item.id !== id));
          } catch (err) {
            setListError(err.message || 'Unable to delete contact.');
          }
        },
      },
    ]);
  };

  useEffect(() => {
    const loadContacts = async () => {
      try {
        setLoading(true);
        setListError('');
        const data = await fetchContacts();
        setMaxAllowed(data?.maxAllowed || MAX_CONTACTS);
        const mapped = (data?.contacts || []).map(contact => ({
          id: contact._id,
          name: contact.name,
          email: contact.email,
          number: contact.number,
          message: contact.message,
        }));
        setContacts(mapped);
      } catch (err) {
        setListError(err.message || 'Unable to load contacts.');
      } finally {
        setLoading(false);
      }
    };

    loadContacts();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 140 + insets.bottom }]}
      >
        <Text style={styles.title}>Contacts</Text>

        {listError ? <Text style={styles.errorText}>{listError}</Text> : null}

        {loading ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Loading contacts...</Text>
          </View>
        ) : contacts.length === 0 ? (
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
                value={form.number}
                keyboardType="phone-pad"
                onChangeText={text => setForm(prev => ({ ...prev, number: text }))}
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

            <Pressable onPress={handleSave} style={styles.submitButton} disabled={saving}>
              <Text style={styles.submitButtonText}>
                {saving ? 'Saving...' : 'Add'}
              </Text>
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
    fontFamily: 'Poppins_600SemiBold',
    color: '#0f172a',
  },
  emptyState: {
    marginTop: 64,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Poppins_500Medium',
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
    height: 140,
    
  },

  cardImage: {
    borderRadius: 16,
   
  },
  cardContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  cardName: {
    fontSize: 28,
    fontFamily: 'Poppins_600SemiBold',
    color: '#0f172a',
    marginTop: 14,
  },
  cardEmail: {
    marginTop: 2,
    fontSize: 20,
    fontFamily: 'Poppins_400Regular',
    color: '#334155',
  },
  cardMeta: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#475569',
  },
  cardMessage: {
    marginTop: 8,
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#475569',
  },
  cardActions: {
    position: 'absolute',
    right: 12,
    bottom: 12,
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    height: 50,
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: '#FEC5C1',
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
    fontFamily: 'Poppins_500Medium',
    color: '#475569',
  },
  addButton: {
    alignItems: 'center',
    borderRadius: 12,
    paddingVertical: 24,
    backgroundColor: '#000000',
  },
  addButtonDisabled: {
    backgroundColor: '#4A4A4B',
   
  },
  addButtonText: {
    fontSize: 24,
    fontFamily: 'Poppins_600',
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
    fontFamily: 'Poppins_600SemiBold',
    color: '#0f172a',
  },
  errorText: {
    marginBottom: 12,
    fontSize: 14,
    fontFamily: 'Poppins_500Medium',
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
    fontFamily: 'Poppins_400Regular',
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
    fontSize: 1,
    fontFamily: 'Poppins_500Medium',
    color: '#ffffff',
  },
});
