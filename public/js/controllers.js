angular.module('MyApp', ['timer']);
        function MyAppController1($scope) {
            $scope.timerRunning = true;
 
            $scope.startTimer = function (){
                $scope.$broadcast('timer-start');
                $scope.timerRunning = true;
            };
 
            $scope.stopTimer = function (){
                $scope.$broadcast('timer-stop');
                $scope.timerRunning = false;
            };
			
        }
        MyAppController1.$inject = ['$scope'];
		
		function MyAppController2($scope) {
            $scope.timerRunning = true;
 
            $scope.startTimer = function (){
                $scope.$broadcast('timer-start');
                $scope.timerRunning = true;
            };
 
            $scope.stopTimer = function (){
                $scope.$broadcast('timer-stop');
                $scope.timerRunning = false;
            };
			
        }
		MyAppController2.$inject = ['$scope'];