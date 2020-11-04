export declare type EVENT_DETAIL = {
  eventId: string
  groupId: string
  eventTitle: string
  eventDate: string
  eventTime: string
  eventLocation: string
  needUpdate?: string
  remindFreq?: Array<string>
  ownerUserId: string
  attendee: Array<string>
}
