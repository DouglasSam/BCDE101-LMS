/**
 * @class HomeView
 * @classdesc Handles the view for the home page/first loading page
 * @author Samuel Douglas
 * @copyright Samuel Douglas
 */
class HomeView {

    /**
     * Renders the home page, will display a welcome message if a user is logged in
     * otherwise will display a login form
     * @param loggedInUser
     */
    render(loggedInUser) {
        let homeHTML = "<h2>Welcome to the Library Management System</h2>";
        if (loggedInUser) {
            homeHTML += `<p>${loggedInUser.name} you are signed in, please use the navigation to access the system</p>`;
        } else {
            homeHTML += "<p>Please log in to access the system</p>";
            homeHTML += `
            <h2>Login</h2>
            <form id="login-form">
                <div class="form-floating">
                  <input type="email" class="form-control" id="email" placeholder="ēmail@email.com">
                  <label for="email">Email</label>
                </div>
                <div class="form-floating">
                  <input type="password" class="form-control" id="password" placeholder="Password">
                  <label for="password">Password</label>
                </div>
            
                <div class="checkbox mb-3">
                  <label>
                    <input type="checkbox" id="remember-me"> Remember me
                  </label>
                </div>
                <p id="invalid-login" class="text-danger" hidden>Invalid Email , Password, or Permissions, Please try again or contact your administrator.</p>
                <button class="w-100 btn btn-lg btn-primary" type="submit">Sign in</button>
              </form>
            `;
        }
        document.getElementById("main").innerHTML = homeHTML;
    }

}
