# ez-http
Easy HTTP-Server written in Typescript with annotation support.

## Motivation
I really :heart: express - in fact everybody loves express.
It's lightweight extendable by middlewares and widley tested.
But investigating the source codes and many of the famous plugins for express i found out that i was created and designed before the glorious Typescript area appeared with the support of strong typed classes / interfaces and decorators.
So due the basic design of express and their middlewares (chain of responsibility) i decided to completly create a own http-server that is easily extendable, well tested, and completly based on Typescript.
I really preciate any kind of improvements :+1:

## Design
The core concept of ez-http is similar to express: The middlewares.
You have to accept the idea that everything is a middleware.
There is somewhere a MiddlewareHolder (server, router, ...) that holds a bunch of middlewares in which beeing self a middleware.
It sounds complicated but is very easy and straightforward: Let's continue while letting this mentality wrapping your head.

### Middleware
