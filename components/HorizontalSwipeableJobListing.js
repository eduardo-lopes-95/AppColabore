import React, { useState, useEffect } from 'react';
import { Animated, FlatList, Dimensions, Linking } from 'react-native';
import { GestureHandlerRootView, PanGestureHandler, State } from 'react-native-gesture-handler';
import { Box, Text, Button, VStack, HStack } from 'native-base';

const { width } = Dimensions.get('window');

function HorizontalSwipeableJobListing() {
  const [jobs, setJobs] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchAllJobs();
  }, []);

  const fetchAllJobs = async () => {
    try {
      const response = await fetch('https://apibr.com/vagas/api/v1/issues?page=1&per_page=100');
      const data = await response.json();
      setJobs(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSwipe = (job, direction) => {
    if (direction === 'right') {
      console.log('Liked:', job.title);
    } else if (direction === 'left') {
      console.log('Disliked:', job.title);
    }

    setCurrentIndex((prevIndex) => prevIndex + 1);
  };

  const renderSwipeableItem = ({ item, index }) => {
    if (index < currentIndex) return null;

    const translateX = new Animated.Value(0);
    const rotate = translateX.interpolate({
      inputRange: [-width, 0, width],
      outputRange: ['-30deg', '0deg', '30deg'],
    });
    const animatedStyle = {
      transform: [{ translateX }, { rotate }],
    };

    const handleGestureEvent = Animated.event(
      [{ nativeEvent: { translationX: translateX } }],
      { useNativeDriver: true }
    );

    const handleStateChange = ({ nativeEvent }) => {
      if (nativeEvent.state === State.END) {
        if (nativeEvent.translationX > 100) {
          Animated.timing(translateX, {
            toValue: width,
            duration: 200,
            useNativeDriver: true,
          }).start(() => handleSwipe(item, 'right'));
        } else if (nativeEvent.translationX < -100) {
          Animated.timing(translateX, {
            toValue: -width,
            duration: 200,
            useNativeDriver: true,
          }).start(() => handleSwipe(item, 'left'));
        } else {
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      }
    };

    return (
      <PanGestureHandler
        onGestureEvent={handleGestureEvent}
        onHandlerStateChange={handleStateChange}
      >
        <Animated.View style={[styles.swipeableContainer, animatedStyle]}>
          <Box style={styles.overlayContainer} alignItems="center" justifyContent="center">
            <Animated.Text
              style={[
                styles.overlayText,
                {
                  opacity: translateX.interpolate({
                    inputRange: [0, 100],
                    outputRange: [0, 1],
                    extrapolate: 'clamp',
                  }),
                },
              ]}
            >
              Gostei
            </Animated.Text>
            <Animated.Text
              style={[
                styles.overlayText,
                {
                  opacity: translateX.interpolate({
                    inputRange: [-100, 0],
                    outputRange: [1, 0],
                    extrapolate: 'clamp',
                  }),
                },
              ]}
            >
              Não Gostei
            </Animated.Text>
          </Box>
          <Box style={styles.jobCard} padding={4}>
            <Text style={styles.jobTitle}>{item.title}</Text>
            <Text style={styles.jobLocation}>Local: {item.keywords.length ? item.keywords.join(', ') : '-'}</Text>
            <Button
              mt={4}
              onPress={() => Linking.openURL(item.url)}
              colorScheme="teal"
              borderRadius={5}
            >
              Candidatar-se
            </Button>
          </Box>
        </Animated.View>
      </PanGestureHandler>
    );
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <FlatList
        data={jobs}
        renderItem={renderSwipeableItem}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        pagingEnabled
        contentContainerStyle={styles.jobList}
        showsHorizontalScrollIndicator={false}
        extraData={currentIndex}
      />
    </GestureHandlerRootView>
  );
}

const styles = {
  container: {
    flex: 1,
  },
  swipeableContainer: {
    width: width * 0.8,
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    marginHorizontal: 10,
    elevation: 3,
  },
  overlayContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  overlayText: {
    fontSize: 24,
    color: 'white',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 5,
    position: 'absolute',
  },
  jobCard: {
    width: '90%',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'space-between',
  },
  jobTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  jobLocation: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  jobList: {
    paddingHorizontal: 10,
  },
};

export default HorizontalSwipeableJobListing;