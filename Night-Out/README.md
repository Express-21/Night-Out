# Night-Out
Web applications with Node.js | Team "Express-21"

This document describes the course project web application as part of the programme of the Node.js course at Telerik Academy.

## Application Description

The current project is a standard web application using Node.js, Express MongoDB /as a data provider/.  

The applications main idea is to provide a wide range of restaurants, bars and music places, from which the users to choose for their night out. The palces are devided in several categories - restaurants, bars & pubs and clubs & music.

The application can be used from both non-registered users /public part/ and registered users /private part/ , but with different access rights.
The public part - such as home page, different category content, detailed place information. login and register forms, about and contacts page and etc. is accessible for both user types.

The private parts /place creation, user lists, personal profile page, edit personal profile page - as page views; adding to favourites, adding a comment to a place, loading more than 5 comments and etc./ are available only for signed in users.

- As a view engine, the application is using Pug (for both public and private dynamic web pages)
- The server is build through Express
- MongoDb is used as a database provider
- Passport is used for user's authentication

### Client side

The fromt edn is mainly using standart CSS3 and Bootstrap.
The response is accomplished through Bootstrap and CSS3 as well.
Client side validation prevents input of invalid data states from the public to the server part.
Invalid input is followed with an appropriate message.
The user interface is amed to be user friendly and provides an easy functionality for its clients.

### Testing - up to 25%

The stable state of the application is provided through 
  - unit tests
  - functional tests
  - integration tests

### Deployment in Amazon Web Services (AWS)

The application is deployed in AWS using MongoDB from AWS
http://18.220.80.242/

##  General Requirements
As a sourse controll system is used Github

