import { Company, User, UserStock } from '../constants/interfaces'
import rules from '../constants/rules'
import defaultData from '../defaultData.json'
import { GetUserDepositsCapital } from './depositFunctions'
import { GetUserAllPropertiesCost } from './realEstateFunctions'

export function GetMoneyAmount(money: number) {
  const grades = [
    { value: 10 ** 6, title: ' M' },
    { value: 10 ** 9, title: ' B' },
    { value: 10 ** 12, title: ' T' },
    { value: 10 ** 15, title: ' Q' },
    { value: 10 ** 18, title: ' Qn' },
    { value: 10 ** 21, title: ' S' },
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

export function GetNews() {
  const year = new Date().getFullYear()
  const month = String(new Date().getMonth() + 1).padStart(2, '0')
  const day = String(new Date().getDate()).padStart(2, '0')

  const formattedDate = `${year}-${month}-${day}`

  const stanp = +new Date(formattedDate)
  const up = rules.stock.industries[stanp ** 2 % 11]
  const newArr = rules.stock.industries.filter((i: any) => i !== up)
  const down = newArr[stanp ** 2 % 10]
  return { good: up, bad: down }
}

export function CountDaysPlayed(loginday: string) {
  const start = new Date(loginday).getTime()
  const today = new Date().getTime()
  const difference = Math.floor((today - start) / (1000 * 60 * 60 * 24))
  return difference
}

export function CalculateStock(stock: Company) {
  const volatility = stock.stat.volatility
  const companySize = stock.stat.companySize
  let price = stock.history[stock.history.length - 1].price

  const tactsAmount = rules.stock.tactsPerDay
  const percentPerDay = rules.stock.percentPerDay / 100
  const dailyPercentageChange = percentPerDay / tactsAmount

  const newsImpactValue = rules.news.impactPerCompanySize[companySize - 1]
  const newsImpact =
    GetNews().good === stock.industry
      ? -newsImpactValue
      : GetNews().bad === stock.industry
      ? +newsImpactValue
      : 0

  const randomChangeUp = Math.random() * 10 * volatility * dailyPercentageChange
  const randomChangeDown =
    Math.random() *
    10 *
    volatility *
    dailyPercentageChange *
    (0.5 + volatility * 0.083)

  const tendention: number =
    GetTendention(stock.history) / 5 / (companySize / 2)
  let threshold = 0.5 + tendention + newsImpact
  const randomPositiveChange =
    Math.random() > threshold ? randomChangeUp : -randomChangeDown

  price *= 1 + randomPositiveChange

  return price
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
    newDate.getMinutes().toString().padStart(2, '0')

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

export function GetElapsedHistory(company: any, userStocks: any[]) {
  const arr: any = [...company.history]
  const count = countElapsedPeriods(
    `${company.history[company.history.length - 1].date}T${
      company.history[company.history.length - 1].time
    }`
  )

  let companyDividends: any = false

  for (let i = 0; i < count; i++) {
    const newDateTime = AddSecondsToDateTime(
      `${arr[arr.length - 1].date}T${arr[arr.length - 1].time}`
    )
    const calculatedStock = CalculateStock({ ...company, history: arr })
    const date = newDateTime.split('T')[0]
    const time = newDateTime.split('T')[1]
    if (
      time === rules.stock.dividendTime &&
      userStocks.find((s: any) => s.name === company.name)
    ) {
      const dividendRateMax: number = company.stat.dividendsRate
      const dividendRateMin: number = company.stat.dividendsRate / 10
      const consistency: number = company.stat.dividendsConsistency
      const dividendChance = Math.floor(Math.random() * 5) < consistency
      const amountOfStocks = userStocks.find(
        (s: any) => s.name === company.name
      ).amount
      const currentdividendRate: number = dividendChance
        ? +(
            Math.random() * (dividendRateMax - dividendRateMin) +
            dividendRateMin
          ).toFixed(2)
        : 0
      const dividend = +(
        (currentdividendRate / 100) *
        calculatedStock *
        amountOfStocks
      ).toFixed(2)

      companyDividends = {
        name: company.name,
        interest: currentdividendRate,
        value: dividend,
        date: date,
      }
    }
    arr.push({
      price: calculatedStock,
      date: date,
      time: time,
    })
  }

  return { arr: arr, dividend: companyDividends }
}

export function UpdateCompaniesData(userStocks: any[], companies: any[]) {
  let dividends: any = []

  const newCompaniesData = companies.map((c: any) => {
    const elapsedHistory = GetElapsedHistory(c, userStocks)
    const dividend = elapsedHistory.dividend
    const history = elapsedHistory.arr
    if (dividend) {
      dividends.push(dividend)
    }

    return {
      ...c,
      history: history.slice(-rules.stock.tactsPerDay),
    }
  })

  return { data: newCompaniesData, dividends: dividends }
}

export function CreateDefaultHistory(comapanies: any[]) {
  const newComapniesData = comapanies.map((c: any) => {
    const { price, ...rest } = c

    return {
      ...rest,
      history: [
        {
          date: GetCurrentDate(),
          time: `${new Date()
            .getHours()
            .toString()
            .padStart(2, '0')}:${new Date()
            .getMinutes()
            .toString()
            .padStart(2, '0')}`,
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

export function GetEconomicsProgress(companies: any[], lastPeriod: number) {
  const economicsArr: any = []

  companies.map((s: any) => {
    const start = lastPeriod
      ? s.history[s.history.length - lastPeriod].price
      : s.history[0].price

    const finish = s.history[s.history.length - 1].price
    const percent = (finish / start - 1) * 100
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

  return economicsCapitalPercent / economicsCapitalStart
}

export function GetEconomicsAllTimeProgress(companies: any[]) {
  const economicsArr: any = []
  const defaultDataPrices: any = defaultData

  companies.map((s: any) => {
    const start = defaultDataPrices[s.name].price
    const finish = s.history[s.history.length - 1].price
    const percent = (finish / start - 1) * 100
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

  return economicsCapitalPercent / economicsCapitalStart / 100 + 1
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

export function GetUserStocksCapital(stocks: UserStock[], companies: any[]) {
  let capital = 0

  stocks.forEach((s: any) => {
    const comapnyPrice = companies.find((c: any) => c.name === s.name).history[
      companies.find((c: any) => c.name === s.name).history.length - 1
    ].price
    capital += s.amount * comapnyPrice
  })

  return +capital.toFixed(2)
}

export function SetNewUserStocks(
  userStocks: UserStock[],
  amount: number,
  newPrice: number,
  stockName: string
) {
  let newUserStocks: UserStock[] = []
  if (userStocks.find((s: any) => s.name === stockName)) {
    newUserStocks = userStocks.map((s: UserStock) => {
      if (s.name === stockName) {
        const prevAmountOfStocks = s.amount
        const prevPriceOfStock = s.averagePrice
        const newAmount = prevAmountOfStocks + amount
        const newPriceStock =
          (prevPriceOfStock * prevAmountOfStocks + amount * newPrice) /
          newAmount
        return {
          name: s.name,
          averagePrice: newPriceStock,
          amount: newAmount,
        }
      } else {
        return s
      }
    })
  } else {
    newUserStocks = [
      ...userStocks,
      {
        name: stockName,
        averagePrice: newPrice,
        amount: amount,
      },
    ]
  }
  return newUserStocks
}

export function ReduceUserStocks(
  userStocks: UserStock[],
  amount: number,
  stockName: string
) {
  const newUserStocks: UserStock[] = userStocks.map((s: UserStock) => {
    if (s.name === stockName) {
      // if (amount === s.amount) { return false } else { return s }
      return {
        ...s,
        amount: s.amount - amount,
      }
    } else {
      return s
    }
  })

  return newUserStocks.filter((s: UserStock) => s.amount)
}

export function GetUserAllTimeProgress(user: User, companies: any[]) {
  const start = rules.user.startCash
  const finish =
    GetUserStocksCapital(user.stocks, companies) +
    user.cash +
    GetUserDepositsCapital(user.deposits) +
    GetUserAllPropertiesCost(user)
  const progress = finish / start
  return progress
}

export function GetUserRating(user: User, companies: any[]) {
  const economicsProgress = GetEconomicsAllTimeProgress(companies)
  const userProgress = GetUserAllTimeProgress(user, companies)
  const rating = (userProgress - 1) / (economicsProgress - 1)
  return +rating
}

export function GetPortfolioProgress(
  user: User,
  companies: any[],
  lastPeriod: number
) {
  let progressTotal = 0

  user.stocks.map((s: UserStock) => {
    const company = companies.find((c: any) => c.name === s.name)

    const stockPrice = company.history[company.history.length - 1].price
    const previousStockPrice = lastPeriod
      ? company.history[company.history.length - lastPeriod].price
      : s.averagePrice

    const stockProgress = (stockPrice / previousStockPrice - 1) * 100

    progressTotal += s.amount * stockPrice * stockProgress
  })
  const result =
    progressTotal / GetUserStocksCapital(user.stocks, companies) || 0

  return result
}

export function GetRatingPerPeriod(
  user: User,
  companies: any[],
  period: number
) {
  let result = 0
  const portfolio = GetPortfolioProgress(user, companies, period)
  const economy = GetEconomicsProgress(companies, period)
  if (economy < 0 && portfolio > 0) {
    result = (portfolio - economy) / -economy
  } else if (economy > 0 && portfolio < 0) {
    result = portfolio / economy
  } else if (economy < 0 && portfolio < 0) {
    result = economy / portfolio
  } else {
    result = portfolio / economy
  }
  return +result.toFixed(2)
}

export function IsPeriodEnough(companies: any[], period: number) {
  if (companies[0].history.length < period) {
    return false
  }
  return true
}

export function FilterRecentDividendsHistory(data: any) {
  const tenDaysAgo = new Date()
  tenDaysAgo.setDate(tenDaysAgo.getDate() - rules.stock.dividendsHistoryDays)
  const filteredData = data.filter(
    (item: any) => new Date(item.date) >= tenDaysAgo
  )
  return filteredData
}

export function GenerateDividendsDates() {
  const dateArray = []
  const currentDate = new Date()

  for (let i = 0; i < rules.stock.dividendsHistoryDays; i++) {
    const date = new Date()
    date.setDate(currentDate.getDate() - i)
    dateArray.push(date.toISOString().split('T')[0])
  }

  return dateArray
}

export function GetUserDividendsValue(dividends: any[]) {
  const sum = dividends.reduce((a: any, b: any) => a + b.value, 0)
  return sum
}

export function GetReversedArr(arr: any[]) {
  return [...arr].reverse()
}

export function GetCurrentDate() {
  const year = new Date().getFullYear()
  const month = String(new Date().getMonth() + 1).padStart(2, '0')
  const day = String(new Date().getDate()).padStart(2, '0')
  const date = `${year}-${month}-${day}`
  return date
}

export function GetCurrentTime() {
  return `${new Date().getHours().toString().padStart(2, '0')}:${new Date()
    .getMinutes()
    .toString()
    .padStart(2, '0')}:${new Date().getSeconds().toString().padStart(2, '0')}`
}
