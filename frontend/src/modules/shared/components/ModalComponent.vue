<script setup lang="ts">
import { defineProps, defineEmits, provide } from 'vue';
import type { Component } from 'vue';

interface ModalProps {
  isOpen: boolean;
  title: string;
  content: Component | null;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _ = defineProps<ModalProps>();

const emit = defineEmits(['close']);

function closeModal(): void {
  emit('close');
}

provide('closeModal', closeModal);
</script>

<template>
  <div v-if="isOpen" class="modal-overlay">
    <div class="modal">
      <div class="modal-header">
        <button @click="closeModal" class="button-x button-small back-button">×</button>
        <h2>{{ title }}</h2>
      </div>
      <div class="modal-body">
        <component :is="content" v-if="content" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(192, 219, 255, 0.189);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: black;
  padding: 1.25rem;
  border-radius: 0.5rem;
  width: fit-content;
  position: absolute;
  z-index: 1000;
}

.modal-header {
  display: flex;
  justify-content: center;
  position: relative;

  h2 {
    margin-top: 0;
    padding: 0 2rem;
  }

  .back-button {
    left: -0.5rem;
    color: white;
    position: absolute;
  }
}

.modal-header button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}
</style>
