//27:18

//Book Class: Represents a Book
class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

//UI Class: Handle UI Tasks
class UI {
    static displayBooks() {

        const books = Store.getBooks();

        books.forEach((book) => UI.addBookToList(book));
    }

    static addBookToList(book) {
        const list = document.querySelector('#book-list');

        const row = document.createElement('tr');

        row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `;

        list.appendChild(row);
    }

    static deleteBook(el) {
        if(el.classList.contains('delete')) {
            el.parentElement.parentElement.remove();
        }
    }

    static showAlert(message, className) {
        //Create Div Element
        const div = document.createElement('div');
        
        //Add bootstrap classes for styling
        div.className = `alert alert-${className}`;
        
        //Add text to the div
        div.appendChild(document.createTextNode(message));

        //Insert the div before the form in the HTML
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div, form);

        //Make alert go away in 2s
        setTimeout(() => document.querySelector('.alert').remove(), 2000);

    }

    static clearFields() {
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';
    }
}

//Store Class: Handles Local Storage 
class Store {
    static getBooks() {
        let books;

        if(localStorage.getItem('books') === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;
    }

   static addBook(book) {
    const books = Store.getBooks();

    books.push(book);

    localStorage.setItem('books', JSON.stringify(books));
    }

   static removeBook(isbn) {
        const books = Store.getBooks();

        books.forEach((book, index) => {
            if(book.isbn === isbn) {
                books.splice(index, 1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
    }
}


//Event: Display Books
document.addEventListener('DOMContentLoaded', UI.displayBooks);


//Event: Add a Book
document.querySelector('#book-form').addEventListener('submit', (e) => {
    //Prevent form from submitting
    e.preventDefault();
    
    //Get Form Values
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;

    //Validate
    if(title === '' || author === '' || isbn === '') {
        UI.showAlert('Please fill in all of the fields', 'danger');
    } else {
        //Instantiate Book
        const book = new Book(title, author, isbn);

        //Add Book to UI List
        UI.addBookToList(book);

        //Add Book to store
        Store.addBook(book);

        //Show Success Message
        UI.showAlert('Book has been successfully added', 'success');

        //Clear Fields
        UI.clearFields();
    }
  
});

//Event: Remove a Book
document.querySelector('#book-list').addEventListener('click', (e) => {
    UI.deleteBook(e.target)

    //Remove book form local storage when deleted
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);


        //Show Book Removed Message
        UI.showAlert('Book has been removed...', 'danger');
});