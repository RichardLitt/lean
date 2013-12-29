var diceCtrl = function ($scope, $rootScope, $filter, $location, $routeParams, $timeout, angularFire, fbURL) {
  
  $scope.spinner = true;

  $rootScope.$watch('user', function() {
    if ($rootScope.user) {
      
      $scope.user = $rootScope.user;
      
      angularFire(fbURL + $scope.user.id + '/projects/', $scope, 'remote', {}).
        then(function() {

          $scope.showProject = true;

          $scope.spinner = false;

          $scope.todos = angular.copy($scope.remote);

          $scope.filterSecId = function(items) {
            var result = {};
            angular.forEach(items, function(value, key) {
              if (value.archive != false) {
                result[key] = value;
                result[key].id = key;
              }
            });
            return result;
          };

          $scope.filterKey = function(items) {
            var result = new Array();
            angular.forEach(items, function(key, value) {
              result.push(value);
            });
            return result;
          };

          $scope.chooseTodo = function(items) {
              // Make it iterable
              var array = [];
              Object.keys(items).forEach(function(key) {
                array.push(items[key]);
              });
              // Sort by importance in reverse
              array = _.sortBy(array, function(todo){return todo.importance}).reverse();
              // For a ranking, from ten down
              for (var i = 10; i > -1; i--) {
                // Find all items in that ranking, then break
                if (_.where(array, {importance: i})) {
                  array = _.where(array, {importance: i})
                  break;
                }
              }
              // Choose an item randomly.
              return $scope.todo = _.sample(array);
          };

          $scope.todo = $scope.chooseTodo($scope.todos)

      });
    }
  })
}