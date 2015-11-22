"use strict";

require('dotenv').load();

var assert = require('assert');
var fs = require('fs');
var pelotonApi = require('../lib/peloton-api');
var tcx = require('../lib/tcx');

var login = process.env.PELOTON_LOGIN;
var password = process.env.PELOTON_PASSWORD;

var userId = null;
var sessionId = null;
var workoutId = null;
var workout = null;
var workoutSample = null;

it('authenticates to API', function (done)
{
    pelotonApi.authenticate(login, password, function (err, res)
    {
        assert.equal(err, null);
        userId = res.user_id;
        sessionId = res.session_id;
        assert.equal(!!userId, true);
        assert.equal(!!sessionId, true);
        done();
    });
});

it('gets workout history from API', function (done)
{
    pelotonApi.getWorkoutHistory(userId, sessionId, 1, function (err, history)
    {
        assert.equal(err, null);
        workoutId = history.data[0].id;
        assert.equal(!!history.data[0].id, true);
        done();
    });
});

it('gets workout from API', function (done)
{
    pelotonApi.getWorkout(workoutId, function (err, res)
    {
        assert.equal(err, null);
        workout = res;
        assert.equal(workout.user_id, userId);
        done();
    });
});

it('gets workout sample from API', function (done)
{
    pelotonApi.getWorkoutSample(workoutId, function (err, res)
    {
        assert.equal(err, null);
        workoutSample = res;
        assert.equal(workoutSample.data[0].seconds_since_pedaling_start <= 10, true);
        done();
    });
});

it('creates a TCX', function (done)
{
    var xml = tcx.fromPeloton(workout, workoutSample);
    fs.writeFileSync('./test/tmp/sample.tcx', xml.end({ pretty: true }));
    done();
});
