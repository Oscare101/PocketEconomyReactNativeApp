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
  GetMoneyAmountString,
  GetPortfolioProgress,
  GetRatingPerPeriod,
  GetReversedArr,
  GetUserAllBusinessesCapital,
  GetUserDividendsValue,
  GetUserRating,
  GetUserStocksCapital,
  IsPeriodEnough,
} from '../../functions/functions'
import StatusItem from '../../components/StatusItem'
import { RootState } from '../../redux'
import { useSelector } from 'react-redux'
import { User, UserRealEstate } from '../../constants/interfaces'
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
import { GetUserBusinessesCash } from '../../functions/bankFunctions'

const width = Dimensions.get('screen').width

export default function PortfolioScreen({ navigation }: any) {
  const systemTheme = useColorScheme()
  const theme = useSelector((state: RootState) => state.theme)
  const user: User = useSelector((state: RootState) => state.user)
  const companies: any = useSelector((state: RootState) => state.companies)
  const themeColor: any = theme === 'system' ? systemTheme : theme
  const interfaceSize = useSelector((state: RootState) => state.interfaceSize)

  const [stockShowProgress, setStockShowProgress] = useState<boolean>(false)
  const [openStocksList, setOpenStocksList] = useState<boolean>(false)
  const [openBusinessesList, setOpenBusinessesList] = useState<boolean>(false)
  const [openDepositsList, setOpenDepositsList] = useState<boolean>(false)
  const [openDividendsList, setOpenDividendsList] = useState<boolean>(false)
  const [openRealEstateList, setOpenRealEstateList] = useState<boolean>(false)
  const [openRentalPaymentList, setOpenRentalPaymentList] =
    useState<boolean>(false)

  const [bottomSheetContent, setBottomSheetContent] = useState<any>('')
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
      value: `$ ${GetMoneyAmountString(
        GetUserStocksCapital(user.stocks, companies) +
          user.cash +
          GetUserDepositsCapital(user.deposits) +
          GetUserAllPropertiesCost(user) +
          GetUserAllBusinessesCapital(user?.bisuness || [])
      )}`,
    },
    {
      type: 'Card',
      icon: 'cash-outline',
      title: 'Cash',
      value: `$ ${GetMoneyAmountString(user.cash)}`,
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
      value: `$ ${GetMoneyAmountString(
        GetUserStocksCapital(user.stocks, companies)
      )}`,
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
      type: 'Businesses',
      title: 'Businesses',
      icon: 'albums-outline',
      value: `$ ${GetMoneyAmountString(
        GetUserAllBusinessesCapital(user?.bisuness || [])
      )}`,
      data: user?.bisuness || [],
    },
    {
      type: 'Deposits',
      title: 'Deposits',
      icon: 'wallet-outline',
      value: `$ ${GetMoneyAmountString(GetUserDepositsCapital(user.deposits))}`,
      data: user.deposits,
    },
    {
      type: 'RealEstate',
      title: 'Real Estate',
      icon: 'home-outline',
      value: `$ ${GetMoneyAmountString(GetUserAllPropertiesCost(user))}`,
      data: user.realEstate,
    },
    {
      type: 'RentalPayment',
      title: 'Rental Payment',
      icon: 'download-outline',
      value: `$ ${GetMoneyAmountString(
        GetAllRentalPaymentValue(user.realEstateHistory)
      )}`,
      data: user.realEstateHistory,
    },
  ]

  function RenderUserRatingItem({ item }: any) {
    const iconType =
      item.value > 1 ? 'success' : item.value < 1 ? 'error' : 'warning'
    return (
      <View style={[styles.rowBetween, { marginVertical: 0 }]}>
        <Text
          numberOfLines={1}
          // ellipsizeMode="tail"
          style={[
            styles.userRatingTitle,
            {
              // flex: 1,
              color: colors[themeColor].comment,
              fontSize: width * interfaceSize * 0.05,
            },
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
              size={width * interfaceSize * 0.045}
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
                style={[
                  styles.cardValue,
                  {
                    color: colors[themeColor].text,
                    fontSize: width * interfaceSize * 0.05,
                  },
                ]}
              >
                {item.value}
              </Text>
            )}
          </>
        ) : (
          <Text
            style={[
              styles.cardValue,
              {
                color: colors[themeColor].comment,
                fontSize: width * interfaceSize * 0.05,
              },
            ]}
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
          {
            height: width * interfaceSize * 0.08,
            marginVertical: 0,
            marginTop: 5,
          },
        ]}
      >
        <Ionicons
          name={'open-outline'}
          size={width * interfaceSize * 0.04}
          color={colors[themeColor].comment}
        />
        <Text
          style={[
            styles.userStockTitle,
            {
              color: colors[themeColor].comment,
              flex: 1,
              fontSize: width * interfaceSize * 0.04,
            },
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
          <Text
            style={{
              color: colors[themeColor].text,
              fontSize: width * interfaceSize * 0.04,
            }}
          >
            $ {GetMoneyAmountString(item.amount * currentStockPrice)}
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
            height: width * interfaceSize * 0.08,
            marginVertical: 0,
            marginTop: 5,
          },
        ]}
      >
        <Ionicons
          name={'open-outline'}
          size={width * interfaceSize * 0.04}
          color={colors[themeColor].comment}
        />
        <Text
          style={[
            styles.userStockTitle,
            {
              color: colors[themeColor].comment,
              flex: 1,
              fontSize: width * interfaceSize * 0.04,
            },
          ]}
        >
          {item}
        </Text>
        {dividends.length ? (
          <Text
            style={{
              color: colors[themeColor].text,
              fontSize: width * interfaceSize * 0.04,
            }}
          >
            $ {GetMoneyAmountString(dividendsSum)}
          </Text>
        ) : (
          <Text
            style={{
              color: colors[themeColor].comment,
              fontSize: width * interfaceSize * 0.04,
            }}
          >
            -
          </Text>
        )}
      </TouchableOpacity>
    )
  }

  function RenderUserBusinessItem({ item }: any) {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          if (item.type === 'bank') {
            navigation.navigate('BankScreen')
          }
        }}
        style={[
          styles.rowBetween,
          {
            height: width * interfaceSize * 0.08,
            marginVertical: 0,
            marginTop: 5,
          },
        ]}
      >
        <Ionicons
          name={'open-outline'}
          size={width * interfaceSize * 0.04}
          color={colors[themeColor].comment}
        />
        <Text
          style={[
            styles.userStockTitle,
            {
              color: colors[themeColor].comment,
              flex: 1,
              fontSize: width * interfaceSize * 0.04,
            },
          ]}
          numberOfLines={1}
        >
          {item.type[0].toUpperCase() + item.type.substring(1)}
        </Text>

        <Text
          style={{
            color: colors[themeColor].text,
            fontSize: width * interfaceSize * 0.04,
          }}
        >
          $ {GetMoneyAmountString(item.cash)}
        </Text>
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
        style={[styles.rowBetween]}
      >
        <Ionicons
          name={'open-outline'}
          size={width * interfaceSize * 0.04}
          color={colors[themeColor].comment}
        />
        <View style={styles.collumnEnd}>
          <View style={[styles.rowBetween, { marginVertical: 1 }]}>
            <Text
              style={[
                styles.userStockTitle,
                {
                  color: colors[themeColor].text,
                  fontSize: width * interfaceSize * 0.04,
                },
              ]}
              numberOfLines={1}
            >
              {item.name}
            </Text>
            {item.autoRenewal ? (
              <Ionicons
                name="repeat-outline"
                size={width * interfaceSize * 0.04}
                color={colors[themeColor].successText}
              />
            ) : (
              <></>
            )}
            <Text
              style={{
                color: colors[themeColor].text,
                fontSize: width * interfaceSize * 0.04,
                flex: 1,
                textAlign: 'right',
              }}
            >
              $ {GetMoneyAmountString(item.value)}
            </Text>
          </View>
          <View style={[styles.rowBetween, { marginVertical: 1 }]}>
            <Text
              style={[
                styles.userStockTitle,
                {
                  color: colors[themeColor].comment,
                  flex: 1,
                  fontSize: width * interfaceSize * 0.04,
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
                  fontSize: width * interfaceSize * 0.03,
                },
              ]}
            >
              {item.interest} %
            </Text>
          </View>
        </View>
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
          {
            height: width * interfaceSize * 0.08,
            marginVertical: 0,
            marginTop: 5,
          },
        ]}
      >
        <Ionicons
          name={'open-outline'}
          size={width * interfaceSize * 0.04}
          color={colors[themeColor].comment}
        />
        <Text
          style={[
            styles.userStockTitle,
            {
              color: colors[themeColor].comment,
              flex: 1,
              fontSize: width * interfaceSize * 0.04,
            },
          ]}
          numberOfLines={1}
        >
          Tier {item.region} region
        </Text>

        <Text
          style={{
            color: colors[themeColor].text,
            fontSize: width * interfaceSize * 0.04,
          }}
        >
          ${' '}
          {GetMoneyAmountString(GetPropertiesValuePerRegion(user, item.region))}
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
            height: width * interfaceSize * 0.08,
            marginVertical: 0,
            marginTop: 5,
          },
        ]}
      >
        <Ionicons
          name={'time-outline'}
          size={width * interfaceSize * 0.04}
          color={colors[themeColor].comment}
        />
        <Text
          style={[
            styles.userStockTitle,
            {
              color: colors[themeColor].comment,
              flex: 1,
              fontSize: width * interfaceSize * 0.04,
            },
          ]}
        >
          {item.date} {item.time}
        </Text>
        <Text
          style={{
            color: colors[themeColor].text,
            fontSize: width * interfaceSize * 0.04,
          }}
        >
          $ {GetMoneyAmountString(item.value)}
        </Text>
      </View>
    )
  }

  function RenderUserPortfolioItem({ item }: any) {
    const content = (
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors[themeColor].cardColor,
            alignSelf: 'center',
          },
        ]}
      >
        <View style={styles.rowBetween}>
          <Ionicons
            name={item.icon}
            size={width * interfaceSize * 0.05}
            color={colors[themeColor].text}
          />
          <Text
            numberOfLines={1}
            style={[
              styles.cardTitle,
              {
                color: colors[themeColor].text,
                fontSize: width * interfaceSize * 0.05,
              },
            ]}
          >
            {item.title}
          </Text>
          <Text
            style={[
              styles.cardValue,
              {
                color: colors[themeColor].text,
                fontSize: width * interfaceSize * 0.05,
              },
            ]}
          >
            {item.value}
          </Text>
        </View>
      </View>
    )

    const ratingBlock = (
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors[themeColor].cardColor,
            alignSelf: 'center',
          },
        ]}
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
          style={[
            styles.switchTitle,
            {
              color: colors[themeColor].comment,
              fontSize: width * interfaceSize * 0.045,
            },
          ]}
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
              size={width * interfaceSize * 0.045}
            />
          </TouchableOpacity>
        ) : (
          <></>
        )}
        <View style={styles.rowEnd}>
          <Switch
            style={{ transform: [{ scale: 1.2 * interfaceSize }] }}
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
        style={[
          styles.card,
          {
            backgroundColor: colors[themeColor].cardColor,
            alignSelf: 'center',
          },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setOpenStocksList(!openStocksList)}
          style={[
            styles.rowBetween,
            {
              height: width * interfaceSize * 0.08 + 10,
              marginVertical: 0,
            },
          ]}
        >
          <Ionicons
            name={item.icon}
            size={width * interfaceSize * 0.05}
            color={colors[themeColor].text}
          />
          <Text
            style={[
              styles.cardTitle,
              {
                color: colors[themeColor].text,
                fontSize: width * interfaceSize * 0.05,
              },
            ]}
          >
            {item.title}
          </Text>
          <Ionicons
            name={openStocksList ? 'chevron-up' : 'chevron-down'}
            size={width * interfaceSize * 0.05}
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
              style={[
                styles.cardValue,
                {
                  color: colors[themeColor].text,
                  fontSize: width * interfaceSize * 0.05,
                },
              ]}
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
              <View style={styles.rowBetween}>
                <Text
                  style={[
                    styles.comment,
                    { color: colors[themeColor].comment },
                  ]}
                >
                  No stocks yet{' '}
                </Text>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    navigation.navigate('InvestScreen')
                  }}
                >
                  <Ionicons
                    name={'add-circle-outline'}
                    size={width * interfaceSize * 0.05}
                    color={colors[themeColor].text}
                  />
                </TouchableOpacity>
              </View>
            )}
          </>
        ) : (
          <></>
        )}
      </View>
    )

    const dividendsBlock = (
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors[themeColor].cardColor,
            alignSelf: 'center',
          },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setOpenDividendsList(!openDividendsList)}
          style={[
            styles.rowBetween,
            {
              height: width * interfaceSize * 0.08 + 10,
              marginVertical: 0,
            },
          ]}
        >
          <Ionicons
            name={item.icon}
            size={width * interfaceSize * 0.05}
            color={colors[themeColor].text}
          />
          <Text
            style={[
              styles.cardTitle,
              {
                color: colors[themeColor].text,
                fontSize: width * interfaceSize * 0.05,
              },
            ]}
          >
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
              size={width * interfaceSize * 0.045}
            />
          </TouchableOpacity>
          <Ionicons
            name={openDividendsList ? 'chevron-up' : 'chevron-down'}
            size={width * interfaceSize * 0.05}
            color={colors[themeColor].text}
          />
          <View style={{ flex: 1 }} />
          <View style={styles.collumnEnd}>
            <Text
              style={{
                color: colors[themeColor].text,
                fontSize: width * interfaceSize * 0.04,
              }}
            >
              ${' '}
              {GetMoneyAmountString(
                GetUserDividendsValue(user.dividendsHistory)
              )}
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

    const businessesBlock = (
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors[themeColor].cardColor,
            alignSelf: 'center',
          },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setOpenBusinessesList(!openBusinessesList)}
          style={[
            styles.rowBetween,
            {
              height: width * interfaceSize * 0.08 + 10,
              marginVertical: 0,
            },
          ]}
        >
          <Ionicons
            name={item.icon}
            size={width * interfaceSize * 0.05}
            color={colors[themeColor].text}
          />
          <Text
            style={[
              styles.cardTitle,
              {
                color: colors[themeColor].text,
                fontSize: width * interfaceSize * 0.05,
              },
            ]}
          >
            {item.title}
          </Text>
          <Ionicons
            name={openBusinessesList ? 'chevron-up' : 'chevron-down'}
            size={width * interfaceSize * 0.05}
            color={colors[themeColor].text}
          />

          <Text
            style={[
              styles.cardValue,
              {
                color: colors[themeColor].text,
                fontSize: width * interfaceSize * 0.05,
              },
            ]}
          >
            {item.value}
          </Text>
        </TouchableOpacity>
        {openBusinessesList ? (
          <>
            <View
              style={{
                width: '100%',
                height: 1,
                backgroundColor: colors[themeColor].disable,
              }}
            />
            {item.data?.length ? (
              <FlatList data={item.data} renderItem={RenderUserBusinessItem} />
            ) : (
              <View style={styles.rowBetween}>
                <Text
                  style={[
                    styles.comment,
                    { color: colors[themeColor].comment },
                  ]}
                >
                  No businesses yet{' '}
                </Text>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    navigation.navigate('BusinessesScreen')
                  }}
                >
                  <Ionicons
                    name={'add-circle-outline'}
                    size={width * interfaceSize * 0.05}
                    color={colors[themeColor].text}
                  />
                </TouchableOpacity>
              </View>
            )}
          </>
        ) : (
          <></>
        )}
      </View>
    )

    const depositsBlock = (
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors[themeColor].cardColor,
            alignSelf: 'center',
          },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setOpenDepositsList(!openDepositsList)}
          style={[
            styles.rowBetween,
            {
              height: width * interfaceSize * 0.08 + 10,
              marginVertical: 0,
            },
          ]}
        >
          <Ionicons
            name={item.icon}
            size={width * interfaceSize * 0.05}
            color={colors[themeColor].text}
          />
          <Text
            style={[
              styles.cardTitle,
              {
                color: colors[themeColor].text,
                fontSize: width * interfaceSize * 0.05,
              },
            ]}
          >
            {item.title}
          </Text>
          <Ionicons
            name={openDepositsList ? 'chevron-up' : 'chevron-down'}
            size={width * interfaceSize * 0.05}
            color={colors[themeColor].text}
          />

          <Text
            style={[
              styles.cardValue,
              {
                color: colors[themeColor].text,
                fontSize: width * interfaceSize * 0.05,
              },
            ]}
          >
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
              <View style={styles.rowBetween}>
                <Text
                  style={[
                    styles.comment,
                    { color: colors[themeColor].comment },
                  ]}
                >
                  No deposits yet
                </Text>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    navigation.navigate('DepositsScreen')
                  }}
                >
                  <Ionicons
                    name={'add-circle-outline'}
                    size={width * interfaceSize * 0.05}
                    color={colors[themeColor].text}
                  />
                </TouchableOpacity>
              </View>
            )}
          </>
        ) : (
          <></>
        )}
      </View>
    )

    const realEstateBlock = (
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors[themeColor].cardColor,
            alignSelf: 'center',
          },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setOpenRealEstateList(!openRealEstateList)}
          style={[
            styles.rowBetween,
            {
              height: width * interfaceSize * 0.08 + 10,
              marginVertical: 0,
            },
          ]}
        >
          <Ionicons
            name={item.icon}
            size={width * interfaceSize * 0.05}
            color={colors[themeColor].text}
          />
          <Text
            style={[
              styles.cardTitle,
              {
                color: colors[themeColor].text,
                fontSize: width * interfaceSize * 0.05,
              },
            ]}
          >
            {item.title}
          </Text>
          <Ionicons
            name={openRealEstateList ? 'chevron-up' : 'chevron-down'}
            size={width * interfaceSize * 0.05}
            color={colors[themeColor].text}
          />

          <Text
            style={[
              styles.cardValue,
              {
                color: colors[themeColor].text,
                fontSize: width * interfaceSize * 0.05,
              },
            ]}
          >
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
            {user.realEstate.filter((r: UserRealEstate) => r.amount).length ? (
              <FlatList
                data={user.realEstate
                  .filter((r: UserRealEstate) => r.amount)
                  .sort(
                    (a: UserRealEstate, b: UserRealEstate) =>
                      a.region - b.region
                  )}
                renderItem={RenderUserRealEstateItem}
              />
            ) : (
              <View style={styles.rowBetween}>
                <Text
                  style={[
                    styles.comment,
                    { color: colors[themeColor].comment },
                  ]}
                >
                  No properties yet
                </Text>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    navigation.navigate('RealEstateScreen')
                  }}
                >
                  <Ionicons
                    name={'add-circle-outline'}
                    size={width * interfaceSize * 0.05}
                    color={colors[themeColor].text}
                  />
                </TouchableOpacity>
              </View>
            )}
          </>
        ) : (
          <></>
        )}
      </View>
    )

    const rentalPaymentBlock = (
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors[themeColor].cardColor,
            alignSelf: 'center',
          },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setOpenRentalPaymentList(!openRentalPaymentList)}
          style={[
            styles.rowBetween,
            {
              height: width * interfaceSize * 0.08 + 10,
              marginVertical: 0,
            },
          ]}
        >
          <Ionicons
            name={item.icon}
            size={width * interfaceSize * 0.05}
            color={colors[themeColor].text}
          />
          <Text
            style={[
              styles.cardTitle,
              {
                color: colors[themeColor].text,
                fontSize: width * interfaceSize * 0.05,
              },
            ]}
          >
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
            size={width * interfaceSize * 0.05}
            color={colors[themeColor].text}
          />
          <View style={styles.collumnEnd}>
            <Text
              style={{
                color: colors[themeColor].text,
                fontSize: width * interfaceSize * 0.04,
              }}
            >
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
            {user.realEstateHistory.length ? (
              <FlatList
                data={GetReversedArr(user.realEstateHistory)}
                renderItem={RenderUserRentalPaymentItem}
              />
            ) : (
              <Text
                style={[
                  styles.comment,
                  {
                    color: colors[themeColor].comment,
                    fontSize: width * interfaceSize * 0.04,
                  },
                ]}
              >
                No playments yet
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
      Dividends: dividendsBlock,
      Deposits: depositsBlock,
      RealEstate: realEstateBlock,
      RentalPayment: rentalPaymentBlock,
      Businesses: businessesBlock,
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
  card: {
    width: '92%',
    padding: width * 0.03,
    borderRadius: width * 0.03,
    marginTop: width * 0.03,
  },

  cardTitle: {
    marginHorizontal: 10,
    textAlign: 'left',
  },
  userRatingTitle: { marginRight: 10 },
  cardValue: {
    flex: 1,
    textAlign: 'right',
  },
  switchTitle: {
    marginRight: 10,
  },
  userStockTitle: {
    marginHorizontal: 10,
  },
  comment: {
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
