const liffPrefix = 'https://liff.line.me'

export const storageUrl = 'https://firebasestorage.googleapis.com/v0/b/nama-294515.appspot.com/o'

export const getLiffUrl = {
  createEvent: () => `${liffPrefix}/${liffId.createEvent}`,
  checkStatus: () => `${liffPrefix}/${liffId.checkStatus}`,
  summary: () => `${liffPrefix}/${liffId.summary}`,
  addtoCalendar: () => `${liffPrefix}/${liffId.addtoCalendar}`,
}

export const liffId = {
  createEvent: '1655194495-kxjgmBQ6',
  checkStatus: '1655194495-dmpj59zq',
  summary: '1655194495-Ewpqr4jO',
  addtoCalendar: '1655194495-7AEALMp8',
}
