import { FlexBox, FlexContainer, FlexMessage, FlexSeparator } from '@line/bot-sdk'
import { FIRESTORE_EVENT_DETAIL } from '../@types'
import { getEvent } from '../api/event'
import { notificationType } from '../constant'

import { format } from 'date-fns'
import { th } from 'date-fns/locale'
import { lineClient } from '../config'

export const eventSummaryFlex = async (groupId: string, eventId: string, flag: notificationType) => {
  const event = await getEvent(groupId, eventId)
  const HeaderContent = HeaderEvent(<FIRESTORE_EVENT_DETAIL>event, flag)

  const BodyContent = await BodyEvent(groupId, <FIRESTORE_EVENT_DETAIL>event, flag)

  const Footer = FooterEvent(groupId, eventId, <FIRESTORE_EVENT_DETAIL>event, flag)

  const FlexContent: FlexContainer = {
    type: 'bubble',
    size: 'mega',
    header: HeaderContent,
    body: BodyContent,
    footer: Footer,
  }

  const FlexMessageContainer: FlexMessage = {
    type: 'flex',
    altText: 'มีนัดหมายใหม่',
    contents: FlexContent,
  }

  return FlexMessageContainer
}

const FooterEvent = (
  groupId: string,
  eventId: string,
  event: FIRESTORE_EVENT_DETAIL,
  flag: notificationType | number,
) => {
  const textLabel: string =
    flag === notificationType.NOTI_60M
      ? 'ใกล้แล้ว ใกล้แล้ว ตื่นเต้น ตื่นเต้น'
      : flag === notificationType.NOTI_EVENT_TIME
      ? 'ถึงเวลานัดแล้วน้า เร็วเข้า เพื่อนๆ รออยู่น้า'
      : ''

  if (flag === notificationType.SUMMARY_EVENT) {
    return {
      type: 'box',
      layout: 'vertical',
      contents: [
        {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'button',
              action: {
                type: 'postback',
                label: 'โอเคเลย',
                data: `acknowledge?groupId=${groupId}&eventId=${eventId}`,
              },
              style: 'primary',
              color: '#F06129',
            },
          ],
          paddingTop: '0px',
          paddingStart: '20px',
          paddingEnd: '20px',
          paddingBottom: '10px',
        },
      ],
    } as FlexBox
  } else if (
    flag === notificationType.NOTI_60M ||
    flag === notificationType.NOTI_EVENT_TIME ||
    flag === notificationType.NOTI_EVERY_15M
  ) {
    const outerBox: FlexBox = {
      type: 'box',
      layout: 'vertical',
      contents: [],
      backgroundColor: '#F2F2F2',
    }

    const textBox: FlexBox = {
      type: 'box',
      layout: 'vertical',
      margin: 'lg',
      contents: [
        {
          type: 'text',
          text: textLabel,
          align: 'center',
          weight: 'bold',
          wrap: true,
        },
      ],
    }

    const buttonBox: FlexBox = {
      type: 'box',
      layout: 'horizontal',
      contents: [
        {
          type: 'button',
          action: {
            type: 'postback',
            label: 'กำลังเดินทาง',
            data: 'acknowledge',
          },
          style: 'primary',
          color: '#F06129',
        },
        {
          type: 'button',
          action: {
            type: 'uri',
            label: 'ถึงแล้ว',
            uri: 'http://linecorp.com/',
          },
          color: '#F06129',
          style: 'primary',
        },
      ],
      paddingTop: '10px',
      paddingBottom: '10px',
      paddingStart: '10px',
      paddingEnd: '10px',
      //@ts-expect-error
      justifyContent: 'space-between',
      spacing: 'md',
    }

    const bottomAction: FlexBox = {
      type: 'box',
      layout: 'vertical',
      contents: [
        {
          type: 'button',
          action: {
            type: 'uri',
            label: 'เช็กสถานะเพื่อน',
            uri: 'http://linecorp.com/',
          },
          height: 'sm',
          color: '#F06129',
        },
      ],
    }

    flag !== notificationType.NOTI_EVERY_15M ? outerBox.contents.push(textBox) : {}
    outerBox.contents.push(buttonBox, bottomAction)

    return outerBox
  }
  return
}

