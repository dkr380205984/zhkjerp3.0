// 英文工厂信息
export interface ClientEN {
  name: string
  code: string
  address: string
  signature: string
  tel: string
  fax: string
  special_seal: string
}

// 英文银行信息
export interface BankEN {
  name: string
  address: string
  code: string
  beneficiary: string
  account_no: string
}

// HS编码
export interface HSCode {
  hs_code: string
  product_name: string
  export: string
  export_rebate: string
  temporary_export: string
  vat_rate: string
  most_favored_nation: string
  provisional_import_tariff: string
  import_general_duty: string
  consumption: string
  first_legal_unit: string
  second_statutory_unit: string
  first_legal_unit_code: string
  second_legal_unit_code: string
  regulatory_condition_info: string
  quarantine_category_code: string
  quarantine_category_details: string
  declaration_elements: string
}