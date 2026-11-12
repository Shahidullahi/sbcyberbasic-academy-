import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  signOut, 
  sendPasswordResetEmail, 
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc 
} from 'firebase/firestore';
import { auth, db, googleProvider, handleFirestoreError, OperationType } from '../config/firebase';

export interface UserProfileData {
  uid: string;
  email: string;
  displayName: string;
  role: 'student' | 'instructor' | 'admin';
  bio?: string;
  organization?: string;
  createdAt: string;
  lastLoginAt: string;
  enrolledCourseIds: string[];
}

export async function registerStudent(
  email: string, 
  password: string, 
  displayName: string, 
  role: 'student' | 'instructor' | 'admin' = 'student'
): Promise<UserProfileData> {
  // 1. Create user in Firebase Authentication
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // 2. Set Firebase Auth displayName
  await updateProfile(user, { displayName });

  // 3. Initialize Firestore profile document with NO fake completion records
  const now = new Date().toISOString();
  const profile: UserProfileData = {
    uid: user.uid,
    email: user.email || email,
    displayName: displayName || email.split('@')[0],
    role,
    bio: 'Cybersecurity candidate at SBCyberBasics Academy.',
    organization: 'Independent Candidate',
    createdAt: now,
    lastLoginAt: now,
    enrolledCourseIds: [] // Clean starting state
  };

  const userDocRef = doc(db, 'users', user.uid);
  try {
    await setDoc(userDocRef, profile);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}`);
  }

  return profile;
}

export async function loginStudent(email: string, password: string): Promise<UserProfileData> {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Retrieve or create Firestore profile
  let profile = await fetchUserProfile(user.uid);
  if (!profile) {
    const now = new Date().toISOString();
    profile = {
      uid: user.uid,
      email: user.email || email,
      displayName: user.displayName || email.split('@')[0],
      role: 'student',
      bio: 'Cybersecurity candidate at SBCyberBasics Academy.',
      organization: 'Independent Candidate',
      createdAt: now,
      lastLoginAt: now,
      enrolledCourseIds: []
    };
    try {
      await setDoc(doc(db, 'users', user.uid), profile);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}`);
    }
  } else {
    // Update lastLoginAt
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        lastLoginAt: new Date().toISOString()
      });
    } catch (e) {
      // Ignored
    }
  }

  return profile;
}

export async function loginWithGoogle(): Promise<UserProfileData> {
  const userCredential = await signInWithPopup(auth, googleProvider);
  const user = userCredential.user;

  let profile = await fetchUserProfile(user.uid);
  const now = new Date().toISOString();

  if (!profile) {
    profile = {
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName || 'Candidate',
      role: 'student',
      bio: 'Cybersecurity candidate at SBCyberBasics Academy.',
      organization: 'Google Authenticated',
      createdAt: now,
      lastLoginAt: now,
      enrolledCourseIds: []
    };
    try {
      await setDoc(doc(db, 'users', user.uid), profile);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}`);
    }
  } else {
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        lastLoginAt: now
      });
    } catch (e) {
      // Ignored
    }
  }

  return profile;
}

export async function logoutStudent(): Promise<void> {
  await signOut(auth);
}

export async function resetPassword(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email);
}

export async function fetchUserProfile(uid: string): Promise<UserProfileData | null> {
  const userDocRef = doc(db, 'users', uid);
  try {
    const snap = await getDoc(userDocRef);
    if (snap.exists()) {
      return snap.data() as UserProfileData;
    }
    return null;
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, `users/${uid}`);
  }
}

export async function updateStudentProfile(
  uid: string, 
  data: Partial<Pick<UserProfileData, 'displayName' | 'bio' | 'organization'>>
): Promise<void> {
  const userDocRef = doc(db, 'users', uid);
  try {
    await updateDoc(userDocRef, data);
    if (auth.currentUser && data.displayName) {
      await updateProfile(auth.currentUser, { displayName: data.displayName });
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `users/${uid}`);
  }
}
