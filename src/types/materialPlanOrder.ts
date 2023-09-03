export interface MaterialPlanOrderClient {
  year: string | number
  material_type: string | number
  client_id: string | number
  client_name?: string
  tree_data?: number[]
  total_number: string | number
  desc: string
  unit?: string
}