import React from 'react';
import { Box } from 'native-base';
import JobPosting from '../components/JobPosting';

function Job() {
  return (
    <Box flex={1} p={4}>
      <JobPosting />
    </Box>
  );
}

export default Job;