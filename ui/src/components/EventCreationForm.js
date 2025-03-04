import React, { useCallback } from "react";
import Select from "react-select";
import { CATEGORY_OPTIONS } from "../constants";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const initalFormState = {
  name: "",
  cost: "",
  maxTickets: "",
  location: "",
  eventDate: null,
  category: null,
};

const EventForm = ({ contractModifier, loadBlockchainData }) => {
  const [formData, setFormData] = React.useState(initalFormState);

  const [errors, setErrors] = React.useState({
    cost: "",
    maxTickets: "",
  });

  const canSubmit = React.useMemo(() => {
    if (errors.cost.length || errors.maxTickets.length) return false;
    if (
      formData.category &&
      formData.eventDate &&
      formData.cost.length &&
      formData.maxTickets.length &&
      formData.name.length &&
      formData.location.length
    )
      return true;
    return false;
  }, [formData, errors]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validation for numeric inputs
    if (
      (name === "cost" || name === "maxTickets") &&
      value !== "" &&
      !/^\d+$/.test(value)
    ) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "Please enter a valid number",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "",
      }));
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = useCallback(async () => {
    const contractArgs = {
      name: formData.name,
      category: formData.category,
      cost: formData.cost,
      maxTickets: formData.maxTickets,
      location: formData.location,
      date: `${formData.eventDate?.toLocaleString("default", {
        month: "long",
      })} ${formData.eventDate?.getDate()} ${formData.eventDate.getFullYear()}`,
      time: `${formData.eventDate?.getHours()}:${
        formData.eventDate?.getMinutes() === 0
          ? "00"
          : formData.eventDate?.getMinutes()
      } IST`,
    };

    console.log(contractArgs);

    try {
      if (contractModifier) {
        await contractModifier.list(
          contractArgs.name,
          contractArgs.cost,
          contractArgs.maxTickets,
          contractArgs.date,
          contractArgs.time,
          contractArgs.location,
          contractArgs.category
        );
      }
    } catch (e) {
      console.error("Failed to create an event:", e);
    }
  }, [formData, JSON.stringify(contractModifier), loadBlockchainData]);

  return (
    <div className="form-container">
      <h2 className="form-heading">Create an Event</h2>
      <label>Category</label>

      <Select
        options={CATEGORY_OPTIONS}
        className="react-select"
        isClearable
        onChange={(option) =>
          setFormData({ ...formData, category: option ? option.value : null })
        }
      />

      <label>Name</label>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        className="input-field"
        placeholder="Enter event name"
      />

      <label>Cost</label>
      <input
        type="text"
        name="cost"
        value={formData.cost}
        onChange={handleChange}
        className={`input-field ${errors.cost ? "error-border" : ""}`}
        placeholder="Enter cost"
      />
      {errors.cost && <span className="error-message">{errors.cost}</span>}

      <label>Maximum Tickets</label>
      <input
        type="text"
        name="maxTickets"
        value={formData.maxTickets}
        onChange={handleChange}
        className={`input-field ${errors.maxTickets ? "error-border" : ""}`}
        placeholder="Enter max tickets"
      />
      {errors.maxTickets && (
        <span className="error-message">{errors.maxTickets}</span>
      )}

      <label>Location</label>
      <input
        type="text"
        name="location"
        value={formData.location}
        onChange={handleChange}
        className="input-field"
        placeholder="Enter location"
      />

      <label>Event Date</label>
      <DatePicker
        selected={formData.eventDate}
        onChange={(date) => setFormData({ ...formData, eventDate: date })}
        className="input-field"
        placeholderText="Select event date"
        dateFormat="MMMM d, yyyy h:mm aa"
        showTimeSelect // Enables time selection
        timeFormat="HH:mm" // 24-hour format (change to h:mm aa for 12-hour)
        timeIntervals={30} // Allows selection in 15-minute steps
        timeCaption="Time"
        isClearable
      />

      <button
        type="submit"
        className="submit-btn"
        onClick={handleSubmit}
        disabled={!canSubmit}
      >
        Submit
      </button>
    </div>
  );
};

export default EventForm;
