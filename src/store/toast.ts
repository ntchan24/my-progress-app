import { create } from 'zustand';

type ToastState = {
  message: string | null;
  show: (message: string) => void;
};

let hideTimer: ReturnType<typeof setTimeout> | undefined;

// One toast at a time, auto-dismissed after 3s. Rendered by <Toast /> in the root layout.
export const useToastStore = create<ToastState>()((set) => ({
  message: null,
  show: (message) => {
    clearTimeout(hideTimer);
    set({ message });
    hideTimer = setTimeout(() => set({ message: null }), 3000);
  },
}));
