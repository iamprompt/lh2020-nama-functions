import { MemberJoinEvent } from '@line/bot-sdk'

export const handleMemJoined = (event: MemberJoinEvent) => {
  return new Promise((resolve, reject) => {
    resolve()
  })
}
