angular.module('lpc.celebrities.celebritiesManager', ['firebase', 'lpc.common.persistence.simpleLocalPersistence'])

.factory('celebritiesManager', function($q, $firebaseObject, $http, celebritiesUrl, simpleLocalPersistence, firebaseOrigin) {
    var service = {
        randomlyGetTwoCelebrities: randomlyGetTwoCelebrities,
        getVotesForCelebrities: getVotesForCelebrities,
        voteForACelebrity: voteForACelebrity,
        logUserVote: logUserVote,
        getUserVote: getUserVote
    };

    function randomlyGetTwoCelebrities() {
        return $http.get(celebritiesUrl).then(function(res) {
            var celebrities = res.data;
            var indexes = generateTwoDistinctRandomInteger(celebrities.length);
            return [celebrities[indexes[0]], celebrities[indexes[1]]];
        });
    }

    function getVotesForCelebrities(celebrities) {
        var ref = new Firebase(firebaseOrigin + '/votes/' + getVoteIndexForCelebrities(celebrities));
        return $firebaseObject(ref).$loaded();
    }

    function voteForACelebrity(celebrities, voted) {
        var ref = new Firebase(firebaseOrigin + '/votes/' + getVoteIndexForCelebrities(celebrities));
        return $firebaseObject(ref).$loaded()
            .then(function() {
                ref.transaction(function(vote) {
                    vote[voted.id] = (vote[voted.id] || 0) + 1;
                    return vote;
                });
            });
    }

    function getVoteIndexForCelebrities(celebrities) {
        return celebrities.map(function(celebrity) {
            return celebrity.id;
        }).sort().join("_");
    }

    function generateTwoDistinctRandomInteger(max) {
        var rn, ints = [];
        do {
            rn = Math.floor(Math.random() * max);
            if (ints[0] != rn) {
                ints.push(rn);
            }
        } while(ints.length < 2);
        return ints;
    }

    function logUserVote(celebrities, voted) {
        var index = getVoteIndexForCelebrities(celebrities);
        return simpleLocalPersistence.set(index, voted.id);
    }

    function getUserVote(celebrities) {
        return simpleLocalPersistence.get(getVoteIndexForCelebrities(celebrities));
    }

    return service;
});
