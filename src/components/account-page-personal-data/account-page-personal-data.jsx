/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TextField } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Radio, RadioGroup, FormControlLabel } from '@mui/material';

import AccountBoxIcon from '@mui/icons-material/AccountBox';
import ErrorIcon from '@mui/icons-material/Error';

import { updatePersonalData } from '../../api/userAPI';
import { setNotificationModal, setSnackbar, setUser } from '../../store/action';

import './account-page-personal-data.sass';

const AccountPagePersonalData = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const [saveChangesClicked, setSaveChangesClicked] = useState(false);
  const [isChanges, setIsChanges] = useState(false);
  const [dataSending, setDataSending] = useState(false);

  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [patronymic, setPatronymic] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(null);
  const [gender, setGender] = useState('');

  const [nameValid, setNameValid] = useState(true);
  const [surnameValid, setSurnameValid] = useState(true);
  const [patronymicValid, setPatronymicValid] = useState(true);
  const [dateValid, setDateValid] = useState(true);

  const [nameError, setNameError] = useState(false);
  const [surnameError, setSurnameError] = useState(false);
  const [patronymicError, setPatronymicError] = useState(false);

  const normalizeValue = (value) =>
    value === null || value === undefined ? '' : value;

  useEffect(() => {
    setName(user.name ? user.name : name);
    setSurname(user.surname ? user.surname : surname);
    setPatronymic(user.patronymic ? user.patronymic : patronymic);
    setDateOfBirth(user.dateOfBirth ? dayjs(user.dateOfBirth) : null);
    setGender(user.gender ? user.gender : gender);
  }, [user.name, user.surname, user.patronymic, user.dateOfBirth, user.gender]);

  useEffect(() => {
    if (
      normalizeValue(user.name) !== name ||
      normalizeValue(user.surname) !== surname ||
      normalizeValue(user.patronymic) !== patronymic ||
      !dayjs(dateOfBirth).isSame(dayjs(user.dateOfBirth)) ||
      normalizeValue(user.gender) !== gender
    ) {
      setIsChanges(true);
    } else {
      setIsChanges(false);
    }
  }, [name, surname, patronymic, dateOfBirth, gender, saveChangesClicked]);

  const onNameChange = (e) => {
    nameError && setNameError(false);
    setName(e.target.value);
    if (/^[а-яА-Яa-zA-Z_\s]{2,32}$/.test(e.target.value)) {
      setNameValid(true);
    } else {
      setNameValid(false);
    }
  };

  const onSurnameChange = (e) => {
    surnameError && setSurnameError(false);
    setSurname(e.target.value);
    if (/^[а-яА-Яa-zA-Z_\s]{0,32}$/.test(e.target.value)) {
      setSurnameValid(true);
    } else {
      setSurnameValid(false);
    }
  };

  const onPatronymicChange = (e) => {
    patronymicError && setPatronymicError(false);
    setPatronymic(e.target.value);
    if (/^[а-яА-Яa-zA-Z_\s]{0,32}$/.test(e.target.value)) {
      setPatronymicValid(true);
    } else {
      setPatronymicValid(false);
    }
  };

  const onDateChange = (newValue) => {
    setDateOfBirth(newValue);
    if (!newValue || !newValue.isValid()) {
      setDateValid(false);
    } else {
      const currentYear = dayjs().year();
      const year = newValue.year();

      if (year >= 1900 && year <= currentYear) {
        setDateValid(true);
      } else {
        setDateValid(false);
      }
    }
  };

  const onSaveButtonClick = () => {
    setSaveChangesClicked(true);
    if (nameValid && surnameValid && patronymicValid && dateValid) {
      setDataSending(true);
      updatePersonalData({
        name,
        surname,
        patronymic,
        dateOfBirth: dayjs(dateOfBirth).format('YYYY-MM-DD'),
        gender,
      })
        .then((user) => {
          setSaveChangesClicked(false);
          dispatch(setUser(user));
          dispatch(
            setSnackbar({
              open: true,
              text: 'Personal data updated successfully',
              decorator: <AccountBoxIcon />,
            })
          );
        })
        .catch((err) =>
          dispatch(
            setNotificationModal({
              open: true,
              icon: <ErrorIcon />,
              title: err.response.data.message || err.message,
              description: 'Error updating personal data, try again later',
            })
          )
        )
        .finally(() => setDataSending(false));
    }
  };

  return (
    <div className="account-page_user-info_personal-data">
      <h2>Personal data:</h2>
      <div className="account-page_user-info_personal-data_full-name">
        <TextField
          className="account-page_user-info_personal-data_full-name_field"
          label="Name"
          variant="outlined"
          value={name}
          error={saveChangesClicked && !nameValid}
          helperText={
            saveChangesClicked && !nameValid
              ? 'Minimum 2, maximum 32 alphabetic only characters'
              : ''
          }
          onChange={onNameChange}
        />
        <TextField
          className="account-page_user-info_personal-data_full-name_field"
          label="Surname"
          variant="outlined"
          value={surname}
          error={saveChangesClicked && !surnameValid}
          helperText={
            saveChangesClicked && !surnameValid
              ? 'Maximum 32 alphabetic only characters'
              : ''
          }
          onChange={onSurnameChange}
        />
        <TextField
          className="account-page_user-info_personal-data_full-name_field"
          label="Patronymic"
          variant="outlined"
          value={patronymic}
          error={saveChangesClicked && !patronymicValid}
          helperText={
            saveChangesClicked && !patronymicValid
              ? 'Maximum 32 alphabetic only characters'
              : ''
          }
          onChange={onPatronymicChange}
        />
      </div>
      <div className="account-page_user-info_personal-data_date-of-birth">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            className="account-page_user-info_personal-data_date-of-birth_field"
            label="Date of Birth"
            variant="outlined"
            value={dateOfBirth}
            format="DD.MM.YYYY"
            onChange={onDateChange}
            sx={{
              // Переопределяем стили Mui-error с высоким приоритетом, т.к тут не получается стандартное управление объектом ошибки
              '&.MuiFormControl-root .MuiFormLabel-root.MuiInputLabel-root': {
                color: saveChangesClicked && !dateValid ? '#d32f2f' : 'inherit',
              },
              '&.MuiFormControl-root .MuiInputBase-root.MuiOutlinedInput-root.MuiInputBase-formControl .MuiOutlinedInput-notchedOutline':
                {
                  borderColor:
                    saveChangesClicked && !dateValid ? '#d32f2f' : 'inherit',
                },
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                slotProps={{
                  inputLabel: {
                    shrink: true,
                    inputMode: 'numeric',
                  },
                }}
              />
            )}
          />
        </LocalizationProvider>
      </div>
      <div className="account-page_user-info_personal-data_gender">
        <RadioGroup value={gender} onChange={(e) => setGender(e.target.value)}>
          <FormControlLabel value="male" control={<Radio />} label="Male" />
          <FormControlLabel value="female" control={<Radio />} label="Female" />
        </RadioGroup>
      </div>
      <button
        disabled={!isChanges || dataSending}
        onClick={onSaveButtonClick}
        className="account-page_user-info_personal-data_save-button"
      >
        Save Changes
      </button>
    </div>
  );
};

export default AccountPagePersonalData;
