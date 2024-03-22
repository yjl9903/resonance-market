<script setup lang="ts">
import type { VariantProps } from 'class-variance-authority'
import { badgeVariants } from '.'
import { cn } from '@/lib/utils'

interface BadgeVariantProps extends VariantProps<typeof badgeVariants> {}

interface Props {
  component?: 'span' | 'div'
  variant?: BadgeVariantProps['variant']
}
defineProps<Props>()
</script>

<template>
  <component
    :is="component ? component : 'div'"
    :class="cn(badgeVariants({ variant }), $attrs.class ?? '')"
  >
    <slot />
  </component>
</template>
