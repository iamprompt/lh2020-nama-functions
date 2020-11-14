import { FlexBox, FlexImage, FlexMessage, MessageEvent, QuickReply, TextEventMessage, TextMessage } from '@line/bot-sdk'
import { admin, lineClient } from '../config'
import { messageType, textTrigger } from '../constant'
// import { eventSummaryFlex } from '../replyComponent/scheduleSummary'
import { storageUrl, getLiffUrl } from '../utils/const'

export const handleMessage = (event: MessageEvent) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (event.source.type === 'group') {
        const { type } = event.message

        switch (type) {
          case messageType.TEXT:
            resolve(await handleMessageText(event))
            break

          default:
            reject({ error: 'Type is out of bound' })
            break
        }
      } else throw new Error('NO 1-1')
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
      } else if (message.text === textTrigger.STATUS_CHECK || message.text === textTrigger.STATUS_CHECKK) {
        resolve(await manaCheckStatus(event))
      } else if (message.text === textTrigger.CANCEL_EVENT) {
        resolve(await manaCancelEvent(event))
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
          resolve()
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
            imageUrl: `${storageUrl}/LINEBOT%2Ficon%2FaddEvent.png?alt=media`,
            action: {
              type: 'message',
              label: 'สร้างนัดหมาย',
              text: textTrigger.CREATE_EVENT,
            },
          },
          {
            type: 'action',
            imageUrl: `${storageUrl}/LINEBOT%2Ficon%2FcheckEvent.png?alt=media`,
            action: {
              type: 'message',
              label: 'เช็กสถานะ',
              text: textTrigger.STATUS_CHECK,
            },
          },
          {
            type: 'action',
            imageUrl: `${storageUrl}/LINEBOT%2Ficon%2FcancelEvent.png?alt=media`,
            action: {
              type: 'message',
              label: 'ยกเลิกนัดหมาย',
              text: textTrigger.CANCEL_EVENT,
            },
          },
        ],
      }

      const textTrig: TextMessage = {
        type: 'text',
        text: 'มาแล้วค้าบ นามะจะมาช่วยนัดให้ทุกคนนะฮะ 😊',
        quickReply: quickTrig,
      }

      resolve(lineClient.replyMessage(event.replyToken, textTrig))
    } catch (error) {
      reject(error)
    }
  })
}

const manaCreateEvent = (event: MessageEvent) => {
  return new Promise(async (resolve, reject) => {
    try {
      // @ts-expect-error
      const eventRef = admin.firestore().collection('nama').doc(event.source.groupId).collection('events')
      const activeEventSnap = await eventRef.where('eventStatus', '==', 'active').get()

      if (activeEventSnap.empty) {
        const bgImage: FlexImage = {
          type: 'image',
          url: `${storageUrl}/LINEBOT%2Fflex%2FCreateEventFlexBG.jpg?alt=media`,
          size: 'full',
          aspectMode: 'cover',
          aspectRatio: '1.21:1',
          gravity: 'center',
        }

        const buttonContainer: FlexBox = {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'image',
              url: `${storageUrl}/LINEBOT%2Fflex%2FCreateEventButton.png?alt=media`,
              align: 'center',
              aspectMode: 'cover',
              size: 'full',
              aspectRatio: '2056:479',
              action: {
                type: 'uri',
                label: 'action',
                uri: getLiffUrl.createEvent(),
              },
            },
          ],
          offsetBottom: '0px',
          offsetStart: '0px',
          offsetEnd: '0px',
          paddingAll: '20px',
          position: 'absolute',
        }

        const flexBox: FlexBox = {
          type: 'box',
          layout: 'vertical',
          contents: [bgImage, buttonContainer],
          paddingAll: '0px',
          backgroundColor: '#ffffff',
        }

        const flexMessageTrig: FlexMessage = {
          type: 'flex',
          altText: 'นามะมาช่วยเพื่อน ๆ สร้างนัดหมายแล้ว',
          contents: {
            type: 'bubble',
            body: flexBox,
          },
        }

        resolve(lineClient.replyMessage(event.replyToken, flexMessageTrig))
      } else {
        lineClient.replyMessage(event.replyToken, [
          {
            type: 'text',
            text: 'ตอนนี้สร้างได้ 1 นัดหมายต่อครั้งน้า',
            quickReply: {
              items: [
                {
                  type: 'action',
                  imageUrl: `${storageUrl}/LINEBOT%2Ficon%2FcheckEvent.png?alt=media`,
                  action: {
                    type: 'message',
                    label: 'เช็กสถานะ',
                    text: textTrigger.STATUS_CHECK,
                  },
                },
                {
                  type: 'action',
                  imageUrl: `${storageUrl}/LINEBOT%2Ficon%2FcancelEvent.png?alt=media`,
                  action: {
                    type: 'message',
                    label: 'ยกเลิกนัดหมาย',
                    text: textTrigger.CANCEL_EVENT,
                  },
                },
              ],
            },
          },
        ])
        reject({ error: 'Create only one event at a time' })
      }
    } catch (error) {
      reject(error)
    }
  })
}

