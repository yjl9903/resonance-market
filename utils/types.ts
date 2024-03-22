export interface CityInfo {
  name: string

  products: ProductInfo[]
}

export interface ProductInfo {
  city: string

  name: string

  type: 'normal' | 'specialty' | 'manufacture'

  valuable: boolean

  // 基础货量，null 表示制造
  baseVolume: number | null

  // 基准价格
  basePrice: number

  // 成本，null 表示时价
  cost: number | null

  transactions: TransactionInfo[]
}

export interface TransactionInfo {
  name: string

  sourceCity: string

  targetCity: string

  mileage: number

  basePrice: number
}
