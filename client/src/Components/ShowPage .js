import React from "react";
import { useQuery } from "@apollo/client";
import { GET_PERSON_WITH_CARS } from "../graphql/queries";
import { useParams, Link } from "react-router-dom";

const ShowPage = () => {
  const { id } = useParams();
  const { data, loading, error } = useQuery(GET_PERSON_WITH_CARS, {
    variables: { id },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const person = data.getPerson;

  return (
    <div>
      <h2>
        {person.firstName} {person.lastName}
      </h2>
      {person.cars.map((car) => (
        <div key={car.id}>
          <p>
            {car.year} {car.make} {car.model} - ${car.price}
          </p>
        </div>
      ))}
      <Link to="/">Go Back Home</Link>
    </div>
  );
};

export default ShowPage;
