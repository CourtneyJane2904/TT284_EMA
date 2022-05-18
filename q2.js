class Calender
{
	/*
	A class representing the interactive calendar as an object

	Generates HTML for calendar based on system date and has functionality
	for going back and forward through the months
	*/
	constructor() 
	{
		/* calculate values for daysInMonth and month attributes */
		this.dateObj = new Date();
		this.monthAsStr = this.currMonthAsStr();
		this.yearAsStr = this.currYearAsStr();
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

	// Get month of calendar as a string
	currMonthAsStr()
	{
		const month = this.dateObj.toLocaleString("default", {month: "long"});
		return month;
	}

	// get year of calendar as a string
	currYearAsStr()
	{
		const year = this.dateObj.getFullYear();
		return year;
	}

	// calculate days in month of date returned by dateObj field
	calcDaysInMonth()
	{
		const currYear = this.dateObj.getFullYear();
		const currMonth = this.dateObj.getMonth() + 1;
		const daysInMonth = new Date(currYear,currMonth,0).getDate();
		return daysInMonth;
	}

	// generate calendar for month returned by dateObj and create new event listener for a change of month
	genHTML()
	{
		let calHTML = "<h3 id=\"monthHeading\" class=\"centered\">"+this.monthAsStr+" "+this.yearAsStr+"</h3>\n<div id=\"daysWrapper\" class=\"blueBorder curved\">\n";
		for(let i=1 ; i <= this.daysInMonth ; i++)
		{
			calHTML += "<p class=\"daysInMonthA greyButt centered blueBorder\" tabindex=\"2\" id=\""+i+this.monthAsStr+this.yearAsStr+"\">"+i+"</p>\n";
		}
		console.log(calHTML);
		document.getElementById('calendar').innerHTML = calHTML+"</div><button id=\"back\" class=\"chMonth greyButt centered blueBorder curved\"><</button><button id=\"forward\" class=\"chMonth greyButt centered blueBorder curved\">></button>";
		this.changeMonthListener();
	}

	changeMonthListener()
	{
		let chMonthButtons = document.getElementsByClassName("chMonth");
		for (let i = 0 ; i < chMonthButtons.length ; i++)
		{
			chMonthButtons[i].addEventListener("click", this.calcNewMonth.bind(this)
			);
		}
	}

	// executed by changeMonthListener
	// sets month of date in dateObj to the month ahead or month previous
	calcNewMonth(e)
	{
		if (e.target.id === "forward")
		{
			this.dateObj.setMonth(this.dateObj.getMonth()+1);
		}
		else
		{
			this.dateObj.setMonth(this.dateObj.getMonth()-1);
		}

		this.monthAsStr = this.currMonthAsStr();
		this.yearAsStr = this.currYearAsStr();
		this.daysInMonth = this.calcDaysInMonth();
		this.genHTML();

		if (document.getElementById("addEventFormWrapper") != null)
		{
			evtWindowsObj.destroyWindow();
		}
		evtWindowsObj.openWindowListener();

	}
}

class eventWindows
{
	/*
	A class for representing the popup window as an object 

	generates HTML and listens for window exit as of now
	*/
	constructor()
	{
		this.origBody = document.body.innerHTML;
	}

	genWindow(event)
	{
		/*
		return corresponding data if present, otherwise return form
		*/

		// activeID used to keep track of which day there's a window open for
		this.activeID = event.target.id;

		// destroy current walk event form if there's one open
		if (document.getElementById("addEventFormWrapper") != null)
		{
			this.destroyWindow();
		}

		// HTML for form to add event
		const formHTML = `
		    <div id="addEventFormWrapper" class="blueBorder" role="dialog" aria-labelledby="addWalkEventPopupWindow" aria-describedby="A popup window to add a walk event for the selected date.">\n
		    	<button id="exitButton" class="greyButt formButt blueBorder"> X </button>\n
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
					<label for="submit"></label>
					  <input type="submit" value="Submit" name="submit" class="greyButt formButt blueBorder">
					<input type="hidden" id="sessionID" name="sessionID" value="abcd1234-ee56-ff78-9090">
					<input type="hidden" id="walkDate" name="walkDate" value="`+this.activeID+`">
				</form>\n
			</div>
		`;

		// add form HTML to body's inner HTML 
		document.body.innerHTML += formHTML;
		// create new listeners for window close and window open
		this.closeWindowListener();
		this.openWindowListener();
		// create new listener for calendar month change
		calObj.changeMonthListener();
	}


	destroyWindow()
	{
		document.getElementById("addEventFormWrapper").remove();
	}

	// event listeners for the object- listen for window being opened for a day and closed for a day
	openWindowListener()
	{

		let dayButtons = document.getElementsByClassName("daysInMonthA");
		for (let i = 0 ; i < dayButtons.length ; i++)
		{
			dayButtons[i].addEventListener("click", this.genWindow.bind(this), false);
			dayButtons[i].addEventListener("keypress", function(e) {if (e.keyCode === 13) {dayButtons[i].click();}}, false);
		}

	}

	closeWindowListener()
	{
		/* event listener for click on cross */
		document.getElementById("exitButton").addEventListener("click",this.destroyWindow.bind(this));
	}
 
}

const calObj = new Calender();
const evtWindowsObj = new eventWindows();

calObj.genHTML();
evtWindowsObj.openWindowListener();
