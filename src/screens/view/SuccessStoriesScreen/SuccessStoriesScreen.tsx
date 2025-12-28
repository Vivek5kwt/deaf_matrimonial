import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  SafeAreaView,
  Modal,
  TouchableWithoutFeedback,
  ActivityIndicator
} from 'react-native';
import { fetchSuccessStories } from '../../../services/api';
import { arrow, cross } from '../../../utils/constants/icons/icon';
import LottieView from 'lottie-react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


const API_BASE_URL = 'http://82.29.161.246:8002';
const WEB_IMAGE_BASE_URL = 'http://82.29.161.246:8001/SuccessStory';

export const getProfileImageUrl = (weddingphoto: string): string | null => {
  if (!weddingphoto) return null;

  // Web image: plain filename like "abc.jpg"
  if (!weddingphoto.includes('/') && weddingphoto.endsWith('.jpg')) {
    return `${WEB_IMAGE_BASE_URL}/${weddingphoto}`;
  }

  // App image: relative path
  return `${API_BASE_URL}/${weddingphoto}`;
};

// Responsive scaling functions
const { width, height } = Dimensions.get('window');
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

const scale = size => width / guidelineBaseWidth * size;
const verticalScale = size => height / guidelineBaseHeight * size;
const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor;

const isSmallScreen = width < 375;
const isTablet = width >= 600;
const CARD_WIDTH = isTablet ? (width - 60) / 2 : width - 40;

