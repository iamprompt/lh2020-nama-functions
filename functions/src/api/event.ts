import { admin, lineClient } from '../config'
import { EVENT_DETAIL, FIRESTORE_EVENT_DETAIL } from '../@types'
import { userStatus } from '../constant'
import { eventSummaryFlex } from '../replyComponent/scheduleSummary'
import { FlexMessage } from '@line/bot-sdk'

export const createEvent = (groupId: string, /*userId: string,*/ event: EVENT_DETAIL) => {
  return new Promise(async (resolve, reject) => {
    const eventDateTimeText = `${event.eventDate} ${event.eventTime} UTC+7`
    const DateTime = Date.parse(eventDateTimeText)

    const finalEvent = {
      ...event,
      //...{ ownerId: userId },
      ...{ eventDateTime: admin.firestore.Timestamp.fromMillis(DateTime) },
    }
    // console.log(finalEvent)

    finalEvent.attendeeList = finalEvent.attendeeList.map((a) => {
      return {
        ...a,
        last_updated: admin.firestore.Timestamp.now(),
      }
    })

    console.log(groupId)
    console.log(event)

    const eventRef = admin.firestore().collection('nama').doc(groupId).collection('events')
    const activeEventSnap = await eventRef.where('eventStatus', '==', 'active').get()

    // console.log(activeEventSnap)
    if (activeEventSnap.empty) {
      eventRef.add(finalEvent as FIRESTORE_EVENT_DETAIL).then(
        async (docRef) => {
          // console.log(docRef.id)
          lineClient
            .pushMessage(<string>groupId, [
              <FlexMessage>await eventSummaryFlex(<string>groupId, <string>docRef.id, '0'),
            ])
            .then((result) => console.log(result))
            .catch((err) => console.log(err))

          resolve({ eventId: docRef.id })
        },
        (error) => {
          console.error(error)
          reject({ error: error })
        },
      )
    } else {
      console.log('More than one event')

      reject({ error: 'Only one event can be created at a time' })
    }
  })
}

export const getEvent = (groupId: string, eventId: string) => {
  return new Promise((resolve, reject) => {
    const eventRef = admin.firestore().collection('nama').doc(groupId).collection('events')
    const eventDocRef = eventRef.doc(eventId)

    eventDocRef.get().then(
      async (docRef) => {
        if (docRef.exists) {
          const data = docRef.data()

          console.log(data)

          // @ts-expect-error
          for (let i = 0; i < data.attendeeList.length; i++) {
            // @ts-expect-error
            const attendee = data.attendeeList[i]
            const profile = await lineClient.getGroupMemberProfile(groupId, attendee.userId)
            //console.log(profile)
            // @ts-expect-error
            data.attendeeList[i] = { ...data.attendeeList[i], ...profile }
          }

          resolve(data)
        } else reject({ error: 'Document do not exist' })
      },
      (error) => {
        console.error(error)
        reject({ error: error })
      },
    )
  })
}

export const getEventWId = (groupId: string) => {
  return new Promise(async (resolve, reject) => {
    const eventRef = admin.firestore().collection('nama').doc(groupId).collection('events')
    const activeEventSnap = await eventRef.where('eventStatus', '==', 'active').limit(1).get()

    if (!activeEventSnap.empty) {
      activeEventSnap.forEach(async (activeE) => {
        const eventId = activeE.id
        const activeEvent = activeE.data()

        console.log(activeEvent)

        for (let i = 0; i < activeEvent.attendeeList.length; i++) {
          const attendee = activeEvent.attendeeList[i]
          const profile = await lineClient.getGroupMemberProfile(groupId, attendee.userId)
          activeEvent.attendeeList[i] = { ...activeEvent.attendeeList[i], ...profile }
        }

        resolve({ ...{ eventId: eventId }, ...activeEvent })
      })
    } else reject({ error: 'Document do not exist' })
  })
}

export const cancelEvent = (groupId: string, eventId: string) => {
  return new Promise((resolve, reject) => {
    const eventRef = admin.firestore().collection('nama').doc(groupId).collection('events').doc(eventId)

    eventRef.update({ eventStatus: 'cancel' }).then(
      (docRef) => {
        resolve(docRef)
      },
      (error) => {
        console.error(error)
        reject({ error: error })
      },
    )
  })
}

export const updateUserStatus = (groupId: string, eventId: string, userId: string, status: userStatus) => {
  return new Promise((resolve, reject) => {
    const eventRef = admin.firestore().collection('nama').doc(groupId).collection('events').doc(eventId)

    admin
      .firestore()
      .runTransaction(async (transaction) => {
        return transaction.get(eventRef).then((eventDoc) => {
          if (!eventDoc.exists) reject({ error: 'Event does not exist!' })

          const doc = eventDoc.data()

          // @ts-expect-error
          for (let i = 0; i < doc.attendeeList.length; i++) {
            // @ts-expect-error
            if (doc.attendeeList[i].userId === userId) {
              // @ts-expect-error
              const currentStatus = doc.attendeeList[i].status

              const statusText =
                status === userStatus.UNSEEN
                  ? 'ยังไม่เห็นอะไรเลย'
                  : status === userStatus.ACKNOWLEDGED
                  ? 'รู้แล้ว'
                  : status === userStatus.TRAVELING
                  ? 'กำลังเดินทาง'
                  : status === userStatus.ARRIVED
                  ? 'ถึงแล้ว'
                  : ''

              /*if (currentStatus === userStatus.ARRIVED && status !== userStatus.ARRIVED) {
                break
              } else*/ if (
                (currentStatus === userStatus.TRAVELING || currentStatus === userStatus.ARRIVED) &&
                status === userStatus.ACKNOWLEDGED
              ) {
                break
              } else {
                // @ts-expect-error
                doc.attendeeList[i].status = status
                // @ts-expect-error
                doc.attendeeList[i].last_updated = admin.firestore.Timestamp.now()
                lineClient.pushMessage(userId, [
                  // @ts-expect-error
                  { type: 'text', text: `อัปเดตสถานะของนัดหมาย ${doc.eventName} เป็น ${statusText} เรียบร้อยแล้ว` },
                ])
                break
              }
            }
          }
          // @ts-expect-error
          transaction.update(eventRef, doc)
        })
      })
      .then(
        (docRef) => {
          resolve(docRef)
        },
        (error) => {
          console.error(error)
          reject({ error: error })
        },
      )
  })
}
