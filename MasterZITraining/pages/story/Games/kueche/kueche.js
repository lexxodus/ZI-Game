var protoChoices = [{
  title: "Bier1",
  alk: true,
  url: "./../../../../img/kueche/bier1.png"
}, {
  title: "Bier2",
  alk: true,
  url: "./../../../../img/kueche/bier2.png",

}, {
  title: "Bier3",
  alk: true,
  url: "./../../../../img/kueche/bier3.png",

}, {
  title: "Bier4",
  alk: true,
  url: "./../../../../img/kueche/bier4.png",

}, {
  title: "muellerMilch",
  alk: false,
  url: "./../../../../img/kueche/muellermilch.png",
}];

var defteroChoices = [{
  title: "cola",
  alk: false,
  url: "./../../../../img/kueche/cola.png"
}, {
  title: "fanta",
  alk: false,
  url: "./../../../../img/kueche/fanta.png",

}, {
  title: "wasser",
  alk: false,
  url: "./../../../../img/kueche/wasser.png",

}, {
  title: "secco",
  alk: true,
  url: "./../../../../img/kueche/secco.png",

}];



function backNav() {

  window.location.replace('../../story.html');

}

function homeNav() {

  window.location.replace('../../../start/start.html');

}


$(document).ready(function() {
  $("#imageSizer").css("width", $(window).width());
  resize();


  $('#makeMeDraggable').draggable({
    containment: '#containment',
    cursor: 'move'
  });


});



function resize() { //init
  $("body").addClass("stop-scrolling");
  imgPanorama = $('#imageSizer');




  var widthContainer = ($(imgPanorama).width() + ($(imgPanorama).width() - $(window).width()));
  var heightContainer = ($(imgPanorama).height() + ($(imgPanorama).height() - $(window).height()));

  $("#containment").width(widthContainer);
  $("#containment").height(heightContainer);

  var containerPosTop = (-heightContainer / 2) + ($(window).height() / 2);
  var containerPosLeft = (-widthContainer / 2) + ($(window).width() / 2);

  $("#containment").css({
    top: containerPosTop,
    left: containerPosLeft,
    position: 'absolute'
  });

  // Placements
}

function initialToStart() {
  window.location.replace('gameKueche.html');

  resize();


}

function preGame() {
  $(".preGame").removeClass("hidden");
  $(".gameDoor").addClass("hidden");
  $(".gameBox").addClass("hidden");
}

function gameBegin() {
  $(".preGame").addClass("hidden");
  $(".gameBox").css("background-image", "url(./../../../../img/kueche/game.jpg)")
  $(".gameBox").removeClass("hidden");
  gameStart();

}


var count = 0;
var counter;

function timerStart() {

  count++;
  $(".timer").text(count);
}

var arrLengthOne = protoChoices.length;
var arrLengthTwo = defteroChoices.length;
var answer_options = [];

function gameStart() {

  getLevel(1).success(function(data){
      sessionStorage.setItem("lid", data.id);
      startGame();
  });

  // used for gacfacg
  var a;
  var answer;
  counter = setInterval(timerStart, 1000);
  for (var i = arrLengthOne; i >= 1; i--) {
    var protoChoice = protoChoices[Math.floor(Math.random() * protoChoices.length)];
    a = protoChoice;
    answer = {"picture_title": a.title, "alcolholic": a.alk};
    answer_options.push(answer);
    protoChoices.splice($.inArray(protoChoice, protoChoices), 1);
    $(".proto" + i).css("background-image", "url("+protoChoice.url+")");
    $(".proto" + i).attr("value", protoChoice.alk);
    $(".proto" + i).attr("title", protoChoice.title);
    $(".proto" + i).removeClass("hidden");
  }
  for (var j = arrLengthTwo; j >= 1; j--) {
    var defteroChoice = defteroChoices[Math.floor(Math.random() * defteroChoices.length)];
    a = defteroChoice;
    answer = {"picture_title": a.title, "alcolholic": a.alk};
    answer_options.push(answer);
    defteroChoices.splice($.inArray(defteroChoice, defteroChoices), 1);
    $(".deftero" + j).css("background-image", "url("+defteroChoice.url+")");
    $(".deftero" + j).attr("value", defteroChoice.alk);
    $(".deftero" + j).attr("title", defteroChoice.title);
    $(".deftero" + j).removeClass("hidden");
  }
  


}

var checksum = 0;
var points = 50;
var round = 1;
var score = 0;

var correct_answers = [];
var wrong_answers = [];
var difficulty_factor = 2;
var answer;
function check(obj) {
  var sender = (obj || window.event.target);
  var attribute = $(sender).attr("value");
  checksum++;
  if (attribute == "false") {
      $(sender).css("border", "5px solid rgb(25, 255, 25)");
      answer = $(sender).attr("title");
      correct_answers.push(answer);
      // points += 50;
  } else {
      $(sender).css("border", "5px solid red");
      answer = $(sender).attr("title");
      wrong_answers.push(answer);
      // points -= 25;
  }
  if (checksum == 2) {
      if(count <= 30){
          giveAnswer(correct_answers, wrong_answers, answer_options,
                  count, difficulty_factor)
              .success(function(data){
                  score = data.given_score_points;
                  if (score <= 0) {
                      score = 0;
                  }
                  clearInterval(counter);
                  congrats();
              });
      } else {
          score = 0;
          clearInterval(counter);
          congrats();
      }
      correct_answers = [];
      wrong_answers = [];
      // score = points - count;
  }
}



