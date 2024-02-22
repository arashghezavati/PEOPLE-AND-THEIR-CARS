import { gql } from "@apollo/client";

export const GET_ALL_PEOPLE = gql`
  query GetAllPeople {
    allPeople {
      id
      firstName
      lastName
      cars {
        id
        year
        make
        model
        price
      }
    }
  }
`;

export const GET_PERSON_WITH_CARS = gql`
  query GetPersonWithCars($id: String!) {
    getPerson(id: $id) {
      id
      firstName
      lastName
      cars {
        id
        year
        make
        model
        price
      }
    }
  }
`;
