<script setup lang="ts">

import { GAME_STATE, useGameStore } from '@/stores/game.ts'
import { storeToRefs } from 'pinia'
import { computed, onMounted, onUnmounted, ref, shallowRef, useTemplateRef } from 'vue'
import {
  type MaybeElement,
  useElementSize,
  usePointerSwipe,
  useSwipe,
  type UseSwipeDirection,
  useWindowSize
} from '@vueuse/core'
import { DateTime } from 'luxon'


const gameStore = useGameStore()

const { state, currentWord, roundStart, time } = storeToRefs(gameStore)

const el = useTemplateRef<HTMLElement>('word-node')
const { width: elWidth, height: elHeight } = useElementSize(el)

const container = useTemplateRef<HTMLElement>('container')
const { width: containerWidth, height: containerHeight } = useElementSize(container)

const center = computed(() => containerHeight.value / 2)
const borderLength = computed(() => (containerHeight.value / 2) - (containerHeight.value / 6))


const top = shallowRef('0')
const left = computed(() => (containerWidth.value / 2 - elWidth.value / 2) + 'px')

const animateBack = shallowRef(false)

const { isSwiping, direction, distanceY } = usePointerSwipe(el, {
  threshold: 0,
  onSwipeStart(e) {
    animateBack.value = false
  },
  onSwipe(e: PointerEvent) {
    const positionY = (center.value - elHeight.value / 2) - distanceY.value
    top.value = `${positionY}px`
  },
  onSwipeEnd(e: PointerEvent, direction: UseSwipeDirection) {
    top.value = (center.value - elHeight.value / 2) + 'px'
    if (Math.abs(distanceY.value) > borderLength.value) {
      gameStore.swipeWord(distanceY.value > 0)
      animateBack.value = false
    } else {
      animateBack.value = true

    }
  }
})

const secondsLeft = ref(time.value)

const timerInterval = ref<ReturnType<typeof setInterval>>()

onMounted(() => {
  top.value = (center.value - elHeight.value / 2) + 'px'

  timerInterval.value = setInterval(() => {
    console.log(time.value, Math.round(-roundStart.value.diffNow('seconds').seconds))
    secondsLeft.value = time.value - Math.round(-roundStart.value.diffNow('seconds').seconds)
    secondsLeft.value = secondsLeft.value > 0 ? secondsLeft.value : 0
  }, 500)
})

onUnmounted(() => clearInterval(timerInterval.value))


</script>

<template>

  <div class="flex flex-col justify-between items-center h-[94vh] max-h-[94vh] overflow-hidden relative w-full"
       ref="container">
    <div class="green-zone"></div>

    <div class="pointer-events-none absolute top-[40%]">
      {{ secondsLeft }}
    </div>
    <div ref="word-node" class="word-node text-xl font-bold h-full w-full flex justify-center items-center "
         :class="{'swiping': isSwiping, 'animated': animateBack}"
         :style="{top, left}">{{ currentWord.word }}
    </div>
    <div class="red-zone"></div>

  </div>

</template>

<style scoped lang="scss">
.word-node {
  position: absolute;
  top: 50%;
  cursor: grab;
  user-select: none;

  &.swiping {
    cursor: grabbing;
  }

  &.animated {
    transition: all 0.2s ease-in-out;
  }
}

.green-zone,
.red-zone {
  width: 1px;
  height: 1px;
  border-radius: 50%;
  background-color: transparent;
}

.green-zone {
  box-shadow: 0 0 150px 150px rgba(0, 128, 0, 0.62),
  inset 0 0 10px 10px rgba(0, 128, 0, 0.62);
}

.red-zone {

  box-shadow: 0 0 150px 150px rgba(205, 28, 24, 0.62),
  inset 0 0 10px 10px rgba(205, 28, 24, 0.62);
}

</style>