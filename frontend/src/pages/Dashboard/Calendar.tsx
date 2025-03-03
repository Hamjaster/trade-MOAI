import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Calendar,
  CalendarCurrentDate,
  CalendarDayView,
  CalendarMonthView,
  CalendarNextTrigger,
  CalendarPrevTrigger,
  CalendarTodayTrigger,
  CalendarViewTrigger,
  CalendarWeekView,
  CalendarYearView,
} from "@/components/ui/full-calendar";
import { addDays, addHours } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import { getTradesSummary } from "@/store/tradeSlice";

export default function CalendarPage() {
  const { trades, tradesSummary } = useAppSelector((s) => s.trade);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getTradesSummary());
  }, []);

  return (
    <div className="space-y-8  flex flex-col overflow-y-auto">
      <h1 className="text-3xl font-bold">Profit & Loss Calendar</h1>
      <Calendar events={tradesSummary}>
        <div className=" flex flex-col">
          <div className="flex px-6 items-center w-full space-x-10 justify-between gap-2 mb-6">
            {/* <CalendarViewTrigger
              className="aria-[current=true]:bg-accent"
              view="day"
            >
              Day
            </CalendarViewTrigger>
            <CalendarViewTrigger
              view="week"
              className="aria-[current=true]:bg-accent"
            >
              Week
            </CalendarViewTrigger>
            <CalendarViewTrigger
              view="month"
              className="aria-[current=true]:bg-accent"
            >
              Month
            </CalendarViewTrigger>
            <CalendarViewTrigger
              view="year"
              className="aria-[current=true]:bg-accent"
            >
              Year
            </CalendarViewTrigger> */}

            <CalendarPrevTrigger>
              <ChevronLeft size={20} />
              <span className="sr-only">Previous</span>
            </CalendarPrevTrigger>

            <CalendarCurrentDate />

            <CalendarNextTrigger>
              <ChevronRight size={20} />
              <span className="sr-only">Next</span>
            </CalendarNextTrigger>

            {/* <CalendarTodayTrigger>Today</CalendarTodayTrigger> */}
          </div>

          <div className="flex-1 px-6">
            <CalendarMonthView />
            {/* <CalendarDayView />
            <CalendarWeekView />
            <CalendarYearView /> */}
          </div>
        </div>
      </Calendar>
    </div>
  );
}
