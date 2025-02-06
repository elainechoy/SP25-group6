require('dotenv').config(); // Load environment variables

const express = require('express');
const passport = require('passport');
const session = require('express-session');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const app = express();

// 1. Configure session
app.use(
  session({
    secret: process.env.SESSION_SECRET, // from .env
    resave: false,
    saveUninitialized: false,
  })
);

// 2. Initialize Passport and restore authentication state, if any, from the session
app.use(passport.initialize());
app.use(passport.session());

// 3. Configure the Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback', // The endpoint Google will redirect to
    },
    // This callback is called after Google has verified the user
    function (accessToken, refreshToken, profile, done) {
      /*
        Here, 'profile' contains the authenticated user’s Google profile info.
        You would typically find or create a user in your database here.
      */
      // For this example, let’s just return the user profile.
      return done(null, profile);
    }
  )
);

// 4. Serialize and deserialize user (for session persistence)
passport.serializeUser((user, done) => {
  // You can serialize any user info you want into the session here.
  // Typically, you’d serialize the user ID from your database.
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  // ‘obj’ is what you serialized in ‘serializeUser’.
  // Typically, you’d query your database to get the full user record.
  done(null, obj);
});

// 5. Define routes

// Home route (public)
app.get('/', (req, res) => {
  res.send('<h1>Home Page</h1><a href="/auth/google">Sign In with Google</a>');
});

// Auth route - triggers Google sign-in
app.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Auth callback route - Google redirects here after the user grants permission
app.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/auth/failure',
    successRedirect: '/protected', // Where to go on successful login
  })
);

// Failure route
app.get('/auth/failure', (req, res) => {
  res.send('Something went wrong...');
});

// Protected route - only accessible if user is authenticated
app.get('/protected', isLoggedIn, (req, res) => {
  res.send(`
    <h1>Hello, ${req.user.displayName}!</h1>
    <p>You have successfully logged in using Google OAuth.</p>
    <a href="/logout">Logout</a>
  `);
});

// Logout route
app.get('/logout', (req, res) => {
  req.logout(() => {
    // In Passport 0.6+, logout is asynchronous
    res.redirect('/');
  });
});

// Middleware to check if user is authenticated
function isLoggedIn(req, res, next) {
  req.user ? next() : res.redirect('/');
}

// 6. Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});