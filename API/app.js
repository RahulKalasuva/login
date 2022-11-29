const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const passport = require('passport');
const passportAzureAd = require('passport-azure-ad');

const authConfig = require('./authConfig');
const router = require('./routes/index');

const app = express();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});


app.use(limiter)

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));




const bearerStrategy = new passportAzureAd.BearerStrategy({
    identityMetadata: `https://${authConfig.metadata.authority}/${authConfig.credentials.tenantID}/${authConfig.metadata.version}/${authConfig.metadata.discovery}`,
    issuer: `https://${authConfig.metadata.authority}/${authConfig.credentials.tenantID}/${authConfig.metadata.version}`,
    clientID: authConfig.credentials.clientID,
    audience: authConfig.credentials.clientID, // audience is this application
    validateIssuer: authConfig.settings.validateIssuer,
    passReqToCallback: authConfig.settings.passReqToCallback,
    // loggingLevel: authConfig.settings.loggingLevel,
    // loggingNoPII: authConfig.settings.loggingNoPII,
}, (req, token, done) => {
    console.log("token",token)

    if (!token.hasOwnProperty('scp') && !token.hasOwnProperty('roles')) {
        return done(new Error('Unauthorized'), null, "No delegated or app permission claims found");
    }

    return done(null, {}, token);
});






app.use(passport.initialize());

passport.use(bearerStrategy);


app.use('/api', (req, res, next) => {
    passport.authenticate('oauth-bearer', {
        session: false,
    }, (err, user, info) => {
        if (err) {
            return res.status(401).json({ error: err.message });
        }
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        if (info) {
            console.log("info--------",info)
            req.authInfo = info;
            return next();
        }
    })(req, res, next);
},
    router
);



const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log('Listening on port ' + port);
});

module.exports = app;
