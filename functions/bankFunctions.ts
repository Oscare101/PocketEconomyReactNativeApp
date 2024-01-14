export function GenerateCash() {
  const cash = Math.random() * 50000
  return +cash.toFixed(2)
}

export function GenerateIncome() {
  const cash = Math.random() * 10000
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

export function GetDepositClientInterested(
  depositInterest: number,
  centralBankDepositRate: number
) {
  const koef: number = depositInterest / centralBankDepositRate
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

export function DepositInterestedClient(
  depositInterest: number,
  centralBankDepositRate: number
) {
  const depositIsBetterThanCentralBank =
    GetDepositClientInterested(depositInterest, centralBankDepositRate) >=
    Math.random()
  const userFinancialLiteracy = GenerateRate() > 2
  const userIsInterested =
    depositIsBetterThanCentralBank && userFinancialLiteracy

  return userIsInterested
}

export function GetCreditClientInterested(
  creditInterest: number,
  centralBankCreditRate: number
) {
  const koef = creditInterest / centralBankCreditRate
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

export function CreditInterestedClient(
  creditInterest: number,
  centralBankCreditRate: number
) {
  const creditIsBetterThanCentralBank =
    GetCreditClientInterested(creditInterest, centralBankCreditRate) >=
    Math.random()
  const userImpulseBuyerRate = GenerateRate() > 2
  const userIsInterested = creditIsBetterThanCentralBank && userImpulseBuyerRate
  return userIsInterested
}

export function GetDepositClient() {
  const deposit = GenerateCash() * GenerateRateFrom(3) * 0.1
  return deposit
}

export function GetCreditClient() {
  const credit = GenerateIncome() * GenerateRateFrom(3) * 24
  return credit
}
