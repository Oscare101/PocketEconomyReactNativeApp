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
}
