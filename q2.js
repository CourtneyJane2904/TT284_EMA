class Calender
{
	constructor() 
	{
		/* calculate values for daysInMonth and month attributes */
		this.dateObj = new Date();
		this.monthAsStr = this.currMonthAsStr();
		this.daysInMonth = this.calcDaysInMonth();
	}

	get getMonth()
	{
		return this.monthAsStr;
	}

	get getDaysInMonth()
	{
		return this.daysInMonth;
	}

	currMonthAsStr()
	{
		const month = this.dateObj.toLocaleString("default", {month: "long"});
		console.log(month);
		return month;
	}

	calcDaysInMonth()
	{
		const currYear = this.dateObj.getFullYear();
		const currMonth = this.dateObj.getMonth() + 1;
		const daysInMonth = new Date(currYear,currMonth,0).getDate();
		console.log(daysInMonth);
		return daysInMonth;
	}

	genHTML()
	{
		let calHTML = document.getElementById('calendar').innerHTML+"<h4 id=\"monthHeading\">"+this.monthAsStr+"</h4>\n<div id=\"daysWrapper\">\n";
		for(let i=1 ; i <= this.daysInMonth ; i++)
		{
			calHTML += "<p class=\"daysInMonthA\" tabindex=\"2\" id=\"day"+i+"\">"+i+"</p>\n";
		}
		console.log(calHTML);
		document.getElementById('calendar').innerHTML = calHTML+"</div>";
	}
}

class eventWindows
{
	constructor()
	{
		this.origBody = document.body.innerHTML;
	}

	genWindow(event)
	{
		/*
		return corresponding data if present, otherwise return form
		*/
		this.activeID = event.target.id;
		console.log(this.activeID);
		if (document.getElementById("addEventFormWrapper") != null)
		{
			this.destroyWindow();
		}
		const formHTML = `
		    <div id="addEventFormWrapper" role="dialog" aria-labelledby="addWalkEventPopupWindow" aria-describedby="A popup window to add a walk event for the selected date.">\n
		    	<button id="exitButton">X</button>\n
				<form action="https://students.open.ac.uk/mct/tt284/reflect/reflect.php" method="GET" name="addWalk" id="addWalk" tabindex="0">\n
					<label for "walkName">Name of walk</label>\n
					  <input type="text" id="walkName" name="walkName">\n
					<label for "startTime">Start time</label>\n
					  <input type="time" id="startTime" name="startTime">\n
					<label for "endTime">End time</label>\n
					  <input type="time" id="endTime" name="endTime">\n
					<label for "meetingPoint">Meeting point</label>\n
					  <input type="text" id="meetingPoint" name="meetingPoint">\n
					<label for "distance">Distance (km)</label>\n
					  <input type="text" id="distance" name="distance">\n
					<label for "leader">Leader of walk</label>\n
					  <input type="text" id="leader" name="leader">\n
					<label for "comments">Comments</label>\n
					  <textarea id="comments" rows="4"></textarea>\n
					<input type="hidden" id="sessionID" name="sessionID" value="abcd1234-ee56-ff78-9090">
					<input type="submit" value="Submit" name="submit">
				</form>\n
			</div>
		`;

		document.body.innerHTML += formHTML;
		this.currWindow = "form";
		document.getElementById("exitButton").addEventListener("click",this.destroyWindow.bind(this),false);
		this.openWindow();
	}

	openWindow()
	{
		/* 
		add event listener for click on calendar date 
		*/

		let dayButtons = document.getElementsByClassName("daysInMonthA");
		for (let i = 0 ; i < dayButtons.length ; i++)
		{
			dayButtons[i].addEventListener("click", this.genWindow.bind(this), false);
			dayButtons[i].addEventListener("keypress", function(e) {if (e.keyCode === 13) {dayButtons[i].click();}}, false);
		}

	}

	destroyWindow()
	{
		if (this.currWindow === "form")
		{
			 document.getElementById("addEventFormWrapper").remove();
		}
	}

	closeWindow()
	{
		/* event listener for click on cross */
		document.getElementById("exitButton").addEventListener("click",this.destroyWindow.bind(this));
	}
 
	submitForm()
	{
		/* event listener for submitting form data */
	}

	saveDataToLocalStorage()
	{
		/* Save submitted data to local storage */
	}
}

const calObj = new Calender();
calObj.genHTML();
const evtWindowsObj = new eventWindows();
evtWindowsObj.openWindow();
