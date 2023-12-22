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
import colors from '../constants/colors'
import HeaderDrawer from '../components/HeaderDrawer'
import { RootState } from '../redux'
import { useSelector } from 'react-redux'
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet'
import { useMemo, useRef, useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import ThemeBlockModal from '../components/ThemeBlockModal'

export default function BottomModalBlock(props: any) {
  const systemTheme = useColorScheme()
  const theme = useSelector((state: RootState) => state.theme)
  const themeColor: any = theme === 'system' ? systemTheme : theme

  return (
    <BottomSheetModal
      backgroundStyle={{ backgroundColor: '#00000000' }}
      handleIndicatorStyle={{
        backgroundColor: '#00000000',
      }}
      ref={props.bottomSheetModalRef}
      snapPoints={props.snapPoints}
      backdropComponent={({ style }) => (
        <TouchableWithoutFeedback onPress={props.dismiss}>
          <View
            style={[
              style,
              {
                backgroundColor: '#00000066',
              },
            ]}
          >
            <StatusBar backgroundColor={colors.mainBG} />
          </View>
        </TouchableWithoutFeedback>
      )}
    >
      <View
        style={{
          backgroundColor: colors[themeColor].bgColor,
          flex: 1,
          borderRadius: 25,
          margin: 10,
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: colors[themeColor].disable,
        }}
      >
        {props.content === 'themeBlock' ? <ThemeBlockModal /> : <></>}
      </View>
    </BottomSheetModal>
  )
}
