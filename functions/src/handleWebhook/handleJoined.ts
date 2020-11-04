import * as functions from 'firebase-functions'
import { JoinEvent, FlexCarousel, FlexMessage, TextMessage } from '@line/bot-sdk'
import { lineClient } from '../config'

export const handleJoined = (event: JoinEvent) => {
  functions.logger.log(event)

  const flexCarouselContainer: FlexCarousel = {
    type: 'carousel',
    contents: [
      {
        type: 'bubble',
        hero: {
          type: 'image',
          url:
            'https://firebasestorage.googleapis.com/v0/b/nama-294515.appspot.com/o/LINEBOT%2Fcarousel%2FGroupIntroduceBot%2FIntroduceGroup1.jpg?alt=media',
          size: 'full',
          action: {
            type: 'message',
            label: 'Wow1',
            text: 'ว้าว1',
          },
        },
      },
      {
        type: 'bubble',
        hero: {
          type: 'image',
          url:
            'https://firebasestorage.googleapis.com/v0/b/nama-294515.appspot.com/o/LINEBOT%2Fcarousel%2FGroupIntroduceBot%2FIntroduceGroup2.jpg?alt=media',
          size: 'full',
          action: {
            type: 'message',
            label: 'Wow2',
            text: 'ว้าว2',
          },
        },
      },
      {
        type: 'bubble',
        hero: {
          type: 'image',
          url:
            'https://firebasestorage.googleapis.com/v0/b/nama-294515.appspot.com/o/LINEBOT%2Fcarousel%2FGroupIntroduceBot%2FIntroduceGroup3.jpg?alt=media',
          size: 'full',
          action: {
            type: 'message',
            label: 'Wow3',
            text: 'ว้าว3',
          },
        },
      },
      {
        type: 'bubble',
        hero: {
          type: 'image',
          url:
            'https://firebasestorage.googleapis.com/v0/b/nama-294515.appspot.com/o/LINEBOT%2Fcarousel%2FGroupIntroduceBot%2FIntroduceGroup4.jpg?alt=media',
          size: 'full',
          action: {
            type: 'message',
            label: 'Wow4',
            text: 'ว้าว4',
          },
        },
      },
      {
        type: 'bubble',
        hero: {
          type: 'image',
          url:
            'https://firebasestorage.googleapis.com/v0/b/nama-294515.appspot.com/o/LINEBOT%2Fcarousel%2FGroupIntroduceBot%2FIntroduceGroup5.jpg?alt=media',
          size: 'full',
          action: {
            type: 'message',
            label: 'Wow5',
            text: 'ว้าว5',
          },
        },
      },
      {
        type: 'bubble',
        hero: {
          type: 'image',
          url:
            'https://firebasestorage.googleapis.com/v0/b/nama-294515.appspot.com/o/LINEBOT%2Fcarousel%2FGroupIntroduceBot%2FIntroduceGroup6.jpg?alt=media',
          size: 'full',
          action: {
            type: 'message',
            label: 'Wow6',
            text: 'ว้าว6',
          },
        },
      },
    ],
  }

  const replyFlex: FlexMessage = {
    type: 'flex',
    altText: 'ยินดีที่ไม่รู้จัก',
    contents: flexCarouselContainer,
  }

  const replyText1: TextMessage = {
    type: 'text',
    text:
      'บ็อก ๆ ผมนามะนะครับ นามะแปลว่าถนัดเรื่องการนัดหมาย ถ้าเพื่อน ๆ อยากนัดเจอกันเมื่อไหร่ ปลุกนามะมาช่วยได้เลยนะครับพิมพ์ "นามะ" เพื่อปลุกนามะ',
  }

  lineClient.replyMessage(event.replyToken, [replyText1, replyFlex])
}
