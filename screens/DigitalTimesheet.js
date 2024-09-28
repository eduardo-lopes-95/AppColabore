import React, { useState, useEffect } from 'react';
import { Box, VStack, HStack, Button, Text, FlatList, Modal, FormControl, Input, useDisclose, useToast, Spinner, Center } from 'native-base';
import { format } from 'date-fns';
import { supabase } from '../configs/supabaseClient'; 
import { useAuth } from '../contexts/AuthContext';

const DigitalTimesheet = () => {
  const [timeEntries, setTimeEntries] = useState([]);
  const [reports, setReports] = useState({ hoursWorked: 0, absences: 0 });
  const { isOpen, onOpen, onClose } = useDisclose();
  const [leaveRequest, setLeaveRequest] = useState({ type: '', startDate: '', endDate: '' });
  const { user } = useAuth();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTimeEntries();
  }, []);

  const fetchTimeEntries = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('TimeEntries')
      .select('*')
      .eq('user_id', user.id)
      .order('timestamp', { ascending: false });

    if (error) {
      console.error('Error fetching time entries:', error);
      toast.show({
        title: "Erro ao carregar registros",
        status: "error",
        description: error.message
      });
    } else {
      setTimeEntries(data);
    }
    setIsLoading(false);
  };

  const registerTime = async () => {
    const newEntry = {
      user_id: user.id,
      timestamp: new Date().toISOString(),
      entry_type: timeEntries.length % 2 === 0 ? 'Entrada' : 'Saída'
    };

    const { data, error } = await supabase
      .from('TimeEntries')
      .insert(newEntry);

    if (error) {
      console.error('Error registering time:', error);
      toast.show({
        title: "Erro ao registrar ponto",
        status: "error",
        description: error.message
      });
    } else {
      setTimeEntries([data[0], ...timeEntries]);
      toast.show({
        title: "Ponto registrado com sucesso",
        status: "success"
      });
    }
  };

  const requestLeave = async () => {
    const newLeaveRequest = {
      user_id: user.id,
      request_type: leaveRequest.type,
      start_date: leaveRequest.startDate,
      end_date: leaveRequest.endDate,
      status: 'Pendente'
    };

    const { data, error } = await supabase
      .from('LeaveRequests')
      .insert(newLeaveRequest);

    if (error) {
      console.error('Error requesting leave:', error);
      toast.show({
        title: "Erro ao solicitar licença",
        status: "error",
        description: error.message
      });
    } else {
      toast.show({
        title: "Solicitação de licença enviada com sucesso",
        status: "success"
      });
    }

    onClose();
    setLeaveRequest({ type: '', startDate: '', endDate: '' });
  };

  const renderHeader = () => (
    <Box
      padding={4}
      backgroundColor="#fff"
      borderRadius={10}
      mb={4}
    >
      <VStack space={4}>
        <Button backgroundColor="#009688" onPress={registerTime}>Registrar Ponto</Button>
        <Button backgroundColor="#009688" onPress={onOpen}>Solicitar Férias/Licença</Button>
        
        <VStack space={2}>
          <Text fontSize="lg" fontWeight="bold">Relatórios</Text>
          <Text>Horas Trabalhadas: {reports.hoursWorked}h</Text>
          <Text>Absenteísmo: {reports.absences} dias</Text>
        </VStack>
        
        <Text fontSize="lg" fontWeight="bold">Registros de Ponto</Text>
      </VStack>
    </Box>
  );

  const renderItem = ({item}) => (
    <Box
      padding={2}
      borderColor="#ccc"
      borderWidth={1}
      borderRadius={5}
      mb={2}
    >
      <Text>{format(new Date(item.timestamp), "dd/MM/yyyy HH:mm:ss")} - {item.entry_type}</Text>
    </Box>
  );

  if (isLoading) {
    return (
      <Center flex={1}>
        <Spinner size="lg" color="#009688" />
      </Center>
    );
  }

  return (
    <>
      <FlatList 
        data={timeEntries}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={{ padding: 10, backgroundColor: '#fff' }}
        ListEmptyComponent={
          <Center p={10}>
            <Text>Nenhum registro de ponto encontrado.</Text>
          </Center>
        }
      />

      <Modal isOpen={isOpen} onClose={onClose}>
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Header>Solicitar Férias/Licença</Modal.Header>
          <Modal.Body>
            <FormControl>
              <FormControl.Label>Tipo</FormControl.Label>
              <Input 
                value={leaveRequest.type}
                onChangeText={(value) => setLeaveRequest({...leaveRequest, type: value})}
              />
            </FormControl>
            <FormControl mt={3}>
              <FormControl.Label>Data de Início</FormControl.Label>
              <Input 
                value={leaveRequest.startDate}
                onChangeText={(value) => setLeaveRequest({...leaveRequest, startDate: value})}
                placeholder="YYYY-MM-DD"
              />
            </FormControl>
            <FormControl mt={3}>
              <FormControl.Label>Data de Fim</FormControl.Label>
              <Input 
                value={leaveRequest.endDate}
                onChangeText={(value) => setLeaveRequest({...leaveRequest, endDate: value})}
                placeholder="YYYY-MM-DD"
              />
            </FormControl>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button variant="ghost" onPress={onClose}>
                Cancelar
              </Button>
              <Button backgroundColor="#009688" onPress={requestLeave}>
                Enviar
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </>
  );
};

export default DigitalTimesheet;
