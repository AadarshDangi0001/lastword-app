import { apiClient } from './client';

export function fetchContacts() {
  return apiClient.get('/contacts');
}

export function createContact({ name, email, number, message }) {
  return apiClient.post('/contacts', { name, email, number, message });
}

export function deleteContact(contactId) {
  return apiClient.del(`/contacts/${contactId}`);
}

export function sendAllContactMessages() {
  return apiClient.post('/contacts/send-all');
}
