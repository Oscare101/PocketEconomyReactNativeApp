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
      1000000000, 400000000, 250000000, 180000000, 80000000, 65000000, 50000000,
      45000000, 38000000, 35000000, 28000000, 22000000, 15000000, 7000000,
      4000000, 2500000, 1500000, 800000, 200000,
    ],
    prices: [
      50000000, 20000000, 12500000, 9000000, 4000000, 3250000, 2500000, 2250000,
      1900000, 1750000, 1400000, 1100000, 750000, 350000, 200000, 125000, 75000,
      40000, 10000,
    ],
  },
}
