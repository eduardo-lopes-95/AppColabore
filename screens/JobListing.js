import { ScrollView, Box } from 'native-base';
import Logo from '../components/Logo';
import HorizontalSwipeableJobListing from '../components/HorizontalSwipeableJobListing';

function JobListing() {
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