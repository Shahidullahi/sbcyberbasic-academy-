import { collection, doc, getDocs, getDoc, setDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../config/firebase';
import { Course } from '../types';
import { COURSES_DATA } from '../data/coursesData';

export async function fetchAllCourses(): Promise<Course[]> {
  const coursesCol = collection(db, 'courses');
  try {
    const snap = await getDocs(coursesCol);
    if (!snap.empty) {
      return snap.docs.map(d => d.data() as Course);
    }
    
    // If Firestore collection is empty, seed with the 7 standardized courses
    await seedDefaultCourses();
    return COURSES_DATA;
  } catch (err) {
    console.warn('Could not query Firestore courses collection directly, falling back to local registry:', err);
    return COURSES_DATA;
  }
}

export async function fetchCourseById(courseId: string): Promise<Course | null> {
  const courseDoc = doc(db, 'courses', courseId);
  try {
    const snap = await getDoc(courseDoc);
    if (snap.exists()) {
      return snap.data() as Course;
    }
    return COURSES_DATA.find(c => c.id === courseId) || null;
  } catch (err) {
    return COURSES_DATA.find(c => c.id === courseId) || null;
  }
}

export async function seedDefaultCourses(): Promise<void> {
  try {
    for (const course of COURSES_DATA) {
      const courseDoc = doc(db, 'courses', course.id);
      await setDoc(courseDoc, course);
    }
    console.info('Successfully synced 7 standard cybersecurity courses to Cloud Firestore.');
  } catch (err) {
    console.warn('Seeding note:', err);
  }
}
