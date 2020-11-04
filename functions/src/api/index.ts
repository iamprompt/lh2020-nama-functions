import * as functions from 'firebase-functions'
import { getGroupMemberProfiles, getGroupSummary } from './group'
import { getUserProfile } from './users'

export const getProfile = functions.region('asia-northeast1').https.onRequest(async (req, res) => {
  if (req.query.userId === undefined) {
    res.status(400).send({ status: 'error', error: 'Please provide a userId like -> /getUserProfile?userId=xxxxxxxx' })
    return
  }

  const userId: string = <string>req.query.userId

  res.status(200).send({ status: 'success', data: { profile: await getUserProfile(userId) } })
})

export const getGroupMembers = functions.region('asia-northeast1').https.onRequest(async (req, res) => {
  if (req.query.groupId === undefined) {
    res
      .status(400)
      .send({ status: 'error', error: 'Please provide a groupId like -> /getGroupMember?groupId=xxxxxxxx' })
    return
  }

  const groupId: string = <string>req.query.groupId

  res.status(200).send({ status: 'success', data: { profile: await getGroupMemberProfiles(groupId) } })
})

export const getGroupInfo = functions.region('asia-northeast1').https.onRequest(async (req, res) => {
  if (req.query.groupId === undefined) {
    res.status(400).send({ status: 'error', error: 'Please provide a groupId like -> /getGroupInfo?groupId=xxxxxxxx' })
    return
  }

  const groupId: string = <string>req.query.groupId

  res.status(200).send({ status: 'success', data: { profile: await getGroupSummary(groupId) } })
})
