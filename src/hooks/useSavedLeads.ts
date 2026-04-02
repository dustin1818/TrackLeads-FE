import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import api from "@/lib/api";
import type { SavedLead } from "@/lib/types";

interface LeadsParams {
  status?: string;
  search?: string;
  sort?: string;
}

export const useSavedLeads = (params: LeadsParams = {}) => {
  return useQuery({
    queryKey: ["savedLeads", params],
    queryFn: async () => {
      const { data } = await api.get<SavedLead[]>("/leads", { params });
      return data;
    },
    placeholderData: keepPreviousData,
  });
};

export const useLeadActions = () => {
  const queryClient = useQueryClient();

  const updateLead = useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<SavedLead>;
    }) => {
      const { data } = await api.put<SavedLead>(`/leads/${id}`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["savedLeads"] });
    },
  });

  const deleteLead = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/leads/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["savedLeads"] });
    },
  });

  const deleteManyLeads = useMutation({
    mutationFn: async (ids: string[]) => {
      await Promise.all(ids.map((id) => api.delete(`/leads/${id}`)));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["savedLeads"] });
    },
  });

  return { updateLead, deleteLead, deleteManyLeads };
};
