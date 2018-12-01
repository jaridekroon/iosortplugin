var B; //block size in number of elements
var I; //internal memory size in number of blocks
var im; //content of internal memory;
var E; //external memory size in number of blocks
var em; //content of external memory;

var fromBlock; //id of source block of move
var selection; //boolean that states whether first selection is made or not

var config;

init();

function init() {
	document.getElementById("reset").addEventListener('click', reset);
	document.getElementById("sort").addEventListener('click', sort);
	document.getElementById("submit").addEventListener('click', submit);
	
	courseraApi.callMethod({
    type: "GET_SESSION_CONFIGURATION",
    onSuccess: function(configuration) {
      config = configuration;
      setupMemory();
	  drawMemory();
	  updateMemoryView();
    },
    onFailure: console.log
	});
}

function submit() {
	var total = [];
	for(var i = 0; i < E; i++) {
		if (em[i] != "") {
			total = total.concat(em[i]);
		}
	}
	var clone = total.slice(0);
	var sorted = total.sort((a,b) => a-b);
	var correct = true;
	//all elements should be back in external memory
	if(sorted.length != E*B) {
		correct = false;
	}
	//all elements should be in sorted position
	for(var i = 0; i < sorted.length; i++) {
		if(sorted[i] != clone[i]) {
			correct = false;
		}
	}
	if(correct) {
		document.getElementById("feedback").innerHTML = "Correct!";
	}
	else {
		document.getElementById("feedback").innerHTML = "Incorrect";
	}
	
	courseraApi.callMethod({
      type: "SET_ANSWER",
      data: {
        answer: { mem: clone }
      }
    });
	
}

function sort() {
	var total = [];
	for(var i = 0; i < I; i++) {
		if (im[i] != "") {
			total = total.concat(im[i]);
		}
	}
	var sorted = total.sort((a,b) => a-b);
	
	for(var i = 0; i < I; i++) {
		im[i] = "";
	}
	//now put sorted elements back in blocks;
	for(var i = 0; B*i < sorted.length; i++) {
		im[i] = sorted.slice(i*B,(i+1)*B);
	}
	updateMemoryView();
}

function reset() {
	setupMemory();
	updateMemoryView();
}

//add memory contents
function setupMemory() {
	//set data, hardcoded for now
	I = config.I;
	E = config.E;
	B = config.B;
	im = new Array("","","");
	em = new Array(
		new Array(5,6,8),
		new Array(1,9,3),
		new Array(7,1,17),
		new Array(71,3,0),
		new Array(1,9,2),
		new Array(3,4,1),
		new Array(8,5,10)
	);
	selection = false;
}

//draw the memory blocks
function drawMemory() {
	//draw external memory
	var container = document.getElementById("extmem");
	for(var i = 0; i < E; i++) {
		var block = document.createElement("div");
		block.className = "block";
		block.id = "e" + i;
		block.addEventListener("click", function(){sel(this.id);	});
		container.appendChild(block);
	}
	//draw internal memory
	var container = document.getElementById("intmem");
	for(var i = 0; i < I; i++) {
		var block = document.createElement("div");
		block.className = "block";
		block.id = "i" + i;
		block.addEventListener("click", function(){sel(this.id);	});
		container.appendChild(block);
	}
}

//write memory contents in blocks
function updateMemoryView() {
	//update external memory
	for(var i = 0; i < E; i++) {
		var block = document.getElementById("e" + i);
		block.innerHTML = em[i];
	}
	//update internal memory
	for(var i = 0; i < I; i++) {
		var block = document.getElementById("i" + i);
		block.innerHTML = im[i];
	}
}

//function that specifies behavior for block selection
function sel(id) {
	//if this is the second selection
	to_index = parseInt(id.substring(1,2));
	if(selection) {
		//move block from internal to empty external space
		from_index = parseInt(fromBlock.substring(1,2));
		if(fromBlock.substring(0,1) == "i") {
			if(id.substring(0,1) == "e") {
				if(em[to_index] == "") {
					document.getElementById(fromBlock).style.backgroundColor ="white";
					em[to_index] = im[from_index];
					im[from_index] = "";
					selection = false;
				}
			}
		}
		//move block from external to empty internal space
		if(fromBlock.substring(0,1) == "e") {
			if(id.substring(0,1) == "i") {
				if(im[to_index] == "") {
					document.getElementById(fromBlock).style.backgroundColor ="white";
					im[to_index] = em[from_index];
					em[from_index] = "";
					selection = false;
				}
			}
		}
	}
	else {
		//selected block should not be empty
		if(id.substring(0,1) == "e") {
			//there should be an empty spot in internal memory
			for(var i = 0; i < I; i++) {
				if(im[i] == "" && em[to_index] != "") {
					document.getElementById(id).style.backgroundColor = "green";
					fromBlock = id;
					selection = true;
					break;
				}
			}
		}
		if(id.substring(0,1) == "i") {
			if(im[to_index] != "") {
				document.getElementById(id).style.backgroundColor = "green";
				fromBlock = id;
				selection = true;
			}
		}
	}
	updateMemoryView();
}