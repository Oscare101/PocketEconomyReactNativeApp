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

export function GetTendention(history: any[]) {
  if (history.length < 3) {
    return 0
  }

  const temporaryArr = [...history].slice(-3)
  temporaryArr.sort((a, b) => b.price - a.price)

  // console.log(history)
  if (JSON.stringify(temporaryArr) === JSON.stringify([...history].slice(-3))) {
    // down
    return +1
  } else if (
    JSON.stringify(temporaryArr.reverse()) ===
    JSON.stringify([...history].slice(-3))
  ) {
    // up
    return -1
  }
  return 0
}

export function CountDaysPlayed(loginday: string) {
  const start = new Date(loginday).getTime()
  const today = new Date().getTime()
  const difference = Math.floor((today - start) / (1000 * 60 * 60 * 24))
  return difference
}

export function CalculateStock(stock: any) {
  const volatility = stock.stat.volatility
  const companySize = stock.stat.companySize
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

  const tendention: number =
    GetTendention(stock.history) / 5 / (companySize / 2)
  let threshold = 0.5 + tendention
  const randomPositiveChange =
    Math.random() > threshold ? randomChangeUp : -randomChangeDown

  price *= 1 + randomPositiveChange

  return price // TODO remove .toFixed(2)
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
  const elapsedPeriods = Math.floor(
    (now - inputDate) / rules.stock.secondsPerTact
  )
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
      history: GetElapsedHistory(c).slice(-rules.stock.tactsPerDay),
    }
  })

  return newCompaniesData
}

export function CreateDefaultHistory(comapanies: any[]) {
  const newComapniesData = comapanies.map((c: any) => {
    const { price, ...rest } = c

    return {
      ...rest,
      history: [
        {
          date: new Date('2023-12-22').toISOString().split('T')[0],
          time: `${new Date()
            .getHours()
            .toString()
            .padStart(2, '0')}:${new Date()
            .getMinutes()
            .toString()
            .padStart(2, '0')}:00`,
          price: c.price,
        },
      ],
    }
  })

  return newComapniesData
}

export function GetProfit(stockArr: any[]) {
  const first = stockArr[0].price

  const last = stockArr[stockArr.length - 1].price
  const result = (last / first - 1) * 100

  return +result.toFixed(2)
}

export function GetEconomicsProgress(companies: any[]) {
  const economicsArr: any = []

  companies.map((s: any) => {
    // const start = s.history[0].price
    const finish = s.history[s.history.length - 1].price
    const percent =
      (s.history[s.history.length - 1].price / s.history[0].price - 1) * 100
    economicsArr.push({
      finish: finish,
      percent: percent,
      companySize: s.stat.companySize,
    })
  })

  // use company size to get their weight in economics
  const economicsCapitalStart = economicsArr.reduce(
    (a: any, b: any) =>
      a + rules.stock.companySizeStocksAmount[b.companySize - 1],
    0
  )

  // use company size to multiply their percent
  const economicsCapitalPercent = economicsArr.reduce(
    (a: any, b: any) =>
      a + rules.stock.companySizeStocksAmount[b.companySize - 1] * b.percent,
    0
  )

  return +(economicsCapitalPercent / economicsCapitalStart).toFixed(2)
}

export function GetSortedCompaniesByProgress(companies: any[]) {
  const newCompaniesDate = companies.map((c: any) => {
    const companyProgress = +(
      (c.history[c.history.length - 1].price / c.history[0].price - 1) *
      100
    ).toFixed(2)
    return { name: c.name, progress: companyProgress }
  })
  return newCompaniesDate.sort((a: any, b: any) => b.progress - a.progress)
}

export function GetUserProgress(history: any[]) {
  if (!history.length) {
    return 0
  }

  return 0
}
