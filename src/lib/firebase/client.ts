import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: 'AIzaSyDJoWgZAVk1Nx9fiHxpuX5ZL9oMUuYfvto',
  authDomain: 'var-dump.firebaseapp.com',
  projectId: 'var-dump',
  storageBucket: 'var-dump.appspot.com',
  messagingSenderId: '590718409319',
  appId: '1:590718409319:web:7d29f0fccfc523ad05d2c2',
  measurementId: 'G-0LEP9XZTKW',
};

export const app = initializeApp(firebaseConfig);
