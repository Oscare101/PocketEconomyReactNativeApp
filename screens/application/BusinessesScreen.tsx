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
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux'
import { Log, User } from '../../constants/interfaces'
import { useMemo, useRef, useState } from 'react'
import { GetMoneyAmountString } from '../../functions/functions'
import { MMKV } from 'react-native-mmkv'
import { FontAwesome } from '@expo/vector-icons'
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet'
import BottomModalBlock from '../../components/BottomModalBlock'
export const storage = new MMKV()

const width = Dimensions.get('screen').width

export default function BusinessesScreen({ navigation, route }: any) {
  const systemTheme = useColorScheme()
  const theme = useSelector((state: RootState) => state.theme)
  const user: User = useSelector((state: RootState) => state.user)
  const log: Log[] = useSelector((state: RootState) => state.log)
  const themeColor: any = theme === 'system' ? systemTheme : theme
  const interfaceSize = useSelector((state: RootState) => state.interfaceSize)

  const [bottomSheetContent, setBottomSheetContent] = useState<any>('')
  const bottomSheetModalRef = useRef<BottomSheetModal>(null)
  const snapPoints = useMemo(() => [290], [])

  const dispatch = useDispatch()

  const data = [
    {
      title: 'Bank',
      type: 'bank',
      screen: 'BankScreen',
      icon: 'bank',
    },
  ]

  function RenderBusinessItem({ item }: any) {
    const isUsersBusiness: boolean =
      user.bisuness && user.bisuness.find((b: any) => b.type === item.type)
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          if (isUsersBusiness) {
            navigation.navigate('BankScreen')
          } else {
            setBottomSheetContent(item.type)
            bottomSheetModalRef.current?.present()
          }
        }}
        style={[styles.card, { backgroundColor: colors[themeColor].cardColor }]}
      >
        <FontAwesome
          name={item.icon}
          size={width * interfaceSize * 0.08}
          color={
            isUsersBusiness
              ? colors[themeColor].text
              : colors[themeColor].comment
          }
        />
        <Text
          style={{
            color: isUsersBusiness
              ? colors[themeColor].text
              : colors[themeColor].comment,
            fontSize: width * interfaceSize * 0.04,
          }}
        >
          {item.title}
        </Text>
        {isUsersBusiness ? (
          <Text
            style={{
              color: isUsersBusiness
                ? colors[themeColor].text
                : colors[themeColor].comment,
              fontSize: width * interfaceSize * 0.035,
            }}
          >
            ${' '}
            {GetMoneyAmountString(
              user.bisuness?.find((b: any) => b.type === item.type).cash
            )}
          </Text>
        ) : (
          <Text
            style={{
              color: isUsersBusiness
                ? colors[themeColor].text
                : colors[themeColor].comment,
              fontSize: width * interfaceSize * 0.035,
            }}
          >
            Open
          </Text>
        )}
      </TouchableOpacity>
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
        <HeaderDrawer title="Businesses" />
        <Text
          style={{
            width: '92%',
            alignSelf: 'center',
            color: colors[themeColor].comment,
            fontSize: width * interfaceSize * 0.05,
          }}
        >
          Available businesses:
        </Text>
        <FlatList
          style={{ width: '100%', marginTop: width * 0.02 }}
          numColumns={2}
          data={data}
          renderItem={RenderBusinessItem}
        />
      </View>
      {/* BottomSheet */}
      <BottomModalBlock
        bottomSheetModalRef={bottomSheetModalRef}
        snapPoints={snapPoints}
        dismiss={() => bottomSheetModalRef.current?.dismiss()}
        content={`business-${bottomSheetContent}`}
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
    width: width * 0.48,
    aspectRatio: 2,
    padding: width * 0.03,
    borderRadius: width * 0.03,
    margin: width * 0.01,
    alignSelf: 'center',
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
})
