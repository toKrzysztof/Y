import { ref, type Component, type Ref } from 'vue';

export function useModal() {
  const isModalOpen = ref(false);
  const modalTitle = ref('');
  const modalContent: Ref<Component | null> = ref(null);

  function openModal(title: string, content: Component): void {
    modalTitle.value = title;
    modalContent.value = content;
    isModalOpen.value = true;
  }

  function closeModal(): void {
    isModalOpen.value = false;
    modalTitle.value = '';
    modalContent.value = null;
  }

  return {
    isModalOpen,
    modalTitle,
    modalContent,
    openModal,
    closeModal
  };
}
