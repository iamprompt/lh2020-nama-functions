import {
  FlexBox,
  FlexImage,
  FlexMessage,
  FlexText,
  MessageEvent,
  QuickReply,
  TextEventMessage,
  TextMessage,
} from '@line/bot-sdk'
import { lineClient } from '../config'
import { messageType, textTrigger } from '../constant'
import { eventSummaryFlex } from '../replyComponent/scheduleSummary'

export const handleMessage = (event: MessageEvent) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { type } = event.message

      switch (type) {
        case messageType.TEXT:
          resolve(await handleMessageText(event))
          break

        default:
          reject({ error: 'Type is out of bound' })
          break
      }
    } catch (error) {
      reject(error)
    }
  })
}

const handleMessageText = async (event: MessageEvent) => {
  return new Promise(async (resolve, reject) => {
    try {
      const message = <TextEventMessage>event.message

      if (message.text === textTrigger.NAMA_TH || message.text.toLowerCase() === textTrigger.NAMA_EN) {
        resolve(await manaCallEvent(event))
      } else if (message.text === textTrigger.CREATE_EVENT) {
        resolve(await manaCreateEvent(event))
      } else if (message.text === textTrigger.STATUS_CHECK) {
        resolve(await manaCheckStatus(event))
      } else if (message.text === '#บายนามะ') {
        if (event.source.type === 'room') {
          resolve(await lineClient.leaveRoom(event.source.roomId))
        } else if (event.source.type === 'group') {
          resolve(await lineClient.leaveGroup(event.source.groupId))
        } else {
          resolve(
            await lineClient.replyMessage(event.replyToken, {
              type: 'text',
              text: 'I cannot leave a 1-on-1 chat!',
            }),
          )
        }
      } else {
        if (event.source.type === 'group') {
          resolve(
            await lineClient.replyMessage(event.replyToken, [
              <FlexMessage>await eventSummaryFlex(event.source.groupId, 'h6nRmZAtfnLW0xY8oCJK', 0),
              // eventSummaryFlex(ev, notificationType.NOTI_1D),
              // eventSummaryFlex(ev, notificationType.NOTI_60M),
              // eventSummaryFlex(ev, notificationType.NOTI_EVENT_TIME),
              // eventSummaryFlex(ev, notificationType.NOTI_EVERY_15M),
            ]),
          )
        }
      }
    } catch (error) {
      reject(error)
    }
  })
}

const manaCallEvent = (event: MessageEvent) => {
  return new Promise(async (resolve, reject) => {
    try {
      const quickTrig: QuickReply = {
        items: [
          {
            type: 'action',
            imageUrl:
              'https://firebasestorage.googleapis.com/v0/b/nama-294515.appspot.com/o/LINEBOT%2Ficon%2Ficalendar.png?alt=media',
            action: {
              type: 'message',
              label: 'สร้างนัดหมาย',
              text: textTrigger.CREATE_EVENT,
            },
          },
          {
            type: 'action',
            imageUrl:
              'https://firebasestorage.googleapis.com/v0/b/nama-294515.appspot.com/o/LINEBOT%2Ficon%2Ficheck.png?alt=media',
            action: {
              type: 'message',
              label: 'เช็กสถานะ',
              text: textTrigger.STATUS_CHECK,
            },
          },
        ],
      }

      const textTrig: TextMessage = {
        type: 'text',
        text: 'มาแล้ววว ใครเรียกนามะเนี่ย ! มีอะไรให้ช่วยก็บอกเลยน้า',
        quickReply: quickTrig,
      }

      resolve(lineClient.replyMessage(event.replyToken, textTrig))
    } catch (error) {
      reject(error)
    }
  })
}

const manaCreateEvent = (event: MessageEvent) => {
  return new Promise((resolve, reject) => {
    try {
      const bgImage: FlexImage = {
        type: 'image',
        size: 'full',
        aspectMode: 'cover',
        gravity: 'center',
        aspectRatio: '1:1',
        url:
          'https://firebasestorage.googleapis.com/v0/b/nama-294515.appspot.com/o/LINEBOT%2Fflex%2FFlex_CreateEvent.png?alt=media&p=1',
      }

      const buttonContainer: FlexBox = {
        type: 'box',
        layout: 'horizontal',
        contents: [
          {
            type: 'box',
            layout: 'vertical',
            contents: [
              {
                type: 'button',
                action: {
                  type: 'uri',
                  label: 'เพิ่มนัดหมาย',
                  uri: 'http://google.com/', // Todo: Edit Action to liff
                },
                color: '#F06129',
                style: 'primary',
              },
            ],
            spacing: 'xs',
          },
        ],
        position: 'absolute',
        offsetBottom: '0px',
        offsetStart: '0px',
        offsetEnd: '0px',
        paddingAll: '20px',
      }

      const headerText: FlexText = {
        type: 'text',
        text: '#สร้างนัดหมาย',
        offsetTop: '25px',
        offsetStart: '25px',
        offsetEnd: '0px',
        position: 'absolute',
        weight: 'bold',
        size: 'lg',
        color: '#F06129',
      }

      const bubbleText: FlexBox = {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'text',
            text: 'กำหนดรายละเอียดในการนัดครั้งนี้',
            wrap: true,
            size: 'lg',
          },
        ],
        position: 'absolute',
        offsetTop: '85px',
        offsetStart: '25px',
        paddingAll: '20px',
        offsetEnd: '70px',
      }

      const flexBox: FlexBox = {
        type: 'box',
        layout: 'vertical',
        contents: [bgImage, buttonContainer, headerText, bubbleText],
        paddingAll: '0px',
      }

      const flexMessageTrig: FlexMessage = {
        type: 'flex',
        altText: 'Hello World!!',
        contents: {
          type: 'bubble',
          body: flexBox,
        },
      }

      resolve(lineClient.replyMessage(event.replyToken, flexMessageTrig))
    } catch (error) {
      reject(error)
    }
  })
}

const manaCheckStatus = (event: MessageEvent) => {
  return new Promise((resolve, reject) => {
    resolve()
  })
}
