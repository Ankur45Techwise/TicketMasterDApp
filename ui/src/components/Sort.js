import React from "react";
import ReactSelect from "react-select";
import { DateRangePicker, LocalizationProvider } from "@mui/x-date-pickers-pro";
import { FormLabel, Box } from "@mui/material";
import { Tune } from "@mui/icons-material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { CATEGORY_OPTIONS } from "../constants";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const customStyles = {
  control: (provided) => ({
    ...provided,
    borderColor: "black",
    boxShadow: "none",
    "&:hover": {
      borderColor: "darkblue",
    },
    borderRadius: "2px",
    height: "50px",
    width: "200px",
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused ? "lightgray" : "white",
    color: "black",
  }),
};

const Sort = ({ occasions, setFilteredOccasions }) => {
  const [selectedCategory, setSelectedCategory] = React.useState(null);
  const [dateRange, setDateRange] = React.useState([null, null]);

  React.useEffect(() => {
    if (dateRange[0] && dateRange[1]) {
      const dateFilteredOccassions = occasions.filter((occ) => {
        const occasionDate = new Date(occ.date);
        const fromDate = new Date(dateRange[0]);
        const toDate = new Date(dateRange[1]);
        return (
          occasionDate.getTime() >= fromDate.getTime() &&
          occasionDate.getTime() <= toDate.getTime()
        );
      });
      setFilteredOccasions(dateFilteredOccassions);
    } else {
      setFilteredOccasions(occasions);
    }
  }, [dateRange]);

  React.useEffect(() => {
    if (selectedCategory) {
      const categoryFilteredOccasions = occasions.filter((occ) => {
        const occasionCategory = occ.category;
        return occasionCategory === selectedCategory;
      });
      setFilteredOccasions(categoryFilteredOccasions);
    } else {
      setFilteredOccasions(occasions);
    }
  }, [selectedCategory]);

  return (
    <div className="sort" style={{ marginTop: 50 }}>
      <div style={{ marginTop: "20px" }}>
        <Tune />
      </div>
      <div style={{ marginLeft: "20px" }}>
        <label>Category</label>
        <div style={{ width: "200px" }}>
          <ReactSelect
            options={CATEGORY_OPTIONS}
            onChange={(o) => setSelectedCategory(o ? o.value : null)}
            className="react-select"
            isClearable
          />
        </div>
      </div>

      <div style={{ marginLeft: "30px" }}>
        <label>Date Range</label>
        <div className="date-range">
          <DatePicker
            selected={dateRange[0]}
            onChange={(date) => setDateRange((prev) => [date, prev[1]])}
            className="input-field"
            placeholderText="Start Date"
            selectsStart
            startDate={dateRange[0]}
            endDate={dateRange[1]}
            dateFormat="MMMM d, yyyy"
            isClearable
            maxDate={dateRange[1]}
          />
          <span className="date-separator">-</span>
          <DatePicker
            selected={dateRange[1]}
            onChange={(date) => setDateRange((prev) => [prev[0], date])}
            className="input-field"
            placeholderText="End Date"
            selectsEnd
            startDate={dateRange[0]}
            endDate={dateRange[1]}
            dateFormat="MMMM d, yyyy"
            isClearable
            minDate={dateRange[0]}
          />
        </div>
      </div>
    </div>
  );
};

export default Sort;