const HeaderEvent = (event: FIRESTORE_EVENT_DETAIL, flag: notificationType) => {
  const headerContainer: FlexBox = {
    type: 'box',
    layout: 'horizontal',
    contents: [],
    paddingAll: '20px',
    spacing: 'md',
    height: '80px',
    // @ts-expect-error
    background: {
      type: 'linearGradient',
      angle: '180deg',
      startColor: '#F06129',
      endColor: '#FF9A3D',
    },
    alignItems: 'center',
  }

  if (
    flag === notificationType.SUMMARY_EVENT ||
    flag === notificationType.NOTI_1D ||
    flag === notificationType.NOTI_60M
  ) {
    const EventNameHeader: Array<FlexBox> = [
      {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'text',
            text: event.eventName,
            color: '#ffffff',
            size: 'md',
            flex: 4,
            weight: 'bold',
            wrap: true,
          },
        ],
        position: 'absolute',
        offsetStart: '20px',
        offsetEnd: '80px',
      },
      {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'image',
            url:
              'https://firebasestorage.googleapis.com/v0/b/nama-294515.appspot.com/o/LINEBOT%2Ficon%2FProfile.jpg?alt=media',
            position: 'relative',
            aspectMode: 'cover',
            size: 'xs',
            aspectRatio: '1:1',
          },
        ],
        position: 'absolute',
        offsetEnd: '15px',
        cornerRadius: '100px',
      },
    ]
    headerContainer.contents.push(...EventNameHeader)
    return headerContainer
  } else if (flag === notificationType.NOTI_EVENT_TIME || flag === notificationType.NOTI_EVERY_15M) {
    const shibaCorner: FlexBox = {
      type: 'box',
      layout: 'vertical',
      contents: [
        {
          type: 'image',
          url:
            'https://firebasestorage.googleapis.com/v0/b/nama-294515.appspot.com/o/LINEBOT%2Ficon%2Fshiba_corner.png?alt=media&p=1',
          size: 'full',
        },
      ],
      position: 'absolute',
      height: '100px',
      width: '100px',
      offsetBottom: '-25px',
      offsetEnd: '-30px',
    }

    const shibaUpset: FlexBox = {
      type: 'box',
      layout: 'vertical',
      contents: [
        {
          type: 'image',
          url:
            'https://firebasestorage.googleapis.com/v0/b/nama-294515.appspot.com/o/LINEBOT%2Ficon%2Fshiba_upset.png?alt=media&p=1',
          size: 'full',
        },
      ],
      position: 'absolute',
      height: '70px',
      width: '70px',
      offsetBottom: '-20px',
      offsetEnd: '5px',
    }

    const Label: string =
      flag === notificationType.NOTI_EVENT_TIME
        ? 'ถึงเวลานัดแล้ว!'
        : flag === notificationType.NOTI_EVERY_15M
        ? 'สายแล้วน้า'
        : ''

    const LabelNameHeader: Array<FlexBox> = [
      {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'text',
            text: Label,
            color: '#ffffff',
            size: 'xl',
            flex: 4,
            weight: 'bold',
            wrap: true,
          },
          {
            type: 'text',
            text: event.eventName,
            size: 'sm',
            color: '#ffffff',
            weight: 'regular',
          },
        ],
        position: 'absolute',
        offsetStart: '20px',
        offsetEnd: '80px',
      },
    ]

    flag === notificationType.NOTI_EVENT_TIME
      ? LabelNameHeader.push(shibaCorner)
      : flag === notificationType.NOTI_EVERY_15M
      ? LabelNameHeader.push(shibaUpset)
      : {}
    headerContainer.contents.push(...LabelNameHeader)
    return headerContainer
  }
  return
}

