import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native'
import Button from '../../components/Button'
import colors from '../../constants/colors'
import StatusItem from '../../components/StatusItem'
import { Ionicons } from '@expo/vector-icons'
import DrawerButton from '../../components/DrawerButton'
import HeaderDrawer from '../../components/HeaderDrawer'
import { RootState } from '../../redux'
import { useSelector } from 'react-redux'
import StockStatusItem from '../../components/StockStatusItem'
import { GetMoneyAmount } from '../../functions/functions'

export default function InvestScreen({ navigation }: any) {
  const systemTheme = useColorScheme()
  const theme = useSelector((state: RootState) => state.theme)
  const companies = useSelector((state: RootState) => state.companies)

  const themeColor: any = theme === 'system' ? systemTheme : theme

  function RenderCompanyItem({ item }: any) {
    return (
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          backgroundColor: colors[themeColor].cardColor,
          marginVertical: 5,
          width: '95%',
          alignSelf: 'center',
          justifyContent: 'space-between',
          borderRadius: 10,
          padding: 5,
        }}
        activeOpacity={0.8}
        onPress={() => {
          navigation.navigate('StockScreen', { companyName: item.name })
        }}
      >
        <View
          style={{
            flexDirection: 'column',
            flex: 1,
            alignItems: 'flex-start',
            justifyContent: 'space-between',
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
              borderBottomWidth: 1,
              borderBlockColor: colors[themeColor].comment,
              width: '100%',
            }}
          >
            <Text style={{ fontSize: 20, color: colors[themeColor].text }}>
              {item.name}
            </Text>
          </View>

          <Text
            style={{
              fontSize: 14,
              fontWeight: '300',
              color: colors[themeColor].text,
            }}
          >
            {item.industry}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',

              width: '100%',
            }}
          >
            <Text style={{ fontSize: 18, color: colors[themeColor].text }}>
              Price: ${' '}
              {
                GetMoneyAmount(item.history[item.history.length - 1].price)
                  .value
              }
              .
              {
                GetMoneyAmount(item.history[item.history.length - 1].price)
                  .decimal
              }{' '}
              {
                GetMoneyAmount(item.history[item.history.length - 1].price)
                  .title
              }
            </Text>
            <Text style={{ fontSize: 18, color: colors[themeColor].text }}>
              Divident rate: {item.stat.dividendsRate} %
            </Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginLeft: 10,
          }}
        >
          <StockStatusItem
            title={false}
            type="volatility"
            statNumber={item.stat.volatility}
          />
          <StockStatusItem
            title={false}
            type="dividendsConsistency"
            statNumber={item.stat.dividendsConsistency}
          />
          <StockStatusItem
            title={false}
            type="companySize"
            statNumber={item.stat.companySize}
          />
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors[themeColor].bgColor },
      ]}
    >
      <HeaderDrawer title="Invest" />
      <FlatList
        style={{ width: '100%' }}
        data={companies}
        renderItem={RenderCompanyItem}
      />
    </View>
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
