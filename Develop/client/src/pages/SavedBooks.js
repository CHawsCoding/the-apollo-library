import React from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_ME } from "../graphql/queries";
import { REMOVE_BOOK } from "../graphql/mutations";
import { Card, Button, Row, Col } from "react-bootstrap"; // Import Row and Col from react-bootstrap

const SavedBooks = () => {
  const { loading, data } = useQuery(GET_ME);
  const [removeBook] = useMutation(REMOVE_BOOK);

  const userData = data?.me;

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!userData?.savedBooks?.length) {
    return <h2>No saved books!</h2>;
  }

  const handleRemoveBook = async (bookId) => {
    try {
      const { data } = await removeBook({
        variables: { bookId },
      });

      if (data) {
        console.log("Book removed:", data.removeBook);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <h2>Saved Books</h2>
      <Row>
        {userData.savedBooks.map((book) => (
          <Col key={book.bookId} md={4}>
            {/* Use Col to create columns */}
            <Card border="dark">
              {book.image && (
                <Card.Img
                  src={book.image}
                  alt={`The cover for ${book.title}`}
                  variant="top"
                />
              )}
              <Card.Body>
                <Card.Title>{book.title}</Card.Title>
                <p className="small">Authors: {book.authors.join(", ")}</p>
                <Card.Text>{book.description}</Card.Text>
                <Button
                  className="btn-block btn-danger"
                  onClick={() => handleRemoveBook(book.bookId)}
                >
                  Delete this Book!
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
};

export default SavedBooks;
