class Notification {

    #notificationId;
    #user;
    #message;
    #status;

    constructor(notificationId, user, message, status) {
        this.#notificationId = notificationId;
        this.#user = user;
        this.#message = message;
        this.#status = status;
    }

    sendOverdueNotification() {
        /*
         * Ideally this would talk to a backend server and send an email or app notification etc.
         * As this is written as a client side application it is not implemented and
         * instead just prints to the console.
         */
        console.log(`Sending overdue notification to ${this.#user.email}
        Message: ${this.#message}`);
        this.#status = "Sent to user";
    }
    
    get details() {
        return {
            notificationId: this.#notificationId,
            user: this.#user,
            message: this.#message,
            status: this.#status,
        }
    }

}