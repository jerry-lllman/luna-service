import { isUndefined } from 'lodash'

export type BaseType = string | number | boolean | undefined | null

function formatValue<T extends BaseType = string>(key: string, defaultValue: T, callback?: (value: string) => T): T {
  const value: string | undefined = process.env[key]
  if (isUndefined(value)) {
    return defaultValue
  }
  return callback ? callback(value) : (value as T)
}

export function env(key: string, defaultValue: string = '') {
  return formatValue(key, defaultValue)
}

export function envNumber(key: string, defaultValue: number = 0) {
  return formatValue(key, defaultValue, (value) => {
    try {
      return Number(value)
    }
    catch {
      throw new Error(`${key} environment variable is not a number`)
    }
  })
}

export function envBoolean(key: string, defaultValue: boolean = false) {
  return formatValue(key, defaultValue, (value) => {
    try {
      return Boolean(JSON.parse(value))
    }
    catch {
      throw new Error(`${key} environment variable is not a boolean`)
    }
  })
}
