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
        return $firebaseObject(ref).$loaded().then(restructureVoteDataObj, rewriteErrorMessage);

        function restructureVoteDataObj(data) {
            var voteData = {};
            voteData[data.fc.slug] = data.fc.counter;
            voteData[data.sc.slug] = data.sc.counter;
            return voteData;
        }

        function rewriteErrorMessage() {
            return $q.reject("Impossible d'obtenir les votes pour ces célébrités ... :(");
        }
    }

    function voteForACelebrity(celebrities, voted) {
        var ref = new Firebase(firebaseOrigin + '/votes/' + getVoteIndexForCelebrities(celebrities));
        return $firebaseObject(ref).$loaded().then(updateVote, rewriteErrorMessage);

        function updateVote() {
            ref.transaction(function(vote) {
                if (vote === null) {
                    vote = {
                        fc: { slug: celebrities[0].id, counter: 0 },
                        sc: { slug: celebrities[1].id, counter: 0 }
                    };
                }
                if (voted.id === vote.fc.slug) { vote.fc.counter++; }
                if (voted.id === vote.sc.slug) { vote.sc.counter++; }
                return vote;
            });
        }

        function rewriteErrorMessage() {
            return $q.reject("Impossible d'enregistrer votre vote pour le moment ... :(");
        }
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
