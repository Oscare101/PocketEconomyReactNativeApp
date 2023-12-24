import {
  Dimensions,
  FlatList,
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
  GetMoneyAmount,
  GetUserStocksCapital,
} from '../../functions/functions'
import StatusItem from '../../components/StatusItem'
import { RootState } from '../../redux'
import { useSelector } from 'react-redux'
import { User } from '../../constants/interfaces'
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

  function GetUserRating() {
    const economicsProgress = GetEconomicsAllTimeProgress(companies)
    const userProgress = GetUserAllTimeProgress()

    const rating = userProgress / economicsProgress
    return +rating.toFixed(2)
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
    { title: "Palyer's rating", value: `${GetUserRating()}`, icon: true },
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
          title={stockProgress}
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
    <View
      style={[
        styles.container,
        { backgroundColor: colors[themeColor].bgColor },
      ]}
    >
      <HeaderDrawer title="Portfolio" />
      <View
        style={[styles.card, { backgroundColor: colors[themeColor].cardColor }]}
      >
        {/* <Text style={[styles.userName, { color: colors[themeColor].text }]}>
          {user.name}
        </Text> */}
        <FlatList
          data={userPortfolioData}
          renderItem={RenderUserPortfolioItem}
        />
      </View>
      <Text style={[styles.comment, { color: colors[themeColor].comment }]}>
        The rating is a reflection of the growth of the player's capital
        relative to the economy, the rating will be {'>'} 1 if the capital grows
        faster than the economy and {'<'} 1 if it is slower
      </Text>
      <Text style={[styles.title, { color: colors[themeColor].text }]}>
        User Stocks
      </Text>
      <View
        style={[styles.card, { backgroundColor: colors[themeColor].cardColor }]}
      >
        <FlatList data={user.stocks} renderItem={RenderUserStockItem} />
      </View>
    </View>
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
  comment: { fontSize: width * 0.035, width: '92%' },
  title: { fontSize: width * 0.05, textAlign: 'left', width: '92%' },
})
