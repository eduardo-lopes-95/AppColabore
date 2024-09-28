import React, { useState, useEffect } from 'react';
import { ScrollView, Box, Spinner, Center } from 'native-base';
import HorizontalSwipeableJobListing from '../components/HorizontalSwipeableJobListing';

function JobListing() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulating API call
    const fetchData = async () => {
      try {
        // Replace this with your actual API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <Center flex={1} bg="gray.900">
        <Spinner size="lg" color="white" />
      </Center>
    );
  }

  return (
    <ScrollView flex={1} bg="gray.900">
      <Box
        flex={1}
        bg="gray.900"
        alignItems="center"
        justifyContent="center"
        mt={5}>
        <HorizontalSwipeableJobListing />
      </Box>
    </ScrollView>
  );
}

export default JobListing;