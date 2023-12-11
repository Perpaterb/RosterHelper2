import './App.css';
import React, { useState, useEffect} from 'react';
import Box from '@mui/material/Box';
import PersonsDay from './PersonsDay'
import Grid from '@mui/material/Grid';


function PersonsWeek({index, staff, shifts, monday, group}) {




    // console.log("index", index)    
    // console.log("shiftNames", shiftNames)
    // console.log("shiftStartTimes", shiftStartTimes)
    // console.log("shiftBreakStartTimes", shiftBreakStartTimes)
//   const [dataFromApp, setdataFromApp] = useState(staffnames);

//   useEffect(() => { 
//   },[]);

//   const setShift = () => {
//   }

  let day = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]



  return (
    <Box
        sx={{ 
            border: 1,
            padding: 1,
            margin:1,
            backgroundColor: 'rgba(125,220,255,0.3)',
        }}
    >
        <Box
            key={"personweek" + index}
            sx={{ 
                Width: '80%'
            }}
        >
            <Grid sx={{ flexGrow: 1}} container spacing={2}>
                <Grid item xs={12}>
                    <Grid container justifyContent="center" spacing={0}>
                        <Box
                            sx={{ 
                                margin: 1,
                                width: 220,
                             }}
                        >
                            {staff[index][0]}
                        </Box>
                        {day.map((dayName, i) => (
                            <PersonsDay
                                key={i + staff + Math.random()*10000}
                                index={i}
                                dayName={dayName}
                                shifts={shifts}
                                staff={staff[index]}
                                monday={monday}
                                group={group}
                            />
                        ))}
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    </Box>
  );
}

export default PersonsWeek;
