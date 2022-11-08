export class NotifyMessage extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'NotifyMessage'
  }
}

export class PluginError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'PluginError'
  }
}

const currentNotifications: Record<string, NotificationHandler> = {}

export default (name: string) => {
  const setNotify = (msg: string, opts?: NotificationOptions) => {
    currentNotifications[name] = figma.notify(msg, opts)
  }

  const setErrorNotify = (
    msg: string,
    opts?: NotificationOptions,
    returnError = true
  ) => {
    setNotify(msg, { ...opts, error: true })
    if (returnError) {
      return new PluginError(msg)
    }
  }
  const clearNotify = () => {
    if (currentNotifications[name]) currentNotifications[name].cancel()
  }
  return {
    currentNotifications,
    setNotify,
    setErrorNotify,
    clearNotify,
  }
}
