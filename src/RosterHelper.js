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

function RosterHelper() {
  let teamsCSV = [
    ["Member","Work Email","Group","Shift Start Date","Shift Start Time","Shift End Date","Shift End Time","Theme Color","Custom Label","Unpaid Break (minutes)","Notes","Shared"]
  ]

  // let humanityCSV = [
  //   ["Employee Names","Position","Location","Start Date","End Date","Start Time","End Time","Paid Breaks","Unpaid Breaks","Open Slots","Remote Location","Required Skills","Tags","Title","Note"]
  // ]

  let humanityCSV = [
    ["Names","Location","Position","Start Date","End Date","Start Time","End Time","Notes","Title","Open","Remote sites","Unpaid Breaks"]
  ]

  let defaultFeed = "{Staff}\n{Group name in teams}\n{Shifts}"
  const [feedData, setFeedData] = useState('');
  const [staff, setStaff] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [group, setGroup] = useState([]);
  const [monday, setMonday] = useState(dayjs());
  const [teamsData, setTeamsData] = useState(teamsCSV);
  

  const [humanityData, setHumanityData] = useState(teamsCSV);
  

  const [errorInFeed, setErroInFeed] = useState(false);

  try {
    localStorage.setItem('humanityCSV', JSON.stringify(humanityCSV))
  } catch (error) {
    console.error(error.message); //raises the error
  }
  try {
    localStorage.setItem('teamsCSV', JSON.stringify(teamsCSV))
  } catch (error) {
    console.error(error.message); //raises the error
  }

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
      //console.log("Staff", tempArray)
    
      tempArray = []
      for (let i = 1; i < feedtemp.split("}")[2].split("{")[0].split("[").length; i++) {
        tempArray[i] = feedtemp.split("}")[2].split("{")[0].split("[")[i].split("]")[0]
      }
      tempArray.splice(0,1)
      // console.log("Group", tempArray)
      setGroup(tempArray)
      
    
      tempArray = []
      for (let i = 1; i < feedtemp.split("}")[3].split("{")[0].split("[").length; i++) {
        
        
        tempArray[i] = feedtemp.split("}")[3].split("{")[0].split("[")[i].split("]")[0].split("|").reduce((acc, i) => i ? [...acc, i] : acc, [])
        tempArray[i][4] = tempArray[i][4].slice(0, -1)
        
      }
      tempArray.splice(0,1,['none','', '', '', '', ''])

      // console.log("Shifts",tempArray)
      setShifts(tempArray)
    }



  }
  


  // useEffect(() => { 
  //   staffnames = feedData.split(",")[0]
  // },[feedData]);

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
                  <DemoContainer
                    components={[
                      'DatePicker',
                    ]}
                  >
                    <p>Monday of the roster week :</p>
                    <DemoItem>
                      <DatePicker defaultValue={dayjs()} format="DD-MM-YYYY" onChange={(newValue) => setMonday(newValue)}/>
                    </DemoItem>
                  </DemoContainer>
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
        
                {/* <CSVLink data={getTeamsCSVFile()} filename={downloadName}> Export Teams Roster </CSVLink> */}
                <CSVLink data={teamsData} asyncOnClick={true} filename={teamsDownloadName}
                  onClick={(event, done) => {setTeamsData(JSON.parse(localStorage.getItem('teamsCSV'))); done(); }}  
                > Export Teams Roster </CSVLink>
                <Box
                    sx={{
                      height: 30,
                    }}
                  ></Box>
                
                <CSVLink data={humanityData} asyncOnClick={true} filename={humanityDownloadName}
                  onClick={(event, done) => {setHumanityData(JSON.parse(localStorage.getItem('humanityCSV'))); done(); }}  
                > Export Humanity Roster </CSVLink>
                <Box
                    sx={{
                      height: 30,
                    }}
                  ></Box>
              </Box>
            )
          }
        })()}


        <TeamsSheetMaker></TeamsSheetMaker>
      </header>
    </div>
  );
}

export default RosterHelper;
