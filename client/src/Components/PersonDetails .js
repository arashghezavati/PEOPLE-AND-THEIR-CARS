import React from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_PERSON_WITH_CARS } from "../graphql/queries";
import styled from "styled-components";

const DetailsContainer = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: #fff;
`;

const Title = styled.h2`
  color: #333;
  text-align: center;
  font-size: 2rem;
  margin-bottom: 1.5rem;
`;

const CarList = styled.div`
  margin-bottom: 2rem;
`;

const CarItem = styled.div`
  padding: 0.5rem 0;
  border-bottom: 1px solid #eee;
  &:last-child {
    border-bottom: none;
  }
`;

const CarInfo = styled.p`
  font-size: 1.2rem;
  color: #666;
  margin: 0.5rem 0;
`;

const BackLink = styled(Link)`
  display: inline-block;
  margin-top: 1rem;
  text-decoration: none;
  background-color: #007bff;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #0056b3;
  }
`;

const PersonDetails = () => {
  const { id } = useParams();
  const { data, loading, error } = useQuery(GET_PERSON_WITH_CARS, {
    variables: { id },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <DetailsContainer>
      <Title>
        {data.getPerson.firstName} {data.getPerson.lastName}
      </Title>
      <CarList>
        {data.getPerson.cars.map((car) => (
          <CarItem key={car.id}>
            <CarInfo>
              {car.year} {car.make} {car.model} - ${car.price}
            </CarInfo>
          </CarItem>
        ))}
      </CarList>
      <BackLink to="/">Go Back Home</BackLink>
    </DetailsContainer>
  );
};

export default PersonDetails;
