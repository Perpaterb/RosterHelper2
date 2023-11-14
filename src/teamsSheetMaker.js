import React, {
    useCallback,
    useMemo,
    useRef,
    useState,
    StrictMode,
  } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/styles/ag-grid.css';
import { exportMultipleSheetsAsExcel } from 'ag-grid-enterprise';

function TeamsSheetMaker() {
    const shiftsGridRef = useRef();
    const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), []);
    const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), []);
    const [shiftsRowData, setRowData] = useState([
      {
        fullName: 'Andrew Strange',
        email: 'andrew.strange@uts.edu.au',
        group: '',
        startDate: '11/23/2023',
        startTime: '08:00',
        endDate: '11/23/2023',
        endTime: '17:00',
        themeColor: '7. Gray',
        customLabel: 'customLabel',
        unpaidBreak: '',
        notes: 'notes',
        shared: '2. Not Shared',
      },
    ]);
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
    
    const onBtExport = useCallback(() => {
        let spreadsheets = [];
        spreadsheets.push(
            shiftsGridRef.current.api.getSheetDataForExcel({ sheetName: 'Shifts' }),
        );
        console.log("spreadsheets". spreadsheets)
        exportMultipleSheetsAsExcel({
            data: spreadsheets,
            fileName: 'tables.xlsx',
        });
    })

    return (
        <div style={containerStyle}>
        <div className="example-wrapper">
          <div className="example-header">
            <button onClick={onBtExport} style={{ fontWeight: 'bold' }}>
              Export to Excel
            </button>
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