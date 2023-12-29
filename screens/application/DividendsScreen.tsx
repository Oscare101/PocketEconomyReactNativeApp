import {
  Dimensions,
  FlatList,
  ScrollView,
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

import { useMemo, useRef, useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import {
  GetMoneyAmount,
  GetUserDividendsValue,
} from '../../functions/functions'
import { DividendHistory } from '../../constants/interfaces'

const width = Dimensions.get('screen').width

export default function DividendsScreen({ navigation, route }: any) {
  const systemTheme = useColorScheme()
  const theme = useSelector((state: RootState) => state.theme)
  const themeColor: any = theme === 'system' ? systemTheme : theme

  function RenderDividendItem({ item }: any) {
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
          size={width * 0.05}
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

        <Text style={[styles.money, { color: colors[themeColor].text }]}>
          <Text style={[styles.comment, { color: colors[themeColor].comment }]}>
            {item.interest} % =
          </Text>{' '}
          $ {GetMoneyAmount(item.value).value}.
          {GetMoneyAmount(item.value).decimal}
          {GetMoneyAmount(item.value).title}
        </Text>
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
      <HeaderDrawer
        title="Dividends"
        onAction={() => {
          navigation.goBack()
        }}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ flex: 1, width: '100%' }}
      >
        <View
          style={[
            styles.card,
            { backgroundColor: colors[themeColor].cardColor },
          ]}
        >
          <View style={styles.rowBetween}>
            <Text
              style={[
                styles.cardTitle,
                { color: colors[themeColor].text, marginBottom: 5 },
              ]}
            >
              {route.params.dividends[0].date}
            </Text>

            <Text
              style={[styles.cardValue, { color: colors[themeColor].text }]}
            >
              ${' '}
              {
                GetMoneyAmount(GetUserDividendsValue(route.params.dividends))
                  .value
              }
              .
              {
                GetMoneyAmount(GetUserDividendsValue(route.params.dividends))
                  .decimal
              }
              {
                GetMoneyAmount(GetUserDividendsValue(route.params.dividends))
                  .title
              }
            </Text>
          </View>

          <View
            style={{
              width: '100%',
              height: 1,
              backgroundColor: colors[themeColor].disable,
            }}
          />
          <FlatList
            style={{ width: '100%' }}
            data={route.params.dividends}
            renderItem={RenderDividendItem}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>
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
    marginVertical: 5,
  },
  cardTitle: {
    fontSize: width * 0.05,
    marginHorizontal: 10,
    textAlign: 'left',
  },
  userStockTitle: {
    fontSize: width * 0.04,
    marginHorizontal: 10,
  },
  money: { fontSize: width * 0.04 },
  comment: { fontSize: width * 0.035 },

  cardValue: {
    fontSize: width * 0.05,
    flex: 1,
    textAlign: 'right',
  },
})
