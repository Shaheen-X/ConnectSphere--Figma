import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react@0.487.0";
import { DayPicker } from "react-day-picker@8.10.1";
import { enUS } from "date-fns/locale";

import { cn } from "./utils";
import { buttonVariants } from "./button";

const calendarLocale = {
  ...enUS,
  options: {
    ...(enUS.options ?? {}),
    weekStartsOn: 1,
  },
};

function Calendar({
  className,
  classNames,
  components,
  showOutsideDays = true,
  showWeekNumber,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      {...props}
      locale={calendarLocale}
      showOutsideDays={showOutsideDays}
      showWeekNumber={showWeekNumber ?? true}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row gap-2",
        month: "flex flex-col gap-4",
        caption: "flex justify-center pt-1 relative items-center w-full",
        caption_label: "text-sm font-medium",
        nav: "flex items-center gap-1",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "size-7 bg-transparent p-0 opacity-50 hover:opacity-100",
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md flex-1 text-center text-[0.75rem] font-medium uppercase tracking-wide",
        row: "flex w-full",
        cell: "relative flex-1 p-0 text-center text-sm",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "size-8 w-full p-0 font-medium aria-selected:opacity-100",
        ),
        day_range_start:
          "day-range-start aria-selected:bg-primary aria-selected:text-primary-foreground",
        day_range_end:
          "day-range-end aria-selected:bg-primary aria-selected:text-primary-foreground",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground aria-selected:text-muted-foreground",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        weeknumber:
          "flex min-w-10 items-center justify-center text-[0.75rem] font-semibold uppercase tracking-wide text-muted-foreground",
        weeknumber_button:
          "w-full rounded-full text-[0.75rem] font-semibold text-muted-foreground",
        ...classNames,
      }}
      components={{
        IconLeft: ({ className: iconClassName, ...iconProps }) => (
          <ChevronLeft className={cn("size-4", iconClassName)} {...iconProps} />
        ),
        IconRight: ({ className: iconClassName, ...iconProps }) => (
          <ChevronRight className={cn("size-4", iconClassName)} {...iconProps} />
        ),
        ...components,
      }}
    />
  );
}

export { Calendar };
