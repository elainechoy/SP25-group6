require('dotenv').config();
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const app = express();
const PORT = process.env.SERVER_PORT || 3001;
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(session({ secret: 'your_secret', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:3001/auth/google/callback" 
},
(accessToken, refreshToken, profile, done) => {
  return done(null, profile);
}
));

console.log("Google OAuth Redirect URI:", "http://localhost:3001/auth/google/callback");


passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));


const authenticateJWT = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: "Forbidden" });
        req.user = user;
        next();
    });
};


app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);


app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    const user = { id: req.user.id, name: req.user.displayName, email: req.user.emails[0].value };

    const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log("Generated Token:", token);

    res.redirect(`http://localhost:3000/dashboard?token=${token}`);
  }
);



app.get('/profile', authenticateJWT, (req, res) => {
    res.json(req.user);
});

app.get('/logout', (req, res) => {
  req.logout(() => {
      res.clearCookie('connect.sid');
      req.session.destroy((err) => {
          if (err) return res.status(500).send("Failed to log out.");
          res.redirect("https://accounts.google.com/Logout"); 
      });
  });
});


app.listen(PORT, () => console.log('Server running on http://localhost:3001'));
