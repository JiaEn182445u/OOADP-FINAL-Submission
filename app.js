const express = require('express');
const session = require('express-session');
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const FlashMessenger = require('flash-messenger');// Library to use MySQL to store session objects
const MySQLStore = require('express-mysql-session');
const user = require('./models/aUser');
const db = require('./config/db'); // db.js config file
// const passport = require('passport');
const passport_a = require('passport');

const amainRoute = require('./routes/main_a');
const auserRoute = require('./routes/user_a');
const afeedback = require('./routes/feedbackRec');
const stocks = require('./routes/stocks');
const SmainRoute = require('./routes/main_s');
const MmainRoute = require('./routes/m_main');
const muserRoute = require('./routes/m_user');
const formRoute = require('./routes/form');

const cuserRoute = require('./routes/cuser');
const cfeedbackRoute=require('./routes/cfeedback');
const cshoppingRoute=require('./routes/cshopping');

const delDB = require('./config/DBConnection');
// Connects to MySQL database
delDB.setUpDB(false);

const { formatDate, radioCheck, replaceCommas } = require('./helpers/hbs');


const app = express();



app.engine('handlebars', exphbs({
	helpers: {
		formatDate: formatDate,
		radioCheck: radioCheck,
		replaceCommas: replaceCommas,
		tester:function(lvalue, rvalue, options) {

			if (arguments.length < 3)
				throw new Error("Handlerbars Helper 'compare' needs 2 parameters");

			var operator = options.hash.operator || "==";

			var operators = {
				'==':       function(l,r) { return l == r; },
				'===':      function(l,r) { return l === r; },
				'!=':       function(l,r) { return l != r; },
				'<':        function(l,r) { return l < r; },
				'>':        function(l,r) { return l > r; },
				'<=':       function(l,r) { return l <= r; },
				'>=':       function(l,r) { return l >= r; },
				'typeof':   function(l,r) { return typeof l == r; }
			}
			if (!operators[operator])
				throw new Error("Handlerbars Helper 'compare' doesn't know the operator "+operator);

			var result = operators[operator](lvalue,rvalue);

			if( result ) {
				return options.fn(this);
				//return true;
			} else {
				return options.inverse(this);
				//return false;
			}


		}

		},

	
	defaultLayout: 'main_a' // Specify default template views/layout/main.handlebar 
}));
app.set('view engine', 'handlebars');

// Body parser middleware to parse HTTP body in order to read HTTP data
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(bodyParser.json());

// Creates static folder for publicly accessible HTML, CSS and Javascript files
app.use(express.static(path.join(__dirname, 'public')));

// Method override middleware to use other HTTP methods such as PUT and DELETE
app.use(methodOverride('_method'));

// Enables session to be stored using browser's Cookie ID
app.use(cookieParser());

// To store session information. By default it is stored as a cookie on browser
app.use(session({
	key: 'delivery_session',
	secret: 'tojiv',
	store: new MySQLStore({
		host: db.host,
		port: 3306,
		user: db.username,
		password: db.password,
		database: db.database,
		clearExpired: true,
		// How frequently expired sessions will be cleared; milliseconds:
		checkExpirationInterval: 900000,
		// The maximum age of a valid session; milliseconds:
		expiration: 900000,
	}),


	resave: false,
	saveUninitialized: false,
}));
// Initilize Passport middleware
app.use(passport_a.initialize());
app.use(passport_a.session());

// app.use(passport_c.initialize());
// app.use(passport_c.session());

// app.use(passport_m.initialize());
// app.use(passport_m.session());

app.use(flash());

app.use(FlashMessenger.middleware); // add this statement after flash()
app.use(function (req, res, next) {
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	res.locals.user = req.user || null;
	// if(user.type=="cuser"){
	// 	res.locals.cuser=req.user
	// }
	// if(user.type=="admin"){
	// 	res.locals.admin=req.user
	// }
	// else
	 //{res.locals.user = req.user || null;}
	// res.locals.cuser = null; {
	// 	if  (user.type == "cuser"){
	// 	res.locals.cuser=req.cuser}};  
//console.log(req.user.type);

	// res.locals.cuser = null ;
	// 	if  (req.user.type == "cuser"){
	// 		console.log('hi1');
	// 	res.locals.cuser=req.user
	// }
	// else{
	// 	res.locals.user = req.user || null;
	// }	 
	// res.locals.admin = null ; 
	// 	if  (req.user.type == "admin"){
	// 		console.log('hi3'); 
	// 	res.locals.admin=req.user}
	// 	else{
	// 		res.locals.user = req.user || null;
	// 	}
		//res.locals.user = null ; 


//res.locals.cuser = null ; 
if(req.user){
	
	if(req.user.type=="cuser"){
	
	res.locals.cuser = req.user;}
}
 
//res.locals.admin = null ; 
if(req.user){

	if(req.user.type=="admin"){
		
	res.locals.admin = req.user;}
}
//res.locals.admin = null ; 
if(req.user){

	if(req.user.type=="muser"){
		
	res.locals.muser = req.user;}
}
if(req.user){

	if(req.user.type=="delMan"){
		
	res.locals.delMan = req.user;}
}


	next();
});

// Place to define global variables - not used in practical 1
app.use(function (req, res, next) {
	next();
});


app.use('/', amainRoute); // mainRoute is declared to point to routes/main.js
// This route maps the root URL to any path defined in main.js
app.use('/user', auserRoute); // mainRoute is declared to point to routes/main.js

app.use('/main_s', SmainRoute);

app.use('/feedback', afeedback);


app.use('/stocks', stocks);

app.use('/cuser', cuserRoute); // mainRoute is declared to point to routes/main.js

app.use('/feedbackk',cfeedbackRoute);
app.use('/shopping',cshoppingRoute);
app.use('/form',formRoute)
app.use('/m_user', muserRoute);
app.use('/m_main', MmainRoute);

const port = 5000;

// Starts the server and listen to port 5000
app.listen(port, () => {
	console.log(`Server started on port ${port}`);
});


const authenticate = require('./config/passport_a');
//const authenticate_c = require('./config/passport_c');
// const authenticate_m = require('./config/passport_m')
authenticate.localStrategy(passport_a);
