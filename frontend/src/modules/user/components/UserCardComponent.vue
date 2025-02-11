<script setup lang="ts">
import type { User } from '@/modules/user/models/user-model';
import { useUserActions } from '../composables/useUserActions';
import { useModal } from '@/modules/shared/composables/useModal';
import ModalComponent from '@/modules/shared/components/ModalComponent.vue';

const props = defineProps<{ user: User; actionType: 'block' | 'mute' | 'follow' }>();

const { isModalOpen, modalTitle, modalContent, closeModal, openModal, modalProps } =
  useModal();

const { userAction } = useUserActions(openModal, props.user.username);

const deleteUserRelationship = (username: string) => {
  userAction(props.actionType, 'delete', username).then((res) => {
    if (res === 'confirm-action') {
      removeUserFromList();
    }
  });
};

const emit = defineEmits(['removeUserFromList']);

function removeUserFromList(): void {
  emit('removeUserFromList', props.user.username);
}
</script>
<template>
  <article class="flex">
    <div class="max-content">
      <span>{{ props.user.name }}</span>
      <RouterLink class="user-username font-grey" :to="`/user/${props.user.username}`"
        >@{{ props.user.username }}</RouterLink
      >
    </div>
    <div>
      <button
        class="button-small button-warn button-extra-small"
        @click="() => deleteUserRelationship(user.username)"
      >
        un{{ props.actionType }}
      </button>
    </div>
  </article>
  <ModalComponent
    :isOpen="isModalOpen"
    :title="modalTitle"
    :content="modalContent"
    :content-props="{ props: modalProps }"
    @close="closeModal"
  />
</template>
<style lang="scss" scoped>
.flex {
  width: 100%;
  display: flex;
  gap: 1rem;
  justify-content: space-between;
}

.user-username {
  font-size: 0.875rem;
}

.max-content {
  align-items: center;
  display: flex;
  gap: 0.5rem;
  width: max-content;
}
</style>
