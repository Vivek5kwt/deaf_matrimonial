import { StyleSheet, Dimensions } from 'react-native';
const { width: screenWidth } = Dimensions.get('screen');

const homestyles = StyleSheet.create({
  textInput:{
fontFamily:'Lexend-Medium'
  },

  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingBottom:"20%",
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  arrowstyle: {
    height: 18,
    width: 22,
  },
  searchBox: {
    flex: 1,
    marginLeft: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 20,
    height: 40,
    backgroundColor: '#ddd',
    fontFamily: 'Lexend-Medium',
  },
  title: {
    fontSize: 15,
    fontFamily: 'Lexend-Medium',
    marginBottom: 15,
    color: 'black',
  },
  sliderContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    marginBottom: 10,
    fontFamily: 'Lexend-Regular',
  },
  sliderText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  text: {
    fontFamily: 'Lexend-Regular',
    color: 'black',
    fontSize: 15,
  },
  selectedStyle: {
    backgroundColor: '#FF7E00',
    height: 3,
  },
  unselectedStyle: {
    backgroundColor: '#CCC',
    height: 2,
  },
  markerStyle: {
    backgroundColor: '#FFFFFF',
    height: 25,
    width: 25,
    borderWidth: 1,
    borderColor: '#00000040',
  },
  sliderStyle: {
    height: 15,
  },
  filterContainer: {
    marginBottom: 15,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backIcon: {
    width: 15,
    height: 15,
    tintColor: '#555',
  },
  backIcon1: {
    width: 25,
    height: 25,
    tintColor: '#FF7E00',
  },
  divider: {
    borderBottomWidth: 0.4,
    borderColor: '#00000040',
    marginTop: 10,
  },
  searchButtonFixed: {
    position: 'absolute',
    bottom: 30,
    backgroundColor: '#FF7E00',
    borderRadius: 20,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent:'center',
    width:"45%",
    alignSelf:'center'

  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  moreOptionsButton:{
    color:'#FF7E00',
    fontFamily: 'Lexend-Medium',

  }
});
export default homestyles;
