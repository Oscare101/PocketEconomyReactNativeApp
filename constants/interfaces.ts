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

export interface UserRealEstate {
  region: number
  amount: number
}

export interface UserRealEstateHistory {
  date: string
  time: string
  value: number
}

export interface Bank {
  type: 'bank'
  cash: number
  clientsAmount: number
  depositRate: number
  creditRate: number
  commission: number
  startDate: string
  lastUpdate: string
}

export interface User {
  name: string
  loginDate: string
  cash: number
  stocks: UserStock[]
  history: UserHistory[]
  deposits: UserDeposit[]
  dividendsHistory: DividendHistory[]
  realEstate: UserRealEstate[]
  realEstateHistory: UserRealEstateHistory[]
  bisuness?: any[]
}

export interface Log {
  date: string
  time: string
  title: string
  icon: string
  data?: any
}
