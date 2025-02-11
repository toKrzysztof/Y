<script setup lang="ts">
import { useModal } from '@/modules/shared/composables/useModal';
import ModalComponent from '@/modules/shared/components/ModalComponent.vue';
import LoginModalContent from '../components/LoginModalContentComponent.vue';
import RegisterModalContent from '../components/RegisterModalContentComponent.vue';
import axios from 'axios';
import { API_URL } from '@/config/env';
import router from '@/router';

const { isModalOpen, modalTitle, modalContent, openModal, closeModal } = useModal();

const handleLogin = async () => {
  axios
    .get(`${API_URL}/auth/status`)
    .then(() => router.push(`/user/my-feed`))
    .catch((e) => console.log(e));

  openModal('Login', LoginModalContent);
};

const openRegisterModal = () => {
  openModal('Register', RegisterModalContent);
};
</script>

<template>
  <main class="landing-page-wrapper">
    <div class="landing-page-content">
      <section class="landing-page-section">
        <img src="/logo.png" alt="y-logo" />
      </section>
      <section class="landing-page-header">
        <h1 class="header">Trending topics from all over the world</h1>
        <div class="bottom-section">
          <h2 class="subheader">Join now.</h2>
          <button
            class="button-secondary landing-page-button"
            @click="openRegisterModal"
          >
            Register
          </button>
          <div class="separator">
            <span class="separator-or">or</span>
          </div>
          <button class="button-primary landing-page-button" @click="handleLogin">
            Log in
          </button>
        </div>
      </section>
    </div>
  </main>
  <ModalComponent
    :isOpen="isModalOpen"
    :title="modalTitle"
    :content="modalContent"
    @close="closeModal"
  />
</template>

<style lang="scss" scoped>
.landing-page-wrapper {
  display: grid;
  place-items: center;
  height: 100vh;
  width: 100%;
  color: white;
  margin: auto;
}

.landing-page-header {
  max-width: 40rem;
}

.landing-page-content {
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin: auto;
  max-width: 75rem;
}

.header {
  font-size: 4rem;
  font-weight: 700;
  margin-top: 0;
  color: rgb(202, 202, 202);
}

.subheader {
  font-size: 2rem;
}

.bottom-section {
  max-width: 15rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  .landing-page-button {
    width: 100%;
  }
}

.separator {
  align-items: center;
  display: flex;

  &::before {
    content: '';
    height: 0.0625rem;
    width: 100%;
    background-color: rgba(255, 255, 255, 0.3);
  }

  &::after {
    content: '';
    height: 0.0625rem;
    width: 100%;
    background-color: rgba(255, 255, 255, 0.3);
  }

  .separator-or {
    width: fit-content;
    padding: 0 0.5rem;
  }
}
</style>
