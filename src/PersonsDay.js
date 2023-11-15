import './App.css';
import React, { useState, useEffect} from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
//import Select, { SelectChangeEvent } from '@mui/material/Select';
import Select from "react-select";
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';

// ["Member","Work Email","Group","Shift Start Date","Shift Start Time","Shift End Date","Shift End Time","Theme Color","Custom Label","Unpaid Break (minutes)","Notes","Shared"],

// ["Names","Location","Position","Start Date","End Date","Start Time","End Time","Notes","Title","Open","Remote sites"]
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

function createShiftInHumanity(monday,staff,event,index,shiftStartTime,shiftEndTime) {

  let tempArray = []

  tempArray = [staff[0]]
  tempArray.push(event.value[5])
  tempArray.push(staff[2])
  tempArray.push(monday.add(index, 'day').format('DD-MM-YYYY'))
  tempArray.push(monday.add(index, 'day').format('DD-MM-YYYY'))
  tempArray.push(shiftStartTime)
  tempArray.push(shiftEndTime)
  tempArray.push(event.value[0] + " Lunch from " + getTimeAsNeededForHumanity(event.value[3]))
  tempArray.push('')
  tempArray.push('')
  tempArray.push('')
  return (tempArray)
}



function PersonsDay({index, dayName, shifts, staff, monday, group}) {


  const shiftsOptions = [{value: ['none','', '', '', '', ''], label: "none"}]
  for (let i = 1; i < shifts.length; i++) {
    shiftsOptions.push({ value: shifts[i], label: shifts[i][0] + " L:" + shifts[i][3]})
  }

  const [selected, setSelected] = useState([]);

  useEffect(() => { 
    const lastSelected = JSON.parse(
      localStorage.getItem(monday.add(index, 'day').format('MM/DD/YYYY') + dayName + staff) ?? "[]"
    );
    setSelected(lastSelected);
  },[]);



  const [shift, setshift] = useState('');
  let teamsCsv = []
  let humanityCsv = []

  useEffect(() => { 

    
  },[]);

  const setShift = (event) => {  //event.value

    //console.log("event.value",event.value)
    localStorage.setItem(monday.add(index, 'day').format('MM/DD/YYYY') + dayName + staff, JSON.stringify(event))
    setSelected(event)

    teamsCsv = JSON.parse(localStorage.getItem('teamsCSV'))

    //make new shift 

    let tempArray = [staff[0]]
    tempArray.push(staff[1])
    tempArray.push(group[0])
    tempArray.push(monday.add(index, 'day').format('MM/DD/YYYY'))
    let startTime = event.value[2].slice(0, 2) + ":" + event.value[2].slice(2)
    tempArray.push(startTime)
    tempArray.push(monday.add(index, 'day').format('MM/DD/YYYY'))
    //tempArray.push((event.value[2].slice(0, 2).parseInt() + 8) + ":" + event.value[2].slice(2))
    tempArray.push((timeAddMinutes((startTime), (8*60))))
    tempArray.push(event.value[1])
    tempArray.push(event.value[0])
    tempArray.push('')
    tempArray.push(event.value[4])
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


    // dont add manager shifts to teams
    for (let i = 0; i < teamsCsv.length; i++) {
      if (teamsCsv[i][8].startsWith("Manager")) {
        teamsCsv.splice(i,1)
      }
    }

    localStorage.setItem('teamsCSV', JSON.stringify(teamsCsv))
    //console.log(JSON.parse(localStorage.getItem('teamsCSV')))




    // humanityCsv#######
    humanityCsv = JSON.parse(localStorage.getItem('humanityCSV'))
    //humanityCsv = []
    let humenityArray =[]
    let toBeRemoved = []
    if (event.value[3] === '0000'){ //creating one shif
      humenityArray = createShiftInHumanity(
        monday,
        staff,
        event,
        index,
        getTimeAsNeededForHumanity(event.value[2].slice(0, 2) + ":" + event.value[2].slice(2)),
        getTimeAsNeededForHumanity(timeAddMinutes((event.value[2].slice(0, 2) + ":" + event.value[2].slice(2)), (8*60)))
      ) // (monday,staff,Shift.value,index,startTime(0000), endTime(0000))
      
      for (let i = 0; i < humanityCsv.length; i++) { // remove all others on the same data
        if (humanityCsv[i][0] ===  humenityArray[0] && humanityCsv[i][3] === humenityArray[3]) {
          toBeRemoved.push(i)
        }
      }

      humanityCsv.push(humenityArray) // add to overall array

    } else {  // creating 2 shifts 

      for (let i = 0; i < humanityCsv.length; i++) { // remove all others on the same data
        if (humanityCsv[i][0] ===  staff[0] && humanityCsv[i][3] === (monday.add(index, 'day').format('DD-MM-YYYY'))) {
          toBeRemoved.push(i)
        }
      }
      
      humenityArray = createShiftInHumanity(
        monday,
        staff,
        event,
        index,
        getTimeAsNeededForHumanity(event.value[2].slice(0, 2) + ":" + event.value[2].slice(2)),
        getTimeAsNeededForHumanity(event.value[3].slice(0, 2) + ":" + event.value[3].slice(2))
      )

      humanityCsv.push(humenityArray) // add to overall array

      humenityArray = createShiftInHumanity(
        monday,
        staff,
        event,
        index,
        getTimeAsNeededForHumanity(timeAddMinutes((event.value[3].slice(0, 2) + ":" + event.value[3].slice(2)), (60))),
        getTimeAsNeededForHumanity(timeAddMinutes((event.value[2].slice(0, 2) + ":" + event.value[2].slice(2)), (8*60)))
      )
      humanityCsv.push(humenityArray) // add to overall array
    }
    let humanityCsv2 = JSON.parse(JSON.stringify(humanityCsv))
    for (let i = toBeRemoved.length-1; i >=0; i--) {
      humanityCsv2.splice(toBeRemoved[i],1)
    }
    localStorage.setItem('humanityCSV', JSON.stringify(humanityCsv2))
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
        <InputLabel id="Shift"></InputLabel>
        <Select 
          size="6"
          value={selected}
          labelId="Shift"
          id="Shift"
          label="Age"
          onChange={setShift}
          defaultValue = ""
          options={shiftsOptions}
          styles={{
            control: (baseStyles, state) => ({
                ...baseStyles,
                minHeight: '25px',
                fontSize: '13px',
            }),
            dropdownIndicator: (base) => ({
                ...base,
                paddingTop: 0,
                paddingBottom: 0,
            }),
            menuList: (base) => ({
                ...base,
                fontSize: '12px',
            }),
        }}
        >
          {/* {shifts.map((shiftname, index) => (
            <MenuItem key={shiftname + index + Math.random()*10000} value={shiftname}>
              {shiftname[0] + " " + shiftname[3]} 
            </MenuItem>
          ))} */}
        </Select>
      </FormControl>
      
    </Box>
  );
}

export default PersonsDay;
