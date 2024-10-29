/**
 * @class HomeController
 * @classDesc Class that handles the home page, no logic just a view
 * @property {HomeView} view - The view for the controller
 * @constructor - Creates a new HomeController
 * @author Samuel Douglas
 * @copyright Samuel Douglas
 */
class HomeController {

    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.logoutButton = document.getElementById('logout-btn');
    }

    /**
     * Sets the current view for the controller
     * Will display the login form if no user is logged in
     * Will display the home page if a user is logged in
     * Also handles displaying the nav and logout button
     */
    setCurrentView() {
        this.view.render(this.model.session.loggedInUser);
        if (this.model.session.loggedInUser) {
            //user is logged in
            this.logoutButton.hidden = false;
            document.getElementById("nav").hidden = false;
        }
        else {
            this.logoutButton.hidden = true;
            document.getElementById("nav").hidden = true;
            const loginForm = document.getElementById('login-form');
            loginForm.addEventListener('submit', this.handleLogin.bind(this));
        }

    }

    /**
     * EventListener for handling the login form
     * Will either log the user in and display a welcome page or display an error message in the form
     * @param event - event for the listener
     * @returns {Promise<void>} returns a promise
     */
    async handleLogin(event) {
        event.preventDefault();
        const email = document.getElementById('email').value;
        const rememberMe = document.getElementById('remember-me').checked;
        const password = document.getElementById('password').value;
        const errorTag = document.getElementById('invalid-login');

        if (this.model.logInUser(email, password, rememberMe)) {
            this.setCurrentView()
        } else {
            errorTag.hidden = false;
        }

    }

}