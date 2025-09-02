import { reactive } from 'vue'
import dayjs from '../utils/dayjs-extend'

const INTERVAL = 1000

const state = reactive({
  now: dayjs(),
  timeoutID: null,
})

const methods = {
  startTimer() {
    state.now = dayjs()
    state.timeoutID = setTimeout(methods.startTimer, INTERVAL)
  },
  stopTimer() {
    clearTimeout(state.timeoutID)
  },
}

methods.startTimer()

export { state as default, methods }
