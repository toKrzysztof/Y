<script setup lang="ts">
import { computed, defineProps, onMounted, provide, ref } from 'vue';
import { useInfiniteScroll } from '@vueuse/core';
import type { PaginatedContent } from '@/modules/user/models/paginated-content.model';
import type { InfiniteScrollContent } from '../models/infinite-scroll-content.model';

export interface InfiniteScrollControls {
  triggerReRender: () => void;
}

interface Props<T> {
  fetchData: (
    baseFetchUrl: string,
    limit: number,
    offset: number
  ) => Promise<PaginatedContent<T>>;
  postsPerPage: number;
  noItemsMessage?: string;
  baseFetchUrl: string;
  filterPredicate?: (item: T) => boolean;
}
const { fetchData, postsPerPage, noItemsMessage, baseFetchUrl, filterPredicate } =
  defineProps<Props<unknown>>();

const pageContentWrapper = ref(null);
const itemList = ref<unknown[]>([]);
const itemCount = ref<number | null>(null);
const fetchingData = ref<boolean>(false);
const filteredItemList = computed(() => {
  if (filterPredicate) {
    return itemList.value.filter(filterPredicate);
  }
  return itemList.value;
});

const triggerReRender = () => {
  itemList.value = itemList.value.map((item) => {
    (item as InfiniteScrollContent).key = new Date().toString();
    return item;
  });
};

provide('infiniteScrollControls', { triggerReRender });

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
    distance: 25,
    canLoadMore: () => {
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
    <div class="item-list">
      <Suspense>
        <slot name="itemList" :item-list="filteredItemList"></slot>
        <template #fallback>Loading...</template>
      </Suspense>
      <p v-show="fetchingData" class="paragraph-center">Fetching...</p>
      <p
        v-show="
          !fetchingData &&
          filteredItemList.length === 0 &&
          typeof noItemsMessage === 'string'
        "
        class="paragraph-center"
      >
        {{ noItemsMessage }}
      </p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/scss/variables' as *;

.scroll-page-content-wrapper {
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  list-style: none;
  margin: 0;
  height: 100vh;
  overflow-y: scroll;
  width: 100%;
}

.item-list {
  width: 100%;
  max-width: 38rem;
  box-sizing: border-box;
  border-right: 0.0625rem solid $border-grey;
  min-height: calc(100% - 7rem);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.paragraph-center {
  width: 100%;
  margin-top: 0rem;
  padding-top: 1rem;
  text-align: center;
  border-top: 0.0625rem solid $border-grey;
}
</style>
