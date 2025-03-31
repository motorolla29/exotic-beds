import { useRef, useState } from 'react';
import './code-input.sass';

const CodeInput = ({ onComplete, error, onChange }) => {
  const inputRefs = useRef([]);
  const [values, setValues] = useState(Array(4).fill(''));

  const handleChange = (e, idx) => {
    const val = e.target.value;
    // Разрешаем ввод только одной цифры
    if (/^\d?$/.test(val)) {
      onChange();
      const newValues = [...values];
      newValues[idx] = val;
      setValues(newValues);
      // Если цифра введена, переходим к следующему полю
      if (val !== '' && idx < 3) {
        inputRefs.current[idx + 1].focus();
      }
      // Если все поля заполнены, вызываем onComplete
      if (newValues.every((digit) => digit !== '')) {
        onComplete(newValues.join(''));
      }
    }
  };

  const handleKeyDown = (e, idx) => {
    // При нажатии Backspace, если поле пустое — переходим к предыдущему полю
    if (e.key === 'Backspace' && values[idx] === '' && idx > 0) {
      inputRefs.current[idx - 1].focus();
    }
  };

  return (
    <div className="code-input-container">
      {values.map((value, idx) => (
        <input
          key={idx}
          type="text"
          value={value}
          onChange={(e) => handleChange(e, idx)}
          onKeyDown={(e) => handleKeyDown(e, idx)}
          maxLength="1"
          ref={(el) => (inputRefs.current[idx] = el)}
          className={`code-input ${error ? 'error' : ''}`}
        />
      ))}
      {error && (
        <div className="code-input-container_error">
          <span>Invalid code</span>
        </div>
      )}
    </div>
  );
};

export default CodeInput;
