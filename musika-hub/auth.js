// auth.js
// Reusable Firebase authentication and Firestore helper functions for Musika Hub.
// Uses the Firebase modular SDK with session persistence and Firestore collections.

import { auth, db } from './firebase-config.js';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence
} from 'https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js';

import {
  doc,
  setDoc,
  serverTimestamp,
  getDoc,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  updateDoc
} from 'https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js';

const LOCAL_KEY = 'musika-hub-user';

let resolveAuthReady;
const authReady = new Promise((resolve) => {
  resolveAuthReady = resolve;
});

// Ensure session persistence so users remain logged in across refreshes.
setPersistence(auth, browserLocalPersistence).catch(() => {
  // If local persistence fails, allow default browser persistence.
});

// Keep localStorage in sync with the authenticated user profile stored in Firestore.
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    localStorage.removeItem(LOCAL_KEY);
    resolveAuthReady(user);
    return;
  }

  try {
    const profileSnap = await getDoc(doc(db, 'users', user.uid));
    if (profileSnap.exists()) {
      const data = profileSnap.data();
      const lightweight = {
        name: data.companyName || data.name || '',
        email: data.email || user.email,
        role: data.role || 'Buyer',
        companyRegNumber: data.companyRegNumber || '',
        uid: user.uid
      };
      localStorage.setItem(LOCAL_KEY, JSON.stringify(lightweight));
    } else {
      localStorage.removeItem(LOCAL_KEY);
    }
  } catch (err) {
    console.error('Failed to load user profile after auth state change', err);
  } finally {
    resolveAuthReady(user);
  }
});

export function waitForAuthReady() {
  return authReady;
}

// Register a new user with email/password and create a Firestore profile.
export async function registerUser({ companyName, email, password, role, companyRegNumber }) {
  if (!companyName || !email || !password) {
    throw new Error('Missing required registration fields.');
  }

  const cred = await createUserWithEmailAndPassword(auth, email, password);
  const uid = cred.user.uid;

  const profile = {
    companyName,
    email,
    role,
    companyRegNumber: companyRegNumber || '',
    uid,
    createdAt: serverTimestamp()
  };

  await setDoc(doc(db, 'users', uid), profile);
  return { uid, ...profile };
}

// Sign in and return the Firestore profile (also saved to localStorage via onAuthStateChanged).
export async function signInUser(email, password) {
  if (!email || !password) {
    throw new Error('Email and password are required.');
  }

  const cred = await signInWithEmailAndPassword(auth, email, password);
  const uid = cred.user.uid;
  const snap = await getDoc(doc(db, 'users', uid));

  if (!snap.exists()) {
    throw new Error('User profile not found. Contact support.');
  }

  const data = snap.data();
  const lightweight = {
    name: data.companyName || data.name || '',
    email: data.email || email,
    role: data.role || 'Buyer',
    companyRegNumber: data.companyRegNumber || '',
    uid
  };

  localStorage.setItem(LOCAL_KEY, JSON.stringify(lightweight));
  return lightweight;
}

export async function signOutUser() {
  await firebaseSignOut(auth);
  localStorage.removeItem(LOCAL_KEY);
}

export async function getUserProfile(uid) {
  if (!uid) return null;
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? snap.data() : null;
}

export function getLocalProfile() {
  return JSON.parse(localStorage.getItem(LOCAL_KEY) || 'null');
}

// roleOrArray may be a single role string or an array of allowed roles.
export async function requireRole(roleOrArray) {
  const allowed = Array.isArray(roleOrArray) ? roleOrArray : [roleOrArray];
  await waitForAuthReady();
  const stored = getLocalProfile();

  if (!stored || !stored.role || !allowed.includes(stored.role)) {
    window.location.href = 'signin.html';
    return null;
  }

  return stored;
}

