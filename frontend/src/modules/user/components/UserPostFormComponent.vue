<script setup lang="ts">
import { useContent } from '../composables/useContent';
import { useFormSubmission } from '../composables/useFormSubmission';

interface UserPostFormProps {
  contentPlaceholder: string;
  submitButtonLabels: { regularLabel: string; loadingLabel: string };
  parentId?: string;
}
const maxChars = 280;
const props = defineProps<UserPostFormProps>();
console.log('TEST', props, props.parentId || null);

const { content, charsLeft } = useContent(maxChars);
const { isSubmitting, submit } = useFormSubmission(content, props.parentId || null);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
</script>

<template>
  <article class="post-form-panel">
    <form @submit="submit">
      <div class="textarea-container">
        <textarea
          v-model="content"
          name="content"
          :placeholder="contentPlaceholder"
          required
          maxlength="280"
          class="post-content"
          oninput='this.style.height = "";this.style.height = this.scrollHeight + "px"'
        ></textarea>
        <span class="char-counter" :class="{ 'error-message': charsLeft <= 20 }">
          {{ charsLeft }} characters left
        </span>
      </div>

      <!-- <div class="flex">
        <input
          type="text"
          v-model="newLink"
          placeholder="Add link"
          :disabled="links.length >= maxLinks"
        />
        <button
          type="button"
          @click="addLink"
          class="button-small add-link"
          :disabled="links.length >= maxLinks || !newLink.trim()"
        >
          Add Link
        </button>
      </div>

      <div v-if="linkError" class="error-message">
        {{ linkError }}
      </div>

      <ul v-if="links.length > 0">
        <li v-for="(link, index) in links" :key="index">
          <a
            :href="link"
            class="link-normal"
            target="_blank"
            rel="noopener noreferrer"
            >{{ link }}</a
          >
          <button type="button" @click="removeLink(index)" class="button-small">
            x
          </button>
        </li>
      </ul> -->

      <div class="button-box">
        <button
          type="submit"
          :disabled="isSubmitting || !content.trim()"
          class="button-secondary"
        >
          {{
            isSubmitting
              ? props.submitButtonLabels.loadingLabel
              : props.submitButtonLabels.regularLabel
          }}
        </button>
      </div>
    </form>
  </article>
</template>

<style lang="scss" scoped>
@use '@/assets/scss/variables' as *;
.post-form-panel {
  border-right: 0.0625rem solid $border-grey;
  box-sizing: border-box;
  max-width: 38rem;
  padding: 1rem;
  width: 100%;

  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
  }

  .textarea-container {
    position: relative;
    padding-bottom: 1rem;
  }

  textarea {
    box-sizing: border-box;
    border: 0;
    height: 3rem;
    resize: none;
    padding: 0 0.5rem 0.5rem 0.5rem;
    width: 100%;

    &:focus {
      outline: none;
      box-shadow: 0 0.0625rem 0 0 $border-grey;
    }
  }

  .char-counter {
    position: absolute;
    right: 0;
    bottom: 0;
    font-size: 0.875rem;
    color: #dddddd;
  }

  .char-warning {
    color: #ff2d2d;
  }

  input {
    width: 100%;
    height: 1.5rem;

    &:disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }
  }

  .flex {
    display: flex;
    gap: 0.5rem;
    align-items: flex-end;
  }

  ul {
    list-style-type: none;
    margin: 0;
    padding: 0;

    li {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }
  }

  .error-message {
    color: #ff0000;
    font-size: 0.875rem;
    margin-top: -0.5rem;
  }
}

.button-box {
  display: flex;
  justify-content: flex-end;
}

.add-link {
  height: 1.875rem;
}

.post-content::placeholder {
  font-size: 1.375rem;
}

.link-normal {
  color: #1a73e8;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
}
</style>
