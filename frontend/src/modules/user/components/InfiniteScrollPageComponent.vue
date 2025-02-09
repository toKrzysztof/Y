<script setup lang="ts">
import { defineProps, onMounted, ref } from 'vue';
import { useInfiniteScroll } from '@vueuse/core';
import type { PaginatedContent } from '@/modules/user/models/paginated-content-model';

interface Props<T> {
  fetchData: (
    baseFetchUrl: string,
    limit: number,
    offset: number
  ) => Promise<PaginatedContent<T>>;
  postsPerPage: number;
  noItemsMessage?: string;
  baseFetchUrl: string;
}

const pageContentWrapper = ref(null);
const itemList = ref<unknown[]>([]);
const itemCount = ref<number | null>(null);
const fetchingData = ref<boolean>(false);

const { fetchData, postsPerPage, noItemsMessage, baseFetchUrl } =
  defineProps<Props<unknown>>();

onMounted(() => {
  fetchingData.value = true;

  fetchData(baseFetchUrl, postsPerPage, 0)
    .then((res) => {
      if (Array.isArray(res.content)) {
        itemList.value = res.content;
      }
      if (typeof res.count === 'number') {
        itemCount.value = res.count;
      }
    })
    .finally(() => {
      fetchingData.value = false;
    });
});

const getItemsOnScroll = async () => {
  try {
    const newItems = await fetchData(baseFetchUrl, postsPerPage, itemList.value.length);

    itemList.value.push(...newItems.content);
    itemCount.value = newItems.count;
  } catch (err) {
    console.log(err);
  }
};

useInfiniteScroll(
  pageContentWrapper,
  async () => {
    await getItemsOnScroll();
  },
  {
    distance: 50,
    canLoadMore: () => {
      console.log('test');
      if (fetchingData.value === true) return false;
      if (
        typeof itemCount.value === 'number' &&
        itemCount.value <= itemList.value.length
      ) {
        return false;
      }
      return true;
    }
  }
);
</script>

<template>
  <div ref="pageContentWrapper" class="scroll-page-content-wrapper">
    <Suspense>
      <slot name="regular-content"></slot>
      <template #fallback>Loading...</template>
    </Suspense>

    <Suspense>
      <slot name="itemList" :item-list="itemList"></slot>
      <template #fallback>Loading...</template>
    </Suspense>
    <p v-show="fetchingData" class="loader">Fetching...</p>
    <p
      v-show="
        !fetchingData && itemList.length === 0 && typeof noItemsMessage === 'string'
      "
    >
      {{ noItemsMessage }}
    </p>
  </div>
</template>

<style lang="scss" scoped>
.scroll-page-content-wrapper {
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  list-style: none;
  margin: 0;
  height: 100vh;
  overflow-y: scroll;
  width: 100%;
  padding-bottom: 2rem;
}

.item-list {
  margin-bottom: 10rem;
}
</style>
