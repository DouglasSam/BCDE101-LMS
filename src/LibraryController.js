// Controller: Handles user input and updates Model/View
class CatalogueManagementController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
    }
    
    setCurrentView() {
        this.view.render();
        // DOM Elements
        this.bookForm = document.getElementById('book-form');
        this.searchInput = document.getElementById('search');
        this.dataSet = document.getElementById('dataSet');
        this.reset = document.getElementById('reset');

        // Bind event listeners
        this.bookForm.addEventListener('submit', this.handleAddBook.bind(this));
        this.searchInput.addEventListener('input', this.handleSearch.bind(this));
        this.dataSet.addEventListener('click', this.handleLoadBooksFromDataSet.bind(this));
        this.reset.addEventListener('click', this.handleResetBooks.bind(this));

        // Initial render
        this.view.updateBookTable(this.model.getBooks());
        this.addUpdateButtonListeners();
    }
    
    handleResetBooks(event) {
        event.preventDefault();
        if (confirm(`Are you sure you want to permanently delete ALL books?`)) {
            this.model.clearAllBooks();
            this.view.updateBookTable(this.model.getBooks());
        }
    }

    handleLoadBooksFromDataSet(event) {
        event.preventDefault();
        if (confirm(`Are you sure you want to replace ALL books with those defined in the starting data set?`)) {
            this.model.clearAllBooks();
            this.model.resetBooksFromDataSet().then(() => {
                this.view.updateBookTable(this.model.getBooks());
                this.addUpdateButtonListeners();
            });
        }
    }
    
    handleAddBook(event) {
        event.preventDefault();
        const title = document.getElementById('title').value;
        const author = document.getElementById('author').value;
        const isbn = document.getElementById('isbn').value;
        let genre = document.getElementById('genre').value;
        let location = document.getElementById('location').value;
        const description = document.getElementById('description').value;
        console.log(title, author, isbn, genre, location, description);
        if (genre === '') genre = 'N/A';
        if (location === '') location = 'N/A';
        this.model.addBook(title, author, isbn, genre, location, description);

        this.view.clearForm();
        this.view.updateBookTable(this.model.getBooks());
        this.addUpdateButtonListeners();
    }

    handleSearch() {
        const query = this.searchInput.value;
        const filteredBooks = this.model.searchBooks({query: query});
        this.view.updateBookTable(filteredBooks);
        this.addUpdateButtonListeners();
    }

    addUpdateButtonListeners() {
        const updateButtons = document.querySelectorAll('.update-btn');
        updateButtons.forEach(button => {
            button.addEventListener('click', this.handleEditBook.bind(this));
        });
    }

    handleEditBook(event) {
        const rowID = event.target.getAttribute('data-row-id');
        // TODO Probably need to update when using IDs
        const isbn = event.target.getAttribute('data-isbn');
        const book = this.model.getBooks().find(book => book.isbn === isbn);

        this.view.changeToEditMode(rowID, book);
        this.addEditUpdateButtonListeners();
        this.addEditRemoveButtonListeners()
    }
    
    handleUpdateBook(event) {
        event.preventDefault();
        const rowID = event.target.attributes.item(2).value;
        const newTitle = document.getElementById(`title-${rowID}`).value;
        const newAuthor = document.getElementById(`author-${rowID}`).value;
        const newISBN = document.getElementById(`isbn-${rowID}`).value;
        const newAvailability = document.getElementById(`availability-${rowID}`).checked;
        this.model.updateBook(newTitle, newAuthor, newISBN, newAvailability);
        const newBook = this.model.getBooks().find(book => book.isbn === newISBN);  
        this.view.changeToViewMode(rowID, newBook);
        this.addUpdateButtonListeners();
    }
    
    handleRemoveBook(event) {
        event.preventDefault();
        const id = event.target.attributes.item(2).value;
        const book = this.model.catalogue.searchBooks({id: id})[0];
        
        console.log(book);
        if (confirm(`Are you sure you want to permanently delete ${book.title} by ${book.author }?`)) {
            this.model.removeBook(id);
            this.view.updateBookTable(this.model.getBooks());
            this.addUpdateButtonListeners();
        }
    }
    
    addEditUpdateButtonListeners() {
        const updateButtons = document.querySelectorAll('.update');
        updateButtons.forEach(button => {
            button.addEventListener('click', this.handleUpdateBook.bind(this));
        });
    }
    
    addEditRemoveButtonListeners() {
        const updateButtons = document.querySelectorAll('.remove');
        updateButtons.forEach(button => {
            button.addEventListener('click', this.handleRemoveBook.bind(this));
        });
    }
}

