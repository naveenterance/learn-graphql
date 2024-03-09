import React, { useState } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";

const GET_STUDENTS = gql`
  query {
    students {
      id
      firstName
      lastName
      age
    }
  }
`;

const CREATE_STUDENT = gql`
  mutation CreateStudent($firstName: String!, $lastName: String!, $age: Int!) {
    create(firstName: $firstName, lastName: $lastName, age: $age) {
      id
      firstName
      lastName
      age
    }
  }
`;

const UPDATE_STUDENT = gql`
  mutation UpdateStudent(
    $id: ID!
    $firstName: String!
    $lastName: String!
    $age: Int!
  ) {
    update(id: $id, firstName: $firstName, lastName: $lastName, age: $age) {
      id
      firstName
      lastName
      age
    }
  }
`;

const DELETE_STUDENT = gql`
  mutation DeleteStudent($id: ID!) {
    delete(id: $id) {
      id
      firstName
      lastName
      age
    }
  }
`;

const Students = () => {
  const { loading, error, data } = useQuery(GET_STUDENTS);
  const [createStudent] = useMutation(CREATE_STUDENT);
  const [updateStudent] = useMutation(UPDATE_STUDENT);
  const [deleteStudent] = useMutation(DELETE_STUDENT);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    age: "",
  });

  const handleCreateStudent = async () => {
    try {
      const ageValue = parseInt(formData.age, 10); // Parse age as integer
      await createStudent({
        variables: { ...formData, age: ageValue }, // Pass parsed age value
        refetchQueries: [{ query: GET_STUDENTS }],
      });
      setFormData({ firstName: "", lastName: "", age: "" }); // Clear form after submission
    } catch (error) {
      console.error("Error creating student:", error);
    }
  };

  const handleUpdateStudent = async (id, firstName, lastName, age) => {
    try {
      const ageValue = parseInt(age, 10); // Parse age as integer
      await updateStudent({
        variables: { id, firstName, lastName, age: ageValue }, // Pass parsed age value
        refetchQueries: [{ query: GET_STUDENTS }],
      });
    } catch (error) {
      console.error("Error updating student:", error);
    }
  };

  const handleDeleteStudent = async (id) => {
    try {
      await deleteStudent({
        variables: { id },
        refetchQueries: [{ query: GET_STUDENTS }],
      });
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h2>Create Student</h2>
      <input
        type="text"
        name="firstName"
        value={formData.firstName}
        placeholder="First Name"
        onChange={handleChange}
      />
      <input
        type="text"
        name="lastName"
        value={formData.lastName}
        placeholder="Last Name"
        onChange={handleChange}
      />
      <input
        type="number"
        name="age"
        value={formData.age}
        placeholder="Age"
        onChange={handleChange}
      />
      <button onClick={handleCreateStudent}>Create Student</button>

      <h2>All Students</h2>
      <ul>
        {data.students.map((student) => (
          <li key={student.id}>
            {student.firstName} {student.lastName}, Age: {student.age}
            <button
              onClick={() =>
                handleUpdateStudent(student.id, "Updated", "Name", 25)
              }
            >
              Update
            </button>
            <button onClick={() => handleDeleteStudent(student.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Students;