const SuccessStoriesScreen = ({ navigation }) => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedStory, setSelectedStory] = useState(null);
  const [activeTab, setActiveTab] = useState('stories');

  const loadStories = useCallback(async () => {
    try {
      const res = await fetchSuccessStories();
      setStories(res?.data || []);
    } catch (error) {
      console.error('Error loading stories:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadStories();
  }, [loadStories]);

  useEffect(() => {
    loadStories();
  }, [loadStories]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => setSelectedStory(item)}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: getProfileImageUrl(item.weddingphoto) }}
          style={styles.image}
          resizeMode="cover"
        />
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.names}>{item.bridename} & {item.groomname}</Text>
        <Text style={styles.date}>{item.marriagedate}</Text>
        <Text numberOfLines={2} style={styles.message}>
          {item.successmessage}
        </Text>
        <TouchableOpacity
          style={styles.readMoreBtn}
          onPress={() => setSelectedStory(item)}
          activeOpacity={0.7}
        >
          <Text style={styles.readMoreText}>Read More</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Image
              source={arrow?.Icon5}
              resizeMode="contain"
              style={styles.arrowStyle}
            />
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text style={styles.headerTitle}>Success Stories</Text>
          </View>
        </View>
        <Text style={styles.headerSubtitle}>Dreams turned into reality</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'stories' && styles.activeTab]}
          onPress={() => setActiveTab('stories')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, activeTab === 'stories' && styles.activeTabText]}>
            Success Stories
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'post' && styles.activeTab]}
          onPress={() => navigation.navigate('AddSuccessStory')}
          activeOpacity={0.7}
        >
          <View style={styles.postTabContent}>
            <Text style={[styles.tabText, activeTab === 'post' && styles.activeTabText]}>
              Post Your Story
            </Text>
            <LottieView
              source={require('../../../assets/animations/heart.json')}
              autoPlay
              loop
              style={styles.lottieAnimation}
            />
          </View>
        </TouchableOpacity>
      </View>

      {activeTab === 'stories' && (
        <FlatList
          data={stories}
          keyExtractor={(item) => item.story_id.toString()}
          renderItem={renderItem}
          numColumns={isTablet ? 2 : 1}
          contentContainerStyle={styles.grid}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              {loading ? (
                <ActivityIndicator size="large" color="#FF7E00" />
              ) : (
                <>
                  <Text style={styles.emptyText}>No success stories yet.</Text>
                  <TouchableOpacity
                    style={styles.postBtn}
                    onPress={() => navigation.navigate('AddSuccessStory')}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.postBtnText}>Share Your Story</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          }
          refreshing={refreshing}
          onRefresh={onRefresh}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Story Detail Modal */}
      <Modal
        visible={!!selectedStory}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setSelectedStory(null)}
      >
        <TouchableWithoutFeedback onPress={() => setSelectedStory(null)}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>

        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.closeModalBtn}
            onPress={() => setSelectedStory(null)}
            activeOpacity={0.7}
          >
            <Image
              source={cross?.Icon28}
              style={styles.closeIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <ScrollView
            style={styles.modalContent}
            showsVerticalScrollIndicator={false}
          >
            {selectedStory && (
              <>
                <Image
                  source={{ uri: getProfileImageUrl(selectedStory?.weddingphoto) }}
                  style={styles.modalImage}
                  resizeMode="cover"
                />

                <View style={styles.modalTextContent}>
                  <Text style={styles.modalNames}>{selectedStory.bridename} & {selectedStory.groomname}</Text>
                  <Text style={styles.modalDate}>{selectedStory.marriagedate}</Text>
                  <Text style={styles.modalMessage}>{selectedStory.successmessage}</Text>
                </View>
              </>
            )}
          </ScrollView>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: hp('0.2%') },
    shadowOpacity: 0.05,
    shadowRadius: wp('1%'),
    elevation: 2,
    zIndex: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: hp('2%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTab: {
    borderBottomWidth: hp('0.5%'),
    borderBottomColor: '#FF7E00',
  },
  tabText: {
    fontSize: wp('4%'),
    fontFamily: 'Lexend-Regular',
    color: '#666',
  },
  activeTabText: {
    color: '#FF7E00',
    fontFamily: 'Lexend-Medium',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: wp('5%'),
    borderTopRightRadius: wp('5%'),
    maxHeight: hp('85%'),
    paddingBottom: hp('2%'),
  },
  closeModalBtn: {
    position: 'absolute',
    top: hp('2%'),
    right: wp('3%'),
    zIndex: 1,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: wp('4%'),
    padding: wp('2%'),
  },
  closeIcon: {
    width: wp('5%'),
    height: wp('5%'),
    tintColor: '#FF7E00',
  },
  modalContent: {
    paddingHorizontal: wp('5%'),
    paddingTop: hp('5%'),
  },
  modalImage: {
    width: '100%',
    height: hp('30%'),
    borderRadius: wp('2%'),
    marginBottom: hp('2%'),
  },
  modalTextContent: {
    paddingHorizontal: wp('2%'),
  },
  modalNames: {
    fontSize: wp('5%'),
    fontFamily: 'Lexend-Medium',
    color: '#333',
    marginBottom: hp('1%'),
    textAlign: 'center',
  },
  modalDate: {
    fontSize: wp('4%'),
    fontFamily: 'Lexend-Regular',
    color: '#888',
    marginBottom: hp('2%'),
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: wp('4%'),
    fontFamily: 'Lexend-Regular',
    color: '#555',
    lineHeight: hp('3%'),
    marginBottom: hp('2%'),
  },
  postBtn: {
    backgroundColor: '#FF7E00',
    paddingVertical: hp('2%'),
    margin: wp('5%'),
    borderRadius: wp('2.5%'),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: hp('0.2%') },
    shadowOpacity: 0.1,
    shadowRadius: wp('1%'),
    elevation: 3,
  },
  postBtnText: {
    color: '#fff',
    fontFamily: 'Lexend-Medium',
    fontSize: wp('4%'),
  },
  grid: {
    paddingHorizontal: wp('4%'),
    paddingBottom: hp('2%'),
  },
  card: {
    backgroundColor: '#fff',
    marginBottom: hp('2%'),
    borderRadius: wp('3%'),
    width: wp('90%'),
    marginHorizontal: wp('1.5%'),
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: wp('2%'),
    shadowOffset: { width: 0, height: hp('0.3%') },
    elevation: 3,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  cardContent: {
    padding: wp('4%'),
  },
  names: {
    fontSize: wp('4.5%'),
    fontFamily: 'Lexend-Medium',
    color: '#333',
    marginBottom: hp('1%'),
  },
  date: {
    fontSize: wp('3.5%'),
    color: '#888',
    marginBottom: hp('1.5%'),
    fontFamily: 'Lexend-Medium',
  },
  message: {
    fontSize: wp('3.5%'),
    color: '#555',
    lineHeight: hp('2.7%'),
    marginBottom: hp('2%'),
    fontFamily: 'Lexend-Regular',
  },
  readMoreBtn: {
    backgroundColor: '#FF7E00',
    paddingVertical: hp('1%'),
    paddingHorizontal: wp('5%'),
    borderRadius: wp('5%'),
    alignSelf: 'flex-start',
  },
  readMoreText: {
    color: '#fff',
    fontFamily: 'Lexend-Medium',
    fontSize: wp('3.5%'),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: wp('5%'),
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: wp('10%'),
    minHeight: hp('50%'),
  },
  emptyText: {
    fontSize: wp('4%'),
    color: '#888',
    marginBottom: hp('2%'),
    fontFamily: 'Lexend-Medium',
    textAlign: 'center',
  },
  lottieAnimation: {
    width: wp('8%'),
    height: wp('8%'),
    marginLeft: wp('1%'),
  },
  postTabContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp('0.5%'),
  },
  backButton: {
    padding: wp('1%'),
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    marginLeft: wp('-10%'),
  },
  arrowStyle: {
    height: wp('5%'),
    width: wp('5%'),
    tintColor: 'white',
  },
  headerTitle: {
    fontSize: wp('5.5%'),
    fontFamily: 'Lexend-Medium',
    color: '#fff',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: wp('3.5%'),
    fontFamily: 'Lexend-Medium',
    color: '#fff',
    textAlign: 'center',
    marginTop: hp('1%'),
  },
  header: {
    padding: wp('2.5%'),
    paddingBottom: hp('1.5%'),
    backgroundColor: '#FF7E00',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
    shadowColor: '#FF7E00',
    shadowOffset: { width: 0, height: hp('0.2%') },
    shadowOpacity: 0.05,
    shadowRadius: wp('1%'),
    elevation: 2,
  },
});

export default SuccessStoriesScreen;