import { atom } from 'jotai';
// lib/userAtom.ts
import { atomWithStorage } from 'jotai/utils';

export const userAtom = atomWithStorage('session_user', null);

