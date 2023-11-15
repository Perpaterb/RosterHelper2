import React, {
    useCallback,
    useMemo,
    useRef,
    useState,
    StrictMode,
  } from 'react';
import moment from 'moment'
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/styles/ag-grid.css';
import { exportMultipleSheetsAsExcel } from 'ag-grid-enterprise';

const delay = ms => new Promise(
  resolve => setTimeout(resolve, ms)
);

function TeamsSheetMaker() {
    const shiftsGridRef = useRef();
    const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), []);
    const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), []);
    const [shiftsRowData, setShiftsRowData] = useState([])

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

      const teamsData = JSON.parse(localStorage.getItem('teamsCSV'))
        let tempData = []
        for (let i = 1; i < teamsData.length; i++) {
          tempData.push({
            fullName: teamsData[i][0],
            email: teamsData[i][1],
            group: teamsData[i][2],
            startDate: teamsData[i][3],
            startTime: teamsData[i][4],
            endDate: teamsData[i][5],
            endTime: teamsData[i][6],
            themeColor: teamsData[i][7],
            customLabel: teamsData[i][8],
            unpaidBreak: teamsData[i][9],
            notes: teamsData[i][10],
            shared: teamsData[i][11],
          })
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
          console.log("spreadsheets". spreadsheets)
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