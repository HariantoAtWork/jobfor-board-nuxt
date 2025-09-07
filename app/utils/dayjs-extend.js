import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import updateLocale from 'dayjs/plugin/updateLocale' // ES 2015
import relativeTime from 'dayjs/plugin/relativeTime' // ES 2015
;[isBetween, isSameOrBefore, updateLocale, relativeTime].forEach(dayjs.extend)

export default dayjs

export const formatTime = (_createdDate, _now) => {
  const createdDate = dayjs(_createdDate)
  const now = dayjs(_now)

  if (createdDate > now) {
    // format future time as DD:HH:mm:ss
    const diff = createdDate.diff(now, 'second')
    const days = Math.floor(diff / 86400)
    const hours = Math.floor((diff % 86400) / 3600)
    const minutes = Math.floor((diff % 3600) / 60)
    const seconds = diff % 60

    return `in ${days.toString()}d ${hours
      .toString()
      .padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`
  }
  return createdDate.from(now)
}

export const formatActivityTime = (_createdDate, _now) => {
  const createdDate = dayjs(_createdDate)
  const now = dayjs(_now)

  if (createdDate > now) {
    // format future time as DD:HH:mm:ss
    const diff = createdDate.diff(now, 'second')
    const days = Math.floor(diff / 86400)
    const hours = Math.floor((diff % 86400) / 3600)
    const minutes = Math.floor((diff % 3600) / 60)
    const seconds = diff % 60

    return `in ${days.toString()}d ${hours
      .toString()
      .padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`
  }
  return createdDate.format('D MMMM, hh:mm')
}
