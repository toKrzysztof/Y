<script setup lang="ts">
import { API_URL } from '@/config/env';
import router from '@/router';
import axios from 'axios';
import { ref } from 'vue';

interface PostFormData {
  title: string;
  content: string;
  links: string[];
}

const links = ref<string[]>([]);
const newLink = ref<string>('');
const maxLinks = 3;

const addLink = () => {
  if (newLink.value.trim()) {
    links.value.push(newLink.value.trim());
    newLink.value = '';
  }
};

const removeLink = (index: number) => {
  links.value.splice(index, 1);
};

const submit = ({ title, content }: PostFormData) => {
  axios
    .post(`${API_URL}/user/post`, { title, content, links: links.value })
    .then(() => {
      router.push('/user/my-feed');
    })
    .catch((e) => {
      console.log(`e: ${e}`);
    });
};
</script>

<template>
  <article class="post-form-panel">
    <h1>Create post</h1>
    <FormKit type="form" :actions="false" @submit="submit">
      <FormKit
        type="text"
        label="Title"
        name="title"
        validation="required|length:5,50"
      />
      <FormKit type="text" name="content" label="Content" validation="required" />

      <FormKit type="text" name="content" label="Content" validation="required" />
      <div class="flex">
        <FormKit
          type="text"
          label="Add link"
          name="link"
          v-model="newLink"
          :disabled="links.length >= maxLinks"
        />
        <button
          type="button"
          @click="addLink"
          class="button-small"
          :disabled="links.length >= maxLinks"
        >
          Add Link
        </button>
      </div>
      <ul>
        <li v-for="(link, index) in links" :key="index">
          {{ link }}
          <button type="button" @click="removeLink(index)" class="button-small">
            x
          </button>
        </li>
      </ul>
      <FormKit type="submit" />
    </FormKit>
  </article>
</template>
<style lang="scss" scoped>
.flex {
  display: flex;
  gap: 0.5rem;
  align-items: flex-end;
}
</style>
