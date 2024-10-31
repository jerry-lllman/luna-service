export const RESPONSE_SUCCESS_CODE = 200

export const RESPONSE_SUCCESS_MESSAGE = 'success'

/**
 * @description: contentType
 */
export enum ContentTypeEnum {
  // JSON
  JSON = 'application/json; charset=utf-8',
  // Form-Data qs
  FORM_URLENCODED = 'application/x-www-form-urlencoded; charset=utf-8',
  // Form-Data upload
  FORM_DATA = 'multipart/form-data; charset=utf-8',
}
