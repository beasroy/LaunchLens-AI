"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type CreatableComboboxProps = {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  suggestions: readonly string[];
  placeholder?: string;
  "aria-invalid"?: boolean;
};

export function CreatableCombobox({
  id,
  value,
  onChange,
  suggestions,
  placeholder,
  "aria-invalid": ariaInvalid,
}: CreatableComboboxProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  const trimmedValue = value.trim();

  const filteredSuggestions = useMemo(() => {
    const query = trimmedValue.toLowerCase();
    if (!query) return [...suggestions];
    return suggestions.filter((item) =>
      item.toLowerCase().includes(query)
    );
  }, [suggestions, trimmedValue]);

  const hasExactMatch = suggestions.some(
    (item) => item.toLowerCase() === trimmedValue.toLowerCase()
  );

  const showCreateOption = trimmedValue.length > 0 && !hasExactMatch;

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  function selectOption(next: string) {
    onChange(next);
    setOpen(false);
  }

  const showList =
    open && (filteredSuggestions.length > 0 || showCreateOption);

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <Input
          id={id}
          value={value}
          onChange={(event) => {
            onChange(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          aria-invalid={ariaInvalid}
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          role="combobox"
          autoComplete="off"
          className="pr-9"
        />
        <ChevronsUpDown className="pointer-events-none absolute top-1/2 right-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
      </div>

      {showList ? (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-50 mt-1 max-h-48 w-full overflow-auto rounded-lg border border-border bg-popover py-1 text-sm shadow-md"
        >
          {filteredSuggestions.map((item) => {
            const isSelected =
              item.toLowerCase() === trimmedValue.toLowerCase();

            return (
              <li key={item} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  className={cn(
                    "flex w-full items-center justify-between gap-2 px-3 py-2 text-left transition-colors hover:bg-muted",
                    isSelected && "bg-indigo-50/80 text-indigo-700"
                  )}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => selectOption(item)}
                >
                  <span>{item}</span>
                  {isSelected ? <Check className="size-4 shrink-0" /> : null}
                </button>
              </li>
            );
          })}

          {showCreateOption ? (
            <li role="presentation">
              <button
                type="button"
                role="option"
                aria-selected={false}
                className="flex w-full items-center px-3 py-2 text-left text-indigo-700 transition-colors hover:bg-muted"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => selectOption(trimmedValue)}
              >
                Use &ldquo;{trimmedValue}&rdquo;
              </button>
            </li>
          ) : null}
        </ul>
      ) : null}
    </div>
  );
}
