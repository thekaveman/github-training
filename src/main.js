(function () {
  "use strict";

  angular
    .module("library-patrons", [])
    .config(function($sceDelegateProvider){
      $sceDelegateProvider.resourceUrlWhitelist([
        "self",
        "https://thekaveman.github.io/**"
      ]);
    })
    .component("libraryPatrons", {
      bindings: {
        root: "@",
      },
      controller: ["$http", libraryPatrons],
      template: '<ng-include src="$ctrl.templateUrl"></ng-include>'
    });

    function libraryPatrons ($http) {
      var $ctrl = this;

      $ctrl.$onInit = function () {
        $ctrl.q = "";
        $ctrl.templateUrl = $ctrl.root + "library-patrons.html";

        $http.get($ctrl.root + "data.csv").then(function (results) {
          $ctrl.process(results.data);
        });
      };

      $ctrl.process = function(raw) {
        var lines = raw.split("\n");
        $ctrl.header = lines[0].split(",").map(function(s) {
          return s.replace(/\W/g, "");
        });
        var data = lines.slice(1);

        $ctrl.data = [];

        for (var i = 0; i < data.length; i++) {
          var fields = data[i].split(",");
          var item = {};
          var push = false;

          for (var j = 0; j < $ctrl.header.length; j++) {
            item[$ctrl.header[j]] = fields[j];
            push = true;
          }

          $ctrl.data.push(item);
        }

        $ctrl.data = $ctrl.data.slice(1);
      }
    }
})();
