import { useRef } from "react";
import "./EditableIranPlate.css";

type Props = {
  value: {
    p1: string;   // 2 digits
    letter: string; // 1 persian letter
    p2: string;   // 3 digits
    iran: string; // 2 digits
  };
  onChange: (v: Props["value"]) => void;
};

export default function EditableIranPlate({ value, onChange }: Props) {
  const r1 = useRef<HTMLInputElement>(null);
  const r2 = useRef<HTMLInputElement>(null);
  const r3 = useRef<HTMLInputElement>(null);
  const r4 = useRef<HTMLInputElement>(null);

  const onlyNum = (v: string, len: number) =>
    v.replace(/\D/g, "").slice(0, len);

  const onlyFa = (v: string) =>
    v.replace(/[^آ-ی]/g, "").slice(0, 1);

  return (
    <div className="plate-wrapper">
      <div className="plate">

        {/* آبی ایران */}
        <div className="plate-blue">
          <div className="flag">
            <span className="g" />
            <span className="w" />
            <span className="r" />
          </div>
          <div className="ir">IR</div>
          <div className="iran">IRAN</div>
        </div>

        {/* ۲ رقم */}
        <input
          ref={r1}
          className="plate-input"
          value={value.p1}
          placeholder="00"
          onChange={(e) => {
            const v = onlyNum(e.target.value, 2);
            onChange({ ...value, p1: v });
            if (v.length === 2) r2.current?.focus();
          }}
        />

        {/* حرف */}
        <input
          ref={r2}
          className="plate-input plate-letter"
          value={value.letter}
          placeholder="ب"
          onChange={(e) => {
            const v = onlyFa(e.target.value);
            onChange({ ...value, letter: v });
            if (v) r3.current?.focus();
          }}
          onKeyDown={(e) => {
            if (e.key === "Backspace" && !value.letter)
              r1.current?.focus();
          }}
        />

        {/* ۳ رقم */}
        <input
          ref={r3}
          className="plate-input wide"
          value={value.p2}
          placeholder="000"
          onChange={(e) => {
            const v = onlyNum(e.target.value, 3);
            onChange({ ...value, p2: v });
            if (v.length === 3) r4.current?.focus();
          }}
          onKeyDown={(e) => {
            if (e.key === "Backspace" && !value.p2)
              r2.current?.focus();
          }}
        />

        {/* ایران */}
        <div className="plate-iran">
          <span>ایران</span>
          <input
            ref={r4}
            className="plate-input "
            value={value.iran}
            placeholder="00"
            onChange={(e) =>
              onChange({
                ...value,
                iran: onlyNum(e.target.value, 2),
              })
            }
            onKeyDown={(e) => {
              if (e.key === "Backspace" && !value.iran)
                r3.current?.focus();
            }}
          />
        </div>
      </div>
    </div>
  );
}