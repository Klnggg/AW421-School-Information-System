import { useState, useMemo, useEffect, useRef } from 'react';
import { Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ChevronDown } from 'lucide-react';

const getNestedValue = (obj, path) => {
  return path.split('.').reduce((current, prop) => current?.[prop], obj);
};

const DataTable = ({
  data = [],
  columns = [],
  searchable = true,
  searchPlaceholder = 'Search...',
  searchFields = [],
  pageSize = 10,
  emptyMessage = 'No data available',
  emptyIcon: EmptyIcon,
  isDarkMode = false,
  renderRowActions,
  onRowClick,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(pageSize);
  const [showPageSizeDropdown, setShowPageSizeDropdown] = useState(false);
  const pageSizeDropdownRef = useRef(null);

  useEffect(() => {
    setCurrentPageSize(pageSize);
  }, [pageSize]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pageSizeDropdownRef.current && !pageSizeDropdownRef.current.contains(event.target)) {
        setShowPageSizeDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const filteredData = useMemo(() => {
    if (!searchTerm || searchFields.length === 0) {
      return data;
    }

    const lowerSearchTerm = searchTerm.toLowerCase();
    return data.filter((item) => {
      return searchFields.some((field) => {
        const value = getNestedValue(item, field);
        return value && String(value).toLowerCase().includes(lowerSearchTerm);
      });
    });
  }, [data, searchTerm, searchFields]);

  const totalPages = Math.ceil(filteredData.length / currentPageSize);
  const startIndex = (currentPage - 1) * currentPageSize;
  const endIndex = startIndex + currentPageSize;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, currentPageSize]);

  const handlePageSizeChange = (newSize) => {
    setCurrentPageSize(newSize);
    setShowPageSizeDropdown(false);
  };

  const pageSizeOptions = [1, 5, 10, 20, 50, 100];

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Page size dropdown component
  const PageSizeDropdown = () => (
    <div className="relative" ref={pageSizeDropdownRef}>
      <button
        onClick={() => setShowPageSizeDropdown(!showPageSizeDropdown)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${
          isDarkMode
            ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
            : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
        }`}
      >
        <span>{currentPageSize} per page</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${showPageSizeDropdown ? 'rotate-180' : ''}`} />
      </button>
      {showPageSizeDropdown && (
        <div className={`absolute right-0 mt-2 w-32 rounded-lg shadow-lg border z-50 ${
          isDarkMode
            ? 'bg-slate-800 border-slate-700'
            : 'bg-white border-slate-200'
        }`}>
          <div className="py-1">
            {pageSizeOptions.map((size) => (
              <button
                key={size}
                onClick={() => handlePageSizeChange(size)}
                className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                  currentPageSize === size
                    ? isDarkMode
                      ? 'bg-slate-700 text-blue-400'
                      : 'bg-blue-50 text-blue-600'
                    : isDarkMode
                      ? 'text-slate-300 hover:bg-slate-700'
                      : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {size} per page
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      {searchable && (
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search
              className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${
                isDarkMode ? 'text-slate-400' : 'text-slate-500'
              }`}
            />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                isDarkMode
                  ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500'
                  : 'bg-white border-slate-300 text-slate-900 placeholder-slate-500 focus:border-blue-500 focus:ring-blue-500'
              } focus:outline-none focus:ring-2 transition-colors`}
            />
          </div>
          <div className="flex items-center gap-4">
            <div className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Showing {filteredData.length === 0 ? 0 : startIndex + 1} to {Math.min(endIndex, filteredData.length)} of {filteredData.length} results
            </div>
            <PageSizeDropdown />
          </div>
        </div>
      )}

      {!searchable && (
        <div className="flex items-center justify-end">
          <div className="flex items-center gap-4">
            <div className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Showing {filteredData.length === 0 ? 0 : startIndex + 1} to {Math.min(endIndex, filteredData.length)} of {filteredData.length} results
            </div>
            <PageSizeDropdown />
          </div>
        </div>
      )}

      {/* Table */}
      <div className={`overflow-hidden rounded-xl border shadow-sm ${
        isDarkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'
      }`}>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
            <thead className={isDarkMode ? 'bg-slate-700' : 'bg-slate-50'}>
              <tr>
                {columns.map((column, index) => (
                  <th
                    key={index}
                    className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                      column.align === 'right' ? 'text-right' : column.align === 'center' ? 'text-center' : 'text-left'
                    } ${
                      isDarkMode ? 'text-slate-300' : 'text-slate-500'
                    }`}
                  >
                    {column.header}
                  </th>
                ))}
                {renderRowActions && (
                  <th className={`px-6 py-3 text-right text-xs font-medium uppercase tracking-wider ${
                    isDarkMode ? 'text-slate-300' : 'text-slate-500'
                  }`}>
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className={`divide-y ${isDarkMode ? 'divide-slate-700 bg-slate-800' : 'divide-slate-200 bg-white'}`}>
              {paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + (renderRowActions ? 1 : 0)}
                    className="px-6 py-12 text-center"
                  >
                    {EmptyIcon ? (
                      <>
                        <EmptyIcon className={`mx-auto h-12 w-12 ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`} />
                        <h3 className={`mt-2 text-sm font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                          {emptyMessage}
                        </h3>
                      </>
                    ) : (
                      <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        {emptyMessage}
                      </p>
                    )}
                  </td>
                </tr>
              ) : (
                paginatedData.map((row, rowIndex) => (
                  <tr
                    key={row.id || rowIndex}
                    onClick={() => onRowClick && onRowClick(row)}
                    className={`transition-colors ${
                      onRowClick ? 'cursor-pointer' : ''
                    } ${
                      isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-50'
                    }`}
                  >
                    {columns.map((column, colIndex) => (
                      <td
                        key={colIndex}
                        className={`whitespace-nowrap px-6 py-4 ${
                          column.align === 'right' ? 'text-right' : column.align === 'center' ? 'text-center' : 'text-left'
                        }`}
                      >
                        {column.cell ? column.cell(row) : getNestedValue(row, column.accessor)}
                      </td>
                    ))}
                    {renderRowActions && (
                      <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                        {renderRowActions(row)}
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className={`flex items-center justify-between border-t px-6 py-4 ${
            isDarkMode ? 'border-slate-700' : 'border-slate-200'
          }`}>
            <div className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg transition-colors ${
                  currentPage === 1
                    ? isDarkMode
                      ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : isDarkMode
                      ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-300'
                }`}
              >
                <ChevronsLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg transition-colors ${
                  currentPage === 1
                    ? isDarkMode
                      ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : isDarkMode
                      ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-300'
                }`}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className={`px-4 py-2 text-sm font-medium ${
                isDarkMode ? 'text-slate-300' : 'text-slate-700'
              }`}>
                {currentPage} / {totalPages}
              </div>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg transition-colors ${
                  currentPage === totalPages
                    ? isDarkMode
                      ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : isDarkMode
                      ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-300'
                }`}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg transition-colors ${
                  currentPage === totalPages
                    ? isDarkMode
                      ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : isDarkMode
                      ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-300'
                }`}
              >
                <ChevronsRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataTable;