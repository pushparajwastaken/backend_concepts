Backend is a computer which is listening for a web, http or any other request through ports
We call it server because it serves data

---

## 1. HTTP Message Structure: Request and Response

HTTP communication involves clients sending **request messages** and servers returning **response messages**. The structure of these messages is standardized and relies on distinct components, separated by a blank line.

### Request Message (Client to Server)

A typical request message contains:

1. **Request Method:** Defines the intent of the interaction (e.g., GET, POST, PUT).
2. **Resource URL:** The specific resource being requested from the server.
3. **HTTP Version:** Specifies the protocol version being used (e.g., HTTP 1.1).
4. **Host:** The domain of the frontend.
5. **Headers:** Key-value pairs containing metadata about the request.
6. **Blank Line:** This signifies that the headers are finished and the request body is about to start.
7. **Request Body (Optional):** Information the client wants to send to the server (e.g., user data for a POST request).

### Response Message (Server to Client)

A typical response message contains:

1. **HTTP Version:** The protocol version used by the server.
2. **Status Code and Value:** A three-digit code communicating the standardized result of the request (e.g., 200 OK).
3. **Response Headers:** Key-value pairs containing metadata about the response.
4. **Blank Line:** Separates the headers from the body.
5. **Response Body (Optional):** The requested resource, data, an error message, a JSON file, or other content.

## 2. HTTP Methods and Their Intent

HTTP methods exist to represent different kinds of **actions** a client can request on a server, defining the **intent** of the interaction and providing clear semantic meaning.

|Method|Intent/Function|Idempotency Status|Description|
|:--|:--|:--|:--|
|**GET**|Fetch/Retrieve data.|**Idempotent**.|Should not modify any data on the server. Fetching data multiple times yields the same result.|
|**POST**|Create new data.|**Non-Idempotent**.|Produces different results for the same request if called multiple times (e.g., submitting the same request twice creates two resources). Has a request body to send data.|
|**PATCH**|Update or selectively replace some data.|Considered part of the idempotent category.|Can be thought of as an append action or selective replacement; has a request body.|
|**PUT**|Update data, but **completely replaces** the previous instance with the data in the request body.|**Idempotent**.|Replacing old data with the new data multiple times yields the same final result.|
|**DELETE**|Delete a resource.|**Idempotent**.|A resource can only be deleted once; subsequent attempts have the same outcome (resource remains deleted).|
|**OPTIONS**|Fetch server capabilities.|N/A|Used in the CORS flow (pre-flight requests) to inquire about supported methods and headers.|

## 3. HTTP Headers (Metadata)

Headers are **key-value pairs** of parameters sent over a request or received over a response, acting as metadata about the message. They are crucial because they allow quick checking of information without needing to access the main body, similar to writing an address on a parcel.

Headers provide several vital functions, including enforcing security policies and enabling client instructions. The sources categorize headers into several groups:

### General Headers

General headers are used in **both requests and responses** and contain metadata about the message itself.

- **Date:** Indicates the date of the message.
- **Connection:** Specifies connection information, such as whether to **keep it alive** or close it. Persistent connections are the default in HTTP 1.1, allowing multiple requests over one connection unless explicitly closed.
- **Cache-Control:** Controls caching mechanisms like `no cache` or `max-age`.

### Other Header Categories (Briefly Mentioned)

- **Request Headers:** Sent by the client to inform the server about its environment, preferences, and capabilities. Examples include `User-Agent` (client type), `Authorization` (credentials like bearer tokens), and `Accept` (content format expected, e.g., JSON).
- **Representation Headers:** Deal with the format of the resource being transmitted. Examples include `Content-Type` (media type, e.g., JSON or HTML), `Content-Length` (size in bytes), and `ETag` (unique identifier used for caching).
- **Security Headers:** Enhance security by controlling behaviors related to content loading, cookies, and encryption. Examples include `Strict-Transport-Security` (forces HTTPS), `Content-Security-Policy` (prevents XSS), and cookie flags like `HTTPOnly` and `Secure`.
- **Content Negotiation Headers:** Headers like `Accept`, `Accept-Language`, and `Accept-Encoding` allow the client to communicate preferred formats (e.g., JSON or XML), language, and encoding (e.g., Gzip compression) to the server.

