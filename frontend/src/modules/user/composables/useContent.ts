import { ref, computed } from 'vue';

export const useContent = (maxChars: number) => {
  const content = ref<string>('');
  const charsLeft = computed(() => maxChars - content.value.length);

  return {
    content,
    charsLeft
  };
};
