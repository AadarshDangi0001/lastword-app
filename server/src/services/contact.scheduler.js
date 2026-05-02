import Contact from '../models/contact.model.js';
import { sendScheduledMessageEmail } from '../utils/mailer.js';

let schedulerHandle = null;
let schedulerRunning = false;

const claimContactForSending = async (contactId) => {
  return Contact.findOneAndUpdate(
    { _id: contactId, status: 'pending' },
    { $set: { status: 'sending', lastError: null } },
    { returnDocument: 'after' }
  );
};

const finalizeContactStatus = async (contactId, update) => {
  return Contact.findByIdAndUpdate(contactId, { $set: update }, { returnDocument: 'after' });
};

const processDueContacts = async () => {
  if (schedulerRunning) {
    return;
  }

  schedulerRunning = true;

  try {
    const pendingContacts = await Contact.find({
      status: 'pending',
    }).limit(25);

    for (const contact of pendingContacts) {
      const claimedContact = await claimContactForSending(contact._id);
      if (!claimedContact) {
        continue;
      }

      try {
        await sendScheduledMessageEmail({
          to: claimedContact.email,
          contactName: claimedContact.name,
          message: claimedContact.message,
        });

        await finalizeContactStatus(claimedContact._id, {
          status: 'sent',
          sentAt: new Date(),
          lastError: null,
        });
      } catch (error) {
        await finalizeContactStatus(claimedContact._id, {
          status: 'failed',
          lastError: error.message,
        });
      }
    }
  } finally {
    schedulerRunning = false;
  }
};

export const startContactScheduler = (intervalMs = 60 * 1000) => {
  if (schedulerHandle) {
    return schedulerHandle;
  }

  processDueContacts().catch((error) => {
    console.error('Contact scheduler initial run failed:', error.message);
  });

  schedulerHandle = setInterval(() => {
    processDueContacts().catch((error) => {
      console.error('Contact scheduler run failed:', error.message);
    });
  }, intervalMs);

  return schedulerHandle;
};

export const stopContactScheduler = () => {
  if (!schedulerHandle) {
    return;
  }

  clearInterval(schedulerHandle);
  schedulerHandle = null;
};
