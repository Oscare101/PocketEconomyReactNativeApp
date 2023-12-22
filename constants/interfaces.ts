export interface Company {
  name: string
  industry: string
  stat: StockStat
  description: string
  history: StockHistory[]
  logo?: any
}

export interface StockHistory {
  date: string
  time: string
  price: number
}

export interface StockStat {
  volatility: number
  dividendsConsistency: number
  companySize: number
  dividendsRate: number
}

export interface UserStock {
  name: string
  averagePrice: number
  amount: number
  date: string
}

export interface UserHistory {
  date: string
  capital: number
}

export interface User {
  name: string
  loginDate: string
  capital: number
  stocks: UserStock[]
  history: UserHistory[]
}
