import { firebase } from '@nativescript/firebase-core';
import '@nativescript/firebase-firestore';

export class DatabaseService {
    private static instance: DatabaseService;
    private db = firebase.firestore();

    static getInstance(): DatabaseService {
        if (!DatabaseService.instance) {
            DatabaseService.instance = new DatabaseService();
        }
        return DatabaseService.instance;
    }

    async addDocument(collection: string, data: any): Promise<string> {
        try {
            const docRef = await this.db.collection(collection).add(data);
            return docRef.id;
        } catch (error) {
            console.error(`Error adding document to ${collection}:`, error);
            throw error;
        }
    }

    async getDocument(collection: string, id: string): Promise<any> {
        try {
            const doc = await this.db.collection(collection).doc(id).get();
            return doc.data();
        } catch (error) {
            console.error(`Error getting document from ${collection}:`, error);
            throw error;
        }
    }

    async getDocuments(collection: string, field: string, value: any): Promise<any[]> {
        try {
            const snapshot = await this.db
                .collection(collection)
                .where(field, '==', value)
                .get();
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error(`Error getting documents from ${collection}:`, error);
            throw error;
        }
    }

    async updateDocument(collection: string, id: string, data: any): Promise<void> {
        try {
            await this.db.collection(collection).doc(id).update(data);
        } catch (error) {
            console.error(`Error updating document in ${collection}:`, error);
            throw error;
        }
    }

    async deleteDocument(collection: string, id: string): Promise<void> {
        try {
            await this.db.collection(collection).doc(id).delete();
        } catch (error) {
            console.error(`Error deleting document from ${collection}:`, error);
            throw error;
        }
    }
}