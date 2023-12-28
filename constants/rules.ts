export default {
  user: { startCash: 1000 },
  stock: {
    percentPerDay: 5,
    secondsPerTact: 60,
    // tactsPerWeek: 7 * 24 * 60,
    tactsPerDay: 24 * 60,
    tactsPerHour: 60,
    compresGrade: 2,
    companySizeStocksAmount: [
      2000000, 10000000, 40000000, 250000000, 1000000000,
    ],
    dividendTime: '09:00',
    dividendsHistoryDays: 7,
  },
  deposits: [
    { hours: 6, interest: 3 },
    { hours: 12, interest: 4 },
    { hours: 24, interest: 5 },
    { hours: 48, interest: 5.5 },
    { hours: 72, interest: 6 },
  ],
  realEstate: {
    amount: [
      2, 3, 5, 7, 10, 11, 12, 12, 12, 13, 15, 15, 16, 17, 17, 18, 19, 20, 20,
    ],
    value: [
      1000000000, 505000000, 255000000, 130000000, 66000000, 34000000, 17000000,
      8700000, 4400000, 2250000, 1100000, 575000, 290000, 150000, 75000, 38000,
      19000, 9000, 5000,
    ],

    percentPerDay: 1,
    incomePerDayPercent: 5,
    sellValue: 0.8,
    paymentTimes: [
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
      21, 22, 23,
    ],
  },
}
