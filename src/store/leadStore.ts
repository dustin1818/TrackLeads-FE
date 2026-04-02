import { create } from "zustand";
import type { GeneratedLead } from "@/lib/types";

interface LeadState {
  generatedLeads: GeneratedLead[];
  setGeneratedLeads: (leads: GeneratedLead[]) => void;
  markLeadSaved: (email: string) => void;
  removeGeneratedLead: (email: string) => void;
  clearGeneratedLeads: () => void;
}

export const useLeadStore = create<LeadState>((set) => ({
  generatedLeads: [],
  setGeneratedLeads: (generatedLeads) => set({ generatedLeads }),
  markLeadSaved: (email) =>
    set((state) => ({
      generatedLeads: state.generatedLeads.map((lead) =>
        lead.email.toLowerCase() === email.toLowerCase()
          ? { ...lead, isSaved: true }
          : lead,
      ),
    })),
  removeGeneratedLead: (email) =>
    set((state) => ({
      generatedLeads: state.generatedLeads.filter(
        (lead) => lead.email.toLowerCase() !== email.toLowerCase(),
      ),
    })),
  clearGeneratedLeads: () => set({ generatedLeads: [] }),
}));
