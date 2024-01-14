import {
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native'
import HeaderDrawer from '../../components/HeaderDrawer'
import colors from '../../constants/colors'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux'
import { updateLog } from '../../redux/log'
import { Bank, Log, User } from '../../constants/interfaces'
import { useMemo, useRef, useState } from 'react'
import { updateUser } from '../../redux/user'
import {
  GetCurrentDate,
  GetCurrentTime,
  GetMoneyAmount,
} from '../../functions/functions'
import rules from '../../constants/rules'
import Toast from 'react-native-toast-message'
import Button from '../../components/Button'
import { MMKV } from 'react-native-mmkv'
import { Ionicons } from '@expo/vector-icons'
import { Slider } from '@miblanchard/react-native-slider'
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet'
import BottomModalBlock from '../../components/BottomModalBlock'

export const storage = new MMKV()
const width = Dimensions.get('screen').width

export default function BankScreen({ navigation, route }: any) {
  const systemTheme = useColorScheme()
  const theme = useSelector((state: RootState) => state.theme)
  const user: User = useSelector((state: RootState) => state.user)
  const log: Log[] = useSelector((state: RootState) => state.log)
  const themeColor: any = theme === 'system' ? systemTheme : theme
  const interfaceSize = useSelector((state: RootState) => state.interfaceSize)

  const dispatch = useDispatch()

  const [bottomSheetContent, setBottomSheetContent] = useState<any>('')
  const bottomSheetModalRef = useRef<BottomSheetModal>(null)
  const snapPoints = useMemo(() => [420], [])

  const [request, setRequest] = useState<boolean>(false)
  const [openedFolder, setOpenedFolder] = useState<any[]>([])
  const [newDepositRate, setNewDepositRate] = useState<number>(
    GetUserBankInfo().depositRate
  )
  const [newCreditRate, setNewCreditRate] = useState<number>(
    GetUserBankInfo().creditRate
  )
  const [newCommission, setNewCommission] = useState<number>(
    GetUserBankInfo().commission
  )

  function GetUserBankInfo() {
    return user.bisuness?.find((b: any) => b.type === 'bank') as Bank
  }

  async function UpdateUserBank(data: Bank) {
    const businessesWithoutBank =
      user.bisuness?.filter((b: any) => b.type !== data.type) || []

    const newUserData: User = {
      ...user,
      bisuness: [...businessesWithoutBank, data],
    }
    dispatch(updateUser(newUserData))
  }

  const bankData = [
    {
      title: 'Cash',
      icon: 'briefcase-outline',
      value: `$ ${GetMoneyAmount(GetUserBankInfo().cash).value}.${
        GetMoneyAmount(GetUserBankInfo().cash).decimal
      }${GetMoneyAmount(GetUserBankInfo().cash).title}`,
      open: 'button',
      buttonTitle: 'Trasaction',
      buttonIcon: 'add-outline',
      buttonAction: () => {
        setBottomSheetContent('BankInvest')
        bottomSheetModalRef.current?.present()
      },
    },
    {
      title: 'Clents',
      icon: 'people-outline',
      value: GetUserBankInfo().clientsAmount,
      open: 'button',
      buttonTitle: 'Attract customers',
      buttonIcon: 'person-add-outline',
      buttonAction: () => {
        setBottomSheetContent('BankAdvertisement')
        bottomSheetModalRef.current?.present()
      },
    },
    {
      title: 'Deposit rate',
      icon: 'log-in-outline',
      value: `${GetUserBankInfo().depositRate} %`,
      open: 'slider',
      sliderMin: 0,
      sliderMax: rules.business.bank.centralBankDepositRate * 2,
      sliderValue: newDepositRate,
      slideAction: (value: number) => setNewDepositRate(value),
      action: () => {
        const newData: Bank = {
          ...GetUserBankInfo(),
          depositRate: newDepositRate,
        }
        UpdateUserBank(newData)
        setOpenedFolder(
          [...openedFolder].filter(
            (folder: string) => folder !== 'Deposit rate'
          )
        )
      },
    },
    {
      title: 'Credit rate',
      icon: 'log-out-outline',
      value: `${GetUserBankInfo().creditRate} %`,
      open: 'slider',
      sliderMin: 0,
      sliderMax: rules.business.bank.centralBankCreditRate * 2,
      sliderValue: newCreditRate,
      slideAction: (value: number) => setNewCreditRate(value),
      action: () => {
        const newData: Bank = {
          ...GetUserBankInfo(),
          creditRate: newCreditRate,
        }
        UpdateUserBank(newData)
        setOpenedFolder(
          [...openedFolder].filter((folder: string) => folder !== 'Credit rate')
        )
      },
    },
    {
      title: 'Commissions',
      icon: 'log-out-outline',
      value: `${GetUserBankInfo().commission} %`,
      open: 'slider',
      sliderMin: 0,
      sliderMax: rules.business.bank.centralBankCommission * 10,
      sliderValue: newCommission,
      slideAction: (value: number) => setNewCommission(value),
      action: () => {
        const newData: Bank = {
          ...GetUserBankInfo(),
          commission: newCommission,
        }
        UpdateUserBank(newData)
        setOpenedFolder(
          [...openedFolder].filter((folder: string) => folder !== 'Commissions')
        )
      },
    },
  ]

  function RenderBankStatItem({ item }: any) {
    const buttonBlock = (
      <>
        <Button
          title={item.buttonTitle}
          type="info"
          disable={false}
          action={item.buttonAction}
          style={{ width: '100%', marginTop: width * 0.03 }}
        />
      </>
    )

    const sliderBlock = (
      <>
        <Slider
          step={0.5}
          minimumValue={item.sliderMin}
          maximumValue={item.sliderMax}
          value={item.sliderValue}
          onValueChange={(value) => {
            item.slideAction(value)
          }}
          maximumTrackTintColor={colors[themeColor].disable}
          minimumTrackTintColor={colors[themeColor].text}
          thumbTintColor={colors[themeColor].comment}
        />
        <Button
          title={`Change to ${item.sliderValue} %`}
          disable={request}
          type="info"
          action={item.action}
          style={{ width: '100%' }}
        />
      </>
    )

    return (
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
          disabled={!item.open}
          activeOpacity={0.8}
          onPress={() => {
            if (openedFolder.includes(item.title)) {
              setOpenedFolder(
                [...openedFolder].filter(
                  (folder: string) => folder !== item.title
                )
              )
            } else {
              setOpenedFolder([...openedFolder, item.title])
            }
          }}
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
          {item.open ? (
            <Ionicons
              name={
                openedFolder.includes(item.title)
                  ? 'chevron-up'
                  : 'chevron-down'
              }
              size={width * interfaceSize * 0.05}
              color={colors[themeColor].text}
            />
          ) : (
            <></>
          )}

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
        {item.open && openedFolder.includes(item.title) ? (
          <>
            <View
              style={{
                width: '100%',
                height: 1,
                backgroundColor: colors[themeColor].disable,
              }}
            />
            {item.open === 'slider' ? sliderBlock : buttonBlock}
          </>
        ) : (
          <></>
        )}
      </View>
    )
  }

  return (
    <BottomSheetModalProvider>
      <View
        style={[
          styles.container,
          { backgroundColor: colors[themeColor].bgColor, paddingBottom: 20 },
        ]}
      >
        <HeaderDrawer title="Bank" onAction={() => navigation.goBack()} />
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
            data={bankData}
            renderItem={RenderBankStatItem}
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
    padding: width * 0.03,
    borderRadius: width * 0.03,
    marginTop: width * 0.03,
  },
  rowBetween: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cartTitle: {
    fontSize: width * 0.05,
  },
  dateTime: { fontSize: width * 0.035 },
  cardComment: { fontSize: width * 0.05, fontWeight: '300' },
  input: {
    fontSize: width * 0.07,
    padding: 0,
    flex: 1,
    textAlign: 'right',
    marginLeft: 10,
  },

  cardTitle: {
    marginHorizontal: 10,
    textAlign: 'left',
  },
  cardValue: {
    flex: 1,
    textAlign: 'right',
  },
})
