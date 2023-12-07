import React, {
    useCallback,
    useMemo,
    useRef,
    useState,
    StrictMode,
    useEffect
  } from 'react';
import moment from 'moment';
import dayjs from 'dayjs';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/styles/ag-grid.css';
import { exportMultipleSheetsAsExcel } from 'ag-grid-enterprise';

const delay = ms => new Promise(
  resolve => setTimeout(resolve, ms)
);

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

function TeamsSheetMaker() {
    const shiftsGridRef = useRef();
    const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), []);
    const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), []);
    const [shiftsRowData, setShiftsRowData] = useState([])
    const [staff, setStaff] = useState([])
    const [monday, setMonday] = useState([])
    const [group, setGroup] = useState([])

    useEffect(() => {
      // Perform localStorage action
      setStaff(JSON.parse(localStorage.getItem('staff')))
      setMonday(dayjs(JSON.parse(localStorage.getItem('monday'))))
      setGroup(JSON.parse(localStorage.getItem('group')))
    }, [])   


    // const [shiftsRowData, setRowData] = useState([
    //   {
    //     fullName: 'Andrew Strange',
    //     email: 'andrew.strange@uts.edu.au',
    //     group: '',
    //     startDate: '11/23/2023',
    //     startTime: '08:00',
    //     endDate: '11/23/2023',
    //     endTime: '17:00',
    //     themeColor: '7. Gray',
    //     customLabel: 'customLabel',
    //     unpaidBreak: '',
    //     notes: 'notes',
    //     shared: '2. Not Shared',
    //   },
    // ]);
    const [shiftsColumnDefs, setColumnDefs] = useState([
      { headerName: 'Member', field: 'fullName' },
      { headerName: 'Work Email', field: 'email'},
      { headerName: 'Group', field: 'group'},
      { headerName: 'Shift Start Date', field: 'startDate'},
      { headerName: 'Shift Start Time', field: 'startTime'},
      { headerName: 'Shift End Date', field: 'endDate'},
      { headerName: 'Shift End Time', field: 'endTime'},
      { headerName: 'Theme Color', field: 'themeColor'},
      { headerName: 'Custom Label', field: 'customLabel'},
      { headerName: 'Unpaid Break (minutes)', field: 'unpaidBreak'},
      { headerName: 'Notes', field: 'notes'},
      { headerName: 'Shared', field: 'shared'}
    ]);
    
    const updateData = async event => {

      const daysInWeek = ["Monday", "Tusday", "Wednessday", "Thurday", "Friday", "Saturday", "Sunday"]
      let teamsData = []
  
      for (let st = 0; st < staff.length; st++) {
        for (let i = 0; i < 7; i++) {
          let check = localStorage.getItem(monday.add(i, 'day').format('DD-MM-YYYY') + daysInWeek[i] + staff[st])
          if(check != null){
            teamsData.push({date: monday.add(i, 'day').format('MM/DD/YYYY'), dayName: daysInWeek[i], staffName: staff[st], shiftData: JSON.parse(check).value})
          }
        }
      }

      //console.log("group", group)

      let tempData = []
      for (let i = 0; i < teamsData.length; i++) {
        if(teamsData[i].shiftData[0] != 'none'){
        tempData.push({
          fullName: teamsData[i].staffName[0],
          email: teamsData[i].staffName[1],
          group: group,
          startDate: teamsData[i].date,
          startTime: teamsData[i].shiftData[2].slice(0, 2) + ":" + teamsData[i].shiftData[2].slice(2),
          endDate: teamsData[i].date,
          endTime: timeAddMinutes((teamsData[i].shiftData[2].slice(0, 2) + ":" + teamsData[i].shiftData[2].slice(2)), (8*60)),
          themeColor: teamsData[i].shiftData[1],
          customLabel: teamsData[i].shiftData[0],
          unpaidBreak: '',
          notes: teamsData[i].shiftData[4],
          shared: '2. Not Shared',
        })}
      }
        setShiftsRowData(tempData)
        await delay(1000);
        exportFile()
      }

      const exportFile = useCallback(() => {
        //console.log("shiftsRowData", shiftsRowData)
          let spreadsheets = [];
          spreadsheets.push(
            shiftsGridRef.current.api.getSheetDataForExcel({ sheetName: 'Shifts' }),
          );
          //console.log("spreadsheets". spreadsheets)
          exportMultipleSheetsAsExcel({
              data: spreadsheets,
              fileName: "MS Teams Shifts Export " + moment().format('MMMM Do YYYY, h:mm:ss a') + ".xlsx",
          });
      })

    return (
      <div style={containerStyle}>
        <div className="example-wrapper">
          <div className="example-header">
            <button onClick={updateData} style={{ fontWeight: 'bold', fontSize: 16 }}>
              Export MS Teams Excel
            </button>
          </div>

          <div style={{padding: 40}}>

          </div>
  
          <div style={gridStyle} className="ag-theme-alpine">
            <AgGridReact
              ref={shiftsGridRef}
              rowData={shiftsRowData}
              columnDefs={shiftsColumnDefs}
            />
          </div>
        </div>
      </div>
    );
}


export default TeamsSheetMaker;