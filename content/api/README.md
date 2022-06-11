
# API

> :warning: 
> This folder is not meant to host normal content, see below.

The url of the API is `/api/`, the server will try to serve a RESTful API on this path. In some cases, it may decide to serve the content of this folder by calling `next()` in the middleware.

**The content in this folder is not served unless the API server decides to call `next()`.**

Examples:
 - client requests `/api/something` and the server responds with <!--`{ "success": true }`--> some api response
 - client requests `/api/something` and the server decides to respond with some content of this folder
 - client requests `/api/something` and the server decides to respond with a 404 error
 - client requests `/api/something` and the server decides to respond with a 500 error
 - client requests `/api/something` and the server decides to serve the content of this folder by calling `next()` in the middleware and let the next middleware handle the request
 - client requests `/api`, the server decides to serve the index by calling `next()` in the middleware and let the next middleware handle the request

---

- see [what is a REST api](https://www.redhat.com/it/topics/api/what-is-a-rest-api)

<!--** API is a RESTful API. **-->
