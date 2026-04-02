import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import api from "@/lib/api";
import type { RemovedLead } from "@/lib/types";

interface RemovedLeadsParams {
  search?: string;
  sort?: string;
}

export const useRemovedLeads = (params: RemovedLeadsParams = {}) => {
  return useQuery({
    queryKey: ["removedLeads", params],
    queryFn: async () => {
      const { data } = await api.get<RemovedLead[]>("/leads/removed", {
        params,
      });
      return data;
    },
    placeholderData: keepPreviousData,
  });
};

export const useRemovedLeadActions = () => {
  const queryClient = useQueryClient();

  const restoreLead = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/leads/removed/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["removedLeads"] });
    },
  });

  const restoreManyLeads = useMutation({
    mutationFn: async (ids: string[]) => {
      await Promise.all(ids.map((id) => api.delete(`/leads/removed/${id}`)));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["removedLeads"] });
    },
  });

  return { restoreLead, restoreManyLeads };
};
