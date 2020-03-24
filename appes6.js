//ES6 - version - CLASSES

//the constructors from app.js will be classes

class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

//in the UI class we put the methods to deal with the user interface
class UI {
  addBookToList(book) {
    const list = document.getElementById('book-list');

    //Create tr element
    const row = document.createElement('tr');

    //Insert columns
    row.innerHTML = `
    <td>${book.title}</td>
    <td>${book.author}</td>
    <td>${book.isbn}</td>
    <td><a href="#"  class="delete">X<a></td>
    `;

    //we can acces ${book.} because we passed book into the prototype method:
    // UI.prototype.addBookToList = function(book)

    //we need to append it to the list
    list.appendChild(row);
  }

  showAlert(message, className) {
    //Create div
    const div = document.createElement('div');

    //Add class names
    div.className = `alert ${className}`; //add the alert class but also the className that is passed in in the param: function(message, className)

    //Add text
    div.appendChild(document.createTextNode(message)); //we create the text inside - that is the message passed in as a param: function(message, className)

    //we need to insert it into the DOM
    //Get parent
    const container = document.querySelector('.container');

    const form = document.querySelector('#book-form');

    //Insert alert befor form - the div is the alert
    container.insertBefore(div, form); // (first param is what we want to insert, second param is before what we want to insert it)

    //TimeOut after 3s  - we remove the alert class after 3s - clears the alert
    setTimeout(function() {
      document.querySelector('.alert').remove();
    }, 1500);
  }

  deleteBook(target) {
    if (target.className === 'delete') {
      //target is the <a> inside the <td> , we want to go to it's parent <td>, then to <td> parent which is the <tr> - the <tr> is the el we want to del
      //this is basic DOM traversing

      target.parentElement.parentElement.remove();
    }
  }
  clearFields() {
    document.getElementById('title').value = '';
    document.getElementById('author').value = '';
    document.getElementById('isbn').value = '';
  }
}

//ADDING LOCAL STORAGE
//we make all the classes static - meaning we don't have to instantiate the storage - we can just use it directly

//Local Storage Class

class Store {
  static getBooks() {
    //fetching them from Local Storage
    let books;
    if (localStorage.getItem('books') === null) {
      books = [];
    } else {
      //books needs to be JS objs so we need to parse it with JSON.parse
      books = JSON.parse(localStorage.getItem('books'));
    }
    return books;
    //whenver we need to get what is in the Local Storage, now we can use getBooks
  }

  static displayBooks() {
    //displaying the books in the UI

    //fist we need to get the books
    const books = Store.getBooks();

    books.forEach(function(book) {
      //after we get the books -we need to put it into the UI -
      //we have a class  called UI that has a method addBookToList
      //so we can instantiate that class
      const ui = new UI();

      //Add book to UI
      ui.addBookToList(book);
    });
  }

  static addBook(book) {
    //add books to Local Storage}

    //we get the books
    const books = Store.getBooks();
    //we use the class name Store because its a static method  - don't have to instantiate

    books.push(book); //we .push into the books the book param

    localStorage.setItem('books', JSON.stringify(books));
    //to add the book in Local Storage we have to run in through JSON.strigify

    //after we add the book to Local Storage we need to display it in the UI
  }

  static removeBook(isbn) {
    //get the books form Local Storage
    const books = Store.getBooks();
    books.forEach(function(book, index) {
      if (book.isbn === isbn) {
        books.splice(1); // index -the second param lets use del by index
      }
    });
    //we set the Local Storage the new books list
    localStorage.setItem('books', JSON.stringify(books));
  }
}

//Event Listeners

//DOM Load Event
document.addEventListener('DOMContentLoaded', Store.displayBooks);
//when DOM loaded we display the books stored in Local Storage

//Event Listener for add book
document.getElementById('book-form').addEventListener('submit', function(e) {
  //get the <form> values

  const title = document.getElementById('title').value,
    author = document.getElementById('author').value,
    isbn = document.getElementById('isbn').value;

  //Instatiate a book
  const book = new Book(title, author, isbn);

  //we want to add a book to the list -UI will do that
  //Instantiate a UI obj
  const ui = new UI();

  //console.log(ui);     <- SAME CLASS METHODS INSIDE THE PROTOTYPE OBJ
  //                        SO UNDER THE HOOD THINGS HAPPEN THE SAME WAY
  //                        WITH CLASSES BS PROTOTYPRE
  // UI {}
  //      __proto__:
  //            addBookToList: ƒ (book)
  //            showAlert: ƒ (message, className)
  //            deleteBook: ƒ (target)
  //            clearFields: ƒ ()
  //            constructor: ƒ UI()
  //            __proto__: Object

  //Validate  - avoid adding empty book info to the list

  if (title === '' || author === '' || isbn === '') {
    //Error alert  - we add .error class
    ui.showAlert('Please fill in all fields', 'error');
  } else {
    //Add book to the List
    ui.addBookToList(book);

    //Add to Local Storage
    //store the books because on refresh/reload they list goes away
    //we don't need to instantiate it because is static
    Store.addBook(book);

    //Show succes - when added the book to the list - we add the succes class
    ui.showAlert('Book Added', 'success');

    //Clear fields - after the book was added to the list
    ui.clearFields();
  }

  console.log(ui);
  //   UI {}
  //        __proto__:
  //        addBookToList: ƒ (book)    <- method is now part of the obj prototype
  //        constructor: ƒ UI()
  //        __proto__: Object

  console.log(title, author, isbn);

  e.preventDefault();
});

//Event Delegation
//if we have something that is going to show up more than once -[ with the same class ]- or something that is not there when the page loads  -[ but it’s dynamically added ] - we have to use event delegation
//ex the x for the list of books - to rem books from the list

//Event listener for delete

//we use a parent not the delete class - the book-list parent class
document.getElementById('book-list').addEventListener('click', function(e) {
  //we need to target the x delete -
  //we do that from a prototype method of the UI

  //we need to instantiate the UI
  //Instantiate a UI obj
  const ui = new UI();

  //Delete book
  ui.deleteBook(e.target);

  //Remove Book from Local Storage

  //we use the isbn to del the book - using DOM to get the isbn
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
  //e.target is the icon that gets clicked
  //previous El sibl is the isbn -and to get its content: .textContent

  //Show alert - when delete
  ui.showAlert('Book removed', 'success'); //m(message, class to color the alert)

  e.preventDefault();
});
