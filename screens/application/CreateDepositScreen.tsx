import {
  Dimensions,
  Keyboard,
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
import { Log, User, UserDeposit } from '../../constants/interfaces'
import { RootState } from '../../redux'
import { useMemo, useRef, useState } from 'react'
import {
  GetDepositInterestReturn,
  GetDepositMatureDateTime,
} from '../../functions/depositFunctions'
import {
  GetCurrentDate,
  GetCurrentTime,
  GetMoneyAmount,
} from '../../functions/functions'
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
import { FlatList } from 'react-native-gesture-handler'
import { updateLog } from '../../redux/log'

export const storage = new MMKV()

const width = Dimensions.get('screen').width

const amountCheck = /^(?!0\d)\d{0,99}(\.\d{0,2})?$/

export default function CreateDepositScreen({ navigation }: any) {
  const systemTheme = useColorScheme()
  const theme = useSelector((state: RootState) => state.theme)
  const user: User = useSelector((state: RootState) => state.user)
  const themeColor: any = theme === 'system' ? systemTheme : theme
  const log: Log[] = useSelector((state: RootState) => state.log)
  const interfaceSize = useSelector((state: RootState) => state.interfaceSize)

  const dispatch = useDispatch()

  const [request, setRequest] = useState<boolean>(false)
  const [depositValue, setDepositValue] = useState<string>('')
  const [durationHours, setDurationHours] = useState<number>(
    rules.deposit.options[0].hours
  )
  const [interest, setInterest] = useState<number>(
    rules.deposit.options[0].interest
  )
  const [autoRenewal, setAutoRenewal] = useState<boolean>(false)

  const [bottomSheetContent, setBottomSheetContent] =
    useState<any>('DepositInfo')
  const bottomSheetModalRef = useRef<BottomSheetModal>(null)
  const snapPoints = useMemo(() => [360], [])

  function SetNewDeposit() {
    const newDeposit: UserDeposit = {
      name: `Deposit ${user.deposits.length + 1}`,
      value: +depositValue,
      interest: interest,
      openingDate: new Date().toISOString().split('T')[0],
      openingTime: `${new Date()
        .getHours()
        .toString()
        .padStart(2, '0')}:${new Date()
        .getMinutes()
        .toString()
        .padStart(2, '0')}`,
      durationHours: durationHours,
      autoRenewal: autoRenewal,
    }
    const newUserData: User = {
      ...user,
      cash: +(user.cash - +depositValue).toFixed(2),
      deposits: [...user.deposits, newDeposit],
    }

    dispatch(updateUser(newUserData))
    dispatch(
      updateLog([
        ...log,
        {
          ...rules.log.createDeposit,
          date: GetCurrentDate(),
          time: GetCurrentTime(),
          data: newUserData,
        },
      ])
    )
    storage.set('user', JSON.stringify(newUserData))
    Toast.show({
      type: 'ToastMessage',
      props: {
        title: `A deposit of $ ${depositValue} has been made`,
      },
      position: rules.toast.position,
    })
    navigation.goBack()
  }

  const inputBlock = (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors[themeColor].cardColor,
          height: width * interfaceSize * 0.17,
        },
      ]}
    >
      <View style={styles.rowBetween}>
        <Text
          style={{
            color: colors[themeColor].comment,
            fontSize: width * interfaceSize * 0.07,
          }}
        >
          $
        </Text>
        <TextInput
          value={depositValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
          keyboardType="numeric"
          placeholder="100"
          placeholderTextColor={colors[themeColor].disable}
          style={[
            styles.input,
            {
              color: colors[themeColor].text,
              fontSize: width * interfaceSize * 0.07,
            },
          ]}
          onChangeText={(value: string) => {
            if (
              amountCheck.test(value.replace(',', '.').replaceAll(' ', '')) &&
              +value.replace(',', '.').replaceAll(' ', '') <= user.cash &&
              +value.replace(',', '.').replaceAll(' ', '') <=
                rules.deposit.maxValue
            ) {
              let num = value.replace(',', '.').replaceAll(' ', '')
              setDepositValue(num)
            } else {
              return false
            }
          }}
        />
      </View>
    </View>
  )

  function CahsBlock() {
    return (
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors[themeColor].cardColor,
            height: width * interfaceSize * 0.17,
          },
        ]}
      >
        <View style={styles.rowBetween}>
          <View
            style={{
              width: width * interfaceSize * 0.05 * 1.6,
              height: width * interfaceSize * 0.05,
              marginRight: 10,
            }}
          >
            <View
              style={{
                height: '100%',
                aspectRatio: 1,
                backgroundColor: colors[themeColor].cardColor,
                borderRadius: width * interfaceSize * 0.05,
                position: 'absolute',
                top: 0,
                left: 0,
              }}
            />
            <View
              style={{
                height: '100%',
                aspectRatio: 1,
                backgroundColor: colors[themeColor].cardColor,
                borderRadius: width * interfaceSize * 0.05,
                position: 'absolute',
                top: 0,
                right: 0,
              }}
            />
          </View>
          <View
            style={{
              flexDirection: 'column',
              alignItems: 'flex-start',
              justifyContent: 'center',
            }}
          >
            <Text
              style={{
                color: colors[themeColor].comment,
                fontSize: width * interfaceSize * 0.04,
              }}
            >
              **** 1234
            </Text>
            <Text
              style={{
                color: colors[themeColor].comment,
                fontSize: width * interfaceSize * 0.04,
              }}
            >
              Balance:
            </Text>
          </View>

          <View style={{ flex: 1 }} />
          <Text
            style={{
              fontSize: width * interfaceSize * 0.06,
              color: colors[themeColor].text,
              fontWeight: '300',
            }}
          >
            $ {GetMoneyAmount(user.cash).value}.
            {GetMoneyAmount(user.cash).decimal}
            {GetMoneyAmount(user.cash).title}
          </Text>
        </View>
      </View>
    )
  }

  function DurationBlock() {
    return (
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors[themeColor].cardColor,
            flexDirection: 'row',
            justifyContent: 'space-between',
            height: width * interfaceSize * 0.17,
          },
        ]}
      >
        {rules.deposit.options.map((item: any, index: number) => (
          <TouchableOpacity
            key={index}
            activeOpacity={0.8}
            onPress={() => {
              setInterest(item.interest)
              setDurationHours(item.hours)
            }}
            style={{
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text
              style={{
                fontSize: width * interfaceSize * 0.06,
                color:
                  durationHours === item.hours
                    ? colors[themeColor].text
                    : colors[themeColor].comment,
              }}
            >
              {item.hours} h
            </Text>
            <Text
              style={[
                styles.cartComment,
                {
                  color:
                    durationHours === item.hours
                      ? colors[themeColor].text
                      : colors[themeColor].comment,
                  fontSize: width * interfaceSize * 0.04,
                },
              ]}
            >
              {item.interest} %
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    )
  }

  function RenewalBlock() {
    return (
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors[themeColor].cardColor,
            height: width * interfaceSize * 0.17,
          },
        ]}
      >
        <View style={styles.rowBetween}>
          <Text
            style={{
              color: autoRenewal
                ? colors[themeColor].text
                : colors[themeColor].comment,
              fontWeight: '300',
              fontSize: width * interfaceSize * 0.07,
            }}
          >
            Auto Renewal
          </Text>

          <Switch
            style={{ transform: [{ scale: 1.2 * interfaceSize }] }}
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
            title="Create deposit"
            onAction={() => navigation.goBack()}
          />
          <Text
            style={{
              fontSize: width * interfaceSize * 0.1,
              color: colors[themeColor].text,
              marginTop: width * interfaceSize * 0.05,
            }}
          >
            ${' '}
            {
              GetMoneyAmount(
                GetDepositInterestReturn(+depositValue, durationHours, interest)
              ).value
            }
            .
            <Text style={{ fontSize: width * interfaceSize * 0.07 }}>
              {
                GetMoneyAmount(
                  GetDepositInterestReturn(
                    +depositValue,
                    durationHours,
                    interest
                  )
                ).decimal
              }
            </Text>
            {
              GetMoneyAmount(
                GetDepositInterestReturn(+depositValue, durationHours, interest)
              ).title
            }
          </Text>
          <Text
            style={[
              styles.cartComment,
              {
                color: colors[themeColor].comment,
                marginBottom: width * interfaceSize * 0.01,
                fontSize: width * interfaceSize * 0.04,
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
                size={width * interfaceSize * 0.045}
              />
            </TouchableOpacity>
          </Text>
          <Text
            style={[
              styles.cartComment,
              {
                color: colors[themeColor].text,
                marginBottom: width * interfaceSize * 0.05,
                fontSize: width * interfaceSize * 0.04,
              },
            ]}
          >
            mature date:{' '}
            {
              GetDepositMatureDateTime(
                new Date().toISOString().split('T')[0],
                `${new Date()
                  .getHours()
                  .toString()
                  .padStart(2, '0')}:${new Date()
                  .getMinutes()
                  .toString()
                  .padStart(2, '0')}`,
                durationHours
              ).date
            }{' '}
            {
              GetDepositMatureDateTime(
                new Date().toISOString().split('T')[0],
                `${new Date()
                  .getHours()
                  .toString()
                  .padStart(2, '0')}:${new Date()
                  .getMinutes()
                  .toString()
                  .padStart(2, '0')}`,
                durationHours
              ).time
            }
          </Text>
          <Text
            style={[
              styles.cartComment,
              {
                color: colors[themeColor].comment,
                textAlign: 'right',
                width: '92%',
                fontSize: width * interfaceSize * 0.04,
              },
            ]}
          >
            Max $ {GetMoneyAmount(rules.deposit.maxValue).value}.
            {GetMoneyAmount(rules.deposit.maxValue).decimal}
            {GetMoneyAmount(rules.deposit.maxValue).title}
          </Text>
          {inputBlock}
          <CahsBlock />
          <DurationBlock />
          <RenewalBlock />
          <View style={{ flex: 1 }} />
          <Button
            title="Comfirm"
            action={() => {
              setRequest(true)
              SetNewDeposit()
            }}
            type="info"
            disable={!(+depositValue && durationHours) || request}
          />
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
  },
  rowBetween: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '100%',
  },

  cartComment: { fontWeight: '300' },
  input: {
    padding: 0,
    flex: 1,
    textAlign: 'right',
    marginLeft: 10,
  },
})
