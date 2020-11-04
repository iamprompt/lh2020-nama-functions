import * as functions from 'firebase-functions'
import * as EHANDLE from './handleWebhook'
import { WebhookEvent } from '@line/bot-sdk'

enum eventType {
  MESSAGE = 'message',
  UNSEND = 'unsend',
  FOLLOW = 'follow',
  UNFOLLOW = 'unfollow',
  JOIN = 'join',
  LEAVE = 'leave',
  MEM_JOIN = 'memberJoined',
  MEM_LEAVE = 'memberLeft',
  POSTBACK = 'postback',
}

export const handleEvents = (events: Array<WebhookEvent>) => {
  // Define events as a variable
  if (events.length === 0) return
  const event: WebhookEvent = events[0]
  functions.logger.log(event)

  // Handle Each Type
  switch (event.type) {
    case eventType.MESSAGE:
      EHANDLE.handleMessage(event)
      break

    case eventType.FOLLOW:
      EHANDLE.handleFollow(event)
      break

    case eventType.UNFOLLOW:
      EHANDLE.handleUnfollow(event)
      break

    case eventType.JOIN:
      EHANDLE.handleJoined(event)
      break

    case eventType.LEAVE:
      EHANDLE.handleLeave(event)
      break

    case eventType.MEM_JOIN:
      EHANDLE.handleMemJoined(event)
      break

    case eventType.MEM_LEAVE:
      EHANDLE.handleMemLeave(event)
      break

    case eventType.POSTBACK:
      EHANDLE.handlePostback(event)
      break

    default:
      break
  }
}
