window.slide = function(idFrom, idTo){
	const slider = document.getElementById(idFrom);
    const output = document.getElementById(idTo);
    output.innerHTML = slider.value;

    slider.oninput = function() {
      output.innerHTML = this.value;
    }
}
