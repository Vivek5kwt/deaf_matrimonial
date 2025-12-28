import { StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const styles3 = StyleSheet.create({
  headingmodal3text: {
    color: 'black',
    fontSize: wp('4.5%'),
    fontFamily: 'Lexend-Medium',
    marginTop: hp('2%'),
    marginLeft: wp('3%'),
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp('3%'),
  },
  modalIcon3: {
    height: wp('6.5%'),
    width: wp('6.5%'),
  },
  modaltext33: {
    flex: 1,
    fontSize: wp('3.5%'),
    textAlign: 'left',
    marginLeft: wp('5%'),
    fontFamily: 'Lexend-Regular',
    color: 'black',
  },
  backershort: {
    height: wp('4%'),
    width: wp('4%'),
    marginRight: wp('7%'),
  },
  modaltext3: {
    fontFamily: 'Lexend-Medium',
    fontSize: wp('4%'),
    color: '#333',

  },
  moda: {
    fontFamily: 'Lexend-Regular',
    fontSize: wp('3.2%'),
    color: '#333',

  },
  userwithname3: {
    flexDirection: 'row',
    marginLeft: wp('5%'),
  },
  usermodal3: {
    height: wp('24%'),
    width: wp('24%'),
    borderWidth: 1,
    borderRadius: wp('50%'),
    justifyContent: 'center',
  },
  modalcross3: {
    position: 'absolute',
    top: -hp('4.5%'),
    height: wp('4%'),
    width: wp('4%'),
    padding: wp('2.5%'),
  },
  profileImage: {
    width: wp('20%'),
    height: wp('20%'),
    borderRadius: wp('10%'),
  },
  text: {
    fontSize: wp('3.5%'),
    color: '#FFFFFF',
  },
  button: {
    backgroundColor: 'white',
    paddingVertical: hp('1%'),
    paddingHorizontal: wp('8%'),
    borderRadius: wp('5%'),
    marginTop: hp('1.5%'),
    borderWidth: 1,
    borderColor: '#FF7E00',
  },
  buttonText: {
    color: '#FF7E00',
    fontSize: wp('3.5%'),
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: wp('3%'),
    width: wp('90%'),
    overflow: 'hidden',
  },
  modalBackground: {
    width: '100%',
    height: hp('70%'),
  },
  crossIcon: {
    width: wp('6%'),
    height: wp('6%'),
    margin: wp('3%'),
  },
  modalBody: {
    alignItems: 'center',
    paddingVertical: hp('5%'),
  },
  profileImageModal: {
    width: wp('25%'),
    height: wp('25%'),
    borderRadius: wp('12.5%'),
  },
  modalTitle: {
    fontSize: wp('4.8%'),
    marginVertical: hp('2.5%'),
    textAlign: 'center',
    color: '#FF7E00',
  },
  featureList: {
    width: '100%',
    paddingHorizontal: wp('5%'),
  },
  featureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: hp('1.5%'),
  },
  featureIcon: {
    width: wp('6%'),
    height: wp('6%'),
  },
  featureText: {
    flex: 1,
    marginHorizontal: wp('2.5%'),
    fontSize: wp('4%'),
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: hp('0.8%'),
  },
  upgradeButton: {
    backgroundColor: '#FF7E00',
    paddingVertical: hp('1.2%'),
    paddingHorizontal: wp('6%'),
    borderRadius: wp('6%'),
    marginTop: hp('2%'),
    alignSelf: 'center',
  },
  upgradeButtonText: {
    color: 'white',
    fontSize: wp('4%'),
  },
});

export default styles3;
