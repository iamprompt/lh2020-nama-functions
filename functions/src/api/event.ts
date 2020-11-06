import { firestore, firestoreX, lineClient } from '../config'
import { EVENT_DETAIL, FIRESTORE_EVENT_DETAIL } from '../@types'
import { userStatus } from '../constant'

export const createEvent = (groupId: string, userId: string, event: EVENT_DETAIL) => {
  return new Promise((resolve, reject) => {
    const eventDateTimeText = `${event.eventDate} ${event.eventTime} UTC+7`
    const DateTime = Date.parse(eventDateTimeText)

    const finalEvent = {
      ...event,
      ...{ ownerId: userId },
      ...{ eventDateTime: firestoreX.Timestamp.fromMillis(DateTime) },
    }
    console.log(finalEvent)

    firestore
      .collection('nama')
      .doc(groupId)
      .collection('events')
      .add(finalEvent as FIRESTORE_EVENT_DETAIL)
      .then(
        (docRef) => {
          console.log(docRef.id)
          resolve({ eventId: docRef.id })
        },
        (error) => {
          console.error(error)
          reject({ error: error })
        },
      )
  })
}

export const getEvent = (groupId: string, eventId: string) => {
  return new Promise((resolve, reject) => {
    firestore
      .collection('nama')
      .doc(groupId)
      .collection('events')
      .doc(eventId)
      .get()
      .then(
        async (docRef) => {
          if (docRef.exists) {
            const data = docRef.data()

            console.log(data)

            // @ts-expect-error
            for (let i = 0; i < data.attendeeList.length; i++) {
              // @ts-expect-error
              const attendee = data.attendeeList[i]
              const profile = await lineClient.getGroupMemberProfile(groupId, attendee.userId)
              console.log(profile)
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

export const deleteEvent = (groupId: string, eventId: string) => {
  return new Promise((resolve, reject) => {
    firestore
      .collection('nama')
      .doc(groupId)
      .collection('events')
      .doc(eventId)
      .delete()
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

export const updateUserStatus = (groupId: string, eventId: string, userId: string, status: userStatus) => {
  return new Promise((resolve, reject) => {
    const eventRef = firestore.collection('nama').doc(groupId).collection('events').doc(eventId)

    firestore
      .runTransaction((transaction) => {
        return transaction.get(eventRef).then((eventDoc) => {
          if (!eventDoc.exists) reject({ error: 'Event does not exist!' })

          const doc = eventDoc.data()

          // @ts-expect-error
          for (let i = 0; i < doc.attendeeList.length; i++) {
            // @ts-expect-error
            if (doc.attendeeList[i].userId === userId) {
              // @ts-expect-error
              doc.attendeeList[i].status = status
              break
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
