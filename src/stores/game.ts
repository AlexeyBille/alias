import { defineStore } from 'pinia'
import { StorageSerializers, useStorage } from '@vueuse/core'
import type Pack from '@/models/pack.ts'
import type Word from '@/models/word.ts'
import { DateTime } from 'luxon'
import { computed } from 'vue'

export enum GAME_STATE {
  CONFIGURE = 'CONFIGURE',
  SELECT_TEAM = 'SELECT_TEAM',
  SELECT_PACK = 'SELECT_PACK',
  ROUND_PENDING = 'ROUND_PENDING',
  ROUND_RUNNING = 'ROUND_RUNNING',
  ROUND_SUMMARY = 'ROUND_SUMMARY',
  FINISHED = 'FINISHED',
}

export enum GAME_TYPES {
  PERSONAL = 'PERSONAL',
  TEAM = 'TEAM',
}

export interface Team {
  name: string
}

export interface HistoryItem {
  round: number
  playerIndex: number,
  team: Team
  word: Word,
  isCorrect: boolean
}

export const useGameStore = defineStore('gameStore', () => {
  const state = useStorage<GAME_STATE>('game-state', GAME_STATE.CONFIGURE)


  const time = useStorage<number>('game-time', 120)
  const gameType = useStorage<GAME_TYPES>('game-type', GAME_TYPES.PERSONAL)

  const team = useStorage<Team[]>('game-team', [], undefined, { serializer: StorageSerializers.object })

  const pack = useStorage<Pack>('game-pack', null, undefined, { serializer: StorageSerializers.object })
  const words = useStorage<Word[]>('game-words', [], undefined, { serializer: StorageSerializers.object })

  const currentPlayerIndex = useStorage<number>('game-current-player-index', -1)
  const currentPlayer = computed(() => team.value[currentPlayerIndex.value])

  const currentWord = useStorage<Word>('game-current-word', null, undefined, { serializer: StorageSerializers.object })

  const roundNumber = useStorage<number>('game-round-number', 0)
  const roundStart = useStorage<DateTime>('game-round-start', DateTime.now(), undefined, {
    serializer: {
      read: (v: any) => typeof +v === 'number' ? DateTime.fromSeconds(+v) : DateTime.now(),
      write: (v: any) => v.toSeconds()
    }
  })
  const history = useStorage<HistoryItem[]>('game-round-history', [], undefined, { serializer: StorageSerializers.object })


  const prepareRound = () => {
    currentPlayerIndex.value = currentPlayerIndex.value + 1
    roundNumber.value = roundNumber.value + 1

    if (currentPlayerIndex.value === team.value.length) {
      currentPlayerIndex.value = 0
    }

    state.value = GAME_STATE.ROUND_PENDING
  }

  const startRound = () => {
    state.value = GAME_STATE.ROUND_RUNNING
    getNextWord()
    startTimer()
  }

  const getNextWord = () => {
    const wordIndex = Math.floor((Math.random() * words.value.length))
    currentWord.value = words.value[wordIndex]
    words.value.splice(wordIndex, 1)
  }

  const startTimer = () => {
    roundStart.value = DateTime.now()
  }

  const swipeWord = (isCorrect: boolean) => {
    history.value.push({
      round: roundNumber.value,
      playerIndex: currentPlayerIndex.value,
      team: team.value[currentPlayerIndex.value],
      word: currentWord.value,
      isCorrect: isCorrect
    })

    if (Math.abs(roundStart.value.diffNow('seconds').seconds) > time.value) {
      finishRound()
    } else {
      getNextWord()
    }
  }

  const finishRound = () => {
    state.value = GAME_STATE.ROUND_SUMMARY
  }

  const getPlayerPoints = (index: number) => {
    return history.value.filter(item => item.playerIndex === index && item.isCorrect).length
  }

  const reset = () => {
    state.value = GAME_STATE.CONFIGURE
    time.value = 120
    gameType.value = GAME_TYPES.PERSONAL
    pack.value = null
    words.value = []
    currentPlayerIndex.value = -1
    currentWord.value = null
    roundNumber.value = 0
    roundStart.value = DateTime.now()
    history.value = []
  }

  return {
    state,
    time,
    gameType,
    team,
    pack,
    words,
    currentPlayer,
    currentPlayerIndex,
    currentWord,
    roundStart,
    roundNumber,
    history,
    getPlayerPoints,
    prepareRound,
    startRound,
    swipeWord,
    reset
  }
})