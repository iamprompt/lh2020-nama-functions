import { FlexMessage } from '@line/bot-sdk'
import * as functions from 'firebase-functions'
import { EVENT_DETAIL } from '../@types'
import { lineClient } from '../config'
import { userStatus } from '../constant'
import { eventSummaryFlex } from '../replyComponent/scheduleSummary'
import { createEvent, cancelEvent, getEvent, updateUserStatus } from './event'
import { getGroupMemberProfiles, getGroupSummary } from './group'
import { getUserProfile } from './users'

export const getProfile = functions.region('asia-northeast1').https.onRequest(async (req, res) => {
  if (req.query.userId === undefined) {
    res.status(400).send({ status: 'error', error: 'Please provide userId like -> /getUserProfile?userId=xxxxxxxx' })
    return
  }

  const userId: string = <string>req.query.userId

  res.status(200).send({ status: 'success', data: { profile: await getUserProfile(userId) } })
})

export const getGroupMembers = functions.region('asia-northeast1').https.onRequest(async (req, res) => {
  if (req.query.groupId === undefined) {
    res.status(400).send({ status: 'error', error: 'Please provide groupId like -> /getGroupMember?groupId=xxxxxxxx' })
    return
  }

  const groupId: string = <string>req.query.groupId

  res.status(200).send({ status: 'success', data: { profile: await getGroupMemberProfiles(groupId) } })
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
  // Create an event
  if (req.method === 'POST') {
    if (req.query.groupId === undefined || req.query.userId === undefined) {
      res.status(400).send({
        status: 'error',
        error: '[POST] Please provide groupId and userId like -> /event?groupId=xxxxxxxx&userId=xxxxxxxxx',
      })
      return
    }

    // console.log(req.body)

    const { groupId, userId } = req.query
    const eventForm: EVENT_DETAIL = req.body
    res.status(200).send({ status: 'success', data: await createEvent(<string>groupId, <string>userId, eventForm) })
    return
  } else if (req.method === 'GET') {
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
  } else if (req.method === 'DELETE') {
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

  res.status(405).send({ status: 'error', error: 'Method Not Allowed' })
})

export const status = functions.region('asia-northeast1').https.onRequest(async (req, res) => {
  // Create an event
  if (req.method === 'POST') {
    if (
      req.query.groupId === undefined ||
      req.query.eventId === undefined ||
      req.query.userId === undefined ||
      req.query.status === undefined
    ) {
      res.status(400).send({
        status: 'error',
        error: '[POST] Please provide groupId and userId like -> /event?groupId=xxxxxxxx&userId=xxxxxxxxx',
      })
      return
    }

    // console.log(req.body)

    const { groupId, userId, eventId, status } = req.query
    res.status(200).send({
      status: 'success',
      data: await updateUserStatus(<string>groupId, <string>eventId, <string>userId, <userStatus>status),
    })
    return
  }

  res.status(405).send({ status: 'error', error: 'Method Not Allowed' })
})

export const sendSummary = functions.region('asia-northeast1').https.onRequest(async (req, res) => {
  // Create an event
  if (req.method === 'POST') {
    if (req.query.groupId === undefined || req.query.eventId === undefined || req.query.flag === undefined) {
      res.status(400).send({
        status: 'error',
        error: '[POST] Please provide groupId, eventId, and flag like -> /event?groupId=xxxxxxxx&userId=xxxxxxxxx',
      })
      return
    }

    // console.log(req.body)

    const { groupId, eventId, flag } = req.query

    lineClient.pushMessage(<string>groupId, [
      // @ts-expect-error
      <FlexMessage>await eventSummaryFlex(<string>groupId, <string>eventId, <number>flag),
    ])

    res.status(200).send({
      status: 'success',
      data: '',
    })
    return
  }

  res.status(405).send({ status: 'error', error: 'Method Not Allowed' })
})
