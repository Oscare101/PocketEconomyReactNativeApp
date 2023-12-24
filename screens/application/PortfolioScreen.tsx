import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from 'react-native'
import HeaderDrawer from '../../components/HeaderDrawer'
import colors from '../../constants/colors'
import { CountDaysPlayed, GetMoneyAmount } from '../../functions/functions'
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

  const themeColor: any = theme === 'system' ? systemTheme : theme

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
        <View style={styles.rowBetween}>
          <Text
            style={[styles.infoText, { color: colors[themeColor].comment }]}
          >
            Capital:
          </Text>
          {/* <Text style={[styles.money, { color: colors[themeColor].text }]}>
            $ {GetMoneyAmount(user.capital).value}.
            <Text style={styles.decimal}>
              {GetMoneyAmount(user.capital).decimal}
            </Text>{' '}
            {GetMoneyAmount(user.capital).title}
          </Text> */}
        </View>
        {/* <View style={styles.rowBetween}>
          <Text
            style={[styles.infoText, { color: colors[themeColor].comment }]}
          >
            Progress per day:
          </Text>
          <StatusItem
            type={GetInfoTypeProgress(user.ppd, 1)}
            title={`${user.ppd} %`}
            icon="trending-up"
          />
        </View>
        <View style={styles.rowBetween}>
          <Text
            style={[styles.infoText, { color: colors[themeColor].comment }]}
          >
            Progress per week:
          </Text>
          <StatusItem
            type={GetInfoTypeProgress(user.ppw, 7)}
            title={`${user.ppw} %`}
            icon="trending-up"
          />
        </View>
        <View style={styles.rowBetween}>
          <Text
            style={[styles.infoText, { color: colors[themeColor].comment }]}
          >
            Rating per day:
          </Text>
          <StatusItem
            type={GetInfoTypeRating(user.ratingDay)}
            title={`${user.ratingDay}`}
            icon="podium-outline"
          />
        </View>
        <View style={styles.rowBetween}>
          <Text
            style={[styles.infoText, { color: colors[themeColor].comment }]}
          >
            Rating per week:
          </Text>
          <StatusItem
            type={GetInfoTypeRating(user.ratingWeek)}
            title={`${user.ratingWeek}`}
            icon="podium-outline"
          />
        </View>
        <View style={styles.rowBetween}>
          <Text
            style={[styles.infoText, { color: colors[themeColor].comment }]}
          >
            All time rating:
          </Text>
          <StatusItem
            type={GetInfoTypeRating(user.ratingAll)}
            title={`${user.ratingAll}`}
            icon="podium-outline"
          />
        </View> */}
        <View style={styles.rowBetween}>
          <Text
            style={[styles.infoText, { color: colors[themeColor].comment }]}
          >
            Days played:
          </Text>
          <Text style={[styles.money, { color: colors[themeColor].text }]}>
            {CountDaysPlayed(user.loginDate)} d
          </Text>
        </View>
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
  userName: {
    fontSize: width * 0.04,
  },
  money: { fontSize: width * 0.04 },
  decimal: { fontSize: width * 0.035, fontWeight: '400' },
})
