import * as functions from 'firebase-functions'
import { PostbackEvent } from '@line/bot-sdk'
import { cancelEvent, getEventWId, updateUserStatus } from '../api/event'
import { userStatus } from '../constant'
import { lineClient } from '../config'

export const handlePostback = (event: PostbackEvent) => {
  return new Promise(async (resolve, reject) => {
    console.log(event)

    const data = event.postback.data
    console.log(data)

    const splitData = data.match(/(\w+)/g)
    // ["arrived", "groupId", "Cb34ad23b226c50f08c67308a3e75955a", "eventId", "TlczJkwhh4tyYFw21nIX"]

    console.log(splitData)
    if (splitData !== null) {
      if (
        splitData[0] === userStatus.UNSEEN ||
        splitData[0] === userStatus.ACKNOWLEDGED ||
        splitData[0] === userStatus.TRAVELING ||
        splitData[0] === userStatus.ARRIVED
      ) {
        //@ts-expect-error
        resolve(await updateUserStatus(event.source.groupId, splitData[4], event.source.userId, splitData[0]))
      } else if (splitData[0] === 'cancelEvent') {
        console.log('CANCEL EVENT')
        try {
          // @ts-expect-error
          const activeEvent = await getEventWId(event.source.groupId)
          // @ts-expect-error
          if (event.source.userId === activeEvent.ownerId) {
            // @ts-expect-error
            cancelEvent(event.source.groupId, activeEvent.eventId)
            resolve(
              lineClient.replyMessage(event.replyToken, [
                //@ts-expect-error
                { type: 'text', text: `ยกเลิกนัดหมาย "${activeEvent.eventName}" เรียบร้อยแล้ว` },
              ]),
            )
          } else {
            throw new Error('CANNOT DELETE')
          }
        } catch (error) {
          functions.logger.error(error)
          reject(error)
        }
      }
    }
  })
}
