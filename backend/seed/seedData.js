require("dotenv").config();

const connectDB = require("../config/db");
const Category = require("../models/category");
const Quiz = require("../models/quiz");
const Question = require("../models/question");

// =====================================================
// SAFE ADDITIVE SEED
// - Existing data is NEVER deleted or overwritten.
// - Missing categories/quizzes/questions are added.
// - A quiz will NEVER receive more than 20 questions.
// =====================================================

const categories = [
    ["JavaScript", "JavaScript programming and web development."],
    ["React.js", "React components, hooks, state and modern React development."],
    ["Node.js", "Node.js and Express.js backend development."],
    ["Python", "Python programming and object-oriented programming."],
    ["Java", "Java programming and object-oriented programming."],
    ["DBMS", "Database management systems and SQL."],
    ["DSA", "Data structures, algorithms and problem solving."],
    ["HTML & CSS", "HTML, CSS and responsive web development."],
    ["MongoDB", "MongoDB and NoSQL database concepts."],
    ["Computer Networks", "Networking concepts, protocols and TCP/IP."]
];

const quizList = [
    ["JavaScript Fundamentals", "JavaScript", "Test your knowledge of JavaScript fundamentals.", "EASY", 15],
    ["Advanced JavaScript", "JavaScript", "Test your knowledge of advanced JavaScript.", "HARD", 20],

    ["React Fundamentals", "React.js", "Test your knowledge of React fundamentals.", "EASY", 15],
    ["Advanced React", "React.js", "Test your knowledge of advanced React.", "HARD", 20],

    ["Node.js Fundamentals", "Node.js", "Test your knowledge of Node.js fundamentals.", "EASY", 15],
    ["Express.js & REST APIs", "Node.js", "Test your knowledge of Express.js and REST APIs.", "MEDIUM", 20],

    ["Python Fundamentals", "Python", "Test your knowledge of Python fundamentals.", "EASY", 15],
    ["Advanced Python", "Python", "Test your knowledge of advanced Python.", "HARD", 20],

    ["Java Fundamentals", "Java", "Test your knowledge of Java fundamentals.", "EASY", 15],
    ["Advanced Java & OOP", "Java", "Test your knowledge of advanced Java and OOP.", "HARD", 20],

    ["DBMS Fundamentals", "DBMS", "Test your knowledge of DBMS concepts.", "EASY", 15],
    ["SQL & Queries", "DBMS", "Test your knowledge of SQL queries.", "MEDIUM", 20],

    ["Data Structures Fundamentals", "DSA", "Test your knowledge of data structures.", "MEDIUM", 20],
    ["Algorithms Fundamentals", "DSA", "Test your knowledge of algorithms.", "HARD", 25],

    ["Web Fundamentals", "HTML & CSS", "Test your knowledge of HTML and CSS.", "EASY", 15],
    ["Advanced CSS", "HTML & CSS", "Test your knowledge of advanced CSS.", "MEDIUM", 20],

    ["MongoDB Fundamentals", "MongoDB", "Test your knowledge of MongoDB fundamentals.", "EASY", 15],
    ["MongoDB Advanced", "MongoDB", "Test your knowledge of advanced MongoDB.", "HARD", 20],

    ["Computer Networks Fundamentals", "Computer Networks", "Test your knowledge of networking fundamentals.", "EASY", 15],
    ["Advanced Networking", "Computer Networks", "Test your knowledge of advanced networking.", "HARD", 20]
];

// =====================================================
// QUESTION BANK
// Maximum 20 questions per quiz
// =====================================================

