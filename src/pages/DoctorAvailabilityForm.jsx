import { useState } from "react";

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function DoctorAvailabilityForm({ onSave }) {
  const [availability, setAvailability] = useState([]);

  const handleAddSlot = () => {
    setAvailability([...availability, { day: "", startTime: "", endTime: "" }]);
  };

  const handleChange = (index, field, value) => {
    const updated = [...availability];
    updated[index][field] = value;
    setAvailability(updated);
  };

  const handleRemoveSlot = (index) => {
    const updated = availability.filter((_, i) => i !== index);
    setAvailability(updated);
  };

  const handleSave = () => {
    
    const incompleteSlots = availability.filter(
      slot => !slot.day || !slot.startTime || !slot.endTime
    );

    if (incompleteSlots.length > 0) {
      alert("Please fill all fields for each availability slot");
      return;
    }
    
    const invalidTimes = availability.filter(
      slot => slot.startTime >= slot.endTime
    );

    if (invalidTimes.length > 0) {
      alert("End time must be after start time");
      return;
    }

    onSave(availability);
  };

  return (
    <div className="bg-white p-2 border border-gray-200 rounded mt-4">
      <h2 className="text-lg font-semibold text-blue-700 mb-3">🕒 Set Your Availability</h2>
      
      {availability.length === 0 ? (
        <p className="text-gray-500 text-sm mb-3">No availability slots added yet.</p>
      ) : (
        availability.map((slot, index) => (
          <div key={index} className="flex gap-2 mb-3 items-center">
            <select
              value={slot.day}
              onChange={(e) => handleChange(index, "day", e.target.value)}
              className="border p-2 rounded flex-1 w-28"
              required
            >
              <option value="">Select Day</option>
              {daysOfWeek.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>

            <input
              type="time"
              value={slot.startTime}
              onChange={(e) => handleChange(index, "startTime", e.target.value)}
              className="border p-1 rounded flex-1 w-32"
              required
            />

            <span className="text-gray-500">to</span>

            <input
              type="time"
              value={slot.endTime}
              onChange={(e) => handleChange(index, "endTime", e.target.value)}
              className="border p-1 rounded flex-1"
              required
            />

            <button
              type="button"
              onClick={() => handleRemoveSlot(index)}
              className="bg-red-500 text-white p-2 rounded hover:bg-red-600 w-8 h-8 flex items-center justify-center"
            >
              ×
            </button>
          </div>
        ))
      )}

      <div className="flex gap-3 mt-4">
        <button
          type="button"
          onClick={handleAddSlot}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition duration-200"
        >
           Add Slot
        </button>
        
        {availability.length > 0 && (
          <button
            type="button"
            onClick={handleSave}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200"
          >
             Save Availability
          </button>
        )}
      </div>
    </div>
  );
}

export default DoctorAvailabilityForm;