import * as functions from 'firebase-functions'
import * as EHANDLE from './handleWebhook'
import { WebhookEvent } from '@line/bot-sdk'
import { eventType } from './constant'

export const handleEvents = (events: Array<WebhookEvent>) => {
  return new Promise(async (resolve, reject) => {
    // Define events as a variable
    if (events.length === 0) reject({ error: 'An event object is blank.' })
    try {
      const event: WebhookEvent = events[0]
      functions.logger.log(event)

      // Handle Each Type
      switch (event.type) {
        case eventType.MESSAGE:
          resolve(await EHANDLE.handleMessage(event))
          break

        case eventType.FOLLOW:
          resolve(await EHANDLE.handleFollow(event))
          break

        case eventType.UNFOLLOW:
          resolve(await EHANDLE.handleUnfollow(event))
          break

        case eventType.JOIN:
          resolve(await EHANDLE.handleJoined(event))
          break

        case eventType.LEAVE:
          resolve(await EHANDLE.handleLeave(event))
          break

        case eventType.MEM_JOIN:
          resolve(await EHANDLE.handleMemJoined(event))
          break

        case eventType.MEM_LEAVE:
          resolve(await EHANDLE.handleMemLeave(event))
          break

        case eventType.POSTBACK:
          resolve(await EHANDLE.handlePostback(event))
          break

        default:
          break
      }
    } catch (error) {
      resolve(error)
    }
  })
}
