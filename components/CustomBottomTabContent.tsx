import { Text, TouchableOpacity, View, useColorScheme } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useSelector } from 'react-redux'
import { RootState } from '../redux'
import colors from '../constants/colors'

export default function CustomBottomTabContent({ state, navigation }: any) {
  const systemTheme = useColorScheme()
  const theme = useSelector((state: RootState) => state.theme)

  const themeColor: any = theme === 'system' ? systemTheme : theme
  const bottomTabData = [
    {
      title: 'Stock market',
      iconActive: 'stats-chart',
      iconInactive: 'stats-chart-outline',
      action: () => {
        navigation.navigate('InvestScreen', {
          screen: 'InvestScreen',
          initial: false,
        })
      },
    },
    {
      title: 'Deposits',
      iconActive: 'card',
      iconInactive: 'card-outline',
      action: () => {
        navigation.navigate('DepositsScreen', {
          screen: 'DepositsScreen',
          initial: false,
        })
      },
    },
    // {
    //   title: 'Information',
    //   iconActive: 'information-circle',
    //   iconInactive: 'information-circle-outline',
    //   action: () => {
    //     navigation.navigate('InformationNavigation', {
    //       screen: 'InformationScreen',
    //       initial: false,
    //     })
    //   },
    // },
  ]

  return (
    <View
      style={{
        flexDirection: 'row',
        height: 70,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors[themeColor].bgColor,
        elevation: 5,
        borderTopWidth: 1,
        borderColor: colors[themeColor].disable,
      }}
    >
      {bottomTabData.map((item: any, index: number) => (
        <TouchableOpacity
          key={index}
          onPress={() => {
            item.action()
          }}
          activeOpacity={0.8}
          style={{
            width: '33%',
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 10,
            height: '100%',
          }}
        >
          {state.index === index ? (
            <Ionicons
              name={item.iconActive}
              size={24}
              color={colors[themeColor].text}
            />
          ) : (
            <Ionicons
              name={item.iconInactive}
              size={24}
              color={colors[themeColor].comment}
            />
          )}
          <Text
            style={{
              color:
                state.index === index
                  ? colors[themeColor].text
                  : colors[themeColor].comment,
            }}
          >
            {item.title}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  )
}