const manaCheckStatus = (event: MessageEvent) => {
  return new Promise(async (resolve, reject) => {
    try {
      // @ts-expect-error
      const eventRef = admin.firestore().collection('nama').doc(event.source.groupId).collection('events')
      const activeEventSnap = await eventRef.where('eventStatus', '==', 'active').get()

      if (!activeEventSnap.empty) {
        const bgImage: FlexImage = {
          type: 'image',
          url: `${storageUrl}/LINEBOT%2Fflex%2FCheckStatusFlexBG.jpg?alt=media`,
          size: 'full',
          aspectMode: 'cover',
          aspectRatio: '1.21:1',
          gravity: 'center',
        }

        const buttonContainer: FlexBox = {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'image',
              url: `${storageUrl}/LINEBOT%2Fflex%2FCheckStatusButton-1.png?alt=media`,
              align: 'center',
              aspectMode: 'cover',
              size: 'full',
              aspectRatio: '2056:479',
              action: {
                type: 'uri',
                label: 'action',
                uri: getLiffUrl.checkStatus(),
              },
            },
          ],
          offsetBottom: '0px',
          offsetStart: '0px',
          offsetEnd: '0px',
          paddingAll: '20px',
          position: 'absolute',
        }

        const flexBox: FlexBox = {
          type: 'box',
          layout: 'vertical',
          contents: [bgImage, buttonContainer],
          paddingAll: '0px',
        }

        const flexMessageTrig: FlexMessage = {
          type: 'flex',
          altText: 'นี่ไงสถานะของเพื่อน ๆ ร่วมนัด',
          contents: {
            type: 'bubble',
            body: flexBox,
          },
        }

        resolve(lineClient.replyMessage(event.replyToken, flexMessageTrig))
      } else {
        lineClient.replyMessage(event.replyToken, [
          {
            type: 'text',
            text: 'คุณยังไม่ได้สร้างนัดหมาย',
            quickReply: {
              items: [
                {
                  type: 'action',
                  imageUrl: `${storageUrl}/LINEBOT%2Ficon%2FaddEvent.png?alt=media`,
                  action: {
                    type: 'message',
                    label: 'สร้างนัดหมาย',
                    text: textTrigger.CREATE_EVENT,
                  },
                },
              ],
            },
          },
        ])
        reject({ error: 'Event does not exist' })
      }
    } catch (error) {
      reject(error)
    }
  })
}

const manaCancelEvent = (event: MessageEvent) => {
  return new Promise(async (resolve, reject) => {
    try {
      // @ts-expect-error
      const eventRef = admin.firestore().collection('nama').doc(event.source.groupId).collection('events')
      const activeEventSnap = await eventRef.where('eventStatus', '==', 'active').limit(1).get()

      if (!activeEventSnap.empty) {
        activeEventSnap.forEach((activeE) => {
          const eventId = activeE.id
          const activeEvent = activeE.data()
          console.log(activeEvent)

          if (event.source.userId !== activeEvent.ownerId) {
            lineClient.replyMessage(event.replyToken, [
              {
                type: 'text',
                text: 'ไม่สามารถยกเลิกได้ คุณไม่ได้เป็นเจ้าของนัดหมายปัจจุบัน',
              },
            ])
            throw { error: 'You are not allowed to cancel the event since it is not yours.' }
          }

          const bgImage: FlexImage = {
            type: 'image',
            url: `${storageUrl}/LINEBOT%2Fflex%2FCancelEventFlexBG.jpg?alt=media`,
            size: 'full',
            aspectMode: 'cover',
            aspectRatio: '1.21:1',
            gravity: 'center',
          }

          const buttonContainer: FlexBox = {
            type: 'box',
            layout: 'vertical',
            contents: [
              {
                type: 'image',
                url: `${storageUrl}/LINEBOT%2Fflex%2FCancelEventButton.png?alt=media`,
                align: 'center',
                aspectMode: 'cover',
                size: 'full',
                aspectRatio: '2056:479',
                action: {
                  type: 'postback',
                  label: 'ยกเลิกนัดหมาย',
                  data: `cancelEvent?eventId=${eventId}`,
                },
              },
            ],
            offsetBottom: '0px',
            offsetStart: '0px',
            offsetEnd: '0px',
            paddingAll: '20px',
            position: 'absolute',
          }

          const flexBox: FlexBox = {
            type: 'box',
            layout: 'vertical',
            contents: [bgImage, buttonContainer],
            paddingAll: '0px',
            backgroundColor: '#ffffff',
          }

          const flexMessageTrig: FlexMessage = {
            type: 'flex',
            altText: 'ยกเลิกนัดหมายได้ที่นี่ คลิกเลย!!',
            contents: {
              type: 'bubble',
              body: flexBox,
            },
          }

          resolve(lineClient.replyMessage(event.replyToken, flexMessageTrig))
        })
      } else {
        lineClient.replyMessage(event.replyToken, [
          {
            type: 'text',
            text: 'คุณยังไม่ได้สร้างนัดหมาย',
            quickReply: {
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
              ],
            },
          },
        ])
        reject({ error: 'Event does not exist' })
      }
    } catch (error) {
      reject(error)
    }
  })
}
