
var current_word_i = 0;
var words_list = [];
var accuracy_list = [];
var current_word = "";
var lastChar = 0;
var phraseCount = 0;

var phraseList = {}

function mainMenu() {
	document.getElementById("content").classList.remove("hidden");
	document.getElementById("playzone").classList.add("hidden");
	document.getElementById("results").classList.add("hidden");
}

function goToPlayZone() {
	var path = "/data"+ ((document.location.pathname == "/") ? "/en" : document.location.pathname)+"/phrases.json"
    $.getJSON(path, function(data) { 
    	console.log(data);
    	phraseList = data;
		current_word_i = 0;
		words_list = [];
		accuracy_list = [];
		current_word = "";
		lastChar = 0;
		document.getElementById("content").classList.add("hidden");
		document.getElementById("playzone").classList.remove("hidden");
		document.getElementById("results").classList.add("hidden");
		getNewPhrase();
    });
}

function gotoResults() {
	document.getElementById("content").classList.add("hidden");
	document.getElementById("playzone").classList.add("hidden");
	document.getElementById("results").classList.remove("hidden");

	document.getElementById("results_div").innerHTML = ""

	var out = ""
	var wcount = 0;
	var wcount_correct = 0;
	for (var word in accuracy_list) {
		if(accuracy_list[word][0] == accuracy_list[word][1]) {
			out += "<span class=\"results_correct\">"+accuracy_list[word][1]+" → "+accuracy_list[word][0]+"</span><br>"
			wcount_correct+=1;
		} else {
			out += "<span class=\"results_incorrect\">"+accuracy_list[word][1]+" → "+accuracy_list[word][0]+"</span><br>"
		}
		wcount+=1;
	}
	document.getElementById("results_div").innerHTML = out

	document.getElementById("results_accu").innerHTML = Math.round((wcount_correct/wcount*100)*100)/100 + "%"
	

}

function writePhrase(text) {
	document.getElementById("playzone_words").innerHTML = ""
	var words = text.split(' ');
	var wcount = 0;
	var out = "";
	out += "<span id=\"playzone_word_"+wcount+"\" class=\"playzone_word_current\">"+words[wcount]+"</span> &nbsp"
	wcount++;
	for (var word in words) {
		if(wcount<=words.length-1) {
			out += "<span id=\"playzone_word_"+wcount+"\" class=\"playzone_word_next\">"+words[wcount]+"</span> &nbsp"
			wcount++;
		}
	}
	document.getElementById("playzone_words").innerHTML = out
	current_word_i = 0;
	words_list = words;
}

function getNewPhrase() {
	var maxPhrase = 9;
	if(phraseCount<=maxPhrase) {
		var rand = phraseList["list"][Math.floor(Math.random() * phraseList["list"].length)];
		document.getElementById("playzone_wordlist_input").value = ""
		writePhrase(rand)
		phraseCount+=1;
		document.getElementById("playzone_phrasecount").innerHTML = phraseCount+"/"+maxPhrase
	}
	if(phraseCount>maxPhrase) {
		gotoResults()
	}
	
}

function keypress(event){
	var chCode = event.which || event.keyCode;
	if(chCode == 32 && lastChar != 32 && current_word_i<=words_list.length-1) {
		document.getElementById("playzone_word_"+current_word_i).className = "playzone_word_done";
		accuracy_list.push([current_word,words_list[current_word_i]]);

		current_word_i += 1;

		if(current_word_i<=words_list.length-1) {
			document.getElementById("playzone_word_"+current_word_i).className = "playzone_word_current";
		} else if (current_word_i==words_list.length) {
			getNewPhrase()
		}
		current_word = "";
	} else {
		current_word += String.fromCharCode(chCode);
	}
	lastChar = chCode
}
function keydown(event) {
	var chCode = event.which || event.keyCode;
	if(chCode == 8 && document.getElementById("playzone_wordlist_input_backscape").checked) {
		event.preventDefault();
	}
}