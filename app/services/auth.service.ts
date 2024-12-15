import { firebase } from '@nativescript/firebase-core';
import '@nativescript/firebase-auth';
import { User } from '../models/user.model';
import { Observable } from '@nativescript/core';

export class AuthService extends Observable {
    private static instance: AuthService;
    private currentUser: User | null = null;

    static getInstance(): AuthService {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    }

    async signIn(email: string, password: string): Promise<User> {
        try {
            const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
            this.currentUser = new User({
                id: userCredential.user.uid,
                email: userCredential.user.email,
                name: userCredential.user.displayName
            });
            return this.currentUser;
        } catch (error) {
            console.error('Sign in error:', error);
            throw error;
        }
    }

    async signUp(email: string, password: string, name: string): Promise<User> {
        try {
            const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
            await userCredential.user.updateProfile({ displayName: name });
            
            this.currentUser = new User({
                id: userCredential.user.uid,
                email,
                name
            });
            return this.currentUser;
        } catch (error) {
            console.error('Sign up error:', error);
            throw error;
        }
    }

    async signOut(): Promise<void> {
        try {
            await firebase.auth().signOut();
            this.currentUser = null;
        } catch (error) {
            console.error('Sign out error:', error);
            throw error;
        }
    }

    getCurrentUser(): User | null {
        return this.currentUser;
    }
}