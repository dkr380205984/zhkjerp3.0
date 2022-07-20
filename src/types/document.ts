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