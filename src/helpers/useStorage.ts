import { createContext } from 'preact'
import { useContext } from 'preact/hooks'
import { emit } from '@create-figma-plugin/utilities'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type StorageValue = any
export type ClientStorage = Record<string, StorageValue>

const StorageContext = createContext({})
const RuntimeStorage: ClientStorage = {}

const useStorage = () => {
  const getStorage = (): ClientStorage => ({ ...useContext(StorageContext), ...RuntimeStorage })
  const get = (key: string) => {
    if (typeof RuntimeStorage[key] !== 'undefined') return RuntimeStorage[key]
    const storage = getStorage()
    return typeof storage[key] === 'undefined' ? undefined : storage[key]
  }
  const set = (key: string, value: StorageValue) => {
    RuntimeStorage[key] = value
    emit('SET_CLIENT_STORAGE', key, value)
  }
  return {
    StorageContext,
    getStorage,
    set,
    get,
  }
}
export default useStorage

// for main.ts
export const getClientStorage = async () => {
  const keys = await figma.clientStorage.keysAsync()
  const values = await Promise.all(keys.map((key) => figma.clientStorage.getAsync(key)))
  return values.reduce((res, value, i) => {
    res[keys[i]] = value
    return res
  }, {})
}
