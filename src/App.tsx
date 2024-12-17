import React, { useEffect, useState, useRef } from "react";
import { DataTable } from "primereact/datatable";
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
  artist_display: string;
  date_display: string;
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

type PageEvent = {
  first: number;
  rows: number;
  page: number;
  pageCount: number;
};

const App: React.FC = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedRows, setSelectedRows] = useState<Artwork[]>([]);
  const [selectedRowText, setSelectedRowText] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1); // Track the current page
  const [selectRowCount, setSelectRowCount] = useState<number>(0); // Track the number of rows to select
  const overlayRef = useRef<OverlayPanel>(null);

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
        artist_display: item.artist_display,
        date_display: item.date_display,
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
    fetchArtworks(1, 10); // Fetch the first page of data
  }, []);

  const onPageChange = (event: PageEvent) => {
    const page = event.page + 1; // Adjust for zero-based index
    setCurrentPage(page); // Set the current page state
    fetchArtworks(page, event.rows); // Fetch the data for the new page
  };

  const onSelectionChange = (e: { value: Artwork[] }) => {
    setSelectedRows(e.value); // Set the selected rows
  };

  const onSubmit = () => {
    console.log("Selected rows for submission:", selectedRows);
    console.log("Number of rows selected:", selectedRows.length);
    setSelectedRowText(selectedRows.map((row) => row.title).join(', '));
    overlayRef.current?.hide();
  };

  const selectRows = () => {
    if (selectRowCount <= artworks.length) {
      const selected = artworks.slice(0, selectRowCount); // Select the specified number of rows
      setSelectedRows(selected);
    } else {
      console.log("There are not enough rows on the current page.");
    }
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
      <h1>GrowMeOrganic Assignment</h1>
      <div className="table-container" style={{ height: "700px", overflow: "auto" }}>
        <DataTable
          value={artworks}
          paginator
          rows={10} // Number of rows per page
          totalRecords={totalRecords} // Total number of records for pagination
          selectionMode={"multiple"}
          selection={selectedRows}
          onSelectionChange={onSelectionChange}
          tableStyle={{ minWidth: "50rem", maxWidth: "100%" }}
          onPage={onPageChange} // Enable page change event
          className="custom-table"
          lazy
        >
          <Column header={headerTemplate} selectionMode="multiple" />
          <Column field="title" header="Title" />
          <Column field="artist_display" header="Artist" />
          <Column field="date_display" header="Date" />
        </DataTable>

        {/* Display the current page number */}
        <div style={{ marginTop: "10px" }}>
          <p>Current Page: {currentPage}</p>
        </div>
      </div>

      <OverlayPanel ref={overlayRef}>
        <div>
        <textarea
            rows={5}
            value={selectedRowText}
            onChange={(e) => setSelectedRowText(e.target.value)}
            placeholder="Select rows...."
            style={{ width: "100%", marginTop: "10px", fontFamily: "Arial", fontSize: "18px", resize: "none" }}
          />
          <br />
          <button onClick={onSubmit} style={{ border: "2px solid", borderColor: "black", marginTop: "10px" }}>
            Submit
          </button>
        </div>
      </OverlayPanel>
    </div>
  );
};

export default App;
