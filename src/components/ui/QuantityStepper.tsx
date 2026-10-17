import { MinusIcon, PlusIcon, TrashIcon } from "./icons";

type QuantityStepperProps = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  size?: "sm" | "md";
};

export function QuantityStepper({ value, onChange, min = 0, size = "md" }: QuantityStepperProps) {
  const buttonSize = size === "sm" ? "size-9" : "size-11";
  const showTrash = min === 0 && value === 1;

  return (
    <div className="inline-flex items-center rounded-full border border-line-strong bg-bg">
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        disabled={value <= min}
        className={`${buttonSize} grid place-items-center rounded-full text-lg text-fg transition hover:text-accent disabled:opacity-30`}
        aria-label={showTrash ? "Remover item" : "Diminuir quantidade"}
      >
        {showTrash ? <TrashIcon className="text-base" /> : <MinusIcon />}
      </button>
      <span className="min-w-7 text-center text-sm font-semibold tabular-nums" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        className={`${buttonSize} grid place-items-center rounded-full text-lg text-fg transition hover:text-accent`}
        aria-label="Aumentar quantidade"
      >
        <PlusIcon />
      </button>
    </div>
  );
}
