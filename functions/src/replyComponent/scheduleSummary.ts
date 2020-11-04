import { FlexBox, FlexContainer, FlexMessage, FlexSeparator } from '@line/bot-sdk'
import { EVENT_DETAIL } from '../@types'
import { notificationType } from '../constant'

export const eventSummaryFlex = (event: EVENT_DETAIL, flag: notificationType) => {
  const HeaderContent = HeaderEvent(event, flag)

  const BodyContent = BodyEvent(event, flag)

  const Footer = FooterEvent(event, flag)

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

const FooterEvent = (event: EVENT_DETAIL, flag: notificationType) => {
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
                data: `acknowledge&groupId=${event.groupId}&eventId=${event.eventId}`,
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

const HeaderEvent = (event: EVENT_DETAIL, flag: notificationType) => {
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
            text: event.eventTitle,
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
            text: event.eventTitle,
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

const BodyEvent = (event: EVENT_DETAIL, flag: notificationType) => {
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
          text: event.eventDate,
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
          text: event.eventTime,
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
          text: '@ampare, @Got, @Prompt, @Time,  @Palm',
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

    return summaryDetailContainer
  } else if (flag === notificationType.NOTI_EVENT_TIME || flag === notificationType.NOTI_EVERY_15M) {
    const AttendeeContainer: FlexBox = {
      type: 'box',
      layout: 'vertical',
      contents: [],
    }

    AttendeeContainer.contents.push(templatePersonStatus('Prompt', 'กำลังเดินทาง'))

    return AttendeeContainer
  }

  return
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
