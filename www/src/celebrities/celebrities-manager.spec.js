describe('lpc.celebrities.celebritiesManager', function() {

    var $mockFirebaseObjectReturn = { $loaded: function() {} };
    var $mockFirebaseObject = function() { return $mockFirebaseObjectReturn; };
    var mockSimpleLocalPersistence = { set: function() {}, get: function() {} };

    beforeEach(module('lpc.celebrities.celebritiesManager'));

    beforeEach(module(function($provide) {
        $provide.value('$firebaseObject', $mockFirebaseObject);
        $provide.value('simpleLocalPersistence', mockSimpleLocalPersistence);
        $provide.value('celebritiesUrl', 'https://lpc.github.io/db.json');
        $provide.value('firebaseOrigin', 'https://this-is-a-test.firebaseio.com');
    }));

    describe('celebritiesManager', function() {

        var $rootScope, $q, $http;
        var celebritiesManager;

        var mockCelebrities = [
            { id: 'alexandre_astier', image_name: 'alexandre_astier.jpg', name: 'Alexandre Astier' },
            { id: 'kendji_girac', image_name: 'kendji_girac.jpg', name: 'Kendji Girac' },
            { id: 'madonna', image_name: 'madonna.jpg', name: 'Madonna' },
            { id: 'beyonce', image_name: 'beyonce.jpg', name: 'Beyoncé' },
            { id: 'rihanna', image_name: 'rihanna.jpg', name: 'Rihanna' },
            { id: 'kim_kardashian', image_name: 'kim_kardashian.jpg', name: 'Kim Kardashian' },
            { id: 'lady_gaga', image_name: 'lady_gaga.jpg', name: 'Lady Gaga' },
            { id: 'johnny_depp', image_name: 'johnny_depp.jpg', name: 'Johnny Depp' },
            { id: 'brad_pitt', image_name: 'brad_pitt.jpg', name: 'Brad Pitt' },
            { id: 'barack_obama', image_name: 'barack_obama.jpg', name: 'Barack Obama' }
        ];

        var mockFirebaseVoteRepresentation = {
            fc: { slug: 'alexandre_astier', counter: 50 }, sc: { slug: 'kendji_girac', counter: 30 }
        };

        beforeEach(inject(function(_$rootScope_, _$q_, _$http_, _celebritiesManager_) {
            $rootScope = _$rootScope_;
            $q = _$q_;
            $http = _$http_;
            celebritiesManager = _celebritiesManager_;
        }));

        it('should be an instance of my factory', function() {
            expect(celebritiesManager).toBeDefined();
        });

        for (var _i=0 ; _i<10 ; _i++) {
            it('should get two random celebrities', function(done) {
                spyOn($http, 'get').and.returnValue(resolvedPromise({ data: mockCelebrities }));

                celebritiesManager.randomlyGetTwoCelebrities()
                    .then(function(celebrities) {
                        expect(celebrities).toEqual(jasmine.any(Array));
                        expect(celebrities.length).toBe(2);
                        expect(mockCelebrities).toContain(celebrities[0]);
                        expect(mockCelebrities).toContain(celebrities[1]);
                    })
                    .finally(done);

                $rootScope.$digest();
            });
        }

        it('should get vote data for celebrities', function(done) {
            spyOn(window, 'Firebase');
            spyOn($mockFirebaseObjectReturn, '$loaded').and.returnValue(resolvedPromise(mockFirebaseVoteRepresentation));

            celebritiesManager.getVotesForCelebrities(mockCelebrities.slice(0, 2))
                .then(onResolve, onReject)
                .finally(done);

            $rootScope.$digest();

            function onResolve(v) {
                var expectedArg = 'https://this-is-a-test.firebaseio.com/votes/alexandre_astier_kendji_girac';
                expect(window.Firebase).toHaveBeenCalledWith(expectedArg);
                expect(v[mockFirebaseVoteRepresentation.fc.slug]).toBe(mockFirebaseVoteRepresentation.fc.counter);
                expect(v[mockFirebaseVoteRepresentation.sc.slug]).toBe(mockFirebaseVoteRepresentation.sc.counter);
            }

            function onReject() {
                fail('Promise should be resolved');
            }
        });

        it('should return an proper error message when getting vote data fails', function(done) {
            spyOn(window, 'Firebase');
            spyOn($mockFirebaseObjectReturn, '$loaded').and.returnValue(rejectedPromise());

            celebritiesManager.getVotesForCelebrities(mockCelebrities.slice(0, 2))
                .then(onResolve, onReject)
                .finally(done);

            $rootScope.$digest();

            function onResolve() {
                fail('Promise should be rejected');
            }

            function onReject(v) {
                expect(v).toBe("Impossible d'obtenir les votes pour ces célébrités ... :(");
            }
        });

        it('should return an proper error message when voting fails', function(done) {
            spyOn(window, 'Firebase');
            spyOn($mockFirebaseObjectReturn, '$loaded').and.returnValue(rejectedPromise());

            celebritiesManager.voteForACelebrity(mockCelebrities.slice(0, 2), mockCelebrities[0])
                .then(onResolve, onReject)
                .finally(done);

            $rootScope.$digest();

            function onResolve() {
                fail('Promise should be rejected');
            }

            function onReject(v) {
                expect(v).toBe("Impossible d'enregistrer votre vote pour le moment ... :(");
            }
        });

        it('should call simpleLocalPersistence.set method', function() {
            spyOn(mockSimpleLocalPersistence, 'set');
            celebritiesManager.logUserVote(mockCelebrities.slice(0, 2).reverse(), mockCelebrities[0]);
            expect(mockSimpleLocalPersistence.set).toHaveBeenCalledWith('alexandre_astier_kendji_girac', 'alexandre_astier');
        });

        it('should call simpleLocalPersistence.get method', function() {
            spyOn(mockSimpleLocalPersistence, 'get');
            celebritiesManager.getUserVote(mockCelebrities.slice(1, 3));
            expect(mockSimpleLocalPersistence.get).toHaveBeenCalledWith('kendji_girac_madonna');
        });

        describe('vote persistence', function() {

            beforeEach(function() {
                spyOn(window.Firebase.prototype, 'transaction');
                spyOn($mockFirebaseObjectReturn, '$loaded').and.returnValue(resolvedPromise());
            });

            it('should vote for the first celebrity', function() {
                celebritiesManager.voteForACelebrity(mockCelebrities.slice(0, 2), mockCelebrities[0]);

                var arg = digestAndReturnTransactionCallback();

                var newVote = arg({ fc: { slug: 'alexandre_astier', counter: 50 }, sc: { slug: 'kendji_girac', counter: 30 } });
                expect(newVote.fc.counter).toBe(51);
                expect(newVote.sc.counter).toBe(30);
            });

            it('should vote for the second celebrity', function() {
                celebritiesManager.voteForACelebrity(mockCelebrities.slice(0, 2), mockCelebrities[1]);

                var arg = digestAndReturnTransactionCallback();

                var newVote = arg({ fc: { slug: 'alexandre_astier', counter: 50 }, sc: { slug: 'kendji_girac', counter: 30 } });
                expect(newVote.fc.counter).toBe(50);
                expect(newVote.sc.counter).toBe(31);
            });

            it('should create a vote representation on the fly when no existing one is found', function() {
                celebritiesManager.voteForACelebrity(mockCelebrities.slice(0, 2), mockCelebrities[0]);

                var arg = digestAndReturnTransactionCallback();

                var newVote = arg(null);
                expect(newVote.fc.counter).toBe(1);
                expect(newVote.sc.counter).toBe(0);
            });

            function digestAndReturnTransactionCallback() {
                $rootScope.$digest();
                expect(window.Firebase.prototype.transaction).toHaveBeenCalled();
                var arg = window.Firebase.prototype.transaction.calls.mostRecent().args[0];
                expect(arg).toEqual(jasmine.any(Function));
                return arg;
            }

        });

        function resolvedPromise(data) {
            return $q(function(r) {
                r(data);
            });
        }

        function rejectedPromise() {
            return $q(function(_, r) {
                r();
            });
        }

    });

});
