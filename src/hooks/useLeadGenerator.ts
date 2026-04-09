import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "@/lib/toast";
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
      toast.success(
        "Lead saved",
        `${saved.companyName} was added to your saved leads.`,
      );
    },
    onError: (error) => {
      toast.error("Failed to save lead", error, "The lead could not be saved.");
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
      toast.success(
        "Lead removed",
        `${removed.companyName} was removed from the current results.`,
      );
    },
    onError: (error) => {
      toast.error(
        "Failed to remove lead",
        error,
        "The lead could not be removed.",
      );
    },
  });

  return {
    generate,
    saveLead,
    removeLead,
  };
};
