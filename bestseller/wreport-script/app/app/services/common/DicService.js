'use strict';

angular.module('wreport.app').factory('DicService', function (Restangular, CommonService, $q) {
    appConfig.dicMap = appConfig.dicMap || {};
    Restangular.setFullResponse(true);
    return {
        getDicByName: function (dicName) {
            var deferred = $q.defer();
            var dicNames = dicName.split(',');
            var isCached = false;
            for (var i = 0; i < dicNames.length; i++) {
                if (!appConfig.dicMap[dicNames[i]]) {
                    isCached = false;
                    break;
                }
            }
            if (isCached) {
                deferred.resolve(appConfig.dicMap);
                return deferred.promise;
            } else {
                Restangular.one('api/dics/name', dicName).get().then(function (response) {
                    for (var i = 0; i < dicNames.length; i++) {
                        appConfig.dicMap[dicNames[i]] = response.data[dicNames[i]];
                    }
                    deferred.resolve(appConfig.dicMap);
                });
                return deferred.promise;
            }
        },
    };
});

