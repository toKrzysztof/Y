import { ref, type Ref } from 'vue';
import axios from 'axios';
import { API_URL } from '@/config/env';

export const useFormSubmission = (
  content: Ref<string>,
  links: Ref<string[]>,
  parentId: string | null
) => {
  const isSubmitting = ref<boolean>(false);

  const submit = async (event: Event) => {
    event.preventDefault();
    if (isSubmitting.value) return;

    isSubmitting.value = true;

    try {
      await axios.post(`${API_URL}/user/post`, {
        links: links.value,
        content: content.value,
        parentId: parentId ? atob(parentId) : null
      });

      content.value = '';
      links.value = [];
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      isSubmitting.value = false;
    }
  };

  return {
    isSubmitting,
    submit
  };
};
