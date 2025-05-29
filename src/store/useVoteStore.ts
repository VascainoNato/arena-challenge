import { create } from 'zustand'

type VoteMap = Record<string, number>

interface VoteStore {
  voteMap: VoteMap
  justVoted: Record<string, boolean>
  updateVotes: (votes: VoteMap) => void
  resetJustVoted: () => void
}

export const useVoteStore = create<VoteStore>((set) => ({
  voteMap: {},
  justVoted: {},
    updateVotes: (newVotes) => {
    set((state) => {
        const updatedJustVoted: Record<string, boolean> = {};

        for (const id in newVotes) {
        const old = state.voteMap[id];
        const novo = newVotes[id];

        if (old !== undefined && novo !== old) {
            updatedJustVoted[id] = true;
        }
        }

        // 🔁 Remove a cor laranja após 5 minutos
        if (Object.keys(updatedJustVoted).length) {
        setTimeout(() => {
            set((s) => {
            const clean = { ...s.justVoted };
            for (const id in updatedJustVoted) delete clean[id];
            return { justVoted: clean };
            });
        }, 5 * 60 * 1000);
        }

        return {
        voteMap: { ...state.voteMap, ...newVotes },
        justVoted: { ...state.justVoted, ...updatedJustVoted },
        };
    });
    },

  resetJustVoted: () => set({ justVoted: {} }),
}))
