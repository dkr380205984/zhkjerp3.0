export interface UserInfo {
  name: string
  user_name: string
  password: string
  phone: string
  is_admin: 1 | 2 // 1：超管 2：普通用户
  module_info: any[]
  station: string // 岗位
  group_id: number | string
  sms_code: string // 验证码
  has_check: boolean // 审核权限
}