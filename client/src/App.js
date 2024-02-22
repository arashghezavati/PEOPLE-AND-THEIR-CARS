import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PersonForm from "./Components/PersonForm";
import CarForm from "./Components/CarForm";

import { useQuery } from "@apollo/client";
import { GET_ALL_PEOPLE } from "./graphql/queries";
import PersonCard from "./Components/PersonCard";
import PersonDetails from "./Components/PersonDetails ";

function App() {
  const { data, loading, error } = useQuery(GET_ALL_PEOPLE);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <Router>
      <div>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <PersonForm />
                <CarForm />
                {data.allPeople.map((person) => (
                  <PersonCard
                    key={person.id}
                    person={person}
                    onEdit={() => {}}
                    onDelete={() => {}}
                  />
                ))}
              </>
            }
          />
          <Route path="/person/:id" element={<PersonDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
