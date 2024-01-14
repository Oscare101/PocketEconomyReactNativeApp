import {
  User,
  UserRealEstate,
  UserRealEstateHistory,
} from '../constants/interfaces'
import rules from '../constants/rules'

export function GetPropertyCost(startDate: string, region: number) {
  const dayPassed = GetDaysFromDate(startDate)
  const initialValue = rules.realEstate.value[region - 1]
  const currectValue =
    initialValue * (1 + rules.realEstate.percentPerDay / 100) ** dayPassed
  return +currectValue.toFixed(2)
}

export function GetPropertyCostToDate(
  startDate: string,
  date: string,
  region: number
) {
  const dayPassed = GetDaysFromDateToDate(startDate, date)
  const initialValue = rules.realEstate.value[region - 1]
  const currectValue =
    initialValue * (1 + rules.realEstate.percentPerDay / 100) ** dayPassed
  return +currectValue.toFixed(2)
}

export function GetDaysFromDate(date: string) {
  const targetDate = new Date(date).getTime()
  const currentDate = new Date().getTime()
  const timeDifference = currentDate - targetDate
  const daysPassed = Math.floor(timeDifference / (1000 * 60 * 60 * 24))
  return daysPassed
}

export function GetDaysFromDateToDate(date1: string, date2: string) {
  const targetDate = new Date(date1).getTime()
  const currentDate = new Date(date2).getTime()
  const timeDifference = currentDate - targetDate
  const daysPassed = Math.floor(timeDifference / (1000 * 60 * 60 * 24))
  return daysPassed
}

export function GetPropertyIncome(startDate: string, region: number) {
  const propertyCost = GetPropertyCost(startDate, region)
  const income = propertyCost * (rules.realEstate.incomePerDayPercent / 100)
  return +income.toFixed(2)
}

export function GetElapsedRealEstatePayments(
  lastDate: string,
  lastTime: string
) {
  const inputDate = new Date(`${lastDate} ${lastTime}`).getTime() / 1000
  const now = new Date().getTime() / 1000
  const elapsedPeriods = Math.floor((now - inputDate) / (60 * 60))
  return elapsedPeriods
}

export function IsRealEstatePaymentTime(history: any[]) {
  if (!!history.length) {
    const elapsedPeiriods: number = GetElapsedRealEstatePayments(
      history[history.length - 1].date,
      history[history.length - 1].time
    )
    return elapsedPeiriods
  } else {
    return 1
  }
}

export function GetUserAllPropertiesCost(user: User) {
  let sum: number = 0
  user.realEstate.forEach((r: UserRealEstate) => {
    sum += GetPropertyCost(user.loginDate, r.region) * r.amount
  })
  return sum
}

export function GetUserAllPropertiesCostToDate(user: User, date: string) {
  let sum: number = 0
  user.realEstate.forEach((r: UserRealEstate) => {
    sum += GetPropertyCostToDate(user.loginDate, date, r.region) * r.amount
  })
  return sum
}

export function GetNewDateTimeRealEstate(date: string, time: string) {
  const inputDate = new Date(`${date}T${time}`)
  const newDate = new Date(inputDate.getTime() + 1000 * 60 * 60)

  const formattedDate =
    newDate.getFullYear() +
    '-' +
    (newDate.getMonth() + 1).toString().padStart(2, '0') +
    '-' +
    newDate.getDate().toString().padStart(2, '0')
  const formatedTime =
    newDate.getHours().toString().padStart(2, '0') +
    ':' +
    newDate.getMinutes().toString().padStart(2, '0')

  return { date: formattedDate, time: formatedTime }
}

export function GetNewUserRealEstateHistory(user: User) {
  let newPaymentHistory: UserRealEstateHistory[] = user.realEstateHistory
  const elapsedPeriods = IsRealEstatePaymentTime(user.realEstateHistory)

  for (let i = 0; i < elapsedPeriods; i++) {
    const newDateTime = GetNewDateTimeRealEstate(
      newPaymentHistory[newPaymentHistory.length - 1].date,
      newPaymentHistory[newPaymentHistory.length - 1].time
    )

    const income = +(
      (GetUserAllPropertiesCostToDate(user, newDateTime.date) *
        (rules.realEstate.incomePerDayPercent / 100)) /
      rules.realEstate.paymentTimes.length
    ).toFixed(2)

    newPaymentHistory = [
      ...newPaymentHistory,
      {
        date: newDateTime.date,
        time: newDateTime.time,
        value: income,
      },
    ]
  }
  return newPaymentHistory.slice(-rules.realEstate.paymentTimes.length)
}

export function GetPropertiesValuePerRegion(user: User, region: number) {
  const userRegion =
    user.realEstate.find((r: UserRealEstate) => r.region === region)?.amount ||
    0
  const sum = userRegion * GetPropertyCost(user.loginDate, region)

  return sum
}

export function GetAllRentalPaymentValue(history: UserRealEstateHistory[]) {
  const sum: number = history.reduce(
    (a: number, b: UserRealEstateHistory) => a + b.value,
    0
  )
  return sum
}

export function GetUserAllBusinessesCapital(businesses: any[]) {
  if (businesses.length) {
    return businesses.reduce((a, b) => a + b.cash, 0)
  } else {
    return 0
  }
}
