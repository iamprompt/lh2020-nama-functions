export enum messageType {
  TEXT = 'text',
  IMAGE = 'image',
  VDO = 'video',
  AUDIO = 'audio',
  FILE = 'file',
  LOCATION = 'location',
  STICKER = 'sticker',
}

export enum textTrigger {
  NAMA_TH = 'นามะ',
  NAMA_EN = 'nama',
  CREATE_EVENT = '#สร้างนัดหมาย',
  STATUS_CHECK = '#เช็กสถานะ',
}

export enum notificationType {
  SUMMARY_EVENT,
  NOTI_1D,
  NOTI_60M,
  NOTI_EVENT_TIME,
  NOTI_EVERY_15M,
}
