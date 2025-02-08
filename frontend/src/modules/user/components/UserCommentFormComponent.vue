<script setup lang="ts">
import { API_URL } from '@/config/env';
import axios from 'axios';
import { ref } from 'vue';

const props = defineProps<{ parentId: string }>();
const ownUsername = localStorage.getItem('username');
const formSubmitted = ref(false);

const submit = (content: { content: string }) => {
  formSubmitted.value = true;
  axios
    .post(`${API_URL}/user/comment`, {
      content: content.content,
      username: ownUsername,
      parentId: props.parentId
    })
    .then(console.log)
    .catch((e) => {
      console.log(`e: ${e}`);
    });
};
</script>

<template>
  <article>
    <div v-if="!formSubmitted" class="comment-form-panel">
      <h4>Make a comment...</h4>
      <FormKit type="form" #default="disabled" @submit="submit" submit-label="Post">
        <FormKit
          type="text"
          name="content"
          validation="required|length:1,280"
          placeholder="What is happening?!"
        />
      </FormKit>
    </div>
    <div v-show="formSubmitted" class="comment-submitted">
      Comment submitted succesfully!
    </div>
  </article>
</template>
<style lang="scss" scoped>
.comment-form-panel {
  width: 100%;
  max-width: 20rem;
  padding-bottom: 1rem;

  :deep {
    .formkit-form {
      align-items: flex-end;
      display: flex;
      gap: 1rem;
    }

    .formkit-input {
      width: 100%;
      height: 1.5rem;
    }

    .formkit-outer:first-child {
      width: 100%;
    }
  }
}

h4 {
  margin-bottom: 0.5rem;
  margin-top: 0;
}

.comment-submitted {
  font-size: 0.875rem;
  font-weight: 700;
  padding-bottom: 1rem;
}
</style>
