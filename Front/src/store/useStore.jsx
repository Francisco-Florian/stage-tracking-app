import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useStore = create(persist(
    (set) => ({
        candidature: {
            id: '',         
            nom: '',       
            prenom: '',    
            email: '',     
            telephone: '', 
            adresse: '', 
            status: '', 
            date: '', 
            note: '', 
        },
        savedCandidatures: [],

        // Fonction pour sauvegarder une nouvelle candidature
        saveCandidature: (newCandidature) => set((state) => ({
            savedCandidatures: [...state.savedCandidatures, newCandidature]
        })),

        // Fonction pour supprimer une candidature en fonction de son identifiant
        removeCandidature: (id) => set((state) => ({
            savedCandidatures: state.savedCandidatures.filter(candidature => candidature.id !== id)
        })),

        // Fonction pour mettre à jour une candidature existante
        updateCandidature: (updatedCandidature) => set((state) => ({
            savedCandidatures: state.savedCandidatures.map(candidature =>
                candidature.id === updatedCandidature.id ? updatedCandidature : candidature
            )
        }))
    }),
    {
        name: 'candidature',
        getStorage: () => localStorage,
        partialize: (state) => ({ savedCandidatures: state.savedCandidatures })
    }
))