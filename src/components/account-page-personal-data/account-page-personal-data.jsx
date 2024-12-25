import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TextField } from '@mui/material';
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
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('');

  const [nameValid, setNameValid] = useState(true);
  const [surnameValid, setSurnameValid] = useState(true);
  const [patronymicValid, setPatronymicValid] = useState(true);

  const [nameError, setNameError] = useState(false);
  const [surnameError, setSurnameError] = useState(false);
  const [patronymicError, setPatronymicError] = useState(false);

  const normalizeValue = (value) =>
    value === null || value === undefined ? '' : value;

  useEffect(() => {
    setName(name.length ? name : normalizeValue(user.name));
    setSurname(surname.length ? surname : normalizeValue(user.surname));
    setPatronymic(
      patronymic.length ? patronymic : normalizeValue(user.patronymic)
    );
    setDateOfBirth(
      dateOfBirth.length ? dateOfBirth : normalizeValue(user.dateOfBirth)
    );
    setGender(gender.length ? gender : normalizeValue(user.gender));
    if (
      normalizeValue(user.name) !== name ||
      normalizeValue(user.surname) !== surname ||
      normalizeValue(user.patronymic) !== patronymic ||
      normalizeValue(user.dateOfBirth) !== dateOfBirth ||
      normalizeValue(user.gender) !== gender
    ) {
      setIsChanges(true);
    } else {
      setIsChanges(false);
    }
  }, [user, name, surname, patronymic, dateOfBirth, gender]);

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
    if (/^[а-яА-Яa-zA-Z_\s]{2,32}$/.test(e.target.value)) {
      setSurnameValid(true);
    } else {
      setSurnameValid(false);
    }
  };

  const onPatronymicChange = (e) => {
    patronymicError && setPatronymicError(false);
    setPatronymic(e.target.value);
    if (/^[а-яА-Яa-zA-Z_\s]{2,32}$/.test(e.target.value)) {
      setPatronymicValid(true);
    } else {
      setPatronymicValid(false);
    }
  };

  const onSaveButtonClick = () => {
    setSaveChangesClicked(true);
    if (nameValid && surnameValid && patronymicValid) {
      setDataSending(true);
      updatePersonalData({ name, surname, patronymic, dateOfBirth, gender })
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
              ? 'Minimum 2, maximum 32 alphabetic only characters'
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
              ? 'Minimum 2, maximum 32 alphabetic only characters'
              : ''
          }
          onChange={onPatronymicChange}
        />
      </div>
      <div className="account-page_user-info_personal-data_date-of-birth">
        <TextField
          label="Date of Birth"
          type="date"
          value={dateOfBirth}
          onChange={(e) => setDateOfBirth(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />
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
