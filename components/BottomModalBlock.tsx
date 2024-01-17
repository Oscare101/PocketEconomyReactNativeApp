import {
  Dimensions,
  StatusBar,
  TouchableWithoutFeedback,
  View,
  useColorScheme,
} from 'react-native'
import colors from '../constants/colors'
import { RootState } from '../redux'
import { useSelector } from 'react-redux'
import { BottomSheetModal } from '@gorhom/bottom-sheet'
import ThemeBlockModal from '../components/ThemeBlockModal'
import TransactionBlockModal from '../components/TransactionBlockModal'
import RatingInfoModal from './RatingInfoModal'
import PersonalStocksProgressModal from './PersonalStocksProgressModal'
import EconomicsGrowsInfoModal from './EconomicsGrowsInfoModal'
import DividendsInfoModal from './DividendsInfoModal'
import DepositInfoModal from './DepositInfoModal'
import StocksOvertakeInfoModal from './StocksOvertakeInfoModal'
import RealEstateTransactionModal from './RealEstateTransactionModal'
import RealEstateInfoModal from './RealEstateInfoModal'
import PromoCodeModal from './PromoCodeModal'
import InterfaceSizeModal from './InterfaceSizeModal'
import OpenBankBlockModal from './OpenBankBlockModal'
import BankInvestBlockModal from './BankInvestBlockModal'
import BankAdvertisementBlockModal from './BankAdvertisementBlockModal'

const width = Dimensions.get('screen').width

export default function BottomModalBlock(props: any) {
  const systemTheme = useColorScheme()
  const theme = useSelector((state: RootState) => state.theme)
  const themeColor: any = theme === 'system' ? systemTheme : theme

  const contentData: any = {
    themeBlock: <ThemeBlockModal />,
    transactionBlock: (
      <TransactionBlockModal
        transactionStockName={props.transactionStockName}
        onClose={() => props.onClose()}
      />
    ),
    RatingInfo: <RatingInfoModal />,
    PersonalStockProgress: <PersonalStocksProgressModal />,
    EconomicsGrowsInfo: <EconomicsGrowsInfoModal />,
    DividendsInfo: <DividendsInfoModal />,
    DepositInfo: <DepositInfoModal />,
    StocksOvertakeInfo: <StocksOvertakeInfoModal />,
    RealEstateTransaction: (
      <RealEstateTransactionModal
        userProperty={props.userProperty}
        region={props.region}
        onClose={() => props.onClose()}
      />
    ),
    RealEstateInfo: <RealEstateInfoModal />,
    promoCodeBlock: <PromoCodeModal onClose={() => props.onClose()} />,
    interfaceSizeBlock: <InterfaceSizeModal />,
    'business-bank': <OpenBankBlockModal onClose={() => props.onClose()} />,
    BankInvest: <BankInvestBlockModal onClose={() => props.onClose()} />,
    BankAdvertisement: (
      <BankAdvertisementBlockModal onClose={() => props.onClose()} />
    ),
  }

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
          borderRadius: width * 0.05,
          margin: width * 0.03,
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: colors[themeColor].disable,
        }}
      >
        {contentData[props.content]}
      </View>
    </BottomSheetModal>
  )
}
