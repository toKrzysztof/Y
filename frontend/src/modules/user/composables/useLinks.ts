import { ref } from 'vue';
import axios from 'axios';
import DOMPurify from 'dompurify';

export const useLinks = (maxLinks: number) => {
  const links = ref<string[]>([]);
  const newLink = ref<string>('');
  const linkError = ref<string>('');

  const sanitizeInput = (input: string): string => {
    return DOMPurify.sanitize(input);
  };

  const isValidUrl = (url: string): boolean => {
    try {
      const parsedUrl = new URL(url);
      return ['http:', 'https:'].includes(parsedUrl.protocol);
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const validateLink = async (url: string): Promise<boolean> => {
    try {
      const headResponse = await axios.head(url);
      return headResponse.status === 200;
    } catch (headError) {
      if (axios.isAxiosError(headError) && headError.response?.status === 405) {
        try {
          const getResponse = await axios.get(url);
          return getResponse.status === 200;
        } catch (getError) {
          console.log(getError);
          return false;
        }
      }
      return false;
    }
  };

  const addLink = async () => {
    if (!newLink.value.trim() || links.value.length >= maxLinks) return;

    if (!isValidUrl(newLink.value.trim())) {
      linkError.value = 'Please enter a valid HTTP/HTTPS URL.';
      return;
    }

    const sanitizedLink = sanitizeInput(newLink.value.trim());

    const isValid = await validateLink(sanitizedLink);
    if (!isValid) {
      linkError.value = 'The link is invalid or unreachable.';
      return;
    }

    links.value.push(sanitizedLink);
    newLink.value = '';
    linkError.value = '';
  };

  const removeLink = (index: number) => {
    links.value.splice(index, 1);
  };

  return {
    links,
    newLink,
    linkError,
    addLink,
    removeLink
  };
};
