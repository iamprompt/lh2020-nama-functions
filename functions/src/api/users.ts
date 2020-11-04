import { lineClient } from '../config'

export const getUserProfile = (userId: string) => {
  const profile = lineClient.getProfile(userId)
  return profile
}
