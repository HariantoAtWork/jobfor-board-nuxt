import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import updateLocale from 'dayjs/plugin/updateLocale' // ES 2015
import relativeTime from 'dayjs/plugin/relativeTime' // ES 2015
;[isBetween, isSameOrBefore, updateLocale, relativeTime].forEach(dayjs.extend)

export default dayjs
