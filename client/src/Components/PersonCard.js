import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { DELETE_PERSON } from "../graphql/mutations.js";
import { UPDATE_PERSON } from "../graphql/mutations.js";
import { GET_ALL_PEOPLE } from "../graphql/queries.js";
import { Card, Button, Input, Form } from "antd";
import CarCard from "./CarCard";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

const PersonCard = ({ person, refetch }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    firstName: person.firstName,
    lastName: person.lastName,
  });

  const [deletePerson] = useMutation(DELETE_PERSON, {
    variables: { id: person.id },
    refetchQueries: [{ query: GET_ALL_PEOPLE }],
  });

  const [updatePerson] = useMutation(UPDATE_PERSON, {
    variables: {
      id: person.id,
      firstName: editData.firstName,
      lastName: editData.lastName,
    },
    optimisticResponse: {
      __typename: "Mutation",
      updatePerson: {
        __typename: "People",
        id: person.id,
        firstName: editData.firstName,
        lastName: editData.lastName,
        cars: [...person.cars],
      },
    },
    update: (cache, { data: { updatePerson } }) => {
      const existingPeople = cache.readQuery({ query: GET_ALL_PEOPLE });
      if (existingPeople) {
        const updatedPeople = existingPeople.allPeople.map((p) =>
          p.id === person.id ? updatePerson : p
        );
        cache.writeQuery({
          query: GET_ALL_PEOPLE,
          data: { allPeople: updatedPeople },
        });
      }
    },
  });

  const handleDelete = () => {
    deletePerson();
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const submitEdit = () => {
    updatePerson({
      variables: {
        id: person.id,
        firstName: editData.firstName,
        lastName: editData.lastName,
      },
      onCompleted: () => {
        setIsEditing(false);
      },
    });
  };

  return (
    <Card
      style={{
        border: "1px solid black",
        padding: "10px",
        marginBottom: "10px",
      }}
      title={
        <div>
          {isEditing ? "Edit Person" : `${person.firstName} ${person.lastName}`}
        </div>
      }
      extra={
        isEditing ? (
          <>
            <Button type="primary" onClick={submitEdit}>
              Submit
            </Button>
            <Button onClick={() => setIsEditing(false)}>Cancel</Button>
          </>
        ) : (
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Button
              onClick={() => setIsEditing(true)}
              icon={<EditOutlined />}
            />
            <Button danger onClick={handleDelete} icon={<DeleteOutlined />} />
          </div>
        )
      }
    >
      {isEditing ? (
        <Form>
          <Form.Item label="First Name">
            <Input
              name="firstName"
              value={editData.firstName}
              onChange={handleEditChange}
            />
          </Form.Item>
          <Form.Item label="Last Name">
            <Input
              name="lastName"
              value={editData.lastName}
              onChange={handleEditChange}
            />
          </Form.Item>
        </Form>
      ) : (
        person.cars.map((car) => <CarCard key={car.id} car={car} />)
      )}
      {!isEditing && <a href={`/person/${person.id}`}>Learn More</a>}
    </Card>
  );
};

export default PersonCard;
