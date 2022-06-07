# Release

In this file, you indicate the status of your assignment by checking the checkboxes below. No unchecked checkboxes are allowed in the document when your hand in for the assessment.

## Release status

_To make a release that will be assessed by the examiner you need to make sure all checkboxes below are checked. You check a checkbox by adding a "x" within the brackets._

- [x] I have started working on the assignment.
- [x] `npm install` is being used to install all dependencies.
- [x] `npm start` is being used to start the application.
- [x] All functional requirements are fulfilled.
- [x] All Production requirements are fulfilled.
- [x] All non-functional requirements are fulfilled.
- [x] I have completed the assignment report (see below).

---

- [x] I intend to submit the assignment and at the same time I guarantee that I am the one who created the code that is submitted. In cases where I use external libraries or borrowed code from other sources, the source is clearly stated.
(_Jag avser göra en inlämning av uppgiften och jag garanterar samtidigt att jag är den som skapat koden som lämnas in. I de fall jag använder externa bibliotek eller har lånat kod från andra källor så är källan tydligt angiven._)

---

## Assignment report


### URL to your application

Link to application: https://cscloud40.lnu.se/

### Security

For securing the login I used bcrypt to compare the hashed and salted password to the saved hashed and salted password.
When receiving a post request on "/webhook" I make sure that it was gitlab that sent the request by comparing the secret token that was sent in the request headers to the secret token that I saved in my enivironment variables.
I used helmet to secure the express app and to secure http headers. I also used it to set a "content security policy". 
I used lets encrypts "cert bot" to generate a certificate for my application. So that the http requests are sent over https.


### Description of entities

_ Describe the following parts, how you are using them, and what their purpose is in your solution:

- Reversed proxy
    It's a server that serves as a layer between the client and the server. It forwards requests from the client to the server so that the client and server never communicate directly. It can also be used as a load balancer to redirect requests from clients to another server to distribute the incoming requests.

    I used nginx as a reverse proxy in this assignment. I used nginx to create a layer between the server and the client.
- Process manager
    A process manager can be used to run Web applications and distribute the servers recourses to the applications.

    I used PM2 as a process manager in this assignment. I use it to keep my application alive.
- TLS certificates
    TLS certificates binds your domain to your application.

    I used lets encrypts "cert bot" to generate a certificate for my application.
- Environment variables
    It is used to keep some of the variables used in an application like domain names and authentication keys out of the code and saved as variables. This can be helpful when working with variables that change often and are used in many places in the code.

    I used environment variables to save my personal access token that was used to fetch from the gitlab API. Since I only had one user in this application I saved my username and password as an environment variable.


### Development vs. Production

The only difference is that error.hbs for 500 error codes. does not render when in production mode.

### Use of external dependencies

NPM modules used in this project
* [bcrypt](https://www.npmjs.com/package/bcrypt)
    Was used to compare the hashed and salted user password.
* [body-parser](https://www.npmjs.com/package/body-parser)
    Was used to parse incoming request.body from gitlab.
* [dotenv](https://www.npmjs.com/package/dotenv)
    Was used to store environment variables.
* [express](https://www.npmjs.com/package/express)
    Was used to create a web server.
* [express-hbs](https://www.npmjs.com/package/express-hbs)
    It was used as a template engine to render the different pages on the application.
* [express-session](https://www.npmjs.com/package/express-session)
    Was used to create a session cookie
* [helmet](https://www.npmjs.com/package/helmet)
    Was used to secure the express app and to secure http headers.
    I also used it to set a "content security policy". 
* [http-errors](https://www.npmjs.com/package/http-error)
    Creates http-errors for express
* [morgan](https://www.npmjs.com/package/express-hbs)
    Was used to log http request to the server.
* [node-fetch](https://www.npmjs.com/package/node-fetch)
    Was used to make http request to the gitlab api.
* [socket.io](https://www.npmjs.com/package/socket.io)
    Was used to create a websocket server to handle realtime communication between the client and the server
* [nodemon](https://www.npmjs.com/package/nodemon)
    Was used in development to automatically restarting the node application.

CSS/Javascript
* [materializecss](https://materializecss.com/)
    Was used for css and javascript on the client.

I mostly used dependencies that I have used in the previous examination and exercises in this course. I made sure that the packages that I installed from npm had a lot of weekly downloads.


### Overall Reflection

I had some struggle understanding how to set up the web-socket server in the beginning. 
Working with Gitlabs API was fun. It took a couple of hours to understand how to use the API. 
Setting up a webhook was easier than I thought. The documentation was easy to understand.
Setting up the Ubuntu server was pretty straight forward. I just followed John's videos.

### Further improvments

Adding more functionality on the client-side. Opening, closing and creating new issues. Adding the functionality to log in with "oauth".


### Extras

I have added the ability to see comments and to comment on an issue from the client.

### Feedback

Fun assignment. Would have been interesting to learn more about setting up Websocket servers and how to secure them.
