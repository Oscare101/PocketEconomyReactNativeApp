import rules from '../constants/rules'

export function GetMoneyAmount(money: number) {
  const grades = [
    { value: 10 ** 6, title: 'M' },
    { value: 10 ** 9, title: 'B' },
    { value: 10 ** 12, title: 'T' },
    { value: 10 ** 15, title: 'Q' },
    { value: 10 ** 18, title: 'Qn' },
    { value: 10 ** 21, title: 'S' },
  ]
  let moneyGrade: any = {}
  grades.forEach((g: any) => {
    if (money / g.value >= 1) {
      moneyGrade = { value: money / g.value, title: g.title }
    }
  })

  const result = {
    value: Math.floor(moneyGrade?.value || money)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ' '),
    decimal: (moneyGrade?.value || money).toFixed(2).split('.')[1],
    title: moneyGrade?.title || '',
  }

  return result
}

export function CountDaysPlayed(loginday: string) {
  const start = new Date(loginday).getTime()
  const today = new Date().getTime()
  const difference = Math.floor((today - start) / (1000 * 60 * 60 * 24))
  return difference
}

export function CalculateStock(stock: any) {
  const volatility = stock.stat.volatility
  let price = stock.history[stock.history.length - 1].price

  const tactsAmount = rules.stock.tactsPerDay
  const percentPerDay = rules.stock.percentPerDay / 100
  const dailyPercentageChange = percentPerDay / tactsAmount

  const randomChangeUp = Math.random() * 10 * volatility * dailyPercentageChange
  const randomChangeDown =
    Math.random() *
    10 *
    volatility *
    dailyPercentageChange *
    (0.5 + volatility * 0.083)

  const threshold = 0.5
  const randomPositiveChange =
    Math.random() > threshold ? randomChangeUp : -randomChangeDown

  price *= 1 + randomPositiveChange

  return +price.toFixed(2) // TODO remove .toFixed(2)
}

export function AddSecondsToDateTime(inputDateTime: string) {
  const inputDate = new Date(inputDateTime)
  const newDate = new Date(
    inputDate.getTime() + rules.stock.secondsPerTact * 1000
  )

  const formattedResult =
    newDate.getFullYear() +
    '-' +
    (newDate.getMonth() + 1).toString().padStart(2, '0') +
    '-' +
    newDate.getDate().toString().padStart(2, '0') +
    'T' +
    newDate.getHours().toString().padStart(2, '0') +
    ':' +
    newDate.getMinutes().toString().padStart(2, '0') +
    ':' +
    newDate.getSeconds().toString().padStart(2, '0')

  return formattedResult
}

export function countElapsedPeriods(inputDateTime: any) {
  const inputDate = new Date(inputDateTime).getTime() / 1000
  const now = new Date().getTime() / 1000
  const elapsedPeriods = Math.floor((now - inputDate) / 15)
  return elapsedPeriods
}

export function GetElapsedHistory(company: any) {
  const arr: any = [...company.history]
  const count = countElapsedPeriods(
    `${company.history[company.history.length - 1].date}T${
      company.history[company.history.length - 1].time
    }`
  )

  for (let i = 0; i < count; i++) {
    const newDateTime = AddSecondsToDateTime(
      `${arr[arr.length - 1].date}T${arr[arr.length - 1].time}`
    )
    arr.push({
      price: CalculateStock({ ...company, history: arr }),
      date: newDateTime.split('T')[0],
      time: newDateTime.split('T')[1],
    })
  }

  return arr
}

export function UpdateCompaniesData(companies: any[]) {
  const newCompaniesData = companies.map((c: any) => {
    return {
      ...c,
      history: GetElapsedHistory(c),
    }
  })

  return newCompaniesData
}
