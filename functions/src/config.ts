import { Client } from '@line/bot-sdk'
import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'
import serviceAccount from './serviceAccountKey.json'

export const lineClient = new Client({
  channelAccessToken: functions.config().line.accesstoken,
  channelSecret: functions.config().line.secret,
})

admin.initializeApp({ credential: admin.credential.cert(<admin.ServiceAccount>serviceAccount) })

export { admin }
