import React, { useState, useEffect, useCallback } from 'react';
import { RefreshControl } from 'react-native';
import { ScrollView, Box, FlatList, Heading, Text, VStack, HStack, Avatar, Button, Modal, Pressable, Icon, useToast } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../configs/supabaseClient';
import { useAuth } from '../contexts/AuthContext';

const Communication = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [chats, setChats] = useState([]);
  const [polls, setPolls] = useState([]);
  const [showPollModal, setShowPollModal] = useState(false);
  const [selectedPoll, setSelectedPoll] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    announcements: true,
    chats: true,
    polls: true,
  });
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const toast = useToast();
  const { user } = useAuth();

  const fetchData = useCallback(async () => {
    try {
      const { data: announcementsData, error: announcementsError } = await supabase
        .from('Announcements')
        .select('*')
        .order('created_at', { ascending: false });

      if (announcementsError) throw announcementsError;
      setAnnouncements(announcementsData);

      const { data: chatsData, error: chatsError } = await supabase
        .from('Chats')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (chatsError) throw chatsError;
      setChats(chatsData);

      const { data: pollsData, error: pollsError } = await supabase
        .from('Polls')
        .select('*')
        .order('created_at', { ascending: false });

      if (pollsError) throw pollsError;
      setPolls(pollsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.show({
        title: "Erro ao buscar dados",
        status: "error",
        placement: "top",
        duration: 2000
      });
    }
  }, [user.id, toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchData();
      toast.show({
        title: "Dados atualizados",
        status: "success",
        placement: "top",
        duration: 2000
      });
    } catch (error) {
      toast.show({
        title: "Erro ao atualizar dados",
        status: "error",
        placement: "top",
        duration: 2000
      });
    } finally {
      setRefreshing(false);
    }
  }, [fetchData, toast]);

  const renderAnnouncement = ({ item }) => (
    <Box p={4} mb={4} borderWidth={1} borderRadius="md" borderColor="#ccc">
      <Heading size="sm">{item.title}</Heading>
      <Text mt={2}>{item.content}</Text>
    </Box>
  );

  const renderChat = ({ item }) => (
    <HStack space={3} alignItems="center" p={4} borderBottomWidth={1} borderColor="#ccc">
      <Avatar size="md" source={{ uri: 'https://via.placeholder.com/150' }} />
      <VStack>
        <Text fontWeight="bold">{item.name}</Text>
        <Text numberOfLines={1} ellipsizeMode="tail">{item.last_message}</Text>
      </VStack>
    </HStack>
  );

  const renderPoll = ({ item }) => (
    <Box p={4} mb={4} borderWidth={1} borderRadius="md" borderColor="#ccc">
      <Text fontWeight="bold">{item.question}</Text>
      <Button mt={2} backgroundColor="#009688" onPress={() => {
        setSelectedPoll(item);
        setShowPollModal(true);
      }}>Participar</Button>
    </Box>
  );

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const renderSection = (title, data, renderItem, section) => (
    <Box mb={4}>
      <Pressable onPress={() => toggleSection(section)}>
        <HStack alignItems="center" justifyContent="space-between">
          <Heading size="md">{title}</Heading>
          <Icon
            as={Ionicons}
            name={expandedSections[section] ? 'chevron-up' : 'chevron-down'}
            size={6}
          />
        </HStack>
      </Pressable>
      {expandedSections[section] && (
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          scrollEnabled={false}
          mt={2}
        />
      )}
    </Box>
  );

  return (
    <ScrollView 
      contentContainerStyle={{ padding: 10, backgroundColor: '#fff' }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Box
        padding={4}
        backgroundColor="#fff"
        borderRadius={10}
        mb={4}
      >
        <VStack space={4}>
          {renderSection('Anúncios e Notícias', announcements, renderAnnouncement, 'announcements')}
          {renderSection('Chats', chats, renderChat, 'chats')}
          {renderSection('Enquetes', polls, renderPoll, 'polls')}
        </VStack>
      </Box>

      <Modal isOpen={showPollModal} onClose={() => setShowPollModal(false)}>
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Header>{selectedPoll?.question}</Modal.Header>
          <Modal.Body>
            <VStack space={2}>
              {selectedPoll?.options.map((option, index) => (
                <Button key={index} backgroundColor="#009688" onPress={() => {
                  setShowPollModal(false);
                }}>{option}</Button>
              ))}
            </VStack>
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </ScrollView>
  );
};

export default Communication;