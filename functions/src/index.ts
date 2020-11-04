import * as functions from 'firebase-functions'
import { handleEvents } from './webhook'
import { WebhookRequestBody } from '@line/bot-sdk'
export * from './api'

export const LINEHook = functions.region('asia-northeast1').https.onRequest((req, res) => {
  // Watch All Request Body
  const body: WebhookRequestBody = req.body
  functions.logger.info(body)

  if (req.method === 'POST') {
    handleEvents(body.events)
    res.status(200).send('Great Job!!')
  } else {
    // Response send as 200 : Good
    res.status(200).send('Work Great')
  }
})
