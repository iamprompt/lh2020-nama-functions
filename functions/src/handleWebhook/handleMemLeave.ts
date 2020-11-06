import { MemberLeaveEvent } from '@line/bot-sdk'

export const handleMemLeave = (event: MemberLeaveEvent) => {
  return new Promise((resolve, reject) => {
    resolve()
  })
}
