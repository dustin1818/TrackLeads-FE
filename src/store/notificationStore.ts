import { create } from "zustand";

export type NotificationType =
  | "lead-saved"
  | "lead-removed"
  | "lead-deleted"
  | "todo-created"
  | "todo-completed"
  | "todo-deleted"
  | "calendar-created"
  | "calendar-deleted"
  | "profile-updated";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  read: boolean;
  createdAt: number;
}

interface NotificationState {
  notifications: Notification[];
  addNotification: (
    n: Pick<Notification, "type" | "title" | "description">,
  ) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  clearAll: () => void;
}

const MAX_NOTIFICATIONS = 50;

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: JSON.parse(localStorage.getItem("notifications") || "[]"),
  addNotification: (n) =>
    set((state) => {
      const notification: Notification = {
        ...n,
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        read: false,
        createdAt: Date.now(),
      };
      const updated = [notification, ...state.notifications].slice(
        0,
        MAX_NOTIFICATIONS,
      );
      localStorage.setItem("notifications", JSON.stringify(updated));
      return { notifications: updated };
    }),
  markRead: (id) =>
    set((state) => {
      const updated = state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n,
      );
      localStorage.setItem("notifications", JSON.stringify(updated));
      return { notifications: updated };
    }),
  markAllRead: () =>
    set((state) => {
      const updated = state.notifications.map((n) => ({ ...n, read: true }));
      localStorage.setItem("notifications", JSON.stringify(updated));
      return { notifications: updated };
    }),
  clearAll: () => {
    localStorage.setItem("notifications", "[]");
    return set({ notifications: [] });
  },
}));
