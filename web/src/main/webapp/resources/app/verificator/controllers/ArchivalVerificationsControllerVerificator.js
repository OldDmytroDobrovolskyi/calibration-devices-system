angular
    .module('employeeModule')
    .controller('ArchivalVerificationsControllerVerificator', ['$scope', '$modal', '$log', 'VerificationServiceVerificator', 'ngTableParams', '$filter', '$rootScope', '$timeout',

        function ($scope, $modal, $log, verificationServiceVerificator, ngTableParams, $filter, $rootScope, $timeout) {


    	$scope.clearAll = function(){
        	$scope.search.idText=null;
        	$scope.search.formattedDate=null;
        	$scope.dt = null;
        	$scope.search.lastNameText=null;
        	$scope.search.streetText=null;
        	$scope.search.status = null;
        	$scope.search.employee = null;
        	$scope.tableParams.reload();
        }
        
        $scope.clearId = function () {
        	$scope.search.idText = null;
        	$scope.tableParams.reload();
        }
        $scope.clearLastName = function () {
        	$scope.search.lastNameText = null;
        	$scope.tableParams.reload();
        }
        $scope.clearStreet = function () {
        	$scope.search.streetText = null;
        	$scope.tableParams.reload();
        }
        $scope.clearStatus = function () {
        	$scope.search.status = null;
        	$scope.tableParams.reload();
        }
        $scope.clearEmployee = function () {
        	$scope.search.employee = null;
        	$scope.tableParams.reload();
        }
        var promiseSearchTimeOut;
        $scope.doSearch = function() {
        	promiseTimeOut = $timeout(function() {
            $scope.tableParams.reload();
        	}, 1500);
        }

        $scope.$on('refresh-table', function () {
        	 $scope.clearAll();
        }); 
        
            $scope.search = {
            		idText:null,
            		formattedDate :null,
            		lastNameText:null,
            		streetText: null,
            		status: null
            }
            
            $scope.tableParams = new ngTableParams({
                page: 1,
                count: 10
            			}, {
                total: 0,
                getData: function ($defer, params) {

                	verificationServiceVerificator.getArchiveVerifications(params.page(), params.count(), $scope.search)
                    				.success(function (result) {
                    					$defer.resolve(result.content);
                    					params.total(result.totalItems);
                    				}, function (result) {
                    					$log.debug('error fetching data:', result);
                    				});
                 }
            });

            $scope.openDetails = function (verifId, verifDate) {

                $modal.open({
                    animation: true,
                    templateUrl: '/resources/app/provider/views/modals/archival-verification-details.html',
                    controller: 'ArchivalDetailsModalController',
                    size: 'lg',
                    resolve: {
                        response: function () {
                            return verificationServiceVerificator.getArchivalVerificationDetails(verifId)
                                .success(function (verification) {
                                    verification.id = verifId;
                                    verification.initialDate = verifDate;                                
                                    return verification;
                                });
                        }
                    }
                });
            };
            
            /**
             *  Date picker and formatter setup
             * 
             */
            $scope.openState = {};
            $scope.openState.isOpen = false;

            $scope.open = function ($event) {
                $event.preventDefault();
                $event.stopPropagation();
                $scope.openState.isOpen = true;
            };


            $scope.dateOptions = {
                formatYear: 'yyyy',
                startingDay: 1,
                showWeeks: 'false'
              };

           $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
           $scope.format = $scope.formats[2];

           $scope.changeDateToSend = function(val){
            	
            	  if(angular.isUndefined(val)){
            		  $scope.search.formattedDate = null;
            		  $scope.tableParams.reload();
            	  } else {
            		  var datefilter = $filter('date');
                	  $scope.search.formattedDate = datefilter(val, 'dd-MM-yyyy');
                	  $scope.tableParams.reload();
            	  }
             } 
           
        }]);
