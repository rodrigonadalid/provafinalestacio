import Dexie, { type Table } from 'dexie';

export interface UserProfile {
  id?: number;
  name: string;
  email: string;
  bio: string;
  avatarColor: string;
}

class AppDatabase extends Dexie {
  profiles!: Table<UserProfile, number>;

  constructor() {
    super('UserProfileDatabase');
    
    // Define schema versions
    this.version(1).stores({
      profiles: '++id, name, email'
    });
  }
}

// Singleton pattern prevents "DatabaseClosedError" from re-instantiations
export const db = new AppDatabase();