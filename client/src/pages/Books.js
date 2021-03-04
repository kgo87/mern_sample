import React, { useState, useEffect } from "react";
import Jumbotron from "../components/Jumbotron";
import DeleteBtn from "../components/DeleteBtn";
import { Col, Row, Container } from "../components/Grid";
import { List, ListItem } from "../components/List";
import { Input, TextArea, FormBtn } from "../components/Form";
import API from "../utils/API"

function Books() {
  // Initialize books as an empty array
    const [books, setBooks] = useState([]);
    const [formObject, setFormObject] = useState({})
  
    useEffect(() => {
      loadBooks();
    }, []);

    function loadBooks() {
      API.getBooks().then(({data}) => setBooks(data))
      .catch(err => console.log(err))
      // Add code here to get all books from the database and store them using setBooks
    }

    function deleteBook(id) {
      API.deleteBook(id)
        .then(res => loadBooks())
        .catch(err => console.log(err));
    }

    function handleInputChange(event) {
      const { name, value } = event.target;
      setFormObject({...formObject, [name]: value})
    };

    function handleFormSubmit(event) {
      event.preventDefault();
      if (formObject.title && formObject.author) {
        API.saveBook({
          title: formObject.title,
          author: formObject.author,
          synopsis: formObject.synopsis
        })
          .then(res => loadBooks())
          .catch(err => console.log(err));
      }
    };

    return (
      <Container fluid>
        <Row>
          <Col size="md-6">
            <Jumbotron>
              <h1>What Books Should I Read?</h1>
            </Jumbotron>
            <form>
              <Input onChange = {handleInputChange} name="title" placeholder="Title (required)" />
              <Input onChange = {handleInputChange} name="author" placeholder="Author (required)" />
              <TextArea onChange = {handleInputChange} name="synopsis" placeholder="Synopsis (Optional)" />
              <FormBtn disabled={!(formObject.author && formObject.title)}
              onClick = {handleFormSubmit}>Submit Book</FormBtn>
            </form>
          </Col>
          <Col size="md-6 sm-12">
            <Jumbotron>
              <h1>Books On My List</h1>
            </Jumbotron>
            {books.length ? (
              <List>
                {books.map(book => (
                  <ListItem key={book._id}>
                    <a href={"/books/" + book._id}>
                      <strong>
                        {book.title} by {book.author}
                      </strong>
                    </a>
                    <DeleteBtn onClick = {() => deleteBook(book._id)} />
                  </ListItem>
                ))}
              </List>
            ) : (
              <h3>No Results to Display</h3>
            )}
          </Col>
        </Row>
      </Container>
    );
  }

export default Books;
