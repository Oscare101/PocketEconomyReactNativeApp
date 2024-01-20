import { Bank } from '../constants/interfaces'
import rules from '../constants/rules'

export function GenerateCash() {
  const cash = Math.random() * rules.business.bank.userAvarageCash * 0.1
  return +cash.toFixed(2)
}

export function GenerateIncome() {
  const cash = Math.random() * rules.business.bank.userAvarageIncome * 12
  return +cash.toFixed(2)
}

export function GenerateRate() {
  const rate = Math.floor(Math.random() * (5 - 1 + 1) + 1)
  return rate
}

export function GenerateRateFrom(min: number) {
  const rate = Math.floor(Math.random() * (5 - min + 1) + min)
  return rate
}

export function GetDepositClientInterested(depositInterest: number) {
  const koef: number =
    depositInterest / rules.business.bank.centralBankDepositRate

  let result: number = 0
  if (koef <= 1) {
    result = (koef / 1.136) ** (2 * Math.E)
  } else if (koef > 1 && koef < 2) {
    result = Math.sin(2.9 * (koef - 1.5)) * 0.25 + 0.75
  } else if (koef >= 2) {
    result = 1
  }
  return result
}

export function DepositInterestedClient(depositInterest: number) {
  const depositIsBetterThanCentralBank =
    GetDepositClientInterested(depositInterest) >= Math.random()
  const userFinancialLiteracy = GenerateRate() > 2
  const userIsInterested =
    depositIsBetterThanCentralBank && userFinancialLiteracy

  return userIsInterested
}

export function GetCreditClientInterested(creditInterest: number) {
  const koef = creditInterest / rules.business.bank.centralBankCreditRate
  let result: number = 0
  if (koef <= 1) {
    result = -((0.8 * koef) ** (1.143 * Math.E)) + 1
  } else if (koef > 1 && koef < 2) {
    result = 0.08 * (koef - 0.86) ** -1 - 0.07
  } else if (koef >= 2) {
    result = 0
  }
  return result
}

export function CreditInterestedClient(creditInterest: number) {
  const creditIsBetterThanCentralBank =
    GetCreditClientInterested(creditInterest) >= Math.random()
  const userImpulseBuyerRate = GenerateRate() > 2
  const userIsInterested = creditIsBetterThanCentralBank && userImpulseBuyerRate
  return userIsInterested
}

export function GetDepositClient() {
  const deposit = GenerateCash() * GenerateRateFrom(3)
  return deposit
}

export function GetCreditClient() {
  const credit = GenerateIncome() * GenerateRateFrom(3)
  return credit
}

export function CountElapsedDays(date: string) {
  const targetDate = new Date(date).getTime()
  const currentDate = new Date().getTime()
  const timeDifference = currentDate - targetDate
  const daysPassed = Math.floor(timeDifference / (1000 * 60 * 60 * 24))
  return daysPassed
}

export function GetUserIncreaseKoef(bank: Bank) {
  const userInterested =
    GetDepositClientInterested(bank.depositRate) *
    GetCreditClientInterested(bank.creditRate)

  let result: number =
    userInterested * 20 * ((0.2 - bank.commission / 100) / 0.2)

  return 0.96 + result / 100
}

export function GetAdCost(startDate: string) {
  const dayPassed = CountElapsedDays(startDate)
  const initialValue = rules.business.bank.adCost
  const currectValue =
    initialValue * (1 + rules.business.bank.adPercentPerDay / 100) ** dayPassed
  return +currectValue.toFixed(2)
}

export function GetUserBusinessesCash(businesses: any) {
  const amount = businesses.reduce((a: number, b: any) => a + b.cash, 0) || 0
  return amount
}
