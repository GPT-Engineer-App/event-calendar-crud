import React, { useState, useEffect } from "react";
import { Box, Heading, Text, Button, Input, Textarea, Select, Image, useToast } from "@chakra-ui/react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

const API_URL = "/api/events";

const Index = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(null);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const toast = useToast();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setIsLoading(true);
    const res = await fetch(API_URL);
    const data = await res.json();
    setEvents(data);
    setIsLoading(false);
  };

  const addEvent = async () => {
    setIsAdding(true);
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, date, description }),
    });
    if (res.ok) {
      toast({ title: "Event added", status: "success" });
      setTitle("");
      setDate("");
      setDescription("");
      fetchEvents();
    } else {
      toast({ title: "Error adding event", status: "error" });
    }
    setIsAdding(false);
  };

  const updateEvent = async () => {
    const res = await fetch(`${API_URL}/${isEditing.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, date, description }),
    });
    if (res.ok) {
      toast({ title: "Event updated", status: "success" });
      setIsEditing(null);
      fetchEvents();
    } else {
      toast({ title: "Error updating event", status: "error" });
    }
  };

  const deleteEvent = async (id) => {
    const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast({ title: "Event deleted", status: "success" });
      fetchEvents();
    } else {
      toast({ title: "Error deleting event", status: "error" });
    }
  };

  return (
    <Box maxW="800px" mx="auto" p={8}>
      <Heading mb={8}>Event Calendar</Heading>

      {isLoading ? (
        <Text>Loading events...</Text>
      ) : (
        <>
          {events.map((event) => (
            <Box key={event.id} mb={4} p={4} borderWidth={1} rounded="md">
              <Heading size="md">{event.title}</Heading>
              <Text fontSize="sm" color="gray.600">
                {event.date}
              </Text>
              <Text mt={2}>{event.description}</Text>
              <Button
                size="sm"
                colorScheme="blue"
                leftIcon={<FaEdit />}
                onClick={() => {
                  setIsEditing(event);
                  setTitle(event.title);
                  setDate(event.date);
                  setDescription(event.description);
                }}
                mr={2}
              >
                Edit
              </Button>
              <Button size="sm" colorScheme="red" leftIcon={<FaTrash />} onClick={() => deleteEvent(event.id)}>
                Delete
              </Button>
            </Box>
          ))}

          <Box mt={8}>
            <Heading size="md" mb={4}>
              {isEditing ? "Edit Event" : "Add New Event"}
            </Heading>
            <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} mb={4} />
            <Input placeholder="Date" value={date} onChange={(e) => setDate(e.target.value)} mb={4} />
            <Textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} mb={4} />
            <Button colorScheme="blue" leftIcon={<FaPlus />} onClick={isEditing ? updateEvent : addEvent} isLoading={isAdding}>
              {isEditing ? "Update Event" : "Add Event"}
            </Button>
            {isEditing && (
              <Button ml={4} onClick={() => setIsEditing(null)}>
                Cancel
              </Button>
            )}
          </Box>
        </>
      )}
    </Box>
  );
};

export default Index;
