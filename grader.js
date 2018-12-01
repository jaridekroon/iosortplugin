exports.gradeAnswer = function(graderConfig, sessionConfig, answer) {
	var total = answer.mem;
	var clone = total.slice(0);
	var sorted = total.sort((a,b) => a-b);
	var correct = true;
	//all elements should be back in external memory
	if(sorted.length != sessionConfig.E*sessionConfig.B) {
		correct = false;
	}
	//all elements should be in sorted position
	for(var i = 0; i < sorted.length; i++) {
		if(sorted[i] != clone[i]) {
			correct = false;
		}
	}
	
	const isCorrect = correct;
	const feedback = isCorrect ? "Great job!" : "Incorrect, please try again.";
	
	return {
		isCorrect: isCorrect,
		feedback: feedback,
		feedbackConfiguration: {
		  feedback,
		  isCorrect
		}
	};
};
