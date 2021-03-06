"use strict";

var request = require('request');

var api = {};
module.exports = api;

api.authenticate = function (login, password, done)
{
    request({
        url: "https://api.pelotoncycle.com/auth/login",
        method: "POST",
        body: JSON.stringify({
            password: password,
            username_or_email: login
        })
    }, function (err, res, body)
    {
        if (err)
        {
            return done(err);
        }

        if (res.statusCode !== 200)
        {
            return done(new Error("Status code " + res.statusCode));
        }

        done(null, JSON.parse(body));
    });
};

api.getWorkoutHistory = function(userId, sessionId, limit, done)
{
    var url ='https://api.pelotoncycle.com/api/user/'
        + userId
        + '/workouts?joins=peloton.ride&limit=' + (limit || 1) + '&page=0&sort_by=-created';

    request({
        url: url,
        headers: {
            cookie: 'peloton_session_id=' + sessionId + ';'
        }
    }, function (err, res, body)
    {
        if (err)
        {
            return done(err);
        }

        if (res.statusCode !== 200)
        {
            return done(new Error("Status code " + res.statusCode));
        }

        done(null, JSON.parse(body));
    });
};

api.getWorkout = function (workoutId, done)
{
    if (!workoutId)
    {
        return done(new Error("workoutId is required"))
    }

    var url = 'https://api.pelotoncycle.com/api/workout/'
    + workoutId
    + '?joins=peloton,peloton.ride,peloton.ride.instructor,user';

    request(url, function (err, res, body)
    {
        if (err)
        {
            return done(err);
        }

        if (res.statusCode !== 200)
        {
            return done(new Error("Status code " + res.statusCode));
        }

        done(null, JSON.parse(body));
    });
};

api.getWorkoutSample = function (workoutId, done)
{
    var url = 'https://api.pelotoncycle.com/api/workout/'
    + workoutId
    + '/sample?every_n=10&fields=seconds_since_pedaling_start,power,cadence,speed,heart_rate,distance&limit=14400';

    request(url, function (err, res, body)
    {
        if (err)
        {
            return done(err);
        }

        if (res.statusCode !== 200)
        {
            return done(new Error("Status code " + res.statusCode));
        }

        done(null, JSON.parse(body));
    });
};
