import { UserDeposit } from '../constants/interfaces'

export function GetDepositReturn(
  value: number,
  durating: number,
  interest: number
) {
  const result = value * (1 + (interest * (durating / 24)) / 100)
  return +result.toFixed(2)
}

export function GetDepositMatureDateTime(
  openingDate: string,
  openingTime: string,
  durationHours: number
) {
  const maturityDate =
    new Date(`${openingDate}T${openingTime}`).getTime() +
    durationHours * 60 * 60 * 1000
  const resultDate = `${new Date(maturityDate).getFullYear()}-${
    new Date(maturityDate).getMonth() + 1
  }-${new Date(maturityDate).getDate()}`
  const resultTime = `${new Date(maturityDate)
    .getHours()
    .toString()
    .padStart(2, '0')}:${new Date(maturityDate)
    .getMinutes()
    .toString()
    .padStart(2, '0')}`

  return { date: resultDate, time: resultTime }
}

export function CheckMatureDeposits(deposits: UserDeposit[]) {
  const matureDeposits: any = []
  deposits.forEach((d: UserDeposit) => {
    const mature = GetDepositMatureDateTime(
      d.openingDate,
      d.openingTime,
      d.durationHours
    )

    if (new Date() > new Date(`${mature.date} ${mature.time}`)) {
      matureDeposits.push(d)
    }
  })
  return matureDeposits
}

export function GetUserDepositsCapital(deposits: any[]) {
  const depositsValue: number =
    deposits?.reduce((a: any, b: any) => a + b.value, 0) || 0

  return depositsValue
}
