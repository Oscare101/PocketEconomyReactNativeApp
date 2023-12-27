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
}

export interface UserDeposit {
  name: string
  value: number
  interest: number
  openingDate: string
  openingTime: string
  durationHours: number
  autoRenewal: boolean
}

export interface UserHistory {
  date: string
  time: string
  capital: number
}

export interface DividendHistory {
  name: string
  interest: number
  value: number
  date: string
}

export interface RealEstate {
  region: string
  name: string
  value: number
  popularity: number
}

export interface UserRealEstate {
  region: string
  name: string
  value: number
  popularity: number
  price: number
  occupancyRate: number
}

export interface User {
  name: string
  loginDate: string
  cash: number
  stocks: UserStock[]
  history: UserHistory[]
  deposits: UserDeposit[]
  dividendsHistory: DividendHistory[]
  realEstate?: UserRealEstate[]
}
