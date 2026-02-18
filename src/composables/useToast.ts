import { useToast as usePrimeToast } from 'primevue/usetoast';
import type { ToastMessageOptions } from 'primevue/toast';

export function useToast() {
  const toast = usePrimeToast();

  const showSuccess = (detail: string, summary: string = 'Éxito', life: number = 3000) => {
    toast.add({
      severity: 'success',
      summary,
      detail,
      life
    });
  };

  const showError = (detail: string, summary: string = 'Error', life: number = 5000) => {
    toast.add({
      severity: 'error',
      summary,
      detail,
      life
    });
  };

  const showInfo = (detail: string, summary: string = 'Información', life: number = 3000) => {
    toast.add({
      severity: 'info',
      summary,
      detail,
      life
    });
  };

  const showWarning = (detail: string, summary: string = 'Advertencia', life: number = 4000) => {
    toast.add({
      severity: 'warn',
      summary,
      detail,
      life
    });
  };

  const showCustom = (options: ToastMessageOptions) => {
    toast.add(options);
  };

  const removeAll = () => {
    toast.removeAllGroups();
  };

  return {
    showSuccess,
    showError,
    showInfo,
    showWarning,
    showCustom,
    removeAll
  };
}
