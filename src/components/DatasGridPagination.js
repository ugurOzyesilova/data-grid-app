import React from 'react'
import { IncreaseIcon, DecreaseIcon } from '../svgs/SvgIcons';


const DatasGridPagination = ({ currentPage, pageSize, goToPreviousPage, goToNextPage, filteredData, filteredRowCount, setFilteredRowCount, setCurrentPage, increaseRowCount, decreaseRowCount, totalPages }) => {
    return (
        <div className="pagination">
            <div className="pagination__rowcount">
                <span>Show: </span>
                <div className="pagination__rowcount__input">
                    <input
                        type="number"
                        min="1"
                        max={currentPage === 0 ? Math.min(pageSize, filteredData.length) : 1}
                        value={filteredRowCount}
                        onChange={(event) => {
                            const rowCount = Number(event.target.value);
                            setFilteredRowCount(rowCount);
                            setCurrentPage(0);
                        }}
                    />
                    <span>Row{filteredRowCount !== 1 ? 's' : ''}</span>
                    {/* used to determine the label based on the value of filteredRowCount. If filteredRowCount is not equal to 1, it means there are multiple rows, so the letter 's' is appended to the word "Row" to make it plural.
                            If filteredRowCount is equal to 1, the label remains singular, and the empty string '' is used to represent no additional text.
                            The resulting label will be "Row" if filteredRowCount is 1 and "Rows" if filteredRowCount is not equal to 1. */ }
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
    )
}

export default DatasGridPagination