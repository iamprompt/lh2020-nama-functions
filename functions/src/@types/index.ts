import { userStatus } from '../constant'
import { firestore } from 'firebase-admin'

export declare type EVENT_DETAIL = {
  eventName: string
  eventDateTime?: firestore.Timestamp
  eventDate?: string
  eventTime?: string
  eventLocation: string
  eventStatus: 'active' | 'past' | 'cancel'
  needUpdate: boolean
  remindFreq: REMIND_FREQ
  attendeeList: ATTENDEE_STATUS[]
}

export declare type ATTENDEE_STATUS = {
  userId: string
  //status: 'unseen' | 'acknowledged' | 'travelling' | 'arrived'
  status: userStatus
}

export declare type REMIND_FREQ = {
  ae_15m: boolean
  b_1d: boolean
  b_60m: boolean
}

export declare type FIRESTORE_EVENT_DETAIL = {
  ownerId: string
} & EVENT_DETAIL
