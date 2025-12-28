import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { drawer } from '../../../../../utils/constants/icons/icon';
import BottomHeader from '../../../../../components/BottomHeader';
import { getUserData } from '../../../../../utils/constants/storage';
import ProfileCard from '../../../../../components/modalforhome/profilecard/ProfileCard';
import SideMenuModal from '../../../../../components/modalforhome/ModalContent';
import verificationstyles from '../../../../../styles/verification/verificationstyles';
import { useFocusEffect } from '@react-navigation/native';
import NotificationBell from '../notification/Notifications';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const API_BASE_URL = 'http://82.29.161.246:8002';
const WEB_IMAGE_BASE_URL = 'http://82.29.161.246:8001/my_photos';

const getProfileImageUrl = (photo1: string): string => {
  if (!photo1) return 'https://via.placeholder.com/100';

  // Web user image: just the filename
  if (!photo1.includes('/') && photo1.endsWith('.jpg')) {
    return `${WEB_IMAGE_BASE_URL}/${photo1}`;
  }

  // App user image: relative path
  return `${API_BASE_URL}/${photo1}`;
};

const Screen26 = (props: any) => {
  const insets = useSafeAreaInsets();

  const [isModal2Visible, setModal2Visible] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [featuredProfiles, setFeaturedProfiles] = useState<any[]>([]);
  const [recentlyJoined, setRecentlyJoined] = useState<any[]>([]);
  const [recentLogins, setRecentLogins] = useState<any[]>([]);
  const [myMatches, setMyMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination states for all sections
  const [featuredPagination, setFeaturedPagination] = useState({
    current_page: 1,
    last_page: 1,
    next_page_url: null,
    loadingMore: false
  });
  
  const [recentlyJoinedPagination, setRecentlyJoinedPagination] = useState({
    current_page: 1,
    last_page: 1,
    next_page_url: null,
    loadingMore: false
  });
  
  const [recentLoginsPagination, setRecentLoginsPagination] = useState({
    current_page: 1,
    last_page: 1,
    next_page_url: null,
    loadingMore: false
  });
  
  const [myMatchesPagination, setMyMatchesPagination] = useState({
    current_page: 1,
    last_page: 1,
    next_page_url: null,
    loadingMore: false
  });

  const openModal2 = () => setModal2Visible(true);
  const closeModal2 = () => setModal2Visible(false);
  const { navigation } = props;

  useFocusEffect(
    React.useCallback(() => {
      const fetchUserData = async () => {
        try {
          const data = await getUserData();
          if (data) {
            setUserData(data);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };
      fetchUserData();
    }, [])
  );

  // Initial data fetch
  useFocusEffect(
    React.useCallback(() => {
      const fetchProfiles = async () => {
        try {
          setLoading(true);
          const token = await AsyncStorage.getItem('auth_token');
          if (!token) {
            console.error('Token not found');
            setLoading(false);
            return;
          }

          const responses = await Promise.all([
            fetch(`${API_BASE_URL}/api/featuredProfiles?page=1`, { headers: { Authorization: `Bearer ${token}` } }),
            fetch(`${API_BASE_URL}/api/recentlyJoined?page=1`, { headers: { Authorization: `Bearer ${token}` } }),
            fetch(`${API_BASE_URL}/api/recentLogins?page=1`, { headers: { Authorization: `Bearer ${token}` } }),
            fetch(`${API_BASE_URL}/api/my-matches?page=1`, { headers: { Authorization: `Bearer ${token}` } }),
          ]);

          if (!responses.every((res) => res.ok)) {
            console.error('One or more profile requests failed');
            setLoading(false);
            return;
          }

          const [featuredData, recentlyJoinedData, recentLoginsData, myMatchesData] = await Promise.all(
            responses.map((r) => r.json())
          );

          // Set initial data and pagination info
          setFeaturedProfiles(featuredData.featuredProfiles?.data || []);
          setFeaturedPagination({
            current_page: featuredData.featuredProfiles?.current_page || 1,
            last_page: featuredData.featuredProfiles?.last_page || 1,
            next_page_url: featuredData.featuredProfiles?.next_page_url || null,
            loadingMore: false
          });

          setRecentlyJoined(recentlyJoinedData.recentlyJoined?.data || []);
          setRecentlyJoinedPagination({
            current_page: recentlyJoinedData.recentlyJoined?.current_page || 1,
            last_page: recentlyJoinedData.recentlyJoined?.last_page || 1,
            next_page_url: recentlyJoinedData.recentlyJoined?.next_page_url || null,
            loadingMore: false
          });

          setRecentLogins(recentLoginsData.recentLogins?.data || []);
          setRecentLoginsPagination({
            current_page: recentLoginsData.recentLogins?.current_page || 1,
            last_page: recentLoginsData.recentLogins?.last_page || 1,
            next_page_url: recentLoginsData.recentLogins?.next_page_url || null,
            loadingMore: false
          });

          const matches = myMatchesData.my_matches?.data || [];
          const extractedMatches = matches.map((item) => ({
            ...item.receiver,
            message: item.message,
            reminder_received: item.reminder_received,
          }));
          setMyMatches(extractedMatches);
          setMyMatchesPagination({
            current_page: myMatchesData.my_matches?.current_page || 1,
            last_page: myMatchesData.my_matches?.last_page || 1,
            next_page_url: myMatchesData.my_matches?.next_page_url || null,
            loadingMore: false
          });

        } catch (error) {
          console.error('Error fetching profiles:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchProfiles();
    }, [])
  );

  // Load more function for all sections
  const loadMoreProfiles = async (section: string) => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      if (!token) return;

      let paginationState, setPaginationState, setProfiles, apiUrl;
      
      switch (section) {
        case 'featured':
          paginationState = featuredPagination;
          setPaginationState = setFeaturedPagination;
          setProfiles = setFeaturedProfiles;
          apiUrl = `${API_BASE_URL}/api/featuredProfiles`;
          break;
        case 'recentlyJoined':
          paginationState = recentlyJoinedPagination;
          setPaginationState = setRecentlyJoinedPagination;
          setProfiles = setRecentlyJoined;
          apiUrl = `${API_BASE_URL}/api/recentlyJoined`;
          break;
        case 'recentLogins':
          paginationState = recentLoginsPagination;
          setPaginationState = setRecentLoginsPagination;
          setProfiles = setRecentLogins;
          apiUrl = `${API_BASE_URL}/api/recentLogins`;
          break;
        case 'myMatches':
          paginationState = myMatchesPagination;
          setPaginationState = setMyMatchesPagination;
          setProfiles = setMyMatches;
          apiUrl = `${API_BASE_URL}/api/my-matches`;
          break;
        default:
          return;
      }

      if (!paginationState.next_page_url || paginationState.loadingMore) return;

      setPaginationState(prev => ({ ...prev, loadingMore: true }));

      const nextPage = paginationState.current_page + 1;
      const response = await fetch(`${apiUrl}?page=${nextPage}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) {
        console.error(`Failed to load more ${section}`);
        setPaginationState(prev => ({ ...prev, loadingMore: false }));
        return;
      }

      const data = await response.json();
      
      let newProfiles = [];
      if (section === 'myMatches') {
        const matches = data.my_matches?.data || [];
        newProfiles = matches.map((item) => ({
          ...item.receiver,
          message: item.message,
          reminder_received: item.reminder_received,
        }));
      } else {
        newProfiles = data[section]?.data || [];
      }

      setProfiles(prev => [...prev, ...newProfiles]);
      setPaginationState({
        current_page: data[section]?.current_page || nextPage,
        last_page: data[section]?.last_page || paginationState.last_page,
        next_page_url: data[section]?.next_page_url || null,
        loadingMore: false
      });

    } catch (error) {
      console.error(`Error loading more ${section}:`, error);
      switch (section) {
        case 'featured':
          setFeaturedPagination(prev => ({ ...prev, loadingMore: false }));
          break;
        case 'recentlyJoined':
          setRecentlyJoinedPagination(prev => ({ ...prev, loadingMore: false }));
          break;
        case 'recentLogins':
          setRecentLoginsPagination(prev => ({ ...prev, loadingMore: false }));
          break;
        case 'myMatches':
          setMyMatchesPagination(prev => ({ ...prev, loadingMore: false }));
          break;
      }
    }
  };

  const handleProfileButtonPress = (profile: any) => {
    console.log(`Button pressed for ${profile.firstname} ${profile.lastname}`);
  };

  // Render profile list with pagination
  const renderProfileList = (title: string, profiles: any[], onPress: (profile: any) => void, section: string, pagination: any) => (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.listContainer}>
        <Text style={styles.listTitle}>{title}</Text>
        {profiles.length > 0 ? (
          <FlatList
            data={profiles.filter(Boolean)}
            horizontal
            keyExtractor={(item, index) => item?.index_id?.toString() || `temp-${index}`}
            renderItem={({ item }) => (
              <ProfileCard
                profile={{
                  id: item?.index_id || `temp-${Math.random()}`,
                  name: `${item.firstname || 'Unknown'} ${item.lastname || ''}`,
                  matri_id: item.matri_id,
                  birthdate: item.birthdate,
                  caste_data: item.caste_data?.caste_name || 'N/A',
                  height: item.height || 'N/A',
                  language: item?.mother_tongue_data?.mtongue_name || 'N/A',
                  interest: item?.message || false,
                  reminder_received: item?.reminder_received || false,
                  city: item.state?.state_name || 'N/A',
                  image: getProfileImageUrl(item.photo1),
                }}
                onButtonPress={() => onPress(item)}
              />
            )}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: wp('0%') }}
            onEndReached={() => loadMoreProfiles(section)}
            onEndReachedThreshold={0.3}
            ListFooterComponent={
              pagination.loadingMore ? (
                <View style={styles.loadMoreContainer}>
                  <ActivityIndicator size="small" color="#FF7E00" />
                  <Text style={styles.loadMoreText}>Loading more...</Text>
                </View>
              ) : pagination.next_page_url ? (
                <View style={styles.moreAvailableContainer}>
                  <Text style={styles.moreAvailableText}>Swipe for more →</Text>
                </View>
              ) : null
            }
          />
        ) : (
          <Text style={styles.noProfilesText}>No Profiles Found</Text>
        )}
      </View>
    </SafeAreaView>
  );

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={openModal2}>
          <Image source={drawer.Icon51} style={verificationstyles.bellIcon} />
        </TouchableOpacity>
        <SideMenuModal
          isModal2Visible={isModal2Visible}
          closeModal2={closeModal2}
          userData={userData}
          setUserData={setUserData}
          navigation={navigation}
        />
        <View style={styles.userNameContainer}>
          <Text style={styles.userName}>{userData?.firstName} {userData?.lastName}</Text>
        </View>
        <TouchableOpacity style={{ marginRight: -wp('3%') }}>
          <NotificationBell />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#FF7E00" />
          <Text style={styles.loaderText}>Loading profiles...</Text>
        </View>
      ) : (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: hp('10%') }}>
          {renderProfileList('FEATURED PROFILES', featuredProfiles, handleProfileButtonPress, 'featured', featuredPagination)}
          {renderProfileList('RECENTLY JOINED', recentlyJoined, handleProfileButtonPress, 'recentlyJoined', recentlyJoinedPagination)}
          {renderProfileList('RECENT LOGIN', recentLogins, handleProfileButtonPress, 'recentLogins', recentLoginsPagination)}
          {renderProfileList('MY MATCHES', myMatches, handleProfileButtonPress, 'myMatches', myMatchesPagination)}
        </ScrollView>
      )}

      <View
        style={[
          verificationstyles.bottomHeaderContainer,
          { paddingBottom: insets.bottom + hp('0%') }
        ]}
      >
        <BottomHeader />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {
    marginTop: hp('1.5%'),
    fontSize: wp('4%'),
    color: '#333',
    fontFamily: 'Lexend-Medium',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1.2%'),
  },
  userNameContainer: {
    position: 'absolute',
    left: wp('12%'),
    top: hp('1.5%'),
  },
  userName: {
    fontSize: wp('4%'),
    fontFamily: 'Lexend-Medium',
    color: '#333',
  },
  listContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('2%'),
    marginHorizontal: wp('3%'),
    marginBottom: hp('1%'),
    borderWidth: 0.5,
    borderColor: '#FF7E00',
    borderRadius: wp('5%'),
  },
  listTitle: {
    fontSize: wp('4%'),
    color: '#333',
    marginBottom: hp('1%'),
    fontFamily: 'Lexend-Medium',
  },
  noProfilesText: {
    textAlign: 'center',
    fontSize: wp('3.5%'),
    color: 'gray',
    marginTop: hp('1%'),
    fontFamily: 'Lexend-Medium',
  },
  loadMoreContainer: {
    marginTop: hp('10.5%'),
    padding: wp('3%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadMoreText: {
    fontSize: wp('3%'),
    color: '#666',
    fontFamily: 'Lexend-Regular',
    justifyContent: 'center',

  },
  moreAvailableContainer: {
    padding: wp('3%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreAvailableText: {
    fontSize: wp('3%'),
    color: '#FF7E00',
    fontFamily: 'Lexend-Medium',
  },
});

export default Screen26;