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
import { Ionicons } from '@expo/vector-icons'
import { RootState } from '../../redux'
import { useSelector } from 'react-redux'
import colors from '../../constants/colors'
import StockStatusItem from '../../components/StockStatusItem'
import {
  GetMoneyAmount,
  GetProfit,
  countElapsedPeriods,
} from '../../functions/functions'
import rules from '../../constants/rules'
import { useEffect, useMemo, useRef, useState } from 'react'
import StatusItem from '../../components/StatusItem'
import { User } from '../../constants/interfaces'
import Button from '../../components/Button'
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet'
import BottomModalBlock from '../../components/BottomModalBlock'

const width = Dimensions.get('screen').width
const stockWidth = width * 0.92 - 20

const columnHeight: number = 150
const dotSize: number = 2
const lineWidth: number = 2

const periodButtonsData: any = [
  { title: 'Hour', numToRender: rules.stock.tactsPerHour },
  { title: 'Day', numToRender: rules.stock.tactsPerDay },
  // { title: 'Week', numToRender: rules.stock.tactsPerWeek },
]

function GetTargetLengthRender(length: number) {
  if (length < rules.stock.tactsPerDay / 2) {
    return length
  } else {
    return rules.stock.tactsPerHour
  }
}

export default function StockScreen({ navigation, route }: any) {
  const systemTheme = useColorScheme()
  const theme = useSelector((state: RootState) => state.theme)
  const companies = useSelector((state: RootState) => state.companies)
  const user: User = useSelector((state: RootState) => state.user)

  const themeColor: any = theme === 'system' ? systemTheme : theme

  const [pressedPrice, setPressedPrice] = useState<any>()
  const [periodToRender, setPeriodToRender] = useState<string>('Hour')

  const [numToRender, setNumToRender] = useState<number>(
    rules.stock.tactsPerHour
  )
  const [stocksToRender, setStocksToRender] = useState<any[]>(
    GetCompresedStocksHistory(
      GetCompany().history.slice(-rules.stock.tactsPerHour)
    )
  )
  const [bottomSheetContent, setBottomSheetContent] = useState<any>('')
  const bottomSheetModalRef = useRef<BottomSheetModal>(null)
  const snapPoints = useMemo(() => [360], [])

  useEffect(() => {
    setStocksToRender(
      GetCompresedStocksHistory(
        GetCompany().history.slice(
          -periodButtonsData.find((i: any) => i.title === periodToRender)
            .numToRender
        )
      )
    )
  }, [companies])

  function GetCompany() {
    const currentCompany: any = companies.find(
      (c: any) => c.name === route.params.companyName
    )
    return currentCompany
  }

  function GetUserStockPrice() {
    const amount =
      user.stocks.find((s: any) => s.name === route.params.companyName)
        ?.amount || 0
    const price = GetCompany().history[GetCompany().history.length - 1].price
    // user.stocks.find((s: any) => s.name === route.params.companyName)
    //   ?.averagePrice || 0
    return `$ ${GetMoneyAmount(amount * price).value}.${
      GetMoneyAmount(amount * price).decimal
    } ${GetMoneyAmount(amount * price).title}`
  }

  const companyStatData = [
    {
      title: 'Volatility',
      statNumber: GetCompany()?.stat.volatility,
      type: 'volatility',
      statIcon: true,
    },
    {
      title: 'Dividends consistency',
      statNumber: GetCompany()?.stat.dividendsConsistency,
      type: 'dividendsConsistency',
      statIcon: true,
    },
    {
      title: 'Company size',
      statNumber: GetCompany()?.stat.companySize,
      type: 'companySize',
      statIcon: true,
    },
    {
      title: 'Price',
      statIcon: false,
      value: `$ ${
        GetMoneyAmount(
          GetCompany().history[GetCompany().history.length - 1].price
        ).value
      }.${
        GetMoneyAmount(
          GetCompany().history[GetCompany().history.length - 1].price
        ).decimal
      } ${
        GetMoneyAmount(
          GetCompany().history[GetCompany().history.length - 1].price
        ).title
      }`,
    },
    {
      title: 'Last update',
      statIcon: false,
      value: GetCompany().history[GetCompany().history.length - 1].time,
    },
    {
      title: `Last ${periodToRender.toLocaleLowerCase()} progress`,
      stockStatIcon: true,
      value: `${GetProfit(stocksToRender)} %`,
    },
  ]

  const userStockData = [
    {
      title: 'Your stocks amount',
      value:
        user.stocks.find((s: any) => s.name === route.params.companyName)
          ?.amount || 0,
    },
    {
      title: 'Your stocks price',
      value: GetUserStockPrice(),
    },
    {
      title: 'Your stocks growth',
      value: `${+(
        (GetCompany().history[GetCompany().history.length - 1].price /
          (user.stocks.find((s: any) => s.name === route.params.companyName)
            ?.averagePrice ||
            GetCompany().history[GetCompany().history.length - 1].price) -
          1) *
        100
      ).toFixed(2)} %`,
      stockStatIcon: user.stocks.find(
        (s: any) => s.name === route.params.companyName
      ),
      disable: !user.stocks.find(
        (s: any) => s.name === route.params.companyName
      ),
    },
  ]

  function RenderStat({ item }: any) {
    return (
      <View style={styles.statItemBlock}>
        <Text
          style={[styles.statItemTitle, { color: colors[themeColor].text }]}
        >
          {item.title}
        </Text>
        {item.statIcon ? (
          <StockStatusItem
            title={true}
            type={item.type}
            statNumber={item.statNumber}
          />
        ) : item.stockStatIcon ? (
          <StatusItem
            icon=""
            title={item.value}
            type={
              +item.value.replace('%', '') > 0.01
                ? 'success'
                : +item.value.replace('%', '') < -0.01
                ? 'error'
                : 'warning'
            }
          />
        ) : (
          <Text
            style={[styles.statItemTitle, { color: colors[themeColor].text }]}
          >
            {item.value}
          </Text>
        )}
      </View>
    )
  }

  function GetDotPosition(
    value: number,
    elementSize: number,
    renderData: any[]
  ) {
    if (renderData.length > 0) {
      const arr = [...renderData]

      const dataMin = arr.sort((a, b) => a.price - b.price)[0].price

      const dataMax = arr.sort((a, b) => b.price - a.price)[0].price

      const range = dataMax - dataMin
      if (range === 0) {
        return Math.round(0.5 * (columnHeight - elementSize))
      }

      const valueRange = value - dataMin

      const position =
        arr.length > 1
          ? Math.round((valueRange / range) * (columnHeight - elementSize))
          : Math.round(0.5 * (columnHeight - elementSize))

      return position
    } else {
      return 0
    }
  }

  function GetHeightDifference(item1: number, item2: number) {
    const height1 = GetDotPosition(item1, dotSize, stocksToRender)
    const height2 = GetDotPosition(item2, dotSize, stocksToRender)

    return height2 - height1
  }

  function GetAngle(item1: number, item2: number) {
    const height = GetHeightDifference(item1, item2)
    const angle =
      Math.atan(height / (stockWidth / numToRender)) * (180 / Math.PI)

    return angle * -1
  }

  function GetCompresedStocksHistory(history: any[]) {
    const originalLength = history.length
    const targetLength = GetTargetLengthRender(originalLength)
    const compressionFactor = originalLength / targetLength

    if (originalLength <= targetLength) {
      return history
    }

    const compressedArray = []
    for (let i = 0; i < targetLength; i++) {
      const pointsInRange =
        history
          .slice(
            i * compressionFactor,
            i * compressionFactor + compressionFactor
          )
          .reduce((a, b) => a + b.price, 0) / compressionFactor

      const point = Math.floor(i * compressionFactor)

      compressedArray.push({ ...history[point], price: pointsInRange })
    }

    return compressedArray
  }

  function RenderItem({ item, index }: any) {
    return (
      <TouchableOpacity
        style={{
          height: columnHeight,
          width: stockWidth / numToRender,
          position: 'relative',
          overflow: 'visible',
          backgroundColor:
            pressedPrice === item
              ? `${colors[themeColor].warningText}40`
              : '#00000000',
        }}
        activeOpacity={0.8}
        onPress={() => {
          setPressedPrice(item)
        }}
      >
        <View
          style={{
            position: 'absolute',
            width: dotSize,
            height: dotSize,
            borderRadius: dotSize,
            backgroundColor: colors[themeColor].text,
            left: stockWidth / numToRender / 2 - dotSize / 2,
            bottom: GetDotPosition(item.price, dotSize, stocksToRender),
            transform: [
              {
                rotate: stocksToRender[index + 1]
                  ? `${GetAngle(
                      item.price,
                      stocksToRender[index + 1].price
                    )}deg`
                  : '0deg',
              },
            ],
          }}
        >
          {stocksToRender[index + 1] ? (
            <View
              style={{
                position: 'absolute',
                backgroundColor: colors[themeColor].text,
                width: Math.sqrt(
                  (stockWidth / numToRender) ** 2 +
                    GetHeightDifference(
                      item.price,
                      stocksToRender[index + 1].price
                    ) **
                      2
                ),
                height: lineWidth,
                left: dotSize / 2,
                bottom: dotSize / 2 - lineWidth / 2,
                borderRadius: lineWidth,
              }}
            />
          ) : (
            <></>
          )}
        </View>
      </TouchableOpacity>
    )
  }

  function RenderPeriodButtonItem({ item }: any) {
    return (
      <TouchableOpacity
        style={{
          width: '48%',
          backgroundColor: colors[themeColor].cardColor,
          padding: 10,
          borderRadius: 10,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        activeOpacity={0.8}
        onPress={() => {
          setPressedPrice(null)
          setPeriodToRender(item.title)

          setNumToRender(GetTargetLengthRender(item.numToRender))
          setStocksToRender(
            GetCompresedStocksHistory(
              GetCompany().history.slice(-item.numToRender)
            )
          )
        }}
      >
        <Text
          style={{
            color:
              periodToRender === item.title
                ? colors[themeColor].text
                : colors[themeColor].comment,
          }}
        >
          {item.title}
        </Text>
      </TouchableOpacity>
    )
  }

  function RenderUserStat({ item }: any) {
    return (
      <View style={[styles.statItemBlock, { opacity: item.disable ? 0.3 : 1 }]}>
        <Text
          style={[styles.statItemTitle, { color: colors[themeColor].text }]}
        >
          {item.title}
        </Text>
        {item.statIcon ? (
          <StockStatusItem
            title={true}
            type={item.type}
            statNumber={item.statNumber}
          />
        ) : item.stockStatIcon ? (
          <StatusItem
            icon=""
            title={item.value}
            type={
              +item.value.replace('%', '') > 0.01
                ? 'success'
                : +item.value.replace('%', '') < -0.01
                ? 'error'
                : 'warning'
            }
          />
        ) : (
          <Text
            style={[styles.statItemTitle, { color: colors[themeColor].text }]}
          >
            {item.value}
          </Text>
        )}
      </View>
    )
  }

  return (
    <BottomSheetModalProvider>
      <ScrollView
        style={{ flex: 1, backgroundColor: colors[themeColor].bgColor }}
      >
        <View
          style={[
            styles.container,
            { backgroundColor: colors[themeColor].bgColor },
          ]}
        >
          <View style={styles.companyHeader}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <Ionicons
                name="chevron-back"
                size={width * 0.07}
                color={colors[themeColor].text}
              />
            </TouchableOpacity>

            <Text
              numberOfLines={1}
              style={[styles.headerTitle, { color: colors[themeColor].text }]}
            >
              {route.params.companyName}
            </Text>
          </View>
          <Text
            style={[styles.description, { color: colors[themeColor].comment }]}
          >
            {GetCompany()?.description}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '92%',
            }}
          >
            {periodButtonsData.map((item: any, index: number) => (
              <RenderPeriodButtonItem item={item} key={index} />
            ))}
          </View>
          {/* STOCK CHART */}
          <View
            style={[
              styles.card,
              { backgroundColor: colors[themeColor].cardColor },
            ]}
          >
            <FlatList
              horizontal
              scrollEnabled={false}
              showsHorizontalScrollIndicator={false}
              data={stocksToRender}
              scrollsToTop
              renderItem={RenderItem}
              initialNumToRender={numToRender}
              removeClippedSubviews={true}
              getItemLayout={(_: any, index: number) => ({
                length: stockWidth / numToRender,
                offset: (stockWidth / numToRender) * index,
                index,
              })}
            />
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
              }}
            >
              <Text style={{ color: colors[themeColor].comment }}>
                {stocksToRender[0].time}
              </Text>
              <Text style={{ color: colors[themeColor].comment }}>
                {stocksToRender[stocksToRender.length - 1].time}
              </Text>
            </View>
          </View>
          {/* PRESSED PRICE */}
          {pressedPrice?.price ? (
            <View
              style={[
                styles.card,
                {
                  backgroundColor: colors[themeColor].cardColor,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                },
              ]}
            >
              <Text style={{ color: colors[themeColor].text }}>
                {pressedPrice?.date} {pressedPrice?.time}
              </Text>
              <Text style={{ color: colors[themeColor].text }}>
                $ {GetMoneyAmount(pressedPrice?.price).value}.
                {GetMoneyAmount(pressedPrice?.price).decimal}{' '}
                {GetMoneyAmount(pressedPrice?.price).title}
              </Text>
            </View>
          ) : (
            <></>
          )}
          {/* STAT */}
          <View
            style={[
              styles.card,
              { backgroundColor: colors[themeColor].cardColor },
            ]}
          >
            <FlatList
              scrollEnabled={false}
              data={companyStatData}
              renderItem={RenderStat}
              ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
            />
          </View>
          {/* TRANSACTION */}
          <View
            style={[
              styles.card,
              { backgroundColor: colors[themeColor].cardColor },
            ]}
          >
            <FlatList
              scrollEnabled={false}
              data={userStockData}
              renderItem={RenderUserStat}
              ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
            />

            <Button
              style={{ width: '100%', marginTop: 10 }}
              title="Transaction"
              disable={false}
              type="info"
              action={() => {
                setBottomSheetContent('transactionBlock')
                bottomSheetModalRef.current?.present()
              }}
            />
          </View>
        </View>
      </ScrollView>
      {/* BottomSheet */}
      <BottomModalBlock
        bottomSheetModalRef={bottomSheetModalRef}
        snapPoints={snapPoints}
        dismiss={() => bottomSheetModalRef.current?.dismiss()}
        content={bottomSheetContent}
        transactionStockName={route.params.companyName}
        onClose={() => bottomSheetModalRef.current?.dismiss()}
      />
    </BottomSheetModalProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  companyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '92%',
  },
  backButton: {
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: width * 0.07,
    marginLeft: width * 0.07,
  },
  description: {
    fontSize: width * 0.04,
    width: '92%',
    marginVertical: 5,
    textAlign: 'center',
  },
  card: {
    width: '92%',
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  statItemBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  statItemTitle: {
    fontSize: width * 0.04,
  },
})
