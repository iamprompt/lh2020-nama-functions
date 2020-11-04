import * as dotenv from 'dotenv'

dotenv.config()

import { Client } from '@line/bot-sdk'

export const lineClient = new Client({
  channelAccessToken: <string>process.env.channelAccessToken,
  channelSecret: <string>process.env.channelSecret,
})