const BodyEvent = (groupId: string, event: FIRESTORE_EVENT_DETAIL, flag: notificationType) => {
  return new Promise<FlexBox>(async (resolve, reject) => {
    if (
      flag === notificationType.SUMMARY_EVENT ||
      flag === notificationType.NOTI_1D ||
      flag === notificationType.NOTI_60M
    ) {
      const summaryDetailContainer: FlexBox = {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'box',
            layout: 'horizontal',
            margin: 'lg',
            contents: [],
          },
        ],
      }

      const DateTime = event.eventDateTime?.toDate()
      const eventDate = format(<Date>DateTime, 'dd MMM yyyy', { locale: th })
      const eventTime = `${format(<Date>DateTime, 'HH:mm', { locale: th })} น.`

      const DateBox: FlexBox = {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'text',
            text: 'วันที่',
            weight: 'bold',
            size: 'sm',
          },
          {
            type: 'text',
            text: eventDate,
            weight: 'bold',
            size: 'md',
          },
        ],
        width: '50%',
      }

      const TimeBox: FlexBox = {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'text',
            text: 'เวลา',
            align: 'end',
            size: 'sm',
            weight: 'bold',
          },
          {
            type: 'text',
            text: eventTime,
            align: 'end',
            weight: 'bold',
            size: 'md',
          },
        ],
      }

      const DateTimeBoxRow: FlexBox = {
        type: 'box',
        layout: 'horizontal',
        margin: 'none',
        contents: [DateBox, TimeBox],
      }

      const Separator: FlexSeparator = {
        type: 'separator',
        margin: 'lg',
      }

      const LocationBox: FlexBox = {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'text',
            text: 'สถานที่',
            weight: 'bold',
            size: 'sm',
          },
          {
            type: 'text',
            text: event.eventLocation,
            weight: 'bold',
          },
        ],
      }

      const LocationBoxRow: FlexBox = {
        type: 'box',
        layout: 'horizontal',
        margin: 'lg',
        contents: [LocationBox],
      }

      const attendeeArray = []

      for (let i = 0; i < event.attendeeList.length; i++) {
        const attendee = event.attendeeList[i]
        const profile = await lineClient.getGroupMemberProfile(groupId, attendee.userId)
        // console.log(profile)
        attendeeArray.push(`@${profile.displayName}`)
      }

      const AttendeeBox: FlexBox = {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'text',
            text: 'สมาชิก',
            size: 'sm',
            weight: 'bold',
          },
          {
            type: 'text',
            text: attendeeArray.join(', '),
            size: 'md',
            wrap: true,
            color: '#29A1C7',
            margin: 'sm',
          },
        ],
      }

      const AttendeeBoxRow: FlexBox = {
        type: 'box',
        layout: 'vertical',
        contents: [AttendeeBox],
      }

      summaryDetailContainer.contents.push(DateTimeBoxRow, Separator, LocationBoxRow, Separator, AttendeeBoxRow)

      resolve(summaryDetailContainer)
    } else if (flag === notificationType.NOTI_EVENT_TIME || flag === notificationType.NOTI_EVERY_15M) {
      const AttendeeContainer: FlexBox = {
        type: 'box',
        layout: 'vertical',
        contents: [],
      }

      AttendeeContainer.contents.push(templatePersonStatus('Prompt', 'กำลังเดินทาง'))

      resolve(AttendeeContainer)
    }

    reject()
  })
}

const templatePersonStatus = (userName: string, statusFlag: string) => {
  return {
    type: 'box',
    layout: 'horizontal',
    margin: 'xs',
    contents: [
      {
        type: 'text',
        text: `@${userName}`,
        weight: 'bold',
        align: 'start',
        color: '#F02929',
      },
      {
        type: 'text',
        text: statusFlag,
        align: 'end',
        weight: 'bold',
        color: '#828282',
      },
    ],
  } as FlexBox
}
