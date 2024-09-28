import React from 'react';
import { Box, Input } from 'native-base';

function Search({ setSearchTerm }) {
  const handleSearch = (text) => {
    setSearchTerm(text);
  };

  return (
    <Box alignItems="center" w="100%">
      <Input
        w="80%"
        p={3}
        borderRadius="md"
        borderWidth={1}
        borderColor="gray.300"
        placeholder="Digite um cargo, cidade ou estado"
        onChangeText={handleSearch}
      />
    </Box>
  );
}

export default Search;
