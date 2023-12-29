import {
  Dimensions,
  FlatList,
  Keyboard,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  useColorScheme,
} from 'react-native'
import HeaderDrawer from '../../components/HeaderDrawer'
import colors from '../../constants/colors'
import { useDispatch, useSelector } from 'react-redux'
import { User, UserDeposit } from '../../constants/interfaces'
import { RootState } from '../../redux'
import { useMemo, useRef, useState } from 'react'
import {
  GetDepositInterestReturn,
  GetDepositMatureDateTime,
} from '../../functions/depositFunctions'
import { GetMoneyAmount } from '../../functions/functions'
import Button from '../../components/Button'
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet'
import BottomModalBlock from '../../components/BottomModalBlock'
import { Ionicons } from '@expo/vector-icons'
import Toast from 'react-native-toast-message'
import { updateUser } from '../../redux/user'
import { MMKV } from 'react-native-mmkv'
import rules from '../../constants/rules'

export const storage = new MMKV()

const width = Dimensions.get('screen').width

export default function EditDepositScreen({ navigation, route }: any) {
  const systemTheme = useColorScheme()
  const theme = useSelector((state: RootState) => state.theme)
  const user: User = useSelector((state: RootState) => state.user)
  const themeColor: any = theme === 'system' ? systemTheme : theme
  const dispatch = useDispatch()

  const [request, setRequest] = useState<boolean>(false)
  const [autoRenewal, setAutoRenewal] = useState<boolean>(
    route.params.deposit ? route.params.deposit.autoRenewal : false
  )

  const [bottomSheetContent, setBottomSheetContent] =
    useState<any>('DepositInfo')
  const bottomSheetModalRef = useRef<BottomSheetModal>(null)
  const snapPoints = useMemo(() => [360], [])

  function EditDeposit() {
    const newDepositData = user.deposits.map((d: UserDeposit) => {
      if (d.name === route.params.deposit.name) {
        return { ...d, autoRenewal: autoRenewal }
      } else {
        return d
      }
    })
    const newUserData: User = {
      ...user,
      deposits: newDepositData,
    }
    dispatch(updateUser(newUserData))
    storage.set('user', JSON.stringify(newUserData))
    Toast.show({
      type: 'ToastMessage',
      props: {
        title: `A deposit of has been edited`,
      },
      position: rules.toast.position,
    })
    navigation.goBack()
  }

  const depositData = [
    {
      title: '$',
      value: `${GetMoneyAmount(route.params.deposit.value).value}.${
        GetMoneyAmount(route.params.deposit.value).decimal
      }${GetMoneyAmount(route.params.deposit.value).title}`,
    },
    {
      title: 'Interest',
      value: `${route.params.deposit.interest} h`,
    },
    {
      title: 'Duration',
      value: `${route.params.deposit.durationHours} h`,
    },
    {
      title: 'Next payment',
      value: `${
        GetDepositMatureDateTime(
          route.params.deposit.openingDate,
          route.params.deposit.openingTime,
          route.params.deposit.durationHours
        ).date
      } ${
        GetDepositMatureDateTime(
          route.params.deposit.openingDate,
          route.params.deposit.openingTime,
          route.params.deposit.durationHours
        ).time
      }`,
    },
    {
      title: 'Mature',
      matureIcon: autoRenewal,
      value: `${
        GetDepositMatureDateTime(
          route.params.deposit.openingDate,
          route.params.deposit.openingTime,
          route.params.deposit.durationHours
        ).date
      } ${
        GetDepositMatureDateTime(
          route.params.deposit.openingDate,
          route.params.deposit.openingTime,
          route.params.deposit.durationHours
        ).time
      }`,
    },
    {
      title: 'Auto Renewal',
      switch: true,
    },
  ]

  function RenderDepositInfo({ item }: any) {
    return (
      <View
        style={[styles.card, { backgroundColor: colors[themeColor].cardColor }]}
      >
        <View style={styles.rowBetween}>
          <Text
            style={[
              styles.cartTitle,
              {
                color: item.switch
                  ? colors[themeColor].text
                  : colors[themeColor].comment,
              },
            ]}
          >
            {item.title}
          </Text>

          {item.matureIcon && autoRenewal ? (
            <Ionicons
              name="infinite-outline"
              size={width * 0.05}
              color={colors[themeColor].successText}
            />
          ) : item.switch ? (
            <Switch
              style={{ transform: [{ scale: 1.2 }] }}
              trackColor={{
                false: colors[themeColor].cardColor,
                true: colors[themeColor].cardColor,
              }}
              thumbColor={
                autoRenewal
                  ? colors[themeColor].successText
                  : colors[themeColor].comment
              }
              ios_backgroundColor={colors[themeColor].cardColor}
              onValueChange={() => setAutoRenewal(!autoRenewal)}
              value={autoRenewal}
            />
          ) : (
            <Text
              style={[
                styles.cartValue,
                { color: colors[themeColor].comment, fontWeight: '300' },
              ]}
            >
              {item.value}
            </Text>
          )}
        </View>
      </View>
    )
  }

  return (
    <BottomSheetModalProvider>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View
          style={[
            styles.container,
            { backgroundColor: colors[themeColor].bgColor },
          ]}
        >
          <HeaderDrawer
            title={'Edit deposit'}
            onAction={() => navigation.goBack()}
          />
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{
              flex: 1,
              width: '100%',
            }}
          >
            <View
              style={[
                styles.container,
                { backgroundColor: colors[themeColor].bgColor },
              ]}
            >
              <Text
                style={{
                  fontSize: width * 0.1,
                  color: colors[themeColor].text,
                  marginTop: width * 0.05,
                }}
              >
                ${' '}
                {
                  GetMoneyAmount(
                    GetDepositInterestReturn(
                      +route.params.deposit.value,
                      route.params.deposit.durationHours,
                      route.params.deposit.interest
                    )
                  ).value
                }
                .
                <Text style={{ fontSize: width * 0.07 }}>
                  {
                    GetMoneyAmount(
                      GetDepositInterestReturn(
                        +route.params.deposit.value,
                        route.params.deposit.durationHours,
                        route.params.deposit.interest
                      )
                    ).decimal
                  }
                </Text>
                {
                  GetMoneyAmount(
                    GetDepositInterestReturn(
                      +route.params.deposit.value,
                      route.params.deposit.durationHours,
                      route.params.deposit.interest
                    )
                  ).title
                }
              </Text>
              <Text
                style={[
                  styles.cardComment,
                  {
                    color: colors[themeColor].comment,
                    marginBottom: width * 0.01,
                  },
                ]}
              >
                estimated yield{' '}
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    bottomSheetModalRef.current?.present()
                  }}
                >
                  <Ionicons
                    name="information-circle-outline"
                    color={colors[themeColor].text}
                    size={width * 0.045}
                  />
                </TouchableOpacity>
              </Text>
              <FlatList
                style={{ width: '100%', marginBottom: 10 }}
                data={depositData}
                renderItem={RenderDepositInfo}
                scrollEnabled={false}
              />
              <Button
                title={'Edit'}
                action={() => {
                  setRequest(true)
                  EditDeposit()
                }}
                type="info"
                disable={
                  !(
                    +route.params.deposit.value &&
                    route.params.deposit.durationHours
                  ) || request
                }
              />
            </View>
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>

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
    padding: width * 0.03,
    borderRadius: width * 0.03,
    marginTop: width * 0.03,
    alignSelf: 'center',
    height: width * 0.17,
  },
  rowBetween: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '100%',
  },
  cartTitle: {
    fontSize: width * 0.06,
  },
  cartValue: { fontSize: width * 0.05 },
  cardComment: { fontSize: width * 0.05, fontWeight: '300' },
  input: {
    fontSize: width * 0.07,
    padding: 0,
    flex: 1,
    textAlign: 'right',
    marginLeft: 10,
  },
})
