import { StyleSheet } from 'react-native';
import globalStyles from './globalStyles';

const screenStyles = StyleSheet.create({
  // RecentScreen styles
  noChatsContainer: {
    ...globalStyles.centerAlign,
    marginTop: 20,
  },
  noChatsText: {
    ...globalStyles.text,
  },
  goToMatches: {
    ...globalStyles.orangeText,
    marginTop: 5,
  },

  // ActiveScreen styles
  permissionBoxContainer: {
    ...globalStyles.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  permissionText: {
    ...globalStyles.text,
    textAlign: 'center',
  },
  changePermissionButton: {
    backgroundColor: 'orange',
    borderRadius: 5,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 15,
  },

  // CallsScreen styles
  actions: {
    ...globalStyles.row,
  },
  footerContainer: {
    ...globalStyles.centerAlign,
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  footerText: {
    ...globalStyles.text,
    fontSize: 14,
  },
  upgradeText: {
    ...globalStyles.orangeText,
    fontWeight: 'bold',
  },
});

export default screenStyles;