function retry() {

  $(".gameBox").removeClass("hidden");
  $(".congratsBox").addClass("hidden");
  $("#congratsMessage").remove();




  gameUpdate();
}

var roundOnePoints, roundOneTime, roundTwoPoints, roundTwoTime, roundThreePoints, roundThreeTime;


function nextRound() {
  if (round == 1) {
    roundOnePoints = score;
    roundOneTime = count;
  } else if (round == 2) {
    roundTwoPoints = score;
    roundTwoTime = count;
  } else {
    roundThreePoints = score;
    roundThreeTime = count;

  }

  $(".gameBox").removeClass("hidden");
  $(".congratsBox").addClass("hidden");
  $("#congratsMessage").remove();
  round++;
  gameUpdate();
}




function congrats() {

  var e = "<label id='congratsMessage'>Herzlichen Glückwunsch du hast Runde " + round + " absolviert! Du hast dabei " + score + " Punkte in " + count + " Sekunden erreicht!</label>";

  $(".gameBox").toggleClass("hidden");
  $(".congratsBox").toggleClass("hidden");


  $(".congratsBox").prepend(e);
  if (round == 3){
    $("button", "#nextBtn").toggleClass("hidden");
    $("button", "#endScoreBtn").toggleClass("hidden");

  }
}

function gameUpdate() {
  $(".timer").text("0");
  counter = setInterval(timerStart, 1000);
  var arrObjOne = {};
  var swapArrOne = [];
  var arrObjTwo = {};
  var swapArrTwo = [];
  count = 0;
  checksum = 0;
  points = 50;
//proto
  if (round <= 3) {
    for (var i = arrLengthOne; i >= 1; i--) {
      $(".proto" + i).css("border-style", "none");
      var cssURL = $(".proto" + i).css("background-image");
      cssURL = cssURL.replace('url(', '').replace(')', '');

      arrObj = {
        title: $(".proto" + i + " .title").text(),
        alk: $(".proto" + i).attr("value"),
        url: cssURL,

      }

      swapArrOne.push(arrObj);
    }
    for (var k = arrLengthTwo; k >= 1; k--) {
      $(".deftero" + k).css("border-style", "none");
      var cssURLtwo = $(".deftero" + k).css("background-image");
      cssURLtwo = cssURLtwo.replace('url(', '').replace(')', '');

      arrObjTwo = {
        title: $(".deftero" + k + " .title").text(),
        alk: $(".deftero" + k).attr("value"),
        url: cssURLtwo,

      }

      swapArrTwo.push(arrObjTwo);
    }
    //deftero

    //proto
    for (var j = arrLengthOne; j >= 1; j--) {
      var randomObjOne = swapArrOne[Math.floor(Math.random() * swapArrOne.length)];
      swapArrOne.splice($.inArray(randomObjOne, swapArrOne), 1);

      $(".proto" + j + " .title").text(randomObjOne.title);
      $(".proto" + j).css("background-image", "url("+randomObjOne.url+")");
      $(".proto" + j).attr("value", randomObjOne.alk);
    }
    //deftero
    for (var l = arrLengthTwo; l >= 1; l--) {
      var randomObjTwo = swapArrTwo[Math.floor(Math.random() * swapArrTwo.length)];
      swapArrTwo.splice($.inArray(randomObjTwo, swapArrTwo), 1);

      $(".deftero" + l + " .title").text(randomObjTwo.title);
      $(".deftero" + l).css("background-image", "url("+randomObjTwo.url+")");
      $(".deftero" + l).attr("value", randomObjTwo.alk);
    }

  } else {
    endGameProtocol();
  }
}
var endScore, endCounter;
function endGameProtocol() {
  endGame();
  calcLevelSkill();
  endScore = roundOnePoints + roundTwoPoints + roundThreePoints;
  endCounter = roundOneTime + roundTwoTime + roundThreeTime;
  var e = "<label id='congratsMessage'>Herzlichen Glückwunsch du hast das Spiel mit " + endScore + " Punkte in insgesamt " + endCounter + " Sekunden absolviert!</label>";
  $(".gameBox").addClass("hidden");
  $(".congratsBox").removeClass("hidden");
  $("#nextBtn").addClass("hidden");
  $("#retryBtn").addClass("hidden");

  $("#homeBtn").removeClass("hidden");
  $(".congratsBox").prepend(e);
}

function home() {
  sessionStorage.setItem("kuecheScore",endScore);
  sessionStorage.setItem("kuecheTime",endCounter);
  window.location.replace('../../story.html');
}
