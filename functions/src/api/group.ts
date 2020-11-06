import { Profile } from '@line/bot-sdk'
import { lineClient } from '../config'

export const getGroupMemberProfiles = async (groupId: string) => {
  const groupMemberIds = await lineClient.getGroupMemberIds(groupId)

  const groupMemberProfiles: Profile[] = await Promise.all(
    groupMemberIds.map((id) => lineClient.getGroupMemberProfile(groupId, id)),
  )

  return groupMemberProfiles
}

export const getGroupMemberProfile = (groupId: string, userId: string) => {
  return lineClient.getGroupMemberProfile(groupId, userId)
}

export const getGroupSummary = async (groupId: string) => {
  const groupInfo = await lineClient.getGroupSummary(groupId)

  return { ...groupInfo, members: await getGroupMemberProfiles(groupId) }
}
