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
  GenerateDividendsDates,
  GetEconomicsProgress,
  GetMoneyAmount,
  GetPortfolioProgress,
  GetRatingPerPeriod,
  GetReversedArr,
  GetUserDividendsValue,
  GetUserRating,
  GetUserStocksCapital,
  IsPeriodEnough,
} from '../../functions/functions'
import StatusItem from '../../components/StatusItem'
import { RootState } from '../../redux'
import { useSelector } from 'react-redux'
import { User, UserRealEstate, UserStock } from '../../constants/interfaces'
import { Ionicons } from '@expo/vector-icons'
import { useMemo, useRef, useState } from 'react'
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet'
import BottomModalBlock from '../../components/BottomModalBlock'
import rules from '../../constants/rules'
import {
  GetDepositMatureDateTime,
  GetUserDepositsCapital,
} from '../../functions/depositFunctions'
import {
  GetAllRentalPaymentValue,
  GetPropertiesValuePerRegion,
  GetUserAllPropertiesCost,
} from '../../functions/realEstateFunctions'

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
  const [openDividendsList, setOpenDividendsList] = useState<boolean>(false)
  const [openRealEstateList, setOpenRealEstateList] = useState<boolean>(false)
  const [openRentalPaymentList, setOpenRentalPaymentList] =
    useState<boolean>(false)

  const [bottomSheetContent, setBottomSheetContent] =
    useState<any>('RatingInfo')
  const bottomSheetModalRef = useRef<BottomSheetModal>(null)
  const snapPoints = useMemo(() => [360], [])

  const userRatingData = [
    {
      title: 'Days played',
      valueAvailable: true,
      value: `${CountDaysPlayed(user.loginDate)} d`,
    },
    {
      title: 'Stocks overtake (last 1h)',
      valueAvailable: IsPeriodEnough(companies, rules.stock.tactsPerHour),
      value: IsPeriodEnough(companies, rules.stock.tactsPerHour)
        ? `${GetRatingPerPeriod(user, companies, rules.stock.tactsPerHour)}`
        : '',
      ratingIcon: true,
    },
    {
      title: 'Stocks overtake (last 24h)',
      valueAvailable: IsPeriodEnough(companies, rules.stock.tactsPerDay),
      value: IsPeriodEnough(companies, rules.stock.tactsPerDay)
        ? `${GetRatingPerPeriod(user, companies, rules.stock.tactsPerDay)}`
        : '',
      ratingIcon: true,
      infoModalData: 'StocksOvertakeInfo',
    },
    {
      title: 'Rating (all time)',
      valueAvailable: true,
      value: `${GetUserRating(user, companies).toFixed(2)}`,
      ratingIcon: true,
      infoModalData: 'RatingInfo',
    },
  ]

  const userPortfolioData = [
    {
      type: 'Card',
      icon: 'briefcase-outline',
      title: 'Capital',
      value: `$ ${
        GetMoneyAmount(
          GetUserStocksCapital(user.stocks, companies) +
            user.cash +
            GetUserDepositsCapital(user.deposits) +
            GetUserAllPropertiesCost(user)
        ).value
      }.${
        GetMoneyAmount(
          GetUserStocksCapital(user.stocks, companies) +
            user.cash +
            GetUserDepositsCapital(user.deposits) +
            GetUserAllPropertiesCost(user)
        ).decimal
      }${
        GetMoneyAmount(
          GetUserStocksCapital(user.stocks, companies) +
            user.cash +
            GetUserDepositsCapital(user.deposits) +
            GetUserAllPropertiesCost(user)
        ).title
      }`,
    },
    {
      type: 'Card',
      icon: 'cash-outline',
      title: 'Cash',
      value: `$ ${GetMoneyAmount(user.cash).value}.${
        GetMoneyAmount(user.cash).decimal
      }${GetMoneyAmount(user.cash).title}`,
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
      icon: 'trending-up-outline',
      value: `$ ${
        GetMoneyAmount(GetUserStocksCapital(user.stocks, companies)).value
      }.${
        GetMoneyAmount(GetUserStocksCapital(user.stocks, companies)).decimal
      }${GetMoneyAmount(GetUserStocksCapital(user.stocks, companies)).title}`,
      progress: GetPortfolioProgress(user, companies, 0).toFixed(2),
      data: user.stocks,
    },
    {
      type: 'Dividends',
      title: 'Dividends',
      icon: 'download-outline',
      data: user.dividendsHistory,
    },
    {
      type: 'Deposits',
      title: 'Deposits',
      icon: 'wallet-outline',
      value: `$ ${
        GetMoneyAmount(GetUserDepositsCapital(user.deposits)).value
      }.${GetMoneyAmount(GetUserDepositsCapital(user.deposits)).decimal}${
        GetMoneyAmount(GetUserDepositsCapital(user.deposits)).title
      }`,
      data: user.deposits,
    },
    {
      type: 'RealEstate',
      title: 'Real Estate',
      icon: 'home-outline',
      value: `$ ${GetMoneyAmount(GetUserAllPropertiesCost(user)).value}.${
        GetMoneyAmount(GetUserAllPropertiesCost(user)).decimal
      }${GetMoneyAmount(GetUserAllPropertiesCost(user)).title}`,
      data: user.realEstate,
    },
    {
      type: 'RentalPayment',
      title: 'Rental Payment',
      icon: 'download-outline',
      value: `$ ${
        GetMoneyAmount(GetAllRentalPaymentValue(user.realEstateHistory)).value
      }.${
        GetMoneyAmount(GetAllRentalPaymentValue(user.realEstateHistory)).decimal
      }${
        GetMoneyAmount(GetAllRentalPaymentValue(user.realEstateHistory)).title
      }`,
      data: user.realEstateHistory,
    },
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
              setBottomSheetContent(item.infoModalData)
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
          size={width * 0.04}
          color={colors[themeColor].comment}
        />
        <Text
          style={[
            styles.userStockTitle,
            { color: colors[themeColor].comment, flex: 1 },
          ]}
          numberOfLines={1}
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
            {GetMoneyAmount(item.amount * currentStockPrice).decimal}
            {GetMoneyAmount(item.amount * currentStockPrice).title}
          </Text>
        )}
      </TouchableOpacity>
    )
  }

  function RenderUserDividendItem({ item }: any) {
    const dividends = user.dividendsHistory.filter((d: any) => d.date === item)
    const dividendsSum = GetUserDividendsValue(dividends)

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          navigation.navigate('DividendsScreen', { dividends: dividends })
        }}
        disabled={!dividends.length}
        style={[
          styles.rowBetween,
          {
            height: width * 0.08,
            marginVertical: 0,
            marginTop: 5,
          },
        ]}
      >
        <Ionicons
          name={'open-outline'}
          size={width * 0.04}
          color={colors[themeColor].comment}
        />
        <Text
          style={[
            styles.userStockTitle,
            { color: colors[themeColor].comment, flex: 1 },
          ]}
        >
          {item}
        </Text>
        {dividends.length ? (
          <Text style={[styles.money, { color: colors[themeColor].text }]}>
            $ {GetMoneyAmount(dividendsSum).value}.
            {GetMoneyAmount(dividendsSum).decimal}
            {GetMoneyAmount(dividendsSum).title}
          </Text>
        ) : (
          <Text style={[styles.money, { color: colors[themeColor].comment }]}>
            -
          </Text>
        )}
      </TouchableOpacity>
    )
  }

  function RenderUserDepositItem({ item }: any) {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() =>
          navigation.navigate('EditDepositScreen', { deposit: item })
        }
        style={[
          styles.rowBetween,
          // { height: width * 0.08, marginVertical: 0, marginTop: 5 },
        ]}
      >
        <Ionicons
          name={'open-outline'}
          size={width * 0.04}
          color={colors[themeColor].comment}
        />
        <View style={styles.collumnEnd}>
          <View style={[styles.rowBetween, { marginVertical: 1 }]}>
            <Text
              style={[
                styles.userStockTitle,
                { color: colors[themeColor].text },
              ]}
              numberOfLines={1}
            >
              {item.name}
            </Text>
            {item.autoRenewal ? (
              <Ionicons
                name="repeat-outline"
                size={width * 0.04}
                color={colors[themeColor].successText}
              />
            ) : (
              <></>
            )}
            <Text
              style={[
                styles.money,
                { color: colors[themeColor].text, flex: 1, textAlign: 'right' },
              ]}
            >
              $ {GetMoneyAmount(item.value).value}.
              {GetMoneyAmount(item.value).decimal}
              {GetMoneyAmount(item.value).title}
            </Text>
          </View>
          <View style={[styles.rowBetween, { marginVertical: 1 }]}>
            <Text
              style={[
                styles.userStockTitle,
                {
                  color: colors[themeColor].comment,
                  flex: 1,
                  fontSize: width * 0.03,
                },
              ]}
              numberOfLines={1}
            >
              Payment{' '}
              {
                GetDepositMatureDateTime(
                  item.openingDate,
                  item.openingTime,
                  item.durationHours
                ).date
              }{' '}
              {
                GetDepositMatureDateTime(
                  item.openingDate,
                  item.openingTime,
                  item.durationHours
                ).time
              }
            </Text>
            <Text
              style={[
                {
                  color: colors[themeColor].comment,
                  // flex: 1,
                  fontSize: width * 0.03,
                },
              ]}
            >
              {item.interest} %
            </Text>
          </View>
        </View>

        {/*  */}
      </TouchableOpacity>
    )
  }

  function RenderUserRealEstateItem({ item }: any) {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          navigation.navigate('RealEstateScreen', { region: item.region })
        }}
        style={[
          styles.rowBetween,
          { height: width * 0.08, marginVertical: 0, marginTop: 5 },
        ]}
      >
        <Ionicons
          name={'open-outline'}
          size={width * 0.04}
          color={colors[themeColor].comment}
        />
        <Text
          style={[
            styles.userStockTitle,
            { color: colors[themeColor].comment, flex: 1 },
          ]}
          numberOfLines={1}
        >
          Tier {item.region} region
        </Text>

        <Text style={[styles.money, { color: colors[themeColor].text }]}>
          ${' '}
          {GetMoneyAmount(GetPropertiesValuePerRegion(user, item.region)).value}
          .
          {
            GetMoneyAmount(GetPropertiesValuePerRegion(user, item.region))
              .decimal
          }
          {GetMoneyAmount(GetPropertiesValuePerRegion(user, item.region)).title}
        </Text>
      </TouchableOpacity>
    )
  }

  function RenderUserRentalPaymentItem({ item }: any) {
    return (
      <View
        style={[
          styles.rowBetween,
          {
            height: width * 0.08,
            marginVertical: 0,
            marginTop: 5,
          },
        ]}
      >
        <Ionicons
          name={'time-outline'}
          size={width * 0.04}
          color={colors[themeColor].comment}
        />
        <Text
          style={[
            styles.userStockTitle,
            { color: colors[themeColor].comment, flex: 1 },
          ]}
        >
          {item.time}
        </Text>
        <Text style={[styles.money, { color: colors[themeColor].text }]}>
          $ {GetMoneyAmount(item.value).value}.
          {GetMoneyAmount(item.value).decimal}
          {GetMoneyAmount(item.value).title}
        </Text>
      </View>
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

    const dividendsBlock = (
      <View
        style={[styles.card, { backgroundColor: colors[themeColor].cardColor }]}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setOpenDividendsList(!openDividendsList)}
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
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              setBottomSheetContent('DividendsInfo')
              bottomSheetModalRef.current?.present()
            }}
            style={{ marginRight: 5 }}
          >
            <Ionicons
              name="information-circle-outline"
              color={colors[themeColor].text}
              size={width * 0.045}
            />
          </TouchableOpacity>
          <Ionicons
            name={openDividendsList ? 'chevron-up' : 'chevron-down'}
            size={width * 0.05}
            color={colors[themeColor].text}
          />
          <View style={{ flex: 1 }} />
          <View style={styles.collumnEnd}>
            <Text style={[styles.money, { color: colors[themeColor].text }]}>
              ${' '}
              {
                GetMoneyAmount(GetUserDividendsValue(user.dividendsHistory))
                  .value
              }
              .
              {
                GetMoneyAmount(GetUserDividendsValue(user.dividendsHistory))
                  .decimal
              }
              {
                GetMoneyAmount(GetUserDividendsValue(user.dividendsHistory))
                  .title
              }
            </Text>
            <Text
              style={[
                styles.comment,
                { color: colors[themeColor].comment, marginVertical: 0 },
              ]}
            >
              last 7 days
            </Text>
          </View>
        </TouchableOpacity>
        {openDividendsList ? (
          <>
            <View
              style={{
                width: '100%',
                height: 1,
                backgroundColor: colors[themeColor].disable,
              }}
            />
            <FlatList
              data={GenerateDividendsDates()}
              renderItem={RenderUserDividendItem}
            />
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
            {user.deposits.length ? (
              <FlatList data={item.data} renderItem={RenderUserDepositItem} />
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

    const realEstateBlock = (
      <View
        style={[styles.card, { backgroundColor: colors[themeColor].cardColor }]}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setOpenRealEstateList(!openRealEstateList)}
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
            name={openRealEstateList ? 'chevron-up' : 'chevron-down'}
            size={width * 0.05}
            color={colors[themeColor].text}
          />

          <Text style={[styles.cardValue, { color: colors[themeColor].text }]}>
            {item.value}
          </Text>
        </TouchableOpacity>
        {openRealEstateList ? (
          <>
            <View
              style={{
                width: '100%',
                height: 1,
                backgroundColor: colors[themeColor].disable,
              }}
            />
            {user.realEstate.length ? (
              <FlatList
                data={user.realEstate.filter((r: UserRealEstate) => r.amount)}
                renderItem={RenderUserRealEstateItem}
              />
            ) : (
              <Text
                style={[styles.comment, { color: colors[themeColor].comment }]}
              >
                No properties yet
              </Text>
            )}
          </>
        ) : (
          <></>
        )}
      </View>
    )

    const rentalPaymentBlock = (
      <View
        style={[styles.card, { backgroundColor: colors[themeColor].cardColor }]}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setOpenRentalPaymentList(!openRentalPaymentList)}
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
          {/* <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              // setBottomSheetContent('DividendsInfo')
              // bottomSheetModalRef.current?.present()
            }}
            style={{ marginRight: 5 }}
          >
            <Ionicons
              name="information-circle-outline"
              color={colors[themeColor].text}
              size={width * 0.045}
            />
          </TouchableOpacity> */}
          <Ionicons
            name={openRentalPaymentList ? 'chevron-up' : 'chevron-down'}
            size={width * 0.05}
            color={colors[themeColor].text}
          />
          <View style={styles.collumnEnd}>
            <Text style={[styles.money, { color: colors[themeColor].text }]}>
              {item.value}
            </Text>
            <Text
              style={[
                styles.comment,
                { color: colors[themeColor].comment, marginVertical: 0 },
              ]}
            >
              last 24 hours
            </Text>
          </View>
        </TouchableOpacity>
        {openRentalPaymentList ? (
          <>
            <View
              style={{
                width: '100%',
                height: 1,
                backgroundColor: colors[themeColor].disable,
              }}
            />
            <FlatList
              data={GetReversedArr(user.realEstateHistory)}
              renderItem={RenderUserRentalPaymentItem}
            />
          </>
        ) : (
          <Text style={[styles.comment, { color: colors[themeColor].comment }]}>
            No playments yet
          </Text>
        )}
      </View>
    )

    const renderType: any = {
      Rating: ratingBlock,
      Switch: switchBlock,
      Card: content,
      Stocks: stocksBlock,
      Dividends: dividendsBlock,
      Deposits: depositsBlock,
      RealEstate: realEstateBlock,
      RentalPayment: rentalPaymentBlock,
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
    textAlign: 'left',
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
  collumnEnd: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'center',
    flex: 1,
  },
})
