var app = angular.module("myApp", ["ngRoute"]);

app.config(function ($routeProvider) {
    $routeProvider
    .when("/",{
        templateUrl: "home.html",
        controller: "subjectCtrl"
    })
    .when("/lienhe",{
        templateUrl: "'lienhe.html"
    })
    .when("/gioithieu",{
        templateUrl: "gioithieu.html"
    })
    .when("/hoidap",{
        templateUrl: "hoidap.html"
    })
    .when("/gopy",{
        templateUrl: "gopy.html"
    })
    .when("/register",{
        templateUrl:"register.html",
        controller:"registerCtrl"
    })
    .when("/login",{
        templateUrl:"login.html",
        controller:"loginCtrl"
    })
    .when("/forgot",{
        templateUrl:"forgot.html",
        controller:"forgotCtrl"
    })
    .when("/quiz/:id/:name",{
        templateUrl: "quiz.html",
        controller: "quizsCtrl" 
    })
})
//dang ky
app.controller("registerCtrl",function($scope, $http){
    $scope.addStudent = function(){
       $http.post("http://localhost:3000/sinhvien",{
        username:$scope.username,
        fullname:$scope.fullname,
        password:$scope.password,
        email:$scope.email,
        birthday:$scope.birthday,
        gender:$scope.gender,
        schoolfee:$scope.schoolfee,
        mark:$scope.mark
       }).then(function(response){
           alert("dang ky thanh cong");
       }).catch(function(error){
           alert("dang ky that bai"); 
       })
    }
});
//dang nhap

app.controller("loginCtrl",function($scope,$http){
    $http.get("http://localhost:3000/sinhvien").then(function(res){
        $scope.sinhvien = res.data;
        $scope.login = function(){
            for(var i = 0; i<$scope.sinhvien.length;i++){
                if($scope.username !="" && $scope.password !=""){
                    if($scope.username == $scope.sinhvien[i].username && $scope.password == $scope.sinhvien[i].password){
                        var name = $scope.sinhvien[i].fullname;
                        alert(' Chúc mừng ' + name + 'đã đăng nhập thành công');
                        window.location.href="index.html";
                    }
                }
            }
        }
        $scope.logout = function () {
            $cookies.remove("user");
            window.location.href = "#!login";
            location.reload();
            $scope.login = false;
        }
    })
})
//quen mk
app.controller("forgotCtrl",function($scope,$http){
    $http.get("http://localhost:3000/sinhvien").then(function(ress){
        $scope.sinhvien = ress.data;
        $scope.forgot = function(){
            for(var i = 0; i<$scope.sinhvien.length;i++){
                    if($scope.username = $scope.sinhvien[i].username && $scope.email == $scope.sinhvien[i].email){
                        var matkhau = $scope.sinhvien[i].password;
                        var name = $scope.sinhvien[i].username;
                        alert(' Mật Khẩu của tài khoản ' + name + ' là ' + matkhau);
                    }
                
            }
        }
    })
})
//danh sach mon hoc
app.controller("subjectCtrl",function($scope,$http){
    $scope.list_subject = [];
    $http.get("db/Subjects.js").then(function(reponse){
        $scope.list_subject=reponse.data;
    });
});
///quiz
app.controller("quizsCtrl",function($scope,$http,$routeParams,quizFactory){
    $http.get("db/Quizs/"+$routeParams.id+".js").then(function(res){
        quizFactory.questions = res.data;
    });
})
//quiz
app.directive("quizfpoly", function (quizFactory,$routeParams) {
    return {
        restrict: "AE",
        scope: {},
        templateUrl: "template-quiz.html",
        link: function (scope, elem, attrs) {
            scope.start = function () {
                quizFactory.getQuestions().then(function(){
                    scope.subjectName= $routeParams.name;
                    var h = 0; // Giờ
                    var m = 0; // Phút
                    var s = 10; // Giây
                    var timeout = null; // Timeout

                    $(document).ready(function start() {
                        if (s === -1) {
                            m -= 1;
                            s = 59;
                        }
                        if (m === -1) {
                            h -= 1;
                            m = 59;

                        }
                        if (h == -1) {
                            clearTimeout(timeout);
                            alert('Hết giờ');
                         scope.quizOver = true;
                            return false;
                        }


                        document.getElementById('h').innerText = h.toString();
                        document.getElementById('m').innerText = m.toString();
                        document.getElementById('s').innerText = s.toString();

                        timeout = setTimeout(function() {
                            s--;
                            start();
                        }, 1000);

                    });
                    scope.id = 1;
                    scope.quizOver = false;// chua hoan thanh
                    scope.inProgess = true;
                    scope.getQuestion();
                });
            };
            scope.reset = function () {
                scope.inProgess = false;
                scope.score = 0;
            };
            scope.getQuestion = function () {
                var quiz = quizFactory.getQuestion(scope.id);
                if (quiz) {
                    scope.question = quiz.Text;
                    scope.options = quiz.Answers;
                    scope.answer = quiz.AnswerId;
                    scope.answerMode = true;
                } else {
                    scope.quizOver = true;
                }


            };
            //chon cau hoi
            scope.checkAnswer = function () {
                // alert("answer");  
                if (!$("input[name=answer]:checked").length) return;
                var ans = $("input[name=answer]:checked").val();
                if (ans == scope.answer) {
                    // alert("dung")
                    scope.score++;
                    scope.correctAns = true;
                } else {
                    // alert("sai")
                    scope.correctAns = false;
                };
                scope.answerMode = false;
            };
            scope.nextQuestion = function () {
                scope.id++;
                scope.getQuestion();
            };
            scope.reset();
        }
    }
});
//quiz
app.factory("quizFactory", function ($http,$routeParams) {
    
    return {

        getQuestions: function(){
            return $http.get("db/Quizs/"+$routeParams.id+".js").then(function(res){
                questions = res.data;
                // alert(questions.length);
            });
        },
        getQuestion: function (id) {
            //chay radom 10 cau hoi
            var randomItem = questions[Math.floor(Math.random() * questions.length)];
            var count = questions.length;
            if (count > 10) {
                count = 10;
            }
            if (id < 10) {
                return randomItem;
            } else {
                return false;
            }

        }
    }
});