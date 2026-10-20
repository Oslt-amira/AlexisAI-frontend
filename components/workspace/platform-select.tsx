"use client";

import {
  Children,
  isValidElement,
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type ReactNode,
  type SelectHTMLAttributes,
} from "react";
import { Check, ChevronDown } from "lucide-react";

type Props = SelectHTMLAttributes<HTMLSelectElement>;
type Option = { value: string; label: ReactNode; disabled?: boolean };
export default function PlatformSelect({
  value,
  defaultValue,
  children,
  onChange,
  className = "",
  id,
  name,
  disabled,
  required,
  ...props
}: Props) {
  const generated = useId();
  const [internal, setInternal] = useState(String(defaultValue ?? ""));
  const current = String(value ?? internal);
  const options: Option[] = Children.toArray(children)
    .filter(isValidElement)
    .map((child) => {
      const option = child.props as {
        value?: string | number;
        children?: ReactNode;
        disabled?: boolean;
      };
      return {
        value: String(option.value ?? option.children ?? ""),
        label: option.children,
        disabled: option.disabled,
      };
    });
  const selected = options.find((option) => option.value === current);
  const [open, setOpen] = useState(false);
  const [above, setAbove] = useState(false);
  const [availableHeight, setAvailableHeight] = useState(255);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    function dismiss(event: PointerEvent) {
      if (event.target instanceof Node && !root.current?.contains(event.target))
        setOpen(false);
    }
    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, []);
  function toggle() {
    const rect = trigger.current!.getBoundingClientRect();
    const container = trigger.current
      ?.closest(".modal,.library-move-form")
      ?.getBoundingClientRect();
    const below =
      (container
        ? Math.min(container.bottom, window.innerHeight)
        : window.innerHeight) -
      rect.bottom -
      12;
    const aboveSpace =
      rect.top - (container ? Math.max(container.top, 0) : 0) - 12;
    const opensAbove = below < 250 && aboveSpace > below;
    setAbove(opensAbove);
    setAvailableHeight(
      Math.max(100, Math.min(255, opensAbove ? aboveSpace : below)),
    );
    setOpen((v) => !v);
  }
  function choose(option: Option) {
    setInternal(option.value);
    onChange?.({
      target: { value: option.value },
      currentTarget: { value: option.value },
    } as ChangeEvent<HTMLSelectElement>);
    setOpen(false);
    trigger.current?.focus();
  }
  return (
    <div
      className={`platform-select ${className}`}
      ref={root}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.stopPropagation();
          setOpen(false);
          trigger.current?.focus();
        }
        if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
          event.preventDefault();
          if (!open) {
            toggle();
            return;
          }
          const items = Array.from(
            root.current!.querySelectorAll<HTMLButtonElement>(
              '[role="option"]:not(:disabled)',
            ),
          );
          const index = items.indexOf(
            document.activeElement as HTMLButtonElement,
          );
          items[
            event.key === "Home"
              ? 0
              : event.key === "End"
                ? items.length - 1
                : (index +
                    (event.key === "ArrowDown" ? 1 : -1) +
                    items.length) %
                  items.length
          ]?.focus();
        }
      }}
    >
      <button
        type="button"
        role="combobox"
        className="platform-select-trigger"
        ref={trigger}
        id={id || generated}
        disabled={disabled}
        aria-label={props["aria-label"]}
        aria-labelledby={props["aria-labelledby"]}
        aria-describedby={props["aria-describedby"]}
        aria-required={required}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${generated}-options`}
        onClick={toggle}
      >
        <span>{selected?.label ?? "Choose an option"}</span>
        <ChevronDown size={13} />
      </button>
      {name && <input type="hidden" name={name} value={current} />}{" "}
      {open && (
        <div
          className={`platform-options ${above ? "opens-above" : ""}`}
          style={{ maxHeight: availableHeight }}
          id={`${generated}-options`}
          role="listbox"
          aria-label={props["aria-label"] || "Options"}
        >
          {options.map((option, index) => (
            <button
              type="button"
              key={option.value + index}
              role="option"
              aria-selected={current === option.value}
              autoFocus={option.value === current || (!selected && index === 0)}
              disabled={option.disabled}
              onClick={() => choose(option)}
            >
              <span>{option.label}</span>
              {current === option.value && <Check size={14} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
