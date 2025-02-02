import { ref, type Ref } from 'vue';
import axios from 'axios';
import { API_URL } from '@/config/env';
import router from '@/router';

export const useFormSubmission = (content: Ref<string, string>) => {
  const isSubmitting = ref<boolean>(false);

  const submit = async (event: Event) => {
    event.preventDefault();
    if (isSubmitting.value) return;

    isSubmitting.value = true;

    try {
      await axios.post(`${API_URL}/user/post`, {
        content: content.value
      });
      router.push('/user/profile');
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
