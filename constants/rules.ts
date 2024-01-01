import { ToastPosition } from 'react-native-toast-message'

export default {
  app: { test: true },
  user: { startCash: 100000 },
  stock: {
    percentPerDay: 5,
    secondsPerTact: 60,
    tactsPerDay: 24 * 60,
    tactsPerHour: 60,
    companySizeStocksAmount: [
      2000000, 10000000, 40000000, 250000000, 1000000000,
    ],
    dividendTime: '09:00',
    dividendsHistoryDays: 7,
    industries: [
      'healthcare',
      'information technology',
      'financial',
      'oil & gas',
      'agriculture',
      'construction',
      'military',
      'foodservice',
      'power & utilities',
      'media',
      'consumer',
    ],
    tendention: [0.3, 0.2, 0.12, 0.1, 0.08],
  },
  news: {
    impactPerCompanySize: [2, 1.75, 1.5, 1.25, 1],
  },
  deposit: {
    maxValue: 1000000000,
    options: [
      { hours: 6, interest: 4 },
      { hours: 12, interest: 4 },
      { hours: 24, interest: 5 },
      { hours: 48, interest: 6 },
      { hours: 72, interest: 7 },
    ],
  },
  realEstate: {
    amount: [
      2, 3, 5, 7, 10, 11, 12, 12, 12, 13, 15, 15, 16, 17, 17, 18, 19, 20, 20,
    ],
    value: [
      1000000000, 500000000, 250000000, 130000000, 66000000, 34000000, 17000000,
      8700000, 4400000, 2250000, 1100000, 575000, 290000, 150000, 75000, 38000,
      19000, 9000, 5000,
    ],

    percentPerDay: 4,
    incomePerDayPercent: 5,
    sellValue: 0.8,
    paymentTimes: [
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
      21, 22, 23,
    ],
  },
  promoCode: {
    CASH1K: {
      id: 'CASH1K',
      type: 'cash',
      value: 1000,
    },
    CASH1KK: {
      id: 'CASH1KK',
      type: 'cash',
      value: 1000000,
    },
  },
  toast: {
    position: 'top' as ToastPosition,
  },
  log: {
    start: {
      title: 'start the game',
      icon: 'person-outline',
    },
    propertyBuy: {
      title: 'A property was bought',
      icon: 'home-outline',
    },
    propertySell: {
      title: 'A property was sold',
      icon: 'home-outline',
    },
    dividends: {
      title: 'Recieved dividends',
      icon: 'download-outline',
    },
    createDeposit: {
      title: 'Deposit created',
      icon: 'wallet-outline',
    },
    deposit: {
      title: 'Deposit payed off',
      icon: 'wallet-outline',
    },
    realEstatePayment: {
      title: 'Real estate payment',
      icon: 'download-outline',
    },
    promoCode: {
      title: 'Promo code',
      icon: 'download-outline',
    },
    stockBuy: { title: 'Stock buy', icon: 'trending-up-outline' },
    stockSell: { title: 'Stock sell', icon: 'trending-down-outline' },
  },
}
