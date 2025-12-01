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
---

## Complete REST API Design Notes

### I. Introduction and Context

API design is a critical aspect of backend engineering. This discussion focuses on **REST APIs (Representational State Transfer)**, one of the most widely used API standards.

- **Goal of Standardization:** Sticking to existing REST standards and guidelines helps backend engineers avoid common confusions (e.g., using PUT vs. PATCH, choosing status codes) and allows them to focus primarily on **business logic**.
- **Historical Foundation:** The World Wide Web project was started by Tim Berners-Lee in 1990 to facilitate global knowledge sharing. He invented crucial technologies like **URI**, **HTTP**, and **HTML**.
- **The Scalability Crisis:** The project faced a breakdown due to the exponential growth of its user base.
### II. REST Architectural Constraints (Roy Fielding’s Contribution)

Around 1993, Roy Fielding proposed several constraints to address web scalability, which later formed the basis of the REST architectural style, named in his 2000 PhD dissertation.

1. **Client-Server:** Emphasizes the **separation of concerns** where the client handles the user interface and the server manages data storage and business logic, allowing components to evolve independently and improving scalability.
2. **Uniform Interface:** Simplifies the overall system architecture by establishing a standardized way for components to communicate. It includes four sub-constraints: Resource Identification, Resource Manipulation through Representation, Self-Descriptive Messages, and HATEOAS (Hypermedia as the Engine of Application State).
3. **Layered System:** The architecture is composed of hierarchical layers, and each layer only interacts with the immediate layer below it. This enables better scalability, security, and the addition of intermediate components like load balancers and proxy servers.
4. **Cache:** Server responses must be **explicitly labeled** as cacheable or non-cacheable so clients can cache responses, which reduces server load, improves network efficiency, and enhances user experience.
5. **Stateless:** Each client request must contain **all information necessary** for the server to understand and process it. The server does not store client context between requests, improving reliability and scalability, as any server can handle the traffic.
6. **Code on Demand (Optional):** Servers can temporarily extend client functionality by transferring executable code (like JavaScript).

### III. Understanding Representational State Transfer (REST)

The acronym REST defines the style of the web's architecture:

- **Representational:** Resources (data/objects) are presented in a specific format, such as **JSON** (most popular), XML, or HTML. The same resource (e.g., a user object) can have different representations depending on the client (e.g., JSON for an API, HTML for a browser).
- **State:** Refers to the current condition or attributes of a resource (e.g., the items and total price in a shopping cart).
- **Transfer:** Indicates the movement of these resource representations between the client and server using common HTTP methods.

### IV. Designing Resources and Routes

Backend API design starts by defining the resources and creating intuitive routes.

#### 1. Identifying Resources

- Start by analyzing UI designs (wireframes/Figma) to understand how end users interact with data.
- Resources are typically the **nouns** identified from the business requirements (e.g., Projects, Users, Organizations, Tasks).

#### 2. Route Structure and Naming

- **URL Standard:** API URLs often include versioning (e.g., `/v1`).
- **Resource Naming (The Plural Rule):** All resources in the path segment of the URL **must always be in the plural form**. This applies even when fetching, updating, or deleting a single resource (e.g., `/books/123` not `/book/123`).
- **Readability:** Avoid spaces or underscores in URLs. If phrases contain spaces, use hyphens (`-`) to create a readable slug (e.g., `harry-potter`).
- **Hierarchical Paths:** The forward slash (`/`) indicates a hierarchical relationship between resources (e.g., `/organizations/:org_ID/projects/:proj_ID`). Each segment corresponds to a specific resource or collection.
### V. HTTP Methods and Idempotency

**Idempotency** means performing the same action multiple times yields the same final result as performing it once.

