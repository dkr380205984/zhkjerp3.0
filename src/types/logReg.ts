export interface LoginInfo {
  sms_code?: string
  user_name: string
  password: string
}
export interface ForgetPasswordInfo {
  telephone: string
  sms_code: string
  new_pass: string
}