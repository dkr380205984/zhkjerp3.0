import { OrderInfo } from "./order"

export interface DocumentInfo {
  id?: string | number
  document_orders: number[] | OrderInfo[]
  po: string
  invoice: string
  payment: string
  to_company_name: string
  to_company_address: string
  order_date: string
  ex_factory_date: string
  shipment_date: string
  from_address: string
  to_address: string
  loading_port: string
  destination_port: string
  currency_system: string
}
export interface CLInfo {
  document_id: string
  bank: string
  address: string
  code: string
  beneficiary: string
  account_no: string
  remarks: string
  to_company_name: string
  to_company_address: string
  invoice: string
  po: string
  order_date: string
  from_address: string
  to_address: string
  payment: string
  shipment_date: string
  total_for: string
  orderInfo: Array<{
    order_data: Array<{
      style_no: string
      desc: string
      qty_pcs: string
      unit_price: string
      amount: string
    }>
    price_data: Array<{
      content: string
      price: string
    }>
    order_no: string
    pcs: string
    amount: string
  }>
}
export interface PLInfo {
  document_id: string
  to_company_name: string
  to_company_address: string
  invoice: string
  po: string
  order_date: string
  from_address: string
  to_address: string
  payment: string
  shipment_date: string
  box_orders: Array<
    {
      ctn_no: string
      order_no: string
      item_number: string
      description: string
      size: string
      number: string
      ctn_total: string
      nwkgs: string
      gwkgs: string
      volume: string
    }>
  remarks: string
}

