describe('lpc.celebrities.duet.duetController', function() {

    var $controller, $rootScope, $q;

    beforeEach(module('lpc.celebrities.duet.duetController'));
    beforeEach(inject(function(_$controller_, _$rootScope_, _$q_) {
        $controller = _$controller_;
        $rootScope = _$rootScope_;
        $q = _$q_;
    }));

    describe('CelebritiesDuetCtrl', function() {

        var createController;
        var $mockCordovaDialogs = { alert: function() {} };
        var mockCelebritiesManager = {
            getUserVote: function() {},
            getVotesForCelebrities: function() {},
            voteForACelebrity: function() {},
            logUserVote: function() {}
        };
        var mockImagesOrigin = 'http://www.google.com';
        var mockCelebrities = [
            { id: 'alexandre_astier', image_name: 'alexandre_astier.jpg', name: 'Alexandre Astier' },
            { id: 'kendji_girac', image_name: 'kendji_girac.jpg', name: 'Kendji Girac' }
        ];
        var mockVoteData = { 'alexandre_astier': 50, 'kendji_girac': null };
        var getVotesErrorMessage = "Impossible d'obtenir les votes pour ces célébrités ... :(";
        var voteSubmissionErrorMessage = "Impossible d'enregistrer votre vote pour le moment ... :(";

        beforeEach(function() {
            createController = $controller('CelebritiesDuetCtrl', {
                $cordovaDialogs: $mockCordovaDialogs,
                celebritiesManager: mockCelebritiesManager,
                imagesOrigin: mockImagesOrigin,
                celebrities: mockCelebrities
            }, true);
        });

        it('should be an instance of CelebritiesDuetCtrl', function() {
            spyOn(mockCelebritiesManager, 'getUserVote').and.returnValue(resolvedPromise());
            var vm = createController();
            expect(vm).toBeDefined;
        });

        it('should have initial values', function() {
            spyOn(mockCelebritiesManager, 'getUserVote').and.returnValue(resolvedPromise());
            var vm = createController();
            expect(vm.imagesOrigin).toBe(mockImagesOrigin);
            expect(vm.choices).toBe(mockCelebrities);
            expect(vm.currentChoice).toBe(null);
            expect(vm.voteSubmitted).toBe(false);
            expect(vm.loadingChart).toBe(false);
            expect(vm.chart).toBe(null);
        });

        it('still should not have vote marked as submitted', function() {
            spyOn(mockCelebritiesManager, 'getUserVote').and.returnValue(rejectedPromise());
            var vm = createController();
            $rootScope.$digest();
            expect(vm.voteSubmitted).toBe(false);
        });

        it('should have vote marked as submitted chart data initialized', function() {
            spyOn(mockCelebritiesManager, 'getUserVote').and.returnValue(resolvedPromise('alexandre_astier'));
            spyOn(mockCelebritiesManager, 'getVotesForCelebrities').and.returnValue(mockVoteData);

            var vm = createController();
            $rootScope.$digest();

            expect(vm.voteSubmitted).toBe(true);
            expect(vm.chart.labels).toEqual(jasmine.any(Array));
            expect(vm.chart.labels.length).toBe(2);
            expect(vm.chart.labels[0]).toBe(mockCelebrities[0].name);
            expect(vm.chart.labels[1]).toBe(mockCelebrities[1].name);
            expect(vm.chart.data).toEqual(jasmine.any(Array));
            expect(vm.chart.data.length).toBe(1);
            expect(vm.chart.data[0]).toEqual(jasmine.any(Array));
            expect(vm.chart.data[0].length).toBe(2);
            expect(vm.chart.data[0][0]).toBe(mockVoteData[mockCelebrities[0].id]);
            expect(vm.chart.data[0][1]).toBe(0);
            expect(vm.chart.options).toBeDefined();
            expect(vm.chart.colors).toEqual(jasmine.any(Array));
            expect(vm.chart.colors.length).toBe(1);
            expect(vm.chart.colors[0].strokeColor).toBeDefined();
            expect(vm.chart.colors[0].fillColor).toBeDefined();
            expect(vm.loadingChart).toBe(false);

        });

        it('should make a choice', function() {
            spyOn(mockCelebritiesManager, 'getUserVote').and.returnValue(rejectedPromise());

            var vm = createController();

            $rootScope.$digest();

            vm.select(vm.choices[0]);
            expect(vm.currentChoice).toBe(vm.choices[0]);

            vm.select(vm.choices[1]);
            expect(vm.currentChoice).toBe(vm.choices[1]);

            vm.voteSubmitted = true;
            vm.select(vm.choices[0]);
            expect(vm.currentChoice).toBe(vm.choices[1]);
        });

        it('should submit a vote', function() {
            spyOn(mockCelebritiesManager, 'getUserVote').and.returnValue(rejectedPromise());
            spyOn(mockCelebritiesManager, 'voteForACelebrity').and.returnValue(resolvedPromise());
            spyOn(mockCelebritiesManager, 'logUserVote').and.returnValue(resolvedPromise());
            spyOn(mockCelebritiesManager, 'getVotesForCelebrities').and.returnValue(mockVoteData);

            var choiceIndex = 0;
            var vm = createController();

            $rootScope.$digest();

            vm.currentChoice = vm.choices[choiceIndex];
            vm.submitVote();

            $rootScope.$digest();

            expect(vm.voteSubmitted).toBe(true);
            expect(mockCelebritiesManager.voteForACelebrity).toHaveBeenCalledWith(mockCelebrities, mockCelebrities[choiceIndex]);
            expect(mockCelebritiesManager.logUserVote).toHaveBeenCalledWith(mockCelebrities, mockCelebrities[choiceIndex]);
            expect(vm.loadingChart).toBe(false);
        });

        it('should handle vote submission error', function() {
            spyOn(mockCelebritiesManager, 'getUserVote').and.returnValue(rejectedPromise());
            spyOn(mockCelebritiesManager, 'voteForACelebrity').and.returnValue(rejectedPromise(voteSubmissionErrorMessage));
            spyOn(mockCelebritiesManager, 'logUserVote');
            spyOn($mockCordovaDialogs, 'alert');

            var vm = createController();

            $rootScope.$digest();

            expect($mockCordovaDialogs.alert).not.toHaveBeenCalled();

            vm.currentChoice = vm.choices[0];
            vm.submitVote();

            $rootScope.$digest();

            expect(mockCelebritiesManager.voteForACelebrity).toHaveBeenCalled();
            expect(mockCelebritiesManager.logUserVote).not.toHaveBeenCalled();
            expect($mockCordovaDialogs.alert).toHaveBeenCalledWith(voteSubmissionErrorMessage, "Hum ...");
            expect(vm.loadingChart).toBe(false);
            expect(vm.voteSubmitted).toBe(false);
        });

        it('should handle vote data error', function() {
            spyOn(mockCelebritiesManager, 'getUserVote').and.returnValue(rejectedPromise());
            spyOn(mockCelebritiesManager, 'voteForACelebrity').and.returnValue(resolvedPromise());
            spyOn(mockCelebritiesManager, 'logUserVote').and.returnValue(resolvedPromise());
            spyOn(mockCelebritiesManager, 'getVotesForCelebrities').and.returnValue(rejectedPromise(getVotesErrorMessage));
            spyOn($mockCordovaDialogs, 'alert');

            var choiceIndex = 0;
            var vm = createController();

            $rootScope.$digest();

            expect($mockCordovaDialogs.alert).not.toHaveBeenCalled();

            vm.currentChoice = vm.choices[0];
            vm.submitVote();

            $rootScope.$digest();

            expect(mockCelebritiesManager.voteForACelebrity).toHaveBeenCalled();
            expect(mockCelebritiesManager.logUserVote).toHaveBeenCalled();
            expect(mockCelebritiesManager.getVotesForCelebrities).toHaveBeenCalled();
            expect($mockCordovaDialogs.alert).toHaveBeenCalledWith(getVotesErrorMessage, "Hum ...");
            expect(vm.loadingChart).toBe(false);
        });

    });

    function resolvedPromise(data) {
        return $q(function(r) {
            r(data);
        });
    }

    function rejectedPromise(data) {
        return $q(function(_, r) {
            r(data);
        });
    }

});
