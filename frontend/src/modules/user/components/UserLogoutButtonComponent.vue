<script setup lang="ts">
import { useModal } from '@/modules/shared/composables/useModal';
import LogoutModalContent from './UserLogoutModalContentComponent.vue';
import ModalComponent from '@/modules/shared/components/ModalComponent.vue';

const { isModalOpen, modalTitle, modalContent, openModal, closeModal } = useModal();

const onClick = async () => {
  openModal('Are you sure you want to log out?', LogoutModalContent);
};
</script>
<template>
  <button v-on:click="onClick" class="button-primary button-icon">
    <i class="pi pi-sign-out"></i><span>Logout</span>
  </button>
  <ModalComponent
    :isOpen="isModalOpen"
    :title="modalTitle"
    :content="modalContent"
    @close="closeModal"
  />
</template>
<style lang="scss" scoper>
.button-icon {
  i {
    font-size: 1.25rem;
  }
}
</style>
