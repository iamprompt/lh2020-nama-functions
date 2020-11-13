import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import { handleEvents } from './webhook'
import { WebhookRequestBody } from '@line/bot-sdk'
import Axios from 'axios'
export * from './api'
// eslint-disable-next-line

const runtimeOpts: functions.RuntimeOptions = {
  timeoutSeconds: 300,
  memory: '2GB',
}

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

exports.createCustomToken = functions
  .region('asia-northeast1')
  .runWith(runtimeOpts)
  .https.onRequest((request, response) => {
    response.set('Access-Control-Allow-Origin', '*')

    if (request.method === 'OPTIONS') {
      // Send response to OPTIONS requests
      response.set('Access-Control-Allow-Methods', 'GET')
      response.set('Access-Control-Allow-Headers', 'Content-Type')
      response.set('Access-Control-Max-Age', '3600')
      response.status(204).send('')
    } else {
      console.log(request.rawBody)
      if (request.body.access_token === undefined) {
        const ret = {
          error_message: 'AccessToken not found',
        }

        console.error(ret)
        response.status(400).send(ret)
        return
      }

      verifyLineToken(request.body)
        .then((customAuthToken) => {
          const ret = {
            firebase_token: customAuthToken,
          }

          console.log(ret)
          response.status(200).send(ret)
          return
        })
        .catch((err) => {
          const ret = {
            error_message: `Authentication error: ${err}`,
          }

          console.log(ret)
          response.status(200).send(ret)
          return
        })
    }
  })

const verifyLineToken = async (body: any) => {
  return Axios.get(`https://api.line.me/oauth2/v2.1/verify?access_token=${body.access_token}`)
    .then((response) => {
      console.log(response)

      if (response.data.client_id !== functions.config().line.channelid) {
        return Promise.reject(new Error('LINE channel ID mismatched'))
      }
      return getFirebaseUser(body)
    })
    .then((userRecord) => {
      return admin.auth().createCustomToken(userRecord.uid)
    })
    .then((token) => {
      return token
    })
}

const getFirebaseUser = async (body: any) => {
  const firebaseUid = `${body.id}`

  return admin
    .auth()
    .getUser(firebaseUid)
    .then(function (userRecord) {
      return userRecord
    })
    .catch((error) => {
      if (error.code === 'auth/user-not-found') {
        return admin.auth().createUser({
          uid: firebaseUid,
          displayName: body.displayName,
          photoURL: body.pictureUrl,
          email: body.email,
        })
      }
      return Promise.reject(error)
    })
}
