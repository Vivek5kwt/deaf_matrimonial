import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import styles2 from '../../../../../../styles/verification/verificationstyles';
import { crown, pic1, pic2, pic3, pic4, pic5, pic6, pic7, orgcheck, block } from '../../../../../../utils/constants/icons/icon';
import { addIMG } from '../../../../../../utils/constants/images/image';
import PhotoMissingModal from '../../../../../../screens/view/login/pages/home/View/Modals4Cards/photomissing';

const BlockProfileCard = ({ profile, isViewerMembership, profileMembership ,navigation}) => {

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isPhotoModalVisible, setIsPhotoModalVisible] = useState(false);

  const handleRequestPhotoPress = () => {
    setIsPhotoModalVisible(true);
  };

  const handleClosePhotoModal = () => {
    setIsPhotoModalVisible(false);
  };
  const [visibleModal, setVisibleModal] = useState(null); // Track which modal is visible

  const closeModal = () => setVisibleModal(null);

  const handleYouAndHerPress = () => {
    setIsModalVisible(true);
  };

  const handleCloseYouAndHerModal = () => {
    setIsModalVisible(false);
  };

  const shouldBlurImage = !isViewerMembership && profileMembership;

  const logo = profile.status === 'Online' ? pic5?.Icon90 : pic7?.Icon93;

  const isJustJoined =
    profile.joinDate &&
    new Date() - new Date(profile.joinDate) < 7 * 24 * 60 * 60 * 1000;
     
  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        {profile.profileImage ? (
          <>
            <Image
              source={profile.profileImage}
              style={[
                styles.image,
                shouldBlurImage && styles.blurredImage,
              ]}
            />
            {shouldBlurImage && (
              <TouchableOpacity style={styles.upgradeButton} onPress={() => { }}>
                <Text style={styles.upgradeButtonText}>Upgrade to View</Text>
              </TouchableOpacity>
            )}
          </>
        ) : (
          <>
            <Image source={addIMG?.IMG24} style={styles.image} />
            <TouchableOpacity
              style={styles.addPhotoButton}
              onPress={handleRequestPhotoPress}
            >
              <Text style={styles.addPhotoText}>Request a Photo</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
      <PhotoMissingModal
        visible={isPhotoModalVisible}
        onClose={handleClosePhotoModal}
      />

      <View style={styles.overlay}>
        {/* {profile.isAstro && (
          <View style={styles.astroBadge}>
            <Image source={pic1?.Icon88} style={styles.threeicons} />
            <Text style={styles.astroText}>Astro</Text>
          </View>
        )} */}

        {profile.profileImage && (
          <TouchableOpacity style={styles.cameraContainer}>
            {/* <Image source={pic2?.Icon88} style={styles.threeicons} /> */}
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.cameraContainer2} >
          {/* <Image source={pic4?.Icon89} style={styles.threeicons} /> */}
        </TouchableOpacity>
       
        <View style={styles.details}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{profile.name}</Text>
            {/* <View style={styles.statusContainer}>
              <Image
                source={logo}
                style={[
                  styles.threeicons,
                  logo === pic7?.Icon93 && styles.pic7Style,
                ]}
              />
              <Text style={styles.statusText}>{profile.status}</Text>
            </View> */}
            <TouchableOpacity
              onPress={handleYouAndHerPress}
              style={styles.statusContainer}
            >
              <Image source={pic6?.Icon91} style={styles.threeicons} />
              <Text style={[styles.statusText]}>Message</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleYouAndHerPress}
              style={styles.statusContainer}
            >
              <Image source={block?.Icon153} style={styles.threeicons} />
              <Text style={[styles.statusText]}>Unblock User</Text>
            </TouchableOpacity>
          </View>
           <View style={{flexDirection:'row'}}>
           <View style={{flexDirection:"column"}}>

          <Text style={styles.info}>
            •{profile.age} yrs, Height {profile.height}
          </Text>
          <Text style={styles.info}>
            •{profile.language} • {profile.location}
          </Text>
          </View>

          <View style={{flexDirection:"column"}}>

          <Text style={styles.info}>
            •{profile.Occupation} • {profile.Education}
          </Text>
          <Text style={styles.info}>
            •{profile.Religion} • {profile.Caste}
          </Text>
          </View>

          </View>
          <View style={styles2.dividerLine22} />
          <View style={styles.premiumRow}>
            <Image source={crown?.Icon92} style={styles.crowniconnn} />
            <Text style={styles.upgradeText}>Upgrade to Premium</Text>
            <View
              style={{
                marginLeft: 20,
                backgroundColor: '#91C354',
                alignItems: 'center',
                padding: 10,
                borderRadius: 50,
                justifyContent: 'center',
              }}
            >
              <Image source={orgcheck?.Icon30} style={styles.greenicons} />
            </View>
          </View>
        </View>
      </View>

      <Modal visible={isModalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>You and Her Details</Text>
            <TouchableOpacity onPress={handleCloseYouAndHerModal}>
              <Text style={styles.modalClose}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  pic7Style: {
    height: 8,
    width: 8,
  },
  statusText: {
    fontFamily:'Lexend-Bold',
    color: 'white',
    marginHorizontal: 5,
    fontSize: 10,
    alignSelf: 'center',
  },
  statusContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    flexDirection: 'row',
    marginLeft: 30,
  },
  threeicons: {
    height: 20,
    width: 20,
    alignSelf: 'center',
  },
  greenicons: {
    height: 40,
    width: 40,
    alignSelf: 'center',
    tintColor: 'white',
  },
  crowniconnn: {
    height: 50,
    width: 50,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 20,
    marginHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    width: '90%',
    borderWidth:2,
    borderRadius:20,
    borderColor:'#FF7E00',

  },
  image: {
    width: '100%',
    height: 400,
    borderRadius:20,

  },
  justJoined: {
    position: 'absolute',
    top: 50,
    left: -10,
    borderRadius: 5,
    color: '#000',
  },
  justJoinedText: {
    position: 'absolute',
    top: 4,
    left: 15,
    color: '#FF7E00',
    fontFamily: 'Lexend-Medium',
    fontSize: 12,
  },
  overlay: {
    position: 'absolute',
    top: 10,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
  },
  astroBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 19,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  astroText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    fontFamily: 'Lexend-Medium',
    marginHorizontal: 10,
  },
  // cameraContainer: {
  //   position: 'absolute',
  //   top: 10,
  //   right: 10,
  //   backgroundColor: 'rgba(0, 0, 0, 0.3)',
  //   paddingHorizontal: 17,
  //   paddingVertical: 5,
  //   borderRadius: 20,
  // },
  // cameraContainer2: {
  //   position: 'absolute',
  //   top: "10%",
  //   right: 20,
  //   backgroundColor: 'rgba(0, 0, 0, 0.3)',
  //   paddingHorizontal: 5,
  //   paddingVertical: 5,
  //   borderRadius: 20,
  // },
  cameraText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  details: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingHorizontal: 10,
    paddingVertical: 10,
    
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  additionalInfo: {
    flexDirection: 'row',
  },
  infoBadge: {
    color: '#fff',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 2,
    marginHorizontal: 2,
    backgroundColor: 'red'
  },
  youAndHer: {
    backgroundColor: '#f8a017',
  },
  name: {
    fontSize: 18,
    color: '#fff',
    fontFamily: 'Lexend-Medium',

  },
  info: {
    fontSize: 14,
    color: '#fff',
    marginTop: 5,
    fontFamily: 'Lexend-Medium',
  },
  crowniconnn: {
    height: 50,
    width: 50,
  },
  premiumRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  upgradeText: {
    color: '#FF7E00',
    fontSize: 17,
    marginLeft: 10,
    fontFamily: 'Lexend-Bold',

  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
  },
  modalClose: {
    color: 'blue',
    fontSize: 14,
  },
  addPhotoButton: {
    position: 'absolute',
    bottom: "50%",
    backgroundColor: '#FF7E00',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    alignSelf: 'center',
  },
  addPhotoText: {
    color: 'white',
    fontSize: 15,
    fontFamily: 'Lexend-Bold',
  },
  blurredImage: {
    opacity: 0.3, // Reduce opacity to simulate a blur effect
  },
  upgradeButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -50 }],
    backgroundColor: '#FF7E00',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
  },
  upgradeButtonText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Lexend-Bold',
    textAlign: 'center',
  },
});

export default BlockProfileCard;
