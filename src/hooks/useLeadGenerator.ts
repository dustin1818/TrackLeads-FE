import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import type { GeneratedLead, RemovedLead, SavedLead } from "@/lib/types";
import { useLeadStore } from "@/store/leadStore";

export const useLeadGenerator = () => {
  const queryClient = useQueryClient();
  const setGeneratedLeads = useLeadStore((s) => s.setGeneratedLeads);
  const markLeadSaved = useLeadStore((s) => s.markLeadSaved);
  const removeGeneratedLead = useLeadStore((s) => s.removeGeneratedLead);

  const generate = useMutation({
    mutationFn: async (websiteUrl: string) => {
      const { data } = await api.post<{ leads: GeneratedLead[] }>(
        "/leads/generate",
        {
          websiteUrl,
        },
      );
      return data.leads;
    },
    onSuccess: (leads) => {
      setGeneratedLeads(leads);
    },
  });

  const saveLead = useMutation({
    mutationFn: async (lead: Omit<GeneratedLead, "isSaved">) => {
      const { data } = await api.post<SavedLead>("/leads/save", lead);
      return data;
    },
    onSuccess: (saved) => {
      markLeadSaved(saved.email);
      queryClient.invalidateQueries({ queryKey: ["savedLeads"] });
    },
  });

  const removeLead = useMutation({
    mutationFn: async (lead: Omit<GeneratedLead, "isSaved">) => {
      const { data } = await api.post<RemovedLead>("/leads/remove", lead);
      return data;
    },
    onSuccess: (removed) => {
      removeGeneratedLead(removed.email);
      queryClient.invalidateQueries({ queryKey: ["removedLeads"] });
    },
  });

  return {
    generate,
    saveLead,
    removeLead,
  };
};