Headers also enable **extensibility** in HTTP, allowing developers to add custom headers (e.g., `X-Custom-Header`) for specific application use cases.

## 4. Pre-flight Requests and the CORS Flow

Pre-flight requests are an essential part of the Cross-Origin Resource Sharing (CORS) flow, which is a security mechanism enforced by browsers to control requests made to different domains (cross-origin).

### The Role of the OPTIONS Method

Pre-flight requests utilize the **OPTIONS** method. The purpose of this initial request is purely to inquire about the server's **capabilities** and policies for the specific cross-origin interaction before sending the main request. The OPTIONS request **does not include the actual data** or request body.

### When a Pre-flight Request is Fired

A pre-flight request is triggered by the browser if a cross-origin request is determined to be "non-simple." This occurs if the request is cross-origin AND satisfies **any** of the following conditions:

1. **Method is not Simple:** The HTTP method used is not GET, POST, or HEAD (e.g., it is a **PUT** or **DELETE** request).
2. **Includes Non-Simple Headers:** The request includes specific headers that are not considered simple (e.g., the **`Authorization`** header or custom headers).
3. **Non-Simple Content-Type:** The `Content-Type` header is set to something other than the simple types (e.g., `application/json`).

### Pre-flight Request/Response Interaction

1. **Client (Browser) sends OPTIONS Request:** The browser sends the OPTIONS request containing necessary headers to inquire about the server's support, such as:
    - `Access-Control-Request-Method` (e.g., asking if PUT is allowed).
    - `Access-Control-Request-Headers` (e.g., asking if the `Authorization` header is allowed).
    - `Origin` (identifying the client's domain).
2. **Server Responds (If CORS is Handled):** If the server supports the cross-origin request, it typically responds with a **204 No Content** status code and specific headers indicating what is permitted. These response headers include:
    - **`Access-Control-Allow-Origin`**: Specifies the client's domain (or `*` for all domains).
    - **`Access-Control-Allow-Methods`**: Lists the HTTP methods allowed for that resource (e.g., GET, POST, PUT, DELETE).
    - **`Access-Control-Allow-Headers`**: Lists the non-simple headers the server accepts (e.g., `Content-Type`, `Authorization`).
    - **`Access-Control-Max-Age`**: Instructs the browser how long (in seconds) it can cache the pre-flight results, preventing unnecessary subsequent OPTIONS requests.
3. **Browser Proceeds:** If the browser successfully checks off all these conditions, it then proceeds to send the **original** request (e.g., the PUT request with the body). If the server fails to return the appropriate CORS headers, the browser blocks the response, resulting in a CORS error.
---
## Notes on Routing in Backend Systems

### 1. Defining Routing

Routing is the process of **mapping URL parameters to a server-side logic**. It is fundamental to how a server determines which set of instructions (or "Handler") to execute in response to a client's request.

- **HTTP Method (The "What"):** The HTTP method (e.g., GET, POST) describes the client's **intent** or **action** on a resource (what the client wants to do—fetch, add, update, or delete data).
- **Route Path (The "Where"):** The route path (or URL path, e.g., `/users`) expresses **where** the client wants to send their intention or which resource they want to perform their action on.
- **The Unique Routing Key:** The server combines the **HTTP Method** and the **Route** path to form a **unique routing logic** (a key). The server first checks the method, then the route, and concatenates these two to map the request to a particular Handler or set of instructions. For example, a GET request to `/API/books` is distinct from a POST request to `/API/books`, and both map to different handlers.

### 2. Types of Routes

#### A. Static Routes

Static routes are constant and do not contain variable parameters.

- **Characteristics:** The string used in the route path (e.g., `/API/books`) stays consistent and does not change.
- **Response:** Static routes generally return the same kind of data (e.g., a list of all resources).

#### B. Dynamic Routes (Using Path Parameters)

Dynamic routes allow the fetching of specific individual resources by embedding variables into the route path.

- **Mechanism:** The server extracts a dynamic value from the route path to perform operations (like fetching a specific user from a database).
- **Server Matching:** Servers commonly use a convention (often a colon, e.g., `/API/users/:ID`) to denote a dynamic parameter. This tells the server to route any request with that method and structure to a specific handler, regardless of the string content in the dynamic slot.
- **Semantic Expression:** Dynamic routes promote the idea of REST APIs by providing a **human-readable construct** to routing, where the path clearly indicates the resource and its specific identifier (e.g., fetching data of the user with ID 123).
- **Terminology:** The dynamic string placed right after a forward slash is called a **path parameter** or **route parameter**.

#### C. Nested Routes

Nested routes are a common practice in REST APIs used to express the **semantic meaning** and relationship between different resources.

- **Structure:** They involve nesting different types of information at different levels (e.g., `/API/users/:user_ID/posts/:post_ID`).
- **Meaning:** Each level of nesting provides a different semantic meaning and corresponds to a different unique route match on the server side, resulting in different responses.
    - `/API/users` $\rightarrow$ Returns a list of all users.
    - `/API/users/123` $\rightarrow$ Returns details of user 123.
    - `/API/users/123/posts` $\rightarrow$ Returns all posts belonging to user 123.
    - `/API/users/123/posts/456` $\rightarrow$ Returns a particular post (ID 456) belonging to user 123.

### 3. Query Parameters

Query parameters are key-value pairs used to send non-semantic or auxiliary data to the server, primarily when a request does not contain a body.

- **Format:** They are appended to the route path after a question mark (`?`) (e.g., `/API/search?query=value`).
- **Primary Use Case:** They are typically used with **GET requests** because GET requests do not have a body to send data.
- **Function:** They allow the client to send a set of key-value pairs to the server to attach **metadata about the request**.
- **Applications:** Query parameters are commonly used for functionalities such as:
    - **Search/Filtering:** Sending a search value.
    - **Pagination:** Specifying which page or limit the client requires (e.g., `page=2`, `limit=20`).
    - **Sorting:** Specifying the desired sort order (ascending or descending).

### 4. Advanced Routing Concepts

#### A. Route Versioning and Deprecation

Route versioning (e.g., `/API/v1/products` vs. `/API/v2/products`) is a common practice used to manage changes in API structure or response formats.

- **Purpose:** Allows developers to implement **breaking changes** (like renaming a response field from `name` to `title`) while keeping the older version (V1) operational for existing clients.
- **Workflow:** Versioning provides a stable workflow, giving client engineers a migration window to update their request endpoints from the deprecated version (V1) to the new version (V2).

#### B. Catch All Route

The catch-all route handles requests that do not match any defined server endpoint.

- **Mechanism:** It is the final route matching algorithm applied on the server (often represented as `/*` or similar syntax).
- **Function:** Instead of sending a default null response, the catch-all handler maps the request to server logic that returns a **user-friendly message** (e.g., "route not found" or 404) to the client, clearly stating that the requested endpoint does not exist.

---
### 1. Core Concepts: Authentication vs. Authorization

- **Authentication:** The process of assigning an **identity** to a subject. It answers the question, **"Who are you?"** in a given context (platform, operating system).
- **Authorization:** The process of determining a subject's **permissions** or **capabilities** in that context. It answers the question, **"What can you do?"**.

---

## 2. Historical Context of Authentication

The need for authentication evolved as societies grew and interactions moved beyond familiar circles.

|Era|Authentication Mechanism & Principle|Notes|
|:--|:--|:--|
|**Pre-Industrial**|**Implicit Trust**|Based on human contextual trust (e.g., village Elder vouching for someone, handshake agreement). Failed to scale.|
|**Medieval Period**|**Seals** (Wax Seals)|Early cryptographic mechanism and the first widely adopted **authentication tokens**. Relied on **"something you possess"**. Forgery was the first recorded instance of an authentication bypass attack.|
|**Industrial Revolution**|**Pass Phrases** (Telegraph)|Early form of **shared secrets** relying on the principle of **"something you know"**. Precursor to static passwords.|
|**Mid-20th Century**|**Passwords (Digital Phase)**|Introduced for multi-user mainframes (MIT Project Mac). An incident involving a plain text password file led to the genesis of **secure password storage**.|
|**Modern Storage**|**Hashing**|Cryptographic algorithms transform passwords into **irreversible, fixed-length representations**. Authentication aligned with confidentiality, integrity, and availability.|
|**Cryptographic Era**|**Asymmetric Cryptography**|Diffie-Hellman key exchange introduced asymmetric cryptography, enabling shared secrets over untrusted mediums. This became the backbone of modern protocols (PKI). Kerberos introduced **ticket-based authentication**.|
|**Internet Era**|**Multi-Factor Authentication (MFA)**|Combined layers of security: "something you know" (passwords), "something you have" (OTP generators), and "something you are" (biometric data).|
|**21st Century**|**Advanced Frameworks**|Driven by cloud, mobile, and API architectures, leading to **OAuth 2.0**, **JWTs**, Zero Trust, and passwordless systems (WebAuthn).|

---

## 3. Core Components of Modern Authentication

### A. Sessions (Stateful Mechanism)

- **Necessity:** HTTP is **stateless**. Sessions were introduced to handle dynamic content (e-commerce carts, user logins) by providing a **temporary server-side context**.
- **Workflow:**
    1. User logs in.
    2. Server creates a unique **Session ID** and stores it along with user data (e.g., user ID, roles, cart items) in a **persistent store** (Database, Redis).
    3. The Session ID is sent back to the client as a **Cookie**.
    4. Subsequent requests include the cookie/ID, which the server uses to fetch the user's state from the persistent store.
- **Storage Evolution:** Sessions moved from file-based storage (poor scalability) to database-backed, and eventually to distributed, in-memory stores like **Redis** for faster lookups.

### B. JWTs (JSON Web Tokens - Stateless Mechanism)

- **Emergence:** Driven by the high cost and latency of maintaining and replicating session data for millions of users across globally distributed systems. JWTs offer a way to **offload state from the server**.
- **Characteristics:** JWTs are **self-contained tokens** that transfer claims (data) in a stateless manner.
- **Structure (3 parts, Base 64 encoded):**
    1. **Header:** Metadata (e.g., signing algorithm).
    2. **Payload (Claims):** User data like `sub` (User ID), `iat` (Issued At), name, and role.
    3. **Signature:** Used with a server-side **secret key** to cryptographically verify the token’s authenticity and integrity (checking for tampering).
- **Advantages (Pros):**
    - **Statelessness:** Eliminates server-side storage costs.
    - **Scalability:** Ideal for microservice architectures, as multiple servers can verify the token using a shared secret key without needing to synchronize session data.
    - **Portability:** Lightweight and URL-friendly (Base 64 encoded string).
- **Disadvantages (Cons):**
    - **Token Theft:** If accessed, the token can be used to impersonate the user.
    - **Complex Revocation:** Since the server holds no state, a token cannot be invalidated until it expires, unless the global secret key is changed (which forces all users to log out).
- **Hybrid Approach:** Combining JWTs with statefulness by maintaining a **blacklist** of revoked tokens in persistent storage. This solves revocation but defeats the purpose of statelessness by requiring a storage lookup on every request.

### C. Cookies

- **Function:** A way for the **server to store a piece of information** (string/value) in the user's browser.
- **Role in Auth:** After authentication, the server sets a cookie containing the session ID or JWT. The browser automatically sends this cookie back to the server in **all subsequent requests** to automate validation.
- **Security:** Cookies set by one server are typically only accessible by that server.

---

## 4. Authentication Types and Use Cases

|Type|Mechanism|Pros/Cons|Ideal Use Case|
|:--|:--|:--|:--|
|**Stateful**|Stores session data/ID in a persistent store (Redis/DB).|**Pros:** Centralized control, easy revocation/logout. **Cons:** Limited scalability, complex in distributed systems.|**Web App** based workflows and SAS models where strict session control is required.|
|**Stateless**|Uses self-contained, signed JWTs; no persistent storage lookup.|**Pros:** High scalability, no session dependency, mobile-friendly. **Cons:** Token revocation is complex.|**APIs** and scalable systems with distributed servers, where tokens carry user information.|
|**API Key Based**|Uses a cryptographically safe string attached to requests.|**Pros:** Easy to generate. Ideal for non-human interaction.|**Machine-to-machine** (server-to-server) communication or single-purpose client access.|
|**OAuth 2.0 / OIDC**|Uses tokens (e.g., Access Token, ID Token) for delegated access.|Solves the security risk of sharing passwords to grant cross-platform access (Delegation Problem).|**Third-party integrations** (e.g., travel app accessing Gmail) and providing login via external providers ("Sign in with Google").|

### OAuth 2.0 & OIDC Explained

- **Delegation Problem:** Platforms needed access to resources on other platforms (e.g., social media importing contacts from Google). The initial solution—sharing passwords—was disastrous due to full access and impossible revocation.
- **OAuth (Open Authorization):** Solved this by allowing access to be shared using **tokens** that have **specific, limited permissions** instead of passwords.
- **OAuth 2.0:** Simplified the protocol using **Bearer Tokens** and defined various authentication **flows** based on application type (e.g., Authorization Code flow for server-side apps, Client Credentials flow for M2M).
- **OIDC (Open ID Connect):** Built on OAuth 2.0 to solve the missing **authentication** piece (identity). It introduced the **ID Token** (typically a JWT) containing identity information (user ID, email, name).

---

## 5. Authorization: Role Based Access Control (ARBAC)

- **Principle:** Authorization ensures that specific users or roles have specific capabilities. Not all users can do the same thing.
- **ARBAC Mechanism:** Access is based on the user's **assigned role** (e.g., user, admin, moderator). Different roles are assigned different **permissions** on various resources (e.g., Admin can access "Dead Zone" notes, regular users cannot).
- **Workflow:** The server determines the user's role from their token/session ID. If the user attempts an action (e.g., API call) for which their role lacks permission, the server fails the request and returns a **403 Forbidden** status.

---

## 6. Security Defenses for Backend Engineers

Backend engineers must employ defensive measures during authentication to prevent attacks.

### A. Generic Error Messages

- **Risk:** Friendly errors (e.g., "User not found," "Incorrect password") provide attackers with clues, confirming which usernames are valid or whether they only need to brute-force a password.
- **Defense:** **Never send specific messages** related to authentication failure. Always return a **generic message**, such as **"Authentication failed,"** for all failure scenarios to confuse attackers.

### B. Timing Attack Defense

- **Risk:** Attackers measure the response time. A request failing early (invalid username) is faster than a request failing late (invalid password, requires time for hashing before failure). This delay difference allows attackers to distinguish between a username failure and a password failure.
- **Defense (Equalizing Response Times):**
    1. **Constant Time Operations:**  Use cryptographically secure comparison functions for password hashes that ensure execution time does not vary based on input similarity.
    2. **Simulate Delay:** Introduce a fake response delay (e.g., using `set timeout` or `time.sleep`) even for early failures (e.g., username mismatch), preventing attackers from measuring the timing difference.

---
## Validations and Transformations in Backend APIs

Validations and transformations are fundamental processes designed to enforce a set of rules and guidelines related to **data integrity and security** when designing APIs.

### 1. Placement in Backend Architecture

The typical backend architecture separates logic into layers:

| Layer                | Responsibility                                                                                                                                                        |
| :------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Repository Layer** | Deals with database connections, query executions, insertions, and deletions (persistent storage like Redis or a relational database).                                |
| **Service Layer**    | Executes the main **business logic**, such as calling repository methods, sending notifications/emails, or making webhook calls.                                      |
| **Controller Layer** | The entry point that handles HTTP-related logic (e.g., error codes, success codes, data format) and performs **validations**. Internally, it calls the Service Layer. |

**Execution Flow and Placement:**

1. The client's data (JSON payload, query parameters, path parameters, headers) reaches the server.
2. The request goes through the **route matching algorithm** to find the respective controller method.
3. **Validations and Transformations** happen at this exact point: **before** any significant business logic is executed in the controller layer and **before** calling the service methods.

### 2. The Necessity of Validations

The primary goal of validations is to ensure that all data sent by the client is in the **expected format** and structure.

- **Preventing Server Breaks:** Validations ensure that the server **does not break** under unexpected circumstances, such as receiving the wrong data type.
- **Preventing Data Type Errors:** If the client sends a data type that the database schema does not expect (e.g., a number `0` instead of a `text` string for a book name), the database call will fail due to its constraints. This results in a **500 Internal Server Error** being returned to the client, leading to a very poor user experience.
- **Improved Error Handling:** By validating at the entry point, if the data does not satisfy the constraints, the server can immediately send a specific **400 Bad Request** error code, informing the client to retry with the appropriate data format.

### 3. Types of Validations

Validations can be grouped into three main types:

#### A. Syntactic Validation

This checks if the provided data string follows a **particular structure** or format.

- **Email:** Checks if the string adheres to the standard email structure (e.g., initial value + `@` character + domain name).
- **Phone Number:** Checks if it follows a structure like a country code followed by a 10-digit number.
- **Date:** Ensures the provided string adheres to the expected date format (e.g., year, then month, then day).

#### B. Semantic Validation

This checks whether the provided data **makes sense** in a contextual or logical way.

- **Date of Birth:** A date of birth cannot be a date in the future.
- **Age:** The provided age must fall within a logical range (e.g., rejecting an age like 365, often restricting it to 1–120).

#### C. Type Validation

This is the basic validation that checks if the data type of a field matches the expectation.

- Ensuring a field is a `string`, `number`, `boolean`, or an `array`.
- This also includes enforcing data types for elements _inside_ complex structures, such as ensuring that every element within an array is a string.

#### D. Complex/Conditional Validation

Validations can be defined as **complex pipelines** based on service layer requirements.

- **Equality Check:** Ensuring two fields have the same value (e.g., `password` and `password confirmation`).
- **Conditional Requirements:** Requiring one field only if another field has a specific value (e.g., the `partner name` field is required **only if** the `married` field is `true`).

### 4. Transformation

Transformation involves executing operations on the user-provided data to convert it into a **desirable format** for the service layer.

- **Definition:** The process of converting data into a desired structure.
- **Transformation Pipeline:** Transformations are usually paired with validations in a single pipeline so that all input data logic remains in one place.

**Key Transformation Use Case: Query Parameter Casting**

- All values received in **query parameters** (e.g., `page=2`, `limit=20`) are transmitted as **strings** by default, even if the API expects a number.
- It is the **server's responsibility** to transform (or **cast**) this string data type into the expected type (e.g., a number) before the validation logic (e.g., "must be greater than zero") can be executed.

**Other Examples of Transformation:**

- Converting a string value (like an email) to all **lower case** before execution.
- Adding specific characters (e.g., a `+` symbol) to a field value (like a phone number).

### 5. Frontend vs. Backend Validation

It is a common mistake to replace backend validation with frontend validation. Both are necessary but serve different purposes.

| Feature             | Frontend (Client-Side) Validation                                                                                                                   | Backend (Server-Side) Validation                                                                |
| :------------------ | :-------------------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------- |
| **Purpose**         | **User Experience (UX)** and providing immediate feedback to the user.                                                                              | **Security and Data Integrity**. It is mandatory for API design.                                |
| **Security Status** | **Not for security**. It can be easily bypassed by clients like Insomnia or Postman, which interact directly with the API without a form interface. | **Mandatory.** The server must be as strict and specific as possible, regardless of the client. |
| **Workflow**        | If validation is successful, the API call is made; if unsuccessful, errors are shown in the form itself.                                            | Performs Security checks and enforces mandatory data integrity.                                 |
These notes summarize the key concepts of handlers/controllers, services, repositories, middlewares, and request context, drawing directly from the provided transcript.

---
### I. Request Life Cycle Overview

The request life cycle is what happens inside the server from the moment a client request reaches the entry point until the moment a response is sent back.

1. The request reaches the server entry point (e.g., Port 3000, 4000).
2. **Routing** maps the request path to a particular handler function.
3. The request passes through **Middlewares** (optional functions executed in the middle).
4. The **Handler/Controller** manages the data flow, validation, and response sending.
5. The **Service Layer** performs the core business logic.
6. The **Repository Layer** handles database operations.

### II. Handlers/Controllers

The Handler or Controller is the entry point after the routing algorithm determines the target function.

|Aspect|Description|Source|
|:--|:--|:--|
|**Input/Output**|Receives a **request object** (for reading input) and a **response object** (for modifying headers and sending output). The runtime (e.g., Go, Node.js) provides these objects.||
|**Primary Goal**|Controls the data flow from the client to the server and from the server back to the client. **Limits all HTTP-related processes to this layer**.||
|**Responsibilities**|1. **Data Extraction:** Takes values from the request object (query parameters, request body). 2. **Deserialization/Binding:** Converts serialized data (e.g., JSON) into the native format of the programming language (e.g., struct in Go). If this fails, it sends a **400 Bad Request** error. 3. **Validation and Transformation:** Validates data against expected formats and sets defaults or modifies data for convenient downstream processing. 4. **Calling Service Layer:** Passes validated/transformed data to the service layer for processing. 5. **Response Sending:** Decides on the appropriate **response code** (e.g., 200 series for success, 400/500 for errors) and sends the final response body back to the client.||

### III. Services Layer

The service layer is where the **actual processing** of the API logic happens.

|Aspect|Description|Source|
|:--|:--|:--|
|**Isolation**|Should not deal with any HTTP-related concerns (like response codes or validation). Ideally, looking at a service method, one should not be able to tell that it is being used in an API.||
|**Responsibilities**|1. **Core Processing:** Executes non-database logic, such as sending emails or notifications. 2. **Orchestration:** Merges or manipulates data returned from multiple repository methods or external API calls. 3. **Database Delegation:** Calls the repository layer for operations that require persisting or fetching data.||

### IV. Repository Layer (Database Layer)

The repository layer or database layer interacts directly with the database.

|Aspect|Description|Source|
|:--|:--|:--|
|**Sole Responsibility**|Takes the necessary data (e.g., filtering, sorting, insertion data) and **constructs the database query**, then returns the result received from the database.||
|**Design Principle**|**Single Responsibility:** Each repository method should return only one kind of data (e.g., a method for getting all books should be separate from a method for getting a single book).||

### V. Middlewares

Middlewares are optional functions that are executed during the request life cycle, often before routing, after routing, or before sending the response.

|Aspect|Description|Source|
|:--|:--|:--|
|**Goal**|To **reduce code duplication and redundancy** by executing common operations across all (or many) requests.||
|**Key Components**|A middleware receives three objects: 1. **Request** 2. **Response** 3. **`next` function** (used to pass execution to the next processing context).||
|**Execution Flow**|A middleware can perform logic, modify the request/response, and then either use `next()` to continue execution or send a response back immediately, terminating the request early. **The order of middleware execution is important**.||
|**Common Uses**|**Security:** CORS, authentication (sending **401 Unauthorized** on failure), rate limiting (sending **429 Too Many Requests** on excess), adding security headers. **Utility:** Logging and monitoring, compression of large responses, data passing (serialization/deserialization). **Global Error Handling:** Usually placed as the **last middleware** to catch unstructured errors from any layer (Handler, Service, etc.) and convert them into a structured, appropriate response (400 or 500).||

### VI. Request Context

The request context is a storage mechanism or state that is **scoped and limited to a particular request**.

|Aspect|Description|Source|
|:--|:--|:--|
|**Nature**|Typically functions as a key-value storage. Every request will have a context attached to it.||
|**Purpose**|To provide a **shared state** accessible to all execution environments (middlewares, handlers) of that single request. This prevents the system from being closely coupled.||
|**Common Uses**|1. **Storing Authentication Metadata:** An authentication middleware can verify a token, extract the **user ID, user role, or permissions**, save this data to the context, and forward it. Downstream handlers can then use this trusted data (e.g., for database insertion) instead of relying on input from the client. 2. **Request Tracing:** Generating a unique request ID (e.g., UUID) early in the life cycle and storing it in the context, allowing the ID to be used in logs and downstream service calls for auditing and debugging. 3. **Control:** Sending cancellation signals, abort signals, or deadlines to external services.||

---

**Analogy:**

The entire backend architecture process can be compared to a high-end restaurant:

- **The Client** is the diner who places the order (the Request).
- **Middlewares** are like the host/bouncer and the coat check. They check the diner's credentials (Authentication), ensure the restaurant isn't too busy (Rate Limiting), and log their arrival (Logging). They can turn away a disruptive customer immediately.
- **The Handler/Controller** is the server (waiter). They receive the order, ensure it's legible and complete (Validation/Transformation), and determine the appropriate response (Deciding the Response Code). They don't cook the food themselves, but they manage the flow.
- **The Request Context** is the slip of paper attached to the order that follows the food through every station, detailing the table number (Request ID) and customer allergies or preferences (User Permissions).
- **The Service Layer** is the Chef. They manage the overall preparation, combining ingredients, and ensuring the dishes are cooked properly (Core Logic/Orchestration).
- **The Repository Layer** is the Pantry/Supply Manager. They are responsible only for fetching specific, raw ingredients or storing them safely (Database Interaction), exactly as requested by the Chef.