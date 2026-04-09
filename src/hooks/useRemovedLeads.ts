import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "@/lib/toast";
import { useNotificationStore } from "@/store/notificationStore";
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
  const addNotification = useNotificationStore.getState().addNotification;

  const restoreLead = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/leads/removed/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["removedLeads"] });
      toast.success(
        "Lead allowed again",
        "The lead will appear in future generation results again.",
      );
      addNotification({
        type: "lead-removed",
        title: "Lead allowed again",
        description: "The lead will appear in future generation results again.",
      });
    },
    onError: (error) => {
      toast.error(
        "Failed to allow lead again",
        error,
        "The removed lead could not be restored.",
      );
    },
  });

  const restoreManyLeads = useMutation({
    mutationFn: async (ids: string[]) => {
      await Promise.all(ids.map((id) => api.delete(`/leads/removed/${id}`)));
      return ids;
    },
    onSuccess: (ids) => {
      queryClient.invalidateQueries({ queryKey: ["removedLeads"] });
      toast.success(
        "Leads allowed again",
        `${ids.length} removed lead${ids.length === 1 ? "" : "s"} restored successfully.`,
      );
      addNotification({
        type: "lead-removed",
        title: "Leads allowed again",
        description: `${ids.length} removed lead${ids.length === 1 ? "" : "s"} restored successfully.`,
      });
    },
    onError: (error) => {
      toast.error(
        "Failed to allow leads again",
        error,
        "The selected removed leads could not be restored.",
      );
    },
  });

  return { restoreLead, restoreManyLeads };
};
