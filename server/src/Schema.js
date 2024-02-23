import { gql } from "graphql-tag";
import lodash from "lodash";

const { find } = lodash;

let people = [
  {
    id: "1",
    firstName: "Bill",
    lastName: "Gates",
  },
  {
    id: "2",
    firstName: "Steve",
    lastName: "Jobs",
  },
  {
    id: "3",
    firstName: "Linux",
    lastName: "Torvalds",
  },
];

let cars = [
  {
    id: "1",
    year: "2019",
    make: "Toyota",
    model: "Corolla",
    price: "40000",
    personId: "1",
  },
  {
    id: "2",
    year: "2018",
    make: "Lexus",
    model: "LX 600",
    price: "13000",
    personId: "1",
  },
  {
    id: "3",
    year: "2017",
    make: "Honda",
    model: "Civic",
    price: "20000",
    personId: "1",
  },
  {
    id: "4",
    year: "2019",
    make: "Acura ",
    model: "MDX",
    price: "60000",
    personId: "2",
  },
  {
    id: "5",
    year: "2018",
    make: "Ford",
    model: "Focus",
    price: "35000",
    personId: "2",
  },
  {
    id: "6",
    year: "2017",
    make: "Honda",
    model: "Pilot",
    price: "45000",
    personId: "2",
  },
  {
    id: "7",
    year: "2019",
    make: "Volkswagen",
    model: "Golf",
    price: "40000",
    personId: "3",
  },
  {
    id: "8",
    year: "2018",
    make: "Kia",
    model: "Sorento",
    price: "45000",
    personId: "3",
  },
  {
    id: "9",
    year: "2017",
    make: "Volvo",
    model: "XC40",
    price: "55000",
    personId: "3",
  },
];

export const typeDefs = gql`
  type People {
    id: String!
    firstName: String!
    lastName: String!
    cars: [Car]
  }

  type Car {
    id: String!
    year: Int!
    make: String!
    model: String!
    price: Float!
    personId: String!
    owner: People
  }

  type Query {
    allPeople: [People]
    getPerson(id: String!): People
    allCars: [Car]
    getCar(id: String!): Car
  }

  type Mutation {
    addPerson(firstName: String!, lastName: String!): People
    updatePerson(id: String!, firstName: String, lastName: String): People
    deletePerson(id: String!): People
    addCar(
      year: Int!
      make: String!
      model: String!
      price: Float!
      personId: String!
    ): Car
    updateCar(
      id: String!
      year: Int
      make: String
      model: String
      price: Float
      personId: String
    ): Car
    deleteCar(id: String!): Car
  }
`;

export const resolvers = {
  Query: {
    allPeople: () => people,
    getPerson: (parent, { id }) => find(people, { id }),
    allCars: () => cars,
    getCar: (parent, { id }) => find(cars, { id }),
  },
  Mutation: {
    addPerson: (parent, { firstName, lastName }) => {
      const newPerson = { id: String(people.length + 1), firstName, lastName };
      people.push(newPerson);
      return newPerson;
    },
    updatePerson: (parent, { id, firstName, lastName }) => {
      const person = find(people, { id });
      if (!person) throw new Error("Person not found");
      if (firstName) person.firstName = firstName;
      if (lastName) person.lastName = lastName;
      return person;
    },
    deletePerson: (parent, { id }) => {
      const personIndex = people.findIndex((p) => p.id === id);
      if (personIndex === -1) throw new Error("Person not found");
      const deletedPerson = people.splice(personIndex, 1)[0];
      cars = cars.filter((car) => car.personId !== id); 
      return deletedPerson;
    },
    addCar: (parent, { year, make, model, price, personId }) => {
      const newCar = {
        id: String(cars.length + 1),
        year,
        make,
        model,
        price,
        personId,
      };
      cars.push(newCar);
      return newCar;
    },
    updateCar: (parent, { id, year, make, model, price, personId }) => {
      const car = find(cars, { id });
      if (!car) throw new Error("Car not found");
      if (year) car.year = year;
      if (make) car.make = make;
      if (model) car.model = model;
      if (price) car.price = price;
      if (personId) car.personId = personId;
      return car;
    },
    deleteCar: (parent, { id }) => {
      const carIndex = cars.findIndex((car) => car.id === id);
      if (carIndex === -1) throw new Error("Car not found");
      const deletedCar = cars.splice(carIndex, 1)[0];
      return deletedCar;
    },
  },
  People: {
    cars: (parent) => cars.filter((car) => car.personId === parent.id),
  },
  Car: {
    owner: (parent) => find(people, { id: parent.personId }),
  },
};
