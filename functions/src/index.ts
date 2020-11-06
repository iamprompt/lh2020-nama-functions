import * as functions from 'firebase-functions'
import { handleEvents } from './webhook'
import { WebhookRequestBody } from '@line/bot-sdk'
export * from './api'

export const LINEHook = functions.region('asia-northeast1').https.onRequest(async (req, res) => {
  // functions.logger.info(req.method)
  // functions.logger.info(req.body)

  if (req.method === 'POST') {
    const body: WebhookRequestBody = req.body
    try {
      const result = await handleEvents(body.events)
      functions.logger.log({ status: 'success', data: result })
      res.status(200).send({ status: 'success', data: result })
    } catch (error) {
      functions.logger.error({ status: 'error', ...error })
      res.status(400).send({ status: 'error', ...error })
    }
  } else {
    res.status(400).send({ status: 'error', error: 'Use Method POST to access the webhook' })
  }
})
