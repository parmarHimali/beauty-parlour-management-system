import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import axios from "axios";
import { useContext } from "react";
import { UserContext } from "./../../context/UserContext";
import { Tooltip } from "react-tooltip";

const EmployeeCalendar = () => {
  const [appointments, setAppointments] = useState([]);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchCalendar = async () => {
      if (!user?._id) return;

      try {
        const { data } = await axios.get(
          `http://localhost:4000/api/employee/calendar/${user._id}`
        );

        console.log("Fetched Data:", data);

        if (data.success && data.events) {
          setAppointments(data.events);
        } else {
          console.warn("No events found");
        }
      } catch (error) {
        console.error(error?.response?.data?.message || "Error fetching data");
      }
    };

    fetchCalendar();
  }, [user?._id]);

  return (
    <div className="max-w-5xl mx-auto mt-8 p-6 bg-[#aee1e1] shadow-xl rounded-lg calendar">
      <h2 className="text-3xl font-semibold text-[#287171] mb-4 text-center heading">
        Appointments Calendar
      </h2>
      <div className="border rounded-lg shadow-md overflow-hidden p-4 bg-white">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
          initialView="timeGridWeek"
          events={appointments}
          eventContent={(eventInfo) => (
            <div className={`${eventInfo.event._def.extendedProps.status}`}>
              {console.log("event info", eventInfo)}
              <div
                id={`event-${eventInfo.event.id}`}
                className={`p-2 rounded-md shadow-md text-white event-box `}
                data-tooltip-id={`tooltip-${eventInfo.event.id}`}
              >
                <p>{eventInfo.event.title.split("-")[0]}</p>
              </div>
              <Tooltip
                id={`tooltip-${eventInfo.event.id}`}
                place="top"
                effect="solid"
              >
                <div className="p-2 text-sm">
                  <p>
                    <b>Service:</b> {eventInfo.event.extendedProps.service}
                  </p>
                  <p>
                    <b>Phone:</b> {eventInfo.event.extendedProps.phone}
                  </p>
                  <p>
                    <b>Status:</b> {eventInfo.event.extendedProps.status}
                  </p>
                </div>
              </Tooltip>
            </div>
          )}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          height="auto"
          slotMinTime="10:00:00"
          slotMaxTime="21:00:00"
          slotLabelInterval="01:00"
        />
      </div>
    </div>
  );
};

export default EmployeeCalendar;
