import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { ADD_PERSON } from "../graphql/mutations";
import { GET_ALL_PEOPLE } from "../graphql/queries";

const PersonForm = () => {
  const styles = getStyles();
  const [formData, setFormData] = useState({ firstName: "", lastName: "" });

  const [addPerson, { loading, error }] = useMutation(ADD_PERSON, {
    variables: {
      firstName: formData.firstName,
      lastName: formData.lastName,
    },
    optimisticResponse: {
      __typename: "Mutation",
      addPerson: {
        __typename: "People",
        id: "temp-id",
        firstName: formData.firstName,
        lastName: formData.lastName,
        cars: [],
      },
    },
    update: (cache, { data: { addPerson } }) => {
      const existingPeople = cache.readQuery({ query: GET_ALL_PEOPLE });
      cache.writeQuery({
        query: GET_ALL_PEOPLE,
        data: {
          allPeople: existingPeople
            ? existingPeople.allPeople.concat([addPerson])
            : [addPerson],
        },
      });
    },

    refetchQueries: [{ query: GET_ALL_PEOPLE }],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addPerson();
      setFormData({ firstName: "", lastName: "" });
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) return <p>Submitting...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1 style={{ textAlign: "center" }}>PEOPLE AND THEIR CARS</h1>

      <h2 style={{ textAlign: "center" }}>Add Person</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <label htmlFor="firstName">FirstName: </label>
        <input
          name="firstName"
          type="text"
          placeholder="FirstName"
          value={formData.firstName}
          onChange={handleInputChange}
          required
          style={styles.input}
        />
        <label htmlFor="lastName">LastName: </label>
        <input
          name="lastName"
          type="text"
          placeholder="LastName"
          value={formData.lastName}
          onChange={handleInputChange}
          required
          style={styles.input}
        />
        <button
          type="submit"
          disabled={!formData.firstName || !formData.lastName}
        >
          Add Person
        </button>
      </form>
    </div>
  );
};

const getStyles = () => ({
  form: {
    textAlign: "center",
    border: "2px solid #ddd",
    borderRadius: "5px",
    padding: "20px",
  },
  input: {
    margin: "5px",
  },
});

export default PersonForm;
