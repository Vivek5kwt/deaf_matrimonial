import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Dimensions,
  SafeAreaView,
  RefreshControl,
  ScrollView
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import ProfileCard from '../View/OnewayCard';
import { arrow } from '../../../../../../utils/constants/icons/icon';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');
const isSmallDevice = width < 375;

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

const SearchResultsScreen = (props: any) => {
  const route = useRoute();
  const navigation = useNavigation();
  const [profiles, setProfiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchParams, setSearchParams] = useState({});
  const [noResults, setNoResults] = useState(false);
  const [paginationData, setPaginationData] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [authToken, setAuthToken] = useState(null);

  // Load auth token
  useEffect(() => {
    const loadToken = async () => {
      try {
        const token = await AsyncStorage.getItem('auth_token');
        setAuthToken(token);
      } catch (error) {
        console.error('Error loading token:', error);
      }
    };
    loadToken();
  }, []);

  useEffect(() => {
    if (route.params) {
      const validProfiles = (route.params.profiles || []).filter(profile => profile);
      setProfiles(validProfiles);
      setSearchParams(route.params.searchParams || {});
      setPaginationData(route.params.paginationData || null);
      setNoResults(validProfiles.length === 0);
      setIsLoading(false);
    }
  }, [route.params]);

  const fetchMoreProfiles = async () => {
    if (!paginationData || !paginationData.next_page_url || loadingMore) return;
    
    setLoadingMore(true);
    try {
      const response = await axios.get(paginationData.next_page_url, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.data?.data?.length > 0) {
        setProfiles([...profiles, ...response.data.data]);
        setPaginationData(response.data);
      }
    } catch (error) {
      console.error('Error loading more profiles:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      // Re-fetch with original search params
      const params = { ...searchParams, page: 1 };
      const queryString = Object.entries(params)
        .map(([k, v]) => `${k}=${v}`)
        .join('&');

      const url = `http://82.29.161.246:8002/api/search?${queryString}`;
      
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.data?.data?.length > 0) {
        setProfiles(response.data.data);
        setPaginationData(response.data);
        setNoResults(false);
      } else {
        setNoResults(true);
      }
    } catch (error) {
      console.error('Refresh error:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const formatProfileData = (item: any) => {
    return {
      id: item.index_id || `temp-${Math.random()}`,
      name: `${item.firstname || 'Unknown'} ${item.lastname || ''}`,
      matri_id: item.matri_id,
      birthdate: item.birthdate,
      caste_data: item.caste_data?.caste_name || 'N/A',
      height: item?.height_data?.height || 'N/A',
      language: item?.mother_tongue_data?.mtongue_name || 'N/A',
      interest: item.message || false,
      reminder_received: item.reminder_received || false,
      city: item.state?.state_name || 'N/A',
      image: getProfileImageUrl(item.photo1),
    };
  };

  const calculateCardWidth = () => {
    return (width - 48) / 2;
  };

  const renderProfileCard = ({ item }) => {
    if (!item) return null;
    
    return (
      <View style={[styles.cardWrapper, { width: calculateCardWidth() }]}>
        <ProfileCard 
          profile={formatProfileData(item)}
          onButtonPress={() => handleProfileAction(item)}
        />
      </View>
    );
  };

  const handleProfileAction = (profile: any) => {
    console.log('Profile action:', profile);
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <TouchableOpacity 
        onPress={() => props.navigation.goBack()}
        style={styles.backButton}
      >
        <Image source={arrow?.Icon5} resizeMode="contain" style={styles.arrowIcon} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Search Results</Text>
      <View style={styles.headerSpacer} />
    </View>
  );

  const renderSearchCriteria = () => {
    if (!searchParams || Object.keys(searchParams).length === 0) return null;

    return (
      <View style={styles.criteriaContainer}>
        <Text style={styles.criteriaTitle}>Your search criteria:</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.criteriaPillsContainer}
        >
          {Object.entries(searchParams).map(([key, value]) => (
            <View key={key} style={styles.criteriaPill}>
              <Text style={styles.criteriaText}>
                {key}: {String(value)}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  };

  const renderFooter = () => {
    if (loadingMore) {
      return (
        <View style={styles.footerLoading}>
          <ActivityIndicator size="small" color="#FF7E00" />
          <Text style={styles.footerLoadingText}>Loading more profiles...</Text>
        </View>
      );
    }

    if (paginationData && paginationData.current_page < paginationData.last_page) {
      return (
        <TouchableOpacity 
          style={styles.loadMoreButton}
          onPress={fetchMoreProfiles}
        >
          <Text style={styles.loadMoreButtonText}>Load More</Text>
        </TouchableOpacity>
      );
    }

    if (profiles.length > 0) {
      return (
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Showing {profiles.length} of {paginationData?.total || profiles.length} results
          </Text>
        </View>
      );
    }

    return null;
  };

  const renderPaginationInfo = () => {
    if (!paginationData) return null;
    
    return (
      <View style={styles.paginationInfo}>
        <Text style={styles.paginationText}>
          Page {paginationData.current_page} of {paginationData.last_page}
        </Text>
      </View>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF7E00" />
        <Text style={styles.loadingText}>Finding your perfect matches...</Text>
      </SafeAreaView>
    );
  }

  if (noResults) {
    return (
      <SafeAreaView style={styles.noResultsContainer}>
        <View style={styles.noResultsContent}>
          <Image
            source={require('../../../../../../assets/images/DM.png')}
            style={styles.noResultsImage}
          />
          <Text style={styles.noResultsTitle}>No profiles found</Text>
          <Text style={styles.noResultsSubtitle}>
            We couldn't find any matches for your search criteria
          </Text>
          <TouchableOpacity
            style={styles.modifySearchButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.modifySearchButtonText}>Modify Search</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      {renderSearchCriteria()}
      {renderPaginationInfo()}
      
      <FlatList
        data={profiles}
        renderItem={renderProfileCard}
        keyExtractor={(item, index) => item?.index_id?.toString() || index.toString()}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#FF7E00']}
            tintColor="#FF7E00"
          />
        }
        ListFooterComponent={renderFooter}
        onEndReached={fetchMoreProfiles}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: wp(4),
  },
  loadingText: {
    marginTop: hp(2),
    fontFamily: 'Lexend-Medium',
    fontSize: wp(4),
    color: '#555',
    textAlign: 'center',
  },
  noResultsContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  noResultsContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: wp(6),
  },
  noResultsImage: {
    width: wp(45),
    height: wp(45),
    marginBottom: hp(3),
    opacity: 0.8,
  },
  noResultsTitle: {
    fontSize: wp(5.5),
    fontFamily: 'Lexend-SemiBold',
    color: '#333',
    marginBottom: hp(1),
    textAlign: 'center',
  },
  noResultsSubtitle: {
    fontSize: wp(4),
    fontFamily: 'Lexend-Regular',
    color: '#666',
    textAlign: 'center',
    marginBottom: hp(3),
    lineHeight: hp(3),
    paddingHorizontal: wp(5),
  },
  modifySearchButton: {
    backgroundColor: '#FF7E00',
    paddingVertical: hp(1.75),
    paddingHorizontal: wp(8),
    borderRadius: hp(3.5),
    shadowColor: '#FF7E00',
    shadowOffset: { width: 0, height: hp(0.5) },
    shadowOpacity: 0.2,
    shadowRadius: wp(2),
    elevation: 4,
  },
  modifySearchButtonText: {
    color: 'white',
    fontFamily: 'Lexend-SemiBold',
    fontSize: wp(4),
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp(4),
    paddingBottom: hp(2),
    paddingTop: hp(2),
    borderBottomWidth: wp(0.25),
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    padding: wp(2),
  },
  arrowIcon: {
    height: hp(2.5),
    width: wp(5),
    tintColor: '#FF7E00',
  },
  headerTitle: {
    fontFamily: 'Lexend-SemiBold',
    fontSize: wp(5),
    color: '#333',
  },
  headerSpacer: {
    width: wp(5),
  },
  criteriaContainer: {
    padding: wp(4),
    backgroundColor: '#FFF9F2',
  },
  criteriaTitle: {
    fontFamily: 'Lexend-Medium',
    fontSize: wp(3.5),
    color: '#FF7E00',
    marginBottom: hp(1),
  },
  criteriaPillsContainer: {
    flexDirection: 'row',
  },
  criteriaPill: {
    backgroundColor: '#FFFFFF',
    borderRadius: hp(2),
    paddingVertical: hp(0.75),
    paddingHorizontal: wp(3),
    marginRight: wp(2),
    borderWidth: wp(0.25),
    borderColor: '#FFE5CC',
  },
  criteriaText: {
    fontFamily: 'Lexend-Regular',
    fontSize: wp(3),
    color: '#666',
  },
  listContent: {
    paddingHorizontal: wp(2),
    paddingTop: hp(1),
    paddingBottom: hp(2),
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: hp(2),
    paddingHorizontal: wp(2),
  },
  footer: {
    paddingVertical: hp(2),
    alignItems: 'center',
  },
  footerText: {
    fontFamily: 'Lexend-Regular',
    fontSize: wp(3.5),
    color: '#999',
  },
  footerLoading: {
    paddingVertical: hp(2),
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  footerLoadingText: {
    fontFamily: 'Lexend-Regular',
    fontSize: wp(3.5),
    color: '#999',
    marginLeft: wp(2),
  },
  loadMoreButton: {
    backgroundColor: '#FF7E00',
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(6),
    borderRadius: hp(2),
    alignSelf: 'center',
    marginVertical: hp(2),
  },
  loadMoreButtonText: {
    color: 'white',
    fontFamily: 'Lexend-SemiBold',
    fontSize: wp(3.5),
  },
  paginationInfo: {
    padding: wp(2),
    alignItems: 'center',
    backgroundColor: '#FFF9F2',
  },
  paginationText: {
    fontFamily: 'Lexend-Medium',
    fontSize: wp(3.5),
    color: '#FF7E00',
  },
  cardWrapper: {
    flex: 1,
    alignItems: 'center',
    maxWidth: '46%',
    padding: wp(1.25),
  },
});

export default SearchResultsScreen;