| Method                   | Purpose                                                           | Idempotent Status  | Explanation                                                                                                                                                                 |
| :----------------------- | :---------------------------------------------------------------- | :----------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **GET**                  | Retrieve data (Fetch)                                             | **Idempotent**     | Does not cause side effects on the server.                                                                                                                                  |
| **PUT**                  | Completely replace the resource                                   | **Idempotent**     | Repeated execution with the same payload results in the same resource state. Developers often use PUT and PATCH interchangeably, but PUT strictly implies full replacement. |
| **PATCH**                | Partially update a resource                                       | **Idempotent**     | Repeated execution updating a field to the same value results in the same resource state.                                                                                   |
| **DELETE**               | Delete a resource                                                 | **Idempotent**     | The resource remains deleted after the first call; subsequent calls return the same result (e.g., 404 error) and cause no further change in state.                          |
| **POST**                 | Create a new resource                                             | **Non-Idempotent** | Each execution creates a new entity (usually with a different ID), changing the server state.                                                                               |
| **POST (Custom Action)** | Used for actions not fitting CRUD (e.g., "send email," "archive") | **Non-Idempotent** | POST is open-ended and used for custom actions when other methods are inappropriate.                                                                                        |

### VI. List API Features (Pagination, Sorting, Filtering)

List APIs (GET requests returning a collection of resources) require mechanisms to manage large data sets efficiently.

#### 1. Pagination

- **Purpose:** Only returns a **portion** of the data in the response, preventing performance issues associated with serializing/deserializing large payloads.
- **Client Control:** Handled via URL query parameters:
    - **`limit`**: Defines the number of resources returned per page.
    - **`page`**: Defines which portion of the data is requested.
- **Server Defaults:** If the client omits these parameters, the server should apply **sane defaults** (e.g., `page=1`, `limit=10` or `20`).
- **Response Structure:** A paginated response should include:
    - `data`: The array of resources.
    - `total`: The total count of all resources in the database.
    - `page`: The current page number being returned.
    - `total_pages`: The total number of pages available.

#### 2. Sorting

- **Parameters:** Sorting is controlled via query parameters `sort_by` (the field name) and `sort_order` (ascending/descending).
- **Default Sort:** The server must implement a default sort (e.g., by `created_at` in **descending** order) to ensure the returned data is consistent across API calls, even if the client sends no sort parameters.

#### 3. Filtering

- Allows the client to narrow the list using query parameters based on specific field values (e.g., `status=active` or `name=Org4`).

### VII. Status Codes and Error Responses

Choosing the correct HTTP status code is essential for communicating the result of the API call to the client.

|Status Code|Usage Context|Explanation|
|:--|:--|:--|
|**200 OK**|Successful GET (List or Single), PATCH/PUT, and Custom Action (POST)|General successful response.|
|**201 Created**|Successful POST (Creation)|Used when a **new resource is successfully created**. The response body should contain the newly created entity.|
|**204 No Content**|Successful DELETE|Used for successful operations where the server has **no content** to return to the client (typically used for delete operations).|
|**404 Not Found**|Client Error (Specific Entity)|Used when the client requests a **particular entity** (e.g., an organization ID) that does not exist in the server. **Never use 404 for list APIs**; if a list API returns no data, return `200 OK` with an empty array.|

### VIII. General API Design Best Practices

