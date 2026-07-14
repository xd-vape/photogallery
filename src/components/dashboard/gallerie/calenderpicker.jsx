"use client";

import * as React from "react";
import { format, parseISO } from "date-fns";
import { de } from "date-fns/locale";
import { CalendarDays } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function CalenderPicker({ name, defaultValue = "" }) {
  const [date, setDate] = React.useState(() =>
    defaultValue ? parseISO(defaultValue) : undefined,
  );

  return (
    <>
      <input
        type="hidden"
        name={name}
        value={date ? format(date, "yyyy-MM-dd") : ""}
      />

      <Popover>
        <PopoverTrigger
          render={
            <Button
              type="button"
              variant="outline"
              data-empty={!date}
              className="
                input-field
                w-full
                justify-start
                gap-2
                px-3
                text-left
                font-normal
                data-[empty=true]:text-muted-foreground
              "
            />
          }
        >
          <CalendarDays className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />

          {date ? (
            format(date, "PPP", {
              locale: de,
            })
          ) : (
            <span>Datum auswählen</span>
          )}
        </PopoverTrigger>

        <PopoverContent align="start" className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            locale={de}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </>
  );
}
