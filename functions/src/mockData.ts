import { EVENT_DETAIL } from './@types'
import { userStatus } from './constant'

export const eventMock: EVENT_DETAIL = {
  eventName: 'เจอกันวันแรก Orientation Day #LINEHACK2020',
  eventDate: '2020-11-07',
  eventTime: '10:00',
  eventLocation: 'LINE Office Gaysorn Tower ชั้น 17',
  eventStatus: 'active',
  needUpdate: false,
  remindFreq: {
    b_1d: false,
    b_60m: false,
    ae_15m: false,
  },
  attendeeList: [
    {
      userId: '2222222222222',
      status: userStatus.UNSEEN,
    },
  ],
}
