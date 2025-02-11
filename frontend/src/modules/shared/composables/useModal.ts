import { ref, type Component, type Ref } from 'vue';

export function useModal() {
  const isModalOpen = ref(false);
  const modalTitle = ref('');
  const modalContent: Ref<Component | null> = ref(null);
  const modalProps: Ref<unknown> = ref(null);

  let resolvePromise: ((value: unknown) => void) | null = null;

  function openModal(
    title: string,
    content: Component,
    props: unknown = null
  ): Promise<unknown> {
    return new Promise((resolve) => {
      resolvePromise = resolve;
      modalTitle.value = title;
      modalContent.value = content;
      isModalOpen.value = true;
      modalProps.value = props;
    });
  }

  function closeModal(result?: unknown): void {
    if (resolvePromise) {
      resolvePromise(result);
      resolvePromise = null;
    }

    isModalOpen.value = false;
    modalTitle.value = '';
    modalContent.value = null;
    modalProps.value = null;
  }

  return {
    isModalOpen,
    modalTitle,
    modalContent,
    openModal,
    closeModal,
    modalProps
  };
}