const bank = {

    "JavaScript": [
        ["Which keyword declares a block-scoped variable?", ["let", "var", "int", "define"], 0, "let creates a block-scoped variable.", "EASY"],
        ["Which operator checks both value and type?", ["=", "==", "===", "!="], 2, "=== performs strict equality.", "EASY"],
        ["Which method adds an item to the end of an array?", ["push()", "pop()", "shift()", "slice()"], 0, "push() adds an item to the end.", "EASY"],
        ["Which method removes the last array item?", ["pop()", "push()", "shift()", "unshift()"], 0, "pop() removes the last item.", "EASY"],
        ["Which data type represents true or false?", ["Boolean", "String", "Number", "Object"], 0, "Boolean represents true or false.", "EASY"],
        ["Which method converts JSON text into an object?", ["JSON.parse()", "JSON.stringify()", "JSON.object()", "JSON.convert()"], 0, "JSON.parse() parses JSON text.", "EASY"],
        ["Which method converts an object into JSON text?", ["JSON.stringify()", "JSON.parse()", "JSON.text()", "JSON.convert()"], 0, "JSON.stringify() creates JSON text.", "EASY"],
        ["Which keyword defines a function?", ["function", "def", "func", "method"], 0, "JavaScript uses function declarations.", "EASY"],
        ["Which syntax is used for arrow functions?", ["=>", "->", "::", "==>"], 0, "Arrow functions use =>.", "EASY"],
        ["What does DOM stand for?", ["Document Object Model", "Data Object Model", "Document Order Method", "Digital Object Model"], 0, "DOM means Document Object Model.", "EASY"],
        ["Which method selects an element by id?", ["getElementById()", "queryById()", "selectId()", "findId()"], 0, "getElementById() selects an element by id.", "EASY"],
        ["Which keyword prevents reassignment of a binding?", ["const", "let", "var", "fixed"], 0, "const prevents reassignment.", "MEDIUM"],
        ["What is the spread operator?", ["...", "***", "::", "=>"], 0, "The spread operator uses three dots.", "MEDIUM"],
        ["Which method transforms every array item?", ["map()", "forEach()", "push()", "join()"], 0, "map() returns a transformed array.", "MEDIUM"],
        ["Which method keeps elements matching a condition?", ["filter()", "map()", "reduce()", "findAll()"], 0, "filter() returns matching elements.", "MEDIUM"],
        ["Which method reduces an array to one value?", ["reduce()", "map()", "filter()", "joinAll()"], 0, "reduce() accumulates an array into one result.", "MEDIUM"],
        ["What does a Promise represent?", ["A future asynchronous result", "A loop", "A variable", "A class only"], 0, "A Promise represents a future asynchronous result.", "MEDIUM"],
        ["Which keyword waits for a Promise inside async code?", ["await", "wait", "yield", "pause"], 0, "await waits for a Promise to settle.", "MEDIUM"],
        ["What is a closure?", ["A function retaining access to its lexical scope", "A closed browser window", "A class constructor", "A loop"], 0, "A closure retains access to its lexical environment.", "HARD"],
        ["Which method finds the first matching array element?", ["find()", "search()", "first()", "match()"], 0, "find() returns the first matching element.", "MEDIUM"]
    ],

    "React.js": [
        ["What syntax is commonly used in React components?", ["JSX", "SQL", "PHP", "CSS only"], 0, "JSX is commonly used to describe UI.", "EASY"],
        ["Which hook manages state?", ["useState", "useData", "useValue", "useComponent"], 0, "useState manages component state.", "EASY"],
        ["Which hook handles side effects?", ["useEffect", "useState", "useSide", "useAction"], 0, "useEffect handles side effects.", "EASY"],
        ["What are props used for?", ["Passing data to components", "Creating databases", "Styling only", "Running SQL"], 0, "Props pass data into components.", "EASY"],
        ["Which library is commonly used for React routing?", ["React Router", "Express Router", "Mongo Router", "Node Router"], 0, "React Router is commonly used for client-side routing.", "EASY"],
        ["What is a React component?", ["A reusable UI building block", "A database", "An HTTP server", "A CSS property"], 0, "Components are reusable UI building blocks.", "EASY"],
        ["What is a key used for in React lists?", ["Identifying list elements", "Styling elements", "Routing", "Database access"], 0, "Keys help React identify list items.", "EASY"],
        ["What does state represent?", ["Data managed by a component", "A CSS rule", "A database table", "A URL"], 0, "State is data managed by a component.", "EASY"],
        ["What is JSX?", ["A JavaScript syntax extension for UI", "A database language", "A CSS framework", "A server protocol"], 0, "JSX is a JavaScript syntax extension.", "EASY"],
        ["Can a component receive data through props?", ["Yes", "No", "Only from MongoDB", "Only from CSS"], 0, "Components can receive data through props.", "EASY"],
        ["Which hook memoizes a calculated value?", ["useMemo", "useState", "useEffect", "useRef"], 0, "useMemo memoizes a calculated value.", "MEDIUM"],
        ["Which hook memoizes a function?", ["useCallback", "useMemo", "useFunction", "useHandler"], 0, "useCallback memoizes a function reference.", "MEDIUM"],
        ["Which API shares values without manually passing props?", ["Context API", "Fetch API", "History API", "Storage API"], 0, "Context API provides shared values.", "MEDIUM"],
        ["What is a Fragment used for?", ["Grouping elements without an extra DOM node", "Creating routes", "Fetching data", "Managing state"], 0, "Fragments group elements without an extra wrapper node.", "MEDIUM"],
        ["Which hook can access a DOM node directly?", ["useRef", "useDOM", "useElement", "useNode"], 0, "useRef can hold a DOM reference.", "MEDIUM"],
        ["What is lifting state up?", ["Moving shared state to a common parent", "Deleting state", "Moving state to CSS", "Sending state to MongoDB"], 0, "Shared state is moved to the closest common parent.", "MEDIUM"],
        ["What is conditional rendering?", ["Rendering UI based on a condition", "Rendering only CSS", "Creating a database", "Compiling JSX"], 0, "Conditional rendering displays UI according to conditions.", "EASY"],
        ["What is reconciliation?", ["React's process of updating the UI efficiently", "Database synchronization", "HTTP routing", "CSS compilation"], 0, "React compares UI representations to update efficiently.", "HARD"],
        ["What is a controlled input?", ["An input whose value is controlled by React state", "An input controlled by CSS", "An input without a value", "A database input"], 0, "A controlled input gets its value from React state.", "MEDIUM"],
        ["Why should hooks be called at the top level?", ["To preserve consistent hook ordering", "For CSS", "For database access", "For routing"], 0, "Consistent ordering lets React associate hook state correctly.", "HARD"]
    ],

    "Node.js": [
        ["Node.js uses which JavaScript engine?", ["V8", "SpiderMonkey", "Chakra", "JavaEngine"], 0, "Node.js uses Google's V8 engine.", "EASY"],
        ["Which command initializes a Node project?", ["npm init", "node init", "npm create", "node start"], 0, "npm init creates package.json.", "EASY"],
        ["Which file stores project dependencies?", ["package.json", "index.html", "server.json", "node.config"], 0, "package.json stores dependencies and metadata.", "EASY"],
        ["Which built-in module creates HTTP servers?", ["http", "server", "web", "network"], 0, "Node provides the http module.", "EASY"],
        ["Which function imports a CommonJS module?", ["require()", "include()", "load()", "module()"], 0, "require() loads CommonJS modules.", "EASY"],
        ["What is npm?", ["Node Package Manager", "Node Program Method", "Network Package Manager", "New Project Manager"], 0, "npm is the Node Package Manager.", "EASY"],
        ["Which object contains command-line arguments?", ["process.argv", "process.args", "node.argv", "console.argv"], 0, "process.argv contains command-line arguments.", "EASY"],
        ["Which module handles file operations?", ["fs", "file", "files", "pathfile"], 0, "fs provides filesystem operations.", "EASY"],
        ["Which module handles file paths?", ["path", "route", "urlpath", "directory"], 0, "path provides path utilities.", "EASY"],
        ["Which method starts a server listening for requests?", ["listen()", "start()", "serve()", "run()"], 0, "listen() starts a server.", "EASY"],
        ["What is the event loop?", ["A mechanism for handling asynchronous callbacks", "A database", "A compiler", "A CSS system"], 0, "The event loop coordinates asynchronous operations.", "MEDIUM"],
        ["What does non-blocking I/O mean?", ["I/O can continue without blocking other work", "I/O is disabled", "Only synchronous code runs", "Files cannot be read"], 0, "Non-blocking I/O allows other work to continue.", "MEDIUM"],
        ["Which object exports a CommonJS value?", ["module.exports", "export.default", "exports.only", "module.send"], 0, "module.exports defines a CommonJS export.", "EASY"],
        ["What is a callback?", ["A function passed to another function", "A database", "A route", "A package"], 0, "A callback is a function supplied for later execution.", "EASY"],
        ["Which command installs a dependency?", ["npm install", "npm add-only", "node install", "npm dependency"], 0, "npm install installs packages.", "EASY"],
        ["What is Express?", ["A Node.js web framework", "A database", "A browser", "A CSS library"], 0, "Express is a web framework for Node.js.", "EASY"],
        ["Which HTTP method usually retrieves data?", ["GET", "POST", "PATCH", "DELETE"], 0, "GET generally retrieves resources.", "EASY"],
        ["Which HTTP method usually creates a resource?", ["POST", "GET", "DELETE", "HEAD"], 0, "POST commonly creates resources.", "EASY"],
        ["What is middleware?", ["A function in the request-response cycle", "A database table", "A CSS class", "A React component"], 0, "Middleware runs during request processing.", "MEDIUM"],
        ["Which status code means resource created?", ["201", "200", "404", "500"], 0, "201 indicates successful creation.", "EASY"]
    ],

    "Python": [
        ["Which keyword defines a function?", ["def", "function", "func", "define"], 0, "Python uses def.", "EASY"],
        ["Which structure stores key-value pairs?", ["Dictionary", "List", "Tuple", "Set"], 0, "Dictionaries store key-value pairs.", "EASY"],
        ["Which symbol starts a comment?", ["#", "//", "/*", "--"], 0, "# starts a Python comment.", "EASY"],
        ["Which function returns length?", ["len()", "size()", "length()", "count()"], 0, "len() returns the number of items.", "EASY"],
        ["Which keyword creates a class?", ["class", "object", "struct", "define"], 0, "class defines a class.", "EASY"],
        ["Which type is immutable?", ["Tuple", "List", "Dictionary", "Set"], 0, "Tuples are immutable.", "EASY"],
        ["Which keyword handles exceptions?", ["except", "catch", "handle", "error"], 0, "except handles exceptions.", "EASY"],
        ["Which keyword produces a generator value?", ["yield", "return", "generate", "next"], 0, "yield produces generator values.", "MEDIUM"],
        ["Which operator performs exponentiation?", ["**", "^", "^^", "//"], 0, "** is Python's exponentiation operator.", "EASY"],
        ["Which value represents no value?", ["None", "null", "nil", "empty"], 0, "None represents absence of a value.", "EASY"],
        ["Which function converts a value to an integer?", ["int()", "integer()", "toInt()", "number()"], 0, "int() converts compatible values to integers.", "EASY"],
        ["Which collection contains unique elements?", ["set", "list", "tuple", "string"], 0, "Sets contain unique elements.", "EASY"],
        ["Which keyword imports a module?", ["import", "include", "require", "using"], 0, "import loads modules.", "EASY"],
        ["What does self refer to?", ["The current object instance", "The parent module", "The database", "The function itself"], 0, "self refers to the current instance.", "MEDIUM"],
        ["Which module provides regular expressions?", ["re", "regex", "regexp", "pattern"], 0, "The re module provides regular expressions.", "MEDIUM"],
        ["Which block is used for cleanup?", ["finally", "always", "last", "finish"], 0, "finally is used for cleanup code.", "MEDIUM"],
        ["What is a lambda?", ["An anonymous function", "A class", "A package", "A loop"], 0, "lambda creates an anonymous function.", "MEDIUM"],
        ["What is list comprehension?", ["Compact syntax for creating lists", "A database query", "A class definition", "A loop only"], 0, "List comprehensions provide compact list creation.", "MEDIUM"],
        ["What does PEP 8 describe?", ["Python style guidelines", "Database rules", "Networking rules", "Packaging only"], 0, "PEP 8 provides Python style recommendations.", "MEDIUM"],
        ["Which keyword exits a loop immediately?", ["break", "stop", "exitLoop", "end"], 0, "break exits the loop.", "EASY"]
    ],

    "Java": [
        ["Which keyword defines a class?", ["class", "define", "struct", "object"], 0, "class defines a Java class.", "EASY"],
        ["What is the Java entry point?", ["main()", "start()", "run()", "execute()"], 0, "Execution commonly begins in main().", "EASY"],
        ["Which keyword creates an object?", ["new", "create", "object", "instance"], 0, "new creates an object.", "EASY"],
        ["Which type stores true or false?", ["boolean", "bool", "bit", "logical"], 0, "boolean stores true or false.", "EASY"],
        ["Which keyword is used for class inheritance?", ["extends", "inherits", "super", "parent"], 0, "extends is used for class inheritance.", "EASY"],
        ["Which keyword prevents a class from being extended?", ["final", "static", "private", "constant"], 0, "A final class cannot be extended.", "MEDIUM"],
        ["Which collection does not allow duplicates?", ["Set", "List", "Queue", "ArrayList"], 0, "Set does not allow duplicates.", "EASY"],
        ["Which keyword handles an exception?", ["catch", "handle", "error", "exception"], 0, "catch handles exceptions.", "EASY"],
        ["Which principle hides implementation details?", ["Abstraction", "Inheritance", "Polymorphism", "Compilation"], 0, "Abstraction hides unnecessary implementation details.", "MEDIUM"],
        ["Which principle bundles data and methods?", ["Encapsulation", "Inheritance", "Polymorphism", "Compilation"], 0, "Encapsulation bundles data and behavior.", "MEDIUM"],
        ["Which feature allows different implementations?", ["Polymorphism", "Compilation", "Casting", "Packaging"], 0, "Polymorphism supports different implementations.", "MEDIUM"],
        ["Which keyword refers to the current object?", ["this", "self", "current", "object"], 0, "this refers to the current object.", "EASY"],
        ["Which keyword refers to the parent class?", ["super", "parent", "base", "this"], 0, "super refers to the parent class.", "EASY"],
        ["Which interface defines natural ordering?", ["Comparable", "Sortable", "Ordering", "SortInterface"], 0, "Comparable defines natural ordering.", "MEDIUM"],
        ["Which collection allows duplicates and preserves order?", ["ArrayList", "HashSet", "TreeSet", "Map"], 0, "ArrayList allows duplicates and preserves order.", "EASY"],
        ["Which is a checked exception?", ["IOException", "ArithmeticException", "NullPointerException", "ArrayIndexOutOfBoundsException"], 0, "IOException is checked.", "MEDIUM"],
        ["What is method overloading?", ["Same method name with different parameter lists", "Changing a variable", "Hiding fields", "Deleting a method"], 0, "Overloading uses different parameter lists.", "MEDIUM"],
        ["What is method overriding?", ["Subclass providing a new implementation of an inherited method", "Creating two constructors", "Changing a variable", "Deleting a method"], 0, "Overriding changes inherited behavior.", "MEDIUM"],
        ["Which keyword makes a member belong to the class?", ["static", "class", "shared", "global"], 0, "static members belong to the class.", "EASY"],
        ["Which package contains ArrayList?", ["java.util", "java.lang", "java.io", "java.net"], 0, "ArrayList is in java.util.", "EASY"]
    ],

    "DBMS": [
        ["What does DBMS stand for?", ["Database Management System", "Data Backup Management System", "Database Machine System", "Data Management Service"], 0, "DBMS means Database Management System.", "EASY"],
        ["Which key uniquely identifies a row?", ["Primary Key", "Foreign Key", "Candidate Key", "Secondary Key"], 0, "A primary key uniquely identifies a row.", "EASY"],
        ["Which key links related tables?", ["Foreign Key", "Primary Key", "Unique Key", "Super Key"], 0, "A foreign key references another table's key.", "EASY"],
        ["Why is normalization used?", ["Reducing redundancy", "Increasing duplication", "Deleting tables", "Increasing file size"], 0, "Normalization reduces redundancy and anomalies.", "MEDIUM"],
        ["Which language is used with relational databases?", ["SQL", "HTML", "CSS", "XML"], 0, "SQL is used with relational databases.", "EASY"],
        ["What is a candidate key?", ["A minimal key that uniquely identifies a row", "Any duplicate field", "A foreign table", "A non-unique column"], 0, "A candidate key is a minimal unique identifier.", "MEDIUM"],
        ["What is a super key?", ["A set of attributes that uniquely identifies a row", "Only the primary key", "A foreign key", "A database name"], 0, "A super key uniquely identifies rows.", "MEDIUM"],
        ["Which normal form removes partial dependency?", ["2NF", "1NF", "3NF", "BCNF"], 0, "2NF removes partial dependency.", "MEDIUM"],
        ["Which normal form removes transitive dependency?", ["3NF", "1NF", "2NF", "4NF"], 0, "3NF addresses transitive dependency.", "MEDIUM"],
        ["What does ACID describe?", ["Transaction properties", "Database users", "SQL syntax", "Network protocols"], 0, "ACID describes transaction properties.", "MEDIUM"],
        ["What does atomicity mean?", ["A transaction is all-or-nothing", "Transactions are duplicated", "Data is encrypted", "Queries are indexed"], 0, "Atomicity means all operations succeed or none do.", "MEDIUM"],
        ["What does consistency mean?", ["A transaction preserves valid database rules", "Users see the same screen", "Queries run quickly", "Data is compressed"], 0, "Consistency preserves database constraints.", "MEDIUM"],
        ["What does isolation provide?", ["Transactions do not improperly interfere", "Data is deleted", "Queries are cached", "Tables are merged"], 0, "Isolation controls concurrent transaction interaction.", "MEDIUM"],
        ["What does durability mean?", ["Committed changes persist", "Queries are temporary", "Tables are immutable", "Data is duplicated"], 0, "Durability means committed changes survive failures.", "MEDIUM"],
        ["Which command creates a table?", ["CREATE TABLE", "MAKE TABLE", "NEW TABLE", "ADD TABLE"], 0, "CREATE TABLE creates a table.", "EASY"],
        ["Which command modifies table structure?", ["ALTER", "CHANGE TABLE", "MODIFY TABLE", "UPDATE TABLE"], 0, "ALTER changes table structure.", "EASY"],
        ["Which command removes rows?", ["DELETE", "DROP", "REMOVE", "CLEAR"], 0, "DELETE removes rows.", "EASY"],
        ["Which constraint prevents duplicate values?", ["UNIQUE", "DISTINCT", "ONLY", "SINGLE"], 0, "UNIQUE prevents duplicate values.", "EASY"],
        ["Which constraint requires a value?", ["NOT NULL", "REQUIRED", "MANDATORY", "VALUE"], 0, "NOT NULL prevents null values.", "EASY"],
        ["What is an index used for?", ["Improving query lookup performance", "Storing passwords", "Creating users", "Deleting duplicates"], 0, "Indexes can speed up lookups.", "MEDIUM"]
    ],

    "DSA": [
        ["Which structure follows LIFO?", ["Stack", "Queue", "Array", "Graph"], 0, "Stack follows LIFO.", "EASY"],
        ["Which structure follows FIFO?", ["Queue", "Stack", "Tree", "Heap"], 0, "Queue follows FIFO.", "EASY"],
        ["What consists of vertices and edges?", ["Graph", "Array", "Stack", "Queue"], 0, "A graph has vertices and edges.", "EASY"],
        ["Which tree has at most two children?", ["Binary Tree", "B-Tree", "Graph", "Heap only"], 0, "A binary tree has at most two children.", "EASY"],
        ["Which structure provides direct index access?", ["Array", "Linked List", "Stack", "Queue"], 0, "Arrays provide direct indexed access.", "EASY"],
        ["Which search halves a sorted search space?", ["Binary Search", "Linear Search", "DFS", "BFS"], 0, "Binary search repeatedly halves the range.", "MEDIUM"],
        ["What is binary search complexity?", ["O(log n)", "O(n)", "O(n log n)", "O(1)"], 0, "Binary search is O(log n).", "MEDIUM"],
        ["What is linear search complexity?", ["O(n)", "O(log n)", "O(1)", "O(n log n)"], 0, "Linear search may inspect every element.", "EASY"],
        ["Which sort uses divide and conquer?", ["Merge Sort", "Bubble Sort", "Linear Search", "Counting Sort"], 0, "Merge Sort uses divide and conquer.", "MEDIUM"],
        ["Average Quick Sort complexity is:", ["O(n log n)", "O(n)", "O(n²)", "O(log n)"], 0, "Average Quick Sort complexity is O(n log n).", "MEDIUM"],
        ["Which traversal uses a queue?", ["BFS", "DFS", "Inorder", "Postorder"], 0, "BFS commonly uses a queue.", "MEDIUM"],
        ["Which traversal commonly uses a stack?", ["DFS", "BFS", "Level Order", "Counting"], 0, "DFS can use a stack.", "MEDIUM"],
        ["Which BST traversal gives sorted order?", ["Inorder", "Preorder", "Postorder", "Level order"], 0, "Inorder traversal of a BST is sorted.", "MEDIUM"],
        ["Which structure is used for priority queues?", ["Heap", "Stack", "Linked List only", "Array only"], 0, "A heap is commonly used for priority queues.", "MEDIUM"],
        ["A linked-list node normally contains:", ["Data and a link/reference", "Only data", "Only pointer", "Two arrays"], 0, "A node stores data and a link/reference.", "EASY"],
        ["What is recursion?", ["A function calling itself", "A sorting method", "A database operation", "A graph only"], 0, "Recursion is self-referential function execution.", "EASY"],
        ["What is dynamic programming?", ["Storing solutions to overlapping subproblems", "Only recursion", "Only sorting", "Graph traversal"], 0, "DP stores results of overlapping subproblems.", "HARD"],
        ["What is a greedy algorithm?", ["A locally optimal choice at each step", "Always recursion", "Always incorrect", "Only arrays"], 0, "Greedy algorithms make locally optimal choices.", "MEDIUM"],
        ["What does Big-O describe?", ["Asymptotic resource growth", "Exact runtime", "A language", "Database size"], 0, "Big-O describes asymptotic growth.", "EASY"],
        ["What is a hash table used for?", ["Fast key-based lookup", "Sorting only", "Graph traversal", "Image processing"], 0, "Hash tables provide fast average key lookup.", "EASY"]
    ],

    "HTML & CSS": [
        ["What does HTML stand for?", ["HyperText Markup Language", "HighText Machine Language", "Hyperlink Text Management Language", "Home Tool Markup Language"], 0, "HTML stands for HyperText Markup Language.", "EASY"],
        ["Which tag creates a hyperlink?", ["<a>", "<link>", "<href>", "<url>"], 0, "The a element creates links.", "EASY"],
        ["Which property changes text color?", ["color", "font-color", "text-color", "foreground"], 0, "color changes text color.", "EASY"],
        ["Which tag creates the largest heading?", ["<h1>", "<h6>", "<heading>", "<head>"], 0, "h1 is the largest standard heading.", "EASY"],
        ["Which property changes background color?", ["background-color", "bgcolor", "background-text", "color-background"], 0, "background-color changes the background color.", "EASY"],
        ["Which tag creates a paragraph?", ["<p>", "<para>", "<text>", "<paragraph>"], 0, "p represents a paragraph.", "EASY"],
        ["Which tag creates an unordered list?", ["<ul>", "<ol>", "<list>", "<li>"], 0, "ul creates an unordered list.", "EASY"],
        ["Which tag creates a list item?", ["<li>", "<item>", "<list-item>", "<ul-item>"], 0, "li represents a list item.", "EASY"],
        ["Which property controls outside spacing?", ["margin", "padding", "space", "outside"], 0, "margin controls outside spacing.", "EASY"],
        ["Which property controls inside spacing?", ["padding", "margin", "inside", "spacing"], 0, "padding controls inside spacing.", "EASY"],
        ["Which layout is primarily one-dimensional?", ["Flexbox", "Grid", "Float", "Table"], 0, "Flexbox is primarily one-dimensional.", "MEDIUM"],
        ["Which layout handles rows and columns?", ["Grid", "Flexbox", "Float", "Inline"], 0, "CSS Grid is two-dimensional.", "MEDIUM"],
        ["Which unit is relative to root font size?", ["rem", "em", "px", "pt"], 0, "rem is relative to the root font size.", "MEDIUM"],
        ["What is used for responsive CSS rules?", ["Media Queries", "Functions", "Selectors only", "Variables"], 0, "Media queries apply styles based on conditions.", "EASY"],
        ["Which property controls font size?", ["font-size", "text-size", "size", "font"], 0, "font-size controls text size.", "EASY"],
        ["Which property controls boldness?", ["font-weight", "text-bold", "bold", "font-style"], 0, "font-weight controls text weight.", "EASY"],
        ["Which selector targets an id?", ["#id", ".id", "id:", "@id"], 0, "# targets an id selector.", "EASY"],
        ["Which selector targets a class?", [".class", "#class", "class:", "@class"], 0, ". targets a class selector.", "EASY"],
        ["What does position: fixed do?", ["Positions relative to the viewport", "Centers an element", "Hides an element", "Makes it flex"], 0, "Fixed positioning is relative to the viewport.", "MEDIUM"],
        ["What does box-sizing: border-box include?", ["Padding and border within declared size", "Only margin", "Only content", "Only border"], 0, "border-box includes padding and border in the declared dimensions.", "MEDIUM"]
    ],

    "MongoDB": [
        ["MongoDB is what type of database?", ["NoSQL", "Relational", "Hierarchical", "Graph"], 0, "MongoDB is a document-oriented NoSQL database.", "EASY"],
        ["MongoDB stores records primarily as:", ["Documents", "Rows", "Columns", "Tables"], 0, "MongoDB stores BSON documents.", "EASY"],
        ["What is similar to a table?", ["Collection", "Document", "Database", "Field"], 0, "A collection is similar to a table.", "EASY"],
        ["What is similar to a row?", ["Document", "Collection", "Database", "Index"], 0, "A document is similar to a row.", "EASY"],
        ["Which method inserts one document?", ["insertOne()", "addOne()", "createRow()", "insertDocument()"], 0, "insertOne() inserts one document.", "EASY"],
        ["Which method finds documents?", ["find()", "select()", "getRows()", "queryAll()"], 0, "find() queries documents.", "EASY"],
        ["Which method updates one document?", ["updateOne()", "modifyOne()", "changeOne()", "editOne()"], 0, "updateOne() updates one document.", "EASY"],
        ["Which method deletes one document?", ["deleteOne()", "removeRow()", "dropOne()", "eraseOne()"], 0, "deleteOne() deletes one document.", "EASY"],
        ["What binary format does MongoDB use?", ["BSON", "XML", "CSV", "SQL"], 0, "MongoDB uses BSON internally.", "MEDIUM"],
        ["What is ObjectId?", ["A common MongoDB identifier type", "A query", "A collection", "An index only"], 0, "ObjectId is a BSON identifier type.", "EASY"],
        ["What is an aggregation pipeline?", ["Stages that process documents", "A network route", "A schema file", "A backup"], 0, "Aggregation pipelines process documents through stages.", "MEDIUM"],
        ["Which stage filters documents?", ["$match", "$filterOnly", "$whereOnly", "$select"], 0, "$match filters aggregation documents.", "MEDIUM"],
        ["Which stage groups documents?", ["$group", "$collect", "$cluster", "$aggregate"], 0, "$group groups documents.", "MEDIUM"],
        ["Which stage sorts documents?", ["$sort", "$order", "$arrange", "$rank"], 0, "$sort sorts documents.", "EASY"],
        ["What can improve query performance?", ["Index", "Collection", "Document", "Schema"], 0, "Indexes can improve query performance.", "MEDIUM"],
        ["What is a compound index?", ["An index on multiple fields", "An index on one field", "A backup", "A collection"], 0, "A compound index contains multiple fields.", "MEDIUM"],
        ["What does Mongoose populate do?", ["Resolves referenced documents", "Creates a database", "Deletes records", "Indexes fields"], 0, "populate resolves referenced documents.", "MEDIUM"],
        ["What is Mongoose?", ["An ODM for MongoDB and Node.js", "A browser", "A SQL server", "A CSS framework"], 0, "Mongoose is an ODM for MongoDB.", "EASY"],
        ["What does CRUD stand for?", ["Create Read Update Delete", "Copy Run Update Delete", "Create Route Use Data", "Connect Read Use Delete"], 0, "CRUD means Create, Read, Update and Delete.", "EASY"],
        ["Which operator checks equality?", ["$eq", "$same", "$equals", "$equalTo"], 0, "$eq matches equal values.", "MEDIUM"]
    ],

    "Computer Networks": [
        ["How many layers are in the OSI model?", ["7", "5", "6", "4"], 0, "The OSI model has seven layers.", "EASY"],
        ["Which protocol is commonly used for web communication?", ["HTTP", "FTP", "SMTP", "SSH"], 0, "HTTP is commonly used for web communication.", "EASY"],
        ["Which device forwards packets between networks?", ["Router", "Switch", "Hub", "Repeater"], 0, "Routers forward packets between networks.", "EASY"],
        ["Which protocol provides reliable transport?", ["TCP", "UDP", "IP", "ARP"], 0, "TCP provides reliable connection-oriented transport.", "MEDIUM"],
        ["Which layer handles logical IP addressing?", ["Network", "Transport", "Session", "Physical"], 0, "The Network layer handles logical addressing.", "MEDIUM"],
        ["Which protocol translates domain names to IP addresses?", ["DNS", "DHCP", "ARP", "FTP"], 0, "DNS resolves domain names.", "EASY"],
        ["Which protocol assigns IP configuration automatically?", ["DHCP", "DNS", "HTTP", "SSH"], 0, "DHCP dynamically assigns IP configuration.", "EASY"],
        ["Which protocol provides secure remote login?", ["SSH", "HTTP", "FTP", "SMTP"], 0, "SSH provides secure remote access.", "EASY"],
        ["Which protocol maps IPv4 addresses to MAC addresses?", ["ARP", "DNS", "DHCP", "TCP"], 0, "ARP resolves IPv4 addresses to MAC addresses.", "MEDIUM"],
        ["Which transport protocol is connectionless?", ["UDP", "TCP", "HTTP", "SSH"], 0, "UDP is connectionless.", "EASY"],
        ["Which OSI layer provides end-to-end transport?", ["Transport", "Network", "Session", "Physical"], 0, "The Transport layer provides end-to-end transport services.", "MEDIUM"],
        ["Which device connects devices in a LAN?", ["Switch", "Router", "Modem", "Repeater"], 0, "A switch commonly connects devices in a LAN.", "EASY"],
        ["Which protocol sends email?", ["SMTP", "HTTP", "DNS", "ARP"], 0, "SMTP is used to send email.", "EASY"],
        ["Which protocol retrieves email?", ["IMAP", "SMTP", "ARP", "DHCP"], 0, "IMAP retrieves and synchronizes email.", "EASY"],
        ["What does IP stand for?", ["Internet Protocol", "Internal Process", "Internet Port", "Interface Protocol"], 0, "IP stands for Internet Protocol.", "EASY"],
        ["What is latency?", ["Delay in data transmission", "Bandwidth size", "Packet format", "IP address"], 0, "Latency is communication delay.", "EASY"],
        ["What is bandwidth?", ["Data transfer capacity", "Packet delay", "Address length", "Routing table"], 0, "Bandwidth is data transfer capacity.", "EASY"],
        ["What does a firewall do?", ["Controls network traffic using rules", "Assigns IP addresses only", "Resolves DNS", "Creates cables"], 0, "A firewall filters traffic according to rules.", "MEDIUM"],
        ["What is a MAC address?", ["A network interface hardware address", "A domain name", "An IP subnet", "A port number"], 0, "A MAC address identifies a network interface.", "EASY"],
        ["What is subnetting?", ["Dividing a network into smaller networks", "Encrypting traffic", "Changing DNS", "Creating websites"], 0, "Subnetting divides a network into smaller logical networks.", "MEDIUM"]
    ]
};

