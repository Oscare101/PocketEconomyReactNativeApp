import {
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native'
import HeaderDrawer from '../../components/HeaderDrawer'
import colors from '../../constants/colors'
import {
  CountDaysPlayed,
  GetEconomicsAllTimeProgress,
  GetEconomicsProgress,
  GetMoneyAmount,
  GetUserStocksCapital,
} from '../../functions/functions'
import StatusItem from '../../components/StatusItem'
import { RootState } from '../../redux'
import { useSelector } from 'react-redux'
import { User, UserStock } from '../../constants/interfaces'
import rules from '../../constants/rules'

const width = Dimensions.get('screen').width

function GetInfoTypeRating(rating: number) {
  const ratingRange = [
    { value: 0, type: 'error' },
    { value: 0.8, type: 'warning' },
    { value: 1, type: 'success' },
  ]
  let resultType: 'success' | 'warning' | 'error' = 'success'
  ratingRange.forEach((r: any) => {
    if (rating >= r.value) {
      resultType = r.type
    }
  })
  return resultType
}

function GetInfoTypeProgress(rating: number, period: number) {
  const ratingRange = [
    { value: -1000, type: 'error' },
    { value: 0, type: 'warning' },
    { value: (1.05 ** period - 1) * 100, type: 'success' },
  ]
  let resultType: 'success' | 'warning' | 'error' = 'success'
  ratingRange.forEach((r: any) => {
    if (rating >= r.value) {
      resultType = r.type
    }
  })
  return resultType
}

export default function PortfolioScreen({ navigation }: any) {
  const systemTheme = useColorScheme()
  const theme = useSelector((state: RootState) => state.theme)
  const user: User = useSelector((state: RootState) => state.user)
  const companies: any = useSelector((state: RootState) => state.companies)

  function GetUserAllTimeProgress() {
    const start = rules.user.startCash
    const finish = GetUserStocksCapital(user.stocks, companies) + user.cash
    const progress = finish / start
    return progress
  }

  function GetPortfolioProgress() {
    let progressTotal = 0

    user.stocks.map((s: UserStock) => {
      const stockPrice = companies.find((c: any) => c.name === s.name).history[
        companies.find((c: any) => c.name === s.name).history.length - 1
      ].price

      const stockProgress = (stockPrice / s.averagePrice - 1) * 100

      progressTotal += s.amount * stockPrice * stockProgress
    })

    return progressTotal / GetUserStocksCapital(user.stocks, companies)
  }

  function GetUserRating() {
    const economicsProgress = GetEconomicsAllTimeProgress(companies)

    const userProgress = GetUserAllTimeProgress()

    const rating = (userProgress - 1) / (economicsProgress - 1)
    return +rating
  }

  const themeColor: any = theme === 'system' ? systemTheme : theme
  const userPortfolioData = [
    {
      title: 'Capital',
      value: `$ ${
        GetMoneyAmount(GetUserStocksCapital(user.stocks, companies) + user.cash)
          .value
      }.${
        GetMoneyAmount(GetUserStocksCapital(user.stocks, companies) + user.cash)
          .decimal
      } ${
        GetMoneyAmount(GetUserStocksCapital(user.stocks, companies) + user.cash)
          .title
      }`,
    },
    {
      title: 'Cash',
      value: `$ ${GetMoneyAmount(user.cash).value}.${
        GetMoneyAmount(user.cash).decimal
      } ${GetMoneyAmount(user.cash).title}`,
    },
    {
      title: 'In stocks',
      value: `$ ${
        GetMoneyAmount(GetUserStocksCapital(user.stocks, companies)).value
      }.${
        GetMoneyAmount(GetUserStocksCapital(user.stocks, companies)).decimal
      } ${GetMoneyAmount(GetUserStocksCapital(user.stocks, companies)).title}`,
    },
    { title: 'Days played', value: `${CountDaysPlayed(user.loginDate)} d` },
    {
      title: "Palyer's rating (last 24h)",
      value: `${+(
        +GetPortfolioProgress() / GetEconomicsProgress(companies)
      ).toFixed(2)}`,
      icon: true,
    },

    {
      title: "Palyer's all time rating",
      value: `${GetUserRating().toFixed(2)}`,
      icon: true,
    },
  ]

  function RenderUserPortfolioItem({ item }: any) {
    return (
      <View style={styles.rowBetween}>
        <Text style={[styles.infoText, { color: colors[themeColor].comment }]}>
          {item.title}
        </Text>
        {item.icon ? (
          <StatusItem
            icon=""
            title={item.value}
            type={
              item.value > 1 ? 'success' : item.value < 1 ? 'error' : 'warning'
            }
          />
        ) : (
          <Text style={[styles.money, { color: colors[themeColor].text }]}>
            {item.value}
          </Text>
        )}
      </View>
    )
  }

  function RenderUserStockItem({ item }: any) {
    const currentStockPrice = companies.find((c: any) => c.name === item.name)
      .history[
      companies.find((c: any) => c.name === item.name).history.length - 1
    ].price
    const stockProgress = (
      (currentStockPrice / item.averagePrice - 1) *
      100
    ).toFixed(2)
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          navigation.navigate('StockScreen', { companyName: item.name })
        }}
        style={styles.rowBetween}
      >
        <Text
          style={[
            styles.comapnyText,
            { color: colors[themeColor].comment, flex: 1 },
          ]}
        >
          {item.name}
        </Text>

        <Text style={[styles.money, { color: colors[themeColor].text }]}>
          $ {GetMoneyAmount(item.amount * currentStockPrice).value}.
          {GetMoneyAmount(item.amount * currentStockPrice).decimal}{' '}
          {GetMoneyAmount(item.amount * currentStockPrice).title}
        </Text>
        <StatusItem
          icon=""
          title={`${stockProgress} %`}
          type={
            +stockProgress > 0
              ? 'success'
              : +stockProgress < 0
              ? 'error'
              : 'warning'
          }
        />
      </TouchableOpacity>
    )
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{ flex: 1, backgroundColor: colors[themeColor].bgColor }}
    >
      <View
        style={[
          styles.container,
          { backgroundColor: colors[themeColor].bgColor },
        ]}
      >
        <HeaderDrawer title="Portfolio" />
        <View
          style={[
            styles.card,
            { backgroundColor: colors[themeColor].cardColor },
          ]}
        >
          {/* <Text style={[styles.userName, { color: colors[themeColor].text }]}>
          {user.name}
        </Text> */}
          <FlatList
            data={userPortfolioData}
            renderItem={RenderUserPortfolioItem}
            scrollEnabled={false}
          />
        </View>
        <Text style={[styles.comment, { color: colors[themeColor].comment }]}>
          The rating is a reflection of the growth of the player's capital
          relative to the economy, the rating will be {'>'} 1 if the capital
          grows faster than the economy and {'<'} 1 if it is slower
        </Text>
        <View style={[styles.rowBetween, { width: '92%' }]}>
          <Text style={[styles.title, { color: colors[themeColor].text }]}>
            User Stocks{' '}
            <Text style={[styles.title, { color: colors[themeColor].comment }]}>
              (last 24h)
            </Text>
          </Text>
          <StatusItem
            icon=""
            title={`${GetPortfolioProgress().toFixed(2)} %`}
            type={
              +GetPortfolioProgress() > 0
                ? 'success'
                : +GetPortfolioProgress() < 0
                ? 'error'
                : 'warning'
            }
          />
        </View>

        <View
          style={[
            styles.card,
            { backgroundColor: colors[themeColor].cardColor },
          ]}
        >
          {user.stocks.length ? (
            <FlatList
              data={user.stocks}
              renderItem={RenderUserStockItem}
              scrollEnabled={false}
            />
          ) : (
            <Text
              style={{
                fontSize: width * 0.05,
                color: colors[themeColor].comment,
              }}
            >
              No stocks yet
            </Text>
          )}
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  card: {
    width: '92%',
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  rowBetween: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  infoText: { fontSize: width * 0.04 },
  comapnyText: { fontSize: width * 0.035 },

  userName: {
    fontSize: width * 0.04,
  },
  money: { fontSize: width * 0.04 },
  decimal: { fontSize: width * 0.035, fontWeight: '400' },
  comment: { fontSize: width * 0.035, width: '92%', marginVertical: 5 },
  title: { fontSize: width * 0.05 },
})
