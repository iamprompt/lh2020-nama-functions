import * as functions from 'firebase-functions'
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
import { eventSummaryFlex } from '../replyComponent/scheduleSummary'
import { event as ev } from '../mockData'
import { messageType, textTrigger, notificationType } from '../constant'

export const handleMessage = (event: MessageEvent) => {
  functions.logger.log(event.message.type)
  const { type } = event.message

  switch (type) {
    case messageType.TEXT:
      handleMessageText(event)
      break

    default:
      break
  }
}

const handleMessageText = async (event: MessageEvent) => {
  const message = <TextEventMessage>event.message

  if (message.text === textTrigger.NAMA_TH || message.text.toLowerCase() === textTrigger.NAMA_EN) {
    manaCallEvent(event)
  } else if (message.text === textTrigger.CREATE_EVENT) {
    manaCreateEvent(event)
  } else if (message.text === textTrigger.STATUS_CHECK) {
    manaCheckStatus(event)
  } else if (message.text === '#บายนามะ') {
    if (event.source.type === 'room') {
      lineClient.leaveRoom(event.source.roomId)
    } else if (event.source.type === 'group') {
      lineClient.leaveGroup(event.source.groupId)
    } else {
      lineClient.replyMessage(event.replyToken, {
        type: 'text',
        text: 'I cannot leave a 1-on-1 chat!',
      })
    }
  } else {
    lineClient
      .replyMessage(event.replyToken, [
        eventSummaryFlex(ev, notificationType.SUMMARY_EVENT),
        eventSummaryFlex(ev, notificationType.NOTI_1D),
        eventSummaryFlex(ev, notificationType.NOTI_60M),
        eventSummaryFlex(ev, notificationType.NOTI_EVENT_TIME),
        eventSummaryFlex(ev, notificationType.NOTI_EVERY_15M),
      ])
      .then(() => {})
      .catch((err) => {
        functions.logger.error(err)
      })
  }
}

const manaCallEvent = (event: MessageEvent) => {
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

  lineClient
    .replyMessage(event.replyToken, textTrig)
    .then((v) => {
      functions.logger.log(v)
    })
    .catch((err) => {
      functions.logger.error(err)
    })
}

const manaCreateEvent = (event: MessageEvent) => {
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

  lineClient
    .replyMessage(event.replyToken, flexMessageTrig)
    .then((v) => {
      functions.logger.log(v)
    })
    .catch((err) => {
      functions.logger.error(err)
    })
}

const manaCheckStatus = (event: MessageEvent) => {}