// Firestore helpers for collection-based features.
export async function createProductListing({ name, type, category, price, description, supplierId, supplierName }) {
  if (!name || !type || !category || !price || !supplierId) {
    throw new Error('Missing listing information.');
  }

  const docRef = await addDoc(collection(db, 'products'), {
    name,
    type,
    category,
    price,
    description,
    supplierId,
    supplierName,
    status: 'pending',
    createdAt: serverTimestamp()
  });

  return { id: docRef.id, name, type, category, price, description, supplierId, supplierName, status: 'pending' };
}

export async function getSupplierProducts(supplierId) {
  if (!supplierId) return [];
  const q = query(
    collection(db, 'products'),
    where('supplierId', '==', supplierId),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
}

export async function getApprovedProducts() {
  const q = query(collection(db, 'products'), where('status', '==', 'approved'), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
}

export async function createProcurementRequest({ title, description, category, requestedBy, requestedByEmail, userId }) {
  if (!title || !description || !category || !requestedBy || !userId) {
    throw new Error('Missing procurement request details.');
  }

  const docRef = await addDoc(collection(db, 'procurementRequests'), {
    title,
    description,
    category,
    requestedBy,
    requestedByEmail: requestedByEmail || '',
    userId,
    status: 'pending',
    createdAt: serverTimestamp()
  });

  return { id: docRef.id, title, description, category, requestedBy, requestedByEmail, userId, status: 'pending' };
}

export async function getProcurementRequests(userId) {
  let q;
  if (userId) {
    q = query(collection(db, 'procurementRequests'), where('userId', '==', userId), orderBy('createdAt', 'desc'));
  } else {
    q = query(collection(db, 'procurementRequests'), orderBy('createdAt', 'desc'));
  }
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
}

export async function createQuotationRequest({ companyName, items, notes, requestedBy, requestedByEmail, userId }) {
  if (!companyName || !items?.length || !requestedBy || !userId) {
    throw new Error('Missing quotation request information.');
  }

  const docRef = await addDoc(collection(db, 'quotations'), {
    companyName,
    items,
    notes: notes || '',
    requestedBy,
    requestedByEmail: requestedByEmail || '',
    userId,
    status: 'pending',
    createdAt: serverTimestamp()
  });

  return { id: docRef.id, companyName, items, notes, requestedBy, requestedByEmail, userId, status: 'pending' };
}

export async function getQuotationRequests(userId) {
  let q;
  if (userId) {
    q = query(collection(db, 'quotations'), where('userId', '==', userId), orderBy('createdAt', 'desc'));
  } else {
    q = query(collection(db, 'quotations'), orderBy('createdAt', 'desc'));
  }
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
}

export async function createJobListing({ title, location, company, tags, postedBy, userId }) {
  if (!title || !location || !company || !postedBy || !userId) {
    throw new Error('Missing job posting details.');
  }

  const docRef = await addDoc(collection(db, 'jobs'), {
    title,
    location,
    company,
    tags: tags || '',
    postedBy,
    userId,
    status: 'pending',
    createdAt: serverTimestamp()
  });

  return { id: docRef.id, title, location, company, tags, postedBy, userId, status: 'pending' };
}

export async function getJobListings() {
  const q = query(collection(db, 'jobs'), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
}

export async function approveDocument(collectionName, docId, approved, reviewerId) {
  if (!collectionName || !docId || typeof approved !== 'boolean') {
    throw new Error('Missing approval parameters.');
  }

  const docRef = doc(db, collectionName, docId);
  await updateDoc(docRef, {
    status: approved ? 'approved' : 'rejected',
    reviewedBy: reviewerId || null,
    reviewedAt: serverTimestamp()
  });
}

export async function getPendingApprovals() {
  const pendingLists = {};

  const collections = ['products', 'procurementRequests', 'quotations', 'jobs'];
  for (const collectionName of collections) {
    const q = query(collection(db, collectionName), where('status', '==', 'pending'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    pendingLists[collectionName] = snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
  }

  return pendingLists;
}
