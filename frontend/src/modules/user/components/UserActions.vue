<script setup lang="ts">
import { useModal } from '@/modules/shared/composables/useModal';
import { useUserActions } from '../composables/useUserActions';
import ModalComponent from '@/modules/shared/components/ModalComponent.vue';

const props = defineProps<{ name: string; username: string }>();
const ownUsername = localStorage.getItem('username');
const { isModalOpen, modalTitle, modalContent, closeModal, openModal, modalProps } =
  useModal();

const { userAction, userFollowed, userBlocked, userMuted } = useUserActions(
  openModal,
  props.username
);

const handleAction = (
  actionName: 'follow' | 'block' | 'mute',
  actionType: 'delete' | 'add',
  username: string
) => {
  userAction(actionName, actionType, username);
};
</script>

<template>
  <div class="user-actions">
    <div v-if="!userFollowed && username !== ownUsername">
      <button
        @click="() => handleAction('follow', 'add', username)"
        class="button-extra-small button-secondary"
        :disabled="userBlocked"
      >
        follow
      </button>
    </div>
    <div v-if="userFollowed && username !== ownUsername">
      <button
        @click="() => handleAction('follow', 'delete', username)"
        class="button-extra-small button-warn"
        :disabled="userBlocked"
      >
        unfollow
      </button>
    </div>
    <div v-if="!userMuted && username !== ownUsername">
      <button
        @click="() => handleAction('mute', 'add', username)"
        class="button-extra-small button-danger"
        :disabled="userBlocked"
      >
        mute
      </button>
    </div>
    <div v-if="userMuted && username !== ownUsername">
      <button
        @click="() => handleAction('mute', 'delete', username)"
        class="button-extra-small button-warn"
        :disabled="userBlocked"
      >
        unmute
      </button>
    </div>
    <div v-if="!userBlocked && username !== ownUsername">
      <button
        @click="() => handleAction('block', 'add', username)"
        class="button-extra-small button-danger"
      >
        block
      </button>
    </div>
    <div v-if="userBlocked && username !== ownUsername">
      <button
        @click="() => handleAction('block', 'delete', username)"
        class="button-extra-small button-warn"
      >
        unblock
      </button>
    </div>
  </div>

  <ModalComponent
    :isOpen="isModalOpen"
    :title="modalTitle"
    :content="modalContent"
    :content-props="{ props: modalProps }"
    @close="closeModal"
  />
</template>
<style lang="scss" scoped>
.user-comment-author-username {
  font-weight: 700;
}

.user-username {
  width: fit-content;
}

.user-name {
  color: white;
  font-weight: 700;
  font-size: 1.25rem;
}

.user-actions {
  align-items: center;
  gap: 0.75rem;
  display: flex;
}
</style>
