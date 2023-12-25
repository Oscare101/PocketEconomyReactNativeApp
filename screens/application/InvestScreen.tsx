import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native'
import Button from '../../components/Button'
import colors from '../../constants/colors'
import StatusItem from '../../components/StatusItem'
import { Ionicons } from '@expo/vector-icons'
import DrawerButton from '../../components/DrawerButton'
import HeaderDrawer from '../../components/HeaderDrawer'
import { RootState } from '../../redux'
import { useSelector } from 'react-redux'
import StockStatusItem from '../../components/StockStatusItem'
import { GetMoneyAmount, GetProfit } from '../../functions/functions'
import rules from '../../constants/rules'
import { useState } from 'react'

const width = Dimensions.get('screen').width
const filterButtons = [
  { text: 'Aa', value: 'Name' },
  { text: '%', value: 'DividendsRate' },
  { text: '$', value: 'Price' },
  { icon: 'trending-up-outline', value: 'Volatility' },
  { icon: 'time-outline', value: 'DividendsConsistency' },
  { icon: 'business-outline', value: 'CompanySize' },
]

export default function InvestScreen({ navigation }: any) {
  const systemTheme = useColorScheme()
  const theme = useSelector((state: RootState) => state.theme)
  const companies = useSelector((state: RootState) => state.companies)

  const themeColor: any = theme === 'system' ? systemTheme : theme

  const [sortBy, setSortBy] = useState<string>('Name')
  const [sortFrom, setSortFrom] = useState<string>('High')

  function GetDataAboutCompanies(companies: any[]) {
    const newData = companies.map((c: any) => {
      return { ...c, history: c.history.slice(-1) }
    })
    return newData
  }

  function GetSortedCompanies() {
    const sort: any = {
      NameFromLow: Object.values(companies).sort((a, b) =>
        b.name.localeCompare(a.name)
      ),
      NameFromHigh: Object.values(companies).sort((a, b) =>
        a.name.localeCompare(b.name)
      ),
      VolatilityFromLow: Object.values(companies).sort(
        (a, b) => b.stat.volatility - a.stat.volatility
      ),
      VolatilityFromHigh: Object.values(companies).sort(
        (a, b) => a.stat.volatility - b.stat.volatility
      ),
      DividendsConsistencyFromLow: Object.values(companies).sort(
        (a, b) => a.stat.dividendsConsistency - b.stat.dividendsConsistency
      ),
      DividendsConsistencyFromHigh: Object.values(companies).sort(
        (a, b) => b.stat.dividendsConsistency - a.stat.dividendsConsistency
      ),
      CompanySizeFromLow: Object.values(companies).sort(
        (a, b) => a.stat.companySize - b.stat.companySize
      ),
      CompanySizeFromHigh: Object.values(companies).sort(
        (a, b) => b.stat.companySize - a.stat.companySize
      ),
      DividendsRateFromLow: Object.values(companies).sort(
        (a, b) => a.stat.dividendsRate - b.stat.dividendsRate
      ),
      DividendsRateFromHigh: Object.values(companies).sort(
        (a, b) => b.stat.dividendsRate - a.stat.dividendsRate
      ),
      PriceFromLow: Object.values(companies).sort(
        (a, b) =>
          a.history[a.history.length - 1].price -
          b.history[b.history.length - 1].price
      ),
      PriceFromHigh: Object.values(companies).sort(
        (a, b) =>
          b.history[b.history.length - 1].price -
          a.history[a.history.length - 1].price
      ),
    }
    return sort[`${sortBy}From${sortFrom}`]
  }

  function RenderFilterButton({ item }: any) {
    return (
      <TouchableOpacity
        style={{
          width: width / 7,
          marginHorizontal: width / 7 / 12,
          height: 30,
          marginVertical: 5,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor:
            sortBy === item.value
              ? colors[themeColor].comment
              : colors[themeColor].cardColor,
          borderRadius: 5,
          flexDirection: 'row',
        }}
        onPress={() => {
          if (sortBy === item.value) {
            setSortFrom((sortFrom) => (sortFrom === 'Low' ? 'High' : 'Low'))
          } else {
            setSortBy(item.value)
            setSortFrom('High')
          }
        }}
      >
        {sortBy === item.value ? (
          <Ionicons
            name={sortFrom === 'Low' ? 'caret-up' : 'caret-down'}
            size={14}
            color={
              sortBy === item.value
                ? colors[themeColor].text
                : colors[themeColor].comment
            }
          />
        ) : (
          <></>
        )}

        {item.text ? (
          <Text
            style={{
              fontSize: 14,
              color:
                sortBy === item.value
                  ? colors[themeColor].text
                  : colors[themeColor].comment,
            }}
          >
            {item.text}
          </Text>
        ) : (
          <Ionicons
            name={item.icon}
            size={14}
            color={
              sortBy === item.value
                ? colors[themeColor].text
                : colors[themeColor].comment
            }
          />
        )}
      </TouchableOpacity>
    )
  }

  function RenderCompanyItem({ item }: any) {
    const hourPercent = GetProfit(item.history.slice(-rules.stock.tactsPerHour))
    const dayPercent = GetProfit(item.history)

    return (
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          backgroundColor: colors[themeColor].cardColor,
          marginVertical: 5,
          width: '95%',
          alignSelf: 'center',
          justifyContent: 'space-between',
          borderRadius: 10,
          padding: 5,
        }}
        activeOpacity={0.8}
        onPress={() => {
          navigation.navigate('StockScreen', { companyName: item.name })
        }}
      >
        <View
          style={{
            flexDirection: 'column',
            flex: 1,
            alignItems: 'flex-start',
            justifyContent: 'space-between',
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
              borderBottomWidth: 1,
              borderBlockColor: colors[themeColor].comment,
              width: '100%',
            }}
          >
            <Text style={{ fontSize: 20, color: colors[themeColor].text }}>
              {item.name}
            </Text>
          </View>

          <Text
            style={{
              fontSize: 12,
              fontWeight: '300',
              color: colors[themeColor].comment,
            }}
          >
            {item.industry}
          </Text>
          <View style={styles.rowBetween}>
            <Text
              style={[styles.stockStat, { color: colors[themeColor].text }]}
            >
              Price: ${' '}
              {
                GetMoneyAmount(item.history[item.history.length - 1].price)
                  .value
              }
              .
              {
                GetMoneyAmount(item.history[item.history.length - 1].price)
                  .decimal
              }{' '}
              {
                GetMoneyAmount(item.history[item.history.length - 1].price)
                  .title
              }
            </Text>
            <Text
              style={[styles.stockStat, { color: colors[themeColor].text }]}
            >
              Dividend rate: up to {item.stat.dividendsRate} %
            </Text>
          </View>
          <View style={styles.rowBetween}>
            <Text
              style={[
                styles.companyStockPercent,
                { color: colors[themeColor].comment },
              ]}
            >
              Hour:{' '}
              <Text
                style={{
                  color:
                    +hourPercent > 0
                      ? colors[themeColor].successText
                      : hourPercent < 0
                      ? colors[themeColor].errorText
                      : colors[themeColor].warningText,
                }}
              >
                {hourPercent}%
              </Text>
            </Text>
            <Text
              style={[
                styles.companyStockPercent,
                { color: colors[themeColor].comment },
              ]}
            >
              Day:{' '}
              <Text
                style={{
                  color:
                    +dayPercent > 0
                      ? colors[themeColor].successText
                      : dayPercent < 0
                      ? colors[themeColor].errorText
                      : colors[themeColor].warningText,
                }}
              >
                {dayPercent}%
              </Text>
            </Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginLeft: 10,
          }}
        >
          <StockStatusItem
            title={false}
            type="volatility"
            statNumber={item.stat.volatility}
          />
          <StockStatusItem
            title={false}
            type="dividendsConsistency"
            statNumber={item.stat.dividendsConsistency}
          />
          <StockStatusItem
            title={false}
            type="companySize"
            statNumber={item.stat.companySize}
          />
        </View>
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
      <HeaderDrawer title="Stocks" />
      <FlatList
        horizontal
        scrollEnabled={false}
        style={{ width: '100%' }}
        data={filterButtons}
        renderItem={RenderFilterButton}
      />
      <FlatList
        style={{ width: '100%' }}
        data={GetSortedCompanies()}
        renderItem={RenderCompanyItem}
      />
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
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  stockStat: { fontSize: width * 0.035, flex: 1, fontWeight: '300' },
  companyStockPercent: {
    fontSize: width * 0.03,
    fontWeight: '300',
    flex: 1,
  },
})
