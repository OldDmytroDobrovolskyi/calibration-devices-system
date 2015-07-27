angular
		.module('welcomeModule')
		.controller(
				'ApplicationStatusController',
				[
						'$scope',
						'$http',
						'$translate',
						'$state',
						'$log',
						'$modal',
						'$stateParams',
						'DataReceivingService',
						'DataSendingService',

						function($scope, $http, $translate, $state, $log,
								$modal, $stateParams, dataReceivingService, dataSendingService) {

							$scope.isShownForm = true;

//							$log.info($stateParams);

							$scope.code = $stateParams.clientCode;

							
							$scope.findCode = function() {
								dataReceivingService.getVerificationStatusById(
										$scope.code).success(function(status) {
//									$log.debug(status);
									$scope.status = resolveStatus(status);

								});

								$scope.isShownForm = false;
							};
							$scope.findVerification = function() {
								dataReceivingService
										.getVerificationById($scope.code)
										.success(
												function(verification) {
//													$log.debug('verif from func :'
//																	+ verification.status);
													$scope.verification = verification;

													if ($scope.verification.status == ('SENT')) {
														$scope.progress = '10';
													}
													if ($scope.verification.status == ('ACCEPTED' )) {
														$scope.progress = '20';
													}
													if ($scope.verification.status == ('REJECTED')) {
														$scope.progress = '0';
													}
													if ($scope.verification.status == 'IN_PROGRESS') {
														$scope.progress = '50';
													}
													if ($scope.verification.status == ('SENT_TO_VERIFICATOR' || 'TEST_COMPLETED')) {
														$scope.progress = '75';
													}
													if ($scope.verification.status == ( 'TEST_COMPLETED')) {
														$scope.progress = '90';
													}
													if ($scope.verification.status == ('TEST_OK' || 'TEST_NOK')) {
														$scope.progress = '100';
													}
													if ($scope.verification.status == ( 'TEST_NOK')) {
														$scope.progress = '0';
													}
													/*
													 * switch
													 * ($scope.verification.status) {
													 * case 'NOT_FOUND':
													 * $scope.progress = '0';
													 * case 'SENT':
													 * $scope.progress = '10';
													 * case 'IN_PROGRESS':
													 * $scope.progress = '30';
													 * case
													 * 'SENT_TO_VERIFICATOR':
													 * $scope.progress = '70';
													 * case 'TEST_OK':
													 * $scope.progress = '100';
													 * case 'ACCEPTED':
													 * $scope.progress = '20';
													 * case 'REJECTED':
													 * $scope.progress = '0';
													 * case 'TEST_COMPLETED':
													 * $scope.progress = '50';
													 * case 'TEST_NOK':
													 * $scope.progress = '0'; }
													 */
												});

								$scope.isShownForm = false;
							};
							$scope.getClientForm = function() {
								$scope.findCode();
								$scope.findVerification();
							
							}

							$scope.closeAlert = function() {
								$state.go($state.current, {}, {
									reload : true
								});
							}

							$scope.openDetails = function() {
								$modal
										.open({
											animation : true,
											templateUrl : '/resources/app/welcome/views/modals/archival-verification-details.html',
											controller : 'DetailsController',
											size : 'lg',
											resolve : {
												response : function() {
													return dataReceivingService
															.getVerificationById(
																	$scope.code)
															.success(
																	function(
																			verification) {
																		return verification;
																	});
												}
											}
										});
							};

							
							
							/**
					            * Modal window used to send questions about verification status
					            */
							$scope.responseSuccess = false;
							$scope.showSendingAlert = false;
							$scope.feedbackModal = function (ID) {
					        	   $log.debug('ID');
					        	   $log.debug(ID);
					        	        var modalInstance = $modal.open({
					        	            animation: true,
					        	            templateUrl: '/resources/app/welcome/views/modals/feedback-window.html',
					        	            controller: 'FeedbackController',
					        	            size: 'md',

					        	        });

					        	        /**
					        	         * executes when modal closing
					        	         */
					        	        modalInstance.result.then(function (formData, sendingStarted) {
					        	            var messageToSend = {
					        	         		   verifID : ID,
					        	         		   msg : formData.message
					        	         	   };
					        	 
					        	            $scope.showSendingAlert = true;
					        	            dataSendingService.sendMail (messageToSend)
					         	            		.success(function () {
					         	            			$scope.responseSuccess = true;
					         	            			$scope.showSendingAlert = false;
					         	            			$log.debug('response val');
					         	            			$log.debug($scope.responseSuccess);
					         	            		});
					        	         	   });
					        	      
					          	};
							
							$scope.closeAlertW = function () {
								$scope.responseSuccess = false;
								$scope.showSendingAlert = false;
							}
							
							
							$scope.chatOpen = function() {
								$modal
										.open({
											animation : true,
											templateUrl : '/resources/app/welcome/views/modals/chat.html',
											controller : 'ChatController',
											size : 'lg'
										});
							};

						} ]);

var resolveStatus = function(status) {

	switch (status) {
	case 'NOT_FOUND':
		return 'NOTFOUND_TRANSLATION';
	case 'SENT':
		return 'SENT_TRANSLATION';
	case 'IN_PROGRESS':
		return 'IN_PROGRESS_TRANSLATION';
	case 'SENT_TO_VERIFICATOR':
		return 'SENT_TO_VERIFICATOR_TRANSLATION';
	case 'TEST_OK':
		return 'TEST_OK_TRANSLATION';
	case 'ACCEPTED':
		return 'ACCEPTED_TRASLATION';
	case 'REJECTED':
		return 'REJECTED_TRASLATION';
	case 'TEST_COMPLETED':
		return 'TEST_COMPLETED_TRASLATION';
	case 'TEST_NOK':
		return 'TEST_NOK_TRASLATION';
	}
};
