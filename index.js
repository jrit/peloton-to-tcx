"use strict";

require('dotenv').load();

var a = require('async');
var pelotonApi = require('./lib/peloton-api');
var tcx = require('./lib/tcx');
var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');

module.exports = p2t;

function p2t(options, done)
{
    options = options || {};
    var login = options.pLogin || process.env.PELOTON_LOGIN;
    var password = options.pPassword || process.env.PELOTON_PASSWORD;
    var resultsDirectory = options.resultsDirectory || './peloton-results';

    var userId = null;
    var sessionId = null;

    a.series([
        function (done)
        {
            pelotonApi.authenticate(login, password, function (err, res)
            {
                if (err){ return done(err); }
                userId = res.user_id;
                sessionId = res.session_id;
                done();
            });
        },
        function (done)
        {
            pelotonApi.getWorkoutHistory(userId, sessionId, options.limit, function (err, history)
            {
                var workoutIds = history.data.map( function (item)
                {
                    return item.id;
                });
                done(err, workoutIds);
            });
        },
        function (done)
        {
            mkdirp(resultsDirectory, done);
        }],
        function (err, results)
        {
            if (err)
            {
                return done(err);
            }
            convertWorkouts(results[1]);
        }
    );

    var convertWorkouts = function (workoutIds)
    {
        var tasks = workoutIds.map( function (workoutId)
        {
            return function (done)
            {
                pelotonApi.getWorkout(workoutId, function (err, workout)
                {
                    if (err)
                    {
                        return done(err);
                    }

                    pelotonApi.getWorkoutSample(workoutId, function (err, samples)
                    {
                        if (err)
                        {
                            return done(err);
                        }

                        var xml = tcx.fromPeloton(workout, samples);
                        fs.writeFile(path.join(resultsDirectory, workoutId + '.tcx'),
                            xml.end({ pretty: true }),
                            function (err)
                            {
                                if (err)
                                {
                                    return done(err);
                                }
                                done(null, xml);
                            });
                    });
                });
            };
        });

        a.series(tasks, done);
    };
};
