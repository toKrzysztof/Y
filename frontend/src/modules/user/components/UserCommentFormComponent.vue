<script setup lang="ts">
import { API_URL } from '@/config/env';
import axios from 'axios';

interface CommentProps {
  parentId: string;
  username: string;
}

const props = defineProps<{ commentProps: CommentProps }>();

const submit = (content: string) => {
  axios
    .post(`${API_URL}/user/comment`, {
      content,
      username: props.commentProps.username,
      parentId: props.commentProps.parentId
    })
    .then(console.log)
    .catch((e) => {
      console.log(`e: ${e}`);
    });
};
</script>

<template>
  <article class="register-form-panel">
    <h1>Register</h1>
    <FormKit type="form" :actions="false" @submit="submit">
      <FormKit
        type="text"
        label="Content"
        name="content"
        validation="required|length:5,100|alphanumeric"
      />

      <FormKit type="submit" />
    </FormKit>
  </article>
</template>
