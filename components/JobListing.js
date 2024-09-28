import React, { useEffect, useState } from 'react';
import { FlatList, Linking } from "react-native";
import { Box, Text, Button, VStack, Spinner, Center } from 'native-base';

function JobListing({ searchTerm, limit }) {
  const [jobsList, setJobsList] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchJobs(page);
  }, [page]);

  const fetchJobs = (page) => {
    setLoading(true);
    fetch(`https://apibr.com/vagas/api/v1/issues?page=${page}&per_page=10`)
      .then((response) => response.json())
      .then((data) => {
        if (data.length === 0) {
          setHasMore(false);
        } else {
          setJobsList((prevJobs) => [...prevJobs, ...data]);
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setLoading(false));
  };

  const filteredJobs = jobsList
    .filter(
      (job) =>
        job.title.toLowerCase().includes(searchTerm?.toLowerCase()) ||
        job.keywords.map((e) => e.toLowerCase()).includes(searchTerm?.toLowerCase())
    )
    .slice(0, limit || jobsList.length);

  const renderItem = ({ item }) => (
    <Box bg="gray.700" p={4} my={2} rounded="md" w="90%" alignItems="center">
      <Text fontSize="lg" fontWeight="bold" color="white" mb={2} textAlign="center">
        {item.title}
      </Text>
      <Text fontSize="sm" color="white" my={2} textAlign="center">
        Local: {item.keywords.length ? item.keywords.join(", ") : "-"}
      </Text>
      <Button
        onPress={() => Linking.openURL(item.url)}
        bg="teal.500"
        _text={{ color: "white", fontWeight: "bold" }}
        px={4}
        py={2}
        rounded="md"
      >
        Candidatar-se
      </Button>
    </Box>
  );

  const loadMoreJobs = () => {
    if (hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <Box>
      {limit ? (
        <FlatList
          data={filteredJobs}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{ alignItems: "center", paddingHorizontal: 10 }}
        />
      ) : (
        <FlatList
          data={filteredJobs}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{ alignItems: "center", paddingHorizontal: 10 }}
          onEndReached={loadMoreJobs}
          onEndReachedThreshold={0.5}
          ListFooterComponent={loading && <Spinner size="lg" color="teal.500" />}
          ListFooterComponentStyle={{ paddingVertical: 20 }}
          ListEmptyComponent={
            <Center>
              <Text fontSize="md" color="gray.500" mt={4}>
                Não há mais vagas disponíveis.
              </Text>
            </Center>
          }
        />
      )}
    </Box>
  );
}

export default JobListing;
