import React, { useEffect, useState, useRef } from "react";
import { DataTable, DataTableStateEvent } from "primereact/datatable"; // Import the correct event type
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { OverlayPanel } from "primereact/overlaypanel";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "./App.css"; // Custom styles

type Artwork = {
  id: number;
  title: string;
  place_of_origin: string;
  artist_display: string;
  inscriptions: string;
  date_start: string;
  date_end: string;
};

type APIResponse = {
  pagination: {
    total: number;
    limit: number;
    offset: number;
    total_pages: number;
    current_page: number;
  };
  data: Artwork[];
};

const App: React.FC = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1); // Current page state
  const [rowsPerPage, setRowsPerPage] = useState<number>(10); // Rows per page
  const [selectedRows, setSelectedRows] = useState<Artwork[]>([]);
  const [selectedRowText, setSelectedRowText] = useState<string>("");
  const overlayRef = useRef<OverlayPanel>(null);

  // Fetch artworks with pagination
  const fetchArtworks = async (page: number, rows: number) => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://api.artic.edu/api/v1/artworks?page=${page}&limit=${rows}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: APIResponse = await response.json();

      const transformedData: Artwork[] = result.data.map((item) => ({
        id: item.id,
        title: item.title,
        place_of_origin: item.place_of_origin,
        artist_display: item.artist_display,
        inscriptions: item.inscriptions,
        date_start: item.date_start,
        date_end: item.date_end,
      }));

      setArtworks(transformedData);
      setTotalRecords(result.pagination.total);
    } catch (error) {
      console.error("Error fetching artworks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtworks(currentPage, rowsPerPage); // Fetch initial data
  }, [currentPage, rowsPerPage]);

  // Handle page change
  const onPageChange = (event: DataTableStateEvent) => {
    const page = event.first / event.rows + 1; // Adjust for 0-based indexing
    setCurrentPage(page); // Update current page state
    setRowsPerPage(event.rows); // Update rows per page if it changes
    fetchArtworks(page, event.rows); // Fetch new data for the selected page
  };

  // Handle row selection
  const onSelectionChange = (e: { value: Artwork[] }) => {
    setSelectedRows(e.value); // Update selected rows
  };

  const onSubmit = () => {
    console.log("Selected rows for submission:", selectedRows);
    console.log("Number of rows selected:", selectedRows.length);
    setSelectedRowText(selectedRows.map((row) => row.title).join(", "));
    overlayRef.current?.hide();
  };

  const headerTemplate = (
    <div style={{ display: "flex", alignItems: "center" }}>
      <Button
        icon="pi pi-angle-down"
        onClick={(e) => overlayRef.current?.toggle(e)}
        style={{
          marginLeft: "10px",
          border: "none",
          backgroundColor: "transparent",
          color: "white",
        }}
        className="p-button-text"
      />
    </div>
  );

  return (
    <div className="app-container">
      <h1>Pagination with OverlayPanel</h1>
      <div className="table-container" style={{ height: "700px", overflow: "auto" }}>
        <DataTable
          value={artworks}
          paginator
          rows={rowsPerPage} // Number of rows per page
          totalRecords={totalRecords} // Total number of records for pagination
          lazy
          loading={loading} // Loading state for async data
          onPage={onPageChange} // Correct type for page change event handler
          selectionMode="multiple"
          selection={selectedRows}
          onSelectionChange={onSelectionChange}
          tableStyle={{ minWidth: "50rem", maxWidth: "100%" }}
          className="custom-table"
        >
          <Column header={headerTemplate} selectionMode="multiple" />
          <Column field="title" header="Title" />
          <Column field="place_of_origin" header="Origin" />
          <Column field="artist_display" header="Artist" />
          <Column field="date_start" header="Start Date" />
          <Column field="date_end" header="End Date" />
        </DataTable>

        {/* Display current page and total records */}
        <div style={{ marginTop: "10px" }}>
          <p>Current Page: {currentPage}</p>
          <p>Total Records: {totalRecords}</p>
        </div>
      </div>

      {/* OverlayPanel for selected rows */}
      <OverlayPanel ref={overlayRef}>
        <div>
          <textarea
            rows={5}
            value={selectedRowText}
            onChange={(e) => setSelectedRowText(e.target.value)}
            placeholder="Select rows...."
            style={{
              width: "100%",
              marginTop: "10px",
              fontFamily: "Arial",
              fontSize: "18px",
              resize: "none",
            }}
          />
          <br />
          <button
            onClick={onSubmit}
            style={{
              border: "2px solid",
              borderColor: "black",
              marginTop: "10px",
            }}
          >
            Submit
          </button>
        </div>
      </OverlayPanel>
    </div>
  );
};

export default App;