class UserManagementController {
    
    constructor(model, view) {
        this.model = model;
        this.view = view;
    }
    
    setCurrentView() {
        this.view.render();
    }
    
}

class BorrowReturnController {

    constructor(model, view) {
        this.model = model;
        this.view = view;
    }

    setCurrentView() {
        this.view.render();
        
        const searchToggleButton = document.getElementById("search-toggle");
        console.log(searchToggleButton)
        
        searchToggleButton.addEventListener('click', this.toggleSearchForm.bind(this))
    }

    toggleSearchForm(event) {
        console.log("in this event")
        event.preventDefault();
        this.model.toggleSearchMode();
        if (this.model.searchMode === 'simple') this.view.simpleSearch();
        else this.view.complexSearch();
    }
}

class SearchController {
    
    constructor(model, view) {
        this.model = model;
        this.view = view;
    }

    setCurrentView() {
        this.view.render(this.model.getBooks().length, this.model.searchMode);
        const searchToggleButton = document.getElementById("search-toggle");

        searchToggleButton.addEventListener('click', this.toggleSearchForm.bind(this));
        this.handleAddSearchButtonListener()
    }

    handleAddSearchButtonListener() {
        if (this.model.searchMode === 'simple') {
            document.getElementById('simple-search-form').addEventListener('submit', this.handleSimpleSearch.bind(this));
        }
        else {
            document.getElementById('complex-search-form').addEventListener('submit', this.handleComplexSearch.bind(this));
        }
    }

    toggleSearchForm(event) {
        event.preventDefault();
        this.model.toggleSearchMode();
        if (this.model.searchMode === 'simple') {
            this.view.simpleSearch();
        }
        else {
            this.view.complexSearch();
        }
        this.handleAddSearchButtonListener();
    }

    handleSimpleSearch(event) {
        event.preventDefault();
        const query = document.getElementById('simple-search-input').value;
        const searchResults = this.model.searchBooks({query: query});
        if (searchResults.length === 0) {
            this.view.noBookFoundSearch(query, query, query);
        }
        else {
            this.view.validSearch(searchResults);
        }
        
    }

    handleComplexSearch(event) {
        event.preventDefault();
        const title = document.getElementById('title').value;
        const author = document.getElementById('author').value;
        const isbn = document.getElementById('isbn').value;
        const genre = document.getElementById('genre').value
        const location = document.getElementById('location').value;
        const description = document.getElementById('description').value;
        const availableOnly = document.getElementById('search-available').checked;
        // console.log(title, author, isbn, genre, location, description, availableOnly);
        const searchResults = this.model.searchBooks({
            title: title ? title : false, 
            author: author ? author : false, 
            isbn: isbn ? isbn : false, 
            genre: genre ? genre : false, 
            location: location ? location : false, 
            description: description ? description : false,
            availableOnly: availableOnly});
        if (searchResults.length === 0) {
            this.view.noBookFoundSearch(title, author, isbn, availableOnly);
        }
        else {
            this.view.validSearch(searchResults);
        }
    }
}

class HomeController {
    
    constructor(view) {
        this.view = view;
    }
    
    setCurrentView() {
        this.view.render();
    }
}

const controllers = new Map();

// On Load
document.addEventListener('DOMContentLoaded', () => {
    console.log("Document Loaded");
    const catalogue = new Catalogue();
    controllers.set('user-management', new UserManagementController(new UserManagementModel(), new UserManagementView()));
    controllers.set('catalogue-management', new CatalogueManagementController(new CatalogueManagementModel(catalogue), new CatalogueManagementView()));
    controllers.set('borrow-or-return', new BorrowReturnController(new BorrowReturnModel(), new BorrowReturnView()));
    controllers.set('catalogue-search', new SearchController(new SearchModel(catalogue), new SearchView()));
    controllers.set('home', new HomeController(new HomeView()));
    let currentPage = sessionStorage.getItem('currentPage');
    if (!currentPage) {
        currentPage = 'home';
    }
    loadPage(currentPage);
});

function loadPage(id, event) {
    if (event) {
        event.preventDefault();
    }
    console.log("Loading page: " + id);
    let controller = controllers.get(id);
    if (!controller) {
        console.error("Controller not found for page: " + id);
        controllers.get('home').setCurrentView();
        id = 'home';
    }
    controller.setCurrentView();
    sessionStorage.setItem('currentPage', id);
}

