import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { ADD_CAR } from "../graphql/mutations";
import { GET_ALL_PEOPLE } from "../graphql/queries";

const CarForm = () => {
  const styles = getStyles();
  const [formData, setFormData] = useState({
    year: "",
    make: "",
    model: "",
    price: "",
    personId: "",
  });

  const [addCar, { loading: addingCar, error: addCarError }] = useMutation(
    ADD_CAR,
    {
      refetchQueries: [{ query: GET_ALL_PEOPLE }],
    }
  );

  const {
    data: peopleData,
    loading: loadingPeople,
    error: peopleError,
  } = useQuery(GET_ALL_PEOPLE);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const year = parseInt(formData.year);
      const price = parseFloat(formData.price);

      if (isNaN(year) || isNaN(price)) {
        throw new Error("Year and price must be valid numbers");
      }

      await addCar({
        variables: {
          year,
          make: formData.make,
          model: formData.model,
          price,
          personId: formData.personId,
        },
      });
      setFormData({ year: "", make: "", model: "", price: "", personId: "" });
    } catch (error) {
      console.error("Error adding car:", error);
    }
  };

  if (loadingPeople) return <p>Loading people...</p>;
  if (peopleError) return <p>Error loading people: {peopleError.message}</p>;

  return (
    <div>
      <h2 style={{ textAlign: "center" }}>Add Car</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <label htmlFor="year">Year</label>
        <input
          name="year"
          placeholder="Year"
          value={formData.year}
          onChange={handleInputChange}
          style={styles.input}
        />
        <label htmlFor="Make">Year</label>
        <input
          name="make"
          placeholder="Make"
          value={formData.make}
          onChange={handleInputChange}
          style={styles.input}
        />
        <label htmlFor="year">Model</label>
        <input
          name="model"
          placeholder="Model"
          value={formData.model}
          onChange={handleInputChange}
          style={styles.input}
        />
        <label htmlFor="year">Price</label>
        <input
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleInputChange}
          style={styles.input}
        />
        <label htmlFor="personId">Person</label>
        <select
          name="personId"
          value={formData.personId}
          onChange={handleInputChange}
          required
          style={styles.input}
        >
          <option value="">Select a Person</option>
          {peopleData.allPeople.map((person) => (
            <option key={person.id} value={person.id}>
              {person.firstName} {person.lastName}
            </option>
          ))}
        </select>
        <button
          type="submit"
          disabled={
            !formData.make ||
            !formData.model ||
            !formData.personId ||
            !formData.price ||
            !formData.year
          }
        >
          Add Car
        </button>
      </form>
      {addingCar && <p>Adding car...</p>}
      {addCarError && <p>Error adding car: {addCarError.message}</p>}
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

export default CarForm;
