import React, { useState, useEffect } from 'react';
import DatasGridNav from './DatasGridNav';
import DatasGridPagination from './DatasGridPagination';
import DataGrid, { Column, Paging, Editing } from 'devextreme-react/data-grid';

/**
 * DatasGrid component.
 *
 * @param {Array} datas - The data array to display in the data grid.
 * @param {function} setDatas - The function to update the data array.
 * @returns {JSX.Element} The DatasGrid component.
 */
const DatasGrid = ({ datas, setDatas }) => {
    const [filteredData, setFilteredData] = useState([]); // State for filtered data
    const [currentPage, setCurrentPage] = useState(0); // State for current page
    const pageSize = 9; // Number of items to display per page
    const [filteredRowCount, setFilteredRowCount] = useState(pageSize); // State for the number of filtered rows to display

    useEffect(() => {
        // Update filtered data and current page when datas prop changes
        if (datas && datas.length > 0 && datas[0].values) {
            setFilteredData(datas[0].values); //Set Filtered Data to fetched datas in App.js. 
            setCurrentPage(0); // whenever the datas prop changes, the current page will be reset to the first page
        }
    }, [datas]); //call this depend datas.

    useEffect(() => {
        // Update filtered row count based on filtered data and current page
        if (filteredData && filteredData.length) {
            const remainingRows = filteredData.length - currentPage * pageSize; //Assume that filtered datas length is 25, current page is 2, and page Size is 10, 25-20 = 5 Rows will display
            const rowCount = Math.min(remainingRows, pageSize); // remaining rows are 5, and Page size is 10,since 5 is smaller than 10, 5 rows will display.
            setFilteredRowCount(rowCount); //filtered row count was 9 initial, so its 5 now
        }
    }, [filteredData, currentPage]);

    /**
     * Handles the page change event.
     *
     * @param {number} newPageIndex - The new page index.
     */
    const onPageChange = (newPageIndex) => {
        setCurrentPage(newPageIndex);
    };

    /**
     * Adds new data row to the existing values array.
     *
     * @param {object} newRow - The new row data to be added.
     */
    const addData = (newRow) => {
        // Fetch the existing data
        fetch('https://6488afd40e2469c038fe3acd.mockapi.io/users/1', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then((response) => response.json())
            .then((data) => {
                data.values.push(newRow); // Add the new row to the existing values array

                // Update the data on the server
                fetch('https://6488afd40e2469c038fe3acd.mockapi.io/users/1', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                })
                    .then((response) => response.json())
                    .then((result) => {
                        console.log('Data added successfully:', result);

                        // Update the state with the new data
                        setDatas([data]);
                        setFilteredData(data.values);
                    })
                    .catch((error) => {
                        console.error('Error:', error);
                    });
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };


    /* For Delete Functionality.

    const deleteData = (rowData) => {
        const rowId = rowData.Id;

        fetch('https://6488afd40e2469c038fe3acd.mockapi.io/users/1', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then((data) => {
                data.values = data.values.filter((row) => row.Id !== rowId);

                fetch('https://6488afd40e2469c038fe3acd.mockapi.io/users/1', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                })
                    .then((response) => response.json())
                    .then((result) => {
                        console.log('Data deleted successfully:', result);

                        setDatas([data]);
                        setFilteredData([...data.values]); 
                    })
                    .catch((error) => {
                        console.error('Error:', error);
                    });
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };


    */



    /**
     * Handles the search event and filters the data based on the query.
     *
     * @param {string} query - The search query, filter the elements.
     */
    const handleSearch = (query) => {
        if (datas && datas.length > 0 && datas[0].values) {
            const filtered = datas[0].values.filter((row) => {
                const values = Object.values(row);
                for (const value of values) {
                    if (
                        value &&
                        value.toString().toLowerCase().includes(query.toLowerCase())
                    ) {
                        return true;
                    }
                }
                return false;
            });
            setFilteredData(filtered);
            setCurrentPage(0);
        }
    };

    /**
     * Retrieves the visible data based on the current page and filtered row count.
     *
     * @returns {Array} The visible data.
     */
    const getVisibleData = () => {
        const startIndex = currentPage * pageSize; // Start Index
        const endIndex = startIndex + filteredRowCount; // End Index
        return filteredData.slice(startIndex, endIndex);
    };

    const totalPages = Math.ceil(filteredData.length / pageSize); // Calculate total number of pages

    /**
     * Goes to the previous page.
     */
    const goToPreviousPage = () => {
        setCurrentPage((prevPage) => prevPage - 1);
    };

    /**
     * Goes to the next page.
     */
    const goToNextPage = () => {
        setCurrentPage((prevPage) => prevPage + 1);
    };

    /**
     * Increases the number of filtered rows to display.
     */
    const increaseRowCount = () => {
        const remainingRows = filteredData.length - currentPage * pageSize; //Assume that filtered datas length is 25, current page is 2, and page Size is 10, 25-20 = 5 Rows will display
        const maxRowCount = Math.min(pageSize, remainingRows); // According to given example ; 5

        if (filteredRowCount < maxRowCount) { //Filtered Data 9, 5 but assume 4<5
            setFilteredRowCount((prevRowCount) => {
                const updatedRowCount = Math.min(prevRowCount + 1, maxRowCount); // 5 
                return updatedRowCount;
            });
        }
    };

    /**
     * Decreases the number of filtered rows to display.
     */
    const decreaseRowCount = () => {
        if (filteredRowCount > 1) {
            setFilteredRowCount((prevRowCount) => {
                const updatedRowCount = Math.max(prevRowCount - 1, 1);
                setCurrentPage((prevPage) => {
                    if (prevRowCount === 1) {
                        return prevPage + 1;
                    }
                    return prevPage;
                });
                return updatedRowCount;
            });
        }
    };
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        window.addEventListener('resize', handleResize);
        // Clean up the event listener
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);


    return (
        <section className="datagrid">
            <DatasGridNav addData={addData} onSearch={handleSearch} />


            {isMobile ? (
                <>
                    {datas && datas.length > 0 && datas[0].columns && (
                        <DataGrid
                            dataSource={getVisibleData()}
                            showBorders={false}
                            rowAlternationEnabled={true}
                            widthByColumnContent={true}
                            showColumnLines={true}
                            height="510px"
                        >

                            {/* <Column
                            caption="Actions"
                            cellRender={(cellData) => (
                                <button onClick={() => deleteData(cellData.data)}>Delete</button>
                            )}
                        /> */}


                            {Object.keys(datas[0].columns).map((column) => (
                                <Column
                                    className="datagrid__column"
                                    key={column}
                                    dataField={column}
                                    caption={datas[0].columns[column]}
                                    showBorders={true}
                                />
                            ))}
                            <Paging
                                defaultPageSize={pageSize}
                                defaultPageIndex={0}
                                pageSize={filteredRowCount}
                                onPageChange={onPageChange}
                                totalCount={filteredData.length}
                            />
                        </DataGrid>
                    )}
                </>

            ) : (
                <div className="datagrid__grid">
                    {datas && datas.length > 0 && datas[0].columns && (
                        <DataGrid
                            dataSource={getVisibleData()}
                            showBorders={false}
                            rowAlternationEnabled={true}
                            widthByColumnContent={true}
                            showColumnLines={true}
                            height="510px"
                        >

                            {/* <Column
                            caption="Actions"
                            cellRender={(cellData) => (
                                <button onClick={() => deleteData(cellData.data)}>Delete</button>
                            )}
                        /> */}


                            {Object.keys(datas[0].columns).map((column) => (
                                <Column
                                    className="datagrid__column"
                                    key={column}
                                    dataField={column}
                                    caption={datas[0].columns[column]}
                                    showBorders={true}
                                />
                            ))}
                            <Paging
                                defaultPageSize={pageSize}
                                defaultPageIndex={0}
                                pageSize={filteredRowCount}
                                onPageChange={onPageChange}
                                totalCount={filteredData.length}
                            />
                        </DataGrid>
                    )}
                </div>
            )
            }



            <DatasGridPagination
                currentPage={currentPage}
                pageSize={pageSize}
                goToPreviousPage={goToPreviousPage}
                goToNextPage={goToNextPage}
                filteredData={filteredData}
                filteredRowCount={filteredRowCount}
                setFilteredRowCount={setFilteredRowCount}
                setCurrentPage={setCurrentPage}
                increaseRowCount={increaseRowCount}
                decreaseRowCount={decreaseRowCount}
                totalPages={totalPages}
            />

        </section>
    );
};

export default DatasGrid;


/*
import React, { useState, useEffect } from 'react';
import DataGridNav from './DataGridNav';
import DataGrid, { Column, Paging } from 'devextreme-react/data-grid';
import { IncreaseIcon, DecreaseIcon } from '../svgs/SvgIcons';

const DatasGrid = ({ datas, setDatas }) => {

    const [filteredData, setFilteredData] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const pageSize = 9;
    const [filteredRowCount, setFilteredRowCount] = useState(pageSize);

    useEffect(() => {
        if (datas && datas.length > 0 && datas[0].values) {
            setFilteredData(datas[0].values);
            setCurrentPage(0);
        }
    }, [datas]);

    useEffect(() => {
        if (filteredData && filteredData.length) {
            const remainingRows = filteredData.length - currentPage * pageSize;
            const rowCount = Math.min(remainingRows, pageSize);
            setFilteredRowCount(rowCount);
        }
    }, [filteredData, currentPage]);

    const onPageChange = (newPageIndex) => {
        setCurrentPage(newPageIndex);
    };

    const addData = (newRow) => {
        fetch('https://6488afd40e2469c038fe3acd.mockapi.io/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newRow),
        })
            .then((response) => response.json())
            .then((data) => {
                setDatas((prevState) => {
                    const newValues = [...prevState[0].values, data];
                    const newData = [
                        {
                            ...prevState[0],
                            values: newValues,
                        },
                    ];
                    localStorage.setItem('datas', JSON.stringify(newData));
                    return newData;
                });
                setFilteredData((prevFilteredData) => [...prevFilteredData, data]);
            })
            .catch((error) => {
                console.error('Error adding data:', error);
            });
    };



 const handleSearch = (query) => {
  if (datas && datas.length > 0 && datas[0].values) {
    const filtered = datas[0].values.filter((row) => {
      const values = Object.values(row);
      for (const value of values) {
        if (
          value &&
          value.toString().toLowerCase().includes(query.toLowerCase())
        ) {
          return true;
        }
      }
      return false;
    });
    setFilteredData(filtered);
    setCurrentPage(0);
  }
};


    const getVisibleData = () => {
        const startIndex = currentPage * pageSize; // Start Index = 9
        const endIndex = startIndex + filteredRowCount; // End Index = 9 + 2 = 11
        return filteredData.slice(startIndex, endIndex); // 9 -  11 = 9 and 10th data
    };

    const totalPages = Math.ceil(filteredData.length / pageSize);

    const goToPreviousPage = () => {
        setCurrentPage((prevPage) => prevPage - 1);
    };

    const goToNextPage = () => {
        setCurrentPage((prevPage) => prevPage + 1);
    };

    const increaseRowCount = () => {
        const remainingRows = filteredData.length - currentPage * pageSize;
        const maxRowCount = Math.min(pageSize, remainingRows);

        if (filteredRowCount < maxRowCount) {
            setFilteredRowCount((prevRowCount) => {
                const updatedRowCount = Math.min(prevRowCount + 1, maxRowCount);
                return updatedRowCount;
            });
        }
    };
    const decreaseRowCount = () => {
        if (filteredRowCount > 1) {
            setFilteredRowCount((prevRowCount) => {
                const updatedRowCount = Math.max(prevRowCount - 1, 1);
                setCurrentPage((prevPage) => {
                    if (prevRowCount === 1) {
                        return prevPage + 1;
                    }
                    return prevPage;
                });
                return updatedRowCount;
            });
        }
    };

    return (
        <section className="datagrid">
            <DataGridNav addData={addData} onSearch={handleSearch} />
            <div className="datagrid__grid">

                {datas && datas.length > 0 && datas[0].columns && (
                    <DataGrid
                        dataSource={getVisibleData()}
                        showBorders={false}
                        rowAlternationEnabled={true}
                        widthByColumnContent={true}
                        showColumnLines={true}
                        height="500px"
                    >
                        {Object.keys(datas[0].columns).map((column) => (
                            <Column
                                className="datagrid__column"
                                key={column}
                                dataField={column}
                                caption={datas[0].columns[column]}
                                showBorders={true}
                            />
                        ))}
                        <Paging
                            defaultPageSize={pageSize}
                            defaultPageIndex={0}
                            pageSize={filteredRowCount}
                            onPageChange={onPageChange}
                            totalCount={filteredData.length}
                        />
                    </DataGrid>
                )}
            </div>
            <div className="pagination">
                <div className="pagination__rowcount">
                    <span>Show : </span>
                    <div className="pagination__rowcount__input">
                        <input
                            type="number"
                            min="1"
                            max={(currentPage === 0) ? Math.min(pageSize, filteredData.length) : 1}
                            value={filteredRowCount}
                            onChange={(event) => {
                                const rowCount = Number(event.target.value);
                                setFilteredRowCount(rowCount);
                                setCurrentPage(0);
                            }
                            }
                        />
                        <span>Row{filteredRowCount !== 1 ? 's' : ''}</span>
                        <div className="pagination__rowcount__buttons">
                            <IncreaseIcon onClick={increaseRowCount} />
                            <DecreaseIcon onClick={decreaseRowCount} />

                        </div>
                    </div>
                </div>
                <div className="pagination__pagecount">
                    <button
                        className="pagination__button"
                        onClick={goToPreviousPage}
                        disabled={currentPage === 0}
                    >
                        &#x3c;
                    </button>
                    <div className="pagination__pagecount__input">
                        <input
                            type="number"
                            min="1"
                            max={totalPages}
                            value={currentPage + 1}
                            onChange={(event) => {
                                const newPage = Number(event.target.value) - 1;
                                setCurrentPage(newPage);
                            }}
                        />
                    </div>

                    <span>of <span>{totalPages}</span></span>
                    <button
                        className="pagination__button"
                        onClick={goToNextPage}
                        disabled={currentPage === totalPages - 1}
                    >
                        &#x3e;
                    </button>
                </div>
            </div>
        </section>
    );
};

export default DatasGrid;

*/


/*
import React, { useState, useEffect } from 'react';
import DataGridNav from './DataGridNav';
import DataGrid, {Column,Paging} from 'devextreme-react/data-grid';
import { IncreaseIcon, DecreaseIcon } from '../svgs/SvgIcons';

const DatasGrid = () => {

    const [datas, setDatas] = useState({
        columns: {
            socialmedialink: 'Social Media Link',
            socialmedianame: 'Social Media Name',
            explanation: 'Explanation',
        },
        values: [
            {
                socialmedialink: 'facebook',
                socialmedianame: 'ugurcan',
                explanation: 'I am not using Facebook',
            },
            {
                socialmedialink: 'facebook',
                socialmedianame: 'ugurcan',
                explanation: 'I am not using Facebook',
            },
            {
                socialmedialink: 'facebook',
                socialmedianame: 'ugurcan',
                explanation: 'I am not using Facebook',
            },
            {
                socialmedialink: 'facebook',
                socialmedianame: 'ugurcan',
                explanation: 'I am not using Facebook',
            },
            {
                socialmedialink: 'facebook',
                socialmedianame: 'ugurcan',
                explanation: 'I am not using Facebook',
            },
            {
                socialmedialink: 'facebook',
                socialmedianame: 'ugurcan',
                explanation: 'I am not using Facebook',
            },
            {
                socialmedialink: 'facebook',
                socialmedianame: 'ugurcan',
                explanation: 'I am not using Facebook',
            },
             {
                socialmedialink: 'facebook',
                socialmedianame: 'ugurcan',
                explanation: 'I am not using Facebook',
            },

            {
                socialmedialink: 'facebook',
                socialmedianame: 'ugurcan',
                explanation: 'I am not using Facebook',
            },
            {
                socialmedialink: 'facebook',
                socialmedianame: 'ugurcan',
                explanation: 'I am not using Facebook',
            },
            {
                socialmedialink: 'facebook',
                socialmedianame: 'ugurcan',
                explanation: 'I am not using Facebook',
            },
            {
                socialmedialink: 'facebook',
                socialmedianame: 'ugurcan',
                explanation: 'I am not using Facebook',
            },
            {
                socialmedialink: 'facebook',
                socialmedianame: 'ugurcan',
                explanation: 'I am not using Facebook',
            },
            {
                socialmedialink: 'facebook',
                socialmedianame: 'ugurcan',
                explanation: 'I am not using Facebook',
            },
            {
                socialmedialink: 'facebook',
                socialmedianame: 'ugurcan',
                explanation: 'I am not using Facebook',
            },
            {
                socialmedialink: 'facebook',
                socialmedianame: 'ugurcan',
                explanation: 'I am not using asdadadsa',
            },

            // Assume that i have a lot of data
        ],
    });
    const [filteredData, setFilteredData] = useState(datas.values);
    const [currentPage, setCurrentPage] = useState(0);
    const pageSize = 9;
    const [filteredRowCount, setFilteredRowCount] = useState(pageSize);

    useEffect(() => {
        setFilteredData(datas.values);
        setCurrentPage(0);
        // Call the helper function when the page changes
    }, [datas]);

    useEffect(() => {
        const remainingRows = filteredData.length - currentPage * pageSize;
        const rowCount = Math.min(remainingRows, pageSize);
        setFilteredRowCount(rowCount);
    }, [filteredData, currentPage]);

    const onPageChange = (newPageIndex) => {
        setCurrentPage(newPageIndex);
    };

    const addData = (newRow) => {
        setDatas((prevState) => {
            const newValues = [...prevState.values, newRow];
            return {
                ...prevState,
                values: newValues,
            };
        });
        setFilteredData((prevFilteredData) => [...prevFilteredData, newRow]);
    };

    const handleSearch = (query) => {
        const filtered = datas.values.filter((row) => {
            const values = Object.values(row);
            for (const value of values) {
                if (
                    value &&
                    value.toString().toLowerCase().includes(query.toLowerCase())
                ) {
                    return true;
                }
            }
            return false;
        });
        setFilteredData(filtered);
        setCurrentPage(0);
    };

    const getVisibleData = () => {
        const startIndex = currentPage * pageSize; // Start Index = 9
        const endIndex = startIndex + filteredRowCount; // End Index = 9 + 2 = 11
        return filteredData.slice(startIndex, endIndex); // 9 -  11 = 9 and 10th data
    };

    const totalPages = Math.ceil(filteredData.length / pageSize);

    const goToPreviousPage = () => {
        setCurrentPage((prevPage) => prevPage - 1);
    };

    const goToNextPage = () => {
        setCurrentPage((prevPage) => prevPage + 1);
    };

    const increaseRowCount = () => {
        const remainingRows = filteredData.length - currentPage * pageSize;
        const maxRowCount = Math.min(pageSize, remainingRows);

        if (filteredRowCount < maxRowCount) {
            setFilteredRowCount((prevRowCount) => {
                const updatedRowCount = Math.min(prevRowCount + 1, maxRowCount);
                return updatedRowCount;
            });
        }
    };
    const decreaseRowCount = () => {
        if (filteredRowCount > 1) {
            setFilteredRowCount((prevRowCount) => {
                const updatedRowCount = Math.max(prevRowCount - 1, 1);
                setCurrentPage((prevPage) => {
                    if (prevRowCount === 1) {
                        return prevPage + 1;
                    }
                    return prevPage;
                });
                return updatedRowCount;
            });
        }
    };

    return (
        <section className="datagrid">
            <DataGridNav addData={addData} onSearch={handleSearch} />
            <div className="datagrid__grid">
                <DataGrid
                    dataSource={getVisibleData()}
                    showBorders={false}
                    rowAlternationEnabled={true}
                    widthByColumnContent={true}
                    showColumnLines={true}
                    height="500px"
                >
                    {Object.keys(datas.columns).map((column) => (
                        <Column
                            className="datagrid__column"
                            key={column}
                            dataField={column}
                            caption={datas.columns[column]}
                            
                            showBorders={true}
                        />
                    ))}
                    <Paging
                        defaultPageSize={pageSize}
                        defaultPageIndex={0}
                        pageSize={filteredRowCount}
                        onPageChange={onPageChange}
                        totalCount={filteredData.length}
                    />
                </DataGrid>
            </div>
            <div className="pagination">
                <div className="pagination__rowcount">
                    <span>Show : </span>
                    <div className="pagination__rowcount__input">
                        <input
                            type="number"
                            min="1"
                            max={(currentPage === 0) ? Math.min(pageSize, filteredData.length) : 1}
                            value={filteredRowCount}
                            onChange={(event) =>
                                {
                                const rowCount = Number(event.target.value);
                                setFilteredRowCount(rowCount);
                                setCurrentPage(0);
                                }
                            }
                        />
                        <span>Row{filteredRowCount !== 1 ? 's' : ''}</span>
                        <div className="pagination__rowcount__buttons">
                            <IncreaseIcon onClick={increaseRowCount}/>
                            <DecreaseIcon onClick={decreaseRowCount}/>
                           
                        </div>
                    </div>
                </div>
                <div className="pagination__pagecount">
                    <button
                        className="pagination__button"
                        onClick={goToPreviousPage}
                        disabled={currentPage === 0}
                    >
                        &#x3c;
                    </button>
                    <div className="pagination__pagecount__input">
                        <input
                            type="number"
                            min="1"
                            max={totalPages}
                            value={currentPage + 1}
                            onChange={(event) => {
                                const newPage = Number(event.target.value) - 1;
                                setCurrentPage(newPage);
                            }}
                        />
                    </div>

                    <span>of <span>{totalPages}</span></span>
                    <button
                        className="pagination__button"
                        onClick={goToNextPage}
                        disabled={currentPage === totalPages - 1}
                    >
                        &#x3e;
                    </button>
                </div>
            </div>
        </section>
    );
};

export default DatasGrid;


*/





/*
import React, { useState, useEffect } from 'react';
import DataGridNav from './DataGridNav';
import DataGrid, {
    Column,
    Paging,
    Pager,
    ColumnChooser,
    FilterRow,
    HeaderFilter,
    Toolbar,
    SearchPanel,
} from 'devextreme-react/data-grid';

const DatasGrid = () => {
    const [showNavButtons, setShowNavButtons] = useState(true);
    const [datas, setDatas] = useState({
        columns: {
            socialmedialink: 'Social Media Link',
            socialmedianame: 'Social Media Name',
            explanation: 'Explanation',
        },
        values: [
            {
                socialmedialink: 'facebook',
                socialmedianame: 'ugurcan',
                explanation: 'I am not using Facebook',
            },
            {
                socialmedialink: 'facebook',
                socialmedianame: 'ugurcan',
                explanation: 'I am not using Facebook',
            },
            {
                socialmedialink: 'facebook',
                socialmedianame: 'ugurcan',
                explanation: 'I am not using Facebook',
            },
            {
                socialmedialink: 'facebook',
                socialmedianame: 'ugurcan',
                explanation: 'I am not using Facebook',
            },
            {
                socialmedialink: 'facebook',
                socialmedianame: 'ugurcan',
                explanation: 'I am not using Facebook',
            },
            {
                socialmedialink: 'facebook',
                socialmedianame: 'ugurcan',
                explanation: 'I am not using Facebook',
            },
            {
                socialmedialink: 'facebook',
                socialmedianame: 'ugurcan',
                explanation: 'I am not using Facebook',
            },
            {
                socialmedialink: 'facebook',
                socialmedianame: 'ugurcan',
                explanation: 'I am not using Facebook',
            },
            {
                socialmedialink: 'facebook',
                socialmedianame: 'ugurcan',
                explanation: 'I am not using Facebook',
            },
            {
                socialmedialink: 'facebook',
                socialmedianame: 'ugurcan',
                explanation: 'I am not using Facebook',
            },
            {
                socialmedialink: 'facebook',
                socialmedianame: 'ugurcan',
                explanation: 'I am not using Facebook',
            },
            {
                socialmedialink: 'facebook',
                socialmedianame: 'ugurcan',
                explanation: 'I am not using Facebook',
            },
            
            // Add more data values as needed
        ],
    });
    const [filteredData, setFilteredData] = useState(datas.values);
    const [currentPage, setCurrentPage] = useState(0);
    const pageSize = 9;
    const [filteredRowCount, setFilteredRowCount] = useState(pageSize);

    useEffect(() => {
        setFilteredData(datas.values);
        setCurrentPage(0);
    }, [datas]);

    const addData = (newRow) => {
        setDatas((prevState) => {
            const newValues = [...prevState.values, newRow];
            return {
                ...prevState,
                values: newValues,
            };
        });
        setFilteredData((prevFilteredData) => [...prevFilteredData, newRow]);
    };

    const handleSearch = (query) => {
        const filtered = datas.values.filter((row) => {
            const values = Object.values(row);
            for (const value of values) {
                if (
                    value &&
                    value.toString().toLowerCase().includes(query.toLowerCase())
                ) {
                    return true;
                }
            }
            return false;
        });
        setFilteredData(filtered);
        setCurrentPage(0);
    };

    const allowedPageSizes = [5, 10, 20];

    const onPageChange = (newPageIndex) => {
        setCurrentPage(newPageIndex);
    };

    const getVisibleData = () => {
        const startIndex = currentPage * pageSize;
        const endIndex = startIndex + filteredRowCount;
        const visibleData = filteredData.slice(startIndex, endIndex);

        // Check if data length is less than pageSize
        if (visibleData.length < pageSize) {
            const emptyRowsCount = pageSize - visibleData.length;
            const emptyRows = Array(emptyRowsCount).fill({});
            visibleData.push(...emptyRows);
        }

        return visibleData;
    };

    const totalPages = Math.ceil(filteredData.length / pageSize);

    const goToPreviousPage = () => {
        setCurrentPage((prevPage) => prevPage - 1);
    };

    const goToNextPage = () => {
        setCurrentPage((prevPage) => prevPage + 1);
    };

    const increaseRowCount = () => {
        if (filteredRowCount < filteredData.length) {
            setFilteredRowCount((prevRowCount) => prevRowCount + 1);
            setCurrentPage(0);
        }
    };

    const decreaseRowCount = () => {
        if (filteredRowCount > 1) {
            setFilteredRowCount((prevRowCount) => prevRowCount - 1);
            setCurrentPage(0);
        }
    };

    const handlePageInputChange = (event) => {
        const inputPage = parseInt(event.target.value);
        if (!isNaN(inputPage) && inputPage >= 1 && inputPage <= totalPages) {
            setCurrentPage(inputPage - 1);
        }
    };

    return (
        <section className="datagrid">
            <DataGridNav addData={addData} onSearch={handleSearch} />
            <div className="datagrid__grid">
                <DataGrid
                    dataSource={getVisibleData()}
                    showBorders={false}
                    rowAlternationEnabled={true}
                    widthByColumnContent={true}
                    showColumnLines={true}
                >
                    {Object.keys(datas.columns).map((column) => (
                        <Column
                            className="datagrid__column"
                            key={column}
                            dataField={column}
                            caption={datas.columns[column]}
                            width={column === 'explanation' ? 450 : undefined}
                            showBorders={true}
                        />
                    ))}
                    <Paging
                        defaultPageSize={pageSize}
                        defaultPageIndex={0}
                        pageSize={filteredRowCount}
                        onPageChange={onPageChange}
                        totalCount={filteredData.length}
                    />
                </DataGrid>
            </div>
            <div className="pagination">
                <div className="pagination__rowcount">
                    <span>Show : </span>
                    <div className="pagination__rowcount__input">
                        <input
                            type="number"
                            min="1"
                            max="9"
                            value={filteredRowCount}
                            onChange={(event) =>
                                setFilteredRowCount(Number(event.target.value))
                            }
                        />
                        <span>Rows</span>
                        <div className="pagination__rowcount__buttons">
                            <svg
                                onClick={increaseRowCount}
                                width="10"
                                height="7"
                                viewBox="0 0 10 7"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M4.78241 0.285875L0.900427 5.73587C0.523197 6.26547 0.901813 7 1.55203 7L8.42004 7C9.07025 7 9.44887 6.26547 9.07164 5.73587L5.18966 0.285875C5.08998 0.145929 4.88209 0.145929 4.78241 0.285875Z"
                                    fill="#744BFC"
                                />
                            </svg>
                            <svg
                                onClick={decreaseRowCount}
                                width="10"
                                height="7"
                                viewBox="0 0 10 7"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M5.18964 6.71413L9.07162 1.26413C9.44885 0.734529 9.07023 -3.953e-08 8.42002 -6.80313e-08L1.55201 -3.69083e-07C0.901792 -3.97584e-07 0.523177 0.73453 0.900407 1.26413L4.78239 6.71413C4.88207 6.85407 5.08996 6.85407 5.18964 6.71413Z"
                                    fill="#744BFC"
                                />
                            </svg>
                        </div>
                    </div>
                </div>
                <div className="pagination__pagecount">
                    <button
                        className="pagination__button"
                        onClick={goToPreviousPage}
                        disabled={currentPage === 0}
                    >
                        Previous
                    </button>
                    <span>
                        Page{' '}
                        <input
                            type="number"
                            min="1"
                            max={totalPages}
                            value={currentPage + 1}
                            onChange={handlePageInputChange}
                        />{' '}
                        of {totalPages}
                    </span>
                    <button
                        className="pagination__button"
                        onClick={goToNextPage}
                        disabled={currentPage === totalPages - 1}
                    >
                        Next
                    </button>
                </div>
            </div>
        </section>
    );
};

export default DatasGrid;



*/


/*
import React, { useState, useEffect } from 'react';
import DataGridNav from './DataGridNav';
import DataGrid, { Column } from 'devextreme-react/data-grid';

const DatasGrid = () => {
    const [datas, setDatas] = useState({
        columns: {
            socialmedialink: 'Social Media Link',
            socialmedianame: 'Social Media Name',
            explanation: 'Explanation',
        },
        values: [
            {
                socialmedialink: 'facebook',
                socialmedianame: 'ugurcan',
                explanation: 'I am not using Facebook',
            },
            {
                socialmedialink: 'facebook',
                socialmedianame: 'ugurcan',
                explanation: 'I am not using Facebook',
            },
            {
                socialmedialink: 'facebook',
                socialmedianame: 'ugurcan',
                explanation: 'I am not using Facebook',
            },
            {
                socialmedialink: 'facebook',
                socialmedianame: 'ugurcan',
                explanation: 'I am not using Facebook',
            },
            {
                socialmedialink: 'facebook',
                socialmedianame: 'ugurcan',
                explanation: 'I am not using Facebook',
            },
            {
                socialmedialink: 'facebook',
                socialmedianame: 'ugurcan',
                explanation: 'I am not using Facebook',
            },

            {
                socialmedialink: 'facebook',
                socialmedianame: 'ugurcan',
                explanation: 'I am not using Facebook',
            },
            {
                socialmedialink: 'facebook',
                socialmedianame: 'ugurcan',
                explanation: 'I am not using Facebook',
            },
            {
                socialmedialink: 'facebook',
                socialmedianame: 'ugurcan',
                explanation: 'I am not using Facebook',
            },
            {
                socialmedialink: 'facebook',
                socialmedianame: 'ugurcan',
                explanation: 'I am not using Facebook',
            },
            // data values
        ],
    });
    const [filteredData, setFilteredData] = useState(datas.values);
    const [currentPage, setCurrentPage] = useState(0);
    const pageSize = 9;
    const [filteredRowCount, setFilteredRowCount] = useState(
        Math.min(getFilledRowCount(), pageSize)
    );

    useEffect(() => {
        setFilteredData(datas.values);
        setCurrentPage(0);
        setFilteredRowCount(getFilledRowCount());
    }, [datas]);

    const addData = (newRow) => {
        setDatas((prevState) => {
            const newValues = [...prevState.values, newRow];
            return {
                ...prevState,
                values: newValues,
            };
        });
        setFilteredData((prevFilteredData) => [...prevFilteredData, newRow]);
        setFilteredRowCount((prevRowCount) => prevRowCount + 1);
    };

    const handleSearch = (query) => {
        const filtered = datas.values.filter((row) => {
            const values = Object.values(row);
            for (const value of values) {
                if (
                    value &&
                    value.toString().toLowerCase().includes(query.toLowerCase())
                ) {
                    return true;
                }
            }
            return false;
        });
        setFilteredData(filtered);
        setCurrentPage(0);
        setFilteredRowCount(getFilledRowCount(filtered));
    };

    const getVisibleData = () => {
        const startIndex = currentPage * pageSize;
        const endIndex = startIndex + filteredRowCount;
        const visibleData = filteredData.slice(startIndex, endIndex);

        // Check if data length is less than pageSize
        if (visibleData.length < pageSize) {
            const emptyRowsCount = pageSize - visibleData.length;
            const emptyRows = Array(emptyRowsCount).fill({});
            visibleData.push(...emptyRows);
        }

        return visibleData;
    };

    const totalPages = Math.ceil(filteredRowCount / pageSize);

    const goToPreviousPage = () => {
        setCurrentPage((prevPage) => prevPage - 1);
    };

    const goToNextPage = () => {
        setCurrentPage((prevPage) => prevPage + 1);
    };

    const increaseRowCount = () => {
        if (filteredRowCount < filteredData.length) {
            setFilteredRowCount((prevRowCount) => prevRowCount + 1);
            setCurrentPage(0);
        }
    };

    const decreaseRowCount = () => {
        if (filteredRowCount > 1) {
            setFilteredRowCount((prevRowCount) => prevRowCount - 1);
            setCurrentPage(0);
        }
    };

    function getFilledRowCount(data = filteredData) {
        return data.filter((row) => Object.values(row).some((value) => value !== '')).length;
    }

    return (
        <section className="datagrid">
            <DataGridNav addData={addData} onSearch={handleSearch} />
            <div className="datagrid__grid">
                <DataGrid
                    dataSource={getVisibleData()}
                    showBorders={false}
                    rowAlternationEnabled={true}
                    widthByColumnContent={true}
                    showColumnLines={true}
                >
                    {Object.keys(datas.columns).map((column) => (
                        <Column
                            className="datagrid__column"
                            key={column}
                            dataField={column}
                            caption={datas.columns[column]}
                            showBorders={true}
                        />
                    ))}
                </DataGrid>
            </div>
            <div className="pagination">
                <div className="pagination__rowcount">
                    <span>Show : </span>
                    <div className="pagination__rowcount__input">
                        <input
                            type="number"
                            min="1"
                            max="9"
                            value={filteredRowCount}
                            onChange={(event) => {
                                const value = Number(event.target.value);
                                if (value <= 9) {
                                    setFilteredRowCount(value);
                                    setCurrentPage(0);
                                }
                            }}
                        />
                        <span>Rows</span>
                        <div className="pagination__rowcount__buttons">
                            <svg
                                onClick={increaseRowCount}
                                width="10"
                                height="7"
                                viewBox="0 0 10 7"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M4.78241 0.285875L0.900427 5.73587C0.523197 6.26547 0.901813 7 1.55203 7L8.42004 7C9.07025 7 9.44887 6.26547 9.07164 5.73587L5.18966 0.285875C5.08998 0.145929 4.88209 0.145929 4.78241 0.285875Z"
                                    fill="#744BFC"
                                />
                            </svg>
                            <svg
                                onClick={decreaseRowCount}
                                width="10"
                                height="7"
                                viewBox="0 0 10 7"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M5.18964 6.71413L9.07162 1.26413C9.44885 0.734529 9.07023 -3.953e-08 8.42002 -6.80313e-08L1.55201 -3.69083e-07C0.901792 -3.97584e-07 0.523177 0.73453 0.900407 1.26413L4.78239 6.71413C4.88207 6.85407 5.08996 6.85407 5.18964 6.71413Z"
                                    fill="#744BFC"
                                />
                            </svg>
                        </div>
                    </div>
                </div>
                <div className="pagination__pagecount">
                    <button
                        className="pagination__button"
                        onClick={goToPreviousPage}
                        disabled={currentPage === 0}
                    >
                        &#x3c;
                    </button>
                    <div className="pagination__pagecount__input">
                        <input
                            type="number"
                            min="1"
                            max={totalPages}
                            value={currentPage + 1}
                            onChange={(event) => {
                                const newPage = Number(event.target.value) - 1;
                                setCurrentPage(newPage);
                            }}
                        />
                    </div>
                    <span>
                        of <span>{totalPages}</span>
                    </span>
                    <button
                        className="pagination__button"
                        onClick={goToNextPage}
                        disabled={currentPage === totalPages - 1}
                    >
                        &#x3e;
                    </button>
                </div>
            </div>
        </section>
    );
};

export default DatasGrid; 


*/
