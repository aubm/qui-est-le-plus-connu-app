angular.module('lpc.celebrities.duet.duetController', ['lpc.celebrities.celebritiesManager', 'lpc.celebrities.card', 'lpc.celebrities.duet.duetChart'])

.controller('CelebritiesDuetCtrl', function($q, $cordovaDialogs, celebritiesManager, imagesOrigin, celebrities) {
    var vm = this;
    var fc = celebrities[0], sc = celebrities[1];

    vm.imagesOrigin = imagesOrigin;
    vm.choices = celebrities;
    vm.currentChoice = null;
    vm.voteSubmitted = false;
    vm.loadingChart = false;
    vm.chart = null;
    vm.select = makeAChoice;
    vm.submitVote = submitAVote;

    getUserVote()
        .then(markVoteAsSubmitted)
        .then(showChartLoadingSpinner)
        .then(getVotesData)
        .then(initChartData)
        .catch(handleError)
        .finally(hideChartLoadingSpinner);

    function submitAVote() {
        markVoteAsSubmitted();
        showChartLoadingSpinner();
        celebritiesManager.voteForACelebrity(vm.choices, vm.currentChoice)
            .then(logUserVote)
            .then(getVotesData)
            .then(initChartData)
            .then(null, markVoteAsNotSubmittedAndReject)
            .catch(handleError)
            .finally(hideChartLoadingSpinner);
    }

    function makeAChoice(choice) {
        if (vm.voteSubmitted) return;
        vm.currentChoice = choice;
    }

    function getVotesData() {
        return celebritiesManager.getVotesForCelebrities(vm.choices);
    }

    function initChartData(voteData) {
        vm.chart = {
            labels: [fc.name, sc.name],
            data: [[voteData[fc.id] || 0, voteData[sc.id] || 0]],
            options: { responsive: true, scaleShowGridLines: false, showScale: false, showTooltips: false, barValueSpacing: 15, animationEasing: 'easeInOutCubic' },
            colors: [{ strokeColor: "#C0392B", fillColor: "#E26A6A" }]
        };
    }

    function markVoteAsSubmitted() {
        vm.voteSubmitted = true;
    }

    function markVoteAsNotSubmittedAndReject(err) {
        vm.voteSubmitted = false;
        return $q.reject(err);
    }

    function logUserVote() {
        return celebritiesManager.logUserVote(vm.choices, vm.currentChoice);
    }

    function getUserVote() {
        return celebritiesManager.getUserVote(vm.choices);
    }

    function handleError(err) {
        if (err) { $cordovaDialogs.alert(err, "Hum ..."); }
    }

    function showChartLoadingSpinner() {
        vm.loadingChart = true;
    }

    function hideChartLoadingSpinner() {
        vm.loadingChart = false;
    }
});
