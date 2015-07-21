angular
    .module('employeeModule')
    .controller('ArchivalVerificationsControllerProvider', ['$scope', '$modal', '$log', 'VerificationServiceProvider',

        function ($scope, $modal, $log, verificationServiceProvider) {

            $scope.totalItems = 0;
            $scope.currentPage = 1;
            $scope.itemsPerPage = 10;
            $scope.pageData = [];

            $scope.onTableHandling = function () {
                updatePage();
            };


            updatePage();

            function updatePage() {
                verificationServiceProvider
                    .getArchivalVerifications($scope.currentPage, $scope.itemsPerPage)
                    .success(function (verifications) {
                        $scope.pageData = verifications.content;
                        $scope.totalItems = verifications.totalItems;
                    });
            }

            $scope.openDetails = function ($index) {
                $modal.open({
                    animation: true,
                    templateUrl: 'resources/app/provider/views/modals/archival-verification-details.html',
                    controller: 'DetailsModalControllerProvider',
                    size: 'lg',
                    resolve: {
                        response: function () {
                            return verificationServiceProvider.getArchivalVerificationDetails(
                                $scope.pageData[$index].id)
                                .success(function (verification) {
                                    return verification;
                                });
                        }
                    }
                });
            };
        }]);
