import './App.css';
import React, { useState, useEffect} from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';

// ["Member","Work Email","Group","Shift Start Date","Shift Start Time","Shift End Date","Shift End Time","Theme Color","Custom Label","Unpaid Break (minutes)","Notes","Shared"],

// ["Employee Names","Position","Location","Start Date","End Date","Start Time","End Time","Paid Breaks","Unpaid Breaks","Open Slots","Remote Location","Required Skills","Tags","Title","Note"]

function timeAddMinutes(time, min) {
  var t = time.split(":"),      // convert to array [hh, mm, ss]
      h = Number(t[0]),         // get hours
      m = Number(t[1]);         // get minutes
  m+= min % 60;                 // increment minutes
  h+= Math.floor(min/60);       // increment hours
  if (m >= 60) { h++; m-=60 }   // if resulting minues > 60 then increment hours and balance as minutes
  
  return (h+"").padStart(2,"0")  +":"  //create string padded with zeros for HH and MM
         +(m+"").padStart(2,"0")       // original seconds unchanged
} 

function getTimeAsNeededForHumanity(time) {
  time = time.replace(":", "")
  let ending = 'am'
  if (time > 1159) {
    ending = 'pm'
    if (time > 1259) {
      let hrs = (parseInt(time.slice(0, 2))-12).toString()
      if (hrs.length === 1){
        hrs = '0' + hrs
      }
      time = hrs + ":" + time.slice(2) + ending
    } else {
    time = time.slice(0, 2) + ":" + time.slice(2) + ending
    } 
  } else {
    time = time.slice(0, 2) + ":" + time.slice(2) + ending
  }
  return time
}

function PersonsDay({index, dayName, shifts, staff, monday, group}) {


  //console.log(shifts.length)
  //console.log(shiftsArray)

  // console.log("index", index)
  // console.log("dayName", dayName)
  // console.log("shiftNames", shiftNames)
  // console.log("shiftStartTimes", shiftStartTimes)
  // console.log("shiftBreakStartTimes", shiftBreakStartTimes)


  const [shift, setshift] = useState('');
  let teamsCsv = []
  let humanityCsv = []

  useEffect(() => { 

    
  },[]);

  const setShift = (event) => {  //event.target.value

    teamsCsv = JSON.parse(localStorage.getItem('teamsCSV'))

    //make new shift 

    let tempArray = [staff[0]]
    tempArray.push(staff[1])
    tempArray.push(group[0])
    tempArray.push(monday.add(index, 'day').format('MM/DD/YYYY'))
    let startTime = event.target.value[2].slice(0, 2) + ":" + event.target.value[2].slice(2)
    tempArray.push(startTime)
    tempArray.push(monday.add(index, 'day').format('MM/DD/YYYY'))
    //tempArray.push((event.target.value[2].slice(0, 2).parseInt() + 8) + ":" + event.target.value[2].slice(2))
    tempArray.push((timeAddMinutes((startTime), (8*60))))
    tempArray.push(event.target.value[1])
    tempArray.push(event.target.value[0])
    tempArray.push('')
    tempArray.push(event.target.value[4])
    tempArray.push('2. Not Shared')

    //check if shift is already taken and remove

    let double = 0
    for (let i = 0; i < teamsCsv.length; i++) {
      if (teamsCsv[i][0] ===  tempArray[0] & teamsCsv[i][3] === tempArray[3]) {
        double = 1
        teamsCsv[i] = tempArray
        break
      }
    }
    if (double === 0) {
      teamsCsv.push(tempArray)
    }

    

    for (let i = 0; i < teamsCsv.length; i++) {
      if (teamsCsv[i][8] ===  'none') {
        teamsCsv.splice(i,1)
      }
    }

    localStorage.setItem('teamsCSV', JSON.stringify(teamsCsv))
    //console.log(JSON.parse(localStorage.getItem('teamsCSV')))




    // humanityCsv#######
    humanityCsv = JSON.parse(localStorage.getItem('humanityCSV'))

    tempArray = [staff[0]]
    tempArray.push(staff[2])
    tempArray.push(event.target.value[5])
    tempArray.push(monday.add(index, 'day').format('MMM DD, YYYY'))
    tempArray.push(monday.add(index, 'day').format('MMM DD, YYYY'))
    // startTime = event.target.value[2].slice(0, 2) + ":" + event.target.value[2].slice(2)

    tempArray.push(getTimeAsNeededForHumanity(event.target.value[2]))

    let endTime = (timeAddMinutes((event.target.value[2].slice(0, 2) + ":" + event.target.value[2].slice(2)), (8*60)))
    // console.log("endTime", endTime)
    tempArray.push(getTimeAsNeededForHumanity(endTime))
    tempArray.push('') // "Paid Breaks","Unpaid Breaks"
    

    if (event.target.value[0] === "Off" | event.target.value[0] === "Sick" | event.target.value[0] === "Leave" | event.target.value[0] === "RDS") {
      tempArray.push("09:00am - 05:00pm")
    }else {
      let breakStart = getTimeAsNeededForHumanity(event.target.value[3])
      let breakEnd = (timeAddMinutes((event.target.value[3].slice(0, 2) + ":" + event.target.value[3].slice(2)), (60)))
      // console.log("breakEnd", breakEnd)
      breakEnd = getTimeAsNeededForHumanity(breakEnd)
      tempArray.push(breakStart + ' - ' + breakEnd)
    }
 
    tempArray.push('')
    tempArray.push('')
    tempArray.push('')
    tempArray.push('')
    tempArray.push('')
    tempArray.push('')

    //console.log("tempArray", tempArray)

    double = 0
    for (let i = 0; i < humanityCsv.length; i++) {
      if (humanityCsv[i][0] ===  tempArray[0] & humanityCsv[i][3] === tempArray[3]) {
        double = 1
        humanityCsv[i] = tempArray
        break
      }
    }
    if (double === 0) {
      humanityCsv.push(tempArray)
    }

    // for (let i = 0; i < humanityCsv.length; i++) {
    //   if (humanityCsv[i][8] ===  'none') {
    //     humanityCsv.splice(i,1)
    //   }
    // }

    localStorage.setItem('humanityCSV', JSON.stringify(humanityCsv))
  }



  return (
    <Box key={"personsday" + dayName + index}
        sx={{ border: 1 }}
    >
      <Box
        sx={{ margin: 1 }}
      >
        {dayName}
      </Box>
      <FormControl sx={{ m: 1, minWidth: 170 }}>
        <InputLabel id="Shift">Shift</InputLabel>
        <Select
          labelId="Shift"
          id="Shift"
          label="Age"
          onChange={setShift}
          defaultValue = ""
        >
          {shifts.map((shiftname, index) => (
            <MenuItem key={shiftname + index + Math.random()*10000} value={shiftname}>
              {shiftname[0] + " " + shiftname[3]} 
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      
    </Box>
  );
}

export default PersonsDay;