// =====================================================
// HELPERS
// =====================================================

function makeOptions(item) {
    return item[1].map((text, index) => ({
        optionText: text,
        isCorrect: index === item[2]
    }));
}

// =====================================================
// SEED DATABASE
// =====================================================

async function seedDatabase() {
    try {
        await connectDB();

        console.log("\n======================================");
        console.log(" QUIZ PLATFORM - DATA SEED");
        console.log("======================================\n");

        const categoryMap = {};

        // =================================================
        // CREATE CATEGORIES
        // =================================================

        for (const [name, description] of categories) {

            let category = await Category.findOne({ name });

            if (!category) {

                category = await Category.create({
                    name,
                    description
                });

                console.log(`✓ Category created: ${name}`);

            } else {

                console.log(`→ Category exists: ${name}`);
            }

            categoryMap[name] = category._id;
        }

        // =================================================
        // CREATE QUIZZES
        // =================================================

        for (const [
            title,
            categoryName,
            description,
            difficulty,
            duration
        ] of quizList) {

            const category = categoryMap[categoryName];

            let quiz = await Quiz.findOne({
                title,
                category
            });

            if (!quiz) {

                quiz = await Quiz.create({
                    title,
                    description,
                    category,
                    difficulty,
                    duration,
                    passingScore: 60,
                    maxAttempts: 3,
                    status: "PUBLISHED",
                    thumbnail: null
                });

                console.log(`✓ Quiz created: ${title}`);

            } else {

                console.log(`→ Quiz exists: ${title}`);
            }

            // =================================================
            // MAXIMUM 20 QUESTIONS PER QUIZ
            // =================================================

            const currentCount =
                await Question.countDocuments({
                    quiz: quiz._id
                });

            if (currentCount >= 20) {

                console.log(
                    `   → ${title}: ${currentCount}/20 questions already present`
                );

                continue;
            }

            const questions =
                (bank[categoryName] || []).slice(0, 20);

            for (const item of questions) {

                const exists =
                    await Question.findOne({
                        quiz: quiz._id,
                        questionText: item[0]
                    });

                if (!exists) {

                    await Question.create({

                        quiz: quiz._id,

                        questionText: item[0],

                        options: makeOptions(item),

                        explanation: item[3],

                        marks: 1,

                        difficulty: item[4]
                    });
                }
            }

            const finalCount =
                await Question.countDocuments({
                    quiz: quiz._id
                });

            console.log(
                `   → ${title}: ${finalCount}/20 questions`
            );
        }

        console.log("\n======================================");
        console.log(" SEED COMPLETED SUCCESSFULLY");
        console.log(" Existing data was preserved.");
        console.log(" Maximum questions per quiz: 20");
        console.log("======================================\n");

        process.exit(0);

    } catch (error) {

        console.error("\n======================================");
        console.error(" SEED FAILED");
        console.error("======================================");

        console.error(error);

        process.exit(1);
    }
}

seedDatabase();