- **Design First:** Backend engineers should dedicate a separate session to **designing the API interface** using tools like Insomnia or Postman before jumping into coding. An API is designed, not coded, in the initial phase.
- **Intuitive and Consistent Interface:** Maintain a single pattern for routes, JSON payloads, and dynamic parameters across all resources to reduce guess work and errors for integrating engineers.
- **JSON Naming:** Always follow the **camel case** standard for JSON fields.
- **Avoid Abbreviations:** Use full, readable field names (e.g., `description` not `DSC`) to prevent confusion for consumers who lack context.
- **Sane Defaults (Post Calls):** For creation (POST) operations, provide safe default values for fields that are not strictly necessary but are expected by the server (e.g., default `status` to `active` if the client doesn't send it).
- **Interactive Documentation:** Provide interactive documentation tools (like Swagger/OpenAPI) for consumers to test and understand the API behavior, minimizing communication overhead and errors.
--------------------------------------------------------------------------------

Detailed Notes: Mastering Databases with Postgres

I. Database Fundamentals and Persistence

A. Why Databases?

The core purpose of a database is to **persist information across different sessions**. Persistence means storing data in a way that survives even after the program that created it has been stopped (e.g., a to-do list app retaining tasks after being closed). Without persistence, users would lose all progress every time they opened an application.

B. Definition of a Database

The term "database" is broadly defined as **any kind of persistent, structured storage**.

• **Broad Examples:** A smartphone contact list, web browser local storage, session storage, cookie storage, or even a simple text file used to jot down notes.

• **Backend Context:** In the typical developer context of backend systems and servers, "database" refers specifically to **disk-based databases**.

II. Storage and DBMS

A. Disk-Based vs. RAM-Based Storage

Databases used in backend systems are primarily disk-based storage (HDD, SSDs).

|              |                                                    |                                                                               |
| ------------ | -------------------------------------------------- | ----------------------------------------------------------------------------- |
| Feature      | Primary Memory (RAM)                               | Secondary Memory (Disk-Based)                                                 |
| **Cost**     | Relatively costly                                  | Relatively cheap                                                              |
| **Capacity** | Limited (e.g., 8 GB – 128 GB)                      | High (e.g., 512 GB – 2 TB)                                                    |
| **Speed**    | Very fast for retrieval/saving                     | Relatively slow                                                               |
| **Use Case** | Caching mechanisms (e.g., Redis, in-memory caches) | Traditional relational and non-relational databases (e.g., Postgres, MongoDB) |

The trade-off favors disk-based storage for databases because **more space is needed** at the cost of less speed.

B. Database Management Systems (DBMS)

A DBMS is software whose sole responsibility is to **efficiently store the data and provide CRUD operations** (Create, Read, Update, Delete) to clients.

**DBMS Responsibilities:**

1. **Data Organization:** Organizing data efficiently for fast fetching, updating, and creating operations.

2. **Access:** Providing methods to perform CRUD operations.

3. **Integrity:** Maintaining the **accuracy, validity, and consistency** of the data (e.g., ensuring a payment field only accepts numbers, not strings).

4. **Security:** Protecting data from unauthorized access, managed through users, roles, etc..

C. Limitations of Simple Text Files

Storing data in plain text files is inefficient and leads to challenges, necessitating DBMS software:

• **Parsing:** Writing application code to parse, split, and compare lines in a text file is **slow and error-prone**.

• **No Structure:** Text files lack a formal structure, making it impossible to **enforce consistency** (e.g., enforcing that a field must be a number).

• **Concurrency:** Simple text files cannot manage simultaneous updates from multiple users. The last update to save will persist, leading to **inconsistent results** because the file lacks concurrency mechanisms.

III. Database Types: Relational vs. Non-Relational

DBMS software is categorized into two major types:

A. Relational Databases

• **Structure:** Organizes data in **tables (rows and columns)**. Relationships between tables are defined using concepts like foreign keys.

• **Schema:** **Strict and predefined schema**. All columns and their data types must be defined beforehand.

• **Advantage:** Offers strong **data integrity** and ensures the data is always in a consistent and accurate state.

• **Query Language:** Uses **SQL (Structured Query Language)**.

• **Examples:** MySQL, **Postgres**, SQL Server.

• **Use Case:** Critical data requiring accuracy and consistency, allowing for complex queries (e.g., **Customer Relationship Management (CRM)** software).

B. Non-Relational (NoSQL) Databases

• **Structure:** Data is typically organized in **collections** (analogous to tables), containing **documents** (analogous to rows).

• **Schema:** **Flexible schema**; does not enforce predefined structure, meaning different documents within the same collection can follow different data structures.

• **Advantage:** Allows developers to move fast, especially during prototyping, without spending time enforcing schema.

• **Example:** MongoDB.

• **Use Case:** Data that is not highly structured or where content type varies widely (e.g., **Content Management System (CMS)** content like articles which may contain images, code blocks, or video embeds).

• **Challenge:** Lack of strong constraints means data integrity must be maintained at the application level, which adds complexity and is more error-prone.

IV. Choosing Postgres and Data Types

A. Rationale for Choosing Postgres

Postgres is often the preferred choice for startups and large companies due to its features:

1. **Open Source and Free:** Not proprietary software.

2. **SQL Standard Compliance:** Sticks to the SQL standard, making it **easy to migrate** to other SQL-compliant systems like MySQL in the future.

3. **Extensibility and Reliability:** Known for reliability, scalability, and an extensive feature set (documentation is around 1,400 pages long).

4. **Excellent JSON Support:** Provides a native **JSONB** (JSON Binary) data type with good indexing and query capabilities. This eliminates the need to switch to a non-relational database solely for handling dynamic, schemaless data (like CMS content).

B. Key Postgres Data Types

|                                                 |                                                                                                                                                                   |                                                                                                                     |
| ----------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Data Type                                       | Description                                                                                                                                                       | Notes                                                                                                               |
| **SERIAL** **/** **BIGSERIAL**                  | Integer type that automatically increments with each new entry. Used for **primary keys**.                                                                        | `BIGSERIAL` is preferred in production for greater capacity.                                                        |
| **DECIMAL** **/** **NUMERIC**                   | Used when **accuracy is critical** (e.g., storing `price` or monetary amounts).                                                                                   | Defines maximum digits and decimal places. Slower to process than floating-point numbers.                           |
| **REAL** **/** **DOUBLE PRECISION** **(Float)** | Used when **accuracy discrepancies do not highly impact the system** (e.g., size or area measurements).                                                           | Floating-point numbers are faster to store and calculate.                                                           |
| **CHAR(n)**                                     | Fixed-length text field. Always pads empty spaces up to the defined length (`n`).                                                                                 | Generally an old standard; only use if the length is strictly fixed (e.g., 2-character codes for days of the week). |
| **VARCHAR(n)**                                  | Variable-length text field. Stores the text without padding, up to the maximum length (`n`).                                                                      | `255` is often used due to MySQL convention but has no special meaning in Postgres.                                 |
| **TEXT**                                        | Modern alternative to `VARCHAR` without an enforced length limit. Postgres recommends using **TEXT** over `VARCHAR(n)` as there is **no performance difference**. | Avoids database migrations needed to increase the length later.                                                     |
| **UUID**                                        | Universally Unique Identifier. A popular choice for table primary keys due to their unique nature.                                                                | Postgres offers a native `UUID` type.                                                                               |
| **JSON** **/** **JSONB**                        | Stores dynamic JSON data. `JSONB` (Binary) is preferred because Postgres serializes it into a native format for **better performance and querying/indexing**.     |                                                                                                                     |

V. Database Change Management: Migrations

Migrations are files containing SQL statements that are applied in a **sequential manner** to manage and track changes to a database schema over time.

• **Workflow:** A command-line tool (e.g., `dbmate`, `go-migrate`) tracks the current database version and executes the SQL files sequentially.

• **Up Migrations:** Contains the SQL statements to apply the desired change (e.g., `CREATE TABLE`, `CREATE INDEX`).

• **Down Migrations:** Contains the SQL statements to **revert** the changes made in the up migration (e.g., `DROP TABLE`, `DROP INDEX`).

• **Purpose of Down Migrations:** Allows developers to **roll back** the database to a previous, consistent state if a new migration causes a failure in a production system.

• **Advantages:** Keeps track of changes, enables rollbacks, and ensures the database schema evolves predictably.

VI. Database Modeling and Relationships

Modeling involves defining tables and the relationships between them, enforced through constraints.

A. Naming Conventions (Postgres Best Practices)

• **Case Sensitivity:** Use **small case** and **snake case** (`full_name`) for all table and field names to avoid using double quotes and complicated case sensitivity issues in application code.

• **Plural Form:** Use the **plural form** for all table names (e.g., `users`, `projects`).

B. Constraints and Referential Integrity

Constraints are conditions applied to fields to protect data integrity and prevent corruption.

|   |   |
|---|---|
|Constraint|Purpose|
|**Primary Key**|Uniquely identifies a row in a table. Implicitly enforces **NOT NULL** and **UNIQUE** constraints.|
|**Not Null**|Ensures a field cannot be set to a null value. Most table fields should have this constraint.|
|**Unique**|Ensures that the value of a field is unique across all rows in the table (e.g., the `email` field in the `users` table).|
|**Foreign Key**|A field that references the primary key of another table. Enforces **Referential Integrity**, ensuring you cannot insert a value that does not exist in the referenced table.|
|**Check**|Allows a custom condition to be set on a field (e.g., enforcing that a `priority` field value is between 1 and 5).|

**Referential Integrity Constraints (Foreign Keys):** Define server behavior when a referenced row is deleted.

• **ON DELETE RESTRICT****:** Prevents the referenced row from being deleted if dependent rows exist (e.g., preventing a user from being deleted if they still own projects).

• **ON DELETE CASCADE****:** Deletes all associated dependent rows when the referenced row is deleted (e.g., deleting a project and all its associated tasks).

• **ON DELETE SET NULL** **/** **ON DELETE SET DEFAULT****:** Sets the foreign key field to `NULL` or a default value upon deletion of the referenced row.

C. Data Relationships

|   |   |   |
|---|---|---|
|Relationship Type|Implementation|Example|
|**One-to-One**|The primary key of the main table is used as **both the primary key and foreign key** in the linked table.|`users` table and `user_profiles` table (used to abstract profile information that is frequently updated).|
|**One-to-Many**|The primary key of the "one" side is used as a **foreign key** in the "many" side.|`projects` table (one) and `tasks` table (many).|
|**Many-to-Many**|Implemented using a **linking table** (e.g., `project_members`) which stores foreign keys from both linked tables.|`users` table and `projects` table.|
|**Composite Primary Key**|The linking table uses a combination of the two foreign keys (e.g., `project_id` + `user_id`) as its primary key to ensure that combination is unique (e.g., a user can only be part of a project once).||

VII. Querying and Security

A. Seeding Data

Seeding is the process of writing a script (often a migration file) to insert **test data** into the database for testing purposes in development environments.

B. Querying Multiple Tables with Joins

• **JOIN** **(Inner Join):** Returns rows only if there are **matching entries in both tables**.

• **LEFT JOIN****:** Returns all rows from the left table (first table listed) and the matching rows from the right table. If no match exists, it returns `NULL` values for the right table's fields. This is used when you need the data from the primary table regardless of whether the related data exists (e.g., fetching user data even if they lack a profile entry).

C. Parameterized Queries and SQL Injection Defense

A parameterized query is a **safety mechanism** where empty slots are defined in the query, and the dynamic values are provided separately.

• **Security:** Any information passed into the slot is treated as a literal **string** (it is "escaped") and cannot be interpreted as a database action or SQL command.

• **SQL Injection:** This mechanism prevents **SQL injection vulnerabilities**, which occur when dynamic values are constructed by concatenating strings, allowing attackers to insert malicious SQL commands into the query.

D. Dynamic Filters and Sorting

APIs returning lists of entities (e.g., `GET /users`) typically support dynamic filtering and sorting via query parameters.

• **Construction:** Backend code dynamically constructs the SQL query based on what parameters the client provides.

• **Defaults:** If the client does not provide sorting or pagination parameters, the server applies **sane defaults** (e.g., sorting by `created_at` descending, limiting results to 10).

• **Filtering Example:** Using the `ILIKE` operator with a parameterized query and the percentage symbol (`%`) allows for case-insensitive pattern matching (e.g., `WHERE full_name ILIKE 'J%'` finds all names starting with 'J').

• **Pagination:** Implemented using `OFFSET` and `LIMIT` clauses. The frontend page number (starting at 1) must be converted to the database `OFFSET` (starting at 0).

VIII. Performance and Automation

A. Database Indexing (Indices)

Indexing is a feature that drastically improves query performance by avoiding sequential database scans.

• **Concept:** An index is a separate **lookup table** (like the index of a book) that stores a particular field's value and the direct **physical disk location** of the corresponding row.

• **Mechanism:** Instead of sequentially checking every row's data across the disk (a time-consuming process for large tables), the database checks the index first. Once the entry is found in the index, the database can instantly retrieve the row's exact location and access it directly.

• **When to Index:** Indexing is crucial for any field frequently used in three scenarios:

    1. **Join Conditions:** Fields used to link tables (e.g., foreign keys like `project_id` in the `tasks` table).

    2. **WHERE** **Clauses:** Fields used for filtering (e.g., `status`).

    3. **Sort Conditions:** Fields used for ordering results (e.g., `created_at` in descending order).

• **Trade-off:** Maintaining an index requires the database to perform an overhead operation on every insert or update to keep the index lookup table current. This overhead must be evaluated against the performance gain in query speed. Primary key fields are indexed automatically by default.

B. Triggers

Triggers are a database feature used to automate actions when a specific condition is met.

• **Use Case:** Automatically updating the **updated_at** timestamp column every time a row is modified.

• **Implementation:** A custom function is created (e.g., to set `updated_at` to the current time stamp), and a trigger is attached to the desired table(s) to execute this function on every `UPDATE` operation. This removes the need for manual updating via application code.

---

### I. Definition and Importance of Caching

Caching is a fundamental mechanism used to enhance the performance and efficiency of applications by reducing the time and effort required to perform work.

- **Technical Definition:** Caching involves keeping a **subset** of primary data in a location that is **faster and easier to access**. The selection of this subset depends on parameters like frequency of use and probability of next use.
- **Impact:** Caching is a huge factor in high-performance applications that need to track latency in two-digit microseconds or milliseconds.
- **Key Scenarios for Caching:** Caching is typically resorted to in two common scenarios where developers want to avoid:
    1. **Heavy Computation:** Avoiding running resource-intensive algorithms repeatedly (e.g., ranking algorithms).
    2. **Sending Large Amounts of Data:** Avoiding transferring huge payloads repeatedly (e.g., video files).

### II. Real-World Examples

|Platform|Challenge|Caching Solution and Mechanism|
|:--|:--|:--|
|**Google Search**|Search queries (like "what is the weather today") are searched millions of times, requiring expensive re-computation involving crawling, indexing, and ranking of billions of web pages.|Google uses a **distributed in-memory caching system** spread across the world. If a query result is found in the cache (**cache hit**), it returns instantly, avoiding the need to recompute results and lowering server load. If the data is not found (**cache miss**), it is computed and then cached for subsequent use.|
|**Netflix**|Delivering hundreds and thousands of terabytes of content (movies, series) to millions of global users with minimal buffering.|Netflix uses **CDN (Content Delivery Network)**, which serves content from **Edge locations/servers** that are geographically closer to the end users. This minimizes latency compared to accessing the originating server, which might be in the US. Netflix caches a **subset** of its content based on algorithms (like trend analysis) to optimize cost and resources.|
|**X (Twitter)**|Identifying trending topics requires analyzing billions of tweets in real-time, involving expensive machine learning and GPU-intensive computations.|To avoid repeating this computation for every user accessing the trending section, Twitter **caches** the results. Since trends typically remain stable for hours or days, caching is safe. This data is stored in an **in-memory key-value store** like Redis.|

### III. Levels of Caching in Backend Engineering

As a backend engineer, you will most frequently encounter three levels of caching:

1. **Network Level Caching:** Involves external infrastructure and network components.
2. **Hardware Level Caching:** Involves CPU and primary memory architecture.
3. **Software-Based Caching:** Uses software and libraries (like Redis) to interact with hardware-based primary memory.

### IV. Network Level Caching: CDN and DNS

#### A. Content Delivery Networks (CDNs)

CDNs cache content on geographically distributed servers, often called **Edge nodes** or **Edge servers**, to minimize latency for users in that region.

- **Workflow:**
    1. User enters a URL, triggering a DNS query to resolve the domain name.
    2. The CDN DNS system routes the request to the nearest **POP (Point of Presence)**, which is a concentration of multiple Edge servers. Routing considers the user’s geographic location and network conditions (e.g., routing users with slow connections to POPs holding lower-quality video versions).
    3. The Edge server checks its cache.
    4. If a **Cache Hit** occurs, the content is returned instantly.
    5. If a **Cache Miss** occurs, the Edge server fetches the content from the centralized **originating server**.
- **Time To Live (TTL):** CDNs use TTL to define how long content should remain cached. When TTL expires, the next request will trigger a fetch of fresh content from the originating server.

#### B. DNS Query Caching

The DNS (Domain Name System) process relies heavily on caching to minimize the work required to recursively find the IP address corresponding to a domain name.

- **DNS Resolution Hierarchy:** When a user enters a domain (`example.com`), the resolution path involves checking multiple caches and escalating the query:
    1. **User Device/OS Cache:** The operating system (Windows, Mac, Linux) checks its local DNS cache first.
    2. **Browser Cache:** If the OS misses, the modern web browser (Chrome, Firefox) checks its own DNS cache.
    3. **Recursive Resolver Cache:** The query is sent to the recursive resolver (provided by the ISP or a public DNS provider like Google DNS). This resolver maintains its own cache to avoid recursively querying root servers, TLD servers, and authoritative name servers repeatedly.

### V. Hardware Level Caching and In-Memory Storage

Caching is implemented at the hardware level (L1, L2, L3 caches) to speed up CPU-level operations by storing frequently accessed or predicted data.

- **Primary vs. Secondary Storage:**
    - **RAM (Random Access Memory) / Main Memory (Primary Storage):** Used by major caching technologies like Redis/Memcached because data access is very fast (due to electrical signal access to memory addresses). RAM offers **fast random access** time but has **limited capacity** and is **volatile** (data clears when power is off).
    - **Hard Disk/SSDs (Secondary Storage):** Slower than RAM (often involving mechanical or complex operations) but offers **higher capacity** and **persistence** (data survives power loss).
- **In-Memory Database Persistence:** Technologies like Redis use RAM for high-speed data access but implement mechanisms behind the scenes to leverage **secondary storage** (disk) for **persistence**. Data is loaded from disk into RAM when the program starts.

### VI. Software Caching: In-Memory Key-Value Stores

Technologies like **Redis** and **Memcached** are known as **in-memory key-value based NoSQL databases**.

- **In-Memory:** They store data in the main memory (RAM) instead of traditional disks, making data access operations very fast.
- **Key-Value:** They have a simple structure of keys and values, unlike relational databases with strict schema and tables.
- **Simplicity:** Accessing these caches is straightforward (provide key, get value) without the complexity of SQL queries or aggregation.

### VII. Caching Strategies

Backend engineers use different strategies to manage how data enters and is updated in the cache:

1. **Lazy Caching (Cache Aside):**
    
    - The server checks the cache upon request.
    - If there is a cache miss, the server fetches the data from the primary database, **stores it in the cache**, and then returns the result to the client.
    - This is called "lazy" because data is cached only when it is actually requested.
2. **Write-Through Caching:**
    
    - This is an update strategy where a database change (e.g., POST, PUT, PATCH call) is simultaneously applied to both the **primary database and the cache** within the same execution flow.
    - **Advantage:** The cache is always fresh, as it is updated instantly.
    - **Disadvantage:** Introduces overhead to the write operation, as two separate updates must occur.

### VIII. Eviction Policies

Due to the limited capacity of primary memory, eviction policies determine which data must be deleted from the cache when it becomes full, making space for new, high-priority data.

|Policy|Mechanism|Description|
|:--|:--|:--|
|**No Eviction**|No policy is configured.|Insertion fails with a memory-full error when capacity is reached.|
|**LRU (Least Recently Used)**|Tracks the last access time of each key.|Deletes the data point that was **accessed the longest time ago**.|
|**LFU (Least Frequently Used)**|Tracks the frequency of access for each key.|Deletes the data point that has been **accessed the least number of times** so far.|
|**TTL (Time to Live) Based**|Uses the configured expiration time of keys.|Selects the key that is scheduled to **expire soonest** to remove from the cache.|

### IX. Backend Use Cases for In-Memory Caches

Backend engineers frequently use in-memory databases like Redis for specific, performance-critical tasks:

1. **Database Query Caching:**
    
    - Caching the results of **compute-intensive database queries** (e.g., heavy joins, complex aggregations) that are frequently executed (e.g., dashboard or landing page APIs).
    - This reduces the latency of the API call and significantly decreases the load on the primary relational database.
    - It is most effective for **read-heavy operations** where the underlying data changes infrequently (e.g., caching static product details or user profile information).
2. **Session Storing:**
    
    - Storing authentication-related session tokens for users after successful login.
    - Since data retrieval from Redis is much faster than from disk-based databases, storing sessions in memory avoids latency in subsequent API calls and reduces constant load on the database.
3. **External API Caching:**
    
    - Caching responses from external services (e.g., weather APIs) with a defined TTL (e.g., one hour).
    - This prevents the server from making repeated requests to the external API, thereby decreasing billing costs and avoiding rate limit constraints, especially for data that is not real-time.
4. **Rate Limiting Mechanism:**
    
    - Rate limiting is typically implemented in a **middleware** before the main route/controller logic.
    - The middleware identifies the client's public IP (often using the `X-Forwarded-For` header) and uses an in-memory cache to maintain a **counter** for that IP within a time window (e.g., 50 requests per minute).
    - Storing this counter in Redis is essential because storing it in a relational database would require a database call for _every_ incoming request, significantly increasing latency and flooding the database.
    - If the counter exceeds the limit, the request is blocked, and a **429 Too Many Requests** status code is returned.
