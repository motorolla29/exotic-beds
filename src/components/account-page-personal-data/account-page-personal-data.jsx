import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { TextField } from '@mui/material';
import { Radio, RadioGroup, FormControlLabel } from '@mui/material';

import './account-page-personal-data.sass';

const AccountPagePersonalData = () => {
  const user = useSelector((state) => state.user);

  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [patronymic, setPatronymic] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('');

  useEffect(() => {
    if (user.name) {
      setName(user.name);
    }
  }, [user]);

  return (
    <div className="account-page_user-info_personal-data">
      <h2>Personal data:</h2>
      <div className="account-page_user-info_personal-data_full-name">
        <TextField
          className="account-page_user-info_personal-data_full-name_field"
          label="Name"
          variant="outlined"
          value={name}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          className="account-page_user-info_personal-data_full-name_field"
          label="Surname"
          variant="outlined"
          value={surname}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          className="account-page_user-info_personal-data_full-name_field"
          label="Patronymic"
          variant="outlined"
          value={patronymic}
          InputLabelProps={{ shrink: true }}
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
      <button className="account-page_user-info_personal-data_save-button">
        Save Changes
      </button>
    </div>
  );
};

export default AccountPagePersonalData;
