import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface Candidate {
    id: string;
    name: string;
    vision: string;
    mission: string;
    // Assuming image_url might be part of the candidate data from the backend
    image_url?: string; 
}

interface VotingSessionState {
    votingToken: string | null;
    candidates: Candidate[];
    error: string | null;
    isLoading: boolean;
    setSession: (token: string, candidates: Candidate[]) => void;
    clearSession: () => void;
    setError: (error: string | null) => void;
    setLoading: (loading: boolean) => void;
}

export const useVotingStore = create<VotingSessionState>()(
    persist(
        (set) => ({
            votingToken: null,
            candidates: [],
            error: null,
            isLoading: false,
            setSession: (token, candidates) =>
                set({ votingToken: token, candidates, isLoading: false, error: null }),
            clearSession: () =>
                set({ votingToken: null, candidates: [], error: null, isLoading: false }),
            setError: (error) => set({ error, isLoading: false }),
            setLoading: (loading) => set({ isLoading: loading }),
        }),
        {
            name: 'voting-session-storage',
            storage: createJSONStorage(() => sessionStorage),
        }
    )
);