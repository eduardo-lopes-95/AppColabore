import React, { useState, useEffect, useCallback } from 'react';
import { RefreshControl } from 'react-native';
import { Box, FlatList, Text, Progress, Button, Modal, useToast, VStack } from 'native-base';
import { supabase } from '../configs/supabaseClient';
import { useAuth } from '../contexts/AuthContext';

const LearningAndDevelopment = () => {
  const [courses, setCourses] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();
  const toast = useToast();

  const renderCourseItem = ({ item }) => (
    <Box
      padding={4}
      borderColor="#ccc"
      borderWidth={1}
      borderRadius={5}
      mb={4}
    >
      <Text fontSize="lg" fontWeight="bold" mb={2}>{item.title}</Text>
      <Progress value={item.progress} my={2} _filledTrack={{ bg: "#009688" }} />
      <Text fontSize="sm" mb={2}>{`Progress: ${item.progress}%`}</Text>
      <Button
        backgroundColor="#009688"
        onPress={() => {
          setSelectedCourse(item);
          setModalVisible(true);
        }}
      >
        Continue Course
      </Button>
    </Box>
  );

  const renderCertificationItem = ({ item }) => (
    <Box
      padding={4}
      borderColor="#ccc"
      borderWidth={1}
      borderRadius={5}
      mb={4}
    >
      <Text fontSize="lg" fontWeight="bold" mb={2}>{item.name}</Text>
      <Text fontSize="sm">{`Obtained: ${item.obtained_date}`}</Text>
    </Box>
  );

  const fetchCourses = async () => {
    const { data, error } = await supabase
      .from('Courses')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching courses:', error);
      toast.show({
        title: "Error fetching courses",
        status: "error",
        description: error.message
      });
    } else {
      setCourses(data);
    }
  };

  const fetchCertifications = async () => {
    const { data, error } = await supabase
      .from('Certifications')
      .select('*')
      .eq('user_id', user.id)
      .order('obtained_date', { ascending: false });

    if (error) {
      console.error('Error fetching certifications:', error);
      toast.show({
        title: "Error fetching certifications",
        status: "error",
        description: error.message
      });
    } else {
      setCertifications(data);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([fetchCourses(), fetchCertifications()]);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    fetchCourses();
    fetchCertifications();
  }, []);

  const renderItem = ({ item, index }) => {
    if (index === 0) {
      return (
        <VStack space={4}>
          <Text fontSize="lg" mb={4}>My Courses</Text>
          {courses.map(course => renderCourseItem({ item: course }))}
          <Text fontSize="lg" mb={4} mt={6}>My Certifications</Text>
        </VStack>
      );
    }
    return renderCertificationItem({ item });
  };

  const data = [{ id: 'header' }, ...certifications];

  return (
    <Box flex={1}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.id || `cert-${index}`}
        contentContainerStyle={{ padding: 10, backgroundColor: '#fff' }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

      <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Header>{selectedCourse?.title}</Modal.Header>
          <Modal.Body>
            <Text>Course content would be displayed here.</Text>
            <Text mt={2}>Progress: {selectedCourse?.progress}%</Text>
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </Box>
  );
};

export default LearningAndDevelopment;
