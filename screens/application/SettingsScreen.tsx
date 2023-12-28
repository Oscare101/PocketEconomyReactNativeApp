import {
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  useColorScheme,
} from 'react-native'
import colors from '../../constants/colors'
import HeaderDrawer from '../../components/HeaderDrawer'
import { RootState } from '../../redux'
import { useSelector } from 'react-redux'
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet'
import { useMemo, useRef, useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import ThemeBlockModal from '../../components/ThemeBlockModal'
import BottomModalBlock from '../../components/BottomModalBlock'

export default function SettingsScreen({ navigation }: any) {
  const systemTheme = useColorScheme()
  const theme = useSelector((state: RootState) => state.theme)
  const themeColor: any = theme === 'system' ? systemTheme : theme

  const [bottomSheetContent, setBottomSheetContent] = useState<any>(0)

  const bottomSheetModalRef = useRef<BottomSheetModal>(null)
  const snapPoints = useMemo(
    () => [bottomSheetContent === 'themeBlock' ? 290 : 290],
    []
  )

  const settingsData = [
    {
      type: 'button',
      title: 'Theme',
      icon: themeColor === 'dark' ? 'moon-outline' : 'sunny-outline',
      color: colors[themeColor].text,
      action: () => {
        setBottomSheetContent('themeBlock')
        bottomSheetModalRef.current?.present()
      },
    },
    {
      type: 'button',
      title: 'Promo code',
      icon: 'code-working-outline',
      color: colors[themeColor].text,
      action: () => {
        setBottomSheetContent('promoCodeBlock')
        bottomSheetModalRef.current?.present()
      },
    },
  ]

  function RenderSettingsItem({ item }: any) {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => item.action()}
        style={{
          borderColor: colors[themeColor].disable,
          borderBottomWidth: 1,
          width: '92%',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: item.icon ? 'space-between' : 'center',
          paddingVertical: 15,
          alignSelf: 'center',
        }}
      >
        <Text
          style={{
            fontSize: 20,
            color: item.color,
          }}
        >
          {item.title}
        </Text>
        <Ionicons name={item.icon} size={24} color={item.color} />
      </TouchableOpacity>
    )
  }

  return (
    <BottomSheetModalProvider>
      <View
        style={[
          styles.container,
          { backgroundColor: colors[themeColor].bgColor },
        ]}
      >
        <HeaderDrawer title="Settings" />

        <FlatList
          style={{ width: '100%' }}
          data={settingsData}
          renderItem={RenderSettingsItem}
        />
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
})
