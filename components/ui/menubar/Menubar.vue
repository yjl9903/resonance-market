<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue';
import {
  MenubarRoot,
  type MenubarRootEmits,
  type MenubarRootProps,
  useForwardPropsEmits
} from 'radix-vue';
import { cn } from '@/lib/utils';

const props = defineProps<MenubarRootProps & { class?: HTMLAttributes['class'] }>();
const emits = defineEmits<MenubarRootEmits>();

const delegatedProps = computed(() => {
  const { ...delegated } = props;

  return delegated;
});

const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
  <MenubarRoot
    v-bind="forwarded"
    :class="cn('flex items-center gap-x-1 rounded-md bg-background pb-1', props.class)"
  >
    <slot />
  </MenubarRoot>
</template>
