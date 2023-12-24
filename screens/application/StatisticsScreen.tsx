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
  GetEconomicsProgress,
  GetMoneyAmount,
  GetSortedCompaniesByProgress,
  GetUserProgress,
} from '../../functions/functions'
import StatusItem from '../../components/StatusItem'
import { RootState } from '../../redux'
import { useSelector } from 'react-redux'
import { User } from '../../constants/interfaces'

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

function StatisticsScreen(rating: number, period: number) {
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

  const themeColor: any = theme === 'system' ? systemTheme : theme

  function RenderCompanyProgress({ item }: any) {
    return (
      <TouchableOpacity
        style={{
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          // marginVertical: 5,
        }}
        activeOpacity={0.8}
        onPress={() => {
          navigation.navigate('StockScreen', { companyName: item.name })
        }}
      >
        <Text style={[styles.infoText, { color: colors[themeColor].text }]}>
          {item.name}
        </Text>
        <StatusItem
          title={`${item.progress} %`}
          type={
            item.progress > 0.01
              ? 'success'
              : item.progress < -0.01
              ? 'error'
              : 'warning'
          }
          icon=""
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
      <HeaderDrawer title="Statistics" />
      <View
        style={[styles.card, { backgroundColor: colors[themeColor].cardColor }]}
      >
        {/* <Text style={[styles.userName, { color: colors[themeColor].text }]}>
          {user.name}
        </Text> */}
        <View style={styles.rowBetween}>
          <Text style={[styles.infoText, { color: colors[themeColor].text }]}>
            Economics growth:{' '}
            <Text
              style={[styles.infoText, { color: colors[themeColor].comment }]}
            >
              (last 24h)
            </Text>
          </Text>
          <StatusItem
            title={`${GetEconomicsProgress(companies).toFixed(2)} %`}
            type={
              GetEconomicsProgress(companies) > 0.01
                ? 'success'
                : GetEconomicsProgress(companies) < -0.01
                ? 'error'
                : 'warning'
            }
            icon=""
          />
        </View>
        <View style={styles.columnStart}>
          <Text
            style={[styles.infoText, { color: colors[themeColor].comment }]}
          >
            Best companies: (last 24h)
          </Text>
          <FlatList
            style={{
              width: '100%',
              marginVertical: 5,
              backgroundColor: colors[themeColor].cardColor,
              padding: 10,
              borderRadius: 10,
            }}
            data={GetSortedCompaniesByProgress(companies).slice(0, 3)}
            renderItem={RenderCompanyProgress}
            ItemSeparatorComponent={() => <View style={{ height: 5 }} />}
          />
          <Text
            style={[styles.infoText, { color: colors[themeColor].comment }]}
          >
            Worst companies: (last 24h)
          </Text>
          <FlatList
            style={{
              width: '100%',
              marginTop: 5,
              backgroundColor: colors[themeColor].cardColor,
              padding: 10,
              borderRadius: 10,
            }}
            data={GetSortedCompaniesByProgress(companies).slice(-3)}
            renderItem={RenderCompanyProgress}
            ItemSeparatorComponent={() => <View style={{ height: 5 }} />}
          />
        </View>
        {/* <View style={styles.rowBetween}>
          <Text
            style={[styles.infoText, { color: colors[themeColor].comment }]}
          >
            Players growth:
          </Text>
          <StatusItem
            title={`${GetUserProgress(user.history)} %`}
            type={
              GetUserProgress(user.history) > 0.01
                ? 'success'
                : GetUserProgress(user.history) < -0.01
                ? 'error'
                : 'warning'
            }
            icon=""
          />
        </View>

        <View style={styles.rowBetween}>
          <Text
            style={[styles.infoText, { color: colors[themeColor].comment }]}
          >
            Days played:
          </Text>
          <Text style={[styles.money, { color: colors[themeColor].text }]}>
            {CountDaysPlayed(user.loginDate)} d
          </Text>
        </View> */}
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
  columnStart: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginVertical: 5,
  },
  infoText: { fontSize: width * 0.04 },
  userName: {
    fontSize: width * 0.04,
  },
  money: { fontSize: width * 0.04 },
  decimal: { fontSize: width * 0.035, fontWeight: '400' },
})
