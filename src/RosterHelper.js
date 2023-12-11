import './App.css';
import React, { useState, useEffect} from 'react';
import { CSVLink } from "react-csv";
import moment from 'moment'
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import PersonsWeek from './PersonsWeek'
import templateFeedData from './templateFeedData.csv';
import feeddataITSCExample from './feeddataITSCExample.csv';
import getMultipleSheetsAsExcel from 'ag-grid-react';
import TeamsSheetMaker from './teamsSheetMaker'


function createShiftInHumanity(date,staff,shiftData,shiftStartTime,shiftEndTime) {

  let tempArray = []

  tempArray = [staff[0]]
  tempArray.push(shiftData[5])
  tempArray.push(staff[2])
  tempArray.push(date)
  tempArray.push(date)
  tempArray.push(shiftStartTime)
  tempArray.push(shiftEndTime)
  tempArray.push(shiftData[0] + " Lunch from " + getTimeAsNeededForHumanity(shiftData[3]))
  tempArray.push('')
  tempArray.push('')
  tempArray.push('')
  return (tempArray)
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



function RosterHelper() {
  const teamsCSV = [["Member","Work Email","Group","Shift Start Date","Shift Start Time","Shift End Date","Shift End Time","Theme Color","Custom Label","Unpaid Break (minutes)","Notes","Shared"]]
  const humanityCSV = [["Names","Location","Position","Start Date","End Date","Start Time","End Time","Notes","Title","Open","Remote sites"]]
  let defaultFeed = "{Staff}\n{Group name in teams}\n{Shifts}"
  const [feedData, setFeedData] = useState('');
  const [staff, setStaff] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [group, setGroup] = useState([]);
  const [monday, setMonday] = useState(dayjs().day(1));
  const [humanityData, setHumanityData] = useState(humanityCSV);
  const [errorInFeed, setErroInFeed] = useState(false);

  useEffect(() => { 
    if (localStorage.getItem('FeedData') === undefined || localStorage.getItem('FeedData') === null || localStorage.getItem('FeedData') === 'undefined') {
      localStorage.setItem('FeedData', JSON.stringify(defaultFeed))
      setFeedData(defaultFeed)
      updateTable()
    } else {
      setFeedData(localStorage.getItem('FeedData'))
      updateTable()
    } 
  },[]);

  function updateMonady(data) {
  setMonday(data)
  localStorage.setItem('monday', JSON.stringify(data))
  }

  function updateHumanityDataForExport(humanityCSV) {

    const daysInWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    let humExport = humanityCSV
    let dataFromStorage = []

    for (let st = 0; st < staff.length; st++) {
      for (let i = 0; i < 7; i++) {
        let check = localStorage.getItem(monday.add(i, 'day').format('DD-MM-YYYY') + daysInWeek[i] + staff[st])
        if(check != null){
          dataFromStorage.push({date: monday.add(i, 'day').format('MM/DD/YYYY'), dayName: daysInWeek[i], staffName: staff[st], shiftData: JSON.parse(check).value})
        }
      }
    }
    
   
    // humanityCsv#######
    let humenityArray =[]
    for(let i = 0; i < dataFromStorage.length; i++) {

      // console.log("dataFromStorage[i].shiftData[0]", dataFromStorage[i].shiftData[0])
      if (dataFromStorage[i].shiftData[0] != 'none'){        
        if (dataFromStorage[i].shiftData[3] === '0000'){ //creating one shif
          humenityArray = createShiftInHumanity(
            dataFromStorage[i].date,
            dataFromStorage[i].staffName,
            dataFromStorage[i].shiftData,
            getTimeAsNeededForHumanity(dataFromStorage[i].shiftData[2].slice(0, 2) + ":" + dataFromStorage[i].shiftData[2].slice(2)),
            getTimeAsNeededForHumanity(timeAddMinutes((dataFromStorage[i].shiftData[2].slice(0, 2) + ":" + dataFromStorage[i].shiftData[2].slice(2)), (8*60)))
          ) // (monday,staff,Shift.value,index,startTime(0000), endTime(0000))
          

          humExport.push(humenityArray) // add to overall array

        } else {  // creating 2 shifts 

          humenityArray = createShiftInHumanity(
            dataFromStorage[i].date,
            dataFromStorage[i].staffName,
            dataFromStorage[i].shiftData,
            getTimeAsNeededForHumanity(dataFromStorage[i].shiftData[2].slice(0, 2) + ":" + dataFromStorage[i].shiftData[2].slice(2)),
            getTimeAsNeededForHumanity(dataFromStorage[i].shiftData[3].slice(0, 2) + ":" + dataFromStorage[i].shiftData[3].slice(2))
          )

          humExport.push(humenityArray) // add to overall array

          humenityArray = createShiftInHumanity(
            dataFromStorage[i].date,
            dataFromStorage[i].staffName,
            dataFromStorage[i].shiftData,
            getTimeAsNeededForHumanity(timeAddMinutes((dataFromStorage[i].shiftData[3].slice(0, 2) + ":" + dataFromStorage[i].shiftData[3].slice(2)), (60))),
            getTimeAsNeededForHumanity(timeAddMinutes((dataFromStorage[i].shiftData[2].slice(0, 2) + ":" + dataFromStorage[i].shiftData[2].slice(2)), (8*60)))
          )
          humExport.push(humenityArray) // add to overall array
        }
      }
    }
    setHumanityData(humExport)
  }

  function updateTable() {
    let errorcheck = false

    if (localStorage.getItem('FeedData').split("}").length !== 4) {
      setErroInFeed(true)
      errorcheck = true
    }
    if (localStorage.getItem('FeedData').split("{").length !== 4) {
      setErroInFeed(true)
      errorcheck = true
    }
    if (errorcheck === false) {
      setErroInFeed(false)

      let tempArray = []
      let feedtemp = localStorage.getItem('FeedData')
      for (let i = 1; i < feedtemp.split("}")[1].split("{")[0].split("[").length; i++) {
        tempArray[i] = feedtemp.split("}")[1].split("{")[0].split("[")[i].split("]")[0].split("|")
      }
      tempArray.splice(0,1)
      setStaff(tempArray)
      localStorage.setItem('staff', JSON.stringify(tempArray))
      //console.log("Staff", tempArray)
    
      tempArray = []
      for (let i = 1; i < feedtemp.split("}")[2].split("{")[0].split("[").length; i++) {
        tempArray[i] = feedtemp.split("}")[2].split("{")[0].split("[")[i].split("]")[0]
      }
      tempArray.splice(0,1)
      // console.log("Group", tempArray)
      setGroup(tempArray)
      localStorage.setItem('group', JSON.stringify(tempArray))
      
    
      tempArray = []
      for (let i = 1; i < feedtemp.split("}")[3].split("{")[0].split("[").length; i++) {
        
        
        tempArray[i] = feedtemp.split("}")[3].split("{")[0].split("[")[i].split("]")[0].split("|").reduce((acc, i) => i ? [...acc, i] : acc, [])
        tempArray[i][4] = tempArray[i][4]
        
      }
      tempArray.splice(0,1,['none','', '', '', '', ''])

      //console.log("Shifts",tempArray)
      setShifts(tempArray)
    }

  }


  let teamsDownloadName = "MS teams Roster export " + moment().format('MMMM Do YYYY, h:mm:ss a') + ".csv" ;
  let humanityDownloadName = "Humanity Roster export " + moment().format('MMMM Do YYYY, h:mm:ss a') + ".csv" ;

  const onChangeFeedData = (event) => {
    localStorage.setItem('FeedData', event.target.value)
  }

  const updateFeedData = (event) => {
    updateTable()
  }

  const resetFeedData = () => {
    setFeedData(defaultFeed)
    localStorage.setItem('FeedData', defaultFeed)
    updateTable()
  }

  let helpNote = 'Feed Data: {Staff}\n{Group name in teams}\n{Shifts} CSV format in excel copy from a notepad to this page'

  const isNotMonday = (date) => {
    const day = date.day();
      return day === 0 || day === 2 || day === 3 || day === 4 || day === 5 || day === 6;
  };

  return (
    <div className="App">
      <header className="App-header">
        <Box
          sx={{
            width: 1400,
            maxWidth: '90%',
            height: 550,
          }}
        >
          <p>{helpNote}</p>
          <TextField fullWidth multiline rows={15}
            defaultValue={feedData}
            onChange={onChangeFeedData}
          />
          <Button><a href={templateFeedData} download="templateFeedData.csv">download feed data template</a></Button>
          <Button><a href={feeddataITSCExample} download="feeddataITSCExample.csv">download feed data ITSC Example</a></Button>
          <Button variant="contained" href="#contained-buttons" onClick={resetFeedData}
            sx={{
              width: 130,
              maxWidth: '90%',
              height: 30,
            }}
          >
            Reset Feed 
          </Button>
          <Button variant="contained" href="#contained-buttons" onClick={updateFeedData}
            sx={{
              width: 200,
              maxWidth: '90%',
              height: 30,
              marginLeft: 1,
            }}
          >
            Update From Feed
          </Button>
        </Box>
        {(() => {
          if(errorInFeed){
            return (<p>Error in feed</p>)
          } else{
            return (
              <Box>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <p>Monday of the roster week :</p>
                          <DatePicker defaultValue={dayjs().day(1)} format="DD-MM-YYYY" onChange={(newValue) => updateMonady(newValue)} shouldDisableDate={isNotMonday}
                            sx={{
                              width: 400,
                            }}
                          />  
                </LocalizationProvider>
                
                {staff.map((name, i) => (
                  <PersonsWeek 
                    key={i + staff + Math.random()*10000}
                    index={i}
                    staff={staff}
                    shifts={shifts}
                    monday={monday}
                    group={group}
                    />
                ))}
                      
                <CSVLink data={humanityData} asyncOnClick={true} filename={humanityDownloadName}
                  onClick={(event, done) => {updateHumanityDataForExport(humanityCSV); done(); }}  
                > Export Humanity Roster </CSVLink>
                <Box
                    sx={{
                      height: 30,
                    }}
                  ></Box>
                  <TeamsSheetMaker 
                    group={group}
                    staff={staff}
                    monday={monday}
                  ></TeamsSheetMaker>
              </Box>
            )
          }
        })()}
      </header>
    </div>
  );
}

export default RosterHelper;
