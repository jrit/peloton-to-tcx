"use strict";

var builder = require('xmlbuilder');

var tcx = {};
module.exports = tcx;

var milesToMeters = 1609.34;

tcx.fromPeloton = function (workout, workoutSample)
{
    var pointList = workoutSample.data;
    var start = workout.peloton.start_time * 1000;

    var root = builder.create('TrainingCenterDatabase');
    var activity = root.ele('Activities').ele('Activity').att('Sport','Biking');
    activity.ele('Id', new Date(start).toISOString());
    var lap = activity.ele('Lap');
    lap.att('StartTime', new Date(start).toISOString());

    var lastPoint = pointList[pointList.length - 1];
    lap.ele('TotalTimeSeconds', lastPoint.seconds_since_pedaling_start);
    lap.ele('DistanceMeters', (lastPoint.distance * milesToMeters).toFixed(2));

    var track = lap.ele('Track');

    pointList.forEach( function ( point )
    {
        var trackpoint = {
            Time: new Date(start + point.seconds_since_pedaling_start * 1000).toISOString(),
            Cadence: point.cadence,
            Watts: point.power,
            DistanceMeters: (point.distance * milesToMeters).toFixed(2)
        };

        if (point.heart_rate)
        {
            trackpoint.HeartRateBpm = { Value: point.heart_rate };
        }

        track.ele('Trackpoint').ele(trackpoint);
    });

    return root;
};
