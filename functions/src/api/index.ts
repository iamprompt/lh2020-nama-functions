import { FlexMessage } from '@line/bot-sdk'
import * as functions from 'firebase-functions'
import { lineClient } from '../config'
import { userStatus } from '../constant'
import { eventSummaryFlex } from '../replyComponent/scheduleSummary'
import { createEvent, cancelEvent, getEvent, updateUserStatus, getEventWId } from './event'
import { getGroupMemberProfiles, getGroupSummary } from './group'
import { getUserProfile } from './users'
// eslint-disable-next-line
const cors = require('cors')({ origin: true })

export const getProfile = functions.region('asia-northeast1').https.onRequest(async (req, res) => {
  if (req.query.userId === undefined) {
    res.status(400).send({ status: 'error', error: 'Please provide userId like -> /getUserProfile?userId=xxxxxxxx' })
    return
  }

  const userId: string = <string>req.query.userId

  res.status(200).send({ status: 'success', data: { profile: await getUserProfile(userId) } })
})

export const getGroupMembers = functions.region('asia-northeast1').https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    if (req.query.groupId === undefined) {
      res
        .status(400)
        .send({ status: 'error', error: 'Please provide groupId like -> /getGroupMember?groupId=xxxxxxxx' })
      return
    }

    const groupId: string = <string>req.query.groupId

    res.status(200).send({ status: 'success', data: { profile: await getGroupMemberProfiles(groupId) } })
  })
})

export const getGroupInfo = functions.region('asia-northeast1').https.onRequest(async (req, res) => {
  if (req.query.groupId === undefined) {
    res.status(400).send({ status: 'error', error: 'Please provide groupId like -> /getGroupInfo?groupId=xxxxxxxx' })
    return
  }

  const groupId: string = <string>req.query.groupId

  res.status(200).send({ status: 'success', data: { profile: await getGroupSummary(groupId) } })
})

export const event = functions.region('asia-northeast1').https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*')

  if (req.method === 'OPTIONS') {
    // Send response to OPTIONS requests
    res.set('Access-Control-Allow-Methods', 'GET')
    res.set('Access-Control-Allow-Headers', 'Content-Type')
    res.set('Access-Control-Max-Age', '3600')
    res.status(204).send('')
  } else {
    console.log(req.body)
    console.log(req.query)
    try {
      // Create an event
      if (req.method === 'POST') {
        console.log('HERE POST')

        if (req.query.groupId === undefined /*|| req.query.userId === undefined*/) {
          res.status(400).send({
            status: 'error',
            error: '[POST] Please provide groupId and userId like -> /event?groupId=xxxxxxxx&userId=xxxxxxxxx',
          })
          return
        }

        // console.log(req.body)

        const { groupId /*, userId*/ } = req.query
        const eventForm = req.body
        res
          .status(200)
          .send({ status: 'success', data: await createEvent(<string>groupId, /*<string>userId,*/ eventForm) })
        return
      } else if (req.method === 'GET') {
        console.log('HERE GET')
        if (req.query.eventId === undefined) {
          if (req.query.groupId === undefined) {
            res.status(400).send({
              status: 'error',
              error: '[GET] Please provide groupId and eventId like -> /event?groupId=xxxxxxxx&eventId=xxxxxxxxx',
            })
            return
          }
          const { groupId } = req.query
          res.status(200).send({ status: 'success', data: await getEventWId(<string>groupId) })
          return
        } else {
          console.log('HERE GET')
          if (req.query.groupId === undefined || req.query.eventId === undefined) {
            res.status(400).send({
              status: 'error',
              error: '[GET] Please provide groupId and eventId like -> /event?groupId=xxxxxxxx&eventId=xxxxxxxxx',
            })
            return
          }
          const { groupId, eventId } = req.query
          res.status(200).send({ status: 'success', data: await getEvent(<string>groupId, <string>eventId) })
          return
        }
      } else if (req.method === 'DELETE') {
        console.log('HERE DELETE')
        if (req.query.groupId === undefined || req.query.eventId === undefined) {
          res.status(400).send({
            status: 'error',
            error: '[DELETE] Please provide groupId and eventId like -> /event?groupId=xxxxxxxx&eventId=xxxxxxxxx',
          })
          return
        }

        const { groupId, eventId } = req.query
        res.status(200).send({ status: 'success', data: await cancelEvent(<string>groupId, <string>eventId) })
        return
      }
    } catch (error) {
      res.status(400).send({ status: 'error', data: error })
      return
    }

    res.status(405).send({ status: 'error', error: 'Method Not Allowed' })
  }
})

export const status = functions.region('asia-northeast1').https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*')

  if (req.method === 'OPTIONS') {
    // Send response to OPTIONS requests
    res.set('Access-Control-Allow-Methods', 'GET')
    res.set('Access-Control-Allow-Headers', 'Content-Type')
    res.set('Access-Control-Max-Age', '3600')
    res.status(204).send('')
  } else {
    // Create an event
    if (req.method === 'POST') {
      if (req.query.groupId === undefined || req.query.userId === undefined || req.query.status === undefined) {
        res.status(400).send({
          status: 'error',
          error: '[POST] Please provide groupId and userId like -> /event?groupId=xxxxxxxx&userId=xxxxxxxxx',
        })
        return
      }
      // console.log(req.body)

      const { groupId, userId, status } = req.query

      const event = await getEventWId(<string>groupId)

      res.status(200).send({
        status: 'success',
        data: {
          //@ts-expect-error
          update: await updateUserStatus(<string>groupId, <string>event.eventId, <string>userId, <userStatus>status),
        },
      })
      return
    }

    res.status(405).send({ status: 'error', error: 'Method Not Allowed' })
  }
})

export const sendSummary = functions.region('asia-northeast1').https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*')

  if (req.method === 'OPTIONS') {
    // Send response to OPTIONS requests
    res.set('Access-Control-Allow-Methods', 'GET')
    res.set('Access-Control-Allow-Headers', 'Content-Type')
    res.set('Access-Control-Max-Age', '3600')
    res.status(204).send('')
  } else {
    // Create an event
    if (req.method === 'POST') {
      if (req.query.groupId === undefined || req.query.flag === undefined) {
        res.status(400).send({
          status: 'error',
          error: '[POST] Please provide groupId, eventId, and flag like -> /event?groupId=xxxxxxxx&userId=xxxxxxxxx',
        })
        return
      }

      // console.log(req.body)

      const { groupId, flag } = req.query

      const event = await getEventWId(<string>groupId)

      lineClient.pushMessage(<string>groupId, [
        // @ts-expect-error
        <FlexMessage>await eventSummaryFlex(<string>groupId, <string>event.eventId, <number>flag),
      ])

      res.status(200).send({
        status: 'success',
        data: '',
      })
      return
    }

    res.status(405).send({ status: 'error', error: 'Method Not Allowed' })
  }
})
