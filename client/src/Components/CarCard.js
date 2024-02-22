import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { UPDATE_CAR } from "../graphql/mutations";
import { Card, Button, Input, Form } from "antd";
import { DELETE_CAR } from "../graphql/mutations";
import { GET_ALL_PEOPLE } from "../graphql/queries";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

const CarCard = ({ car, refetch }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    year: car.year,
    make: car.make,
    model: car.model,
    price: car.price,
  });
  const [deleteCar] = useMutation(DELETE_CAR, {
    variables: { id: car.id },
    refetchQueries: [{ query: GET_ALL_PEOPLE }],
  });

  const handleDelete = () => {
    deleteCar();
  };

  const [updateCar] = useMutation(UPDATE_CAR, {
    onCompleted: () => {
      setIsEditing(false);
      if (refetch) refetch();
    },
  });

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const submitEdit = () => {
    updateCar({
      variables: {
        id: car.id,
        year: parseInt(editData.year, 10),
        make: editData.make,
        model: editData.model,
        price: parseFloat(editData.price),
      },
    });
  };
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Card
      type="inner"
      title={
        isEditing
          ? "Edit Car"
          : `${car.year} ${car.make} ${car.model} -> ${formatCurrency(
              car.price
            )}`
      }
      style={{ border: "1px solid black", margin: "10px" }}
    >
      {isEditing ? (
        <Form>
          <Form.Item label="Year">
            <Input
              name="year"
              value={editData.year}
              onChange={handleEditChange}
            />
          </Form.Item>
          <Form.Item label="Make">
            <Input
              name="make"
              value={editData.make}
              onChange={handleEditChange}
            />
          </Form.Item>
          <Form.Item label="Model">
            <Input
              name="model"
              value={editData.model}
              onChange={handleEditChange}
            />
          </Form.Item>
          <Form.Item label="Price">
            <Input
              name="price"
              value={editData.price}
              onChange={handleEditChange}
            />
          </Form.Item>
          <Button type="primary" onClick={submitEdit}>
            Submit
          </Button>
          <Button onClick={() => setIsEditing(false)}>Cancel</Button>
        </Form>
      ) : (
        <div style={{ display: "flex", justifyContent: "space-evenly" }}>
          <Button onClick={() => setIsEditing(true)} icon={<EditOutlined />} />
          <Button danger onClick={handleDelete} icon={<DeleteOutlined />} />
        </div>
      )}
    </Card>
  );
};

export default CarCard;
