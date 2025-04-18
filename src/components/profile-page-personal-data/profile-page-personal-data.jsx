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
import { nullAndUndefinedToEmptyString, areDatesEqual } from '../../utils';
import useWindowSize from '../../hooks/use-window-size';

import './profile-page-personal-data.sass';

const ProfilePagePersonalData = () => {
  const dispatch = useDispatch();
  const [ww] = useWindowSize();
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

  useEffect(() => {
    setName(user.name ? user.name : name);
    setSurname(user.surname ? user.surname : surname);
    setPatronymic(user.patronymic ? user.patronymic : patronymic);
    setDateOfBirth(user.dateOfBirth ? dayjs(user.dateOfBirth) : null);
    setGender(user.gender ? user.gender : gender);
  }, [user.name, user.surname, user.patronymic, user.dateOfBirth, user.gender]);

  useEffect(() => {
    if (
      nullAndUndefinedToEmptyString(user.name) !== name ||
      nullAndUndefinedToEmptyString(user.surname) !== surname ||
      nullAndUndefinedToEmptyString(user.patronymic) !== patronymic ||
      !areDatesEqual(dateOfBirth, user.dateOfBirth) ||
      nullAndUndefinedToEmptyString(user.gender) !== gender
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
    if (newValue === null) {
      setDateValid(true);
      return;
    }
    if (!newValue || !newValue.isValid()) {
      setDateValid(false);
    } else {
      const currentYear = dayjs().year();
      const year = newValue.year();

      if (year > 1900 && year < currentYear) {
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
      const formattedDateOfBirth =
        dateOfBirth && dayjs(dateOfBirth).isValid()
          ? dayjs(dateOfBirth).format('YYYY-MM-DD')
          : null;
      updatePersonalData({
        name,
        surname,
        patronymic,
        dateOfBirth: formattedDateOfBirth,
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
    <div className="profile-page_user-info_personal-data">
      <h2>Personal data:</h2>
      <div className="profile-page_user-info_personal-data_full-name">
        <TextField
          className="profile-page_user-info_personal-data_full-name_field"
          label="Name"
          variant="outlined"
          size={ww > 480 ? 'normal' : 'small'}
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
          className="profile-page_user-info_personal-data_full-name_field"
          label="Surname"
          variant="outlined"
          size={ww > 480 ? 'normal' : 'small'}
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
          className="profile-page_user-info_personal-data_full-name_field"
          label="Patronymic"
          variant="outlined"
          size={ww > 480 ? 'normal' : 'small'}
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
      <div className="profile-page_user-info_personal-data_date-of-birth">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            className="profile-page_user-info_personal-data_date-of-birth_field"
            label="Date of Birth"
            variant="outlined"
            value={dateOfBirth}
            format="DD.MM.YYYY"
            onChange={onDateChange}
            slotProps={{
              textField: {
                size: ww > 480 ? 'normal' : 'small',
              },
            }}
            sx={{
              // Переопределяем стили Mui-error с высоким приоритетом, т.к тут не получается стандартное управление объектом ошибки
              '&.MuiFormControl-root .MuiFormLabel-root.MuiInputLabel-root': {
                color: saveChangesClicked && !dateValid ? '#d32f2f' : '',
              },
              '&.MuiFormControl-root .MuiInputBase-root.MuiOutlinedInput-root.MuiInputBase-formControl .MuiOutlinedInput-notchedOutline':
                {
                  borderColor:
                    saveChangesClicked && !dateValid ? '#d32f2f' : '',
                },
              '&.MuiFormControl-root .MuiFormLabel-root.MuiInputLabel-root.Mui-error':
                {
                  color:
                    saveChangesClicked && !dateValid
                      ? '#d32f2f'
                      : 'rgba(0, 0, 0, 0.6)',
                },
              '&.MuiFormControl-root .MuiInputBase-root.MuiOutlinedInput-root.MuiInputBase-formControl.Mui-error .MuiOutlinedInput-notchedOutline':
                {
                  borderColor:
                    saveChangesClicked && !dateValid
                      ? '#d32f2f'
                      : 'rgba(0, 0, 0, 0.23)',
                },
              '&.MuiFormControl-root .MuiFormLabel-root.MuiInputLabel-root.Mui-error.Mui-focused':
                {
                  color:
                    saveChangesClicked && !dateValid ? '#d32f2f' : '#004757',
                },
              '&.MuiFormControl-root .MuiInputBase-root.MuiOutlinedInput-root.MuiInputBase-formControl.Mui-error.Mui-focused .MuiOutlinedInput-notchedOutline':
                {
                  borderColor:
                    saveChangesClicked && !dateValid ? '#d32f2f' : '#004757',
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
      <div className="profile-page_user-info_personal-data_gender">
        <RadioGroup value={gender} onChange={(e) => setGender(e.target.value)}>
          <FormControlLabel value="male" control={<Radio />} label="Male" />
          <FormControlLabel value="female" control={<Radio />} label="Female" />
        </RadioGroup>
      </div>
      <button
        disabled={!isChanges || dataSending}
        onClick={onSaveButtonClick}
        className="profile-page_user-info_personal-data_save-button"
      >
        Save Changes
      </button>
    </div>
  );
};

export default ProfilePagePersonalData;
