import Contact from '../models/contact.model.js';
import { sendScheduledMessageEmail } from '../utils/mailer.js';

const MAX_CONTACTS_PER_USER = 3;

export const createContact = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, number, message } = req.body;

    const contactsCount = await Contact.countDocuments({ user: userId });
    if (contactsCount >= MAX_CONTACTS_PER_USER) {
      return res.status(400).json({
        success: false,
        message: `You can only save up to ${MAX_CONTACTS_PER_USER} contacts`,
      });
    }

    const existingNumber = await Contact.findOne({ user: userId, number });
    if (existingNumber) {
      return res.status(409).json({
        success: false,
        message: 'This number is already saved in your contacts',
      });
    }

    const contact = await Contact.create({
      user: userId,
      email: req.body.email,
      name,
      number,
      message,
    });

    return res.status(201).json({
      success: true,
      message: 'Contact saved successfully',
      contact,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Unable to save contact',
      error: error.message,
    });
  }
};

export const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find({ user: req.user._id }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: contacts.length,
      maxAllowed: MAX_CONTACTS_PER_USER,
      contacts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Unable to fetch contacts',
      error: error.message,
    });
  }
};

export const deleteContact = async (req, res) => {
  try {
    const { contactId } = req.params;

    const deleted = await Contact.findOneAndDelete({
      _id: contactId,
      user: req.user._id,
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Contact deleted successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Unable to delete contact',
      error: error.message,
    });
  }
};

export const sendAllMessages = async (req, res) => {
  try {
    const userId = req.user._id;

    const contacts = await Contact.find({ user: userId });

    if (contacts.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No contacts saved to send messages to',
      });
    }

    const sendResults = [];

    for (const contact of contacts) {
      try {
        await sendScheduledMessageEmail({
          to: contact.email,
          contactName: contact.name,
          message: contact.message,
        });

        await Contact.findByIdAndUpdate(
          contact._id,
          {
            $set: {
              status: 'sent',
              sentAt: new Date(),
              lastError: null,
            },
          },
          { returnDocument: 'after' }
        );

        sendResults.push({
          contactId: contact._id,
          contactName: contact.name,
          email: contact.email,
          success: true,
        });
      } catch (error) {
        await Contact.findByIdAndUpdate(
          contact._id,
          {
            $set: {
              status: 'failed',
              lastError: error.message,
            },
          },
          { returnDocument: 'after' }
        );

        sendResults.push({
          contactId: contact._id,
          contactName: contact.name,
          email: contact.email,
          success: false,
          error: error.message,
        });
      }
    }

    const successCount = sendResults.filter((r) => r.success).length;
    const failureCount = sendResults.filter((r) => !r.success).length;

    return res.status(200).json({
      success: true,
      message: `Messages sent to ${successCount} contact(s)`,
      successCount,
      failureCount,
      sendResults,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Unable to send messages',
      error: error.message,
    });
  }
};
