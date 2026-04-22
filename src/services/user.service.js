/**
 * User Service
 * Operações do usuário atual e operações administrativas de usuários.
 */
import { AuthState } from '../state/AuthState.js';
import { firebaseService } from './api/firebase.service.js';
import { db } from '../config/firebase.js';
import { collection, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';

// ─── Usuário atual ────────────────────────────────────────────────────────────

export async function saveUserData(userData) {
  try {
    const state = AuthState.getState();
    if (!state.user) return { success: false, error: 'Usuário não autenticado' };
    await firebaseService.set(`users/${state.user.uid}`, userData);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function getUserData() {
  try {
    const state = AuthState.getState();
    if (!state.user) return { success: false, error: 'Usuário não autenticado' };
    const data = await firebaseService.get(`users/${state.user.uid}`);
    return { success: true, data: data || {} };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function updateUserData(updates) {
  try {
    const state = AuthState.getState();
    if (!state.user) return { success: false, error: 'Usuário não autenticado' };
    await firebaseService.update(`users/${state.user.uid}`, updates);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function getUserRole(uid) {
  try {
    if (!uid) return 'user';
    const data = await firebaseService.get(`users/${uid}`);
    return data?.role || 'user';
  } catch (error) {
    console.warn('Erro ao obter role do usuário:', error);
    return 'user';
  }
}

// ─── Operações administrativas ────────────────────────────────────────────────

export async function getAllUsers() {
  try {
    const snapshot = await getDocs(collection(db, 'users'));
    const users = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    return users.sort((a, b) => {
      const toDate = v => v?.toDate ? v.toDate() : (v instanceof Date ? v : new Date(0));
      return toDate(b.createdAt) - toDate(a.createdAt);
    });
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    throw error;
  }
}

export async function getUser(uid) {
  try {
    if (!uid) throw new Error('UID do usuário é obrigatório');
    const snap = await getDoc(doc(db, 'users', uid));
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    throw error;
  }
}

export async function updateUserStatus(uid, status) {
  try {
    if (!uid) throw new Error('UID do usuário é obrigatório');
    if (status !== 'active' && status !== 'banned') {
      throw new Error('Status deve ser "active" ou "banned"');
    }
    await updateDoc(doc(db, 'users', uid), { status, updatedAt: new Date() });
  } catch (error) {
    console.error('Erro ao atualizar status do usuário:', error);
    throw error;
  }
}

export default {
  saveUserData,
  getUserData,
  updateUserData,
  getUserRole,
  getAllUsers,
  getUser,
  updateUserStatus
};
