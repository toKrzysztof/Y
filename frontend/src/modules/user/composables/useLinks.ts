import { ref } from 'vue';
import DOMPurify from 'dompurify';

export const useLinks = (maxLinks: number) => {
  const links = ref<string[]>([]);
  const newLink = ref<string>('');
  const linkError = ref<string>('');

  const sanitizeInput = (input: string): string => {
    return DOMPurify.sanitize(input);
  };

  const validateLink = async (url: string): Promise<boolean> => {
    return new Promise((resolve) => {
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = `https://${url}`;
      }

      const img = new Image();

      img.onload = () => {
        resolve(true);
      };

      img.onerror = () => {
        resolve(false);
      };

      img.src = url;
    });
  };

  const addLink = async () => {
    if (!newLink.value.trim() || links.value.length >= maxLinks) return;

    const sanitizedLink = sanitizeInput(newLink.value.trim());

    const isValid = await validateLink(sanitizedLink);
    if (!isValid) {
      linkError.value = 'The link does not point to an image or is unreachable.';
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
