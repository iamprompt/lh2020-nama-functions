import * as dotenv from 'dotenv'

dotenv.config()

import { Client } from '@line/bot-sdk'
import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'

export const lineClient = new Client({
  channelAccessToken: <string>process.env.channelAccessToken,
  channelSecret: <string>process.env.channelSecret,
})

// import serviceAccount from './serviceAccountKey.json'

admin.initializeApp(functions.config().firebase)

export const firestore = admin.firestore()

export const firestoreX = admin.firestore
