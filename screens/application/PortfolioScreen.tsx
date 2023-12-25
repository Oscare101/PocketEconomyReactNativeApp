import {
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  Switch,
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
  GetPortfolioProgress,
  GetUserDepositsCapital,
  GetUserRating,
  GetUserStocksCapital,
} from '../../functions/functions'
import StatusItem from '../../components/StatusItem'
import { RootState } from '../../redux'
import { useSelector } from 'react-redux'
import { User, UserStock } from '../../constants/interfaces'
import { Ionicons } from '@expo/vector-icons'
import { useMemo, useRef, useState } from 'react'
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet'
import BottomModalBlock from '../../components/BottomModalBlock'
import rules from '../../constants/rules'

const width = Dimensions.get('screen').width

export default function PortfolioScreen({ navigation }: any) {
  const systemTheme = useColorScheme()
  const theme = useSelector((state: RootState) => state.theme)
  const user: User = useSelector((state: RootState) => state.user)
  const companies: any = useSelector((state: RootState) => state.companies)
  const themeColor: any = theme === 'system' ? systemTheme : theme

  const [stockShowProgress, setStockShowProgress] = useState<boolean>(false)
  const [openStocksList, setOpenStocksList] = useState<boolean>(false)
  const [openDepositsList, setOpenDepositsList] = useState<boolean>(false)

  const [bottomSheetContent, setBottomSheetContent] =
    useState<any>('RatingInfo')
  const bottomSheetModalRef = useRef<BottomSheetModal>(null)
  const snapPoints = useMemo(() => [360], [])

  function GetRatingPerPeriod(period: number) {
    const portfolio = GetPortfolioProgress(user, companies, period)
    console.log(portfolio)

    return +(portfolio / GetEconomicsProgress(companies, period)).toFixed(2)
  }

  function IsPeriodEnough(period: number) {
    if (companies[0].history.length < period) {
      return false
    }
    return true
  }

  const userRatingData = [
    {
      title: 'Days played',
      valueAvailable: true,
      value: `${CountDaysPlayed(user.loginDate)} d`,
    },
    {
      title: 'Rating (last 1h)',
      valueAvailable: IsPeriodEnough(rules.stock.tactsPerHour),
      value: IsPeriodEnough(rules.stock.tactsPerHour)
        ? `${GetRatingPerPeriod(rules.stock.tactsPerHour)}`
        : '',
      ratingIcon: true,
    },
    {
      title: 'Rating (last 24h)',
      valueAvailable: IsPeriodEnough(rules.stock.tactsPerDay),
      value: IsPeriodEnough(rules.stock.tactsPerDay)
        ? `${GetRatingPerPeriod(rules.stock.tactsPerDay)}`
        : '',
      ratingIcon: true,
    },
    {
      title: 'Rating (all time)',
      valueAvailable: true,
      value: `${GetUserRating(user, companies).toFixed(2)}`,
      ratingIcon: true,
      infoModalData: 'Rating',
    },
  ]

  const userPortfolioData = [
    {
      type: 'Card',
      icon: 'briefcase-outline',
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
      type: 'Card',
      icon: 'cash-outline',
      title: 'Cash',
      value: `$ ${GetMoneyAmount(user.cash).value}.${
        GetMoneyAmount(user.cash).decimal
      } ${GetMoneyAmount(user.cash).title}`,
    },
    {
      type: 'Rating',
      data: userRatingData,
    },
    {
      type: 'Switch',
      title: 'Value/Progress',
      infoModalData: 'Progress',
    },
    {
      type: 'Stocks',
      title: 'Stocks',
      icon: 'analytics-outline',
      value: `$ ${
        GetMoneyAmount(GetUserStocksCapital(user.stocks, companies)).value
      }.${
        GetMoneyAmount(GetUserStocksCapital(user.stocks, companies)).decimal
      } ${GetMoneyAmount(GetUserStocksCapital(user.stocks, companies)).title}`,
      progress: GetPortfolioProgress(user, companies, 0).toFixed(2),
      data: user.stocks,
    },
    // TODO finish deposits
    // {
    //   type: 'Deposits',
    //   title: 'Deposits',
    //   icon: 'card-outline',
    //   value: `$ ${
    //     GetMoneyAmount(GetUserDepositsCapital(user.deposits)).value
    //   }.${GetMoneyAmount(GetUserDepositsCapital(user.deposits)).decimal} ${
    //     GetMoneyAmount(GetUserDepositsCapital(user.deposits)).title
    //   }`,
    //   data: user.deposits,
    // },
  ]

  function RenderUserRatingItem({ item }: any) {
    const iconType =
      item.value > 1 ? 'success' : item.value < 1 ? 'error' : 'warning'
    return (
      <View style={[styles.rowBetween, { marginVertical: 0 }]}>
        <Text
          style={[
            styles.userRatingTitle,
            { color: colors[themeColor].comment },
          ]}
        >
          {item.title}
        </Text>
        {item.infoModalData ? (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              setBottomSheetContent('RatingInfo')
              bottomSheetModalRef.current?.present()
            }}
          >
            <Ionicons
              name="information-circle-outline"
              color={colors[themeColor].text}
              size={width * 0.045}
            />
          </TouchableOpacity>
        ) : (
          <></>
        )}
        {item.valueAvailable ? (
          <>
            {item.ratingIcon ? (
              <View style={styles.rowEnd}>
                <StatusItem title={item.value} type={iconType} icon="" />
              </View>
            ) : (
              <Text
                style={[styles.cardValue, { color: colors[themeColor].text }]}
              >
                {item.value}
              </Text>
            )}
          </>
        ) : (
          <Text
            style={[styles.cardValue, { color: colors[themeColor].comment }]}
          >
            -
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
        style={[
          styles.rowBetween,
          { height: width * 0.08, marginVertical: 0, marginTop: 5 },
        ]}
      >
        <Ionicons
          name={'open-outline'}
          size={width * 0.05}
          color={colors[themeColor].comment}
        />
        <Text
          style={[
            styles.userStockTitle,
            { color: colors[themeColor].comment, flex: 1 },
          ]}
        >
          {item.name}
        </Text>
        {stockShowProgress ? (
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
        ) : (
          <Text style={[styles.money, { color: colors[themeColor].text }]}>
            $ {GetMoneyAmount(item.amount * currentStockPrice).value}.
            {GetMoneyAmount(item.amount * currentStockPrice).decimal}{' '}
            {GetMoneyAmount(item.amount * currentStockPrice).title}
          </Text>
        )}
      </TouchableOpacity>
    )
  }

  function RenderUserPortfolioItem({ item }: any) {
    const content = (
      <View
        style={[styles.card, { backgroundColor: colors[themeColor].cardColor }]}
      >
        <View style={styles.rowBetween}>
          <Ionicons
            name={item.icon}
            size={width * 0.05}
            color={colors[themeColor].text}
          />
          <Text style={[styles.cardTitle, { color: colors[themeColor].text }]}>
            {item.title}
          </Text>
          <Text style={[styles.cardValue, { color: colors[themeColor].text }]}>
            {item.value}
          </Text>
        </View>
      </View>
    )

    const ratingBlock = (
      <View
        style={[styles.card, { backgroundColor: colors[themeColor].cardColor }]}
      >
        <FlatList
          data={item.data}
          renderItem={RenderUserRatingItem}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        />
      </View>
    )

    const switchBlock = (
      <View
        style={[
          styles.rowBetween,
          {
            width: '92%',
            alignSelf: 'center',
            marginTop: 10,
            marginBottom: 0,
          },
        ]}
      >
        <Text
          style={[styles.switchTitle, { color: colors[themeColor].comment }]}
        >
          {item.title}
        </Text>
        {item.infoModalData ? (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              setBottomSheetContent('PersonalStockProgress')
              bottomSheetModalRef.current?.present()
            }}
          >
            <Ionicons
              name="information-circle-outline"
              color={colors[themeColor].text}
              size={width * 0.045}
            />
          </TouchableOpacity>
        ) : (
          <></>
        )}
        <View style={styles.rowEnd}>
          <Switch
            style={{ transform: [{ scale: 1.2 }] }}
            trackColor={{
              false: colors[themeColor].cardColor,
              true: colors[themeColor].cardColor,
            }}
            thumbColor={
              stockShowProgress
                ? colors[themeColor].successText
                : colors[themeColor].comment
            }
            ios_backgroundColor={colors[themeColor].cardColor}
            onValueChange={() => setStockShowProgress(!stockShowProgress)}
            value={stockShowProgress}
          />
        </View>
      </View>
    )

    const stocksBlock = (
      <View
        style={[styles.card, { backgroundColor: colors[themeColor].cardColor }]}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setOpenStocksList(!openStocksList)}
          style={[
            styles.rowBetween,
            {
              height: width * 0.08 + 10,
              marginVertical: 0,
            },
          ]}
        >
          <Ionicons
            name={item.icon}
            size={width * 0.05}
            color={colors[themeColor].text}
          />
          <Text style={[styles.cardTitle, { color: colors[themeColor].text }]}>
            {item.title}
          </Text>
          <Ionicons
            name={openStocksList ? 'chevron-up' : 'chevron-down'}
            size={width * 0.05}
            color={colors[themeColor].text}
          />
          {stockShowProgress ? (
            <View style={styles.rowEnd}>
              <StatusItem
                icon=""
                title={`${item.progress} %`}
                type={
                  +item.progress > 0
                    ? 'success'
                    : +item.progress < 0
                    ? 'error'
                    : 'warning'
                }
              />
            </View>
          ) : (
            <Text
              style={[styles.cardValue, { color: colors[themeColor].text }]}
            >
              {item.value}
            </Text>
          )}
        </TouchableOpacity>
        {openStocksList ? (
          <>
            <View
              style={{
                width: '100%',
                height: 1,
                backgroundColor: colors[themeColor].disable,
              }}
            />
            {item.data?.length ? (
              <FlatList data={item.data} renderItem={RenderUserStockItem} />
            ) : (
              <Text
                style={[styles.comment, { color: colors[themeColor].comment }]}
              >
                No stocks yet
              </Text>
            )}
          </>
        ) : (
          <></>
        )}
      </View>
    )

    const depositsBlock = (
      <View
        style={[styles.card, { backgroundColor: colors[themeColor].cardColor }]}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setOpenDepositsList(!openDepositsList)}
          style={[
            styles.rowBetween,
            {
              height: width * 0.08 + 10,
              marginVertical: 0,
            },
          ]}
        >
          <Ionicons
            name={item.icon}
            size={width * 0.05}
            color={colors[themeColor].text}
          />
          <Text style={[styles.cardTitle, { color: colors[themeColor].text }]}>
            {item.title}
          </Text>
          <Ionicons
            name={openDepositsList ? 'chevron-up' : 'chevron-down'}
            size={width * 0.05}
            color={colors[themeColor].text}
          />

          <Text style={[styles.cardValue, { color: colors[themeColor].text }]}>
            {item.value}
          </Text>
        </TouchableOpacity>
        {openDepositsList ? (
          <>
            <View
              style={{
                width: '100%',
                height: 1,
                backgroundColor: colors[themeColor].disable,
              }}
            />
            {/* TODO finish deposits */}
            {item.data?.length ? (
              <FlatList data={item.data} renderItem={RenderUserStockItem} />
            ) : (
              <Text
                style={[styles.comment, { color: colors[themeColor].comment }]}
              >
                No deposits yet
              </Text>
            )}
          </>
        ) : (
          <></>
        )}
      </View>
    )

    const renderType: any = {
      Rating: ratingBlock,
      Switch: switchBlock,
      Card: content,
      Stocks: stocksBlock,
      Deposits: depositsBlock,
    }

    return <>{renderType[item.type]}</>
  }

  return (
    <BottomSheetModalProvider>
      <View
        style={[
          styles.container,
          { backgroundColor: colors[themeColor].bgColor },
        ]}
      >
        <HeaderDrawer title="Portfolio" />
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{
            width: '100%',
            flex: 1,
            backgroundColor: colors[themeColor].bgColor,
          }}
        >
          <FlatList
            style={{ width: '100%' }}
            data={userPortfolioData}
            renderItem={RenderUserPortfolioItem}
            scrollEnabled={false}
          />
        </ScrollView>
      </View>
      {/* BottomSheet */}
      <BottomModalBlock
        bottomSheetModalRef={bottomSheetModalRef}
        snapPoints={snapPoints}
        dismiss={() => bottomSheetModalRef.current?.dismiss()}
        content={bottomSheetContent}
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
  card: {
    width: '92%',
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    alignSelf: 'center',
  },
  rowBetween: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  rowEnd: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },

  cardTitle: {
    fontSize: width * 0.05,
    marginHorizontal: 10,
  },
  userRatingTitle: { fontSize: width * 0.05, marginRight: 10 },
  cardValue: {
    fontSize: width * 0.05,
    flex: 1,
    textAlign: 'right',
  },
  money: { fontSize: width * 0.04 },
  switchTitle: {
    fontSize: width * 0.045,
    marginRight: 10,
  },
  userStockTitle: {
    fontSize: width * 0.04,
    marginHorizontal: 10,
  },
  comment: {
    fontSize: width * 0.04,
    fontWeight: '300',
    marginVertical: 10,
  },
})
